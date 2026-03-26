import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { MapPin, Mail, Link as LinkIcon, Github, Twitter, Linkedin, FileText, Home as HomeIcon } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'
import type { PersonalProfile } from '../../types/profile'
import { AnimatedSection, Floating } from './AnimatedSection'

// 预定义的粒子数据（避免使用 Math.random）
const PARTICLES = [
  { id: 0, x: 15, y: 20, size: 3, duration: 18, delay: 0, opacity: 0.4, offsetX: 8 },
  { id: 1, x: 85, y: 15, size: 4, duration: 22, delay: 1, opacity: 0.3, offsetX: -6 },
  { id: 2, x: 70, y: 80, size: 2, duration: 16, delay: 2, opacity: 0.5, offsetX: 10 },
  { id: 3, x: 25, y: 70, size: 3, duration: 20, delay: 0.5, opacity: 0.35, offsetX: -8 },
  { id: 4, x: 50, y: 30, size: 5, duration: 25, delay: 1.5, opacity: 0.25, offsetX: 5 },
  { id: 5, x: 90, y: 50, size: 2, duration: 19, delay: 3, opacity: 0.45, offsetX: -10 },
  { id: 6, x: 10, y: 85, size: 4, duration: 21, delay: 2.5, opacity: 0.3, offsetX: 7 },
  { id: 7, x: 60, y: 10, size: 3, duration: 17, delay: 4, opacity: 0.4, offsetX: -5 },
  { id: 8, x: 40, y: 60, size: 2, duration: 23, delay: 1, opacity: 0.35, offsetX: 9 },
  { id: 9, x: 80, y: 35, size: 4, duration: 20, delay: 0, opacity: 0.3, offsetX: -7 },
  { id: 10, x: 5, y: 45, size: 3, duration: 24, delay: 2, opacity: 0.4, offsetX: 6 },
  { id: 11, x: 95, y: 75, size: 2, duration: 18, delay: 3.5, opacity: 0.25, offsetX: -9 },
  { id: 12, x: 30, y: 90, size: 5, duration: 26, delay: 1, opacity: 0.35, offsetX: 8 },
  { id: 13, x: 75, y: 25, size: 3, duration: 19, delay: 4.5, opacity: 0.4, offsetX: -6 },
  { id: 14, x: 45, y: 45, size: 2, duration: 21, delay: 0.5, opacity: 0.3, offsetX: 10 },
  { id: 15, x: 20, y: 55, size: 4, duration: 17, delay: 2, opacity: 0.45, offsetX: -8 },
  { id: 16, x: 65, y: 65, size: 3, duration: 22, delay: 3, opacity: 0.25, offsetX: 7 },
  { id: 17, x: 55, y: 85, size: 2, duration: 20, delay: 1.5, opacity: 0.4, offsetX: -5 },
  { id: 18, x: 35, y: 5, size: 4, duration: 24, delay: 0, opacity: 0.3, offsetX: 9 },
  { id: 19, x: 88, y: 90, size: 3, duration: 18, delay: 2.5, opacity: 0.35, offsetX: -7 }
]

// 浮动粒子组件
function FloatingParticles({ colors }: { colors: { primary: string; accent: string } }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {PARTICLES.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            background: particle.id % 2 === 0 ? colors.primary : colors.accent,
            opacity: particle.opacity,
            boxShadow: `0 0 ${particle.size * 2}px ${particle.id % 2 === 0 ? colors.primary : colors.accent}`
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, particle.offsetX, 0],
            opacity: [particle.opacity, particle.opacity * 1.5, particle.opacity],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      ))}
    </div>
  )
}

// 动态网格背景
function AnimatedGrid({ color }: { color: string }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.03]">
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(${color} 1px, transparent 1px),
            linear-gradient(90deg, ${color} 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
        animate={{
          backgroundPosition: ['0px 0px', '60px 60px']
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear'
        }}
      />
    </div>
  )
}

// 发光球体组件
function GlowingOrbs({ colors }: { colors: { primary: string; accent: string } }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* 主发光球 - 左上 */}
      <motion.div
        className="absolute -top-20 -left-20 w-[500px] h-[500px] rounded-full"
        style={{
          background: `radial-gradient(circle, ${colors.primary}25 0%, ${colors.primary}10 40%, transparent 70%)`,
          filter: 'blur(60px)'
        }}
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />
      
      {/* 次发光球 - 右下 */}
      <motion.div
        className="absolute -bottom-40 -right-20 w-[600px] h-[600px] rounded-full"
        style={{
          background: `radial-gradient(circle, ${colors.accent}20 0%, ${colors.accent}08 40%, transparent 70%)`,
          filter: 'blur(80px)'
        }}
        animate={{
          x: [0, -40, 0],
          y: [0, -50, 0],
          scale: [1, 1.15, 1]
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2
        }}
      />

      {/* 小发光球 - 中间偏右 */}
      <motion.div
        className="absolute top-1/3 right-1/4 w-[300px] h-[300px] rounded-full"
        style={{
          background: `radial-gradient(circle, ${colors.primary}15 0%, transparent 60%)`,
          filter: 'blur(40px)'
        }}
        animate={{
          x: [0, 30, 0],
          y: [0, -20, 0],
          opacity: [0.5, 0.8, 0.5]
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1
        }}
      />
    </div>
  )
}

