import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Sparkles, MessageCircle, Heart,
  Camera, Music, Gamepad2, User, Bot, Globe,
  ChevronRight, Star
} from 'lucide-react'
import PageTransition from '../components/ui/PageTransition'
import { useTheme } from '../hooks/useTheme'

// 欢迎语根据时间变化
const getGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 6) return '夜深了'
  if (hour < 12) return '早上好'
  if (hour < 18) return '下午好'
  return '晚上好'
}

// 次要功能卡片
const subFeatures = [
  {
    id: 'life',
    title: '生活记录',
    subtitle: '旅拍相册、恋爱记录',
    path: '/life',
    icon: Camera,
    color: 'bg-rose-100 text-rose-500',
  },
  {
    id: 'entertainment',
    title: '娱乐中心',
    subtitle: '音乐、电影、游戏',
    path: '/entertainment',
    icon: Music,
    color: 'bg-violet-100 text-violet-500',
  },
  {
    id: 'assets',
    title: '资产管理',
    subtitle: '技能树、简历、收藏',
    path: '/assets',
    icon: Star,
    color: 'bg-amber-100 text-amber-500',
  },
  {
    id: 'social',
    title: '社交空间',
    subtitle: '元宇宙、好友互动',
    path: '/social',
    icon: Globe,
    color: 'bg-sky-100 text-sky-500',
  },
]

// 快捷入口
const quickAccess = [
  { icon: Heart, label: '恋爱', path: '/life', color: 'from-pink-400 to-rose-400' },
  { icon: Camera, label: '旅拍', path: '/life', color: 'from-amber-400 to-orange-400' },
  { icon: Music, label: '音乐', path: '/entertainment', color: 'from-violet-400 to-purple-400' },
  { icon: Gamepad2, label: '游戏', path: '/entertainment', color: 'from-indigo-400 to-blue-400' },
  { icon: User, label: '我的', path: '/social', color: 'from-emerald-400 to-teal-400' },
]

