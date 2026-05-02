// AI分身相关类型定义

export type CharacterStyle = 'cartoon' | 'realistic' | 'hidden'

export type BackgroundType = 'office' | 'living-room' | 'outdoor' | 'custom' | string

export type StepType = 'voice-clone' | 'avatar-clone' | 'chat'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
  attachments?: {
    type: 'image' | 'file'
    url: string
    name: string
  }[]
}

export interface BackgroundOption {
  id: BackgroundType
  name: string
  thumbnail: string
  description: string
}

export interface CharacterExpression {
  type: 'neutral' | 'happy' | 'thinking' | 'surprised' | 'listening' | 'sad' | 'excited'
  duration: number
  intensity?: number // 0-1, 表情强度
}

export interface RAGContext {
  relevantContent: string[]
  sourceModules: ('learning' | 'life' | 'entertainment')[]
  confidence: number
}

// 声音模型
export interface VoiceModel {
  id: string
  name: string
  audioUrl: string
  duration: number
  createdAt: number
  isCloned: boolean
}

// 形象模型
export interface AvatarModel {
  id: string
  name: string
  type: 'image' | 'video' | '3d'
  url: string
  style: CharacterStyle
  createdAt: number
  isCloned: boolean
  originalUrl?: string
}

// 数字人配置
export interface DigitalHumanConfig {
  voice: VoiceModel | null
  avatar: AvatarModel | null
  isComplete: boolean
}