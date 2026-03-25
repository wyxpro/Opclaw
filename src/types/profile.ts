// 个人主页数据类型定义

// 社交媒体平台类型
export type SocialPlatform = 
  | 'github' 
  | 'twitter' 
  | 'linkedin' 
  | 'weibo' 
  | 'bilibili' 
  | 'zhihu' 
  | 'douyin'
  | 'wechat'
  | 'email'
  | 'website'

// 社交媒体链接
export interface SocialLink {
  platform: SocialPlatform
  url: string
  username: string
  followerCount?: number
  displayName: string
}

// 成就/荣誉
export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  date: string
  color?: string
}

// 个人资料
export interface PersonalProfile {
  name: string
  title: string
  bio: string
  avatar: string
  coverImage?: string
  location: string
  email: string
  phone?: string
  website?: string
  socialLinks: SocialLink[]
  achievements: Achievement[]
  stats: {
    yearsOfExperience: number
    projectsCompleted: number
    happyClients: number
    awards: number
  }
}

// 项目作品分类
export type PortfolioCategory = 'web' | 'mobile' | 'design' | 'article' | 'video' | 'ai' | 'other'

// 项目作品
export interface PortfolioItem {
  id: string
  title: string
  description: string
  category: PortfolioCategory
  thumbnail: string
  images?: string[]
  link?: string
  github?: string
  tags: string[]
  date: string
  featured?: boolean
}

// 技能
export interface Skill {
  id: string
  name: string
  level: number // 0-100
  category: string
  icon?: string
  color?: string
}

// 技能分类
export interface SkillCategory {
  id: string
  name: string
  icon: string
  color: string
  skills: Skill[]
}

// 功能模块入口
export interface ModuleEntry {
  id: string
  title: string
  description: string
  icon: string
  path: string
  color: string
  gradient: string
  features: string[]
}

// 统计数据
export interface ProfileStats {
  label: string
  value: number | string
  suffix?: string
  icon: string
  color: string
}
