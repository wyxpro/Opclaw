import type { StepChatOptions } from './types';

/**
 * Call the StepAudio-2.5-Chat API (via Step Plan) with Streaming support
 */
export async function streamStepChat(
  options: StepChatOptions,
  onChunk: (chunk: string) => void
): Promise<void> {
  const apiKey = import.meta.env.VITE_STEP_API_KEY;
  if (!apiKey) {
    throw new Error('StepFun API Key is not configured. Please check your .env file.');
  }

  const requestUrl = '/api/stepfun/step_plan/v1/chat/completions';

  const response = await fetch(requestUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: options.model || 'stepaudio-2.5-chat',
      messages: options.messages,
      stream: options.stream !== false,
      temperature: options.temperature ?? 0.7,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Chat API call failed (${response.status}): ${errorText}`);
  }

  if (options.stream === false) {
    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    onChunk(content);
    return;
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error('Response body has no reader.');
  }

  const decoder = new TextDecoder('utf-8');
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed === 'data: [DONE]') continue;

      if (trimmed.startsWith('data: ')) {
        try {
          const jsonStr = trimmed.slice(6);
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content || '';
          if (content) {
            onChunk(content);
          }
        } catch (e) {
          // Ignore json parse error for partial lines
        }
      }
    }
  }
}
