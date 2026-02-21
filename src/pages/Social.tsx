import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Link2, MessageCircle, Clock, Share2, ExternalLink,
  Send, Github, Edit3, Twitter, Play, MessageSquare, Zap, Award,
  X, Trash2, Edit2, Calendar
} from 'lucide-react'
import PageTransition from '../components/ui/PageTransition'
import { friendLinks, danmakuMessages, socialAccounts } from '../data/mock'

const tabs = [
  { id: 'friends', label: '友链', icon: Link2 },
  { id: 'danmaku', label: '留言墙', icon: MessageCircle },
  { id: 'timeline', label: '成长时间轴', icon: Clock },
  { id: 'social', label: '自媒体矩阵', icon: Share2 },
] as const

type TabId = (typeof tabs)[number]['id']

const platformIcons: Record<string, typeof Github> = {
  github: Github,
  edit: Edit3,
  twitter: Twitter,
  play: Play,
  message: MessageSquare,
  zap: Zap,
}

export default function Social() {
  const [activeTab, setActiveTab] = useState<TabId>('friends')

  return (
    <PageTransition>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 sm:py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-text mb-2">社交</h1>
          <p className="text-sm sm:text-base text-text-muted">连接世界，分享精彩</p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-2 mb-6 sm:mb-8 overflow-x-auto no-scrollbar pb-2"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'text-primary'
                  : 'text-text-muted hover:text-text-secondary'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="socialTab"
                  className="absolute inset-0 bg-primary/10 border border-primary/20 rounded-xl -z-10"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          {activeTab === 'friends' && (
            <motion.div key="friends" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <FriendLinks />
            </motion.div>
          )}
          {activeTab === 'danmaku' && (
            <motion.div key="danmaku" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <DanmakuWall />
            </motion.div>
          )}
          {activeTab === 'timeline' && (
            <motion.div key="timeline" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <GrowthTimeline />
            </motion.div>
          )}
          {activeTab === 'social' && (
            <motion.div key="social" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <SocialMatrix />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  )
}

/* ===== Friend Links ===== */
function FriendLinks() {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {friendLinks.map((friend, index) => (
        <motion.a
          key={friend.id}
          href={friend.url}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.08 }}
          onMouseEnter={() => setHoveredId(friend.id)}
          onMouseLeave={() => setHoveredId(null)}
          className="glass-card p-5 group relative overflow-hidden block"
        >
          {/* Background glow */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: `radial-gradient(circle at 50% 50%, ${friend.color}11, transparent 70%)`,
            }}
          />

          <div className="relative z-10 flex items-center gap-4">
            {/* Avatar */}
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold flex-shrink-0 transition-transform group-hover:scale-110"
              style={{
                background: `linear-gradient(135deg, ${friend.color}44, ${friend.color}11)`,
                color: friend.color,
              }}
            >
              {friend.initials}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-text group-hover:text-primary transition-colors flex items-center gap-2">
                {friend.name}
                <ExternalLink
                  size={12}
                  className={`transition-all ${hoveredId === friend.id ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`}
                />
              </h3>
              <p className="text-xs text-text-muted mt-0.5 line-clamp-2">{friend.description}</p>
            </div>
          </div>
        </motion.a>
      ))}
    </div>
  )
}

/* ===== Horizontal Scrolling Message Wall ===== */
interface StickerColor {
  bg: string
  border: string
  text: string
}

interface StickerMessage {
  id: string
  text: string
  author: string
  color: StickerColor
  rotation: number
  createdAt: number
}

const stickerColors = [
  { bg: '#fef3c7', border: '#fbbf24', text: '#92400e' }, // 暖黄
  { bg: '#fce7f3', border: '#f472b6', text: '#be185d' }, // 粉红
  { bg: '#dbeafe', border: '#60a5fa', text: '#1e40af' }, // 天蓝
  { bg: '#d1fae5', border: '#34d399', text: '#065f46' }, // 薄荷绿
  { bg: '#f3e8ff', border: '#a78bfa', text: '#5b21b6' }, // 淡紫
  { bg: '#ffedd5', border: '#fb923c', text: '#9a3412' }, // 橙色
  { bg: '#e0f2fe', border: '#7dd3fc', text: '#0369a1' }, // 浅蓝
  { bg: '#fdf4ff', border: '#e879f9', text: '#86198f' }, // 粉紫
]

