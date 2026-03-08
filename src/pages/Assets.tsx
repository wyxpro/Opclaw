import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  BookOpen, Heart, Music, GraduationCap, Camera, Film, 
  GitBranch, FileText, MessageCircle, Dumbbell, Gamepad2, 
  Bookmark, Sparkles, ChevronRight 
} from 'lucide-react'
import PageTransition from '../components/ui/PageTransition'
import { useTheme } from '../hooks/useTheme'

// 学习类卡片数据 - 对应学习页面的子菜单
const learningCards = [
  {
    id: 'knowledge',
    title: '知识库',
    subtitle: '文章管理',
    path: '/learning',
    color: 'bg-blue-500',
    colorLight: 'bg-blue-500/20',
    icon: BookOpen,
    tag: '学习',
  },
  {
    id: 'skilltree',
    title: '技能树',
    subtitle: '技能成长路径',
    path: '/learning',
    color: 'bg-violet-500',
    colorLight: 'bg-violet-500/20',
    icon: GitBranch,
    tag: '成长',
  },
  {
    id: 'resume',
    title: '在线简历',
    subtitle: '个人履历展示',
    path: '/learning',
    color: 'bg-emerald-500',
    colorLight: 'bg-emerald-500/20',
    icon: FileText,
    tag: '职业',
  },
]

// 生活类卡片数据 - 对应生活页面的子菜单
const lifeCards = [
  {
    id: 'moments',
    title: '朋友圈',
    subtitle: '分享生活点滴',
    path: '/life',
    color: 'bg-rose-500',
    colorLight: 'bg-rose-500/20',
    icon: MessageCircle,
    tag: '社交',
  },
  {
    id: 'travel',
    title: '旅拍相册',
    subtitle: '记录美好旅程',
    path: '/life',
    color: 'bg-amber-500',
    colorLight: 'bg-amber-500/20',
    icon: Camera,
    tag: '旅行',
  },
  {
    id: 'love',
    title: '恋爱记录',
    subtitle: '甜蜜时光珍藏',
    path: '/life',
    color: 'bg-pink-500',
    colorLight: 'bg-pink-500/20',
    icon: Heart,
    tag: '恋爱',
  },
  {
    id: 'sports',
    title: '运动',
    subtitle: '健康生活记录',
    path: '/life',
    color: 'bg-lime-500',
    colorLight: 'bg-lime-500/20',
    icon: Dumbbell,
    tag: '健康',
  },
  {
    id: 'games',
    title: '游戏',
    subtitle: '娱乐休闲时光',
    path: '/life',
    color: 'bg-indigo-500',
    colorLight: 'bg-indigo-500/20',
    icon: Gamepad2,
    tag: '娱乐',
  },
]

// 娱乐类卡片数据 - 对应娱乐页面的子菜单
const entertainmentCards = [
  {
    id: 'music',
    title: '音乐盒',
    subtitle: '收藏喜爱音乐',
    path: '/entertainment',
    color: 'bg-fuchsia-500',
    colorLight: 'bg-fuchsia-500/20',
    icon: Music,
    tag: '音乐',
  },
  {
    id: 'movies',
    title: '收藏电影',
    subtitle: '观影记录收藏',
    path: '/entertainment',
    color: 'bg-red-500',
    colorLight: 'bg-red-500/20',
    icon: Film,
    tag: '影视',
  },
  {
    id: 'bookmarks',
    title: '百宝箱',
    subtitle: '实用工具收藏',
    path: '/entertainment',
    color: 'bg-cyan-500',
    colorLight: 'bg-cyan-500/20',
    icon: Bookmark,
    tag: '工具',
  },
]

// 合并所有卡片用于网格展示
const allCards = [...learningCards, ...lifeCards, ...entertainmentCards]

