import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Link2, MessageCircle, Clock, Share2, ExternalLink,
  Send, Github, Edit3, Twitter, Play, MessageSquare, Zap, Award
} from 'lucide-react'
import PageTransition from '../components/ui/PageTransition'
import { friendLinks, danmakuMessages, growthTimeline, socialAccounts } from '../data/mock'

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
      <div className="mx-auto max-w-6xl px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-text mb-2">社交</h1>
          <p className="text-text-muted">连接世界，分享精彩</p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-2 mb-8 overflow-x-auto no-scrollbar"
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

/* ===== Sticker Message Wall ===== */
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
  x: number
  y: number
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

  // Initialize messages with random positions using lazy initialization
  const [messages, setMessages] = useState<StickerMessage[]>(() =>
    danmakuMessages.map((msg, index) => ({
      ...msg,
      x: 10 + (index % 3) * 30 + Math.random() * 10,
      y: 15 + Math.floor(index / 3) * 25 + Math.random() * 10,
      rotation: (Math.random() - 0.5) * 12,
      createdAt: Date.now() - index * 10000,
      color: stickerColors[index % stickerColors.length],
    }))
  )

  const handleSend = () => {
    if (!newMessage.trim()) return
    
    const newMsg: StickerMessage = {
      id: `sticker-${Date.now()}`,
      text: newMessage.trim(),
      author: authorName.trim() || '匿名访客',
      color: selectedColor,
      x: 10 + Math.random() * 70,
      y: 20 + Math.random() * 40,
      rotation: (Math.random() - 0.5) * 16,
      createdAt: Date.now(),
    }
    
    setMessages((prev) => [...prev, newMsg])
    setNewMessage('')
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-3 mb-3">
          <MessageCircle size={32} className="text-primary" />
          <h2 className="text-3xl font-bold text-text">留言墙</h2>
        </div>
        <p className="text-text-muted">留下你的足迹，选一张贴纸</p>
      </motion.div>

      {/* Input Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6 max-w-2xl mx-auto"
      >
        {/* Name Input */}
        <input
          type="text"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          placeholder="你的昵称（选填）"
          className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-text placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-all mb-4"
        />
        
        {/* Message Input */}
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="写下你想说的话..."
          rows={3}
          className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-text placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-all resize-none mb-4"
        />
        
        {/* Color Selector & Send Button */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Sticker Color Options */}
          <div className="flex items-center gap-2 flex-wrap">
            {stickerColors.map((color, index) => (
              <button
                key={index}
                onClick={() => setSelectedColor(color)}
                className={`w-8 h-8 rounded-full border-2 transition-all ${
                  selectedColor === color 
                    ? 'ring-2 ring-primary ring-offset-2 ring-offset-bg scale-110' 
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
            className="px-8 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-dim transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Send size={14} />
            发送
          </button>
        </div>
      </motion.div>

      {/* Sticker Wall */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="relative min-h-[500px] glass-card overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 20% 30%, ${selectedColor.bg}40 0%, transparent 50%),
                              radial-gradient(circle at 80% 70%, ${selectedColor.border}20 0%, transparent 50%)`,
          }} />
        </div>

        {/* Floating Stickers */}
        <AnimatePresence>
          {messages.slice(-20).map((msg, index) => (
            <motion.div
              key={msg.id}
              initial={{ scale: 0, opacity: 0, rotate: 0 }}
              animate={{ 
                scale: 1, 
                opacity: 1, 
                rotate: msg.rotation,
                y: [0, -5, 0],
              }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ 
                scale: { type: 'spring', stiffness: 300, damping: 20 },
                y: { duration: 3 + (index % 3) * 0.5, repeat: Infinity, ease: 'easeInOut' }
              }}
              style={{
                position: 'absolute',
                left: `${msg.x}%`,
                top: `${msg.y}%`,
                zIndex: index,
              }}
              className="group cursor-pointer"
            >
              <div
                className="px-4 py-3 rounded-2xl shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl group-hover:z-50"
                style={{
                  backgroundColor: msg.color.bg,
                  border: `2px solid ${msg.color.border}`,
                  color: msg.color.text,
                  transform: `rotate(${msg.rotation}deg)`,
                  maxWidth: '220px',
                }}
              >
                <p className="text-sm font-medium leading-relaxed mb-2">
                  {msg.text}
                </p>
                <div className="flex items-center justify-between text-xs opacity-70">
                  <span>—— {msg.author}</span>
                  <span className="text-[10px]">
                    {new Date(msg.createdAt).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Empty State */}
        {messages.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-text-muted">
              <MessageCircle size={48} className="mx-auto mb-3 opacity-30" />
              <p>还没有留言，来贴第一张贴纸吧！</p>
            </div>
          </div>
        )}
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center text-sm text-text-muted"
      >
        已有 {messages.length} 张贴纸 · 快来留下你的足迹
      </motion.div>
    </div>
  )
}

/* ===== Growth Timeline ===== */
function GrowthTimeline() {
  return (
    <div className="relative max-w-3xl mx-auto">
      {/* Timeline line */}
      <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-accent/30 to-transparent" />

      <div className="space-y-10">
        {growthTimeline.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.12, duration: 0.5 }}
            className="relative pl-16"
          >
            {/* Year marker */}
            <div className="absolute left-0 top-1 w-12 h-12 rounded-xl bg-surface border border-border flex items-center justify-center">
              <span className="text-lg">{event.icon}</span>
            </div>

            <div className="glass-card p-6">
              <span className="inline-block px-3 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3 border border-primary/20">
                {event.date}
              </span>
              <h3 className="text-lg font-bold text-text mb-2">{event.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{event.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="text-center mt-12 pl-16">
        <div className="inline-flex items-center gap-2 text-text-muted text-sm">
          <Award size={16} className="text-accent" />
          未来可期，故事继续
        </div>
      </div>
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
