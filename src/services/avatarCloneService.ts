import { supabase } from '../lib/supabase'
import type { CharacterStyle } from '../components/ai/types'

export interface CloneAvatarParams {
  imageUrl: string
  style: CharacterStyle
  gender?: string
}

export interface CloneAvatarResult {
  url: string
  error?: string
}

export const avatarCloneService = {
  /**
   * 基于上传的图片克隆数字人形象
   */
  async cloneAvatar({ imageUrl, style }: CloneAvatarParams): Promise<CloneAvatarResult> {
    try {
      // 调用 Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('clone-avatar', {
        body: { imageUrl, style }
      })

      if (error) {
        console.error('Avatar clone function error:', error)
        throw new Error(error.message || '克隆形象失败')
      }

      if (data.error) {
        throw new Error(data.error)
      }

      return { url: data.url }
    } catch (err) {
      console.error('Error in avatarCloneService:', err)
      return { 
        url: '', 
        error: err instanceof Error ? err.message : '未知错误' 
      }
    }
  }
}
