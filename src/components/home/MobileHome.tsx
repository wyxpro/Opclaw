import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { 
  Bot, BookOpen, Heart, Sparkles, 
  Film, ChevronRight, MessageCircle,
  Layout, Star, Music, Camera, ArrowRight
} from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'
import { useAuth } from '../../contexts/AuthContext'

export default function MobileHome() {
  const { themeConfig } = useTheme()
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const hour = new Date().getHours()
  const greeting = hour < 12 ? '早安' : hour < 18 ? '午安' : '晚安'
  const displayName = user?.username || '朋友'

  const fadeInUp = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 }
  }

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.08
      }
    }
  }

  return (
    <div className="flex flex-col gap-4 px-4 pb-24 pt-3 bg-mesh-1 min-h-screen relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-[-8%] right-[-8%] w-56 h-56 bg-primary/10 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute bottom-[18%] left-[-18%] w-72 h-72 bg-accent/10 rounded-full blur-[110px] pointer-events-none" />
      
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-1 relative z-10"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-primary to-accent p-0.5 shadow-lg">
            <div className="w-full h-full rounded-[14px] overflow-hidden bg-surface flex items-center justify-center">
               <img src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${displayName}`} alt="avatar" className="w-full h-full object-cover" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-[9px] font-black text-primary uppercase tracking-widest">{greeting}</span>
              <div className="w-0.5 h-0.5 rounded-full bg-primary/30" />
              <span className="text-[9px] font-black text-text-dim uppercase tracking-widest">{new Date().toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}</span>
            </div>
            <h1 className="text-xl font-black text-text leading-tight tracking-tight">
              {displayName}有点酷 <span className="text-primary">✨</span>
            </h1>
          </div>
        </div>
      </motion.div>

      {/* Main Grid - Asymmetric Layout */}
      <motion.div 
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-2 gap-3.5"
      >
        {/* AI Avatar - Full Width Card */}
        <motion.div variants={fadeInUp} className="col-span-2">
          <Link to="/ai-character" className="block">
            <div className="group relative overflow-hidden rounded-[2.25rem] bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-600 p-6 min-h-[125px] shadow-2xl shadow-indigo-500/20 transition-all duration-500 active:scale-95">
              {/* Background Art */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -mr-12 -mt-12 animate-pulse" />
              <div className="absolute bottom-0 left-0 w-28 h-28 bg-accent/20 rounded-full blur-2xl -ml-6 -mb-6" />
              
              <div className="relative z-10 flex flex-col h-full justify-between gap-4">
                <div className="flex justify-between items-start">
                  <div className="jelly-glass w-10 h-10 rounded-xl flex items-center justify-center text-white">
                    <Bot size={22} />
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-black text-white mb-1.5 flex items-center gap-1.5">
                    AI 分身 <Sparkles size={16} className="text-accent" />
                  </h2>
                  <p className="text-white/80 text-[11px] font-medium leading-tight max-w-[85%]">
                    构建您的智能数字孪生，让 AI 为您的社交与工作赋能。
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Learning Space - Half Width */}
        <motion.div variants={fadeInUp}>
          <Link to="/learning" className="block h-full">
            <div className="group relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-500 to-cyan-500 p-5 min-h-[110px] shadow-xl shadow-blue-500/10 transition-all duration-500 active:scale-95">
               <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/10 rounded-full blur-xl" />
               <div className="relative z-10 flex flex-col gap-3.5 h-full">
                  <div className="jelly-glass w-9 h-9 rounded-xl flex items-center justify-center text-white">
                    <BookOpen size={18} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white mb-0.5">学习空间</h3>
                    <p className="text-white/70 text-[9px] font-bold uppercase tracking-wider">KNOWLEDGE</p>
                  </div>
               </div>
            </div>
          </Link>
        </motion.div>

        {/* Life Record - Half Width */}
        <motion.div variants={fadeInUp}>
          <Link to="/life" className="block h-full">
            <div className="group relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-rose-500 to-orange-400 p-5 min-h-[110px] shadow-xl shadow-rose-500/10 transition-all duration-500 active:scale-95">
               <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/10 rounded-full blur-xl" />
               <div className="relative z-10 flex flex-col gap-3.5 h-full">
                  <div className="jelly-glass w-9 h-9 rounded-xl flex items-center justify-center text-white">
                    <Heart size={18} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white mb-0.5">生活记录</h3>
                    <p className="text-white/70 text-[9px] font-bold uppercase tracking-wider">LIFE</p>
                  </div>
               </div>
            </div>
          </Link>
        </motion.div>
      </motion.div>

      {/* Horizontal Carousel Section */}
      <div className="mt-1">
        <div className="flex items-center justify-between mb-3.5 px-1">
          <div className="flex items-center gap-1.5">
            <div className="w-1 h-5 rounded-full bg-primary" />
            <h3 className="text-lg font-black text-text tracking-tight">精选内容 / Featured</h3>
          </div>
          <Link to="/social" className="text-[10px] font-black text-primary">更多</Link>
        </div>

        <div className="flex gap-4 overflow-x-auto no-scrollbar py-2 -mx-4 px-4 snap-x">
          {[
            { title: '知识库', subtitle: '高效学习法', image: '/covers/learning.png', color: 'from-blue-500 to-indigo-600', path: '/learning?view=knowledge' },
            { title: '朋友圈', subtitle: '捕捉精彩时刻', image: '/covers/moments.png', color: 'from-purple-500 to-pink-500', path: '/life?tab=moments' },
            { title: '旅拍', subtitle: '城市漫游集', image: '/covers/travel.png', color: 'from-orange-500 to-rose-500', path: '/life?tab=travel' },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              whileTap={{ scale: 0.95 }}
              className="flex-shrink-0 w-52 snap-center"
            >
              <Link to={item.path} className="block">
                <div className="relative rounded-[2rem] overflow-hidden bg-surface border border-border shadow-lg group">
                  <div className="w-full aspect-[16/10] overflow-hidden relative">
                    <img src={item.image} alt={item.subtitle} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  </div>
                  <div className="p-4 flex items-center justify-between">
                    <div>
                      <span className="text-[9px] text-text-dim font-black uppercase tracking-widest block mb-0.5">{item.title}</span>
                      <h4 className="text-[13px] font-black text-text">{item.subtitle}</h4>
                    </div>
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center text-white shadow-md`}>
                      <ArrowRight size={14} />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Life Lab Section */}
      <motion.div 
        {...fadeInUp}
        className="bg-white/80 backdrop-blur-xl p-5 rounded-[2rem] border border-white/50 shadow-lg relative overflow-hidden"
      >
        <div className="flex items-center gap-1.5 mb-5 px-1">
          <Star size={12} className="text-accent fill-accent" />
          <h3 className="text-[10px] font-black text-text uppercase tracking-[0.2em]">生活实验室 / LIFE LAB</h3>
        </div>

        <div className="grid grid-cols-4 gap-y-5">
          {[
            { label: '知识库', icon: BookOpen, color: '#2563eb', path: '/learning?view=knowledge' },
            { label: '技能树', icon: Sparkles, color: '#f59e0b', path: '/learning' },
            { label: '朋友圈', icon: MessageCircle, color: '#10b981', path: '/life?tab=moments' },
            { label: '音乐墙', icon: Music, color: '#10b981', path: '/life?tab=music' },
            { label: '电影收藏', icon: Film, color: '#0ea5e9', path: '/life?tab=movies' },
            { label: '恋爱记录', icon: Heart, color: '#f43f5e', path: '/life?tab=love' },
            { label: '旅拍', icon: Camera, color: '#10b981', path: '/life?tab=travel' },
            { label: '更多', icon: Layout, color: '#64748b', path: '/life' },
          ].map((item, idx) => (
            <motion.div 
              key={idx} 
              whileTap={{ scale: 0.85 }} 
              className="flex flex-col items-center gap-1.5 group cursor-pointer"
              onClick={() => navigate(item.path)}
            >
              <div 
                className="w-10 h-10 rounded-[14px] flex items-center justify-center bg-white shadow-sm border border-gray-50"
              >
                <item.icon size={18} style={{ color: item.color }} />
              </div>
              <span className="text-[10px] font-bold text-text-dim tracking-tight">{item.label}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <div className="h-4" />
    </div>
  )
}
