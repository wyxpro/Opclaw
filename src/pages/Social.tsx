import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Link2, MessageCircle, Clock, Share2, ExternalLink,
  Send, Github, Edit3, Twitter, Play, MessageSquare, Zap, Award,
  X, Trash2, Edit2, Calendar, ChevronRight, ArrowLeft,
  IdCard, Download, Share, History, Palette, Loader2, Plus, Star,
  Crown, Check, CreditCard, Shield, Settings, Info, FlaskConical,
  Rocket, Brain, Eye, Smartphone, Database, Layers, Wifi, Beaker,
  Sparkles, Heart, Music, Youtube, Instagram
} from 'lucide-react'
import PageTransition from '../components/ui/PageTransition'
import { ThemeSelectorPanel } from '../components/ui/ThemeSwitcher'
import { SettingsModal } from '../components/ui/SettingsModal'
import ProfileEditModal, { type ProfileData } from '../components/ProfileEditModal'
import AuthModal from '../components/auth/AuthModal'
import { ProfileTabContent } from '../components/profile/ProfileTabContent'
import NfcConnectModule from '../components/profile/NfcConnectModule'

function MobileProfileTabContent({ onBack }: { onBack: () => void }) {
  return (
    <div className="relative min-h-screen bg-bg pb-24 overflow-y-auto">
      <ProfileTabContent onBack={onBack} />
    </div>
  )
}

import { useTheme } from '../hooks/useTheme'
import { useAuth } from '../contexts/AuthContext'
import { friendLinks, danmakuMessages, socialAccounts, generateDigitalCard, cardThemes, type DigitalCard, type CardTheme, presetAvatars } from '../data/mock'
import { generateCardImage, downloadImage, saveToHistory, getHistoryList, deleteHistoryItem, wechatShare, formatRelativeTime } from '../lib/cardUtils'