function DanmakuWall() {
  const [newMessage, setNewMessage] = useState('')
  const [authorName, setAuthorName] = useState('')
  const [selectedColor, setSelectedColor] = useState<StickerColor>(stickerColors[0])
  const [selectedSticker, setSelectedSticker] = useState<StickerMessage | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState('')
  const [editAuthor, setEditAuthor] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  // Initialize messages
  const [messages, setMessages] = useState<StickerMessage[]>(() =>
    danmakuMessages.map((msg, index) => ({
      ...msg,
      rotation: (Math.random() - 0.5) * 6,
      createdAt: Date.now() - index * 10000,
      color: stickerColors[index % stickerColors.length],
    }))
  )

  // Auto scroll left animation
  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer) return

    let animationId: number
    let scrollPos = scrollContainer.scrollLeft
    
    const animate = () => {
      scrollPos += 0.5 // 滚动速度
      const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth
      
      if (scrollPos >= maxScroll) {
        scrollPos = 0 // 回到起点循环
      }
      
      scrollContainer.scrollLeft = scrollPos
      animationId = requestAnimationFrame(animate)
    }
    
    animationId = requestAnimationFrame(animate)
    
    return () => cancelAnimationFrame(animationId)
  }, [messages.length])

  const handleSend = () => {
    if (!newMessage.trim()) return
    
    const newMsg: StickerMessage = {
      id: `sticker-${Date.now()}`,
      text: newMessage.trim(),
      author: authorName.trim() || '匿名访客',
      color: selectedColor,
      rotation: (Math.random() - 0.5) * 6,
      createdAt: Date.now(),
    }
    
    setMessages((prev) => [...prev, newMsg])
    setNewMessage('')
  }

  const handleStickerClick = (msg: StickerMessage) => {
    setSelectedSticker(msg)
    setEditText(msg.text)
    setEditAuthor(msg.author)
    setIsEditing(false)
  }

  const handleEdit = () => {
    if (!selectedSticker || !editText.trim()) return
    
    setMessages(prev => prev.map(msg => 
      msg.id === selectedSticker.id 
        ? { ...msg, text: editText.trim(), author: editAuthor.trim() || '匿名访客' }
        : msg
    ))
    setIsEditing(false)
    setSelectedSticker(null)
  }

  const handleDelete = () => {
    if (!selectedSticker) return
    
    if (confirm('确定要删除这张贴纸吗？')) {
      setMessages(prev => prev.filter(msg => msg.id !== selectedSticker.id))
      setSelectedSticker(null)
    }
  }

  const closeModal = () => {
    setSelectedSticker(null)
    setIsEditing(false)
  }

  // 复制消息用于无缝滚动
  const duplicatedMessages = [...messages, ...messages, ...messages]

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Horizontal Scrolling Message Wall */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="relative glass-card overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 20% 30%, ${selectedColor.bg}40 0%, transparent 50%),
                              radial-gradient(circle at 80% 70%, ${selectedColor.border}20 0%, transparent 50%)`,
          }} />
        </div>

        {/* Scrolling Container */}
        <div 
          ref={scrollRef}
          className="relative overflow-x-auto overflow-y-hidden no-scrollbar py-6 sm:py-8"
          style={{ scrollBehavior: 'auto' }}
        >
          <div className="flex items-center gap-4 sm:gap-6 px-4" style={{ width: 'max-content' }}>
            {duplicatedMessages.map((msg, index) => (
              <motion.div
                key={`${msg.id}-${index}`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: (index % messages.length) * 0.05 }}
                className="group cursor-pointer flex-shrink-0"
                onClick={() => handleStickerClick(msg)}
              >
                <div
                  className="px-3 py-2 sm:px-5 sm:py-3 rounded-xl shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl group-hover:z-50"
                  style={{
                    backgroundColor: msg.color.bg,
                    border: `2px solid ${msg.color.border}`,
                    color: msg.color.text,
                    transform: `rotate(${msg.rotation}deg)`,
                    minWidth: '140px',
                    maxWidth: '200px',
                  }}
                >
                  <p className="text-xs sm:text-sm font-medium leading-relaxed mb-1.5 sm:mb-2">
                    {msg.text}
                  </p>
                  <div className="flex items-center justify-between text-[10px] sm:text-xs opacity-70 gap-3">
                    <span className="truncate">—— {msg.author}</span>
                    <span className="shrink-0">
                      {new Date(msg.createdAt).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {messages.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center min-h-[150px]">
            <div className="text-center text-text-muted">
              <MessageCircle size={36} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">还没有留言，来贴第一张贴纸吧！</p>
            </div>
          </div>
        )}
      </motion.div>

      {/* Input Form - 移到下方 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-3 sm:p-5"
      >
        {/* Header */}
        <div className="text-center mb-2 sm:mb-3">
          <p className="text-text-muted text-xs sm:text-sm">留下你的足迹，选一张贴纸</p>
        </div>

        {/* Name Input */}
        <input
          type="text"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          placeholder="你的昵称（选填）"
          className="w-full px-3 py-2 rounded-lg sm:rounded-xl bg-surface border border-border text-text text-sm placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-all mb-2"
        />
        
        {/* Message Input */}
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="写下你想说的话..."
          rows={2}
          className="w-full px-3 py-2 rounded-lg sm:rounded-xl bg-surface border border-border text-text text-sm placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-all resize-none mb-2"
        />
        
        {/* Color Selector & Send Button */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Sticker Color Options */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {stickerColors.map((color, index) => (
              <button
                key={index}
                onClick={() => setSelectedColor(color)}
                className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 transition-all ${
                  selectedColor === color 
                    ? 'ring-2 ring-primary ring-offset-1 sm:ring-offset-2 ring-offset-bg scale-110' 
                    : 'hover:scale-105'
                }`}
                style={{ 
                  backgroundColor: color.bg,
                  borderColor: color.border 
                }}
              />
            ))}
          </div>
          
          {/* Send Button */}
          <button
            onClick={handleSend}
            disabled={!newMessage.trim()}
            className="px-4 sm:px-6 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-primary text-white text-xs sm:text-sm font-medium hover:bg-primary-dim transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
          >
            <Send size={12} />
            发送
          </button>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center text-xs text-text-muted"
      >
        已有 {messages.length} 张贴纸 · 快来留下你的足迹
      </motion.div>

      {/* Sticker Detail Modal */}
      <AnimatePresence>
        {selectedSticker && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="glass-card w-full max-w-md overflow-hidden"
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: selectedSticker.color.bg,
                border: `2px solid ${selectedSticker.color.border}`,
              }}
            >
              {/* Header */}
              <div 
                className="px-4 py-3 flex items-center justify-between"
                style={{ borderBottom: `1px solid ${selectedSticker.color.border}40` }}
              >
                <span className="text-sm font-medium" style={{ color: selectedSticker.color.text }}>
                  贴纸详情
                </span>
                <button 
                  onClick={closeModal}
                  className="p-1 rounded-full hover:bg-black/10 transition-colors"
                  style={{ color: selectedSticker.color.text }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Content */}
              <div className="p-5">
                {isEditing ? (
                  <div className="space-y-3">
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white/50 border border-white/30 text-sm resize-none"
                      style={{ color: selectedSticker.color.text }}
                      rows={3}
                    />
                    <input
                      type="text"
                      value={editAuthor}
                      onChange={(e) => setEditAuthor(e.target.value)}
                      placeholder="作者名称"
                      className="w-full px-3 py-2 rounded-lg bg-white/50 border border-white/30 text-sm"
                      style={{ color: selectedSticker.color.text }}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleEdit}
                        className="flex-1 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dim transition-colors"
                      >
                        保存
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="flex-1 py-2 rounded-lg bg-surface text-text text-sm font-medium hover:bg-surface/80 transition-colors"
                      >
                        取消
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p 
                      className="text-lg font-medium leading-relaxed mb-4"
                      style={{ color: selectedSticker.color.text }}
                    >
                      {selectedSticker.text}
                    </p>
                    <div 
                      className="flex items-center justify-between text-sm opacity-70"
                      style={{ color: selectedSticker.color.text }}
                    >
                      <span>—— {selectedSticker.author}</span>
                      <span>
                        {new Date(selectedSticker.createdAt).toLocaleString('zh-CN')}
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* Actions */}
              {!isEditing && (
                <div 
                  className="px-4 py-3 flex gap-2"
                  style={{ borderTop: `1px solid ${selectedSticker.color.border}40` }}
                >
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex-1 py-2 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-colors hover:bg-black/10"
                    style={{ color: selectedSticker.color.text }}
                  >
                    <Edit2 size={14} />
                    编辑
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex-1 py-2 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-colors hover:bg-rose/10 text-rose"
                  >
                    <Trash2 size={14} />
                    删除
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ===== Growth Timeline ===== */
interface TimelineEvent {
  id: string
  date: string
  title: string
  description: string
  image: string
}

// AI学习历程数据 - 序号将动态生成
const aiLearningTimeline: TimelineEvent[] = [
  {
    id: '1',
    date: '2025-11-15 13:31:06',
    title: '网站设置与功能介绍',
    description: '开始学习网站基础搭建，了解域名、服务器和基本配置',
    image: 'https://picsum.photos/seed/ai1/400/300',
  },
  {
    id: '2',
    date: '2025-11-15 13:32:24',
    title: '用户系统',
    description: '学习用户注册、登录、权限管理等核心功能开发',
    image: 'https://picsum.photos/seed/ai2/400/300',
  },
  {
    id: '3',
    date: '2025-11-15 13:33:49',
    title: '文件服务',
    description: '掌握文件上传、存储、CDN加速等技术实现',
    image: 'https://picsum.photos/seed/ai3/400/300',
  },
  {
    id: '4',
    date: '2025-11-15 13:34:40',
    title: '资源聚合',
    description: '学习数据抓取、API整合、内容聚合功能开发',
    image: 'https://picsum.photos/seed/ai4/400/300',
  },
  {
    id: '5',
    date: '2025-11-15 13:35:50',
    title: '商品与订单',
    description: '电商系统开发，购物车、支付、订单管理功能',
    image: 'https://picsum.photos/seed/ai5/400/300',
  },
  {
    id: '6',
    date: '2025-11-15 13:36:22',
    title: '支付',
    description: '集成第三方支付，支付宝、微信支付对接',
    image: 'https://picsum.photos/seed/ai6/400/300',
  },
  {
    id: '7',
    date: '2025-11-15 13:36:31',
    title: '短信',
    description: '短信验证码、通知推送服务集成',
    image: 'https://picsum.photos/seed/ai7/400/300',
  },
  {
    id: '8',
    date: '2025-11-15 13:36:49',
    title: '三方登录',
    description: '微信、QQ、GitHub等OAuth登录集成',
    image: 'https://picsum.photos/seed/ai8/400/300',
  },
  {
    id: '9',
    date: '2025-11-15 13:36:56',
    title: 'SEO',
    description: '搜索引擎优化，提升网站排名和流量',
    image: 'https://picsum.photos/seed/ai9/400/300',
  },
  {
    id: '10',
    date: '2025-11-15 13:37:32',
    title: '导航栏自定义',
    description: '从零基础到掌握前端框架，实现自定义导航',
    image: 'https://picsum.photos/seed/ai10/400/300',
  },
]

function GrowthTimeline() {
  const [events, setEvents] = useState<TimelineEvent[]>(aiLearningTimeline)
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null)
  const [selectedIndex, setSelectedIndex] = useState<number>(0)
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editImage, setEditImage] = useState('')

  const handleCardClick = (event: TimelineEvent, index: number) => {
    setSelectedEvent(event)
    setSelectedIndex(index)
    setEditTitle(event.title)
    setEditDescription(event.description)
    setEditImage(event.image)
    setIsEditing(false)
  }

  const handleEdit = () => {
    if (!selectedEvent || !editTitle.trim()) return
    
    setEvents(prev => prev.map(event => 
      event.id === selectedEvent.id 
        ? { ...event, title: editTitle.trim(), description: editDescription.trim(), image: editImage }
        : event
    ))
    setIsEditing(false)
    setSelectedEvent(null)
  }

  const handleDelete = () => {
    if (!selectedEvent) return
    
    if (confirm('确定要删除这条学习记录吗？')) {
      setEvents(prev => prev.filter(event => event.id !== selectedEvent.id))
      setSelectedEvent(null)
    }
  }

  const closeModal = () => {
    setSelectedEvent(null)
    setIsEditing(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start gap-4"
      >
        <div className="flex-shrink-0">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-primary/20">
            <Clock size={24} className="sm:size-7 text-primary" />
          </div>
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-text mb-1">时间线</h2>
          <p className="text-xs sm:text-sm text-text-muted">The soul is walking</p>
        </div>
      </motion.div>

      {/* Timeline Grid */}
      <div className="relative">
        {/* Grid Layout */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 relative z-10">
          {events.map((event, index) => {
            const number = index + 1
            const isLastInRow = (index + 1) % 5 === 0 || index === events.length - 1
            
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group cursor-pointer relative"
                onClick={() => handleCardClick(event, index)}
              >
                {/* Card */}
                <div className="glass-card overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:border-primary/30 relative">
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-surface">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {/* Number badge - 序号 */}
                    <div className="absolute bottom-2 right-2 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/90 flex items-center justify-center text-[10px] sm:text-xs font-bold text-text shadow-lg">
                      {number}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-2 sm:p-3">
                    <h3 className="text-xs sm:text-sm font-semibold text-text mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-[10px] sm:text-xs text-text-muted line-clamp-2 mb-1.5 sm:mb-2">
                      {event.description}
                    </p>
                    <div className="flex items-center gap-1 text-[9px] sm:text-[10px] text-text-dim">
                      <Calendar size={9} className="sm:size-2.5" />
                      <span className="truncate">{event.date}</span>
                    </div>
                  </div>
                </div>

                {/* Arrow connector between cards - 所有尺寸都显示 */}
                {index < events.length - 1 && !isLastInRow && (
                  <div className="hidden sm:flex absolute -right-2.5 top-1/2 -translate-y-1/2 text-text-dim/40 z-0">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M6 4L12 10L6 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center pt-4 sm:pt-6"
      >
        <div className="inline-flex items-center gap-2 text-text-muted text-xs sm:text-sm">
          <Award size={14} className="sm:size-4 text-accent" />
          未来可期，故事继续
        </div>
      </motion.div>

      {/* Event Detail Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="glass-card w-full max-w-lg overflow-hidden max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image */}
              <div className="relative aspect-video">
                <img
                  src={isEditing ? editImage : selectedEvent.image}
                  alt={selectedEvent.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                
                {/* Close button */}
                <button 
                  onClick={closeModal}
                  className="absolute top-3 right-3 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
                >
                  <X size={18} />
                </button>

                {/* Number badge - 显示序号 */}
                <div className="absolute bottom-3 left-3 w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white/90 flex items-center justify-center text-base sm:text-lg font-bold text-text shadow-lg">
                  {selectedIndex + 1}
                </div>
              </div>

              {/* Content */}
              <div className="p-4 sm:p-5">
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs text-text-muted mb-1">标题</label>
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-text-muted mb-1">描述</label>
                      <textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm resize-none"
                        rows={3}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-text-muted mb-1">图片URL</label>
                      <input
                        type="text"
                        value={editImage}
                        onChange={(e) => setEditImage(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm"
                      />
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={handleEdit}
                        className="flex-1 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dim transition-colors"
                      >
                        保存修改
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="flex-1 py-2.5 rounded-lg bg-surface text-text text-sm font-medium hover:bg-surface/80 transition-colors border border-border"
                      >
                        取消
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2 text-xs text-text-muted mb-2">
                      <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                        第 {selectedIndex + 1} 站
                      </span>
                      <span>·</span>
                      <Calendar size={12} />
                      <span>{selectedEvent.date}</span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-text mb-3">{selectedEvent.title}</h3>
                    <p className="text-sm text-text-secondary leading-relaxed mb-6">
                      {selectedEvent.description}
                    </p>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex-1 py-2.5 rounded-lg bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors flex items-center justify-center gap-2"
                      >
                        <Edit2 size={14} />
                        编辑
                      </button>
                      <button
                        onClick={handleDelete}
                        className="flex-1 py-2.5 rounded-lg bg-rose/10 text-rose text-sm font-medium hover:bg-rose/20 transition-colors flex items-center justify-center gap-2"
                      >
                        <Trash2 size={14} />
                        删除
                      </button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ===== Social Media Matrix ===== */
function SocialMatrix() {
  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {socialAccounts.map((account, index) => {
          const Icon = platformIcons[account.icon] || ExternalLink
          return (
            <motion.a
              key={account.platform}
              href={account.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className="glass-card p-5 group block"
            >
              <div className="flex items-center gap-4 mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                  style={{ background: `${account.color}22` }}
                >
                  <Icon size={22} style={{ color: account.color }} />
                </div>
                <div>
                  <h3 className="font-semibold text-text text-sm">{account.platform}</h3>
                  <p className="text-xs text-text-muted">{account.username}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xl font-bold text-text">{account.followers}</p>
                  <p className="text-xs text-text-muted">粉丝</p>
                </div>
                <div className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all group-hover:bg-primary/20 group-hover:text-primary text-text-muted bg-surface border border-border">
                  访问主页 →
                </div>
              </div>
            </motion.a>
          )
        })}
      </div>

      {/* Share Card Section */}
      <div className="mt-12">
        <h3 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
          <Share2 size={18} className="text-primary" />
          分享名片
        </h3>
        <div className="glass-card p-6 max-w-sm">
          <div className="bg-gradient-to-br from-primary/20 via-surface to-rose/10 rounded-xl p-6 border border-primary/10">
            <div className="flex items-center gap-4 mb-4">
              <img
                src="/avatar.png"
                alt="头像"
                className="w-14 h-14 rounded-xl object-cover ring-2 ring-primary/20"
              />
              <div>
                <h4 className="font-bold text-text">小叶</h4>
                <p className="text-xs text-text-muted">全栈开发者 / 创意设计师</p>
              </div>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed mb-4">
              用代码编织梦想，用设计点亮生活
            </p>
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {socialAccounts.slice(0, 3).map((acc) => {
                  const I = platformIcons[acc.icon] || ExternalLink
                  return (
                    <div
                      key={acc.platform}
                      className="w-7 h-7 rounded-md flex items-center justify-center"
                      style={{ background: `${acc.color}22` }}
                    >
                      <I size={14} style={{ color: acc.color }} />
                    </div>
                  )
                })}
              </div>
              <div className="w-16 h-16 rounded-lg bg-surface border border-border flex items-center justify-center text-text-dim text-xs">
                QR
              </div>
            </div>
          </div>
          <button className="w-full mt-4 py-2.5 rounded-xl bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors border border-primary/20">
            复制分享链接
          </button>
        </div>
      </div>
    </div>
  )
}
