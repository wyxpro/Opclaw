// AI分身相关类型定义

export type CharacterStyle = 'cartoon' | 'realistic'

export type BackgroundType = 'office' | 'living-room' | 'outdoor' | 'custom' | string

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