// 快速访问数据
const quickAccessItems = [
  { icon: GraduationCap, label: '知识库', path: '/learning', color: 'bg-blue-500' },
  { icon: GitBranch, label: '技能树', path: '/learning', color: 'bg-violet-500' },
  { icon: FileText, label: '在线简历', path: '/learning', color: 'bg-emerald-500' },
  { icon: MessageCircle, label: '朋友圈', path: '/life', color: 'bg-rose-500' },
  { icon: Camera, label: '旅拍相册', path: '/life', color: 'bg-amber-500' },
  { icon: Heart, label: '恋爱记录', path: '/life', color: 'bg-pink-500' },
  { icon: Dumbbell, label: '运动', path: '/life', color: 'bg-lime-500' },
  { icon: Gamepad2, label: '游戏', path: '/life', color: 'bg-indigo-500' },
  { icon: Music, label: '音乐盒', path: '/entertainment', color: 'bg-fuchsia-500' },
  { icon: Film, label: '收藏电影', path: '/entertainment', color: 'bg-red-500' },
  { icon: Bookmark, label: '百宝箱', path: '/entertainment', color: 'bg-cyan-500' },
]

export default function Assets() {
  const navigate = useNavigate()
  const { themeConfig } = useTheme()
  const { colors } = themeConfig

  return (
    <PageTransition>
      <div 
        className="min-h-screen pb-8 transition-colors duration-300"
        style={{ backgroundColor: colors.bg }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 sm:px-6 pt-6 pb-4"
        >
          <h1 
            className="text-2xl sm:text-3xl font-bold mb-2 transition-colors duration-300"
            style={{ color: colors.text }}
          >
            资产
          </h1>
          <p 
            className="text-sm transition-colors duration-300"
            style={{ color: colors.textMuted }}
          >
            管理您的学习、生活和娱乐内容
          </p>
        </motion.div>

        {/* Main Cards Grid - 两列布局 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="px-4 sm:px-6"
        >
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {allCards.map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                onClick={() => navigate(card.path)}
                className="relative overflow-hidden rounded-2xl sm:rounded-3xl cursor-pointer group transition-all duration-300"
                style={{ 
                  aspectRatio: '1.6/1',
                  backgroundColor: colors.surface,
                  border: `1px solid ${colors.border}`
                }}
              >
                {/* Color Accent Bar */}
                <div 
                  className={`absolute top-0 left-0 right-0 h-1 ${card.color} opacity-80`}
                />
                
                {/* Hover Overlay */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ backgroundColor: colors.cardHover }}
                />
                
                {/* Content */}
                <div className="relative h-full p-3 sm:p-4 flex flex-col justify-between">
                  {/* Top Row - Tag and Icon */}
                  <div className="flex items-start justify-between">
                    {/* Tag */}
                    <span 
                      className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium backdrop-blur-sm transition-colors duration-300"
                      style={{ 
                        backgroundColor: colors.primaryMuted,
                        color: colors.primary
                      }}
                    >
                      {card.tag}
                    </span>
                    
                    {/* Icon */}
                    <div 
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl ${card.color} flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                    >
                      <card.icon size={16} className="text-white sm:size-5" />
                    </div>
                  </div>
                  
                  {/* Bottom Row - Title and Subtitle */}
                  <div>
                    <h3 
                      className="font-bold text-sm sm:text-base mb-0.5 sm:mb-1 transition-colors duration-300"
                      style={{ color: colors.text }}
                    >
                      {card.title}
                    </h3>
                    <p 
                      className="text-[10px] sm:text-xs line-clamp-1 transition-colors duration-300"
                      style={{ color: colors.textMuted }}
                    >
                      {card.subtitle}
                    </p>
                  </div>
                </div>
                
                {/* Decorative Elements */}
                <div 
                  className="absolute -bottom-4 -right-4 w-16 h-16 sm:w-20 sm:h-20 rounded-full blur-xl transition-colors duration-300"
                  style={{ backgroundColor: colors.primaryMuted }}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Section Title - 快速访问 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="px-4 sm:px-6 mt-8 sm:mt-10 mb-4"
        >
          <div className="flex items-center justify-between">
            <h2 
              className="text-lg sm:text-xl font-bold flex items-center gap-2 transition-colors duration-300"
              style={{ color: colors.text }}
            >
              <Sparkles size={18} style={{ color: colors.accent }} />
              快速访问
            </h2>
            <button 
              onClick={() => navigate('/learning')}
              className="flex items-center gap-1 text-xs sm:text-sm transition-colors duration-300 hover:opacity-80"
              style={{ color: colors.textMuted }}
            >
              查看全部
              <ChevronRight size={14} />
            </button>
          </div>
        </motion.div>

        {/* Quick Access - Horizontal Scroll */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="px-4 sm:px-6"
        >
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
            {quickAccessItems.map((item, index) => (
              <motion.button
                key={item.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.03 }}
                onClick={() => navigate(item.path)}
                className="flex-shrink-0 flex flex-col items-center gap-2 group"
              >
                {/* Icon Container */}
                <div 
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl ${item.color} p-0.5 transform group-hover:scale-105 transition-transform duration-300 shadow-lg`}
                >
                  <div 
                    className="w-full h-full rounded-[14px] sm:rounded-[15px] flex items-center justify-center"
                    style={{ backgroundColor: colors.bg }}
                  >
                    <div 
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${item.color} flex items-center justify-center`}
                    >
                      <item.icon size={20} className="text-white sm:size-6" />
                    </div>
                  </div>
                </div>
                
                {/* Label */}
                <span 
                  className="text-[11px] sm:text-xs whitespace-nowrap transition-colors duration-300"
                  style={{ color: colors.textMuted }}
                >
                  {item.label}
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Category Summary Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="px-4 sm:px-6 mt-8 sm:mt-10"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {/* Learning Summary */}
            <div 
              onClick={() => navigate('/learning')}
              className="relative overflow-hidden rounded-2xl p-4 cursor-pointer group transition-all duration-300 hover:shadow-lg"
              style={{ 
                backgroundColor: colors.surface,
                border: `1px solid ${colors.border}`
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-500 flex items-center justify-center shadow-lg">
                  <GraduationCap size={20} className="text-white sm:size-6" />
                </div>
                <div>
                  <h3 
                    className="font-semibold text-sm sm:text-base transition-colors duration-300"
                    style={{ color: colors.text }}
                  >
                    学习空间
                  </h3>
                  <p 
                    className="text-xs transition-colors duration-300"
                    style={{ color: colors.textMuted }}
                  >
                    {learningCards.length} 个功能模块
                  </p>
                </div>
              </div>
              <div 
                className="absolute -bottom-6 -right-6 w-20 h-20 rounded-full blur-xl transition-colors duration-300"
                style={{ backgroundColor: 'rgba(59, 130, 246, 0.15)' }}
              />
            </div>

            {/* Life Summary */}
            <div 
              onClick={() => navigate('/life')}
              className="relative overflow-hidden rounded-2xl p-4 cursor-pointer group transition-all duration-300 hover:shadow-lg"
              style={{ 
                backgroundColor: colors.surface,
                border: `1px solid ${colors.border}`
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-rose-500 flex items-center justify-center shadow-lg">
                  <Heart size={20} className="text-white sm:size-6" />
                </div>
                <div>
                  <h3 
                    className="font-semibold text-sm sm:text-base transition-colors duration-300"
                    style={{ color: colors.text }}
                  >
                    生活记录
                  </h3>
                  <p 
                    className="text-xs transition-colors duration-300"
                    style={{ color: colors.textMuted }}
                  >
                    {lifeCards.length} 个功能模块
                  </p>
                </div>
              </div>
              <div 
                className="absolute -bottom-6 -right-6 w-20 h-20 rounded-full blur-xl transition-colors duration-300"
                style={{ backgroundColor: 'rgba(244, 63, 94, 0.15)' }}
              />
            </div>

            {/* Entertainment Summary */}
            <div 
              onClick={() => navigate('/entertainment')}
              className="relative overflow-hidden rounded-2xl p-4 cursor-pointer group transition-all duration-300 hover:shadow-lg"
              style={{ 
                backgroundColor: colors.surface,
                border: `1px solid ${colors.border}`
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-violet-500 flex items-center justify-center shadow-lg">
                  <Music size={20} className="text-white sm:size-6" />
                </div>
                <div>
                  <h3 
                    className="font-semibold text-sm sm:text-base transition-colors duration-300"
                    style={{ color: colors.text }}
                  >
                    娱乐中心
                  </h3>
                  <p 
                    className="text-xs transition-colors duration-300"
                    style={{ color: colors.textMuted }}
                  >
                    {entertainmentCards.length} 个功能模块
                  </p>
                </div>
              </div>
              <div 
                className="absolute -bottom-6 -right-6 w-20 h-20 rounded-full blur-xl transition-colors duration-300"
                style={{ backgroundColor: 'rgba(139, 92, 246, 0.15)' }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  )
}
