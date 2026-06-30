import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  Bot, Wallet, GraduationCap, Heart, Briefcase, 
  ArrowRight, Sparkles, Zap, 
  FileText, MessageCircle, Camera, 
  Music, Box, ChevronRight, Star
} from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'
import { useAuth } from '../../contexts/AuthContext'

interface CarouselSlide {
  id: string
  title: string
  subtitle: string
  description: string
  image: string
  path: string
  color: string
  gradient: string
  icon: typeof Bot
}

export default function MobileHome() {
  const { themeConfig } = useTheme()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [currentSlide, setCurrentSlide] = useState(0)
  
  const hour = new Date().getHours()
  const greeting = hour < 12 ? '早安' : hour < 18 ? '午安' : '晚安'
  const displayName = user?.username || '拓荒者'

  const slides: CarouselSlide[] = [
    {
      id: 'ai',
      title: 'AI 虚拟分身',
      subtitle: 'DIGITAL TWIN',
      description: '定制您的专属AI智能分身，开启多场景对话交互',
      image: '/covers/moments.png',
      path: '/ai-character',
      color: '#8b5cf6',
      gradient: 'from-violet-600 via-indigo-600 to-purple-600',
      icon: Bot
    },
    {
      id: 'resume',
      title: '简历设计工坊',
      subtitle: 'RESUME CRAFT',
      description: '挑选四大分类专业设计模版，一键套用智能排版',
      image: '/covers/learning.png',
      path: '/resume-templates',
      color: '#10b981',
      gradient: 'from-emerald-500 via-teal-600 to-cyan-600',
      icon: Sparkles
    },
    {
      id: 'ecommerce',
      title: '工作效能台',
      subtitle: 'E-COMMERCE OPERATOR',
      description: '百宝箱、电商工具与新媒体助手，全面提升效率',
      image: '/covers/tools.png',
      path: '/work?tab=ecommerce',
      color: '#f59e0b',
      gradient: 'from-amber-500 via-orange-600 to-rose-600',
      icon: Briefcase
    },
    {
      id: 'assets',
      title: '数字资产看板',
      subtitle: 'ASSETS WALLET',
      description: '集中管理您的所有数字资产，实时洞察价值走向',
      image: '/covers/assets.png',
      path: '/assets',
      color: '#ef4444',
      gradient: 'from-rose-500 via-pink-600 to-purple-600',
      icon: Wallet
    }
  ]

  // Carousel auto-play
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 4500)
    return () => clearInterval(timer)
  }, [slides.length])

  // Custom styling helper
  const glassStyle = {
    background: themeConfig.colors.surface,
    borderColor: themeConfig.colors.border,
    boxShadow: `0 8px 32px 0 ${themeConfig.colors.shadow || 'rgba(0,0,0,0.04)'}`
  }

  return (
    <div className="flex flex-col gap-4 px-4 pb-24 pt-3 min-h-screen relative overflow-hidden transition-colors duration-300" style={{ background: themeConfig.colors.bg }}>
      {/* Glow Decorations */}
      <div className="absolute top-[-10%] right-[-10%] w-72 h-72 rounded-full blur-[100px] opacity-15 pointer-events-none transition-colors duration-500" style={{ backgroundColor: themeConfig.colors.primary }} />
      <div className="absolute bottom-[20%] left-[-20%] w-80 h-80 rounded-full blur-[120px] opacity-15 pointer-events-none transition-colors duration-500" style={{ backgroundColor: themeConfig.colors.accent }} />

      {/* Header Profile Section (Theme switcher and Notification button deleted) */}
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <motion.div 
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/profile')}
            className="w-12 h-12 rounded-2xl p-0.5 shadow-md flex-shrink-0 cursor-pointer"
            style={{ background: `linear-gradient(135deg, ${themeConfig.colors.primary}, ${themeConfig.colors.accent})` }}
          >
            <div className="w-full h-full rounded-[14px] overflow-hidden bg-white flex items-center justify-center">
              <img 
                src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${displayName}`} 
                alt="avatar" 
                className="w-full h-full object-cover" 
              />
            </div>
          </motion.div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: themeConfig.colors.primary }}>{greeting}</span>
              <div className="w-1 h-1 rounded-full opacity-30" style={{ backgroundColor: themeConfig.colors.text }} />
              <span className="text-[10px] font-black uppercase tracking-widest opacity-60" style={{ color: themeConfig.colors.text }}>
                {new Date().toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
              </span>
            </div>
            <h1 className="text-xl font-black tracking-tight flex items-center gap-1" style={{ color: themeConfig.colors.text }}>
              {displayName} 
              <span className="text-primary animate-bounce">✨</span>
            </h1>
          </div>
        </div>
      </div>

      {/* Featured Banner Carousel (Reduced Height) */}
      <div className="relative overflow-hidden rounded-[2rem] shadow-lg">
        <div className="relative aspect-[21/9] w-full overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 w-full h-full flex flex-col justify-end p-4 text-white"
            >
              {/* Cover Background Image with Gradient Overlay */}
              <img 
                src={slides[currentSlide].image} 
                alt={slides[currentSlide].title} 
                className="absolute inset-0 w-full h-full object-cover scale-102"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${slides[currentSlide].gradient} opacity-90 mix-blend-multiply`} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

              {/* Slide Content */}
              <div className="relative z-10 flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-black tracking-widest text-white/70 uppercase">
                    {slides[currentSlide].subtitle}
                  </span>
                  <div className="px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[8px] font-extrabold flex items-center gap-0.5">
                    <Star size={8} className="fill-white" />
                    HOT
                  </div>
                </div>

                <h2 className="text-lg font-black tracking-tight leading-none">
                  {slides[currentSlide].title}
                </h2>

                <div className="mt-1 flex items-center justify-between">
                  {/* Indicators */}
                  <div className="flex gap-1.5">
                    {slides.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentSlide(i)}
                        className={`h-1 rounded-full transition-all duration-300 ${
                          currentSlide === i ? 'w-4 bg-white' : 'w-1 bg-white/40'
                        }`}
                      />
                    ))}
                  </div>

                  {/* CTA Button */}
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate(slides[currentSlide].path)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white text-slate-900 text-[10px] font-black shadow-md hover:bg-slate-50 transition-colors"
                  >
                    立即体验
                    <ArrowRight size={10} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Creative Bento Box Showcase Layout (Moved to display right below the carousel, Card heights reduced) */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center gap-2 px-1">
          <div className="w-1 h-3.5 rounded-full bg-primary" />
          <h3 className="text-sm font-black" style={{ color: themeConfig.colors.text }}>
            特色功能推荐
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Card A: Double Width Love Record (Height Reduced) */}
          <motion.div 
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/life?tab=love')}
            className="col-span-2 relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-rose-500 to-pink-500 p-4 text-white min-h-[90px] shadow-md cursor-pointer flex flex-col justify-between"
          >
            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full blur-lg pointer-events-none" />
            <div className="relative z-10 flex items-center justify-between">
              <div className="jelly-glass w-8 h-8 rounded-lg flex items-center justify-center text-white">
                <Heart size={16} className="fill-white" />
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest opacity-70">
                OUR SWEET STORY
              </span>
            </div>
            <div className="relative z-10 mt-1">
              <h4 className="text-sm font-black flex items-center gap-1">
                甜蜜恋爱记录
                <Sparkles size={12} className="text-amber-300" />
              </h4>
              <p className="text-[10px] text-white/80 leading-tight mt-0.5 line-clamp-1">
                点滴心动、时光相册与浪漫清单，铭记每一个温存瞬间。
              </p>
            </div>
          </motion.div>

          {/* Card B: Single Width Work Bookmarks (Height Reduced) */}
          <motion.div 
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/work?tab=bookmarks')}
            className="relative overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-blue-500 to-indigo-600 p-3.5 text-white min-h-[80px] shadow-md cursor-pointer flex flex-col justify-between"
          >
            <div className="absolute -top-6 -right-6 w-16 h-16 bg-white/10 rounded-full blur-md pointer-events-none" />
            <div className="jelly-glass w-7 h-7 rounded-md flex items-center justify-center text-white self-start">
              <Box size={14} />
            </div>
            <div className="mt-1">
              <h4 className="text-xs font-black">百宝箱快捷书签</h4>
              <p className="text-[9px] text-white/70 line-clamp-1 mt-0.5">高效链接整理，一键直达</p>
            </div>
          </motion.div>

          {/* Card C: Single Width Music Wall (Height Reduced) */}
          <motion.div 
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/life?tab=music')}
            className="relative overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-purple-500 to-pink-600 p-3.5 text-white min-h-[80px] shadow-md cursor-pointer flex flex-col justify-between"
          >
            <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-white/10 rounded-full blur-md pointer-events-none" />
            <div className="jelly-glass w-7 h-7 rounded-md flex items-center justify-center text-white self-start">
              <Music size={14} />
            </div>
            <div className="mt-1">
              <h4 className="text-xs font-black">沉浸氛围音乐墙</h4>
              <p className="text-[9px] text-white/70 line-clamp-1 mt-0.5">随心律动，定制专属歌单</p>
            </div>
          </motion.div>

          {/* Card D: Double Width Travel Album (Height Reduced) */}
          <motion.div 
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/life?tab=travel')}
            className="col-span-2 relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-emerald-500 to-teal-600 p-4 text-white min-h-[90px] shadow-md cursor-pointer flex flex-col justify-between"
          >
            <div className="absolute -left-6 -top-6 w-24 h-24 bg-white/10 rounded-full blur-lg pointer-events-none" />
            <div className="relative z-10 flex items-center justify-between">
              <div className="jelly-glass w-8 h-8 rounded-lg flex items-center justify-center text-white">
                <Camera size={16} />
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest opacity-70">
                TRAVEL GALLERY
              </span>
            </div>
            <div className="relative z-10 flex items-end justify-between mt-1">
              <div>
                <h4 className="text-sm font-black">城市漫游旅拍相册</h4>
                <p className="text-[10px] text-white/80 leading-tight mt-0.5 line-clamp-1">
                  走过的山河湖海，遇见的万家灯火，尽在瞬间定格。
                </p>
              </div>
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white flex-shrink-0 ml-2">
                <ChevronRight size={14} />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Grid Subpage Quick Actions Menu */}
      <div className="grid grid-cols-4 gap-x-2 gap-y-4 p-4 rounded-[2rem] border" style={glassStyle}>
        {[
          { label: 'AI分身', icon: Bot, path: '/ai-character', color: '#8b5cf6' },
          { label: '数字资产', icon: Wallet, path: '/assets', color: '#f43f5e' },
          { label: '学习空间', icon: GraduationCap, path: '/learning', color: '#3b82f6' },
          { label: '工作助手', icon: Briefcase, path: '/work', color: '#f59e0b' },
          { label: '生活记录', icon: Heart, path: '/life', color: '#10b981' },
          { label: '简历模版', icon: FileText, path: '/resume-templates', color: '#06b6d4' },
          { label: '社区广场', icon: MessageCircle, path: '/community', color: '#ec4899' },
          { label: '探索实验室', icon: Zap, path: '/laboratory', color: '#a855f7' }
        ].map((menu, idx) => (
          <motion.div 
            key={idx}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(menu.path)}
            className="flex flex-col items-center gap-1.5 cursor-pointer text-center"
          >
            <div 
              className="w-12 h-12 rounded-[1.25rem] flex items-center justify-center shadow-sm border"
              style={{ 
                backgroundColor: `${menu.color}08`, 
                borderColor: `${menu.color}15`,
                color: menu.color
              }}
            >
              <menu.icon size={22} />
            </div>
            <span className="text-[11px] font-bold tracking-tight" style={{ color: themeConfig.colors.text }}>
              {menu.label}
            </span>
          </motion.div>
        ))}
      </div>

      <div className="h-6" />
    </div>
  )
}
