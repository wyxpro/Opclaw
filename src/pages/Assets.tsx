import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  BookOpen, Heart, GraduationCap, Camera, 
  GitBranch, MessageCircle, Dumbbell, Gamepad2, 
  Briefcase, PenTool, Music, Film
} from 'lucide-react'
import PageTransition from '../components/ui/PageTransition'
import { useTheme } from '../hooks/useTheme'
import WorkAssistant from '../components/work/WorkAssistant'

// 学习类卡片数据 - 对应学习页面的子菜单
const learningCards = [
  {
    id: 'knowledge',
    title: '知识库',
    subtitle: '系统化知识管理',
    path: '/learning?view=knowledge',
    color: 'from-blue-600/70 to-blue-800/70',
    icon: BookOpen,
    tag: '学习',
    bgImage: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=600&q=80',
  },
  {
    id: 'skilltree',
    title: '技能树',
    subtitle: '技能全景展示',
    path: '/learning?view=skilltree',
    color: 'from-violet-600/70 to-purple-800/70',
    icon: GitBranch,
    tag: '成长',
    bgImage: 'https://images.unsplash.com/photo-1510070112810-d4e9a46d9e91?w=600&q=80',
  },
]

// 生活类卡片数据 - 对应生活页面的子菜单
const lifeCards = [
  {
    id: 'moments',
    title: '朋友圈',
    subtitle: '分享生活点滴',
    path: '/life?tab=moments',
    color: 'from-rose-600/70 to-pink-800/70',
    icon: MessageCircle,
    tag: '社交',
    bgImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80',
  },
  {
    id: 'travel',
    title: '旅拍相册',
    subtitle: '记录美好旅程',
    path: '/life?tab=travel',
    color: 'from-amber-500/70 to-orange-700/70',
    icon: Camera,
    tag: '旅行',
    bgImage: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&q=80',
  },
  {
    id: 'love',
    title: '恋爱记录',
    subtitle: '甜蜜时光珍藏',
    path: '/life?tab=love',
    color: 'from-pink-500/70 to-rose-700/70',
    icon: Heart,
    tag: '恋爱',
    bgImage: 'https://images.unsplash.com/photo-1494774157365-9e04c6720e47?w=600&q=80',
  },
  {
    id: 'music',
    title: '音乐盒',
    subtitle: '聆听美妙音乐',
    path: '/life?tab=music',
    color: 'from-cyan-500/70 to-blue-700/70',
    icon: Music,
    tag: '音乐',
    bgImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
  },
  {
    id: 'movies',
    title: '收藏电影',
    subtitle: '精彩影片收藏',
    path: '/life?tab=movies',
    color: 'from-red-600/70 to-red-900/70',
    icon: Film,
    tag: '影视',
    bgImage: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=600&q=80',
  },
  {
    id: 'sports',
    title: '运动',
    subtitle: '健康生活记录',
    path: '/life?tab=sports',
    color: 'from-slate-900/40 to-slate-900/60',
    icon: Dumbbell,
    tag: '健康',
    bgImage: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=800&q=80',
  },
  {
    id: 'games',
    title: '游戏',
    subtitle: '娱乐休闲时光',
    path: '/life?tab=games',
    color: 'from-indigo-600/70 to-blue-800/70',
    icon: Gamepad2,
    tag: '娱乐',
    bgImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&q=80',
  },
]

// 工作类卡片数据 - 对应工作助手页面的子菜单
const workCards = [
  {
    id: 'media',
    title: '新媒体',
    subtitle: '社交媒体内容创作',
    path: '/work?tab=media',
    color: 'from-violet-600/70 to-indigo-800/70',
    icon: PenTool,
    tag: '创作',
    bgImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80',
  },
]

// 合并所有卡片用于网格展示
const allCards = [...learningCards, ...lifeCards, ...workCards]

export default function Assets() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { themeConfig } = useTheme()
  const { colors } = themeConfig
  
  // 检查工作助手相关参数
  const tab = searchParams.get('tab')
  const isWorkMedia = tab === 'work-media'
  const isWorkEcommerce = tab === 'work-ecommerce'
  const isWorkTab = tab === 'work' || isWorkMedia || isWorkEcommerce
  
  // 如果访问工作助手子模块，直接渲染对应组件
  if (isWorkMedia) {
    return <WorkAssistant defaultModule="media" />
  }
  if (isWorkEcommerce) {
    return <WorkAssistant defaultModule="ecommerce" />
  }
  if (isWorkTab) {
    return <WorkAssistant />
  }

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
                    {learningCards.length} 个功能
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
                    {lifeCards.length} 个功能
                  </p>
                </div>
              </div>
              <div 
                className="absolute -bottom-3 -right-3 w-12 h-12 md:w-16 md:h-16 rounded-full blur-lg transition-colors duration-300"
                style={{ backgroundColor: 'rgba(244, 63, 94, 0.15)' }}
              />
            </div>

            {/* Work Summary */}
            <div 
              onClick={() => navigate('/work')}
              className="relative overflow-hidden rounded-xl md:rounded-2xl p-3 md:p-6 cursor-pointer group transition-all duration-300 hover:shadow-md"
              style={{ 
                backgroundColor: colors.surface,
                border: `1px solid ${colors.border}`
              }}
            >
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-md flex-shrink-0">
                  <Briefcase size={18} className="text-white md:size-6" />
                </div>
                <div className="min-w-0">
                  <h3 
                    className="font-semibold text-sm md:text-base transition-colors duration-300 truncate"
                    style={{ color: colors.text }}
                  >
                    工作助手
                  </h3>
                  <p 
                    className="text-[10px] md:text-sm transition-colors duration-300"
                    style={{ color: colors.textMuted }}
                  >
                    {workCards.length} 个功能
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
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(card.path)}
                className="relative overflow-hidden rounded-xl md:rounded-2xl cursor-pointer group transition-all duration-500 shadow-sm hover:shadow-xl"
                style={{ 
                  aspectRatio: '1.8/1',
                  backgroundColor: colors.surface,
                  border: `1px solid ${colors.border}`
                }}
              >
                {/* Background Image with Gradient Overlay */}
                <div 
                  className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${card.bgImage})` }}
                />
                <div 
                  className={`absolute inset-0 z-1 bg-gradient-to-br ${card.color} transition-opacity duration-300 group-hover:opacity-90`}
                />
                
                {/* Content Overlay */}
                <div className="relative z-10 h-full p-3 md:p-4 flex flex-col justify-between">
                  {/* Top Row - Tag Only */}
                  <div className="flex items-start justify-between">
                    <span 
                      className="px-2 py-0.5 rounded-full text-[9px] md:text-[10px] font-bold transition-colors duration-300"
                      style={{ 
                        backgroundColor: colors.primaryMuted,
                        color: colors.primary
                      }}
                    >
                      {card.tag}
                    </span>
                  </div>
                  
                  {/* Bottom Row - Title and Subtitle */}
                  <div className="transform transition-transform duration-300 group-hover:translate-y-[-2px]">
                    <h3 className="font-bold text-sm md:text-base text-white mb-0.5 drop-shadow-md">
                      {card.title}
                    </h3>
                    <p className="text-[10px] md:text-xs text-white/90 line-clamp-1 font-medium drop-shadow-sm">
                      {card.subtitle}
                    </p>
                  </div>
                </div>

                {/* Shine effect on hover */}
                <div className="absolute inset-0 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </PageTransition>
  )
}
