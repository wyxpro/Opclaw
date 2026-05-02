import type { VoiceModel } from '../components/ai/types'

/**
 * Service to handle Text-to-Speech (TTS) using Silicon Flow API
 */

export class TTSService {
  private audio: HTMLAudioElement | null = null
  private isPlaying: boolean = false

  /**
   * Convert text to speech and play it
   */
  async speak(text: string, voiceModel?: VoiceModel | null, onStart?: () => void, onEnd?: () => void): Promise<void> {
    const apiKey = import.meta.env.VITE_SILICON_FLOW_API_KEY
    if (!apiKey) {
      console.error('Silicon Flow API Key not found')
      return
    }

    // Stop any current playback
    this.stop()

    try {
      // Filter out emojis and special characters for better TTS quality
      const cleanText = text.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '').trim()
      if (!cleanText) return

      const requestBody: any = {
        model: 'fnlp/MOSS-TTSD-v0.5',
        input: cleanText,
        response_format: 'mp3',
        stream: false,
        speed: 1.1
      }

      // 如果有克隆声音特征，使用 zero-shot 克隆
      if (voiceModel?.isCloned && voiceModel.base64Audio) {
        requestBody.references = [
          {
            audio: voiceModel.base64Audio.startsWith('data:') 
              ? voiceModel.base64Audio 
              : `data:audio/wav;base64,${voiceModel.base64Audio}`,
            text: voiceModel.referenceText || '你好，很高兴认识你！'
          }
        ]
        // 克隆时也建议使用角色标记
        if (!requestBody.input.startsWith('[')) {
          requestBody.input = `[S2]${requestBody.input}`
        }
      } else {
        // 使用预设音色
        requestBody.voice = voiceModel?.id || 'fnlp/MOSS-TTSD-v0.5:anna'
        // MOSS-TTSD 通常需要角色标记，如 [S1] 或 [S2]
        if (!requestBody.input.startsWith('[')) {
          requestBody.input = `[S2]${requestBody.input}`
        }
      }


      const response = await fetch('https://api.siliconflow.cn/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      })


      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(`TTS request failed: ${response.status} ${JSON.stringify(errorData)}`)
      }

      const audioBlob = await response.blob()
      const audioUrl = URL.createObjectURL(audioBlob)
      
      this.audio = new Audio(audioUrl)
      this.isPlaying = true
      if (onStart) onStart()

      this.audio.onended = () => {
        this.isPlaying = false
        if (onEnd) onEnd()
        URL.revokeObjectURL(audioUrl)
      }

      this.audio.onerror = () => {
        this.isPlaying = false
        if (onEnd) onEnd()
      }

      await this.audio.play()
    } catch (error) {
      console.error('TTS Error:', error)
      this.isPlaying = false
      if (onEnd) onEnd()
    }
  }

  /**
   * Stop current playback
   */
  stop(): void {
    if (this.audio) {
      this.audio.pause()
      this.audio.currentTime = 0
      this.audio.onended = null
      this.audio.onerror = null
      this.audio = null
      this.isPlaying = false
    }
  }

  /**
   * Check if audio is currently playing
   */
  isCurrentlyPlaying(): boolean {
    return this.isPlaying
  }
}

export const ttsService = new TTSService()
