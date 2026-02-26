import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BookOpen, Heart, Music, GraduationCap, Camera, Film } from 'lucide-react'
import PageTransition from '../components/ui/PageTransition'

const assetCategories = [
  {
    id: 'learning',
    label: '学习',
    path: '/learning',
    icon: BookOpen,
    description: '知识库、技能树、在线简历',
    color: 'from-blue-500/20 to-cyan-500/20',
    iconColor: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
    features: ['文章管理', '技能树', '在线简历'],
  },
  {
    id: 'life',
    label: '生活',
    path: '/life',
    icon: Heart,
    description: '朋友圈、旅拍相册、恋爱记录',
    color: 'from-rose-500/20 to-pink-500/20',
    iconColor: 'text-rose-500',
    bgColor: 'bg-rose-500/10',
    borderColor: 'border-rose-500/20',
    features: ['朋友圈', '旅拍相册', '恋爱记录', '运动', '游戏'],
  },
  {
    id: 'entertainment',
    label: '娱乐',
    path: '/entertainment',
    icon: Music,
    description: '音乐盒、收藏电影、百宝箱',
    color: 'from-violet-500/20 to-purple-500/20',
    iconColor: 'text-violet-500',
    bgColor: 'bg-violet-500/10',
    borderColor: 'border-violet-500/20',
    features: ['音乐盒', '收藏电影', '百宝箱'],
  },
]

export default function Assets() {
  const navigate = useNavigate()

  return (
    <PageTransition>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-text mb-2">资产</h1>
          <p className="text-text-muted text-sm sm:text-base">管理您的学习、生活和娱乐内容</p>
        </motion.div>

        {/* Category Buttons - 顶部快捷导航 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 sm:mb-10"
        >
          <div className="flex flex-wrap gap-3 sm:gap-4">
            {assetCategories.map((category, index) => (
              <motion.button
                key={category.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                onClick={() => navigate(category.path)}
                className={`flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 rounded-xl ${category.bgColor} ${category.borderColor} border-2 
                  transition-all duration-300 hover:scale-105 hover:shadow-lg group min-h-[44px] sm:min-h-[56px]`}
              >
                <category.icon 
                  size={20} 
                  className={`${category.iconColor} transition-transform group-hover:scale-110 sm:size-6`} 
                />
                <span className={`font-semibold text-sm sm:text-base ${category.iconColor}`}>
                  {category.label}
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Category Cards Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
        >
          {assetCategories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              onClick={() => navigate(category.path)}
              className="glass-card p-5 sm:p-6 cursor-pointer group transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
            >
              {/* Card Header */}
              <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br ${category.color} 
                flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                <category.icon size={24} className={`${category.iconColor} sm:size-7`} />
              </div>

              {/* Card Content */}
              <h2 className="text-lg sm:text-xl font-bold text-text mb-2 group-hover:text-primary transition-colors">
                {category.label}
              </h2>
              <p className="text-sm text-text-muted mb-4">
                {category.description}
              </p>

              {/* Features List */}
              <div className="flex flex-wrap gap-2">
                {category.features.map((feature) => (
                  <span
                    key={feature}
                    className={`text-xs px-2 py-1 rounded-full ${category.bgColor} ${category.iconColor}`}
                  >
                    {feature}
                  </span>
                ))}
              </div>

              {/* Arrow Indicator */}
              <div className="mt-4 flex items-center text-text-muted text-sm group-hover:text-primary transition-colors">
                <span>进入页面</span>
                <svg
                  className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 sm:mt-10"
        >
          <h3 className="text-lg font-semibold text-text mb-4">快速访问</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {[
              { icon: GraduationCap, label: '知识库', path: '/learning', color: 'text-blue-500', bg: 'bg-blue-500/10' },
              { icon: Camera, label: '旅拍相册', path: '/life', color: 'text-rose-500', bg: 'bg-rose-500/10' },
              { icon: Heart, label: '恋爱记录', path: '/life', color: 'text-pink-500', bg: 'bg-pink-500/10' },
              { icon: Music, label: '音乐盒', path: '/entertainment', color: 'text-violet-500', bg: 'bg-violet-500/10' },
              { icon: Film, label: '收藏电影', path: '/entertainment', color: 'text-purple-500', bg: 'bg-purple-500/10' },
              { icon: BookOpen, label: '百宝箱', path: '/entertainment', color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
            ].map((item, index) => (
              <motion.button
                key={item.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.05 }}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center gap-2 p-3 sm:p-4 rounded-xl ${item.bg} 
                  border border-border hover:border-primary/30 transition-all duration-300 hover:scale-105 min-h-[80px] sm:min-h-[96px]`}
              >
                <item.icon size={20} className={`${item.color} sm:size-6`} />
                <span className="text-xs sm:text-sm font-medium text-text">{item.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </PageTransition>
  )
}
