import { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { useSearchParams, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, MessageCircle, ThumbsUp, Send, MapPin, Camera, Sparkles, X, Image as ImageIcon, MoreHorizontal, Loader2, Mic, Square, Film, Plus, Images, Gift, ScrollText, type LucideIcon, Dumbbell, Gamepad2, Trophy, Target, Flame, Timer, Star, Zap, Medal, Music, Calendar, ChevronRight } from 'lucide-react'
import PageTransition from '../components/ui/PageTransition'
import { loveTimeline as initialLoveTimeline, socialPosts as initialSocialPosts, travelLocations as initialTravelLocations } from '../data/mock'
import type { SocialPost, PostComment, TravelLocation } from '../data/mock'
import { ChinaMap } from '../components/ChinaMap'
import { TravelDetailModal } from '../components/TravelDetailModal'
import { TravelManager } from '../components/TravelManager'
import { LoveDetailModal, type LoveTimelineEvent } from '../components/LoveDetailModal'
import { TimeAlbum } from '../components/love/TimeAlbum'
import { WishList } from '../components/love/WishList'
import { BlessingBoard } from '../components/love/BlessingBoard'
import { MusicBox, MovieWall } from '../components/entertainment/EntertainmentModules'

// Couple info configuration
const coupleInfo = {
  person1: { name: '晓叶', avatar: 'https://tse2.mm.bing.net/th/id/OIP.JXixrtqu6-SGuc8H2zyFogHaHa?rs=1&pid=ImgDetMain&o=7&rm=3' },
  person2: { name: '小梦', avatar: 'https://img0.baidu.com/it/u=3501403847,440746391&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=500' },
  startDate: '2026-01-01T00:00:00',
}

const tabs = [
  { id: 'love', label: '恋爱记录', icon: Heart },
  { id: 'travel', label: '旅拍相册', icon: Camera },
  { id: 'moments', label: '朋友圈', icon: MessageCircle },
  { id: 'music', label: '音乐盒', icon: Music },
  { id: 'movies', label: '收藏电影', icon: Film },
  { id: 'sports', label: '运动', icon: Dumbbell },
  { id: 'games', label: '游戏', icon: Gamepad2 },
] as const

type TabId = (typeof tabs)[number]['id']

export default function Life() {
  const [searchParams] = useSearchParams()
  const tabParam = searchParams.get('tab')
  const location = useLocation()

  const getInitialTab = (): TabId => {
    const validTabs: TabId[] = ['travel', 'love', 'moments', 'music', 'movies', 'sports', 'games']
    if (tabParam && validTabs.includes(tabParam as TabId)) return tabParam as TabId
    return 'love'
  }

  const [activeTab, setActiveTab] = useState<TabId>(getInitialTab)
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)
  const [loveView, setLoveView] = useState<'main' | 'album' | 'wish' | 'blessing'>('main')

  // 监听导航变化，重置详情页状态并跳转到顶部
  useLayoutEffect(() => {
    window.scrollTo(0, 0)
    if (document.documentElement) {
      document.documentElement.scrollTo(0, 0)
    }
  }, [location])

  // 当路径直接点击 /life 时（或无特定参数时），重置为首屏
  useEffect(() => {
    if (location.pathname === '/life' && !tabParam) {
      setActiveTab('love')
      setLoveView('main')
    }
  }, [location, tabParam])

  // 如果处于子页面，显示子页面
  if (loveView !== 'main' && activeTab === 'love') {
    const handleBack = () => setLoveView('main')
    switch (loveView) {
      case 'album':
        return <TimeAlbum events={initialLoveTimeline.map(t => ({ ...t, images: [] }))} onBack={handleBack} />
      case 'wish':
        return <WishList onBack={handleBack} />
      case 'blessing':
        return <BlessingBoard onBack={handleBack} />
    }
  }

  return (
    <PageTransition>
      <div className="mx-auto max-w-6xl px-6 py-8">
        {/* 顶部页眉与标签导航 */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-start gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-3xl font-bold text-text mb-1">生活</h1>
            <div className="flex items-center gap-3">
              <p className="text-sm text-text-muted">记录生活中的美好时刻</p>
              {/* 仅在移动端显示的滑动提示 */}
              <motion.div 
                className="flex md:hidden items-center gap-1 text-[10px] text-primary/60 font-medium"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <span>左滑查看更多</span>
                <ChevronRight size={10} strokeWidth={3} />
              </motion.div>
            </div>
          </motion.div>

          {/* 标签栏 - 在右侧 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="flex gap-2 overflow-x-auto no-scrollbar pb-1"
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
                  layoutId="lifeTab"
                  className="absolute inset-0 bg-primary/10 border border-primary/20 rounded-xl -z-10"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </button>
            ))}
          </motion.div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="sync">
          {activeTab === 'love' && (
            <motion.div
              key="love"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <LoveTimeline onNavigate={setLoveView} />
            </motion.div>
          )}
          {activeTab === 'moments' && (
            <motion.div
              key="moments"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Moments />
            </motion.div>
          )}
          {activeTab === 'travel' && (
            <motion.div
              key="travel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <TravelAlbum selectedLocation={selectedLocation} onSelect={setSelectedLocation} />
            </motion.div>
          )}
          {activeTab === 'sports' && (
            <motion.div
              key="sports"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <SportsSection />
            </motion.div>
          )}
          {activeTab === 'games' && (
            <motion.div
              key="games"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <GamesSection />
            </motion.div>
          )}
          {activeTab === 'music' && (
            <motion.div
              key="music"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <MusicBox />
            </motion.div>
          )}
          {activeTab === 'movies' && (
            <motion.div
              key="movies"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <MovieWall />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  )
}

/* ===== Love Timeline ===== */
interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function calculateTimeLeft(startDate: string): TimeLeft {
  const difference = new Date().getTime() - new Date(startDate).getTime()
  
  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  }
}

// Floating hearts animation component - pre-defined values for deterministic rendering
const heartConfigs = [
  { x: '15%', size: 18, duration: 4.5 },
  { x: '35%', size: 24, duration: 5.2 },
  { x: '55%', size: 20, duration: 4.8 },
  { x: '75%', size: 28, duration: 5.5 },
  { x: '25%', size: 22, duration: 4.2 },
  { x: '85%', size: 16, duration: 5.0 },
]

function FloatingHearts() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {heartConfigs.map((config, i) => (
        <motion.div
          key={i}
          className="absolute"
          initial={{ 
            opacity: 0, 
            y: 100,
            x: config.x,
            scale: 0.5
          }}
          animate={{ 
            opacity: [0, 0.6, 0],
            y: -100,
            scale: [0.5, 1, 0.8]
          }}
          transition={{ 
            duration: config.duration,
            repeat: Infinity,
            delay: i * 0.8,
            ease: 'easeOut'
          }}
        >
          <Heart 
            size={config.size}
            className="text-rose/40 fill-rose/20"
          />
        </motion.div>
      ))}
    </div>
  )
}

// Avatar with glow effect
function CoupleAvatar({ src, name, delay = 0 }: { src: string; name: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5, type: 'spring' }}
      className="relative group"
    >
      {/* Romantic Pulsing Rings */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-full border-2 border-rose-300/30"
          initial={{ scale: 1, opacity: 0.5 }}
          animate={{ 
            scale: [1, 1.4, 1.8],
            opacity: [0.5, 0.2, 0],
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity, 
            delay: i * 1,
            ease: "easeOut" 
          }}
        />
      ))}

      {/* Floating Hearts Animation */}
      <div className="absolute inset-0 z-0 overflow-visible">
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="absolute text-rose-400/60"
            initial={{ 
              x: Math.cos(i * Math.PI / 2) * 50, 
              y: Math.sin(i * Math.PI / 2) * 50,
              scale: 0.5,
              opacity: 0 
            }}
            animate={{ 
              y: [Math.sin(i * Math.PI / 2) * 50, Math.sin(i * Math.PI / 2) * 50 - 40],
              scale: [0.5, 1, 0.8],
              opacity: [0, 1, 0],
              rotate: [0, 15, -15, 0]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity, 
              delay: i * 1.5,
              ease: "easeInOut" 
            }}
          >
            <Heart size={16} fill="currentColor" />
          </motion.div>
        ))}
      </div>
      
      {/* Glow effect */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-rose-400/40 via-pink-300/40 to-rose-400/40 blur-xl opacity-60 group-hover:opacity-90 transition-opacity duration-500" />
      
      {/* Avatar image container */}
      <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-white dark:border-slate-800 shadow-xl bg-surface flex items-center justify-center z-10 transition-transform duration-500 group-hover:scale-105">
        <img 
          src={src} 
          alt="" 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
            (e.target as HTMLImageElement).parentElement!.classList.add('bg-primary/10');
            const span = document.createElement('span');
            span.className = 'text-primary font-bold text-xl';
            span.innerText = name.charAt(0);
            (e.target as HTMLImageElement).parentElement!.appendChild(span);
          }}
        />
      </div>
      
      {/* Name label */}
      <motion.p 
        className="text-center mt-3 text-sm font-medium text-text-secondary"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: delay + 0.2 }}
      >
        {name}
      </motion.p>
    </motion.div>
  )
}

