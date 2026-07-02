/**
 * StepAudio 2.5 Realtime WebSocket Client
 */

export interface RealtimeClientCallbacks {
  onOpen?: () => void;
  onClose?: (event: CloseEvent) => void;
  onError?: (error: Event) => void;
  onTextDelta?: (text: string) => void; // Final text transcribing/answering stream
  onAudioStart?: () => void; // AI starts speaking
  onAudioEnd?: () => void; // AI finishes speaking
  onStatusChange?: (status: 'disconnected' | 'connecting' | 'connected' | 'recording' | 'thinking' | 'speaking') => void;
}

export class StepAudioRealtimeClient {
  private ws: WebSocket | null = null;
  private audioContext: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private audioInputNode: ScriptProcessorNode | null = null;
  private sourceNode: MediaStreamAudioSourceNode | null = null;
  private callbacks: RealtimeClientCallbacks = {};
  
  // Audio playback queue
  private nextPlayTime: number = 0;
  private audioQueue: AudioBufferSourceNode[] = [];
  private sampleRate: number = 24000; // StepAudio default output sample rate
  
  private status: 'disconnected' | 'connecting' | 'connected' | 'recording' | 'thinking' | 'speaking' = 'disconnected';

  constructor(callbacks: RealtimeClientCallbacks) {
    this.callbacks = callbacks;
  }

  private setStatus(newStatus: typeof this.status) {
    this.status = newStatus;
    if (this.callbacks.onStatusChange) {
      this.callbacks.onStatusChange(newStatus);
    }
  }