const tabs = [
  { id: 'social', label: '个人主页', icon: IdCard },
  { id: 'danmaku', label: '留言墙', icon: MessageCircle },
  { id: 'laboratory', label: '实验室', icon: FlaskConical },
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
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<TabId>('social')
  const [mobileView, setMobileView] = useState<'menu' | TabId | 'laboratory'>('menu')
  const [showDesktopCardModal, setShowDesktopCardModal] = useState(false)
  const [showDesktopVipModal, setShowDesktopVipModal] = useState(false)
  const [showDesktopHistoryModal, setShowDesktopHistoryModal] = useState(false)
  const [showDesktopCardEditModal, setShowDesktopCardEditModal] = useState(false)
  const [editingCard, setEditingCard] = useState<DigitalCard | null>(null)
  const [selectedVipPlan, setSelectedVipPlan] = useState('yearly')
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [showAboutModal, setShowAboutModal] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [isCardModalReadonly, setIsCardModalReadonly] = useState(false)
  // 认证状态
  const { isAuthenticated, isLoading, user, updateUser } = useAuth()

  // 未登录时自动显示登录弹窗（等待 AuthContext 加载完成）
  useEffect(() => {
    if (isLoading) return
    if (!isAuthenticated && !showAuthModal) {
      const timer = setTimeout(() => {
        setShowAuthModal(true)
      }, 100)
      return () => clearTimeout(timer)
    }
    if (isAuthenticated && showAuthModal) {
      setShowAuthModal(false)
    }
  }, [isLoading, isAuthenticated, showAuthModal])

  // 用户资料状态 - 优先使用本地存储中的上次登录信息，避免刷新时先闪默认头像
  const [userProfile, setUserProfile] = useState<ProfileData>(() => {
    try {
      const stored = localStorage.getItem('opclaw_auth_data')
      if (stored) {
        const parsed = JSON.parse(stored) as { user?: { username?: string; email?: string; avatar?: string; backgroundUrl?: string; bio?: string; phone?: string } }
        const storedUser = parsed.user
        if (storedUser) {
          return {
            avatar: storedUser.avatar || presetAvatars[0].url,
            background: storedUser.backgroundUrl || null,
            name: storedUser.username || '晓叶',
            gender: 'male',
            age: 23,
            bio: storedUser.bio || '',
            phone: storedUser.phone || '',
            email: storedUser.email || '',
          }
        }
      }
    } catch {
      // ignore parse error, fall back to defaults
    }
    return {
      avatar: presetAvatars[0].url,
      background: 'https://copyright.bdstatic.com/vcg/creative/3e1471d9d1093bba28455470ae71e3f5.jpg@wm_1,k_cGljX2JqaHdhdGVyLmpwZw==',
      name: '晓叶',
      gender: 'male',
      age: 23,
      bio: '',
      phone: '',
      email: '',
    }
  })
  const [showProfileEditModal, setShowProfileEditModal] = useState(false)
  const { currentTheme } = useTheme()

  // 当认证状态变化时更新用户资料
  useEffect(() => {
    if (isAuthenticated && user) {
      setUserProfile(prev => {
        // 只在数据真正变化时才更新
        if (prev.name === user.username && prev.email === user.email) {
          return prev
        }
        return {
          ...prev,
          name: user.username,
          email: user.email,
          phone: user.phone || '',
          avatar: user.avatar || presetAvatars[0].url,
          bio: user.bio || '',
        }
      })
    }
  }, [isAuthenticated, user?.username, user?.email, user?.phone, user?.avatar, user?.bio])

  // 主题切换时自动更新背景
  useEffect(() => {
    const themeBackgrounds: Record<string, string> = {
      'minimal': 'https://copyright.bdstatic.com/vcg/creative/3e1471d9d1093bba28455470ae71e3f5.jpg@wm_1,k_cGljX2JqaHdhdGVyLmpwZw==',
      'cyber': 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=800&q=80',
      'artistic': 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&q=80',
      'cartoon': 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80',
      'retro': 'https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?w=800&q=80',
    }

    // 只有当用户没有自定义背景时，才根据主题自动设置
    const savedBackground = localStorage.getItem('userProfile_background')
    if (!savedBackground && themeBackgrounds[currentTheme]) {
      setUserProfile(prev => ({ ...prev, background: themeBackgrounds[currentTheme] }))
    }
  }, [currentTheme])

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
                  <img
                    src={userProfile.avatar}
                    alt=""
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                      const parent = (e.target as HTMLImageElement).parentElement;
                      if (parent && !parent.querySelector('.fallback-initial')) {
                        const span = document.createElement('span');
                        span.className = 'fallback-initial';
                        span.innerText = userProfile.name.charAt(0);
                        parent.appendChild(span);
                      }
                    }}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-white">{userProfile.name}</h2>
                    <span className="px-2 py-0.5 rounded-full bg-green-400/90 text-white text-xs font-medium">
                      已认证
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    {/* 性别标签 - 双向同步 & 精致配色 */}
                    <div className={`px-2.5 py-0.5 rounded-md backdrop-blur-md border flex items-center gap-1.5 shadow-sm transition-colors duration-300 ${userProfile.gender === 'male'
                        ? 'bg-blue-500/40 border-blue-400/30 text-blue-50'
                        : userProfile.gender === 'female'
                          ? 'bg-rose-500/40 border-rose-400/30 text-rose-50'
                          : 'bg-gray-500/30 border-gray-400/20 text-gray-100'
                      }`}>
                      <span className="text-xs font-bold">
                        {userProfile.gender === 'male' ? '♂' : userProfile.gender === 'female' ? '♀' : '?'}
                      </span>
                      <span className="text-xs font-medium tracking-wider">
                        {userProfile.gender === 'male' ? '男' : userProfile.gender === 'female' ? '女' : '保密'}
                      </span>
                    </div>

                    {/* 年龄标签 */}
                    <div className="px-2.5 py-0.5 rounded-md bg-violet-600/30 backdrop-blur-md border border-violet-400/20 shadow-sm">
                      <span className="text-xs text-white font-bold">
                        {userProfile.age || '??'} 岁
                      </span>
                    </div>
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
                {/* 桌面端VIP会员入口 */}
                <button
                  onClick={() => setShowDesktopVipModal(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-yellow-400 via-amber-400 to-amber-600 text-white font-medium hover:shadow-lg hover:scale-105 transition-all shadow-lg shadow-amber-500/40"
                >
                  <Crown size={18} />
                  <span>VIP会员</span>
                </button>
                {/* 桌面端数字名片入口 */}
                <button
                  onClick={() => {
                    setIsCardModalReadonly(false)
                    setShowDesktopCardModal(true)
                  }}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 text-white font-medium hover:shadow-lg hover:shadow-purple-500/30 hover:scale-105 transition-all border-0"
                >
                  <div className="w-5 h-5 rounded-md bg-white/20 flex items-center justify-center">
                    <Palette size={14} className="text-white" />
                  </div>
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
          className="flex gap-2 mb-6 sm:mb-8 overflow-x-auto no-scrollbar pb-2 items-center"
        >
          {tabs.map((tab, index) => (
            <div key={tab.id} className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${activeTab === tab.id
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
              
              {index === 0 && (
                <NfcConnectModule 
                  variant="tab"
                  onShowCard={(card) => {
                    setEditingCard(card)
                    setIsCardModalReadonly(true)
                    setShowDesktopCardModal(true)
                  }}
                />
              )}
            </div>
          ))}
          
          {/* 分隔线 */}
          <div className="w-px h-6 bg-border/50 mx-1 shrink-0" />
          {/* 系统设置按钮 */}
          <button
            onClick={() => setShowSettingsModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-text-muted hover:text-text-secondary hover:bg-surface/60 transition-all shrink-0 whitespace-nowrap"
          >
            <Settings size={16} />
            <span className="whitespace-nowrap">系统设置</span>
          </button>
          {/* 关于我们按钮 */}
          <button
            onClick={() => setShowAboutModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-text-muted hover:text-text-secondary hover:bg-surface/60 transition-all shrink-0 whitespace-nowrap"
          >
            <Info size={16} />
            <span className="whitespace-nowrap">关于我们</span>
          </button>
        </motion.div>

        <AnimatePresence mode="sync">
          {activeTab === 'danmaku' && (
            <motion.div key="danmaku" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
              <DanmakuWall />
            </motion.div>
          )}
          {activeTab === 'social' && (
            <motion.div key="social" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
              <ProfileTabContent />
            </motion.div>
          )}
          {activeTab === 'laboratory' && (
            <motion.div key="laboratory" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
              <LaboratoryContent />
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
                setShowDesktopHistoryModal(true)
              }}
              onOpenEdit={(card) => {
                setEditingCard(card)
                setShowDesktopCardEditModal(true)
              }}
              initialCard={editingCard || undefined}
              readonly={isCardModalReadonly}
            />
          )}
        </AnimatePresence>

        {/* 桌面端数字名片编辑弹窗 */}
        <AnimatePresence>
          {showDesktopCardEditModal && editingCard && (
            <DigitalCardEditModal
              card={editingCard}
              onSave={(newCard) => {
                setEditingCard(newCard)
                setShowDesktopCardEditModal(false)
                // 保存后重新打开名片弹窗显示更新后的数据
                setShowDesktopCardModal(true)
              }}
              onClose={() => setShowDesktopCardEditModal(false)}
            />
          )}
        </AnimatePresence>

        {/* 桌面端历史记录弹窗 */}
        <AnimatePresence>
          {showDesktopHistoryModal && (
            <CardHistoryModal onClose={() => setShowDesktopHistoryModal(false)} />
          )}
        </AnimatePresence>

        {/* 桌面端VIP会员弹窗 */}
        <AnimatePresence>
          {showDesktopVipModal && (
            <MembershipModal
              onClose={() => setShowDesktopVipModal(false)}
              selectedPlan={selectedVipPlan}
              onSelectPlan={setSelectedVipPlan}
              onPaymentSuccess={() => {
                alert('支付成功！您已成为VIP会员！')
                setShowDesktopVipModal(false)
              }}
            />
          )}
        </AnimatePresence>

      </div>

      {/* 移动端布局 - 个人中心样式 */}
      <div className="md:hidden min-h-screen pb-20">
        <AnimatePresence mode="sync">
          {mobileView === 'menu' ? (
            <MobileMenu
              key="menu"
              onNavigate={setMobileView}
              userProfile={userProfile}
              onEditProfile={() => setShowProfileEditModal(true)}
              onOpenSettings={() => setShowSettingsModal(true)}
              onOpenAbout={() => setShowAboutModal(true)}
            />
          ) : mobileView === 'danmaku' ? (
            <MobileDanmakuWall key="danmaku" onBack={() => setMobileView('menu')} />
          ) : mobileView === 'social' ? (
            <MobileProfileTabContent key="social" onBack={() => setMobileView('menu')} />
          ) : null}
        </AnimatePresence>
      </div>

      {/* 系统设置弹窗 - 桌面端和移动端共用 */}
      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
      />

      {/* 关于我们弹窗 */}
      <AboutModal
        isOpen={showAboutModal}
        onClose={() => setShowAboutModal(false)}
      />

      {/* 个人信息编辑弹窗 - 使用 key 确保重新挂载时同步最新数据 */}
      <ProfileEditModal
        key={showProfileEditModal ? `open-${userProfile.background || 'default'}` : 'closed'}
        isOpen={showProfileEditModal}
        onClose={() => setShowProfileEditModal(false)}
        initialData={userProfile}
        onSave={(data) => {
          setUserProfile(data)
          updateUser({
            username: data.name,
            gender: data.gender,
            age: data.age === '' ? undefined : data.age,
            bio: data.bio,
            phone: data.phone,
            email: data.email,
            avatar: data.avatar,
            backgroundUrl: data.background || undefined,
          })
        }}
      />

      {/* Auth Modal - 未登录时显示 */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultMode="login"
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
    setSelectedLink(null)
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
              ) : selectedLink ? (
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
              ) : null}
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
      if (!container) return () => { }

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
                className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 transition-all ${selectedColor === color
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
  const [isEditing, setIsEditing] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editImage, setEditImage] = useState('')
  const [editDate, setEditDate] = useState('')

  const handleCardClick = (event: TimelineEvent) => {
    setSelectedEvent(event)
    setEditTitle(event.title)
    setEditDescription(event.description)
    setEditImage(event.image)
    setEditDate(event.date)
    setIsEditing(false)
    setIsAdding(false)
    setShowModal(true)
  }

  const handleAdd = () => {
    setIsAdding(true)
    setIsEditing(false)
    setSelectedEvent(null)
    setEditTitle('')
    setEditDescription('')
    setEditImage('')
    setEditDate(new Date().toISOString().slice(0, 16).replace('T', ' '))
    setShowModal(true)
  }

  const handleEdit = () => {
    if (!selectedEvent || !editTitle.trim()) return

    setEvents(prev => prev.map(event =>
      event.id === selectedEvent.id
        ? { ...event, title: editTitle.trim(), description: editDescription.trim(), image: editImage, date: editDate }
        : event
    ))
    closeModal()
  }

  const handleSaveNew = () => {
    if (!editTitle.trim()) return

    const newEvent: TimelineEvent = {
      id: `event-${crypto.randomUUID()}`,
      title: editTitle.trim(),
      description: editDescription.trim(),
      image: editImage || 'https://picsum.photos/seed/new/400/300',
      date: editDate || new Date().toISOString().slice(0, 16).replace('T', ' ')
    }
    setEvents(prev => [...prev, newEvent])
    closeModal()
  }

  const handleDelete = () => {
    if (!selectedEvent) return

    if (confirm('确定要删除这条学习记录吗？')) {
      setEvents(prev => prev.filter(event => event.id !== selectedEvent.id))
      closeModal()
    }
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedEvent(null)
    setIsEditing(false)
    setIsAdding(false)
  }

  return (
    <div className="space-y-6">
      {/* Timeline Grid - 一行最多5个卡片 */}
      <div className="relative">
        {/* Grid Layout - 一行最多5个卡片 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5 relative z-10">
          {/* Add Button - 第一个位置 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group cursor-pointer relative"
          >
            <motion.button
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAdd}
              className="w-full h-full min-h-[200px] rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 hover:border-primary/50 transition-all duration-300 flex flex-col items-center justify-center gap-3 text-primary"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Plus size={24} />
              </div>
              <span className="text-sm font-medium">新增记录</span>
            </motion.button>
          </motion.div>

          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group cursor-pointer relative"
              onClick={() => handleCardClick(event)}
            >
              {/* Card */}
              <motion.div
                className="glass-card overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-primary/40 relative"
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-surface">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Date badge on image - 只显示年月日 */}
                  <div className="absolute top-2 left-2 px-2 py-1 rounded-lg bg-black/40 backdrop-blur-sm text-white text-[10px] sm:text-xs flex items-center gap-1">
                    <Calendar size={10} />
                    <span>{event.date.split(' ')[0]}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-3">
                  <h3 className="text-xs sm:text-sm font-semibold text-text mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-text-muted line-clamp-2 leading-relaxed">
                    {event.description}
                  </p>
                </div>

                {/* Hover indicator */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </motion.div>
            </motion.div>
          ))}
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

      {/* Event Detail/Add Modal */}
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
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="glass-card w-full max-w-lg overflow-hidden max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image - only show for existing events */}
              {(selectedEvent || editImage) && (
                <div className="relative aspect-video">
                  <img
                    src={isEditing || isAdding ? editImage : selectedEvent!.image}
                    alt={selectedEvent?.title || '新记录'}
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
                </div>
              )}

              {/* Content */}
              <div className="p-4 sm:p-5">
                {isEditing || isAdding ? (
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-text mb-4">
                      {isAdding ? '新增学习记录' : '编辑记录'}
                    </h3>
                    <div>
                      <label className="block text-xs text-text-muted mb-1">标题</label>
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        placeholder="输入标题"
                        className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-text-muted mb-1">描述</label>
                      <textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        placeholder="输入描述"
                        className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm resize-none"
                        rows={3}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-text-muted mb-1">日期</label>
                      <input
                        type="text"
                        value={editDate}
                        onChange={(e) => setEditDate(e.target.value)}
                        placeholder="YYYY-MM-DD HH:mm"
                        className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-text-muted mb-1">图片URL</label>
                      <input
                        type="text"
                        value={editImage}
                        onChange={(e) => setEditImage(e.target.value)}
                        placeholder="https://..."
                        className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm"
                      />
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={isAdding ? handleSaveNew : handleEdit}
                        disabled={!editTitle.trim()}
                        className="flex-1 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dim transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isAdding ? '添加记录' : '保存修改'}
                      </button>
                      <button
                        onClick={() => {
                          if (isAdding) closeModal()
                          else setIsEditing(false)
                        }}
                        className="flex-1 py-2.5 rounded-lg bg-surface text-text text-sm font-medium hover:bg-surface/80 transition-colors border border-border"
                      >
                        取消
                      </button>
                    </div>
                  </div>
                ) : selectedEvent ? (
                  <>
                    <div className="flex items-center gap-2 text-xs text-text-muted mb-2">
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
                ) : null}
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
    setSelectedAccount(null)
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
              ) : selectedAccount ? (
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
              ) : null}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// 实验室内容组件 - 桌面端标签页内嵌
