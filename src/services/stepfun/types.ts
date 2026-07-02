export interface StepTtsOptions {
  model?: string;
  input: string;
  instruction?: string;
  voice?: string;
  volume?: number;
  speed?: number;
}

export interface StepAsrOptions {
  model?: string;
  audioData: string; // Base64 string
  format?: 'wav' | 'mp3' | 'ogg' | 'pcm';
  rate?: number;
}

export interface StepChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface StepChatOptions {
  model?: string;
  messages: StepChatMessage[];
  temperature?: number;
  stream?: boolean;
}
