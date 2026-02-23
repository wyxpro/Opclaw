import html2canvas from 'html2canvas'
import type { DigitalCard, CardHistory } from '../data/mock'

const HISTORY_KEY = 'digital_card_history'

// 主题颜色映射（用于 html2canvas 兼容性）
const themeColors: Record<string, { start: string; end: string }> = {
  blue: { start: '#3b82f6', end: '#06b6d4' },
  purple: { start: '#8b5cf6', end: '#d946ef' },
  green: { start: '#10b981', end: '#14b8a6' },
  orange: { start: '#f97316', end: '#fbbf24' },
  pink: { start: '#f43f5e', end: '#fb7185' },
  dark: { start: '#475569', end: '#64748b' },
}

// 生成名片图片
export async function generateCardImage(element: HTMLElement, theme?: string): Promise<string> {
  // 克隆元素以避免修改原始 DOM
  const clone = element.cloneNode(true) as HTMLElement
  
  // 将 Tailwind 渐变类转换为内联样式
  const gradientElement = clone.querySelector('[class*="bg-gradient-to-br"]') as HTMLElement
  if (gradientElement && theme && themeColors[theme]) {
    const colors = themeColors[theme]
    gradientElement.style.background = `linear-gradient(135deg, ${colors.start}, ${colors.end})`
    gradientElement.className = gradientElement.className.replace(/bg-gradient-to-br\s+\S+/g, '')
  }
  
  // 临时添加到 DOM 以便 html2canvas 渲染
  clone.style.position = 'fixed'
  clone.style.left = '-9999px'
  clone.style.top = '-9999px'
  document.body.appendChild(clone)
  
  try {
    const canvas = await html2canvas(clone, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
      logging: false,
    })
    return canvas.toDataURL('image/png', 1.0)
  } catch (error) {
    console.error('生成名片图片失败:', error)
    throw new Error('生成图片失败，请重试')
  } finally {
    document.body.removeChild(clone)
  }
}

// 下载图片
export function downloadImage(dataUrl: string, filename: string = 'digital-card.png'): void {
  const link = document.createElement('a')
  link.href = dataUrl
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// 保存名片到历史记录
export function saveToHistory(card: DigitalCard, previewImage?: string): CardHistory {
  const history = getHistoryList()
  const historyItem: CardHistory = {
    id: `history-${Date.now()}`,
    cardId: card.id,
    previewImage,
    createdAt: Date.now(),
  }
  
  // 添加到开头，限制最多保存20条
  const newHistory = [historyItem, ...history].slice(0, 20)
  localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory))
  
  return historyItem
}

// 获取历史记录列表
export function getHistoryList(): CardHistory[] {
  try {
    const data = localStorage.getItem(HISTORY_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

// 删除历史记录
export function deleteHistoryItem(historyId: string): void {
  const history = getHistoryList()
  const newHistory = history.filter(item => item.id !== historyId)
  localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory))
}

// 清空历史记录
export function clearHistory(): void {
  localStorage.removeItem(HISTORY_KEY)
}

// 微信分享（模拟实现，实际项目需要集成微信JS-SDK）
export function wechatShare(card: DigitalCard, imageUrl?: string): Promise<boolean> {
  return new Promise((resolve) => {
    // 检查是否在微信环境中
    const isWechat = /MicroMessenger/i.test(navigator.userAgent)
    
    if (!isWechat) {
      // 非微信环境，复制链接到剪贴板
      const shareText = `${card.name}的个人数字名片 - ${card.title_en}\n${card.bio}`
      navigator.clipboard.writeText(shareText).then(() => {
        alert('名片信息已复制到剪贴板，快去分享吧！')
        resolve(true)
      }).catch(() => {
        alert('复制失败，请手动复制分享')
        resolve(false)
      })
      return
    }
    
    // 微信环境（需要配置微信JS-SDK）
    // 这里只是模拟，实际项目中需要调用微信API
    console.log('微信分享:', { card, imageUrl })
    alert('请在微信中点击右上角菜单进行分享')
    resolve(true)
  })
}

// 格式化日期
export function formatDate(timestamp: number): string {
  const date = new Date(timestamp)
  return date.toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// 格式化相对时间
export function formatRelativeTime(timestamp: number): string {
  const now = Date.now()
  const diff = now - timestamp
  
  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour
  
  if (diff < minute) {
    return '刚刚'
  } else if (diff < hour) {
    return `${Math.floor(diff / minute)}分钟前`
  } else if (diff < day) {
    return `${Math.floor(diff / hour)}小时前`
  } else if (diff < 7 * day) {
    return `${Math.floor(diff / day)}天前`
  } else {
    return formatDate(timestamp)
  }
}