interface HeroSectionProps {
  profile: PersonalProfile
  showResume?: boolean
  onToggleResume?: (show: boolean) => void
}

// 社交媒体图标映射
const socialIcons: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  github: Github,
  twitter: Twitter,
  linkedin: Linkedin,
  weibo: () => <span className="text-lg">微博</span>,
  bilibili: () => <span className="text-lg">B站</span>,
  zhihu: () => <span className="text-lg">知</span>,
  douyin: () => <span className="text-lg">抖</span>,
  wechat: () => <span className="text-lg">微</span>,
  email: Mail,
  website: LinkIcon
}

export function HeroSection({ profile, showResume = false, onToggleResume }: HeroSectionProps) {
  const { themeConfig } = useTheme()
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  })

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.3])

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: themeConfig.colors.bg }}
    >
      {/* 动态网格背景 */}
      <AnimatedGrid color={themeConfig.colors.text} />

      {/* 发光球体背景 */}
      <GlowingOrbs colors={{ primary: themeConfig.colors.primary, accent: themeConfig.colors.accent }} />

      {/* 浮动粒子效果 */}
      <FloatingParticles colors={{ primary: themeConfig.colors.primary, accent: themeConfig.colors.accent }} />

      {/* 顶部渐变光晕 */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 50% 0%, ${themeConfig.colors.primary}12 0%, transparent 50%)`,
          y: backgroundY
        }}
      />

      {/* 模式切换按钮组 - 放置在背景图上方区域 */}
      {onToggleResume && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="absolute top-6 left-6 z-20"
        >
          <div 
            className="flex items-center p-1 rounded-xl backdrop-blur-md"
            style={{ 
              backgroundColor: `${themeConfig.colors.surface}80`,
              border: `1px solid ${themeConfig.colors.border}`
            }}
          >
            {/* 个人主页按钮 */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onToggleResume(false)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                !showResume 
                  ? 'shadow-sm' 
                  : 'opacity-60 hover:opacity-80'
              }`}
              style={{
                backgroundColor: !showResume ? `${themeConfig.colors.bg}90` : 'transparent',
                color: themeConfig.colors.text
              }}
            >
              <HomeIcon size={16} />
              <span className="hidden sm:inline">个人主页</span>
            </motion.button>
            
            {/* 在线简历按钮 */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onToggleResume(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                showResume 
                  ? 'shadow-sm' 
                  : 'opacity-60 hover:opacity-80'
              }`}
              style={{
                backgroundColor: showResume ? `${themeConfig.colors.bg}90` : 'transparent',
                color: themeConfig.colors.text
              }}
            >
              <FileText size={16} />
              <span className="hidden sm:inline">在线简历</span>
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* 主要内容 */}
      <motion.div
        className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
        style={{ y: textY, opacity }}
      >
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* 左侧：头像和个人信息 */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            {/* 头像 */}
            <AnimatedSection delay={0}>
              <Floating amplitude={8} duration={4}>
                <div className="relative">
                  {/* 发光效果 */}
                  <div
                    className="absolute inset-0 rounded-full blur-2xl opacity-40"
                    style={{
                      background: `linear-gradient(135deg, ${themeConfig.colors.primary}, ${themeConfig.colors.accent})`,
                      transform: 'scale(1.2)'
                    }}
                  />
                  {/* 旋转光环 */}
                  <motion.div
                    className="absolute -inset-2 rounded-full"
                    style={{
                      background: `conic-gradient(from 0deg, ${themeConfig.colors.primary}, ${themeConfig.colors.accent}, ${themeConfig.colors.primary})`,
                      padding: '2px'
                    }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                  >
                    <div
                      className="w-full h-full rounded-full"
                      style={{ background: themeConfig.colors.bg }}
                    />
                  </motion.div>
                  {/* 头像图片 */}
                  <div
                    className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4"
                    style={{ borderColor: themeConfig.colors.surface }}
                  >
                    <img
                      src={profile.avatar}
                      alt={profile.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </Floating>
            </AnimatedSection>

            {/* 姓名 */}
            <AnimatedSection delay={0.1} className="mt-8">
              <h1
                className="text-4xl sm:text-5xl lg:text-6xl font-bold gradient-text-dynamic"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${themeConfig.colors.text} 0%, ${themeConfig.colors.primary} 100%)`,
                  backgroundSize: '100% 100%'
                }}
              >
                {profile.name}
              </h1>
            </AnimatedSection>

            {/* 职业标签 */}
            <AnimatedSection delay={0.2}>
              <p
                className="mt-3 text-lg sm:text-xl"
                style={{ color: themeConfig.colors.textSecondary }}
              >
                {profile.title}
              </p>
            </AnimatedSection>

            {/* 位置和邮箱 */}
            <AnimatedSection delay={0.3}>
              <div className="mt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-sm" style={{ color: themeConfig.colors.textMuted }}>
                <span className="flex items-center gap-1.5">
                  <MapPin size={16} />
                  {profile.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <Mail size={16} />
                  {profile.email}
                </span>
              </div>
            </AnimatedSection>

            {/* 社交链接 */}
            <AnimatedSection delay={0.4}>
              <div className="mt-6 flex items-center gap-3">
                {profile.socialLinks.map((social, index) => {
                  const Icon = socialIcons[social.platform]
                  return (
                    <motion.a
                      key={social.platform}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative p-3 rounded-xl transition-all duration-300"
                      style={{
                        background: themeConfig.colors.surface,
                        border: `1px solid ${themeConfig.colors.border}`
                      }}
                      whileHover={{
                        scale: 1.1,
                        boxShadow: `0 0 20px ${themeConfig.colors.primary}40`
                      }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                    >
                      <span style={{ color: themeConfig.colors.textMuted }}>
                        <Icon size={20} className="transition-colors" />
                      </span>
                      {/* 悬停提示 */}
                      <div
                        className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                        style={{
                          background: themeConfig.colors.surface,
                          border: `1px solid ${themeConfig.colors.border}`,
                          color: themeConfig.colors.text
                        }}
                      >
                        {social.displayName}
                      </div>
                    </motion.a>
                  )
                })}
              </div>
            </AnimatedSection>
          </div>

          {/* 右侧：简介和成就 */}
          <div className="flex-1 max-w-xl">
            {/* 简介 */}
            <AnimatedSection delay={0.3} direction="right">
              <div
                className="p-6 rounded-2xl"
                style={{
                  background: themeConfig.glassEffect.background,
                  border: themeConfig.glassEffect.border,
                  backdropFilter: themeConfig.glassEffect.backdropBlur
                }}
              >
                <p
                  className="text-base sm:text-lg leading-relaxed"
                  style={{ color: themeConfig.colors.textSecondary }}
                >
                  {profile.bio}
                </p>
              </div>
            </AnimatedSection>

            {/* 统计数据 */}
            <AnimatedSection delay={0.4} direction="right">
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
                {Object.entries(profile.stats).map(([key, value], index) => {
                  const labels: Record<string, string> = {
                    yearsOfExperience: '年经验',
                    projectsCompleted: '项目完成',
                    happyClients: '满意客户',
                    awards: '获得荣誉'
                  }
                  return (
                    <motion.div
                      key={key}
                      className="text-center p-4 rounded-xl"
                      style={{
                        background: themeConfig.colors.surface,
                        border: `1px solid ${themeConfig.colors.border}`
                      }}
                      whileHover={{ scale: 1.05 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                    >
                      <div
                        className="text-2xl sm:text-3xl font-bold"
                        style={{ color: themeConfig.colors.primary }}
                      >
                        {value}+
                      </div>
                      <div
                        className="text-xs mt-1"
                        style={{ color: themeConfig.colors.textMuted }}
                      >
                        {labels[key]}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </AnimatedSection>

            {/* 成就徽章 */}
            <AnimatedSection delay={0.5} direction="right">
              <div className="mt-6">
                <h3
                  className="text-sm font-medium mb-3"
                  style={{ color: themeConfig.colors.textMuted }}
                >
                  荣誉成就
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile.achievements.map((achievement, index) => (
                    <motion.div
                      key={achievement.id}
                      className="flex items-center gap-2 px-3 py-2 rounded-full text-sm"
                      style={{
                        background: `${achievement.color || themeConfig.colors.primary}15`,
                        border: `1px solid ${achievement.color || themeConfig.colors.primary}30`,
                        color: themeConfig.colors.text
                      }}
                      whileHover={{ scale: 1.05 }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                    >
                      <span>{achievement.icon}</span>
                      <span className="hidden sm:inline">{achievement.title}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </motion.div>

      {/* 底部渐变过渡 */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: `linear-gradient(to top, ${themeConfig.colors.bg}, transparent)`
        }}
      />
    </section>
  )
}
