import { motion } from 'framer-motion'
import { ExternalLink, Users, Github, Twitter, Linkedin, Mail, Link as LinkIcon } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'
import type { SocialLink } from '../../types/profile'
import { AnimatedSection } from './AnimatedSection'

interface SocialMediaSectionProps {
  socials: SocialLink[]
}

// 社交媒体平台配置
const platformConfig: Record<string, { 
  icon: React.ComponentType<{ size?: number }>
  color: string
  bgGradient: string
}> = {
  github: {
    icon: Github,
    color: '#333',
    bgGradient: 'from-gray-700 to-gray-900'
  },
  twitter: {
    icon: Twitter,
    color: '#1DA1F2',
    bgGradient: 'from-blue-400 to-blue-600'
  },
  linkedin: {
    icon: Linkedin,
    color: '#0A66C2',
    bgGradient: 'from-blue-600 to-blue-800'
  },
  weibo: {
    icon: () => <span className="text-2xl">微博</span>,
    color: '#E6162D',
    bgGradient: 'from-red-500 to-red-700'
  },
  bilibili: {
    icon: () => <span className="text-2xl font-bold">B站</span>,
    color: '#00A1D6',
    bgGradient: 'from-cyan-400 to-blue-500'
  },
  zhihu: {
    icon: () => <span className="text-2xl font-bold">知</span>,
    color: '#0084FF',
    bgGradient: 'from-blue-400 to-blue-600'
  },
  douyin: {
    icon: () => <span className="text-2xl font-bold">抖</span>,
    color: '#000000',
    bgGradient: 'from-gray-800 to-black'
  },
  wechat: {
    icon: () => <span className="text-2xl font-bold">微</span>,
    color: '#07C160',
    bgGradient: 'from-green-500 to-green-700'
  },
  email: {
    icon: Mail,
    color: '#EA4335',
    bgGradient: 'from-red-400 to-red-600'
  },
  website: {
    icon: LinkIcon,
    color: '#8B5CF6',
    bgGradient: 'from-violet-500 to-purple-700'
  }
}

// 数字格式化
function formatNumber(num: number): string {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}

// 社交媒体卡片
function SocialCard({ social, index }: { social: SocialLink; index: number }) {
  const { themeConfig } = useTheme()
  const config = platformConfig[social.platform] || platformConfig.website
  const Icon = config.icon

  return (
    <motion.a
      href={social.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="group relative block p-6 rounded-2xl overflow-hidden"
      style={{
        background: themeConfig.colors.surface,
        border: `1px solid ${themeConfig.colors.border}`
      }}
    >
      {/* 背景渐变 */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${config.bgGradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
      />

      <div className="relative flex items-start justify-between">
        <div className="flex items-center gap-4">
          {/* 图标 */}
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center text-white"
            style={{ background: config.color }}
          >
            <Icon size={28} />
          </div>

          {/* 信息 */}
          <div>
            <h3
              className="text-lg font-semibold"
              style={{ color: themeConfig.colors.text }}
            >
              {social.displayName}
            </h3>
            <p
              className="text-sm"
              style={{ color: themeConfig.colors.textMuted }}
            >
              @{social.username}
            </p>
          </div>
        </div>

        {/* 外部链接图标 */}
        <ExternalLink
          size={18}
          className="opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ color: themeConfig.colors.textMuted }}
        />
      </div>

      {/* 粉丝数 */}
      {social.followerCount && (
        <div className="mt-4 flex items-center gap-2">
          <Users size={16} style={{ color: themeConfig.colors.textMuted }} />
          <span
            className="text-2xl font-bold"
            style={{ color: themeConfig.colors.primary }}
          >
            {formatNumber(social.followerCount)}
          </span>
          <span
            className="text-sm"
            style={{ color: themeConfig.colors.textMuted }}
          >
            粉丝
          </span>
        </div>
      )}

      {/* 悬停光效 */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          boxShadow: `inset 0 0 0 1px ${config.color}00`
        }}
        whileHover={{
          boxShadow: `inset 0 0 0 1px ${config.color}40`
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.a>
  )
}

export function SocialMediaSection({ socials }: SocialMediaSectionProps) {
  const { themeConfig } = useTheme()

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8" style={{ background: themeConfig.colors.bg }}>
      <div className="max-w-6xl mx-auto">
        {/* 标题 */}
        <AnimatedSection className="text-center mb-12">
          <h2
            className="text-3xl sm:text-4xl font-bold mb-4"
            style={{ color: themeConfig.colors.text }}
          >
            自媒体矩阵
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto"
            style={{ color: themeConfig.colors.textMuted }}
          >
            在多个平台分享技术见解，与开发者社区保持连接
          </p>
        </AnimatedSection>

        {/* 社交媒体卡片网格 */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {socials.map((social, index) => (
            <SocialCard key={social.platform} social={social} index={index} />
          ))}
        </div>

        {/* 提示文字 */}
        <AnimatedSection delay={0.5} className="mt-8 text-center">
          <p
            className="text-sm"
            style={{ color: themeConfig.colors.textMuted }}
          >
            欢迎关注我的社交媒体，一起交流学习 🚀
          </p>
        </AnimatedSection>
      </div>
    </section>
  )
}
