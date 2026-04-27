import { 
  learningCategories, 
  loveTimeline, 
  socialPosts, 
  travelLocations,
  personalInfo,
} from '../data/mock'
import { skillCategories } from '../data/skillTree'

// Work Assistant Data (extracted from Work.tsx common patterns)
const workData = {
  contents: [
    { id: '1', title: 'AI 工具深度使用指南', type: 'article', description: '详细介绍常用 AI 工具的使用方法和技巧分享，适合小白入门', tags: ['AI', '工具', '教程'], platform: 'wechat', createdAt: '2024-01-15' },
    { id: '2', title: '独立开发者如何变现', type: 'article', description: '关于个人开发产品如何找到第一批用户并实现盈利的思考', tags: ['变现', '开发', '成长'], platform: 'wechat', createdAt: '2024-01-12' },
    { id: '3', title: '互联网早报速读', type: 'article', description: '一分钟带你了解今天互联网圈发生的大小事', tags: ['早报', '资讯', '互联网'], platform: 'weibo', createdAt: '2024-01-16' },
    { id: '7', title: '产品设计思路大解密', type: 'video', description: '从用户需求出发，3步教你如何打造爆款产品逻辑', tags: ['设计', '产品', '思维'], platform: 'douyin', createdAt: '2024-01-10' },
  ],
  products: [
    { id: '1', name: '无线蓝牙耳机 降噪高音质', price: 299, sales: 1234, stock: 568, category: '数码配件' },
    { id: '2', name: '智能手表 运动健康监测', price: 899, sales: 856, stock: 234, category: '智能穿戴' },
  ],
  orders: [
    { id: 'DD20240115001', productName: '无线蓝牙耳机 降噪高音质', customer: '张三', status: 'completed', date: '2024-01-15' },
    { id: 'DD20240115002', productName: '智能手表 运动健康监测', customer: '李四', status: 'pending', date: '2024-01-15' },
  ]
}

export interface RAGItem {
  id: string
  module: 'learning' | 'life' | 'work'
  title: string
  content: string
  tags: string[]
  metadata: any
}

export class RAGEngine {
  private items: RAGItem[] = []

  constructor() {
    this.indexData()
  }

  private indexData() {
    // 1. Index Learning Space
    learningCategories.forEach(cat => {
      cat.series.forEach(s => {
        s.articles.forEach(art => {
          this.items.push({
            id: art.id,
            module: 'learning',
            title: art.title,
            content: `${art.excerpt}\n${art.content}`,
            tags: art.tags,
            metadata: { category: cat.name, series: s.name, date: art.date }
          })
        })
      })
    })

    skillCategories.forEach(cat => {
      cat.skills.forEach(skill => {
        this.items.push({
          id: skill.id,
          module: 'learning',
          title: skill.name,
          content: skill.description,
          tags: [cat.name],
          metadata: { type: 'skill', level: skill.level }
        })
      })
    })

    // 2. Index Life Record
    loveTimeline.forEach(item => {
      this.items.push({
        id: item.id,
        module: 'life',
        title: item.title,
        content: item.description,
        tags: ['恋爱', '纪念'],
        metadata: { date: item.date, emoji: item.emoji }
      })
    })

    socialPosts.forEach(post => {
      this.items.push({
        id: post.id,
        module: 'life',
        title: `动态: ${post.date}`,
        content: post.content,
        tags: ['朋友圈', '动态', post.location || ''],
        metadata: { author: post.author, likes: post.likes, date: post.date }
      })
    })

    travelLocations.forEach(loc => {
      this.items.push({
        id: loc.id,
        module: 'life',
        title: `旅行: ${loc.name}`,
        content: `${loc.description}\n亮点: ${loc.details.highlights.join(', ')}\n贴士: ${loc.details.tips}`,
        tags: ['旅行', loc.country],
        metadata: { bestTime: loc.details.bestTime }
      })
    })

    // 3. Index Work Assistant
    workData.contents.forEach(c => {
      this.items.push({
        id: c.id,
        module: 'work',
        title: c.title,
        content: c.description,
        tags: c.tags,
        metadata: { platform: c.platform, type: c.type }
      })
    })

    workData.products.forEach(p => {
      this.items.push({
        id: p.id,
        module: 'work',
        title: `商品: ${p.name}`,
        content: `价格: ${p.price}, 销量: ${p.sales}, 库存: ${p.stock}, 分类: ${p.category}`,
        tags: ['电商', '商品', p.category],
        metadata: { price: p.price, stock: p.stock }
      })
    })

    workData.orders.forEach(o => {
      this.items.push({
        id: o.id,
        module: 'work',
        title: `订单: ${o.id}`,
        content: `商品: ${o.productName}, 客户: ${o.customer}, 状态: ${o.status}, 日期: ${o.date}`,
        tags: ['电商', '订单'],
        metadata: { status: o.status, date: o.date }
      })
    })
  }

  public search(query: string, topK: number = 5): string {
    const queryLower = query.toLowerCase()
    
    // 简单的加权搜索
    const scored = this.items.map(item => {
      let score = 0
      const titleLower = item.title.toLowerCase()
      const contentLower = item.content.toLowerCase()
      
      if (titleLower.includes(queryLower)) score += 10
      if (contentLower.includes(queryLower)) score += 5
      
      item.tags.forEach(tag => {
        if (tag.toLowerCase().includes(queryLower)) score += 3
      })

      // 关键词拆分搜索
      const words = queryLower.split(/\s+/)
      words.forEach(word => {
        if (word.length > 1) {
          if (titleLower.includes(word)) score += 2
          if (contentLower.includes(word)) score += 1
        }
      })

      return { item, score }
    })

    const results = scored
      .filter(s => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, topK)

    if (results.length === 0) return ''

    return results.map(r => {
      const { item } = r
      return `[模块: ${item.module}] ${item.title}\n内容: ${item.content}\n标签: ${item.tags.join(', ')}`
    }).join('\n\n---\n\n')
  }

  // 获取用户信息作为基础背景
  public getUserProfileContext(): string {
    return `用户姓名: ${personalInfo.name}
头衔: ${personalInfo.title}
简介: ${personalInfo.bio}
所在地: ${personalInfo.location}`
  }
}

export const ragEngine = new RAGEngine()