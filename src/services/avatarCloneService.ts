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

interface SiliconFlowResponse {
  data: Array<{ url: string }>
  error?: { message: string }
}

export const avatarCloneService = {
  /**
   * 基于上传的图片克隆数字人形象
   */
  async cloneAvatar({ imageUrl, style }: CloneAvatarParams): Promise<CloneAvatarResult> {
    try {
      // 构建提示词
      const stylePrompt = style === 'cartoon' 
        ? '3D卡通风格，可爱活泼，皮克斯动画风格' 
        : '真实人像风格，高清写实，照片级质感'
      
      const prompt = `
        基于上传图片中的人物特征，生成${stylePrompt}的人物形象，
        保持人物的核心面部特征，表情开心、微笑、积极乐观，
        背景简洁干净，人物居中，高清细节，8K分辨率
      `.trim()

      // 调用SiliconFlow Kwai-Kolors API
      const response = await fetch('https://api.siliconflow.cn/v1/images/generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SILICONFLOW_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'Kwai-Kolors/Kolors',
          prompt: prompt,
          image_size: '1024x1024',
          batch_size: 1,
          num_inference_steps: 20,
          guidance_scale: 7.5
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error?.message || `API请求失败: ${response.status}`)
      }

      const result: SiliconFlowResponse = await response.json()
      
      if (result.error) {
        throw new Error(result.error.message)
      }

      if (!result.data || result.data.length === 0) {
        throw new Error('未生成有效图像')
      }

      return { url: result.data[0].url }
    } catch (err) {
      console.error('Error in avatarCloneService:', err)
      return { 
        url: '', 
        error: err instanceof Error ? err.message : '未知错误' 
      }
    }
  }
}
