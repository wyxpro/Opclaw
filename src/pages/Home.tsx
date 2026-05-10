import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { 
  Bot, Wallet, GraduationCap, Heart, Briefcase, 
  ArrowRight, Sparkles, Zap, Shield, Globe, 
  BookOpen, Brain, FileText, MessageCircle, Camera, 
  Music, Film, Gift, ScrollText, ShoppingCart, 
  PenTool, Box, ChevronRight
} from 'lucide-react'
import PageTransition from '../components/ui/PageTransition'
import { useTheme } from '../hooks/useTheme'
import MobileHome from '../components/home/MobileHome'
import MatrixBackground from '../components/home/MatrixBackground'
import { useState, useEffect } from 'react'

export default function Home() {
  const { themeConfig } = useTheme()
  const navigate = useNavigate()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const modules = [
    {
      id: 'ai-character',
      title: 'AI 分身',
      description: '创建您的专属AI数字分身，定制个性化交互体验，开启跨次元智能对话。',
      icon: Bot,
      path: '/ai-character',
      color: themeConfig.colors.accent,
      gradient: 'from-violet-500 to-purple-600',
      size: 'large',
    },
    {
      id: 'assets',
      title: '数字资产',
      description: '管理您的所有数字资产，安全、高效、便捷，实时掌握价值动态。',
      icon: Wallet,
      path: '/assets',
      color: themeConfig.colors.rose,
      gradient: 'from-orange-400 to-rose-500',
      size: 'large',
    },
    {
      id: 'learning',
      title: '学习空间',
      description: '构建个人知识体系，沉淀智慧结晶。',
      icon: GraduationCap,
      path: '/learning',
      color: themeConfig.colors.primary,
      gradient: 'from-blue-500 to-indigo-600',
      features: [
        { label: '知识库', icon: BookOpen, path: '/learning?view=knowledge' },
        { label: 'AI 助手', icon: Brain, path: '/learning' },
        { label: '在线简历', icon: FileText, path: '/learning' },
      ]
    },
    {
      id: 'life',
      title: '生活记录',
      description: '珍藏生活点滴，记录每一个值得铭记的瞬间。',
      icon: Heart,
      path: '/life',
      color: '#10b981',
      gradient: 'from-emerald-500 to-teal-600',
      features: [
        { label: '朋友圈', icon: MessageCircle, path: '/life?tab=moments' },
        { label: '旅拍相册', icon: Camera, path: '/life?tab=travel' },
        { label: '恋爱记录', icon: Heart, path: '/life?tab=love' },
        { label: '时光相册', icon: Film, path: '/life?tab=love&view=album' },
        { label: '许愿清单', icon: Gift, path: '/life?tab=love&view=wish' },
        { label: '祝福墙', icon: ScrollText, path: '/life?tab=love&view=blessing' },
        { label: '音乐墙', icon: Music, path: '/life?tab=music' },
        { label: '电影收藏', icon: Film, path: '/life?tab=movies' },
      ]
    },
    {
      id: 'work',
      title: '工作助手',
      description: '提升职场效率，打造专业化的工作台。',
      icon: Briefcase,
      path: '/work',
      color: themeConfig.colors.accent,
      gradient: 'from-amber-500 to-orange-600',
      features: [
        { label: '电商运营', icon: ShoppingCart, path: '/work?tab=ecommerce' },
        { label: '新媒体运营', icon: PenTool, path: '/work?tab=media' },
        { label: '百宝箱', icon: Box, path: '/work?tab=bookmarks' },
      ]
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  }

  return (
    <PageTransition>
      <div 
        className="min-h-screen relative overflow-hidden"
        style={{ backgroundColor: isMobile ? themeConfig.colors.bg : '#050505' }} // Use dark theme for matrix background
      >
        {isMobile ? (
          <MobileHome />
        ) : (
          <>
            {/* Dynamic Matrix Background */}
            <MatrixBackground />

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 lg:px-8 flex flex-col items-center min-h-screen">
              {/* Hero Section */}
              <div className="text-center max-w-4xl mx-auto mb-16 mt-8">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="text-5xl sm:text-7xl font-black tracking-tight mb-8"
                  style={{ color: isMobile ? themeConfig.colors.text : '#fff' }}
                >
                  重塑您的
                  <span 
                    className="text-transparent bg-clip-text bg-gradient-to-r mx-4 inline-block transform hover:scale-105 transition-transform cursor-default animate-gradient"
                    style={{ backgroundImage: `linear-gradient(to right, ${themeConfig.colors.primary}, ${themeConfig.colors.accent}, ${themeConfig.colors.rose}, ${themeConfig.colors.primary})` }}
                  >
                    数字平行世界
                  </span>
                </motion.h1>
                
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-lg sm:text-xl leading-relaxed mb-12 max-w-2xl mx-auto font-medium opacity-80"
                  style={{ color: isMobile ? themeConfig.colors.textSecondary : 'rgba(255, 255, 255, 0.8)' }}
                >
                  实现个人IP展示+数字资产管理+AI分身能力赋能的一站式解决方案！
                  
                </motion.p>
              </div>

              {/* Bento Grid Layout */}
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-12 gap-6 w-full max-w-6xl mb-24"
              >
                {/* AI Character - Spans 6 cols */}
                <motion.div variants={itemVariants} className="col-span-12 md:col-span-6 h-[320px]">
                  <ModuleCard module={modules[0]} themeConfig={themeConfig} isMobile={isMobile} />
                </motion.div>

                {/* Digital Assets - Spans 6 cols */}
                <motion.div variants={itemVariants} className="col-span-12 md:col-span-6 h-[320px]">
                  <ModuleCard module={modules[1]} themeConfig={themeConfig} isMobile={isMobile} />
                </motion.div>

                {/* Learning - Spans 4 cols */}
                <motion.div variants={itemVariants} className="col-span-12 md:col-span-4 h-[480px]">
                  <NavigationModuleCard module={modules[2]} themeConfig={themeConfig} isMobile={isMobile} />
                </motion.div>

                {/* Life - Spans 4 cols */}
                <motion.div variants={itemVariants} className="col-span-12 md:col-span-4 h-[480px]">
                  <NavigationModuleCard module={modules[3]} themeConfig={themeConfig} isMobile={isMobile} />
                </motion.div>

                {/* Work - Spans 4 cols */}
                <motion.div variants={itemVariants} className="col-span-12 md:col-span-4 h-[480px]">
                  <NavigationModuleCard module={modules[4]} themeConfig={themeConfig} isMobile={isMobile} />
                </motion.div>
              </motion.div>

            </div>
          </>
        )}
      </div>
    </PageTransition>
  )
}

function ModuleCard({ module, themeConfig, isMobile }: { module: any; themeConfig: any; isMobile: boolean }) {
  return (
    <Link to={module.path} className="block group h-full">
      <div 
        className="relative h-full p-8 rounded-[2.5rem] overflow-hidden transition-all duration-500 transform group-hover:-translate-y-2 group-hover:shadow-2xl backdrop-blur-md"
        style={{ 
          backgroundColor: isMobile ? themeConfig.colors.surface : 'rgba(10, 15, 20, 0.4)',
          border: `1px solid ${isMobile ? themeConfig.colors.border : 'rgba(0, 255, 204, 0.15)'}`,
          boxShadow: isMobile ? `0 10px 30px -5px ${themeConfig.colors.shadow || 'rgba(0,0,0,0.05)'}` : '0 10px 30px -5px rgba(0, 0, 0, 0.5)'
        }}
      >
        {/* Background Gradient Layer */}
        <div 
          className={`absolute inset-0 bg-gradient-to-br ${module.gradient} opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500`} 
        />
        
        {/* Decorative Circle */}
        <div 
          className={`absolute -right-12 -top-12 w-48 h-48 rounded-full bg-gradient-to-br ${module.gradient} blur-3xl opacity-10 group-hover:opacity-20 transition-all duration-700 group-hover:scale-150`}
        />

        <div className="relative z-10 flex flex-col h-full">
          <div 
            className="w-16 h-16 rounded-[1.5rem] flex items-center justify-center mb-8 text-white shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:rotate-3"
            style={{ backgroundImage: `linear-gradient(135deg, ${module.color}, ${module.color}dd)` }}
          >
            <module.icon size={32} />
          </div>
          
          <h3 
            className="text-3xl font-black mb-4 transition-colors duration-300"
            style={{ color: isMobile ? themeConfig.colors.text : '#fff' }}
          >
            {module.title}
          </h3>
          
          <p 
            className="text-base font-medium leading-relaxed opacity-70 group-hover:opacity-100 transition-opacity duration-300 max-w-[80%]"
            style={{ color: isMobile ? themeConfig.colors.textSecondary : 'rgba(255, 255, 255, 0.7)' }}
          >
            {module.description}
          </p>
          
          <div className="mt-auto flex items-center gap-3">
            <div 
              className="flex items-center gap-2 font-bold text-sm transition-all duration-300"
              style={{ color: module.color }}
            >
              立即开启 <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-2" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

function NavigationModuleCard({ module, themeConfig, isMobile }: { module: any; themeConfig: any; isMobile: boolean }) {
  const navigate = useNavigate()

  return (
    <div 
      className="relative h-full rounded-[2.5rem] overflow-hidden transition-all duration-500 border group backdrop-blur-md"
      style={{ 
        backgroundColor: isMobile ? themeConfig.colors.surface : 'rgba(10, 15, 20, 0.4)',
        borderColor: isMobile ? themeConfig.colors.border : 'rgba(0, 255, 204, 0.15)',
        boxShadow: isMobile ? `0 10px 30px -5px ${themeConfig.colors.shadow || 'rgba(0,0,0,0.05)'}` : '0 10px 30px -5px rgba(0, 0, 0, 0.5)'
      }}
    >
      {/* Background Glow */}
      <div 
        className={`absolute inset-0 bg-gradient-to-b ${module.gradient} opacity-[0.02] group-hover:opacity-[0.05] transition-opacity duration-500`} 
      />

      <div className="p-8 h-full flex flex-col relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div 
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md transition-transform duration-300 group-hover:scale-110"
            style={{ backgroundImage: `linear-gradient(135deg, ${module.color}, ${module.color}dd)` }}
          >
            <module.icon size={24} />
          </div>
          <Link 
            to={module.path}
            className="p-2 rounded-full transition-colors hover:bg-gray-100 dark:hover:bg-white/10"
            style={{ color: isMobile ? themeConfig.colors.textMuted : 'rgba(255,255,255,0.5)' }}
          >
            <ArrowRight size={20} />
          </Link>
        </div>

        <h3 className="text-2xl font-black mb-2" style={{ color: isMobile ? themeConfig.colors.text : '#fff' }}>{module.title}</h3>
        <p className="text-xs font-medium opacity-60 mb-8" style={{ color: isMobile ? themeConfig.colors.textMuted : 'rgba(255,255,255,0.6)' }}>{module.description}</p>

        <div className={`flex-grow space-y-2 ${module.features.length > 4 ? 'grid grid-cols-2 gap-2 space-y-0' : ''}`}>
          {module.features.map((feature: any, idx: number) => (
            <button
              key={idx}
              onClick={() => navigate(feature.path)}
              className={`w-full flex items-center justify-between p-2.5 rounded-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] group/item ${module.features.length > 4 ? 'p-2' : ''}`}
              style={{ 
                backgroundColor: isMobile ? `${themeConfig.colors.bgAlt}80` : 'rgba(255,255,255,0.05)',
                border: `1px solid ${isMobile ? themeConfig.colors.border : 'rgba(255,255,255,0.05)'}`
              }}
            >
              <div className="flex items-center gap-2">
                <div 
                  className="w-7 h-7 rounded-xl flex items-center justify-center transition-colors duration-300 group-hover/item:bg-white/20"
                  style={{ backgroundColor: `${module.color}15`, color: module.color }}
                >
                  <feature.icon size={14} />
                </div>
                <span className={`text-xs font-bold ${module.features.length > 4 ? 'text-[10px]' : ''}`} style={{ color: isMobile ? themeConfig.colors.textSecondary : 'rgba(255,255,255,0.8)' }}>{feature.label}</span>
              </div>
              <ChevronRight size={12} className="opacity-0 group-hover/item:opacity-100 -translate-x-1 group-hover/item:translate-x-0 transition-all duration-300" style={{ color: module.color }} />
            </button>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-dashed" style={{ borderColor: isMobile ? themeConfig.colors.border : 'rgba(255,255,255,0.1)' }}>
          <Link 
            to={module.path}
            className="text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-opacity hover:opacity-100"
            style={{ color: module.color, opacity: 0.8 }}
          >
            查看全部功能 <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </div>
  )
}

