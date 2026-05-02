export type CardTheme = 'blue' | 'purple' | 'green' | 'orange' | 'pink' | 'dark'

export type DigitalCard = {
  id: string
  title: string
  subtitle: string
  name: string
  title_en: string
  bio: string
  avatar: string
  skills: { name: string; level: number; category: string }[]
  stats: { label: string; value: string }[]
  projects: { title: string; description: string; tags: string[]; icon: string; gradient: string }[]
  socialLinks: { platform: string; username: string }[]
  milestones: { date: string; title: string; icon: string }[]
  theme: CardTheme
  createdAt: number
  updatedAt: number
}

export type CardHistory = {
  id: string
  cardId: string
  previewImage?: string
  createdAt: number
}
