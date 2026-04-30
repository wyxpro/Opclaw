import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  Bot, BookOpen, Heart, PenTool, Sparkles, 
  MessageCircle, Camera, Music, Film, 
  ChevronRight, Bookmark, Zap, Wallet,
  Layout, Search, Bell
} from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'
import { useAuth } from '../../contexts/AuthContext'

export default function MobileHome() {
  const { themeConfig } = useTheme()
  const { user } = useAuth()
  
  const hour = new Date().getHours()
  const greeting = hour < 12 ? '早安' : hour < 18 ? '午安' : '晚安'
  const displayName = user?.username || '朋友'

  // 点击波纹效果
  const rippleEffect = {
    whileTap: { scale: 0.97 },
    transition: { type: 'spring', stiffness: 400, damping: 17 }
  }

  // 玻璃拟态样式
  const glassButtonStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.1)',
  }

  return (
    <div className="flex flex-col gap-5 px-4 pb-12 pt-2 bg-gradient-to-b from-transparent to-surface/30">
      {/* Header with Search & Notification */}
      <div className="flex items-center justify-between pt-4">
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <span className="text-sm font-bold text-text-dim uppercase tracking-[0.2em] mb-1 block">{greeting}</span>
          <h1 className="text-3xl font-black text-text flex items-center gap-2 leading-tight">
            {displayName}有点酷 <Sparkles size={26} className="text-primary animate-pulse" />
          </h1>
        </motion.div>
      </div>

      {/* Primary Section - AI Avatar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Link to="/ai-character" className="block">
          <motion.div 
            {...rippleEffect}
            className="relative min-h-[160px] rounded-[2rem] overflow-hidden p-6 flex flex-col justify-between"
            style={{ 
              background: `linear-gradient(145deg, ${themeConfig.colors.rose} 0%, ${themeConfig.colors.accent} 100%)`,
              boxShadow: `0 15px 35px -5px ${themeConfig.colors.rose}40`
            }}
          >
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10" />
            <div className="absolute bottom-[-20%] left-[-10%] w-40 h-40 bg-white/10 rounded-full blur-3xl" />
            
            <div className="relative z-10 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={glassButtonStyle}>
                  <Bot size={22} className="text-white" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-black text-white leading-none mb-2">AI 分身</h2>
                <p className="text-white/80 text-xs leading-relaxed max-w-[80%]">
                  定制您的专属数字孪生，开启跨次元的智能交互体验
                </p>
              </div>
            </div>
          </motion.div>
        </Link>
      </motion.div>

      {/* Secondary Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Learning Space */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <Link to="/learning" className="block">
            <motion.div 
              {...rippleEffect}
              className="h-36 rounded-[2rem] p-5 flex flex-col justify-between relative overflow-hidden"
              style={{ 
                background: `linear-gradient(135deg, ${themeConfig.colors.primary} 0%, ${themeConfig.colors.cyan} 100%)`,
                boxShadow: `0 12px 25px -8px ${themeConfig.colors.primary}50`
              }}
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={glassButtonStyle}>
                <BookOpen size={20} className="text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-0.5">学习空间</h3>
                <p className="text-white/70 text-[10px] font-medium truncate">沉淀知识库，精进技能</p>
              </div>
            </motion.div>
          </Link>
        </motion.div>

        {/* Life Record */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
          <Link to="/life" className="block">
            <motion.div 
              {...rippleEffect}
              className="h-36 rounded-[2rem] p-5 flex flex-col justify-between relative overflow-hidden"
              style={{ 
                background: `linear-gradient(135deg, ${themeConfig.colors.cyan} 0%, ${themeConfig.colors.rose} 100%)`,
                boxShadow: `0 12px 25px -8px ${themeConfig.colors.cyan}50`
              }}
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={glassButtonStyle}>
                <Heart size={20} className="text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-0.5">生活记录</h3>
                <p className="text-white/70 text-[10px] font-medium truncate">记录美好，留住温情</p>
              </div>
            </motion.div>
          </Link>
        </motion.div>
      </div>

      {/* Featured Header */}
      <div className="flex items-center justify-between mt-1 px-1">
        <h3 className="text-base font-black text-text tracking-tight">精选内容</h3>
        <Link to="/social" className="text-xs font-bold text-primary flex items-center gap-0.5">
          全部 <ChevronRight size={14} />
        </Link>
      </div>

      {/* Work Assistant removed */}

      {/* Carousel with Real Images */}
      <div className="flex gap-3.5 overflow-x-auto no-scrollbar py-1 -mx-4 px-4">
        {[
          { title: '知识库 · 3分钟', subtitle: '高效学习法', image: '/covers/learning.png', color: themeConfig.colors.primary, path: '/learning?view=knowledge' },
          { title: '朋友圈 · 动态', subtitle: '捕捉精彩时刻', image: '/covers/moments.png', color: themeConfig.colors.accent, path: '/life?tab=moments' },
          { title: '旅拍 · 122张', subtitle: '城市漫游集', image: '/covers/travel.png', color: themeConfig.colors.emerald, path: '/life?tab=travel' },
          { title: '百宝箱 · 工具', subtitle: '实用工具合集', image: '/covers/tools.png', color: themeConfig.colors.sky, path: '/work?tab=bookmarks' },
          { title: '数字资产 · 💎', subtitle: '管理您的财富', image: '/covers/assets.png', color: themeConfig.colors.rose, path: '/assets' },
        ].map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + idx * 0.1 }}
            className="flex-shrink-0"
          >
            <Link to={item.path} className="block w-40">
              <motion.div 
                {...rippleEffect}
                className="bg-surface rounded-3xl p-3 border border-border shadow-sm flex flex-col gap-3 group"
              >
                <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden relative">
                  <img 
                    src={item.image} 
                    alt={item.subtitle} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60" />
                </div>
                <div className="px-1">
                  <span className="text-[9px] text-text-dim font-bold uppercase tracking-wider block mb-0.5">{item.title}</span>
                  <h4 className="text-xs font-black text-text truncate tracking-tight">{item.subtitle}</h4>
                </div>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Life Lab - More Compact Matrix */}
      <div className="bg-surface/60 backdrop-blur-md rounded-[2.5rem] p-5 border border-border shadow-sm">
        <h3 className="text-xs font-black text-text-dim uppercase tracking-[0.15em] mb-4 px-1">生活实验室 / Life Lab</h3>
        <div className="grid grid-cols-4 gap-y-5">
          {[
            { label: '时光相册', icon: Film, path: '/life?tab=love&view=album', color: themeConfig.colors.rose },
            { label: '许愿清单', icon: Sparkles, path: '/life?tab=love&view=wish', color: themeConfig.colors.accent },
            { label: '祝福墙', icon: Heart, path: '/life?tab=love&view=blessing', color: themeConfig.colors.primary },
            { label: '音乐墙', icon: Music, path: '/life?tab=music', color: themeConfig.colors.emerald },
            { label: '电影收藏', icon: Film, path: '/life?tab=movies', color: themeConfig.colors.sky },
            { label: '恋爱记录', icon: Heart, path: '/life?tab=love', color: themeConfig.colors.rose },
            { label: '旅拍', icon: Camera, path: '/life?tab=travel', color: themeConfig.colors.emerald },
            { label: '更多', icon: Layout, path: '/life', color: themeConfig.colors.textMuted },
          ].map((item, idx) => (
            <Link key={idx} to={item.path} className="flex flex-col items-center gap-1.5 group">
              <motion.div 
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-active:shadow-inner"
                style={{ backgroundColor: `${item.color}15`, border: `1px solid ${item.color}20` }}
              >
                <item.icon size={18} style={{ color: item.color }} />
              </motion.div>
              <span className="text-[10px] font-bold text-text-dim whitespace-nowrap tracking-tight">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom Spacer */}
      <div className="h-6" />
    </div>
  )
}
