import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Link2, MessageCircle, Clock, Share2, ExternalLink,
  Send, Github, Edit3, Twitter, Play, MessageSquare, Zap, Award,
  X, Trash2, Edit2, Calendar, ChevronRight, ArrowLeft,
  IdCard, Download, Share, History, Palette, Sparkles, Loader2, Plus
} from 'lucide-react'
import PageTransition from '../components/ui/PageTransition'
import { ThemeSelectorPanel } from '../components/ui/ThemeSwitcher'
import ProfileEditModal, { type ProfileData } from '../components/ProfileEditModal'
import { useTheme } from '../hooks/useTheme'
import { friendLinks, danmakuMessages, socialAccounts, generateDigitalCard, cardThemes, type DigitalCard, type CardTheme, presetAvatars } from '../data/mock'
import { generateCardImage, downloadImage, saveToHistory, getHistoryList, deleteHistoryItem, wechatShare, formatRelativeTime } from '../lib/cardUtils'

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
  const [mobileView, setMobileView] = useState<'menu' | TabId>('menu')
  const [showDesktopCardModal, setShowDesktopCardModal] = useState(false)
  
  // 用户资料状态
  const [userProfile, setUserProfile] = useState<ProfileData>({
    avatar: presetAvatars[0].url,
    background: null,
    name: '灵愈用户',
    gender: 'secret',
    age: '',
    bio: '',
    phone: '',
    email: ''
  })
  const [showProfileEditModal, setShowProfileEditModal] = useState(false)

  // 检测是否为移动端
  useEffect(() => {
    const checkMobile = () => {
      // 移动端检测逻辑
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <PageTransition>
      {/* 桌面端布局 */}
      <div className="hidden md:block mx-auto max-w-6xl px-4 sm:px-6 py-6 sm:py-8">
        {/* 桌面端用户信息卡片 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <div 
            className="relative rounded-2xl overflow-hidden"
            style={{
              background: userProfile.background 
                ? `url(${userProfile.background}) center/cover no-repeat`
                : undefined
            }}
          >
            {/* 背景遮罩层 */}
            <div 
              className="absolute inset-0 bg-gradient-to-br from-primary to-primary-dim"
              style={{ opacity: userProfile.background ? 0.85 : 1 }}
            />
            <div className="relative px-6 py-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-white/20 flex items-center justify-center text-white text-2xl font-bold border-2 border-white/30">
                  {userProfile.avatar ? (
                    <img src={userProfile.avatar} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    '叶'
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-white">{userProfile.name}</h2>
                    <span className="px-2 py-0.5 rounded-full bg-green-400/90 text-white text-xs font-medium">
                      已认证
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-white/70 text-sm">ID 33a4****c533</span>
                    <button className="px-2 py-0.5 rounded bg-white/20 text-white text-xs hover:bg-white/30 transition-colors">
                      复制
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {/* 编辑个人信息按钮 */}
                <button
                  onClick={() => setShowProfileEditModal(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/20 text-white font-medium hover:bg-white/30 transition-colors"
                >
                  <Edit2 size={18} />
                  <span>编辑资料</span>
                </button>
                {/* 桌面端数字名片入口 */}
                <button
                  onClick={() => setShowDesktopCardModal(true)}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-white text-primary font-medium hover:shadow-lg hover:scale-105 transition-all"
                >
                  <IdCard size={18} />
                  <span>生成数字名片</span>
                </button>
              </div>
            </div>
          </div>
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

        {/* 桌面端数字名片弹窗 */}
        <AnimatePresence>
          {showDesktopCardModal && (
            <DigitalCardModal 
              onClose={() => setShowDesktopCardModal(false)} 
              onOpenHistory={() => {
                setShowDesktopCardModal(false)
              }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* 移动端布局 - 个人中心样式 */}
      <div className="md:hidden min-h-screen pb-20">
        <AnimatePresence mode="wait">
          {mobileView === 'menu' ? (
            <MobileMenu 
              key="menu" 
              onNavigate={setMobileView} 
              userProfile={userProfile}
              onEditProfile={() => setShowProfileEditModal(true)}
            />
          ) : mobileView === 'friends' ? (
            <MobileFriendLinks key="friends" onBack={() => setMobileView('menu')} />
          ) : mobileView === 'danmaku' ? (
            <MobileDanmakuWall key="danmaku" onBack={() => setMobileView('menu')} />
          ) : mobileView === 'timeline' ? (
            <MobileGrowthTimeline key="timeline" onBack={() => setMobileView('menu')} />
          ) : mobileView === 'social' ? (
            <MobileSocialMatrix key="social" onBack={() => setMobileView('menu')} />
          ) : null}
        </AnimatePresence>
      </div>

      {/* 个人信息编辑弹窗 - 使用 key 确保重新挂载时同步最新数据 */}
      <ProfileEditModal
        key={showProfileEditModal ? `open-${userProfile.background || 'default'}` : 'closed'}
        isOpen={showProfileEditModal}
        onClose={() => setShowProfileEditModal(false)}
        initialData={userProfile}
        onSave={setUserProfile}
      />
    </PageTransition>
  )
}

/* ===== Friend Links - 桌面端（与移动端功能同步） ===== */
function FriendLinks() {
  const [links, setLinks] = useState(friendLinks)
  const [selectedLink, setSelectedLink] = useState<typeof friendLinks[0] | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [editForm, setEditForm] = useState({
    name: '',
    url: '',
    description: '',
    initials: '',
    color: '#3b82f6'
  })

  const handleAdd = () => {
    setIsAdding(true)
    setIsEditing(false)
    setSelectedLink(null)
    setEditForm({ name: '', url: '', description: '', initials: '', color: '#3b82f6' })
  }

  const handleEdit = (link: typeof friendLinks[0]) => {
    setSelectedLink(link)
    setIsEditing(true)
    setIsAdding(false)
    setEditForm({
      name: link.name,
      url: link.url,
      description: link.description,
      initials: link.initials,
      color: link.color
    })
  }

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这个友链吗？')) {
      setLinks(prev => prev.filter(l => l.id !== id))
    }
  }

  const handleSave = () => {
    if (!editForm.name.trim() || !editForm.url.trim()) return

    if (isAdding) {
      const newLink = {
        id: `fl-${crypto.randomUUID()}`,
        ...editForm,
        initials: editForm.initials || editForm.name.slice(0, 2).toUpperCase()
      }
      setLinks(prev => [...prev, newLink])
    } else if (selectedLink) {
      setLinks(prev => prev.map(l =>
        l.id === selectedLink.id
          ? { ...l, ...editForm, initials: editForm.initials || editForm.name.slice(0, 2).toUpperCase() }
          : l
      ))
    }
    closeModal()
  }

  const closeModal = () => {
    setSelectedLink(null)
    setIsEditing(false)
    setIsAdding(false)
  }

  const openLinkDetail = (link: typeof friendLinks[0]) => {
    setSelectedLink(link)
    setIsEditing(false)
    setIsAdding(false)
  }

  return (
    <div>
      {/* 添加按钮 */}
      <div className="mb-6">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAdd}
          className="px-5 py-3 rounded-xl bg-primary text-white font-medium flex items-center gap-2 hover:bg-primary-dim transition-colors"
        >
          <Plus size={20} />
          新增友链
        </motion.button>
      </div>

      {/* 2列网格布局 */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-3">
        {links.map((friend, index) => (
          <motion.div
            key={friend.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => openLinkDetail(friend)}
            className="glass-card p-5 group relative overflow-hidden cursor-pointer hover:border-primary/30 transition-all"
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
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold shrink-0 transition-transform group-hover:scale-110"
                style={{
                  background: `linear-gradient(135deg, ${friend.color}44, ${friend.color}11)`,
                  color: friend.color,
                }}
              >
                {friend.initials}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-text group-hover:text-primary transition-colors">
                  {friend.name}
                </h3>
                <p className="text-xs text-text-muted mt-0.5 line-clamp-2">{friend.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 详情/编辑弹窗 */}
      <AnimatePresence>
        {selectedLink && (
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
              className="bg-surface rounded-2xl p-6 w-full max-w-md"
              onClick={e => e.stopPropagation()}
            >
              {isEditing || isAdding ? (
                // 编辑/添加表单
                <>
                  <h3 className="text-xl font-semibold mb-4">{isAdding ? '新增友链' : '编辑友链'}</h3>
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="名称"
                      value={editForm.name}
                      onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-bg border border-border text-sm"
                    />
                    <input
                      type="text"
                      placeholder="网址"
                      value={editForm.url}
                      onChange={e => setEditForm({ ...editForm, url: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-bg border border-border text-sm"
                    />
                    <input
                      type="text"
                      placeholder="描述"
                      value={editForm.description}
                      onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-bg border border-border text-sm"
                    />
                    <input
                      type="text"
                      placeholder="缩写（可选）"
                      value={editForm.initials}
                      onChange={e => setEditForm({ ...editForm, initials: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-bg border border-border text-sm"
                    />
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-text-muted">颜色:</span>
                      <input
                        type="color"
                        value={editForm.color}
                        onChange={e => setEditForm({ ...editForm, color: e.target.value })}
                        className="w-12 h-10 rounded-lg cursor-pointer"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={closeModal}
                      className="flex-1 py-3 rounded-xl bg-surface border border-border text-sm font-medium"
                    >
                      取消
                    </button>
                    <button
                      onClick={handleSave}
                      className="flex-1 py-3 rounded-xl bg-primary text-white text-sm font-medium"
                    >
                      保存
                    </button>
                  </div>
                </>
              ) : (
                // 详情展示
                <>
                  <div className="flex items-center gap-4 mb-6">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold"
                      style={{
                        background: `linear-gradient(135deg, ${selectedLink.color}44, ${selectedLink.color}11)`,
                        color: selectedLink.color,
                      }}
                    >
                      {selectedLink.initials}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{selectedLink.name}</h3>
                      <p className="text-sm text-text-muted">{selectedLink.description}</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <a
                      href={selectedLink.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-3 rounded-xl bg-primary text-white text-sm font-medium text-center"
                    >
                      访问网站
                    </a>
                    <button
                      onClick={() => handleEdit(selectedLink)}
                      className="py-3 px-6 rounded-xl bg-surface border border-border text-sm font-medium"
                    >
                      编辑
                    </button>
                    <button
                      onClick={() => handleDelete(selectedLink.id)}
                      className="py-3 px-6 rounded-xl bg-rose/10 text-rose text-sm font-medium"
                    >
                      删除
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
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
  const scrollRef1 = useRef<HTMLDivElement>(null)
  const scrollRef2 = useRef<HTMLDivElement>(null)
  const scrollRef3 = useRef<HTMLDivElement>(null)

  // Initialize messages
  const [messages, setMessages] = useState<StickerMessage[]>(() =>
    danmakuMessages.map((msg, index) => ({
      ...msg,
      rotation: (Math.random() - 0.5) * 4,
      createdAt: Date.now() - index * 10000,
      color: stickerColors[index % stickerColors.length],
    }))
  )

  // 3行滚动动画 - 方向交替：右、左、右
  useEffect(() => {
    const animateScroll = (
      ref: React.RefObject<HTMLDivElement | null>,
      direction: 'left' | 'right',
      speed: number
    ) => {
      const container = ref.current
      if (!container) return () => {}
      
      let animationId: number
      let scrollPos = container.scrollLeft
      const maxScroll = container.scrollWidth - container.clientWidth
      
      // 初始化位置
      if (direction === 'left') {
        scrollPos = 0
      } else {
        scrollPos = maxScroll
      }
      container.scrollLeft = scrollPos
      
      const animate = () => {
        if (direction === 'left') {
          scrollPos += speed
          if (scrollPos >= maxScroll) {
            scrollPos = 0
          }
        } else {
          scrollPos -= speed
          if (scrollPos <= 0) {
            scrollPos = maxScroll
          }
        }
        container.scrollLeft = scrollPos
        animationId = requestAnimationFrame(animate)
      }
      
      animationId = requestAnimationFrame(animate)
      return () => cancelAnimationFrame(animationId)
    }

    const cleanup1 = animateScroll(scrollRef1, 'right', 0.4)
    const cleanup2 = animateScroll(scrollRef2, 'left', 0.5)
    const cleanup3 = animateScroll(scrollRef3, 'right', 0.45)
    
    return () => {
      cleanup1()
      cleanup2()
      cleanup3()
    }
  }, [messages.length])

  const handleSend = () => {
    if (!newMessage.trim()) return
    
    const newMsg: StickerMessage = {
      id: `sticker-${crypto.randomUUID()}`,
      text: newMessage.trim(),
      author: authorName.trim() || '匿名访客',
      color: selectedColor,
      rotation: (Math.random() - 0.5) * 4,
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

  // 将消息分成3组
  const rowMessages = [
    messages.filter((_, i) => i % 3 === 0),
    messages.filter((_, i) => i % 3 === 1),
    messages.filter((_, i) => i % 3 === 2),
  ]

  // 辅助函数：渲染单行消息
  const renderRowContent = (rowMsgs: StickerMessage[], direction: string) => {
    const duplicated = [...rowMsgs, ...rowMsgs, ...rowMsgs, ...rowMsgs]
    return duplicated.map((msg, index) => (
      <motion.div
        key={`${msg.id}-${index}-${direction}`}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: (index % rowMsgs.length) * 0.03 }}
        className="group cursor-pointer shrink-0"
        onClick={() => handleStickerClick(msg)}
      >
        <div
          className="px-4 py-3 rounded-xl shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl"
          style={{
            backgroundColor: msg.color.bg,
            border: `2px solid ${msg.color.border}`,
            color: msg.color.text,
            transform: `rotate(${msg.rotation}deg)`,
            minWidth: '160px',
            maxWidth: '220px',
          }}
        >
          <p className="text-sm font-medium leading-relaxed mb-2">
            {msg.text}
          </p>
          <div className="flex items-center justify-between text-xs opacity-70 gap-3">
            <span className="truncate">—— {msg.author}</span>
            <span className="shrink-0">
              {new Date(msg.createdAt).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
      </motion.div>
    ))
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* 5行滚动留言墙 */}
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

        {/* 3行滚动容器 - 方向交替：右、左、右 */}
        <div className="relative py-4 space-y-2">
          <div ref={scrollRef1} className="overflow-x-auto overflow-y-hidden no-scrollbar py-2" style={{ scrollBehavior: 'auto' }}>
            <div className="flex items-center gap-4 px-4" style={{ width: 'max-content' }}>
              {renderRowContent(rowMessages[0], 'right')}
            </div>
          </div>
          <div ref={scrollRef2} className="overflow-x-auto overflow-y-hidden no-scrollbar py-2" style={{ scrollBehavior: 'auto' }}>
            <div className="flex items-center gap-4 px-4" style={{ width: 'max-content' }}>
              {renderRowContent(rowMessages[1], 'left')}
            </div>
          </div>
          <div ref={scrollRef3} className="overflow-x-auto overflow-y-hidden no-scrollbar py-2" style={{ scrollBehavior: 'auto' }}>
            <div className="flex items-center gap-4 px-4" style={{ width: 'max-content' }}>
              {renderRowContent(rowMessages[2], 'right')}
            </div>
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

/* ===== Social Media Matrix - 2列布局，支持增删改 ===== */
function SocialMatrix() {
  const [accounts, setAccounts] = useState(socialAccounts)
  const [selectedAccount, setSelectedAccount] = useState<typeof socialAccounts[0] | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [editForm, setEditForm] = useState({
    platform: '',
    username: '',
    url: '',
    followers: '',
    icon: 'github',
    color: '#3b82f6'
  })

  const handleAdd = () => {
    setIsAdding(true)
    setIsEditing(false)
    setSelectedAccount(null)
    setEditForm({ platform: '', username: '', url: '', followers: '', icon: 'github', color: '#3b82f6' })
  }

  const handleEdit = (account: typeof socialAccounts[0]) => {
    setSelectedAccount(account)
    setIsEditing(true)
    setIsAdding(false)
    setEditForm({
      platform: account.platform,
      username: account.username,
      url: account.url,
      followers: account.followers,
      icon: account.icon,
      color: account.color
    })
  }

  const handleDelete = (platform: string) => {
    if (confirm('确定要删除这个平台吗？')) {
      setAccounts(prev => prev.filter(a => a.platform !== platform))
    }
  }

  const handleSave = () => {
    if (!editForm.platform.trim() || !editForm.url.trim()) return

    if (isAdding) {
      const newAccount = {
        ...editForm,
        followers: editForm.followers || '0'
      }
      setAccounts(prev => [...prev, newAccount])
    } else if (selectedAccount) {
      setAccounts(prev => prev.map(a =>
        a.platform === selectedAccount.platform
          ? { ...a, ...editForm, followers: editForm.followers || a.followers }
          : a
      ))
    }
    closeModal()
  }

  const closeModal = () => {
    setSelectedAccount(null)
    setIsEditing(false)
    setIsAdding(false)
  }

  const openAccountDetail = (account: typeof socialAccounts[0]) => {
    setSelectedAccount(account)
    setIsEditing(false)
    setIsAdding(false)
  }

  return (
    <div>
      {/* 添加按钮 */}
      <div className="mb-6">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAdd}
          className="px-5 py-3 rounded-xl bg-primary text-white font-medium flex items-center gap-2 hover:bg-primary-dim transition-colors"
        >
          <Plus size={20} />
          新增平台
        </motion.button>
      </div>

      {/* 2列网格布局 */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-3">
        {accounts.map((account, index) => {
          const Icon = platformIcons[account.icon] || ExternalLink
          return (
            <motion.div
              key={account.platform}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => openAccountDetail(account)}
              className="glass-card p-5 group cursor-pointer hover:border-primary/30 transition-all"
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
                  查看详情 →
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* 详情/编辑弹窗 */}
      <AnimatePresence>
        {selectedAccount && (
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
              className="bg-surface rounded-2xl p-6 w-full max-w-md"
              onClick={e => e.stopPropagation()}
            >
              {isEditing || isAdding ? (
                // 编辑/添加表单
                <>
                  <h3 className="text-xl font-semibold mb-4">{isAdding ? '新增平台' : '编辑平台'}</h3>
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="平台名称"
                      value={editForm.platform}
                      onChange={e => setEditForm({ ...editForm, platform: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-bg border border-border text-sm"
                    />
                    <input
                      type="text"
                      placeholder="用户名"
                      value={editForm.username}
                      onChange={e => setEditForm({ ...editForm, username: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-bg border border-border text-sm"
                    />
                    <input
                      type="text"
                      placeholder="网址"
                      value={editForm.url}
                      onChange={e => setEditForm({ ...editForm, url: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-bg border border-border text-sm"
                    />
                    <input
                      type="text"
                      placeholder="粉丝数"
                      value={editForm.followers}
                      onChange={e => setEditForm({ ...editForm, followers: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-bg border border-border text-sm"
                    />
                    <select
                      value={editForm.icon}
                      onChange={e => setEditForm({ ...editForm, icon: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-bg border border-border text-sm"
                    >
                      <option value="github">GitHub</option>
                      <option value="twitter">Twitter</option>
                      <option value="edit">博客</option>
                      <option value="play">视频</option>
                      <option value="message">社区</option>
                      <option value="zap">其他</option>
                    </select>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-text-muted">颜色:</span>
                      <input
                        type="color"
                        value={editForm.color}
                        onChange={e => setEditForm({ ...editForm, color: e.target.value })}
                        className="w-12 h-10 rounded-lg cursor-pointer"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={closeModal}
                      className="flex-1 py-3 rounded-xl bg-surface border border-border text-sm font-medium"
                    >
                      取消
                    </button>
                    <button
                      onClick={handleSave}
                      className="flex-1 py-3 rounded-xl bg-primary text-white text-sm font-medium"
                    >
                      保存
                    </button>
                  </div>
                </>
              ) : (
                // 详情展示
                <>
                  <div className="flex items-center gap-4 mb-6">
                    <div
                      className="w-16 h-16 rounded-xl flex items-center justify-center"
                      style={{ background: `${selectedAccount.color}22` }}
                    >
                      {(() => {
                        const Icon = platformIcons[selectedAccount.icon] || ExternalLink
                        return <Icon size={28} style={{ color: selectedAccount.color }} />
                      })()}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{selectedAccount.platform}</h3>
                      <p className="text-sm text-text-muted">{selectedAccount.username}</p>
                      <p className="text-lg font-bold text-text mt-1">{selectedAccount.followers} 粉丝</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <a
                      href={selectedAccount.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-3 rounded-xl bg-primary text-white text-sm font-medium text-center"
                    >
                      访问主页
                    </a>
                    <button
                      onClick={() => handleEdit(selectedAccount)}
                      className="py-3 px-6 rounded-xl bg-surface border border-border text-sm font-medium"
                    >
                      编辑
                    </button>
                    <button
                      onClick={() => handleDelete(selectedAccount.platform)}
                      className="py-3 px-6 rounded-xl bg-rose/10 text-rose text-sm font-medium"
                    >
                      删除
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
                {accounts.slice(0, 3).map((acc) => {
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

/* ===== Mobile Components ===== */

// 移动端菜单项配置
const mobileMenuItems = [
  { id: 'friends' as const, label: '友链', description: '连接志同道合的朋友', icon: Link2, color: '#3b82f6' },
  { id: 'danmaku' as const, label: '留言墙', description: '留下你的足迹和祝福', icon: MessageCircle, color: '#ec4899' },
  { id: 'timeline' as const, label: '成长时间轴', description: '记录学习与成长历程', icon: Clock, color: '#10b981' },
  { id: 'social' as const, label: '自媒体矩阵', description: '关注我的社交媒体', icon: Share2, color: '#f59e0b' },
]

// 移动端顶部用户信息组件
function MobileUserHeader({ userProfile, onEdit }: { userProfile: ProfileData; onEdit: () => void }) {
  return (
    <div 
      className="relative px-4 pt-12 pb-8 rounded-b-3xl overflow-hidden"
      style={{
        background: userProfile.background 
          ? `url(${userProfile.background}) center/cover no-repeat`
          : undefined
      }}
    >
      {/* 背景遮罩层 */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-primary to-primary-dim"
        style={{ opacity: userProfile.background ? 0.85 : 1 }}
      />
      <div className="relative flex items-center gap-4">
        <div className="w-16 h-16 rounded-full overflow-hidden bg-white/20 flex items-center justify-center text-white text-2xl font-bold border-2 border-white/30">
          {userProfile.avatar ? (
            <img src={userProfile.avatar} alt="avatar" className="w-full h-full object-cover" />
          ) : (
            '叶'
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white">{userProfile.name}</h2>
            <span className="px-2 py-0.5 rounded-full bg-green-400/90 text-white text-xs font-medium">
              已认证
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-white/70 text-sm">ID 33a4****c533</span>
            <button className="px-2 py-0.5 rounded bg-white/20 text-white text-xs">
              复制
            </button>
          </div>
        </div>
        <button 
          onClick={onEdit}
          className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
        >
          <Edit2 size={18} />
        </button>
      </div>
    </div>
  )
}

// 移动端数字名片入口卡片
function DigitalCardEntry({ onOpen }: { onOpen: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-4 -mt-4"
    >
      <div className="glass-card p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <IdCard size={20} className="text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-text">生成个人数字名片</h3>
            <p className="text-xs text-text-muted mt-0.5">智能整合你的精彩瞬间</p>
          </div>
        </div>
        <button 
          onClick={onOpen}
          className="px-4 py-1.5 rounded-full bg-primary text-white text-sm font-medium active:scale-95 transition-transform"
        >
          生成
        </button>
      </div>
    </motion.div>
  )
}

// 移动端菜单主界面
function MobileMenu({ onNavigate, userProfile, onEditProfile }: { onNavigate: (view: TabId | 'menu') => void; userProfile: ProfileData; onEditProfile: () => void }) {
  const [showCardModal, setShowCardModal] = useState(false)
  const [showHistoryModal, setShowHistoryModal] = useState(false)
  const [showThemePanel, setShowThemePanel] = useState(false)
  const { currentTheme, setTheme, themeConfig } = useTheme()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-bg"
    >
      <MobileUserHeader userProfile={userProfile} onEdit={onEditProfile} />
      <DigitalCardEntry onOpen={() => setShowCardModal(true)} />
      
      {/* 功能菜单列表 */}
      <div className="px-4 mt-6 space-y-2">
        {/* 主题风格选择入口 - 放在最上方 */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0 * 0.05 }}
          onClick={() => setShowThemePanel(true)}
          className="w-full flex items-center gap-4 p-4 rounded-2xl bg-surface border border-border/50 active:scale-[0.98] transition-transform"
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-purple-500/15">
            <Palette size={20} className="text-purple-500" />
          </div>
          <div className="flex-1 text-left">
            <h3 className="font-medium text-text">主题风格</h3>
            <p className="text-xs text-text-muted mt-0.5">切换界面主题样式</p>
          </div>
          <ChevronRight size={18} className="text-text-dim" />
        </motion.button>
        
        {mobileMenuItems.map((item, index) => (
          <motion.button
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: (index + 1) * 0.05 }}
            onClick={() => onNavigate(item.id)}
            className="w-full flex items-center gap-4 p-4 rounded-2xl bg-surface border border-border/50 active:scale-[0.98] transition-transform"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: `${item.color}15` }}
            >
              <item.icon size={20} style={{ color: item.color }} />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-medium text-text">{item.label}</h3>
              <p className="text-xs text-text-muted mt-0.5">{item.description}</p>
            </div>
            <ChevronRight size={18} className="text-text-dim" />
          </motion.button>
        ))}
        
        {/* 名片历史记录入口 */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: (mobileMenuItems.length + 1) * 0.05 }}
          onClick={() => setShowHistoryModal(true)}
          className="w-full flex items-center gap-4 p-4 rounded-2xl bg-surface border border-border/50 active:scale-[0.98] transition-transform"
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-amber-500/15">
            <History size={20} className="text-amber-500" />
          </div>
          <div className="flex-1 text-left">
            <h3 className="font-medium text-text">名片历史记录</h3>
            <p className="text-xs text-text-muted mt-0.5">查看和管理已生成的名片</p>
          </div>
          <ChevronRight size={18} className="text-text-dim" />
        </motion.button>
      </div>

      {/* 数字名片弹窗 */}
      <AnimatePresence>
        {showCardModal && (
          <DigitalCardModal 
            onClose={() => setShowCardModal(false)} 
            onOpenHistory={() => {
              setShowCardModal(false)
              setShowHistoryModal(true)
            }}
          />
        )}
      </AnimatePresence>

      {/* 历史记录弹窗 */}
      <AnimatePresence>
        {showHistoryModal && (
          <CardHistoryModal onClose={() => setShowHistoryModal(false)} />
        )}
      </AnimatePresence>

      {/* 主题选择面板 */}
      <ThemeSelectorPanel
        isOpen={showThemePanel}
        onClose={() => setShowThemePanel(false)}
        currentTheme={currentTheme}
        themeConfig={themeConfig}
        onThemeChange={setTheme}
      />
    </motion.div>
  )
}

// 移动端页面头部
function MobilePageHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div className="sticky top-0 z-40 glass border-b border-border/50 px-4 py-3 flex items-center gap-3">
      <button
        onClick={onBack}
        className="p-2 -ml-2 rounded-lg hover:bg-surface/60 transition-colors"
      >
        <ArrowLeft size={20} className="text-text" />
      </button>
      <h1 className="text-lg font-semibold text-text">{title}</h1>
    </div>
  )
}

// 移动端友链页面 - 2列网格布局，支持增删改
function MobileFriendLinks({ onBack }: { onBack: () => void }) {
  const [links, setLinks] = useState(friendLinks)
  const [selectedLink, setSelectedLink] = useState<typeof friendLinks[0] | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editForm, setEditForm] = useState({
    name: '',
    url: '',
    description: '',
    initials: '',
    color: '#3b82f6'
  })

  const handleAdd = () => {
    setIsAdding(true)
    setIsEditing(false)
    setEditForm({ name: '', url: '', description: '', initials: '', color: '#3b82f6' })
    setShowModal(true)
  }

  const handleEdit = (link: typeof friendLinks[0]) => {
    setSelectedLink(link)
    setIsEditing(true)
    setIsAdding(false)
    setEditForm({
      name: link.name,
      url: link.url,
      description: link.description,
      initials: link.initials,
      color: link.color
    })
    setShowModal(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这个友链吗？')) {
      setLinks(prev => prev.filter(l => l.id !== id))
    }
  }

  const handleSave = () => {
    if (!editForm.name.trim() || !editForm.url.trim()) return

    if (isAdding) {
      const newLink = {
        id: `fl-${crypto.randomUUID()}`,
        ...editForm,
        initials: editForm.initials || editForm.name.slice(0, 2).toUpperCase()
      }
      setLinks(prev => [...prev, newLink])
    } else if (selectedLink) {
      setLinks(prev => prev.map(l =>
        l.id === selectedLink.id
          ? { ...l, ...editForm, initials: editForm.initials || editForm.name.slice(0, 2).toUpperCase() }
          : l
      ))
    }
    closeModal()
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedLink(null)
    setIsEditing(false)
    setIsAdding(false)
  }

  const openLinkDetail = (link: typeof friendLinks[0]) => {
    setSelectedLink(link)
    setIsEditing(false)
    setIsAdding(false)
    setShowModal(true)
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="min-h-screen bg-bg"
    >
      <MobilePageHeader title="友链" onBack={onBack} />
      
      {/* 添加按钮 */}
      <div className="px-4 pt-4">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleAdd}
          className="w-full py-3 rounded-xl bg-primary text-white font-medium flex items-center justify-center gap-2"
        >
          <Plus size={20} />
          新增友链
        </motion.button>
      </div>

      {/* 2列网格布局 */}
      <div className="p-4 grid grid-cols-2 gap-3">
        {links.map((friend, index) => (
          <motion.div
            key={friend.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
            onClick={() => openLinkDetail(friend)}
            className="glass-card p-3 active:scale-[0.98] transition-transform cursor-pointer"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold mb-2"
              style={{
                background: `linear-gradient(135deg, ${friend.color}44, ${friend.color}11)`,
                color: friend.color,
              }}
            >
              {friend.initials}
            </div>
            <h3 className="font-medium text-text text-sm line-clamp-1">{friend.name}</h3>
            <p className="text-xs text-text-muted mt-0.5 line-clamp-2">{friend.description}</p>
          </motion.div>
        ))}
      </div>

      {/* 详情/编辑弹窗 */}
      <AnimatePresence>
        {showModal && (
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
              className="bg-surface rounded-2xl p-5 w-full max-w-sm"
              onClick={e => e.stopPropagation()}
            >
              {isEditing || isAdding ? (
                // 编辑/添加表单
                <>
                  <h3 className="text-lg font-semibold mb-4">{isAdding ? '新增友链' : '编辑友链'}</h3>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="名称"
                      value={editForm.name}
                      onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-bg border border-border text-sm"
                    />
                    <input
                      type="text"
                      placeholder="网址"
                      value={editForm.url}
                      onChange={e => setEditForm({ ...editForm, url: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-bg border border-border text-sm"
                    />
                    <input
                      type="text"
                      placeholder="描述"
                      value={editForm.description}
                      onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-bg border border-border text-sm"
                    />
                    <input
                      type="text"
                      placeholder="缩写（可选）"
                      value={editForm.initials}
                      onChange={e => setEditForm({ ...editForm, initials: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-bg border border-border text-sm"
                    />
                    <input
                      type="color"
                      value={editForm.color}
                      onChange={e => setEditForm({ ...editForm, color: e.target.value })}
                      className="w-full h-10 rounded-lg cursor-pointer"
                    />
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={closeModal}
                      className="flex-1 py-2 rounded-lg bg-surface border border-border text-sm"
                    >
                      取消
                    </button>
                    <button
                      onClick={handleSave}
                      className="flex-1 py-2 rounded-lg bg-primary text-white text-sm"
                    >
                      保存
                    </button>
                  </div>
                </>
              ) : (
                // 详情展示
                <>
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center text-lg font-bold"
                      style={{
                        background: `linear-gradient(135deg, ${selectedLink!.color}44, ${selectedLink!.color}11)`,
                        color: selectedLink!.color,
                      }}
                    >
                      {selectedLink!.initials}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{selectedLink!.name}</h3>
                      <p className="text-sm text-text-muted">{selectedLink!.description}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={selectedLink!.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2 rounded-lg bg-primary text-white text-sm text-center"
                    >
                      访问网站
                    </a>
                    <button
                      onClick={() => handleEdit(selectedLink!)}
                      className="py-2 px-4 rounded-lg bg-surface border border-border text-sm"
                    >
                      编辑
                    </button>
                    <button
                      onClick={() => handleDelete(selectedLink!.id)}
                      className="py-2 px-4 rounded-lg bg-rose/10 text-rose text-sm"
                    >
                      删除
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// 移动端留言墙页面 - 3行滚动，方向交替
function MobileDanmakuWall({ onBack }: { onBack: () => void }) {
  const [newMessage, setNewMessage] = useState('')
  const [authorName, setAuthorName] = useState('')
  const [selectedColor, setSelectedColor] = useState<StickerColor>(stickerColors[0])
  const [selectedSticker, setSelectedSticker] = useState<StickerMessage | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState('')
  const [editAuthor, setEditAuthor] = useState('')
  const scrollRef1 = useRef<HTMLDivElement>(null)
  const scrollRef2 = useRef<HTMLDivElement>(null)
  const scrollRef3 = useRef<HTMLDivElement>(null)

  const [messages, setMessages] = useState<StickerMessage[]>(() =>
    danmakuMessages.map((msg, index) => ({
      ...msg,
      rotation: (Math.random() - 0.5) * 4,
      createdAt: Date.now() - index * 10000,
      color: stickerColors[index % stickerColors.length],
    }))
  )

  // 3行滚动动画 - 第1行向右，第2行向左，第3行向右
  useEffect(() => {
    const animateScroll = (
      container: HTMLDivElement | null,
      direction: 'left' | 'right',
      speed: number
    ) => {
      if (!container) return () => {}
      
      let animationId: number
      let scrollPos = container.scrollLeft
      const maxScroll = container.scrollWidth - container.clientWidth
      
      // 初始化位置
      if (direction === 'left') {
        scrollPos = 0
      } else {
        scrollPos = maxScroll
      }
      container.scrollLeft = scrollPos
      
      const animate = () => {
        if (direction === 'left') {
          scrollPos += speed
          if (scrollPos >= maxScroll) {
            scrollPos = 0
          }
        } else {
          scrollPos -= speed
          if (scrollPos <= 0) {
            scrollPos = maxScroll
          }
        }
        container.scrollLeft = scrollPos
        animationId = requestAnimationFrame(animate)
      }
      
      animationId = requestAnimationFrame(animate)
      return () => cancelAnimationFrame(animationId)
    }

    const cleanup1 = animateScroll(scrollRef1.current, 'right', 0.3)
    const cleanup2 = animateScroll(scrollRef2.current, 'left', 0.4)
    const cleanup3 = animateScroll(scrollRef3.current, 'right', 0.35)
    
    return () => {
      cleanup1()
      cleanup2()
      cleanup3()
    }
  }, [messages.length])

  // 将消息分成3组
  const row1Messages = messages.filter((_, i) => i % 3 === 0)
  const row2Messages = messages.filter((_, i) => i % 3 === 1)
  const row3Messages = messages.filter((_, i) => i % 3 === 2)

  const handleSend = () => {
    if (!newMessage.trim()) return
    
    const newMsg: StickerMessage = {
      id: `sticker-${crypto.randomUUID()}`,
      text: newMessage.trim(),
      author: authorName.trim() || '匿名访客',
      color: selectedColor,
      rotation: (Math.random() - 0.5) * 4,
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

  // 渲染单行滚动
  const renderScrollRow = (
    rowMessages: StickerMessage[],
    scrollRef: React.RefObject<HTMLDivElement | null>,
    direction: 'left' | 'right'
  ) => {
    const duplicated = [...rowMessages, ...rowMessages, ...rowMessages, ...rowMessages]
    return (
      <div 
        ref={scrollRef}
        className="overflow-x-auto overflow-y-hidden no-scrollbar py-2"
        style={{ scrollBehavior: 'auto' }}
      >
        <div className="flex items-center gap-3 px-4" style={{ width: 'max-content' }}>
          {duplicated.map((msg, index) => (
            <motion.div
              key={`${msg.id}-${index}-${direction}`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: (index % rowMessages.length) * 0.02 }}
              className="flex-shrink-0"
              onClick={() => handleStickerClick(msg)}
            >
              <div
                className="px-3 py-2 rounded-xl shadow-md active:scale-95 transition-transform"
                style={{
                  backgroundColor: msg.color.bg,
                  border: `2px solid ${msg.color.border}`,
                  color: msg.color.text,
                  transform: `rotate(${msg.rotation}deg)`,
                  minWidth: '100px',
                  maxWidth: '160px',
                }}
              >
                <p className="text-xs font-medium leading-relaxed mb-1 line-clamp-2">
                  {msg.text}
                </p>
                <div className="flex items-center justify-between text-[10px] opacity-70 gap-2">
                  <span className="truncate">—— {msg.author}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="min-h-screen bg-bg"
    >
      <MobilePageHeader title="留言墙" onBack={onBack} />
      
      {/* 3行滚动贴纸墙 */}
      <div className="mt-4 space-y-1">
        {renderScrollRow(row1Messages, scrollRef1, 'right')}
        {renderScrollRow(row2Messages, scrollRef2, 'left')}
        {renderScrollRow(row3Messages, scrollRef3, 'right')}
      </div>

      {/* 输入区域 */}
      <div className="px-4 mt-4">
        <div className="glass-card p-4">
          <p className="text-text-muted text-xs text-center mb-3">留下你的足迹，选一张贴纸</p>
          
          <input
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="你的昵称（选填）"
            className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-all mb-2"
          />
          
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="写下你想说的话..."
            rows={2}
            className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-all resize-none mb-3"
          />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              {stickerColors.map((color, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedColor(color)}
                  className={`w-6 h-6 rounded-full border-2 transition-all ${
                    selectedColor === color 
                      ? 'ring-2 ring-primary ring-offset-1 scale-110' 
                      : ''
                  }`}
                  style={{ 
                    backgroundColor: color.bg,
                    borderColor: color.border 
                  }}
                />
              ))}
            </div>
            
            <button
              onClick={handleSend}
              disabled={!newMessage.trim()}
              className="px-4 py-1.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dim transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              <Send size={12} />
              发送
            </button>
          </div>
        </div>
        
        <p className="text-center text-xs text-text-muted mt-3">
          已有 {messages.length} 张贴纸 · 快来留下你的足迹
        </p>
      </div>

      {/* 贴纸详情弹窗 */}
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
              className="glass-card w-full max-w-sm overflow-hidden"
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: selectedSticker.color.bg,
                border: `2px solid ${selectedSticker.color.border}`,
              }}
            >
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

              <div className="p-4">
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
                        className="flex-1 py-2 rounded-lg bg-primary text-white text-sm font-medium"
                      >
                        保存
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="flex-1 py-2 rounded-lg bg-surface text-text text-sm font-medium"
                      >
                        取消
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p 
                      className="text-base font-medium leading-relaxed mb-3"
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
    </motion.div>
  )
}

// 移动端成长时间轴页面
function MobileGrowthTimeline({ onBack }: { onBack: () => void }) {
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
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="min-h-screen bg-bg"
    >
      <MobilePageHeader title="成长时间轴" onBack={onBack} />
      
      {/* 头部信息 */}
      <div className="px-4 py-4 flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-primary/20">
          <Clock size={22} className="text-primary" />
        </div>
        <div>
          <h2 className="font-bold text-text">时间线</h2>
          <p className="text-xs text-text-muted">The soul is walking</p>
        </div>
      </div>

      {/* 时间轴网格 */}
      <div className="px-4 pb-6">
        <div className="grid grid-cols-2 gap-3">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className="glass-card overflow-hidden active:scale-[0.98] transition-transform"
              onClick={() => handleCardClick(event, index)}
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-surface">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-white/90 flex items-center justify-center text-xs font-bold text-text shadow-lg">
                  {index + 1}
                </div>
              </div>
              <div className="p-2.5">
                <h3 className="text-xs font-semibold text-text line-clamp-1">
                  {event.title}
                </h3>
                <p className="text-[10px] text-text-muted line-clamp-1 mt-0.5">
                  {event.description}
                </p>
                <div className="flex items-center gap-1 text-[9px] text-text-dim mt-1">
                  <Calendar size={8} />
                  <span className="truncate">{event.date}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 底部 */}
      <div className="text-center py-4">
        <div className="inline-flex items-center gap-2 text-text-muted text-xs">
          <Award size={12} className="text-accent" />
          未来可期，故事继续
        </div>
      </div>

      {/* 详情弹窗 */}
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
              className="glass-card w-full max-w-sm overflow-hidden max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-video">
                <img
                  src={isEditing ? editImage : selectedEvent.image}
                  alt={selectedEvent.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <button 
                  onClick={closeModal}
                  className="absolute top-3 right-3 p-2 rounded-full bg-black/30 text-white"
                >
                  <X size={16} />
                </button>
                <div className="absolute bottom-3 left-3 w-8 h-8 rounded-lg bg-white/90 flex items-center justify-center text-sm font-bold text-text shadow-lg">
                  {selectedIndex + 1}
                </div>
              </div>

              <div className="p-4">
                {isEditing ? (
                  <div className="space-y-3">
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
                        className="flex-1 py-2 rounded-lg bg-primary text-white text-sm font-medium"
                      >
                        保存修改
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="flex-1 py-2 rounded-lg bg-surface text-text text-sm font-medium border border-border"
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
                      <Calendar size={10} />
                      <span>{selectedEvent.date}</span>
                    </div>
                    <h3 className="text-base font-bold text-text mb-2">{selectedEvent.title}</h3>
                    <p className="text-sm text-text-secondary leading-relaxed mb-4">
                      {selectedEvent.description}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex-1 py-2 rounded-lg bg-primary/10 text-primary text-sm font-medium flex items-center justify-center gap-1.5"
                      >
                        <Edit2 size={14} />
                        编辑
                      </button>
                      <button
                        onClick={handleDelete}
                        className="flex-1 py-2 rounded-lg bg-rose/10 text-rose text-sm font-medium flex items-center justify-center gap-1.5"
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
    </motion.div>
  )
}

// 移动端自媒体矩阵页面
function MobileSocialMatrix({ onBack }: { onBack: () => void }) {
  const [accounts, setAccounts] = useState(socialAccounts)
  const [selectedAccount, setSelectedAccount] = useState<typeof socialAccounts[0] | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editForm, setEditForm] = useState({
    platform: '',
    username: '',
    url: '',
    followers: '',
    icon: 'github',
    color: '#3b82f6'
  })

  const handleAdd = () => {
    setIsAdding(true)
    setIsEditing(false)
    setEditForm({ platform: '', username: '', url: '', followers: '', icon: 'github', color: '#3b82f6' })
    setShowModal(true)
  }

  const handleEdit = (account: typeof socialAccounts[0]) => {
    setSelectedAccount(account)
    setIsEditing(true)
    setIsAdding(false)
    setEditForm({
      platform: account.platform,
      username: account.username,
      url: account.url,
      followers: account.followers,
      icon: account.icon,
      color: account.color
    })
    setShowModal(true)
  }

  const handleDelete = (platform: string) => {
    if (confirm('确定要删除这个平台吗？')) {
      setAccounts(prev => prev.filter(a => a.platform !== platform))
      setSelectedAccount(null)
    }
  }

  const handleSave = () => {
    if (!editForm.platform.trim() || !editForm.url.trim()) return

    if (isAdding) {
      const newAccount = {
        ...editForm,
        followers: editForm.followers || '0'
      }
      setAccounts(prev => [...prev, newAccount])
    } else if (selectedAccount) {
      setAccounts(prev => prev.map(a =>
        a.platform === selectedAccount.platform
          ? { ...a, ...editForm, followers: editForm.followers || a.followers }
          : a
      ))
    }
    closeModal()
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedAccount(null)
    setIsEditing(false)
    setIsAdding(false)
  }

  const openAccountDetail = (account: typeof socialAccounts[0]) => {
    setSelectedAccount(account)
    setIsEditing(false)
    setIsAdding(false)
    setShowModal(true)
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="min-h-screen bg-bg"
    >
      <MobilePageHeader title="自媒体矩阵" onBack={onBack} />
      
      {/* 添加按钮 */}
      <div className="px-4 pt-4">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleAdd}
          className="w-full py-3 rounded-xl bg-primary text-white font-medium flex items-center justify-center gap-2"
        >
          <Plus size={20} />
          新增平台
        </motion.button>
      </div>

      {/* 2列网格布局 */}
      <div className="p-4 grid grid-cols-2 gap-3">
        {accounts.map((account, index) => {
          const Icon = platformIcons[account.icon] || ExternalLink
          return (
            <motion.div
              key={account.platform}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              onClick={() => openAccountDetail(account)}
              className="glass-card p-3 active:scale-[0.98] transition-transform cursor-pointer"
            >
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${account.color}22` }}
                >
                  <Icon size={20} style={{ color: account.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-text text-sm truncate">{account.platform}</h3>
                  <p className="text-xs text-text-muted truncate">{account.username}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-base font-bold text-text">{account.followers}</p>
                <p className="text-xs text-text-muted">粉丝</p>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* 详情/编辑弹窗 */}
      <AnimatePresence>
        {showModal && (
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
              className="bg-surface rounded-2xl p-5 w-full max-w-sm"
              onClick={e => e.stopPropagation()}
            >
              {isEditing || isAdding ? (
                // 编辑/添加表单
                <>
                  <h3 className="text-lg font-semibold mb-4">{isAdding ? '新增平台' : '编辑平台'}</h3>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="平台名称"
                      value={editForm.platform}
                      onChange={e => setEditForm({ ...editForm, platform: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-bg border border-border text-sm"
                    />
                    <input
                      type="text"
                      placeholder="用户名"
                      value={editForm.username}
                      onChange={e => setEditForm({ ...editForm, username: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-bg border border-border text-sm"
                    />
                    <input
                      type="text"
                      placeholder="网址"
                      value={editForm.url}
                      onChange={e => setEditForm({ ...editForm, url: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-bg border border-border text-sm"
                    />
                    <input
                      type="text"
                      placeholder="粉丝数"
                      value={editForm.followers}
                      onChange={e => setEditForm({ ...editForm, followers: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-bg border border-border text-sm"
                    />
                    <select
                      value={editForm.icon}
                      onChange={e => setEditForm({ ...editForm, icon: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-bg border border-border text-sm"
                    >
                      <option value="github">GitHub</option>
                      <option value="twitter">Twitter</option>
                      <option value="edit">博客</option>
                      <option value="play">视频</option>
                      <option value="message">社区</option>
                      <option value="zap">其他</option>
                    </select>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-text-muted">颜色:</span>
                      <input
                        type="color"
                        value={editForm.color}
                        onChange={e => setEditForm({ ...editForm, color: e.target.value })}
                        className="w-10 h-9 rounded-lg cursor-pointer"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-5">
                    <button
                      onClick={closeModal}
                      className="flex-1 py-2.5 rounded-xl bg-surface border border-border text-sm font-medium"
                    >
                      取消
                    </button>
                    <button
                      onClick={handleSave}
                      className="flex-1 py-2.5 rounded-xl bg-primary text-white text-sm font-medium"
                    >
                      保存
                    </button>
                  </div>
                </>
              ) : (
                // 详情展示
                <>
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center"
                      style={{ background: `${selectedAccount!.color}22` }}
                    >
                      {(() => {
                        const Icon = platformIcons[selectedAccount!.icon] || ExternalLink
                        return <Icon size={24} style={{ color: selectedAccount!.color }} />
                      })()}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{selectedAccount!.platform}</h3>
                      <p className="text-sm text-text-muted">{selectedAccount!.username}</p>
                      <p className="text-base font-bold text-text mt-0.5">{selectedAccount!.followers} 粉丝</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={selectedAccount!.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2.5 rounded-xl bg-primary text-white text-sm font-medium text-center"
                    >
                      访问主页
                    </a>
                    <button
                      onClick={() => handleEdit(selectedAccount!)}
                      className="py-2.5 px-4 rounded-xl bg-surface border border-border text-sm font-medium"
                    >
                      编辑
                    </button>
                    <button
                      onClick={() => handleDelete(selectedAccount!.platform)}
                      className="py-2.5 px-4 rounded-xl bg-rose/10 text-rose text-sm font-medium"
                    >
                      删除
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 分享名片 */}
      <div className="px-4 mt-6">
        <h3 className="text-sm font-semibold text-text mb-3 flex items-center gap-2">
          <Share2 size={16} className="text-primary" />
          分享名片
        </h3>
        <div className="glass-card p-4">
          <div className="bg-gradient-to-br from-primary/20 via-surface to-rose/10 rounded-xl p-4 border border-primary/10">
            <div className="flex items-center gap-3 mb-3">
              <img
                src="/avatar.png"
                alt="头像"
                className="w-12 h-12 rounded-xl object-cover ring-2 ring-primary/20"
              />
              <div>
                <h4 className="font-bold text-text text-sm">小叶</h4>
                <p className="text-xs text-text-muted">全栈开发者 / 创意设计师</p>
              </div>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed mb-3">
              用代码编织梦想，用设计点亮生活
            </p>
            <div className="flex items-center justify-between">
              <div className="flex gap-1.5">
                {accounts.slice(0, 3).map((acc) => {
                  const I = platformIcons[acc.icon] || ExternalLink
                  return (
                    <div
                      key={acc.platform}
                      className="w-6 h-6 rounded-md flex items-center justify-center"
                      style={{ background: `${acc.color}22` }}
                    >
                      <I size={12} style={{ color: acc.color }} />
                    </div>
                  )
                })}
              </div>
              <div className="w-12 h-12 rounded-lg bg-surface border border-border flex items-center justify-center text-text-dim text-[10px]">
                QR
              </div>
            </div>
          </div>
          <button className="w-full mt-3 py-2 rounded-xl bg-primary/10 text-primary text-sm font-medium border border-primary/20">
            复制分享链接
          </button>
        </div>
      </div>
    </motion.div>
  )
}

/* ===== Digital Card Components ===== */

// 简单的雷达图组件
function SimpleRadarChart({ skills, theme }: { skills: { name: string; level: number }[], theme: { primary: string; secondary: string } }) {
  const size = 120
  const center = size / 2
  const radius = 45
  const angleStep = (Math.PI * 2) / skills.length
  
  const points = skills.map((skill, i) => {
    const angle = i * angleStep - Math.PI / 2
    const r = (skill.level / 100) * radius
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
      labelX: center + (radius + 15) * Math.cos(angle),
      labelY: center + (radius + 15) * Math.sin(angle),
    }
  })
  
  const polygonPoints = points.map(p => `${p.x},${p.y}`).join(' ')
  
  return (
    <svg width={size} height={size} className="mx-auto">
      {/* Background circles */}
      {[0.2, 0.4, 0.6, 0.8, 1].map((scale, i) => (
        <circle
          key={i}
          cx={center}
          cy={center}
          r={radius * scale}
          fill="none"
          stroke={theme.primary}
          strokeOpacity={0.1}
          strokeWidth={1}
        />
      ))}
      {/* Axes */}
      {skills.map((_, i) => {
        const angle = i * angleStep - Math.PI / 2
        const x2 = center + radius * Math.cos(angle)
        const y2 = center + radius * Math.sin(angle)
        return (
          <line
            key={i}
            x1={center}
            y1={center}
            x2={x2}
            y2={y2}
            stroke={theme.primary}
            strokeOpacity={0.2}
            strokeWidth={1}
          />
        )
      })}
      {/* Data polygon */}
      <polygon
        points={polygonPoints}
        fill={theme.primary}
        fillOpacity={0.3}
        stroke={theme.primary}
        strokeWidth={2}
      />
      {/* Data points */}
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={3} fill={theme.secondary} />
      ))}
    </svg>
  )
}

// 数字名片弹窗
function DigitalCardModal({ onClose }: { onClose: () => void; onOpenHistory?: () => void }) {
  const [card, setCard] = useState<DigitalCard>(() => generateDigitalCard('blue'))
  const [isGenerating, setIsGenerating] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const handleDownload = async () => {
    if (!cardRef.current) {
      alert('名片元素未找到')
      return
    }
    setIsGenerating(true)
    try {
      // 等待一帧确保渲染完成
      await new Promise(resolve => requestAnimationFrame(resolve))
      const imageUrl = await generateCardImage(cardRef.current, card.theme)
      downloadImage(imageUrl, `${card.name}-数字名片.png`)
      saveToHistory(card, imageUrl)
      alert('名片已下载并保存到历史记录')
    } catch (err) {
      console.error('下载失败:', err)
      alert('下载失败，请重试')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleShare = async () => {
    await wechatShare(card)
  }

  const theme = cardThemes[card.theme]

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-bg w-full max-w-md max-h-[90vh] rounded-t-3xl sm:rounded-3xl overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
            <h2 className="text-lg font-semibold text-text">个人数字名片</h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-surface/60">
              <X size={20} className="text-text" />
            </button>
          </div>

          {/* Card Preview */}
          <div className="flex-1 overflow-y-auto p-4">
            <div ref={cardRef} className="rounded-2xl overflow-hidden shadow-2xl bg-surface">
              {/* Card Header */}
              <div className={`bg-gradient-to-br ${theme.gradient} p-6 text-white`}>
                <div className="flex items-center gap-4">
                  <img 
                    src={card.avatar} 
                    alt={card.name}
                    className="w-16 h-16 rounded-full bg-white/20 border-2 border-white/30 object-cover"
                    crossOrigin="anonymous"
                  />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold">{card.name}</h3>
                    <p className="text-white/80 text-sm">{card.title_en}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm text-white/90 leading-relaxed">{card.bio}</p>
              </div>

              {/* Card Body */}
              <div className="bg-surface p-5 space-y-4">
                {/* Stats */}
                <div className="grid grid-cols-4 gap-2">
                  {card.stats.map((stat, i) => (
                    <div key={i} className="text-center">
                      <div className="text-lg font-bold" style={{ color: theme.primary }}>{stat.value}</div>
                      <div className="text-xs text-text-muted">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Skills with Radar Chart */}
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <h4 className="text-xs font-medium text-text-muted mb-2">技能分布</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {card.skills.map((skill, i) => (
                        <span 
                          key={i} 
                          className="px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary"
                        >
                          {skill.name} {skill.level}%
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="w-28">
                    <SimpleRadarChart skills={card.skills} theme={theme} />
                  </div>
                </div>

                {/* Projects with Images */}
                <div>
                  <h4 className="text-xs font-medium text-text-muted mb-2">精选项目</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {card.projects.map((project, i) => (
                      <div key={i} className={`${project.gradient} rounded-xl p-3 text-center`}>
                        <div className="text-2xl mb-1">{project.icon}</div>
                        <h5 className="text-xs font-medium text-white truncate">{project.title}</h5>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Milestones */}
                <div>
                  <h4 className="text-xs font-medium text-text-muted mb-2">成长里程碑</h4>
                  <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                    {card.milestones.map((milestone, i) => (
                      <div key={i} className="flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-lg bg-surface/50 border border-border/50">
                        <span className="text-lg">{milestone.icon}</span>
                        <div>
                          <div className="text-xs font-medium text-text">{milestone.title}</div>
                          <div className="text-[10px] text-text-muted">{milestone.date}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Social Links */}
                <div>
                  <h4 className="text-xs font-medium text-text-muted mb-2">社交账号</h4>
                  <div className="flex flex-wrap gap-2">
                    {card.socialLinks.map((link, i) => (
                      <div key={i} className="flex items-center gap-1 text-xs text-text-secondary bg-surface/50 px-2 py-1 rounded-lg">
                        <span className="text-text-muted">{link.platform}:</span>
                        <span>{link.username}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="pt-3 border-t border-border/50 flex items-center justify-between">
                  <span className="text-xs text-text-dim">小叶的个人空间</span>
                  <Sparkles size={14} className="text-primary" />
                </div>
              </div>
            </div>
          </div>

          {/* Actions - 简化为只有下载、分享、编辑 */}
          <div className="p-4 border-t border-border/50">
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={handleDownload}
                disabled={isGenerating}
                className="flex flex-col items-center gap-1.5 p-4 rounded-xl bg-primary/10 text-primary active:scale-95 transition-transform disabled:opacity-50"
              >
                {isGenerating ? <Loader2 size={24} className="animate-spin" /> : <Download size={24} />}
                <span className="text-sm font-medium">下载</span>
              </button>
              <button
                onClick={handleShare}
                className="flex flex-col items-center gap-1.5 p-4 rounded-xl bg-green-500/10 text-green-500 active:scale-95 transition-transform"
              >
                <Share size={24} />
                <span className="text-sm font-medium">分享</span>
              </button>
              <button
                onClick={() => setShowEditModal(true)}
                className="flex flex-col items-center gap-1.5 p-4 rounded-xl bg-amber-500/10 text-amber-500 active:scale-95 transition-transform"
              >
                <Palette size={24} />
                <span className="text-sm font-medium">编辑</span>
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Edit Modal */}
      <AnimatePresence>
        {showEditModal && (
          <DigitalCardEditModal
            card={card}
            onSave={(newCard) => {
              setCard(newCard)
              setShowEditModal(false)
            }}
            onClose={() => setShowEditModal(false)}
          />
        )}
      </AnimatePresence>
    </>
  )
}

// 名片编辑弹窗
function DigitalCardEditModal({ 
  card, 
  onSave, 
  onClose 
}: { 
  card: DigitalCard
  onSave: (card: DigitalCard) => void
  onClose: () => void 
}) {
  const [editedCard, setEditedCard] = useState<DigitalCard>(card)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleThemeChange = (theme: CardTheme) => {
    setEditedCard({ ...editedCard, theme })
  }

  const handleSave = () => {
    onSave({ ...editedCard, updatedAt: Date.now() })
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const result = event.target?.result as string
        setEditedCard({ ...editedCard, avatar: result })
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-60 flex items-end sm:items-center justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="bg-bg w-full max-w-md rounded-t-3xl sm:rounded-3xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
          <h2 className="text-lg font-semibold text-text">编辑名片</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-surface/60">
            <X size={20} className="text-text" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Avatar Upload */}
          <div>
            <h3 className="text-sm font-medium text-text mb-3">头像</h3>
            <div className="flex items-center gap-4">
              <img 
                src={editedCard.avatar} 
                alt="头像预览"
                className="w-16 h-16 rounded-full object-cover border-2 border-border"
              />
              <div className="flex-1">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 rounded-lg bg-surface border border-border text-sm text-text hover:bg-surface/80 transition-colors"
                >
                  上传新头像
                </button>
                <p className="text-xs text-text-muted mt-1">支持 JPG、PNG 格式</p>
              </div>
            </div>
          </div>

          {/* Theme Selection */}
          <div>
            <h3 className="text-sm font-medium text-text mb-3">选择主题</h3>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(cardThemes) as CardTheme[]).map((themeKey) => (
                <button
                  key={themeKey}
                  onClick={() => handleThemeChange(themeKey)}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    editedCard.theme === themeKey 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border/50 hover:border-border'
                  }`}
                >
                  <div className={`w-full h-8 rounded-lg bg-gradient-to-br ${cardThemes[themeKey].gradient} mb-2`} />
                  <span className="text-xs text-text">{cardThemes[themeKey].name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Title Edit */}
          <div>
            <h3 className="text-sm font-medium text-text mb-2">名片标题</h3>
            <input
              type="text"
              value={editedCard.title}
              onChange={(e) => setEditedCard({ ...editedCard, title: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm"
              placeholder="输入名片标题"
            />
          </div>

          {/* Subtitle Edit */}
          <div>
            <h3 className="text-sm font-medium text-text mb-2">职位/身份</h3>
            <input
              type="text"
              value={editedCard.title_en}
              onChange={(e) => setEditedCard({ ...editedCard, title_en: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm"
              placeholder="输入职位或身份"
            />
          </div>

          {/* Bio Edit */}
          <div>
            <h3 className="text-sm font-medium text-text mb-2">个人简介</h3>
            <textarea
              value={editedCard.bio}
              onChange={(e) => setEditedCard({ ...editedCard, bio: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm resize-none"
              placeholder="输入个人简介"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border/50 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-surface border border-border text-text text-sm font-medium"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-2.5 rounded-xl bg-primary text-white text-sm font-medium"
          >
            保存
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// 历史记录弹窗
function CardHistoryModal({ onClose }: { onClose: () => void }) {
  const [history, setHistory] = useState(() => getHistoryList())

  const handleDelete = (historyId: string) => {
    if (confirm('确定要删除这条记录吗？')) {
      deleteHistoryItem(historyId)
      setHistory(getHistoryList())
    }
  }

  const handleClearAll = () => {
    if (confirm('确定要清空所有历史记录吗？')) {
      localStorage.removeItem('digital_card_history')
      setHistory([])
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="bg-bg w-full max-w-md max-h-[80vh] rounded-t-3xl sm:rounded-3xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
          <h2 className="text-lg font-semibold text-text">名片历史记录</h2>
          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button 
                onClick={handleClearAll}
                className="text-xs text-rose-500 px-2 py-1 rounded-lg hover:bg-rose-500/10"
              >
                清空
              </button>
            )}
            <button onClick={onClose} className="p-2 rounded-full hover:bg-surface/60">
              <X size={20} className="text-text" />
            </button>
          </div>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto p-4">
          {history.length === 0 ? (
            <div className="text-center py-12">
              <History size={48} className="mx-auto mb-4 text-text-dim opacity-30" />
              <p className="text-text-muted">暂无历史记录</p>
              <p className="text-xs text-text-dim mt-1">生成的名片将保存在这里</p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="glass-card p-3 flex items-center gap-3"
                >
                  {item.previewImage ? (
                    <img 
                      src={item.previewImage} 
                      alt="名片预览" 
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
                      <IdCard size={24} className="text-primary" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text">数字名片</p>
                    <p className="text-xs text-text-muted">{formatRelativeTime(item.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {item.previewImage && (
                      <button
                        onClick={() => downloadImage(item.previewImage!, `名片-${item.id}.png`)}
                        className="p-2 rounded-lg hover:bg-surface/60 text-text-secondary"
                      >
                        <Download size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 rounded-lg hover:bg-rose-500/10 text-rose-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
