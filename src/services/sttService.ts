import { useSentioAsrStore } from '../lib/sentioStore'

/**
 * Service to handle Speech-to-Text (STT) using Silicon Flow API (SenseVoiceSmall)
 */
export class STTService {
  private mediaRecorder: MediaRecorder | null = null
  private audioChunks: Blob[] = []

  /**
   * Start recording audio from the microphone
   */
  async startRecording(): Promise<void> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      this.mediaRecorder = new MediaRecorder(stream)
      this.audioChunks = []

      this.mediaRecorder.ondataavailable = (event) => {
        this.audioChunks.push(event.data)
      }

      this.mediaRecorder.start()
    } catch (error) {
      console.error('Failed to start recording:', error)
      throw error
    }
  }

  /**
   * Stop recording and get the transcribed text
   */
  async stopRecording(): Promise<string> {
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
