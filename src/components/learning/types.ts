export interface Article {
  id: string
  title: string
  excerpt: string
  content: string
  date: string
  tags: string[]
  readTime: string
  coverImage?: string
}

export interface ArticleWithMeta extends Article {
  categoryName: string
  seriesName: string
}

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