function LaboratoryContent() {
  const { themeConfig } = useTheme()
  const [activeTab, setActiveTab] = useState<'timeline' | 'plans'>('timeline')

  return (
    <div className="py-6">
      {/* 标签切换 */}
      <div className="flex gap-2 p-1 rounded-xl mb-6" style={{ background: themeConfig.colors.surface }}>
        <button
          onClick={() => setActiveTab('timeline')}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all"
          style={{
            background: activeTab === 'timeline' ? themeConfig.colors.bg : 'transparent',
            color: activeTab === 'timeline' ? themeConfig.colors.primary : themeConfig.colors.textMuted,
          }}
        >
          <Clock size={16} />
          历史时间轴
        </button>
        <button
          onClick={() => setActiveTab('plans')}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all"
          style={{
            background: activeTab === 'plans' ? themeConfig.colors.bg : 'transparent',
            color: activeTab === 'plans' ? themeConfig.colors.primary : themeConfig.colors.textMuted,
          }}
        >
          <Rocket size={16} />
          未来计划
        </button>
      </div>

      {/* 内容区域 */}
      <AnimatePresence mode="wait">
        {activeTab === 'timeline' ? (
          <motion.div
            key="timeline"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative">
              {/* 中央时间轴线 */}
              <div
                className="absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2"
                style={{ background: `linear-gradient(to bottom, #8b5cf630, #ec489930)` }}
              />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 relative">
                {labTimelineData.map((item, index) => (
                  <LabTimelineItem key={item.id} item={item} index={index} />
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="plans"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {labPlansData.map((plan, index) => (
                <LabPlanCard key={plan.id} plan={plan} index={index} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// 实验室时间轴项
function LabTimelineItem({ item, index }: { item: typeof labTimelineData[0]; index: number }) {
  const { themeConfig } = useTheme()
  const Icon = item.icon
  const isLeft = index % 2 === 0

  // 计算上边距：左侧项目从0开始，右侧项目有较大偏移，形成交错效果
  const topMargin = isLeft ? index * 20 : 60 + index * 20

  return (
    <motion.div
      initial={{ opacity: 0, x: isLeft ? -20 : 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`relative flex items-start ${isLeft ? 'lg:justify-end' : 'lg:justify-start'} lg:col-span-1`}
      style={{ marginTop: `${topMargin}px` }}
    >
      {/* 内容卡片 */}
      <div
        className={`p-4 rounded-xl w-full lg:w-[calc(100%-24px)] ${isLeft ? 'lg:mr-6' : 'lg:ml-6'}`}
        style={{
          background: themeConfig.colors.surface,
          border: `1px solid ${themeConfig.colors.border}`
        }}
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-medium" style={{ color: item.color }}>{item.date}</span>
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{ background: `${item.color}20`, color: item.color }}
          >
            {item.status === 'completed' ? '已完成' : '进行中'}
          </span>
        </div>
        <h3 className="font-semibold mb-1" style={{ color: themeConfig.colors.text }}>{item.title}</h3>
        <p className="text-sm mb-3" style={{ color: themeConfig.colors.textMuted }}>{item.description}</p>
        <div className="flex flex-wrap gap-1.5">
          {item.tags.map(tag => (
            <span
              key={tag}
              className="text-xs px-2 py-1 rounded-md"
              style={{ background: themeConfig.colors.bg, color: themeConfig.colors.textMuted }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* 中央节点 - 只在 lg 屏幕显示 */}
      <div
        className="hidden lg:flex absolute left-1/2 top-4 -translate-x-1/2 w-4 h-4 rounded-full items-center justify-center z-10"
        style={{ background: item.color }}
      >
        <div className="w-2 h-2 rounded-full bg-white" />
      </div>

      {/* 左侧图标 - 只在 lg 屏幕且右侧项目时显示 */}
      {!isLeft && (
        <div
          className="hidden lg:flex absolute left-0 top-4 w-8 h-8 rounded-lg items-center justify-center"
          style={{ background: `${item.color}20` }}
        >
          <Icon size={16} style={{ color: item.color }} />
        </div>
      )}

      {/* 右侧图标 - 只在 lg 屏幕且左侧项目时显示 */}
      {isLeft && (
        <div
          className="hidden lg:flex absolute right-0 top-4 w-8 h-8 rounded-lg items-center justify-center"
          style={{ background: `${item.color}20` }}
        >
          <Icon size={16} style={{ color: item.color }} />
        </div>
      )}
    </motion.div>
  )
}

// 实验室计划卡片
function LabPlanCard({ plan, index }: { plan: typeof labPlansData[0]; index: number }) {
  const { themeConfig } = useTheme()
  const Icon = plan.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="p-4 rounded-xl"
      style={{
        background: themeConfig.colors.surface,
        border: `1px solid ${themeConfig.colors.border}`
      }}
    >
      <div className="flex items-start gap-3 mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: `${plan.color}20` }}
        >
          <Icon size={20} style={{ color: plan.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm mb-1" style={{ color: themeConfig.colors.text }}>{plan.title}</h3>
          <p className="text-xs" style={{ color: themeConfig.colors.textMuted }}>{plan.description}</p>
        </div>
      </div>

      {/* 进度条 */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-xs mb-1">
          <span style={{ color: themeConfig.colors.textMuted }}>进度</span>
          <span style={{ color: plan.color }}>{plan.progress}%</span>
        </div>
        <div
          className="h-1.5 rounded-full overflow-hidden"
          style={{ background: themeConfig.colors.bg }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${plan.progress}%` }}
            transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
            className="h-full rounded-full"
            style={{ background: plan.color }}
          />
        </div>
      </div>

      {/* 标签 */}
      <div className="flex flex-wrap gap-1.5">
        {plan.tags.map(tag => (
          <span
            key={tag}
            className="text-xs px-2 py-1 rounded-md"
            style={{ background: `${plan.color}15`, color: plan.color }}
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  )
}

// 实验室数据
const labTimelineData = [
  {
    id: 1,
    date: '2024-03',
    title: 'AI 分身系统上线',
    description: '集成多模态 AI 能力，实现个性化数字分身创建与交互',
    icon: Brain,
    color: '#8b5cf6',
    status: 'completed',
    tags: ['AI', 'React', 'TypeScript']
  },
  {
    id: 2,
    date: '2024-02',
    title: '动态主题系统',
    description: '实现极简/赛博/艺术/童趣/复古五种主题切换，支持自定义配色',
    icon: Palette,
    color: '#ec4899',
    status: 'completed',
    tags: ['CSS变量', '主题系统', 'Tailwind']
  },
  {
    id: 3,
    date: '2024-01',
    title: '3D 轮播组件',
    description: '开发兴趣爱好模块的 3D 卡片轮播，支持悬停展开和手势滑动',
    icon: Eye,
    color: '#f59e0b',
    status: 'completed',
    tags: ['Framer Motion', '3D变换', '手势交互']
  },
  {
    id: 4,
    date: '2023-12',
    title: '数字名片生成器',
    description: '实现个性化数字名片设计，支持多主题模板和一键分享',
    icon: Smartphone,
    color: '#10b981',
    status: 'completed',
    tags: ['Canvas', '图片生成', '分享']
  },
  {
    id: 5,
    date: '2023-11',
    title: 'RAG 知识库系统',
    description: '构建基于向量检索的 AI 知识库，支持文档导入和智能问答',
    icon: Database,
    color: '#3b82f6',
    status: 'completed',
    tags: ['RAG', '向量检索', 'AI助手']
  },
  {
    id: 6,
    date: '2023-10',
    title: '项目架构重构',
    description: '从单体应用重构为模块化架构，实现懒加载和性能优化',
    icon: Layers,
    color: '#06b6d4',
    status: 'completed',
    tags: ['Vite', '模块化', '性能优化']
  }
]

const labPlansData = [
  {
    id: 1,
    title: 'AI 简历优化器',
    description: '基于大模型的智能简历分析和优化建议，支持多行业模板',
    icon: Brain,
    color: '#8b5cf6',
    priority: 'high',
    quarter: '2024 Q2',
    progress: 25,
    tags: ['LLM', 'NLP', '简历解析']
  },
  {
    id: 2,
    title: '实时协作编辑器',
    description: '支持多人实时协作的富文本编辑器，用于文章和笔记创作',
    icon: Palette,
    color: '#ec4899',
    priority: 'high',
    quarter: '2024 Q2',
    progress: 15,
    tags: ['WebSocket', 'CRDT', '协同编辑']
  },
  {
    id: 3,
    title: '智能数据分析',
    description: '自动分析用户行为数据，生成可视化报表和洞察建议',
    icon: Database,
    color: '#3b82f6',
    priority: 'medium',
    quarter: '2024 Q3',
    progress: 10,
    tags: ['数据分析', '可视化', 'AI洞察']
  },
  {
    id: 4,
    title: '多端同步系统',
    description: '实现数据跨设备实时同步，支持离线编辑和冲突解决',
    icon: Wifi,
    color: '#10b981',
    priority: 'high',
    quarter: '2024 Q3',
    progress: 5,
    tags: ['同步', 'PWA', 'IndexedDB']
  },
  {
    id: 5,
    title: 'AI 代码助手',
    description: '集成代码补全、错误检测、重构建议的智能编程助手',
    icon: Beaker,
    color: '#f59e0b',
    priority: 'medium',
    quarter: '2024 Q4',
    progress: 0,
    tags: ['CodeAI', 'IDE', '生产力']
  },
  {
    id: 6,
    title: '社区互动系统',
    description: '构建用户社区，支持动态发布、评论互动和内容推荐',
    icon: MessageCircle,
    color: '#ec4899',
    priority: 'low',
    quarter: '2024 Q4',
    progress: 0,
    tags: ['社交', '推荐算法', 'UGC']
  }
]

/* ===== Mobile Components ===== */

// 移动端菜单项配置
const mobileMenuItems = [
  { id: 'danmaku' as const, label: '留言墙', description: '留下你的足迹和祝福', icon: MessageCircle, color: '#ec4899' },
  { id: 'laboratory' as const, label: '实验室', description: '技术实验与开发计划', icon: FlaskConical, color: '#8b5cf6' },
]

// 移动端顶部用户信息组件
function MobileUserHeader({ userProfile, onEdit, isVip = false, onVipClick }: { userProfile: ProfileData; onEdit: () => void; isVip?: boolean; onVipClick?: () => void }) {
  return (
    <div
      className="relative px-4 pt-12 pb-8 rounded-b-3xl overflow-hidden z-0"
      style={{
        background: userProfile.background
          ? `url(${userProfile.background}) center/cover no-repeat`
          : undefined
      }}
    >
      {/* 背景遮罩层 - 用户要求删除白蓝遮罩，直接显示真实图片 */}
      <div
        className="absolute inset-0 bg-black/10"
        style={{ opacity: userProfile.background ? 0.2 : 0 }}
      />
      <div className="relative flex items-center gap-4">
        <div className="w-16 h-16 rounded-full overflow-hidden bg-white/20 flex items-center justify-center text-white text-2xl font-bold border-2 border-white/30 shrink-0">
          {userProfile.avatar ? (
            <img src={userProfile.avatar} alt="avatar" className="w-full h-full object-cover" />
          ) : (
            userProfile.name?.charAt(0) || 'P'
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white drop-shadow-md">{userProfile.name}</h2>
            <button
              onClick={onVipClick}
              className={`px-3 py-1 rounded-full text-white text-xs font-bold transition-all hover:scale-105 flex items-center gap-1 shadow-lg shrink-0 ${isVip
                  ? 'bg-gradient-to-r from-yellow-400 via-amber-500 to-amber-600 shadow-amber-500/50 outline outline-1 outline-white/30'
                  : 'bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-600 shadow-purple-500/40 hover:shadow-purple-500/60'
                }`}
            >
              <Crown size={12} className={isVip ? 'text-white' : 'text-purple-200'} />
              {isVip ? 'VIP会员' : '开通权益'}
            </button>
          </div>
          <div className="flex items-center gap-2 mt-2">
            {/* 性别标签 - 动态颜色与内容 */}
            <div className={`px-2 py-0.5 rounded-md backdrop-blur-md border flex items-center gap-1 shadow-sm transition-colors duration-300 ${userProfile.gender === 'male'
                ? 'bg-blue-500/40 border-blue-400/30 text-blue-100'
                : userProfile.gender === 'female'
                  ? 'bg-rose-500/40 border-rose-400/30 text-rose-100'
                  : 'bg-gray-500/30 border-gray-400/20 text-gray-100'
              }`}>
              <span className="text-[10px] font-bold">
                {userProfile.gender === 'male' ? '♂' : userProfile.gender === 'female' ? '♀' : '?'}
              </span>
              <span className="text-[10px] font-medium tracking-wider">
                {userProfile.gender === 'male' ? '男' : userProfile.gender === 'female' ? '女' : '保密'}
              </span>
            </div>

            {/* 年龄标签 - 动态显示 */}
            <div className="px-2 py-0.5 rounded-md bg-violet-600/30 backdrop-blur-md border border-violet-400/20 shadow-sm">
              <span className="text-[10px] text-white font-bold">
                {userProfile.age || '??'} 岁
              </span>
            </div>

            {/* 编辑按钮 - 原味图标 */}
            <button
              onClick={onEdit}
              className="p-1.5 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors ml-1.5 backdrop-blur-md shadow-lg border border-white/10"
            >
              <Edit2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// 移动端数字名片入口卡片
function DigitalCardEntry({ onOpen }: { onOpen: () => void }) {
  const { currentTheme } = useTheme()
  const isCyber = currentTheme === 'cyber'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-4 -mt-4 relative z-10"
    >
      <div
        className={`p-4 flex items-center justify-between border transition-all duration-500 ${isCyber
            ? 'shadow-[0_0_25px_rgba(0,212,255,0.25)] border-primary/40 backdrop-blur-xl'
            : 'shadow-lg border-border/40'
          }`}
        style={{
          zIndex: 10,
          position: 'relative',
          backgroundColor: 'var(--color-surface)',
          borderRadius: 'var(--radius-xl)',
        }}
      >
        {/* 精致背景装饰 - 仅赛博主题 */}
        {isCyber && (
          <div className="absolute inset-0 overflow-hidden rounded-[var(--radius-xl)] pointer-events-none">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-accent/10 blur-2xl" />
            {/* 科技线装饰 */}
            <div className="absolute top-2 right-2 w-4 h-px bg-primary/40" />
            <div className="absolute top-2 right-2 w-px h-4 bg-primary/40" />
          </div>
        )}

        <div className="flex items-center gap-3 relative z-10">
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 ${isCyber ? 'shadow-[0_0_15px_rgba(168,85,247,0.3)]' : 'shadow-md shadow-primary/20'
              }`}
            style={{
              background: isCyber
                ? 'linear-gradient(135deg, var(--color-primary), var(--color-accent))'
                : 'linear-gradient(135deg, #f43f5e, #ec4899, #d946ef)', // 极简下采用甜美粉色渐变
              transform: isCyber ? 'rotate(5deg)' : 'none'
            }}
          >
            <Palette size={22} className="text-white" />
          </div>
          <div>
            <h3 className="font-bold text-text" style={{ fontSize: '15px', letterSpacing: '0.01em' }}>生成个人数字名片</h3>
            <p className="text-[11px] text-text-muted mt-0.5 font-medium opacity-80">智能整合你的精彩瞬间</p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onOpen}
          className={`px-5 py-1.5 rounded-full text-white text-sm font-bold transition-all relative overflow-hidden group ${isCyber ? 'shadow-[0_0_15px_rgba(0,212,255,0.4)]' : 'shadow-md shadow-primary/30'
            }`}
          style={{
            background: isCyber
              ? 'linear-gradient(90deg, var(--color-primary), var(--color-accent))'
              : 'linear-gradient(90deg, #f43f5e, #ec4899)' // 极简下采用更有能量的玫瑰粉渐变
          }}
        >
          {/* 交互式光影 sweep 效果 */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-20"
            initial={{ x: '-150%' }}
            whileHover={{ x: '150%' }}
            transition={{ duration: 0.75, ease: "easeInOut" }}
          />
          <span className="relative z-10">生成</span>
        </motion.button>
      </div>
    </motion.div>
  )
}

// 会员权益配置
const membershipPlans = [
  {
    id: 'vip',
    name: 'VIP会员',
    price: 19.9,
    period: '月',
    features: ['无广告体验', '专属主题皮肤', '高级数据统计', '优先客服支持'],
    popular: false,
  },
  {
    id: 'svip',
    name: 'SVIP会员',
    price: 168,
    period: '年',
    features: ['所有VIP权益', '云同步备份', '专属徽章标识', '专属客服通道', '提前体验新功能'],
    popular: true,
  },
  {
    id: 'lifetime',
    name: '永久会员',
    price: 368,
    period: '永久',
    features: ['所有SVIP权益', '终身免费更新', '专属VIP群组', '一对一技术支持', '终身专属标识'],
    popular: false,
  },
]

// 移动端菜单主界面
function MobileMenu({ onNavigate, userProfile, onEditProfile, onOpenSettings, onOpenAbout }: { onNavigate: (view: TabId | 'menu' | 'laboratory') => void; userProfile: ProfileData; onEditProfile: () => void; onOpenSettings: () => void; onOpenAbout: () => void }) {
  const [showCardModal, setShowCardModal] = useState(false)
  const [showHistoryModal, setShowHistoryModal] = useState(false)
  const [showCardEditModal, setShowCardEditModal] = useState(false)
  const [editingCard, setEditingCard] = useState<DigitalCard | null>(null)
  const [showThemePanel, setShowThemePanel] = useState(false)
  const [showVipModal, setShowVipModal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState('svip')
  const [isVip, setIsVip] = useState(false)
  const [isCardModalReadonly, setIsCardModalReadonly] = useState(false)
  const { currentTheme, setTheme, themeConfig } = useTheme()
  const navigate = useNavigate()

  // 处理支付成功
  const handlePaymentSuccess = () => {
    setIsVip(true)
    setShowVipModal(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-bg"
    >
      <MobileUserHeader
        userProfile={userProfile}
        onEdit={onEditProfile}
        isVip={isVip}
        onVipClick={() => setShowVipModal(true)}
      />
      <DigitalCardEntry onOpen={() => {
        setIsCardModalReadonly(false)
        setShowCardModal(true)
      }} />

      {/* 功能菜单列表 */}
      <div className="px-4 mt-4 space-y-2">
        {/* 个人主页入口 */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0 * 0.05 }}
          onClick={() => onNavigate('social')}
          className="w-full flex items-center gap-4 p-4 rounded-2xl bg-surface border border-border/50 active:scale-[0.98] transition-transform"
        >
          <div className="w-10 h-10 rounded-xl overflow-hidden border border-border/50 shrink-0">
            {userProfile.avatar ? (
              <img src={userProfile.avatar} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-amber-500/15 text-amber-500 font-bold">
                {userProfile.name?.charAt(0) || 'P'}
              </div>
            )}
          </div>
          <div className="flex-1 text-left">
            <h3 className="font-medium text-text">个人主页</h3>
            <p className="text-xs text-text-muted mt-0.5">我的个人资料与简历</p>
          </div>
          <ChevronRight size={18} className="text-text-dim" />
        </motion.button>

        {/* NFC 互联模块 - 用户要求新增 */}
        <NfcConnectModule 
          onShowCard={(card) => {
            setEditingCard(card)
            setIsCardModalReadonly(true)
            setShowCardModal(true)
          }} 
        />

        {/* 主题风格选择入口 */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1 * 0.05 }}
          onClick={() => setShowThemePanel(true)}
          className="w-full flex items-center gap-4 p-4 rounded-2xl bg-surface border border-border/50 active:scale-[0.98] transition-transform"
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-purple-500/20 to-pink-500/20">
            <Star size={20} className="text-purple-500" />
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
            transition={{ delay: (index + 2) * 0.05 }}
            onClick={() => item.id === 'laboratory' ? navigate('/laboratory') : onNavigate(item.id)}
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

        {/* 系统设置入口 */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: (mobileMenuItems.length + 2) * 0.05 }}
          onClick={() => onOpenSettings()}
          className="w-full flex items-center gap-4 p-4 rounded-2xl bg-surface border border-border/50 active:scale-[0.98] transition-transform"
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-blue-500/15">
            <Settings size={20} className="text-blue-500" />
          </div>
          <div className="flex-1 text-left">
            <h3 className="font-medium text-text">系统设置</h3>
            <p className="text-xs text-text-muted mt-0.5">鼠标特效等设置</p>
          </div>
          <ChevronRight size={18} className="text-text-dim" />
        </motion.button>

        {/* 关于我们入口 - 放在最下面 */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: (mobileMenuItems.length + 3) * 0.05 }}
          onClick={() => onOpenAbout()}
          className="w-full flex items-center gap-4 p-4 rounded-2xl bg-surface border border-border/50 active:scale-[0.98] transition-transform"
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-purple-500/15">
            <Info size={20} className="text-purple-500" />
          </div>
          <div className="flex-1 text-left">
            <h3 className="font-medium text-text">关于我们</h3>
            <p className="text-xs text-text-muted mt-0.5">开发者信息与反馈</p>
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
            onOpenEdit={(card) => {
              setEditingCard(card)
              setShowCardEditModal(true)
            }}
            initialCard={editingCard || undefined}
            readonly={isCardModalReadonly}
          />
        )}
      </AnimatePresence>

      {/* 历史记录弹窗 */}
      <AnimatePresence>
        {showHistoryModal && (
          <CardHistoryModal onClose={() => setShowHistoryModal(false)} />
        )}
      </AnimatePresence>

      {/* 数字名片编辑弹窗 */}
      <AnimatePresence>
        {showCardEditModal && editingCard && (
          <DigitalCardEditModal
            card={editingCard}
            onSave={(newCard) => {
              setEditingCard(newCard)
              setShowCardEditModal(false)
              // 保存后重新打开名片弹窗显示更新后的数据
              setShowCardModal(true)
            }}
            onClose={() => setShowCardEditModal(false)}
          />
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

      {/* VIP会员订阅弹窗 */}
      <AnimatePresence>
        {showVipModal && (
          <MembershipModal
            onClose={() => setShowVipModal(false)}
            selectedPlan={selectedPlan}
            onSelectPlan={setSelectedPlan}
            onPaymentSuccess={handlePaymentSuccess}
          />
        )}
      </AnimatePresence>
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
      if (!container) return () => { }

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
                  className={`w-6 h-6 rounded-full border-2 transition-all ${selectedColor === color
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
  const [isAdding, setIsAdding] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editImage, setEditImage] = useState('')
  const [editDate, setEditDate] = useState('')

  const handleCardClick = (event: TimelineEvent, index: number) => {
    setSelectedEvent(event)
    setSelectedIndex(index)
    setEditTitle(event.title)
    setEditDescription(event.description)
    setEditImage(event.image)
    setEditDate(event.date)
    setIsEditing(false)
    setIsAdding(false)
    setShowModal(true)
  }

  const handleAdd = () => {
    setIsAdding(true)
    setIsEditing(false)
    setSelectedEvent(null)
    setEditTitle('')
    setEditDescription('')
    setEditImage('')
    setEditDate(new Date().toISOString().slice(0, 16).replace('T', ' '))
    setShowModal(true)
  }

  const handleEdit = () => {
    if (!selectedEvent || !editTitle.trim()) return

    setEvents(prev => prev.map(event =>
      event.id === selectedEvent.id
        ? { ...event, title: editTitle.trim(), description: editDescription.trim(), image: editImage, date: editDate }
        : event
    ))
    setIsEditing(false)
    setSelectedEvent(null)
    setShowModal(false)
  }

  const handleSaveNew = () => {
    if (!editTitle.trim()) return

    const newEvent: TimelineEvent = {
      id: `event-${crypto.randomUUID()}`,
      title: editTitle.trim(),
      description: editDescription.trim(),
      date: editDate,
      image: editImage || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400',
    }

    setEvents(prev => [...prev, newEvent])
    setIsAdding(false)
    setShowModal(false)
    setEditTitle('')
    setEditDescription('')
    setEditImage('')
  }

  const handleDelete = () => {
    if (!selectedEvent) return

    if (confirm('确定要删除这条学习记录吗？')) {
      setEvents(prev => prev.filter(event => event.id !== selectedEvent.id))
      setSelectedEvent(null)
      setShowModal(false)
    }
  }

  const closeModal = () => {
    setSelectedEvent(null)
    setIsEditing(false)
    setIsAdding(false)
    setShowModal(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="min-h-screen bg-bg"
    >
      <MobilePageHeader title="成长时间轴" onBack={onBack} />

      {/* 新增按钮 */}
      <div className="px-4 py-3">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleAdd}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-white text-sm font-medium"
        >
          <Plus size={18} />
          <span>新增记录</span>
        </motion.button>
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
                {/* Date badge - 只显示年月日 */}
                <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/50 backdrop-blur-sm text-white text-[9px]">
                  {event.date.split(' ')[0]}
                </div>
              </div>
              <div className="p-2.5">
                <h3 className="text-xs font-semibold text-text line-clamp-1">
                  {event.title}
                </h3>
                <p className="text-[10px] text-text-muted line-clamp-1 mt-0.5">
                  {event.description}
                </p>
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

      {/* 详情/新增弹窗 */}
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
              className="glass-card w-full max-w-sm overflow-hidden max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image preview */}
              {(selectedEvent || editImage) && (
                <div className="relative aspect-video">
                  <img
                    src={isEditing || isAdding ? editImage : selectedEvent!.image}
                    alt={selectedEvent?.title || '新记录'}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <button
                    onClick={closeModal}
                    className="absolute top-3 right-3 p-2 rounded-full bg-black/30 text-white"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}

              <div className="p-4">
                {isEditing || isAdding ? (
                  <div className="space-y-3">
                    <h3 className="text-base font-bold text-text mb-3">
                      {isAdding ? '新增学习记录' : '编辑记录'}
                    </h3>
                    <div>
                      <label className="block text-xs text-text-muted mb-1">标题</label>
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        placeholder="输入标题"
                        className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-text-muted mb-1">描述</label>
                      <textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        placeholder="输入描述"
                        className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm resize-none"
                        rows={3}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-text-muted mb-1">日期</label>
                      <input
                        type="text"
                        value={editDate}
                        onChange={(e) => setEditDate(e.target.value)}
                        placeholder="YYYY-MM-DD HH:mm"
                        className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-text-muted mb-1">图片URL</label>
                      <input
                        type="text"
                        value={editImage}
                        onChange={(e) => setEditImage(e.target.value)}
                        placeholder="https://..."
                        className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm"
                      />
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={isAdding ? handleSaveNew : handleEdit}
                        disabled={!editTitle.trim()}
                        className="flex-1 py-2 rounded-lg bg-primary text-white text-sm font-medium disabled:opacity-50"
                      >
                        {isAdding ? '添加记录' : '保存修改'}
                      </button>
                      <button
                        onClick={() => {
                          if (isAdding) closeModal()
                          else setIsEditing(false)
                        }}
                        className="flex-1 py-2 rounded-lg bg-surface text-text text-sm font-medium border border-border"
                      >
                        取消
                      </button>
                    </div>
                  </div>
                ) : selectedEvent ? (
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
                ) : null}
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

      {/* 3D 旋转魔方展示 - 移动至内容下方 */}
      <div className="flex justify-center py-10 overflow-hidden perspective-1000">
        <style>{`
          .perspective-1000 { perspective: 1000px; }
          .cube-container {
            width: 120px;
            height: 120px;
            position: relative;
            transform-style: preserve-3d;
            animation: rotateCube 15s infinite linear;
          }
          @keyframes rotateCube {
            0% { transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
            100% { transform: rotateX(360deg) rotateY(360deg) rotateZ(360deg); }
          }
          .cube-face {
            position: absolute;
            width: 120px;
            height: 120px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(8px);
            box-shadow: inset 0 0 30px rgba(255, 255, 255, 0.1);
            color: white;
            border-radius: 20px;
          }
          .face-front  { transform: translateZ(60px); }
          .face-back   { transform: rotateY(180deg) translateZ(60px); }
          .face-top    { transform: rotateX(90deg) translateZ(60px); }
          .face-bottom { transform: rotateX(-90deg) translateZ(60px); }
          .face-left   { transform: rotateY(-90deg) translateZ(60px); }
          .face-right  { transform: rotateY(90deg) translateZ(60px); }
        `}</style>

        <div className="cube-container">
          {/* 前: 微信 */}
          <div className="cube-face face-front" style={{ backgroundColor: 'rgba(7, 193, 96, 0.3)' }}>
            <div className="flex flex-col items-center">
              <MessageSquare size={40} className="text-[#07c160] drop-shadow-[0_0_8px_rgba(7,193,96,0.6)]" />
              <span className="text-[10px] mt-1 font-bold">微信</span>
            </div>
          </div>
          {/* 后: QQ */}
          <div className="cube-face face-back" style={{ backgroundColor: 'rgba(18, 183, 245, 0.3)' }}>
            <div className="flex flex-col items-center">
              <MessageCircle size={40} className="text-[#12b7f5] drop-shadow-[0_0_8px_rgba(18,183,245,0.6)]" />
              <span className="text-[10px] mt-1 font-bold">QQ</span>
            </div>
          </div>
          {/* 上: 抖音 */}
          <div className="cube-face face-top" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="flex flex-col items-center">
              <Music size={40} className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]" />
              <span className="text-[10px] mt-1 font-bold">抖音</span>
            </div>
          </div>
          {/* 下: 小红书 */}
          <div className="cube-face face-bottom" style={{ backgroundColor: 'rgba(255, 36, 66, 0.3)' }}>
            <div className="flex flex-col items-center">
              <Heart size={40} className="text-[#ff2442] drop-shadow-[0_0_8px_rgba(255,36,66,0.6)]" />
              <span className="text-[10px] mt-1 font-bold">小红书</span>
            </div>
          </div>
          {/* 左: B站 */}
          <div className="cube-face face-left" style={{ backgroundColor: 'rgba(251, 114, 153, 0.3)' }}>
            <div className="flex flex-col items-center">
              <Play size={40} className="text-[#fb7299] drop-shadow-[0_0_8px_rgba(251,114,153,0.6)]" />
              <span className="text-[10px] mt-1 font-bold">Bilibili</span>
            </div>
          </div>
          {/* 右: 微博 */}
          <div className="cube-face face-right" style={{ backgroundColor: 'rgba(230, 22, 45, 0.3)' }}>
            <div className="flex flex-col items-center">
              <Zap size={40} className="text-[#e6162d] drop-shadow-[0_0_8px_rgba(230,22,45,0.6)]" />
              <span className="text-[10px] mt-1 font-bold">微博</span>
            </div>
          </div>
        </div>
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
function DigitalCardModal({
  onClose,
  onOpenHistory,
  onOpenEdit,
  initialCard,
  readonly = false
}: {
  onClose: () => void;
  onOpenHistory?: () => void;
  onOpenEdit?: (card: DigitalCard) => void;
  initialCard?: DigitalCard;
  readonly?: boolean;
}) {
  const { user } = useAuth()
  const [card, setCard] = useState<DigitalCard>(() => {
    // 如果有传入初始卡片数据，使用它
    if (initialCard) {
      return initialCard
    }
    const defaultCard = generateDigitalCard('blue')
    // 如果有登录用户，使用用户的头像和名称
    if (user) {
      return {
        ...defaultCard,
        name: user.username,
        avatar: user.avatar || presetAvatars[0]?.url,
      }
    }
    return defaultCard
  })
  const [isGenerating, setIsGenerating] = useState(false)
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
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-end sm:items-center justify-center"
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
          <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 relative z-10">
            <h2 className="text-lg font-semibold text-text">个人数字名片</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-surface/60 transition-colors cursor-pointer flex items-center justify-center"
              aria-label="关闭"
            >
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
                  <h4 className="text-xs font-medium text-text-muted mb-2">我的账号</h4>
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
                  <span className="text-xs text-text-dim">晓叶的个人空间</span>
                  <Sparkles size={14} className="text-primary" />
                </div>
              </div>
            </div>
          </div>

          {/* Actions - 下载、分享、编辑、历史记录 */}
          <div className="p-4 border-t border-border/50 pb-20 md:pb-4">
            <div className={`grid ${readonly ? 'grid-cols-2' : 'grid-cols-4'} gap-3`}>
              <button
                onClick={handleDownload}
                disabled={isGenerating}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-primary/10 text-primary active:scale-95 transition-transform disabled:opacity-50"
              >
                {isGenerating ? <Loader2 size={20} className="animate-spin" /> : <Download size={20} />}
                <span className="text-sm font-medium">下载</span>
              </button>
              <button
                onClick={handleShare}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-green-500/10 text-green-500 active:scale-95 transition-transform"
              >
                <Share size={20} />
                <span className="text-sm font-medium">分享</span>
              </button>
              
              {!readonly && (
                <>
                  <button
                    onClick={() => {
                      onOpenEdit?.(card)
                      onClose()
                    }}
                    className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-amber-500/10 text-amber-500 active:scale-95 transition-transform"
                  >
                    <Palette size={20} />
                    <span className="text-sm font-medium">编辑</span>
                  </button>
                  <button
                    onClick={() => onOpenHistory?.()}
                    className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-rose-500/10 text-rose-500 active:scale-95 transition-transform"
                  >
                    <History size={20} />
                    <span className="text-sm font-medium">历史</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>

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
        className="bg-bg w-full max-w-md max-h-[90vh] rounded-t-3xl sm:rounded-3xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 flex-shrink-0">
          <h2 className="text-lg font-semibold text-text">编辑名片</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-surface/60">
            <X size={20} className="text-text" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 flex-1 overflow-y-auto">
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
                  className={`p-3 rounded-xl border-2 transition-all ${editedCard.theme === themeKey
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
        <div className="p-4 border-t border-border/50 flex gap-2 flex-shrink-0 pb-20 sm:pb-4">
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

// 会员订阅弹窗组件
function MembershipModal({
  onClose,
  selectedPlan,
  onSelectPlan,
  onPaymentSuccess
}: {
  onClose: () => void
  selectedPlan: string
  onSelectPlan: (plan: string) => void
  onPaymentSuccess?: () => void
}) {
  const [paymentMethod, setPaymentMethod] = useState<'wechat' | 'alipay'>('wechat')
  const [isProcessing, setIsProcessing] = useState(false)

  const handlePayment = async () => {
    setIsProcessing(true)
    // 模拟支付处理
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsProcessing(false)
    // 支付成功回调
    onPaymentSuccess?.()
    alert('支付成功！您已成为VIP会员！')
  }

  const currentPlan = membershipPlans.find(p => p.id === selectedPlan)

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
        className="w-full max-w-lg bg-bg rounded-t-3xl sm:rounded-2xl max-h-[90vh] sm:max-h-[85vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - 使用紫色到蓝色的梦幻渐变 */}
        <div className="relative bg-gradient-to-br from-violet-600 via-purple-600 to-blue-600 px-6 py-8 text-white overflow-hidden">
          {/* 装饰性光晕 */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-pink-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors z-10"
          >
            <X size={20} />
          </button>

          <div className="relative flex items-center gap-4 mb-2">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400 via-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/50 ring-4 ring-white/20">
              <Crown size={32} className="text-white" />
            </div>
            <div>
              <div className="mb-1">
                <h2 className="text-2xl font-bold">VIP会员</h2>
              </div>
              <p className="text-white/80 text-sm">解锁专属特权，享受尊贵体验</p>
            </div>
          </div>
        </div>

        {/* Content - 可滚动区域 */}
        <div className="flex-1 overflow-y-auto p-6 pb-4">
          {/* 会员套餐选择 */}
          <h3 className="text-sm font-medium text-text mb-4">选择套餐</h3>
          <div className="space-y-3 mb-6">
            {membershipPlans.map((plan) => (
              <motion.button
                key={plan.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelectPlan(plan.id)}
                className={`w-full relative p-4 rounded-2xl border-2 transition-all ${selectedPlan === plan.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border/50 bg-surface hover:border-primary/30'
                  }`}
              >
                {plan.popular && (
                  <span className="absolute -top-2 right-4 px-2 py-0.5 rounded-full bg-gradient-to-r from-primary to-accent text-white text-[10px] font-medium shadow-sm">
                    最受欢迎
                  </span>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPlan === plan.id ? 'border-primary' : 'border-text-muted'
                      }`}>
                      {selectedPlan === plan.id && (
                        <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                      )}
                    </div>
                    <div className="text-left">
                      <h4 className="font-medium text-text">{plan.name}</h4>
                      <p className="text-xs text-text-muted mt-0.5">
                        {plan.features.slice(0, 2).join(' · ')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-bold text-primary">¥{plan.price}</span>
                    <span className="text-xs text-text-muted">/{plan.period}</span>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>

          {/* 权益详情 - 三行显示 */}
          <h3 className="text-sm font-medium text-text mb-3">会员权益</h3>
          <div className="bg-surface rounded-2xl p-4 mb-6">
            <div className="grid grid-cols-3 gap-3">
              {currentPlan?.features.slice(0, 6).map((feature, index) => (
                <div key={index} className="flex items-center gap-1.5">
                  <Check size={14} className="text-primary flex-shrink-0" />
                  <span className="text-xs text-text-secondary truncate">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 支付方式 */}
          <h3 className="text-sm font-medium text-text mb-3">支付方式</h3>
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              onClick={() => setPaymentMethod('wechat')}
              className={`flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl border-2 transition-all ${paymentMethod === 'wechat'
                  ? 'border-green-500 bg-green-50 shadow-sm'
                  : 'border-gray-200 bg-white hover:border-green-300'
                }`}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-green-500">
                <path d="M9.5 11.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm7 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" fill="currentColor" />
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8 0-1.73.55-3.33 1.48-4.64.38.56.98.93 1.66.93.65 0 1.24-.34 1.62-.87.38.53.97.87 1.62.87s1.24-.34 1.62-.87c.38.53.97.87 1.62.87.68 0 1.28-.37 1.66-.93C19.45 10.67 20 12.27 20 14c0 4.41-3.59 8-8 8z" fill="currentColor" />
              </svg>
              <span className={`text-sm font-medium ${paymentMethod === 'wechat' ? 'text-green-600' : 'text-gray-700'}`}>微信支付</span>
              {paymentMethod === 'wechat' && (
                <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center ml-1">
                  <Check size={10} className="text-white" />
                </div>
              )}
            </button>
            <button
              onClick={() => setPaymentMethod('alipay')}
              className={`flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl border-2 transition-all ${paymentMethod === 'alipay'
                  ? 'border-blue-500 bg-blue-50 shadow-sm'
                  : 'border-gray-200 bg-white hover:border-blue-300'
                }`}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-blue-500">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                <path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <span className={`text-sm font-medium ${paymentMethod === 'alipay' ? 'text-blue-600' : 'text-gray-700'}`}>支付宝</span>
              {paymentMethod === 'alipay' && (
                <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center ml-1">
                  <Check size={10} className="text-white" />
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Footer - 支付区域（固定在底部） */}
        <div className="p-3 sm:p-4 border-t border-border/50 bg-gradient-to-b from-surface/50 to-surface flex-shrink-0 pb-20 sm:pb-safe">
          {/* 价格显示 */}
          <div className="flex items-baseline justify-center gap-1 mb-4">
            <span className="text-text-muted text-sm">实付金额</span>
            <span className="text-2xl sm:text-3xl font-bold text-primary">¥{currentPlan?.price}</span>
            <span className="text-text-muted text-sm">/{currentPlan?.period}</span>
          </div>

          {/* 立即支付按钮 */}
          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full py-3.5 sm:py-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-white font-semibold text-base sm:text-lg hover:shadow-xl hover:shadow-amber-500/30 disabled:opacity-60 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 active:scale-[0.98]"
          >
            {isProcessing ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>支付处理中...</span>
              </>
            ) : (
              <>
                <CreditCard size={18} />
                <span>立即支付</span>
              </>
            )}
          </button>

          {/* 协议说明 */}
          <p className="text-center text-xs text-text-dim mt-3 sm:mt-4 flex items-center justify-center gap-1">
            <Shield size={12} />
            <span>支付即表示同意《会员服务协议》，安全加密保障</span>
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}

// 关于我们弹窗
function AboutModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { themeConfig } = useTheme()
  const [showFeedback, setShowFeedback] = useState(true)
  const [feedback, setFeedback] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmitFeedback = () => {
    if (!feedback.trim()) return
    // 这里可以添加实际的提交逻辑
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFeedback('')
      setShowFeedback(false)
    }, 1500)
  }

  const socialLinks = [
    {
      name: '公众号',
      value: '晓叶玩转网络',
      icon: '📱',
      desc: '扫码关注获取更多内容',
      hasQR: true
    },
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[102]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[103] flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="w-full max-w-md max-h-[85vh] overflow-y-auto rounded-2xl p-6 pointer-events-auto"
              style={{
                background: themeConfig.glassEffect.background,
                border: themeConfig.glassEffect.border,
                backdropFilter: themeConfig.glassEffect.backdropBlur,
                WebkitBackdropFilter: themeConfig.glassEffect.backdropBlur,
                boxShadow: themeConfig.shadows.float,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2
                  className="text-xl font-bold"
                  style={{ color: themeConfig.colors.text }}
                >
                  关于我们
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full transition-colors hover:opacity-70"
                  style={{ color: themeConfig.colors.textMuted }}
                >
                  <X size={20} />
                </button>
              </div>
              {/* Social Links */}
              <div className="space-y-3 mb-6">
                <h4
                  className="text-sm font-semibold mb-3"
                  style={{ color: themeConfig.colors.text }}
                >
                  关注我们
                </h4>
                {socialLinks.map((link, index) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 rounded-xl"
                    style={{
                      background: themeConfig.colors.surface,
                      border: `1px solid ${themeConfig.colors.border}`,
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{link.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span
                            className="font-medium"
                            style={{ color: themeConfig.colors.text }}
                          >
                            {link.name}
                          </span>
                          <span
                            className="text-sm font-semibold"
                            style={{ color: themeConfig.colors.primary }}
                          >
                            {link.value}
                          </span>
                        </div>
                        <p
                          className="text-xs mt-1"
                          style={{ color: themeConfig.colors.textMuted }}
                        >
                          {link.desc}
                        </p>
                      </div>
                    </div>
                    {link.hasQR && (
                      <div
                        className="mt-3 p-3 rounded-lg text-center"
                        style={{ background: themeConfig.colors.bg }}
                      >
                        <img
                          src="/vibe_images/gzh.jpg"
                          alt="公众号二维码"
                          className="w-24 h-24 mx-auto rounded-lg object-cover"
                        />
                        <p
                          className="text-xs mt-2"
                          style={{ color: themeConfig.colors.textMuted }}
                        >
                          扫码关注公众号
                        </p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Feedback Section */}
              <div className="mb-6">
                {!showFeedback ? (
                  <button
                    onClick={() => setShowFeedback(true)}
                    className="w-full py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                    style={{
                      background: themeConfig.colors.surface,
                      border: `1px solid ${themeConfig.colors.border}`,
                      color: themeConfig.colors.text,
                    }}
                  >
                    <MessageSquare size={18} />
                    建议反馈
                  </button>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-3"
                  >
                    <textarea
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="请输入您的宝贵建议..."
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl text-sm resize-none outline-none"
                      style={{
                        background: themeConfig.colors.surface,
                        border: `1px solid ${themeConfig.colors.border}`,
                        color: themeConfig.colors.text,
                      }}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowFeedback(false)}
                        className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all"
                        style={{
                          background: themeConfig.colors.surface,
                          border: `1px solid ${themeConfig.colors.border}`,
                          color: themeConfig.colors.textMuted,
                        }}
                      >
                        取消
                      </button>
                      <button
                        onClick={handleSubmitFeedback}
                        disabled={!feedback.trim() || submitted}
                        className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-50"
                        style={{
                          background: themeConfig.colors.primary,
                          color: '#fff',
                        }}
                      >
                        {submitted ? '提交成功！' : '提交'}
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>

              <button
                onClick={onClose}
                className="w-full py-3 rounded-xl font-medium transition-all"
                style={{
                  background: themeConfig.colors.primary,
                  color: '#fff',
                }}
              >
                知道了
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
