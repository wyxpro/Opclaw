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
   * Transcribe audio blob using Silicon Flow API
   */
  async transcribe(audioBlob: Blob): Promise<string> {
    const apiKey = import.meta.env.VITE_SILICON_FLOW_API_KEY
    if (!apiKey) {
      throw new Error('Silicon Flow API Key not found')
    }

    const formData = new FormData()
    // Silicon Flow often prefers .wav or .mp3, but SenseVoiceSmall is quite flexible.
    // Webm is the default for most browsers' MediaRecorder.
    formData.append('file', audioBlob, 'record.webm')
    formData.append('model', 'FunAudioLLM/SenseVoiceSmall')

    try {
      const response = await fetch('https://api.siliconflow.cn/v1/audio/transcriptions', {
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
