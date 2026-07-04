import { useSentioAsrStore } from '../lib/sentioStore'

/**
 * Service to handle Speech-to-Text (STT) using Silicon Flow API (SenseVoiceSmall)
 */
export class STTService {
  private mediaRecorder: MediaRecorder | null = null
  private audioChunks: Blob[] = []
  private audioContext: AudioContext | null = null
  private analyser: AnalyserNode | null = null
  private checkSilenceInterval: any = null
  private voiceDetected = false
  private silenceStartTime: number | null = null

  /**
   * Start recording audio from the microphone
   */
  async startRecording(onSilenceDetected?: () => void): Promise<void> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      this.mediaRecorder = new MediaRecorder(stream)
      this.audioChunks = []

      this.mediaRecorder.ondataavailable = (event) => {
        this.audioChunks.push(event.data)
      }

      this.mediaRecorder.start()

      if (onSilenceDetected) {
        this.setupVAD(stream, onSilenceDetected)
      }
    } catch (error) {
      console.error('Failed to start recording:', error)
      throw error
    }
  }

  private setupVAD(stream: MediaStream, onSilenceDetected: () => void) {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      if (!AudioCtx) return

      this.audioContext = new AudioCtx()
      const source = this.audioContext.createMediaStreamSource(stream)
      this.analyser = this.audioContext.createAnalyser()
      this.analyser.fftSize = 512
      source.connect(this.analyser)

      const bufferLength = this.analyser.fftSize
      const dataArray = new Float32Array(bufferLength)

      this.voiceDetected = false
      this.silenceStartTime = null

      const SILENCE_THRESHOLD = 0.012
      const SILENCE_DURATION = 1500 // 1.5 seconds

      const checkAudio = () => {
        if (!this.analyser || !this.mediaRecorder || this.mediaRecorder.state !== 'recording') {
          return
        }

        this.analyser.getFloatTimeDomainData(dataArray)

        let sum = 0
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i] * dataArray[i]
        }
        const rms = Math.sqrt(sum / bufferLength)

        if (rms > SILENCE_THRESHOLD) {
          if (!this.voiceDetected) {
            console.log('Voice activity detected: RMS =', rms)
            this.voiceDetected = true
          }
          this.silenceStartTime = null
        } else if (this.voiceDetected) {
          if (!this.silenceStartTime) {
            this.silenceStartTime = Date.now()
          } else {
            const silenceDuration = Date.now() - this.silenceStartTime
            if (silenceDuration > SILENCE_DURATION) {
              console.log('Silence duration met. Auto-stopping...')
              this.cleanupVAD()
              onSilenceDetected()
              return
            }
          }
        }

        this.checkSilenceInterval = requestAnimationFrame(checkAudio)
      }

      this.checkSilenceInterval = requestAnimationFrame(checkAudio)
    } catch (e) {
      console.error('Failed to setup VAD:', e)
    }
  }

  private cleanupVAD() {
    if (this.checkSilenceInterval) {
      cancelAnimationFrame(this.checkSilenceInterval)
      this.checkSilenceInterval = null
    }
    if (this.audioContext) {
      this.audioContext.close().catch(console.error)
      this.audioContext = null
    }
    this.analyser = null
    this.voiceDetected = false
    this.silenceStartTime = null
  }

  /**
   * Stop recording and get the transcribed text
   */
  async stopRecording(): Promise<string> {
    this.cleanupVAD()
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        return reject('No media recorder found')
      }

      this.mediaRecorder.onstop = async () => {
        try {
          const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' })
          const transcription = await this.transcribe(audioBlob)
          
          // Stop all tracks to release the microphone
          this.mediaRecorder?.stream.getTracks().forEach(track => track.stop())
          
          resolve(transcription)
        } catch (error) {
          reject(error)
        }
      }

      this.mediaRecorder.stop()
    })
  }

  /**
   * Transcribe audio blob using Silicon Flow API or Third Party configurations
   */
  async transcribe(audioBlob: Blob): Promise<string> {
    const asrStore = useSentioAsrStore.getState()
    
    let apiKey = import.meta.env.VITE_SILICON_FLOW_API_KEY
    let baseUrl = 'https://api.siliconflow.cn/v1'
    let model = 'FunAudioLLM/SenseVoiceSmall'

    const customBaseUrl = asrStore.settings?.base_url
    const isUrlValid = typeof customBaseUrl === 'string' && (customBaseUrl.startsWith('http://') || customBaseUrl.startsWith('https://'))

    if (asrStore.settings?.api_key && isUrlValid) {
      apiKey = asrStore.settings.api_key
      baseUrl = asrStore.settings.base_url
      model = asrStore.settings.model || 'whisper-1'
    } else if (asrStore.enable && asrStore.engine !== 'default') {
      if (asrStore.engine === 'whisper-1') {
        model = 'whisper-1'
      } else {
        model = asrStore.engine
      }
    }

    if (!apiKey) {
      throw new Error('ASR API Key not found')
    }

    const formData = new FormData()
    formData.append('file', audioBlob, 'record.webm')
    formData.append('model', model)

    let requestUrl = baseUrl
    if (!requestUrl.endsWith('/audio/transcriptions')) {
      requestUrl = requestUrl.replace(/\/$/, '') + '/audio/transcriptions'
    }

    try {
      const response = await fetch(requestUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
        body: formData,
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(`Transcription failed: ${JSON.stringify(err)}`)
      }

      const data = await response.json()
      return data.text || ''
    } catch (error) {
      console.error('Transcription error:', error)
      throw error
    }
  }
}

export const sttService = new STTService()