// Countdown number component
function CountdownNumber({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <motion.div
          key={value}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-br from-rose-400 via-fuchsia-500 to-purple-600 bg-clip-text text-transparent tabular-nums"
          style={{ fontFamily: '"Dancing Script", cursive, serif' }}
        >
          {String(value).padStart(2, '0')}
        </motion.div>
      </div>
      <span className="text-xs sm:text-sm text-text-muted mt-1">{label}</span>
    </div>
  )
}

// Feature Button Component
interface FeatureButtonProps {
  icon: LucideIcon
  title: string
  subtitle: string
  gradient: string
  onClick: () => void
  delay?: number
}

function FeatureButton({ 
  icon: Icon, 
  title, 
  subtitle, 
  gradient, 
  onClick,
  delay = 0
}: FeatureButtonProps) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ scale: 1.03, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl p-5 text-left transition-all duration-300 group ${gradient}`}
    >
      {/* Glass overlay */}
      <div className="absolute inset-0 bg-white/5 backdrop-blur-sm" />
      
      {/* Hover glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-white/10 to-transparent" />
      
      <div className="relative z-10">
        <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-3 backdrop-blur-sm">
          <Icon size={24} className="text-white" />
        </div>
        <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
        <p className="text-white/70 text-sm">{subtitle}</p>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-white/10 blur-2xl group-hover:scale-150 transition-transform duration-500" />
    </motion.button>
  )
}

function LoveTimeline({ onNavigate }: { onNavigate: (view: 'album' | 'wish' | 'blessing') => void }) {
  const [currentStartDate, setCurrentStartDate] = useState(coupleInfo.startDate)
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft(currentStartDate))
  const [hoveredEvent, setHoveredEvent] = useState<string | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<LoveTimelineEvent | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editForm, setEditForm] = useState({ title: '', description: '', date: '', emoji: '' })
  const [timelineEvents, setTimelineEvents] = useState<LoveTimelineEvent[]>(
    initialLoveTimeline.map(t => ({ ...t, images: [] }))
  )
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [newPostForm, setNewPostForm] = useState({ 
    title: '', 
    description: '', 
    date: new Date().toISOString().split('T')[0], 
    emoji: '💕',
    images: [] as string[]
  })
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(currentStartDate))
    }, 1000)
    return () => clearInterval(timer)
  }, [currentStartDate])

  const handleChangeDate = () => {
    const newDate = prompt('请输入新的起始时间 (格式: YYYY-MM-DD)', currentStartDate.split('T')[0])
    if (newDate && !isNaN(new Date(newDate).getTime())) {
      setCurrentStartDate(`${newDate}T00:00:00`)
    }
  }

  const handleEventClick = (event: LoveTimelineEvent) => {
    setSelectedEvent(event)
    setIsModalOpen(true)
    setIsEditMode(false)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedEvent(null)
    setIsEditMode(false)
  }

  const handleEditEvent = (event: LoveTimelineEvent) => {
    setEditForm({
      title: event.title,
      description: event.description,
      date: event.date,
      emoji: event.emoji
    })
    setIsEditMode(true)
  }

  const handleSaveEdit = () => {
    if (selectedEvent && editForm.title.trim()) {
      setTimelineEvents(prev => prev.map(e => 
        e.id === selectedEvent.id 
          ? { ...e, ...editForm }
          : e
      ))
      setIsEditMode(false)
      setIsModalOpen(false)
      setSelectedEvent(null)
    }
  }

  const handleDeleteEvent = (id: string) => {
    setTimelineEvents(prev => prev.filter(e => e.id !== id))
    handleCloseModal()
  }

  const handleAddPost = () => {
    setIsAddModalOpen(true)
    setNewPostForm({ 
      title: '', 
      description: '', 
      date: new Date().toISOString().split('T')[0], 
      emoji: '💕',
      images: []
    })
  }

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false)
    setNewPostForm({ 
      title: '', 
      description: '', 
      date: new Date().toISOString().split('T')[0], 
      emoji: '💕',
      images: []
    })
  }

  const handleSaveNewPost = () => {
    if (newPostForm.title.trim()) {
      const newEvent: LoveTimelineEvent = {
        id: `event-${Date.now()}`,
        title: newPostForm.title,
        description: newPostForm.description,
        date: newPostForm.date,
        emoji: newPostForm.emoji,
        images: newPostForm.images
      }
      setTimelineEvents(prev => [newEvent, ...prev])
      handleCloseAddModal()
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    Array.from(files).forEach(file => {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setNewPostForm(prev => ({
            ...prev,
            images: [...prev.images, event.target!.result as string]
          }))
        }
      }
      reader.readAsDataURL(file)
    })
    e.target.value = ''
  }

  return (
    <div className="relative">
      {/* Header Section with Avatars */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12 relative"
      >
        <FloatingHearts />
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <p className="text-text-muted text-sm">那些一起走过的日子</p>
        </motion.div>

        {/* Couple Avatars */}
        <div className="flex items-center justify-center gap-8 sm:gap-16 mb-10">
          <CoupleAvatar src={coupleInfo.person1.avatar} name={coupleInfo.person1.name} delay={0.2} />
          
          {/* Heart connection */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: 'spring' }}
            className="relative"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Heart size={40} className="text-rose fill-rose/80 drop-shadow-lg" />
            </motion.div>
            {/* Connection lines */}
            <div className="absolute top-1/2 -left-8 w-8 h-px bg-gradient-to-r from-transparent to-rose/50" />
            <div className="absolute top-1/2 -right-8 w-8 h-px bg-gradient-to-l from-transparent to-rose/50" />
          </motion.div>
          
          <CoupleAvatar src={coupleInfo.person2.avatar} name={coupleInfo.person2.name} delay={0.3} />
        </div>

        {/* Countdown Timer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-12"
        >
          <p className="text-text-muted text-sm mb-4">这是我们在一起的时间</p>
          <div className="flex items-center justify-center gap-3 sm:gap-6 flex-wrap mb-6">
            <CountdownNumber value={timeLeft.days} label="天" />
            <span className="text-2xl sm:text-3xl text-rose/60 font-light">·</span>
            <CountdownNumber value={timeLeft.hours} label="时" />
            <span className="text-2xl sm:text-3xl text-rose/60 font-light">·</span>
            <CountdownNumber value={timeLeft.minutes} label="分" />
            <span className="text-2xl sm:text-3xl text-rose/60 font-light">·</span>
            <CountdownNumber value={timeLeft.seconds} label="秒" />
          </div>

          <div className="flex items-center justify-center gap-4">
            <p className="text-text-muted italic text-xs flex items-center gap-2">
              <Timer size={12} />
              始于 {new Date(currentStartDate).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleChangeDate}
              className="flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-900/20 text-rose text-[10px] font-medium border border-rose-200 dark:border-rose-900/50 hover:bg-rose-100 transition-colors"
            >
              <Calendar size={12} />
              更改起始时间
            </motion.button>
          </div>
        </motion.div>
      </motion.div>

      {/* Feature Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="grid grid-cols-3 gap-3 sm:gap-4 mb-12 max-w-3xl mx-auto"
      >
        <FeatureButton
          icon={Images}
          title="时光相册"
          subtitle="记录美好瞬间"
          gradient="bg-gradient-to-br from-rose/80 to-pink/80"
          onClick={() => onNavigate('album')}
          delay={0.8}
        />
        <FeatureButton
          icon={Gift}
          title="许愿清单"
          subtitle="一起完成的愿望"
          gradient="bg-gradient-to-br from-cyan-500 to-blue-500"
          onClick={() => onNavigate('wish')}
          delay={0.9}
        />
        <FeatureButton
          icon={ScrollText}
          title="祝福板"
          subtitle="朋友们的祝福"
          gradient="bg-gradient-to-br from-primary/80 to-violet/80"
          onClick={() => onNavigate('blessing')}
          delay={1.0}
        />
      </motion.div>

      {/* Timeline Section */}
      <div className="relative max-w-4xl mx-auto px-4">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="text-center mb-8"
        >
          <h3 className="text-lg font-semibold text-text flex items-center justify-center gap-2">
            <span className="w-8 h-px bg-gradient-to-r from-transparent to-rose/50" />
            <span className="text-text-muted">点点滴滴</span>
            <span className="w-8 h-px bg-gradient-to-l from-transparent to-rose/50" />
          </h3>
        </motion.div>

        {/* 新增帖子按钮 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.15 }}
          className="flex justify-center mb-6"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddPost}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose text-white text-sm font-medium hover:bg-rose/90 transition-colors"
          >
            <Plus size={18} />
            <span>新增帖子</span>
          </motion.button>
        </motion.div>

        {/* Central line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-rose/50 via-primary/30 to-transparent -translate-x-1/2 hidden sm:block" />
        
        {/* Mobile line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-rose/50 via-primary/30 to-transparent sm:hidden" />

        <div className="space-y-8 sm:space-y-12">
          {timelineEvents.map((event, index) => {
            const isLeft = index % 2 === 0
            const isHovered = hoveredEvent === event.id
            
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2 + index * 0.1, duration: 0.5 }}
                className={`relative flex items-center ${isLeft ? 'sm:flex-row' : 'sm:flex-row-reverse'} flex-row cursor-pointer`}
                onMouseEnter={() => setHoveredEvent(event.id)}
                onMouseLeave={() => setHoveredEvent(null)}
                onClick={() => handleEventClick(event)}
              >
                {/* Content card */}
                <div className={`w-full sm:w-5/12 ${isLeft ? 'sm:text-right sm:pr-8' : 'sm:text-left sm:pl-8'} pl-12 sm:pl-0`}>
                  <motion.div
                    whileHover={{ scale: 1.02, y: -2 }}
                    className={`glass-card p-5 sm:p-6 relative overflow-hidden transition-all duration-300 ${
                      isHovered ? 'border-rose/30 shadow-lg shadow-rose/10' : ''
                    }`}
                  >
                    {/* Background glow on hover */}
                    <div 
                      className={`absolute inset-0 bg-gradient-to-br from-rose/5 to-primary/5 transition-opacity duration-300 ${
                        isHovered ? 'opacity-100' : 'opacity-0'
                      }`}
                    />
                    
                    <div className="relative z-10">
                      {/* Date */}
                      <div className={`flex items-center gap-2 mb-2 ${isLeft ? 'sm:justify-end' : 'justify-start'}`}>
                        <span className="text-xs font-medium text-rose">{event.date}</span>
                        <span className="text-lg">{event.emoji}</span>
                      </div>
                      
                      {/* Title */}
                      <h3 className="text-base sm:text-lg font-semibold text-text mb-2">
                        {event.title}
                      </h3>
                      
                      {/* Description */}
                      <p className="text-sm text-text-secondary leading-relaxed line-clamp-2">
                        {event.description}
                      </p>
                      
                      {/* Click hint */}
                      <div className={`mt-3 text-xs text-rose/60 flex items-center gap-1 ${isLeft ? 'sm:justify-end' : 'justify-start'}`}>
                        <span>点击查看详情</span>
                        <Sparkles size={10} />
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Center dot */}
                <div className="absolute left-4 sm:left-1/2 top-1/2 -translate-y-1/2 sm:-translate-x-1/2 z-10">
                  <motion.div
                    whileHover={{ scale: 1.3 }}
                    className={`w-4 h-4 rounded-full border-2 border-bg transition-colors duration-300 ${
                      isHovered ? 'bg-rose shadow-lg shadow-rose/50' : 'bg-rose/80'
                    }`}
                  >
                    <div className={`w-full h-full rounded-full bg-rose animate-ping ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
                  </motion.div>
                </div>

                {/* Empty space for alternating layout on desktop */}
                <div className="hidden sm:block sm:w-5/12" />
              </motion.div>
            )
          })}
        </div>

        {/* Bottom decoration */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          className="text-center mt-16 pt-8 border-t border-border/50"
        >
          <p className="text-text-muted text-sm mb-3">故事还在继续，未来可期</p>
          <div className="flex items-center justify-center gap-2">
            <Heart size={14} className="text-rose fill-rose animate-pulse" />
            <Heart size={18} className="text-rose fill-rose animate-pulse delay-75" />
            <Heart size={14} className="text-rose fill-rose animate-pulse delay-150" />
          </div>
        </motion.div>
      </div>

      {/* Detail Modal */}
      <LoveDetailModal
        event={selectedEvent}
        isOpen={isModalOpen}
        isEditMode={isEditMode}
        editForm={editForm}
        onClose={handleCloseModal}
        onEdit={handleEditEvent}
        onDelete={handleDeleteEvent}
        onSaveEdit={handleSaveEdit}
        onEditFormChange={setEditForm}
      />

      {/* Add Post Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={handleCloseAddModal}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto glass-card"
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border/50">
                <h3 className="text-lg font-semibold text-text">新增帖子</h3>
                <button
                  onClick={handleCloseAddModal}
                  className="p-1.5 rounded-lg text-text-muted hover:text-text hover:bg-surface transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Form */}
              <div className="p-4 space-y-4">
                {/* 标题 */}
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1.5">标题</label>
                  <input
                    type="text"
                    value={newPostForm.title}
                    onChange={e => setNewPostForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="例如：在一起的第一天"
                    className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-text text-sm placeholder:text-text-muted focus:outline-none focus:border-rose/50"
                  />
                </div>

                {/* 日期和表情 */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-text-muted mb-1.5">日期</label>
                    <input
                      type="date"
                      value={newPostForm.date}
                      onChange={e => setNewPostForm(prev => ({ ...prev, date: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-text text-sm focus:outline-none focus:border-rose/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-text-muted mb-1.5">表情</label>
                    <input
                      type="text"
                      value={newPostForm.emoji}
                      onChange={e => setNewPostForm(prev => ({ ...prev, emoji: e.target.value }))}
                      placeholder="💕"
                      className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-text text-sm text-center focus:outline-none focus:border-rose/50"
                    />
                  </div>
                </div>

                {/* 描述 */}
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1.5">内容描述</label>
                  <textarea
                    value={newPostForm.description}
                    onChange={e => setNewPostForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="记录下这个特别的时刻..."
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-text text-sm placeholder:text-text-muted focus:outline-none focus:border-rose/50 resize-none"
                  />
                </div>

                {/* 图片上传 */}
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1.5">图片</label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  
                  {/* 图片预览 */}
                  {newPostForm.images.length > 0 && (
                    <div className="grid grid-cols-4 gap-2 mb-3">
                      {newPostForm.images.map((img, index) => (
                        <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                          <img src={img} alt={`预览 ${index + 1}`} className="w-full h-full object-cover" />
                          <button
                            onClick={() => setNewPostForm(prev => ({
                              ...prev,
                              images: prev.images.filter((_, i) => i !== index)
                            }))}
                            className="absolute top-0.5 right-0.5 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center text-white text-xs hover:bg-black/80"
                          >
                            <X size={10} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* 上传按钮 */}
                  {newPostForm.images.length < 9 && (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed border-border text-text-muted hover:border-rose hover:text-rose transition-colors"
                    >
                      <Plus size={16} />
                      <span className="text-sm">上传图片 ({newPostForm.images.length}/9)</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-2 p-4 border-t border-border/50">
                <button
                  onClick={handleCloseAddModal}
                  className="px-4 py-2 rounded-lg text-sm text-text-muted hover:text-text transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleSaveNewPost}
                  disabled={!newPostForm.title.trim()}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-rose text-white text-sm font-medium hover:bg-rose/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Plus size={14} />
                  发布帖子
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ===== Moments (朋友圈) ===== */
// 图片网格组件 - 支持单图、多图、九宫格布局
function ImageGrid({ images, onImageClick }: { images: string[]; onImageClick?: (index: number) => void }) {
  if (images.length === 0) return null

  // 单图布局
  if (images.length === 1) {
    return (
      <div className="mt-3">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="relative overflow-hidden rounded-lg cursor-pointer max-w-[280px]"
          onClick={() => onImageClick?.(0)}
        >
          <img
            src={images[0]}
            alt="朋友圈图片"
            className="w-full h-auto object-cover max-h-[320px]"
            loading="lazy"
          />
        </motion.div>
      </div>
    )
  }

  // 四图特殊布局 (2x2)
  if (images.length === 4) {
    return (
      <div className="mt-3 grid grid-cols-2 gap-1 max-w-[280px]">
        {images.map((img, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.02 }}
            className="relative aspect-square overflow-hidden rounded-lg cursor-pointer"
            onClick={() => onImageClick?.(index)}
          >
            <img
              src={img}
              alt={`朋友圈图片 ${index + 1}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </motion.div>
        ))}
      </div>
    )
  }

  // 九宫格或其他多图布局
  const gridCols = images.length >= 5 ? 'grid-cols-3' : 'grid-cols-2'
  return (
    <div className={`mt-3 grid ${gridCols} gap-1 max-w-[280px]`}>
      {images.map((img, index) => (
        <motion.div
          key={index}
          whileHover={{ scale: 1.02 }}
          className="relative aspect-square overflow-hidden rounded-lg cursor-pointer"
          onClick={() => onImageClick?.(index)}
        >
          <img
            src={img}
            alt={`朋友圈图片 ${index + 1}`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </motion.div>
      ))}
    </div>
  )
}

// 视频组件
function VideoCard({ video, thumbnail }: { video?: { url: string; thumbnail: string; duration: string }; thumbnail?: string }) {
  if (!video && !thumbnail) return null
  
  const thumbUrl = video?.thumbnail || thumbnail
  const duration = video?.duration || '0:00'
  
  return (
    <div className="mt-3 relative max-w-[280px]">
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="relative overflow-hidden rounded-lg cursor-pointer aspect-video bg-surface"
      >
        <img
          src={thumbUrl}
          alt="视频封面"
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {/* 播放按钮遮罩 */}
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
            <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-text border-b-[8px] border-b-transparent ml-1" />
          </div>
        </div>
        {/* 时长标签 */}
        <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/60 rounded text-xs text-white">
          {duration}
        </div>
      </motion.div>
    </div>
  )
}

// 评论列表组件
function CommentList({ comments, isExpanded }: { comments: PostComment[]; isExpanded: boolean }) {
  if (comments.length === 0 || !isExpanded) return null

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="mt-3 bg-surface/50 rounded-lg p-3"
    >
      <div className="space-y-2">
        {comments.map((comment) => (
          <div key={comment.id} className="text-sm">
            <span className="font-medium text-primary">{comment.author}</span>
            <span className="text-text-secondary">：{comment.content}</span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

// 语音输入 Hook
function useSpeechRecognition(onResult: (text: string) => void) {
  const [isListening, setIsListening] = useState(false)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const isSupported = typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)

  const startListening = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    
    if (!SpeechRecognitionAPI) {
      alert('您的浏览器不支持语音识别功能')
      return
    }

    const recognition = new SpeechRecognitionAPI()
    recognition.continuous = false
    recognition.interimResults = true
    recognition.lang = 'zh-CN'

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      let finalTranscript = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          finalTranscript += transcript
        }
      }

      if (finalTranscript) {
        onResult(finalTranscript)
      }
    }

    recognition.onerror = () => {
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognition.start()
    setIsListening(true)
  }

  const stopListening = () => {
    setIsListening(false)
  }

  return { isListening, startListening, stopListening, isSupported }
}

// 发布框内容组件
function PostInputContent({ 
  onSubmit, 
  onCancel,
  editingPost,
}: { 
  onSubmit: (content: string, images: string[], video?: { url: string; thumbnail: string; duration: string }) => void
  onCancel: () => void
  editingPost?: SocialPost | null
}) {
  const [content, setContent] = useState(editingPost?.content || '')
  const [previewImages, setPreviewImages] = useState<string[]>(editingPost?.images || [])
  const [previewVideo, setPreviewVideo] = useState<{ url: string; thumbnail: string; duration: string } | null>(editingPost?.video || null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)
  
  // 语音转文字 - 使用回调方式避免 useEffect 中的 setState
  const { isListening, startListening, stopListening, isSupported } = useSpeechRecognition((text) => {
    setContent(prev => prev + text)
  })

  const handleSubmit = async () => {
    if (!content.trim() && previewImages.length === 0 && !previewVideo) return
    
    setIsSubmitting(true)
    // 模拟提交延迟
    await new Promise(resolve => setTimeout(resolve, 500))
    onSubmit(content, previewImages, previewVideo || undefined)
    setContent('')
    setPreviewImages([])
    setPreviewVideo(null)
    setIsSubmitting(false)
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    // 如果有视频，先清除视频
    if (previewVideo) {
      setPreviewVideo(null)
    }

    // 模拟图片上传 - 使用随机 Unsplash 图片
    const newImages: string[] = []
    const unsplashIds = [
      'photo-1495474472287-4d71bcdd2085',
      'photo-1506905925346-21bda4d32df4',
      'photo-1448375240586-882707db888b',
      'photo-1477959858617-67f85cf4f1df',
      'photo-1504674900247-0877df9cc836',
    ]
    
    for (let i = 0; i < Math.min(files.length, 9 - previewImages.length); i++) {
      const randomId = unsplashIds[Math.floor(Math.random() * unsplashIds.length)]
      newImages.push(`https://images.unsplash.com/${randomId}?w=800&q=80`)
    }
    
    setPreviewImages(prev => [...prev, ...newImages].slice(0, 9))
  }

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // 清除图片
    setPreviewImages([])

    // 模拟视频上传 - 使用示例视频数据
    const videoUrl = URL.createObjectURL(file)
    setPreviewVideo({
      url: videoUrl,
      thumbnail: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80',
      duration: '0:00',
    })

    // 模拟获取视频时长
    const video = document.createElement('video')
    video.preload = 'metadata'
    video.onloadedmetadata = () => {
      const minutes = Math.floor(video.duration / 60)
      const seconds = Math.floor(video.duration % 60)
      setPreviewVideo(prev => prev ? {
        ...prev,
        duration: `${minutes}:${seconds.toString().padStart(2, '0')}`,
      } : null)
      URL.revokeObjectURL(videoUrl)
    }
    video.src = videoUrl
  }

  const removeImage = (index: number) => {
    setPreviewImages(prev => prev.filter((_, i) => i !== index))
  }

  const removeVideo = () => {
    setPreviewVideo(null)
  }

  const toggleVoiceInput = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  const isEditing = !!editingPost

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-xl p-4 mb-6"
    >
      <div className="flex gap-3">
        {/* 头像 */}
        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border border-gray-100 bg-surface">
          <img src="https://tse2.mm.bing.net/th/id/OIP.JXixrtqu6-SGuc8H2zyFogHaHa?rs=1&pid=ImgDetMain&o=7&rm=3" alt="头像" className="w-full h-full object-cover" />
        </div>
        
        <div className="flex-1">
          {/* 文字输入区 - 微信朋友圈风格 */}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={isEditing ? '编辑你的动态...' : isListening ? '正在聆听...' : '分享你的想法...'}
            rows={isEditing ? 4 : 3}
            className="w-full bg-transparent border-none resize-none text-[15px] text-text placeholder:text-text-muted focus:outline-none leading-relaxed"
            style={{ minHeight: isEditing ? '80px' : '60px' }}
          />
          
          {/* 语音输入指示器 */}
          {isListening && (
            <div className="flex items-center gap-2 mt-3 text-rose text-sm bg-rose/5 px-3 py-2 rounded-lg">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose"></span>
              </span>
              正在录音，点击麦克风按钮停止
            </div>
          )}
          
          {/* 图片预览区 - 微信朋友圈风格网格 */}
          {previewImages.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mt-3">
              {previewImages.map((img, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                  <img src={img} alt={`预览 ${index + 1}`} className="w-full h-full object-cover" />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 w-5 h-5 bg-black/50 rounded-full flex items-center justify-center text-white text-xs hover:bg-black/70 transition-colors"
                  >
                    ×
                  </button>
                </div>
              ))}
              {previewImages.length < 9 && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square rounded-lg border border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:border-primary hover:text-primary transition-colors bg-gray-50"
                >
                  <Plus size={24} strokeWidth={1.5} />
                </button>
              )}
            </div>
          )}

          {/* 视频预览区 */}
          {previewVideo && (
            <div className="relative mt-3 max-w-[240px]">
              <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                <img src={previewVideo.thumbnail} alt="视频封面" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                    <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[12px] border-l-gray-800 border-b-[8px] border-b-transparent ml-1" />
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/60 rounded text-xs text-white">
                  {previewVideo.duration}
                </div>
              </div>
              <button
                onClick={removeVideo}
                className="absolute -top-2 -right-2 w-6 h-6 bg-gray-800 text-white rounded-full flex items-center justify-center text-xs hover:bg-gray-700 transition-colors shadow-md"
              >
                ×
              </button>
            </div>
          )}
          
          {/* 操作栏 - 微信朋友圈风格 */}
          <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100">
            <div className="flex items-center gap-1">
              {/* 图片按钮 */}
              {!previewVideo && previewImages.length < 9 && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-gray-600 hover:text-primary hover:bg-primary/5 transition-colors"
                >
                  <ImageIcon size={18} strokeWidth={1.5} />
                  <span className="hidden sm:inline">图片</span>
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageSelect}
              />
              
              {/* 视频按钮 */}
              {!previewVideo && previewImages.length === 0 && (
                <button
                  onClick={() => videoInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-gray-600 hover:text-primary hover:bg-primary/5 transition-colors"
                >
                  <Film size={18} strokeWidth={1.5} />
                  <span className="hidden sm:inline">视频</span>
                </button>
              )}
              <input
                ref={videoInputRef}
                type="file"
                accept="video/*"
                className="hidden"
                onChange={handleVideoSelect}
              />
              
              {/* 语音输入按钮 */}
              {isSupported && previewImages.length === 0 && !previewVideo && (
                <button
                  onClick={toggleVoiceInput}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                    isListening 
                      ? 'text-rose bg-rose/10' 
                      : 'text-gray-600 hover:text-primary hover:bg-primary/5'
                  }`}
                >
                  {isListening ? <Square size={16} strokeWidth={1.5} /> : <Mic size={18} strokeWidth={1.5} />}
                  <span className="hidden sm:inline">{isListening ? '停止' : '语音'}</span>
                </button>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              {isEditing && (
                <button
                  onClick={onCancel}
                  className="px-4 py-2 rounded-lg text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  取消
                </button>
              )}
              <button
                onClick={handleSubmit}
                disabled={(!content.trim() && previewImages.length === 0 && !previewVideo) || isSubmitting}
                className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                {isSubmitting ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Send size={16} strokeWidth={1.5} />
                )}
                {isEditing ? '保存' : '发布'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// 发布框组件
function PostInput({ 
  onSubmit, 
  onCancel,
  editingPost,
}: { 
  onSubmit: (content: string, images: string[], video?: { url: string; thumbnail: string; duration: string }) => void
  onCancel: () => void
  editingPost?: SocialPost | null
}) {
  // 使用 key 来强制重新渲染，避免在 useEffect 中调用 setState
  return (
    <PostInputContent
      key={editingPost?.id || 'new'}
      onSubmit={onSubmit}
      onCancel={onCancel}
      editingPost={editingPost}
    />
  )
}

// 动态卡片组件
function PostCard({ 
  post, 
  index, 
  onLike, 
  onEdit, 
  onDelete,
  isExpanded,
  onToggleExpand,
}: { 
  post: SocialPost
  index: number
  onLike: (id: string) => void
  onEdit: (post: SocialPost) => void
  onDelete: (id: string) => void
  isExpanded: boolean
  onToggleExpand: (id: string) => void
}) {
  const [showMenu, setShowMenu] = useState(false)
  const [imagePreview, setImagePreview] = useState<number | null>(null)

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.08 }}
        className="glass-card p-4 sm:p-5"
      >
        {/* 头部：头像、名字、时间、菜单 */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold flex-shrink-0 overflow-hidden border border-border">
              <img 
                src={post.avatar} 
                alt="" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  const span = document.createElement('span');
                  span.innerText = post.author.charAt(0);
                  (e.target as HTMLImageElement).parentElement!.appendChild(span);
                }}
              />
            </div>
            <div>
              <p className="text-sm font-semibold text-text">{post.author}</p>
              <div className="flex items-center gap-2 text-xs text-text-muted">
                <span>{post.date}</span>
                {post.location && (
                  <>
                    <span>·</span>
                    <span className="flex items-center gap-0.5">
                      <MapPin size={10} />
                      {post.location}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
          
          {/* 更多操作菜单 */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 rounded-lg text-text-muted hover:text-text hover:bg-surface transition-colors"
            >
              <MoreHorizontal size={16} />
            </button>
            
            <AnimatePresence>
              {showMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute right-0 top-full mt-1 py-1 bg-card border border-border rounded-lg shadow-lg z-10 min-w-[100px]"
                >
                  <button
                    onClick={() => {
                      onEdit(post)
                      setShowMenu(false)
                    }}
                    className="w-full px-3 py-1.5 text-left text-sm text-text hover:bg-surface transition-colors"
                  >
                    编辑
                  </button>
                  <button
                    onClick={() => {
                      onDelete(post.id)
                      setShowMenu(false)
                    }}
                    className="w-full px-3 py-1.5 text-left text-sm text-rose hover:bg-rose/10 transition-colors"
                  >
                    删除
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* 内容 */}
        <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">{post.content}</p>

        {/* 图片或视频 */}
        {post.video ? (
          <VideoCard video={post.video} />
        ) : (
          <ImageGrid 
            images={post.images} 
            onImageClick={(idx) => setImagePreview(idx)}
          />
        )}

        {/* 点赞和评论区域 */}
        <div className="mt-4 pt-3 border-t border-border">
          {/* 点赞/评论按钮 */}
          <div className="flex items-center gap-6">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => onLike(post.id)}
              className={`flex items-center gap-1.5 text-xs transition-colors ${
                post.isLiked ? 'text-rose' : 'text-text-muted hover:text-rose'
              }`}
            >
              <ThumbsUp size={14} className={post.isLiked ? 'fill-rose' : ''} />
              <span>{post.likes || '点赞'}</span>
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => onToggleExpand(post.id)}
              className={`flex items-center gap-1.5 text-xs transition-colors ${
                isExpanded ? 'text-primary' : 'text-text-muted hover:text-primary'
              }`}
            >
              <MessageCircle size={14} />
              <span>{post.comments.length > 0 ? post.comments.length : '评论'}</span>
            </motion.button>
          </div>

          {/* 评论区 */}
          <AnimatePresence>
            {isExpanded && (
              <CommentList comments={post.comments} isExpanded={isExpanded} />
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* 图片预览弹窗 */}
      <AnimatePresence>
        {imagePreview !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setImagePreview(null)}
          >
            <button
              className="absolute top-4 right-4 p-2 text-white/80 hover:text-white"
              onClick={() => setImagePreview(null)}
            >
              <X size={24} />
            </button>
            <img
              src={post.images[imagePreview]}
              alt="大图预览"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            {post.images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {post.images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation()
                      setImagePreview(idx)
                    }}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      idx === imagePreview ? 'bg-white' : 'bg-white/40'
                    }`}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// 主朋友圈组件
function Moments() {
  const [posts, setPosts] = useState<SocialPost[]>(initialSocialPosts)
  const [editingPost, setEditingPost] = useState<SocialPost | null>(null)
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null)

  // 处理发布/编辑提交
  const handleSubmit = (content: string, images: string[], video?: { url: string; thumbnail: string; duration: string }) => {
    if (editingPost) {
      // 编辑模式
      setPosts(prev => prev.map(post => 
        post.id === editingPost.id 
          ? { ...post, content, images, video }
          : post
      ))
      setEditingPost(null)
    } else {
      // 新建模式
      const newPost: SocialPost = {
        id: `post-${Date.now()}`,
        author: '晓叶',
        avatar: 'https://tse2.mm.bing.net/th/id/OIP.JXixrtqu6-SGuc8H2zyFogHaHa?rs=1&pid=ImgDetMain&o=7&rm=3',
        date: new Date().toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        }).replace(/\//g, '-'),
        content,
        images: video ? [] : images,
        video,
        likes: 0,
        isLiked: false,
        comments: [],
      }
      setPosts(prev => [newPost, ...prev])
    }
  }

  // 处理点赞
  const handleLike = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1 
          }
        : post
    ))
  }

  // 处理编辑
  const handleEdit = (post: SocialPost) => {
    setEditingPost(post)
    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // 处理删除
  const handleDelete = (postId: string) => {
    if (confirm('确定要删除这条动态吗？')) {
      setPosts(prev => prev.filter(post => post.id !== postId))
    }
  }

  // 切换评论展开
  const toggleExpand = (postId: string) => {
    setExpandedPostId(prev => prev === postId ? null : postId)
  }

  // 取消编辑
  const handleCancelEdit = () => {
    setEditingPost(null)
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* 发布框 */}
      <PostInput 
        onSubmit={handleSubmit} 
        onCancel={handleCancelEdit}
        editingPost={editingPost}
      />

      {/* 动态列表 */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {posts.map((post, index) => (
            <PostCard
              key={post.id}
              post={post}
              index={index}
              onLike={handleLike}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isExpanded={expandedPostId === post.id}
              onToggleExpand={toggleExpand}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* 底部提示 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center py-8 text-text-muted text-sm"
      >
        <p>—— 已经到底了 ——</p>
      </motion.div>
    </div>
  )
}

/* ===== Travel Album ===== */
function TravelAlbum({ onSelect }: {
  selectedLocation?: string | null
  onSelect: (id: string | null) => void
}) {
  const [modalLocation, setModalLocation] = useState<TravelLocation | null>(null)
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [travelLocations, setTravelLocations] = useState<TravelLocation[]>(initialTravelLocations)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleMapLocationClick = (location: TravelLocation) => {
    setModalLocation(location)
    onSelect(location.id)
  }

  const closeModal = () => {
    setModalLocation(null)
    onSelect(null)
  }

  // 新增地点
  const handleAddLocation = (locationData: Omit<TravelLocation, 'id'>) => {
    const newLocation: TravelLocation = {
      ...locationData,
      id: `travel-${Date.now()}`
    }
    setTravelLocations(prev => [...prev, newLocation])
  }

  // 编辑地点
  const handleEditLocation = (id: string, locationData: Partial<TravelLocation>) => {
    setTravelLocations(prev => prev.map(loc => 
      loc.id === id ? { ...loc, ...locationData } : loc
    ))
  }

  // 删除地点
  const handleDeleteLocation = (id: string) => {
    setTravelLocations(prev => prev.filter(loc => loc.id !== id))
  }

  return (
    <div className="space-y-6">
      {/* 中国地图 - 放在上方 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card p-4 sm:p-6 relative overflow-hidden"
      >
        {/* Map title */}
        <div className="relative z-10 mb-4">
          <h3 className="text-base sm:text-lg font-semibold text-text flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary/10">
              <MapPin size={16} className="text-primary" />
            </div>
            <span className="bg-gradient-to-r from-red-500 via-orange-400 via-yellow-400 via-green-400 via-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
              中国旅行足迹
            </span>
          </h3>
          <p className="text-xs text-text-muted mt-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            点击地图上的光点查看旅行记录，拖拽可平移，滚轮可缩放
          </p>
        </div>

        {/* 中国地图组件 */}
        <ChinaMap
          locations={travelLocations}
          onLocationClick={handleMapLocationClick}
          hoveredLocation={hoveredLocation}
          onLocationHover={setHoveredLocation}
          height={isMobile ? 350 : 500}
        />
      </motion.div>

      {/* 旅拍相册管理 */}
      <TravelManager
        locations={travelLocations}
        onAdd={handleAddLocation}
        onEdit={handleEditLocation}
        onDelete={handleDeleteLocation}
        onLocationClick={handleMapLocationClick}
      />

      {/* 旅行详情弹窗 */}
      <TravelDetailModal
        location={modalLocation}
        isOpen={!!modalLocation}
        onClose={closeModal}
      />
    </div>
  )
}

/* ===== Sports Section ===== */
function SportsSection() {
  const [, setActiveSport] = useState<'running' | 'cycling' | 'swimming' | 'fitness' | null>(null)
  const [stats] = useState({
    running: { distance: 156.8, time: '12h 30m', calories: 12540 },
    cycling: { distance: 289.5, time: '18h 45m', calories: 18920 },
    swimming: { distance: 15.2, time: '8h 20m', calories: 8960 },
    fitness: { count: 48, time: '24h 00m', calories: 15600 }
  })

  const sportTypes = [
    { id: 'running', name: '跑步', icon: Flame, color: 'from-orange-400 to-red-500', bgColor: 'bg-orange-50', iconColor: 'text-orange-500' },
    { id: 'cycling', name: '骑行', icon: Zap, color: 'from-cyan-400 to-blue-500', bgColor: 'bg-cyan-50', iconColor: 'text-cyan-500' },
    { id: 'swimming', name: '游泳', icon: Timer, color: 'from-blue-400 to-indigo-500', bgColor: 'bg-blue-50', iconColor: 'text-blue-500' },
    { id: 'fitness', name: '健身', icon: Dumbbell, color: 'from-violet-400 to-purple-500', bgColor: 'bg-violet-50', iconColor: 'text-violet-500' },
  ] as const

  const weeklyData = [
    { day: '周一', value: 65 },
    { day: '周二', value: 80 },
    { day: '周三', value: 45 },
    { day: '周四', value: 90 },
    { day: '周五', value: 70 },
    { day: '周六', value: 100 },
    { day: '周日', value: 85 },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-2xl font-bold text-text mb-2 flex items-center justify-center gap-2">
          <Trophy className="text-amber-500" size={28} />
          运动中心
        </h2>
        <p className="text-text-muted">记录每一次汗水，见证更好的自己</p>
      </motion.div>

      {/* Sport Type Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {sportTypes.map((sport, index) => (
          <motion.button
            key={sport.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.05 }}
            whileHover={{ scale: 1.03, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveSport(sport.id)}
            className={`relative overflow-hidden rounded-2xl p-5 text-left transition-all duration-300 group bg-gradient-to-br ${sport.color}`}
          >
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-white/20 to-transparent" />
            
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-3 backdrop-blur-sm">
                <sport.icon size={24} className="text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">{sport.name}</h3>
              <p className="text-white/70 text-sm">
                {sport.id === 'fitness' ? `${stats.fitness.count} 次` : `${stats[sport.id].distance} km`}
              </p>
            </div>
            
            <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-white/10 blur-2xl group-hover:scale-150 transition-transform duration-500" />
          </motion.button>
        ))}
      </motion.div>

      {/* Weekly Activity Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-text flex items-center gap-2">
            <Target size={20} className="text-primary" />
            本周运动趋势
          </h3>
          <span className="text-sm text-text-muted">总消耗 2,450 千卡</span>
        </div>
        
        <div className="flex items-end justify-between gap-2 h-40">
          {weeklyData.map((data, index) => (
            <div key={data.day} className="flex-1 flex flex-col items-center gap-2">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${data.value}%` }}
                transition={{ delay: 0.4 + index * 0.05, duration: 0.5 }}
                className="w-full max-w-12 bg-gradient-to-t from-primary to-primary/50 rounded-t-lg relative group"
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-text text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {data.value}%
                </div>
              </motion.div>
              <span className="text-xs text-text-muted">{data.day}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Achievement Badges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card rounded-2xl p-6"
      >
        <h3 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
          <Medal size={20} className="text-amber-500" />
          成就徽章
        </h3>
        
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
          {[
            { name: '初跑者', icon: '🏃', color: 'from-orange-300 to-orange-400', unlocked: true },
            { name: '骑行者', icon: '🚴', color: 'from-cyan-300 to-cyan-400', unlocked: true },
            { name: '游泳健将', icon: '🏊', color: 'from-blue-300 to-blue-400', unlocked: true },
            { name: '健身达人', icon: '💪', color: 'from-violet-300 to-violet-400', unlocked: false },
            { name: '坚持30天', icon: '📅', color: 'from-green-300 to-green-400', unlocked: true },
            { name: '燃脂高手', icon: '🔥', color: 'from-red-300 to-red-400', unlocked: false },
          ].map((badge, index) => (
            <motion.div
              key={badge.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + index * 0.05 }}
              className={`flex flex-col items-center gap-2 p-3 rounded-xl ${
                badge.unlocked ? 'bg-surface' : 'bg-surface/50 opacity-50'
              }`}
            >
              <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${badge.color} flex items-center justify-center text-2xl ${!badge.unlocked && 'grayscale'}`}>
                {badge.icon}
              </div>
              <span className="text-xs text-text-muted text-center">{badge.name}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="flex gap-3"
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
        >
          <Plus size={18} />
          记录运动
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 py-3 rounded-xl bg-surface border border-border text-text font-medium hover:bg-surface/80 transition-colors flex items-center justify-center gap-2"
        >
          <Target size={18} />
          设置目标
        </motion.button>
      </motion.div>
    </div>
  )
}

/* ===== Games Section ===== */
function GamesSection() {
  const [, setSelectedGame] = useState<string | null>(null)

  const games = [
    {
      id: 'memory',
      name: '记忆翻牌',
      description: '考验你的记忆力',
      icon: '🧠',
      color: 'from-pink-400 to-rose-500',
      players: '1人',
      difficulty: '简单'
    },
    {
      id: 'puzzle',
      name: '数字拼图',
      description: '经典益智游戏',
      icon: '🧩',
      color: 'from-blue-400 to-indigo-500',
      players: '1人',
      difficulty: '中等'
    },
    {
      id: 'reaction',
      name: '反应测试',
      description: '挑战反应速度',
      icon: '⚡',
      color: 'from-yellow-400 to-orange-500',
      players: '1人',
      difficulty: '简单'
    },
    {
      id: 'word',
      name: '猜词游戏',
      description: '丰富你的词汇',
      icon: '📝',
      color: 'from-green-400 to-emerald-500',
      players: '2-4人',
      difficulty: '中等'
    }
  ]

  const gameStats = {
    totalPlayTime: '128小时',
    favoriteGame: '记忆翻牌',
    achievements: 24,
    streak: 7
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-2xl font-bold text-text mb-2 flex items-center justify-center gap-2">
          <Gamepad2 className="text-primary" size={28} />
          游戏中心
        </h2>
        <p className="text-text-muted">放松身心，享受游戏时光</p>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {[
          { label: '游戏时长', value: gameStats.totalPlayTime, icon: Timer, color: 'text-blue-500', bgColor: 'bg-blue-50' },
          { label: '最爱游戏', value: gameStats.favoriteGame, icon: Star, color: 'text-amber-500', bgColor: 'bg-amber-50' },
          { label: '成就解锁', value: gameStats.achievements, icon: Trophy, color: 'text-violet-500', bgColor: 'bg-violet-50' },
          { label: '连续打卡', value: `${gameStats.streak}天`, icon: Flame, color: 'text-orange-500', bgColor: 'bg-orange-50' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.05 }}
            className="glass-card rounded-xl p-4 text-center"
          >
            <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center mx-auto mb-2`}>
              <stat.icon size={20} className={stat.color} />
            </div>
            <p className="text-2xl font-bold text-text">{stat.value}</p>
            <p className="text-xs text-text-muted">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Games Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        {games.map((game, index) => (
          <motion.button
            key={game.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.05 }}
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedGame(game.id)}
            className={`relative overflow-hidden rounded-2xl p-6 text-left transition-all duration-300 group bg-gradient-to-br ${game.color}`}
          >
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-white/20 to-transparent" />
            
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-4xl backdrop-blur-sm">
                  {game.icon}
                </div>
                <div className="flex gap-2">
                  <span className="px-2 py-1 rounded-full bg-white/20 text-white text-xs backdrop-blur-sm">
                    {game.players}
                  </span>
                  <span className="px-2 py-1 rounded-full bg-white/20 text-white text-xs backdrop-blur-sm">
                    {game.difficulty}
                  </span>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-1">{game.name}</h3>
              <p className="text-white/70 text-sm">{game.description}</p>
              
              <div className="mt-4 flex items-center gap-2 text-white/80 text-sm">
                <span className="flex items-center gap-1">
                  <Zap size={14} />
                  开始游戏
                </span>
                <span className="text-white/40">→</span>
              </div>
            </div>
            
            <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-white/10 blur-3xl group-hover:scale-150 transition-transform duration-500" />
          </motion.button>
        ))}
      </motion.div>

      {/* Recent Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card rounded-2xl p-6"
      >
        <h3 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
          <Trophy size={20} className="text-amber-500" />
          最近成就
        </h3>
        
        <div className="space-y-3">
          {[
            { name: '记忆大师', description: '记忆翻牌连续通关10次', icon: '🧠', time: '2小时前', color: 'from-pink-400 to-rose-500' },
            { name: '速度之王', description: '反应测试达到S级评价', icon: '⚡', time: '昨天', color: 'from-yellow-400 to-orange-500' },
            { name: '拼图达人', description: '完成困难难度拼图', icon: '🧩', time: '3天前', color: 'from-blue-400 to-indigo-500' },
          ].map((achievement, index) => (
            <motion.div
              key={achievement.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.05 }}
              className="flex items-center gap-4 p-3 rounded-xl bg-surface/50 hover:bg-surface transition-colors"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${achievement.color} flex items-center justify-center text-2xl flex-shrink-0`}>
                {achievement.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-text">{achievement.name}</h4>
                <p className="text-sm text-text-muted truncate">{achievement.description}</p>
              </div>
              <span className="text-xs text-text-muted flex-shrink-0">{achievement.time}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Daily Challenge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="glass-card rounded-2xl p-6 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Target size={24} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-text">今日挑战</h3>
              <p className="text-sm text-text-muted">完成挑战获得双倍积分</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
            +100 积分
          </span>
        </div>
        
        <div className="p-4 rounded-xl bg-surface/80">
          <p className="text-text font-medium mb-2">🎮 在记忆翻牌中获得3星评价</p>
          <div className="flex items-center gap-2 text-sm text-text-muted">
            <span>进度: 0/1</span>
            <div className="flex-1 h-2 rounded-full bg-surface overflow-hidden">
              <div className="h-full w-0 bg-gradient-to-r from-primary to-accent rounded-full" />
            </div>
          </div>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full mt-4 py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 transition-colors"
        >
          接受挑战
        </motion.button>
      </motion.div>
    </div>
  )
}
