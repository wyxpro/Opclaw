import type { VoiceModel } from '../components/ai/types'
import { Live2dManager } from '../lib/live2d/live2dManager'
import { convertMp3ArrayBufferToWavArrayBuffer } from '../lib/audioUtils'
import { useSentioTtsStore } from '../lib/sentioStore'

/**
 * Service to handle Text-to-Speech (TTS) using Silicon Flow API
 */

export class TTSService {
  private audio: HTMLAudioElement | null = null
  private isPlaying: boolean = false
  private live2dAudioInterval: any = null

  /**
   * Convert text to speech and play it
   */
  async speak(
    text: string, 
    voiceModel?: VoiceModel | null, 
    onStart?: () => void, 
    onEnd?: () => void,
    isLive2dActive?: boolean
  ): Promise<void> {
    const ttsStore = useSentioTtsStore.getState()
    
    let apiKey = import.meta.env.VITE_SILICON_FLOW_API_KEY || import.meta.env.VITE_SILICONFLOW_API_KEY
    let baseUrl = 'https://api.siliconflow.cn/v1'
    let model = 'fnlp/MOSS-TTSD-v0.5'

    const customBaseUrl = ttsStore.settings?.base_url
    const isUrlValid = typeof customBaseUrl === 'string' && (customBaseUrl.startsWith('http://') || customBaseUrl.startsWith('https://'))

    if (ttsStore.settings?.api_key && isUrlValid) {
      apiKey = ttsStore.settings.api_key
      baseUrl = ttsStore.settings.base_url
      model = ttsStore.settings.model || 'fnlp/MOSS-TTSD-v0.5'
    } else if (ttsStore.enable && ttsStore.engine !== 'default') {
      model = ttsStore.engine
    }

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
        model: model,
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


      let requestUrl = baseUrl
      if (!requestUrl.endsWith('/audio/speech')) {
        requestUrl = requestUrl.replace(/\/$/, '') + '/audio/speech'
      }

      const response = await fetch(requestUrl, {
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

      if (isLive2dActive) {
        // =============== LIVE2D 口型同步核心适配 ===============
        const mp3ArrayBuffer = await audioBlob.arrayBuffer();
        // 1. 将 MP3 转为 WAV PCM 格式以进行振幅解析
        const wavArrayBuffer = await convertMp3ArrayBufferToWavArrayBuffer(mp3ArrayBuffer);
        
        // 2. 将音频载入 Live2D 口型队列
        Live2dManager.getInstance().pushAudioQueue(wavArrayBuffer);
        
        this.isPlaying = true;
        if (onStart) onStart();

        // 3. 定时检测 Live2D 播放器状态以模拟 onEnd 事件
        this.live2dAudioInterval = setInterval(() => {
          if (!Live2dManager.getInstance().isAudioPlaying()) {
            clearInterval(this.live2dAudioInterval);
            this.isPlaying = false;
            if (onEnd) onEnd();
          }
        }, 150);

      } else {
        // =============== 标准多媒体播放路径 ===============
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
      }
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
    // 停止 Live2D 音频播放
    Live2dManager.getInstance().stopAudio();
    if (this.live2dAudioInterval) {
      clearInterval(this.live2dAudioInterval);
      this.live2dAudioInterval = null;
    }

    if (this.audio) {
      this.audio.pause()
      this.audio.currentTime = 0
      this.audio.onended = null
      this.audio.onerror = null
      this.audio = null
    }
    this.isPlaying = false
  }

  /**
   * Check if audio is currently playing
   */
  isCurrentlyPlaying(): boolean {
    return this.isPlaying
  }
}

export const ttsService = new TTSService()
