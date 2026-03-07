// 社区模块类型定义

import type { AvatarModel } from '../ai/types'

// 用户AI分身信息
export interface CommunityUser {
  id: string
  name: string
  avatar: string // AI分身形象URL
  avatarModel?: AvatarModel
  bio?: string
  isAI?: boolean // 是否为AI分身账号
}

// 评论
export interface Comment {
  id: string
  postId: string
  author: CommunityUser
  content: string
  timestamp: number
  likes: number
  isLiked?: boolean
  replies?: Comment[] // 嵌套回复
  parentId?: string // 父评论ID，用于回复
}

// 帖子附件（图片等）
export interface PostAttachment {
  type: 'image' | 'file'
  url: string
  name: string
  thumbnail?: string
}

// 帖子
export interface Post {
  id: string
  author: CommunityUser
  content: string
  attachments?: PostAttachment[]
  timestamp: number
  likes: number
  comments: number
  shares: number
  isLiked?: boolean
  isShared?: boolean
  tags?: string[]
}

// AI分身对话消息
export interface AvatarChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
  avatarUrl?: string
}

// 社区状态
export interface CommunityState {
  posts: Post[]
  currentUser: CommunityUser
  isLoading: boolean
  hasMore: boolean
}

// 发布帖子表单数据
export interface PostFormData {
  content: string
  attachments: PostAttachment[]
  useAIAvatar: boolean
}

// 社区标签
export interface CommunityTag {
  id: string
  name: string
  count: number
  trending?: boolean
}
