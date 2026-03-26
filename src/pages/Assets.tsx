import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  BookOpen, Heart, Music, GraduationCap, Camera, Film, 
  GitBranch, FileText, MessageCircle, Dumbbell, Gamepad2, 
  Bookmark
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
          className="px-4 sm:px-6 lg:px-8 pt-6 pb-4"
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

        {/* Category Summary Cards - 分类汇总卡片 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="px-4 sm:px-6 lg:px-8 mb-4"
        >
          <div className="grid grid-cols-3 gap-2 md:gap-4">
            {/* Learning Summary */}
            <div 
              onClick={() => navigate('/learning')}
              className="relative overflow-hidden rounded-xl md:rounded-2xl p-3 md:p-6 cursor-pointer group transition-all duration-300 hover:shadow-md"
              style={{ 
                backgroundColor: colors.surface,
                border: `1px solid ${colors.border}`
              }}
            >
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-blue-500 flex items-center justify-center shadow-md flex-shrink-0">
                  <GraduationCap size={18} className="text-white md:size-6" />
                </div>
                <div className="min-w-0">
                  <h3 
                    className="font-semibold text-sm md:text-base transition-colors duration-300 truncate"
                    style={{ color: colors.text }}
                  >
                    学习空间
                  </h3>
                  <p 
                    className="text-[10px] md:text-sm transition-colors duration-300"
                    style={{ color: colors.textMuted }}
                  >
                    {learningCards.length} 个功能模块
                  </p>
                </div>
              </div>
              <div 
                className="absolute -bottom-3 -right-3 w-12 h-12 md:w-16 md:h-16 rounded-full blur-lg transition-colors duration-300"
                style={{ backgroundColor: 'rgba(59, 130, 246, 0.15)' }}
              />
            </div>

            {/* Life Summary */}
            <div 
              onClick={() => navigate('/life')}
              className="relative overflow-hidden rounded-xl md:rounded-2xl p-3 md:p-6 cursor-pointer group transition-all duration-300 hover:shadow-md"
              style={{ 
                backgroundColor: colors.surface,
                border: `1px solid ${colors.border}`
              }}
            >
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-rose-500 flex items-center justify-center shadow-md flex-shrink-0">
                  <Heart size={18} className="text-white md:size-6" />
                </div>
                <div className="min-w-0">
                  <h3 
                    className="font-semibold text-sm md:text-base transition-colors duration-300 truncate"
                    style={{ color: colors.text }}
                  >
                    生活记录
                  </h3>
                  <p 
                    className="text-[10px] md:text-sm transition-colors duration-300"
                    style={{ color: colors.textMuted }}
                  >
                    {lifeCards.length} 个功能模块
                  </p>
                </div>
              </div>
              <div 
                className="absolute -bottom-3 -right-3 w-12 h-12 md:w-16 md:h-16 rounded-full blur-lg transition-colors duration-300"
                style={{ backgroundColor: 'rgba(244, 63, 94, 0.15)' }}
              />
            </div>

            {/* Entertainment Summary */}
            <div 
              onClick={() => navigate('/entertainment')}
              className="relative overflow-hidden rounded-xl md:rounded-2xl p-3 md:p-6 cursor-pointer group transition-all duration-300 hover:shadow-md"
              style={{ 
                backgroundColor: colors.surface,
                border: `1px solid ${colors.border}`
              }}
            >
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-violet-500 flex items-center justify-center shadow-md flex-shrink-0">
                  <Music size={18} className="text-white md:size-6" />
                </div>
                <div className="min-w-0">
                  <h3 
                    className="font-semibold text-sm md:text-base transition-colors duration-300 truncate"
                    style={{ color: colors.text }}
                  >
                    娱乐中心
                  </h3>
                  <p 
                    className="text-[10px] md:text-sm transition-colors duration-300"
                    style={{ color: colors.textMuted }}
                  >
                    {entertainmentCards.length} 个功能模块
                  </p>
                </div>
              </div>
              <div 
                className="absolute -bottom-3 -right-3 w-12 h-12 md:w-16 md:h-16 rounded-full blur-lg transition-colors duration-300"
                style={{ backgroundColor: 'rgba(139, 92, 246, 0.15)' }}
              />
            </div>
          </div>
        </motion.div>

        {/* Main Cards Grid - 响应式网格布局 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="px-4 sm:px-6 lg:px-8"
        >
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
            {allCards.map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                onClick={() => navigate(card.path)}
                className="relative overflow-hidden rounded-xl md:rounded-2xl cursor-pointer group transition-all duration-300"
                style={{ 
                  aspectRatio: '1.8/1',
                  backgroundColor: colors.surface,
                  border: `1px solid ${colors.border}`
                }}
              >
                {/* Color Accent Bar */}
                <div 
                  className={`absolute top-0 left-0 right-0 h-0.5 md:h-1 ${card.color} opacity-80`}
                />
                
                {/* Hover Overlay */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ backgroundColor: colors.cardHover }}
                />
                
                {/* Content */}
                <div className="relative h-full p-2.5 md:p-3 flex flex-col justify-between">
                  {/* Top Row - Tag and Icon */}
                  <div className="flex items-start justify-between">
                    {/* Tag */}
                    <span 
                      className="px-1.5 py-0.5 md:px-2 md:py-0.5 rounded-full text-[9px] md:text-[10px] font-medium backdrop-blur-sm transition-colors duration-300"
                      style={{ 
                        backgroundColor: colors.primaryMuted,
                        color: colors.primary
                      }}
                    >
                      {card.tag}
                    </span>
                    
                    {/* Icon */}
                    <div 
                      className={`w-7 h-7 md:w-8 md:h-8 rounded-lg md:rounded-xl ${card.color} flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-md`}
                    >
                      <card.icon size={14} className="text-white md:size-4" />
                    </div>
                  </div>
                  
                  {/* Bottom Row - Title and Subtitle */}
                  <div>
                    <h3 
                      className="font-semibold text-xs md:text-sm mb-0.5 transition-colors duration-300"
                      style={{ color: colors.text }}
                    >
                      {card.title}
                    </h3>
                    <p 
                      className="text-[9px] md:text-[10px] line-clamp-1 transition-colors duration-300"
                      style={{ color: colors.textMuted }}
                    >
                      {card.subtitle}
                    </p>
                  </div>
                </div>
                
                {/* Decorative Elements */}
                <div 
                  className="absolute -bottom-3 -right-3 w-12 h-12 md:w-14 md:h-14 rounded-full blur-lg transition-colors duration-300"
                  style={{ backgroundColor: colors.primaryMuted }}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </PageTransition>
  )
}