  /**
   * Connect to the WebSocket endpoint
   */
  async connect(options: { voice?: string; instructions?: string } = {}) {
    if (this.ws) {
      this.disconnect();
    }

    const apiKey = import.meta.env.VITE_STEP_API_KEY;
    if (!apiKey) {
      throw new Error('StepFun API Key is not configured. Please check your .env file.');
    }

    this.setStatus('connecting');

    // WebSocket URL using Step Plan path
    const wsUrl = `wss://api.stepfun.com/step_plan/v1/realtime?model=stepaudio-2.5-realtime&api_key=${apiKey}`;

    try {
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        this.setStatus('connected');
        if (this.callbacks.onOpen) {
          this.callbacks.onOpen();
        }

        // Send initial session update
        this.sendSessionUpdate(options.voice || 'linjiajiejie', options.instructions);
      };

      this.ws.onclose = (event) => {
        this.setStatus('disconnected');
        this.cleanupAudio();
        if (this.callbacks.onClose) {
          this.callbacks.onClose(event);
        }
      };

      this.ws.onerror = (error) => {
        this.setStatus('disconnected');
        if (this.callbacks.onError) {
          this.callbacks.onError(error);
        }
      };

      this.ws.onmessage = (event) => {
        this.handleMessage(event);
      };

      // Initialize Audio Context for playback
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: this.sampleRate
      });
      this.nextPlayTime = this.audioContext.currentTime;

    } catch (e) {
      this.setStatus('disconnected');
      throw e;
    }
  }

  /**
   * Send session configuration
   */
  private sendSessionUpdate(voice: string, instructions?: string) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

    const sessionUpdate = {
      event_id: `event_${Date.now()}`,
      type: 'session.update',
      session: {
        modalities: ['text', 'audio'],
        instructions: instructions || '你是一个非常友好的AI语音助手。请用生动、简练的口吻与用户进行语音对话。',
        voice: voice,
        input_audio_format: 'pcm16',
        output_audio_format: 'pcm16',
        turn_detection: {
          type: 'server_vad' // Enable Server Voice Activity Detection
        }
      }
    };

    this.ws.send(JSON.stringify(sessionUpdate));
  }

  /**
   * Start recording user voice and streaming PCM16 chunks to the server
   */
  async startRecording() {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket is not connected');
    }

    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000, // Request 16kHz input
          echoCancellation: true,
          noiseSuppression: true
        }
      });

      // Stop any active AI speech before user speaks
      this.stopSpeaking();

      const context = new (window.AudioContext || (window as any).webkitAudioContext)();
      const source = context.createMediaStreamSource(this.mediaStream);
      
      // ScriptProcessorNode to process raw audio buffers (4096 buffer size)
      const processor = context.createScriptProcessor(4096, 1, 1);
      
      source.connect(processor);
      processor.connect(context.destination);

      this.sourceNode = source;
      this.audioInputNode = processor;
      
      processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        
        // Downsample or convert Float32 [-1, 1] to PCM16 (Int16Array)
        const pcm16Buffer = new Int16Array(inputData.length);
        for (let i = 0; i < inputData.length; i++) {
          const s = Math.max(-1, Math.min(1, inputData[i]));
          pcm16Buffer[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
        }

        // Convert PCM16 buffer to Base64
        const base64Audio = this.arrayBufferToBase64(pcm16Buffer.buffer);
        
        // Send chunk to server
        this.sendAudioChunk(base64Audio);
      };

      this.setStatus('recording');

    } catch (e) {
      console.error('Error starting microphone recording:', e);
      throw e;
    }
  }

  /**
   * Stop recording
   */
  stopRecording() {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }

    if (this.audioInputNode) {
      this.audioInputNode.disconnect();
      this.audioInputNode = null;
    }

    if (this.sourceNode) {
      this.sourceNode.disconnect();
      this.sourceNode = null;
    }

    if (this.status === 'recording') {
      this.setStatus('thinking');
      // Commit audio buffer and trigger response creation
      this.commitAudio();
    }
  }

  private sendAudioChunk(base64Data: string) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

    this.ws.send(JSON.stringify({
      type: 'input_audio_buffer.append',
      audio: base64Data
    }));
  }

  private commitAudio() {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

    this.ws.send(JSON.stringify({
      type: 'input_audio_buffer.commit'
    }));

    this.ws.send(JSON.stringify({
      type: 'response.create'
    }));
  }

  /**
   * Interrupt AI playback
   */
  stopSpeaking() {
    this.audioQueue.forEach(source => {
      try { source.stop(); } catch (e) {}
    });
    this.audioQueue = [];
    if (this.audioContext) {
      this.nextPlayTime = this.audioContext.currentTime;
    }
    if (this.callbacks.onAudioEnd) {
      this.callbacks.onAudioEnd();
    }
  }

  /**
   * Handle incoming messages from the WebSocket server
   */
  private handleMessage(event: MessageEvent) {
    try {
      const msg = JSON.parse(event.data);

      switch (msg.type) {
        case 'response.audio_transcript.delta':
          if (this.callbacks.onTextDelta) {
            this.callbacks.onTextDelta(msg.delta);
          }
          break;

        case 'response.audio.delta':
          // We got real-time audio PCM16 base64 delta
          if (this.status !== 'speaking') {
            this.setStatus('speaking');
            if (this.callbacks.onAudioStart) {
              this.callbacks.onAudioStart();
            }
          }
          this.playAudioChunk(msg.delta);
          break;

        case 'response.done':
          // Response generation is complete
          if (this.status === 'speaking' || this.status === 'thinking') {
            this.setStatus('connected');
          }
          break;
          
        case 'error':
          console.error('Realtime API error:', msg.error);
          break;
      }
    } catch (e) {
      console.error('Failed to parse WebSocket message:', e);
    }
  }

  /**
   * Play base64 encoded PCM16 audio chunk
   */
  private playAudioChunk(base64Data: string) {
    if (!this.audioContext) return;

    try {
      const arrayBuffer = this.base64ToArrayBuffer(base64Data);
      const int16Array = new Int16Array(arrayBuffer);
      const float32Array = new Float32Array(int16Array.length);

      // Convert PCM16 values to Float32 [-1, 1]
      for (let i = 0; i < int16Array.length; i++) {
        float32Array[i] = int16Array[i] / 32768.0;
      }

      // Create Audio Buffer
      const audioBuffer = this.audioContext.createBuffer(1, float32Array.length, this.sampleRate);
      audioBuffer.getChannelData(0).set(float32Array);

      // Create Buffer Source
      const source = this.audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.audioContext.destination);

      // Schedule playback
      const playTime = Math.max(this.audioContext.currentTime, this.nextPlayTime);
      source.start(playTime);
      
      // Update next playback timestamp
      this.nextPlayTime = playTime + audioBuffer.duration;
      
      this.audioQueue.push(source);

      source.onended = () => {
        this.audioQueue = this.audioQueue.filter(s => s !== source);
        if (this.audioQueue.length === 0 && this.status === 'speaking') {
          this.setStatus('connected');
          if (this.callbacks.onAudioEnd) {
            this.callbacks.onAudioEnd();
          }
        }
      };

    } catch (e) {
      console.error('Playback error:', e);
    }
  }

  /**
   * Helper functions
   */
  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  private cleanupAudio() {
    this.stopSpeaking();
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }
    this.audioContext = null;
  }

  disconnect() {
    this.cleanupAudio();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.setStatus('disconnected');
  }
}