export default function Home() {
  const navigate = useNavigate()
  const { themeConfig } = useTheme()
  const { colors } = themeConfig

  return (
    <PageTransition>
      <div
        className="min-h-screen pb-24 transition-colors duration-300"
        style={{ backgroundColor: colors.bg }}
      >
        {/* Header 欢迎语 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-5 pt-8 pb-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className="text-sm mb-1 transition-colors duration-300"
                style={{ color: colors.textMuted }}
              >
                {getGreeting()}
              </p>
              <h1
                className="text-2xl font-bold flex items-center gap-2 transition-colors duration-300"
                style={{ color: colors.text }}
              >
                晓叶就很棒
                <Sparkles size={20} className="text-amber-400" />
              </h1>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/social')}
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: colors.surface,
                border: `1px solid ${colors.border}`
              }}
            >
              <User size={20} style={{ color: colors.textSecondary }} />
            </motion.button>
          </div>
        </motion.div>

        {/* 主功能卡片区域 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="px-5 mb-6"
        >
          {/* 大卡片 - AI分身 */}
          <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/ai-character')}
            className="relative overflow-hidden rounded-3xl mb-3 cursor-pointer group"
            style={{
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #f093fb 100%)',
              boxShadow: '0 20px 40px rgba(245, 87, 108, 0.3), inset 0 1px 0 rgba(255,255,255,0.3)',
            }}
          >
            {/* 玻璃光泽效果 */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent" />
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />

            <div className="relative p-6 flex items-center justify-between">
              <div>
                <div
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium mb-3"
                  style={{ backgroundColor: 'rgba(255,255,255,0.25)' }}
                >
                  <Sparkles size={12} className="text-white" />
                  <span className="text-white/90">智能助手</span>
                </div>
                <h2 className="text-2xl font-bold text-white mb-1">
                  AI分身
                </h2>
                <p className="text-white/80 text-sm">
                  你的专属AI智能伙伴
                </p>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Bot size={32} className="text-white" />
              </div>
            </div>
          </motion.div>

          {/* 两个小卡片 */}
          <div className="grid grid-cols-2 gap-3">
            {/* 元宇宙 */}
            <motion.div
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/community')}
              className="relative overflow-hidden rounded-2xl p-4 cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #fbbf24 100%)',
                boxShadow: '0 12px 30px rgba(251, 191, 36, 0.3), inset 0 1px 0 rgba(255,255,255,0.3)',
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/25 via-transparent to-transparent" />
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-3">
                  <Globe size={20} className="text-white" />
                </div>
                <h3 className="text-white font-bold mb-0.5">元宇宙</h3>
                <p className="text-white/70 text-xs">探索虚拟社交空间</p>
              </div>
            </motion.div>

            {/* 资产 */}
            <motion.div
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/assets')}
              className="relative overflow-hidden rounded-2xl p-4 cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, #34d399 0%, #10b981 50%, #34d399 100%)',
                boxShadow: '0 12px 30px rgba(52, 211, 153, 0.3), inset 0 1px 0 rgba(255,255,255,0.3)',
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/25 via-transparent to-transparent" />
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-3">
                  <Star size={20} className="text-white" />
                </div>
                <h3 className="text-white font-bold mb-0.5">资产</h3>
                <p className="text-white/70 text-xs">管理你的数字资产</p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* 精选内容区域 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="px-5 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2
              className="text-lg font-bold transition-colors duration-300"
              style={{ color: colors.text }}
            >
              精选内容
            </h2>
            <button
              onClick={() => navigate('/community')}
              className="flex items-center gap-0.5 text-sm transition-colors duration-300 hover:opacity-80"
              style={{ color: colors.primary }}
            >
              全部
              <ChevronRight size={16} />
            </button>
          </div>

          {/* 社区卡片 */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/community')}
            className="relative overflow-hidden rounded-2xl p-4 mb-4 cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 50%, #60a5fa 100%)',
              boxShadow: '0 12px 30px rgba(59, 130, 246, 0.3), inset 0 1px 0 rgba(255,255,255,0.3)',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent" />
            <div className="relative flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <MessageCircle size={18} className="text-white" />
                  <h3 className="text-white font-bold">树洞社区</h3>
                </div>
                <p className="text-white/80 text-sm">与 2,000+ 伙伴分享心情</p>
              </div>
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-white/30 backdrop-blur-sm border-2 border-white/50 flex items-center justify-center"
                  >
                    <span className="text-xs text-white">{i === 3 ? '+99' : ''}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* 功能模块网格 */}
          <div className="grid grid-cols-2 gap-3">
            {subFeatures.map((feature, index) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate(feature.path)}
                className="relative overflow-hidden rounded-2xl p-4 cursor-pointer group"
                style={{
                  backgroundColor: colors.surface,
                  border: `1px solid ${colors.border}`,
                  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
                }}
              >
                {/* 悬停光效 */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ backgroundColor: colors.cardHover }}
                />

                <div className="relative">
                  <div className={`w-10 h-10 rounded-xl ${feature.color} flex items-center justify-center mb-3`}>
                    <feature.icon size={20} />
                  </div>
                  <h3
                    className="font-bold text-sm mb-0.5 transition-colors duration-300"
                    style={{ color: colors.text }}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className="text-xs transition-colors duration-300"
                    style={{ color: colors.textMuted }}
                  >
                    {feature.subtitle}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 快捷入口 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="px-5"
        >
          <div className="flex justify-between gap-2">
            {quickAccess.map((item, index) => (
              <motion.button
                key={item.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.05 }}
                whileHover={{ scale: 1.1, y: -4 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => navigate(item.path)}
                className="flex-1 flex flex-col items-center gap-2 group"
              >
                <div
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.color} p-0.5 shadow-lg transform transition-transform duration-300`}
                  style={{
                    boxShadow: `0 8px 20px rgba(0,0,0,0.15)`,
                  }}
                >
                  <div
                    className="w-full h-full rounded-[14px] flex items-center justify-center"
                    style={{ backgroundColor: colors.bg }}
                  >
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center`}>
                      <item.icon size={18} className="text-white" />
                    </div>
                  </div>
                </div>
                <span
                  className="text-xs font-medium transition-colors duration-300"
                  style={{ color: colors.textMuted }}
                >
                  {item.label}
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>

      </div>
    </PageTransition>
  )
}
