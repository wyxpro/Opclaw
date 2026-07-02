import type { StepAsrOptions } from './types';

/**
 * Utility to convert Blob to Base64 string
 */
export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      // Strip off the "data:audio/...;base64," prefix
      const base64 = result.substring(result.indexOf(',') + 1);
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Get Audio format from mime type
 */
export function getAudioFormat(mimeType: string): 'wav' | 'mp3' | 'ogg' | 'pcm' {
  if (mimeType.includes('wav')) return 'wav';
  if (mimeType.includes('mp3') || mimeType.includes('mpeg')) return 'mp3';
  if (mimeType.includes('ogg') || mimeType.includes('webm')) return 'ogg';
  return 'wav'; // Default fallback
}

/**
 * Transcribe audio blob to text using stepaudio-2.5-asr (SSE endpoint)
 */
export async function transcribeStepAudio(
  audioBlob: Blob,
  onProgress?: (text: string) => void
): Promise<string> {
  const apiKey = import.meta.env.VITE_STEP_API_KEY;
  if (!apiKey) {
    throw new Error('StepFun API Key is not configured. Please check your .env file.');
  }

  const base64Data = await blobToBase64(audioBlob);
  const format = getAudioFormat(audioBlob.type);

  // We route through the local proxy `/api/stepfun` to avoid CORS issues
  const requestUrl = '/api/stepfun/step_plan/v1/audio/asr/sse';

  const requestBody = {
    audio: {
      data: base64Data
    },
    'audio.input': {
      transcription: {
        model: 'stepaudio-2.5-asr',
        enable_itn: true
      },
      format: {
        type: format
      }
    }
  };

  const response = await fetch(requestUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`ASR API call failed (${response.status}): ${errorText}`);
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error('Failed to read the response body stream.');
  }

  const decoder = new TextDecoder('utf-8');
  let finalResult = '';
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      if (trimmed.startsWith('data: ')) {
        const dataStr = trimmed.slice(6).trim();
        if (dataStr === '[DONE]') continue;

        try {
          const parsed = JSON.parse(dataStr);
          // Standard ASR response might return the full text in a field
          // Depending on StepFun's response format:
          // Often it's {"text": "..."} or {"audio":{"input":{"transcription":{"text":"..."}}}}
          const transcribedText = parsed.text || 
                                  parsed.audio?.input?.transcription?.text || 
                                  parsed.choices?.[0]?.delta?.content || '';
          
          if (transcribedText) {
            finalResult = transcribedText;
            if (onProgress) {
              onProgress(finalResult);
            }
          }
        } catch (e) {
          // Ignore partial or unparseable JSON lines
        }
      }
    }
  }

  return finalResult;
}
