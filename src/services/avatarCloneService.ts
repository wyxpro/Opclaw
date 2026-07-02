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
      const apiKey = import.meta.env.VITE_MODEL_SCOPE_API_KEY;
      if (!apiKey) {
        throw new Error('未找到 ModelScope API Key，请检查配置文件或 .env 文件');
      }

      // 构建提示词
      const stylePrompt = style === 'cartoon' 
        ? '3D卡通风格，可爱活泼，皮克斯动画风格' 
        : '真实人像风格，高清写实，照片级质感';
      
      const prompt = `基于上传图片中的人物特征，重绘为${stylePrompt}的人物形象，保持人物的面部核心特征不变，面带微笑，背景简洁干净`.trim();

      const baseUrl = '/api/modelscope';

      // 1. 提交异步任务
      console.log('Submitting image editing task to ModelScope...');
      const response = await fetch(`${baseUrl}/v1/images/generations`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'X-ModelScope-Async-Mode': 'true'
        },
        body: JSON.stringify({
          model: 'black-forest-labs/FLUX.2-klein-9B',
          prompt: prompt,
          image_url: [imageUrl]
        })
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        console.error('ModelScope API Submission Failed. Response:', errorText);
        let errorMsg = `API 提交任务失败: ${response.status}`;
        try {
          const errorData = JSON.parse(errorText);
          errorMsg = errorData.message || errorData.error?.message || errorMsg;
        } catch (_) {}
        throw new Error(errorMsg);
      }

      const submitResult = await response.json();
      const taskId = submitResult.task_id;
      if (!taskId) {
        throw new Error('提交任务成功，但未返回 task_id');
      }

      console.log(`Task submitted successfully. Task ID: ${taskId}. Starting polling...`);

      // 2. 轮询任务状态
      const maxRetries = 60; // 最多轮询 60 次 (约 5 分钟)
      const delay = 5000;   // 每次间隔 5 秒
      
      for (let i = 0; i < maxRetries; i++) {
        await new Promise(resolve => setTimeout(resolve, delay));
        
        console.log(`Polling task status... (${i + 1}/${maxRetries})`);
        
        const pollResponse = await fetch(`${baseUrl}/v1/tasks/${taskId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'X-ModelScope-Task-Type': 'image_generation'
          }
        });

        if (!pollResponse.ok) {
          console.warn(`Polling failed with status ${pollResponse.status}, retrying...`);
          continue;
        }

        const taskData = await pollResponse.json();
        const status = taskData.task_status;
        
        if (status === 'SUCCEED') {
          if (taskData.output_images && taskData.output_images.length > 0) {
            console.log('Task succeeded! Image URL:', taskData.output_images[0]);
            return { url: taskData.output_images[0] };
          } else {
            throw new Error('任务成功，但返回的图片列表为空');
          }
        } else if (status === 'FAILED') {
          throw new Error('ModelScope 图像生成任务失败');
        } else {
          // PENDING, RUNNING 等状态，继续轮询
          console.log(`Task status is current: ${status}`);
        }
      }

      throw new Error('任务超时，未能及时生成图像');
    } catch (err) {
      console.error('Error in avatarCloneService:', err);
      return { 
        url: '', 
        error: err instanceof Error ? err.message : '未知错误' 
      }
    }
  }
}
