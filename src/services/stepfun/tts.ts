import type { StepTtsOptions } from './types';

export const PRESET_VOICES = [
  { id: 'linjiajiejie', name: '邻家姐姐 (温柔女声)', gender: 'female' },
  { id: 'qingchunshaonv', name: '青春少女 (活力女声)', gender: 'female' },
  { id: 'wenrounansheng', name: '温柔男生 (亲切男声)', gender: 'male' },
  { id: 'cixingnansheng', name: '磁性男生 (成熟男声)', gender: 'male' },
  { id: 'default', name: '系统默认', gender: 'neutral' }
];

/**
 * Generate speech audio Blob from text using stepaudio-2.5-tts
 */
export async function generateStepSpeech(options: StepTtsOptions): Promise<Blob> {
  const apiKey = import.meta.env.VITE_STEP_API_KEY;
  if (!apiKey) {
    throw new Error('StepFun API Key is not configured. Please check your .env file.');
  }

  const requestUrl = '/api/stepfun/step_plan/v1/audio/speech';

  // Build payload
  const payload: any = {
    model: options.model || 'stepaudio-2.5-tts',
    input: options.input,
    voice: options.voice || 'default'
  };

  // Add global instruction if provided
  if (options.instruction) {
    payload.instruction = options.instruction;
  }

  const response = await fetch(requestUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`TTS API call failed (${response.status}): ${errorText}`);
  }

  return await response.blob();
}
