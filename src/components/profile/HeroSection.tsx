import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import { MapPin, Mail, Link as LinkIcon, Github, Twitter, Linkedin, FileText, Home as HomeIcon, Share2, Upload, Eye, Edit3, Download, Undo2, Redo2, RotateCcw } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'
import type { PersonalProfile } from '../../types/profile'
import { AnimatedSection, Floating } from './AnimatedSection'

// 预定义的粒子数据（避免使用 Math.random）- 移动端减少粒子数量
const PARTICLES_DESKTOP = [
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

// 移动端使用更少的粒子
const PARTICLES_MOBILE = [
  { id: 0, x: 20, y: 20, size: 3, duration: 20, delay: 0, opacity: 0.3, offsetX: 6 },
  { id: 1, x: 80, y: 30, size: 4, duration: 24, delay: 1, opacity: 0.25, offsetX: -5 },
  { id: 2, x: 50, y: 70, size: 2, duration: 18, delay: 2, opacity: 0.35, offsetX: 8 },
  { id: 3, x: 30, y: 50, size: 3, duration: 22, delay: 0.5, opacity: 0.3, offsetX: -6 },
  { id: 4, x: 70, y: 80, size: 4, duration: 26, delay: 1.5, opacity: 0.2, offsetX: 5 },
  { id: 5, x: 10, y: 60, size: 2, duration: 19, delay: 3, opacity: 0.3, offsetX: -7 },
  { id: 6, x: 90, y: 40, size: 3, duration: 21, delay: 2.5, opacity: 0.25, offsetX: 6 },
  { id: 7, x: 40, y: 10, size: 4, duration: 23, delay: 4, opacity: 0.3, offsetX: -5 }
]

// 检测移动端的 hook
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  return isMobile
}

// 浮动粒子组件
function FloatingParticles({ colors }: { colors: { primary: string; accent: string } }) {
  const isMobile = useIsMobile()
  const particles = isMobile ? PARTICLES_MOBILE : PARTICLES_DESKTOP
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
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

// 动态网格背景 - 移动端禁用动画
function AnimatedGrid({ color }: { color: string }) {
  const isMobile = useIsMobile()
  
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
        animate={isMobile ? undefined : {
          backgroundPosition: ['0px 0px', '60px 60px']
        }}
        transition={isMobile ? undefined : {
          duration: 20,
          repeat: Infinity,
          ease: 'linear'
        }}
      />
    </div>
  )
}

// 发光球体组件 - 移动端简化动画
function GlowingOrbs({ colors }: { colors: { primary: string; accent: string } }) {
  const isMobile = useIsMobile()
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* 主发光球 - 左上 */}
      <motion.div
        className="absolute -top-20 -left-20 w-[500px] h-[500px] rounded-full"
        style={{
          background: `radial-gradient(circle, ${colors.primary}25 0%, ${colors.primary}10 40%, transparent 70%)`,
          filter: isMobile ? 'blur(40px)' : 'blur(60px)'
        }}
        animate={isMobile ? undefined : {
          x: [0, 50, 0],
          y: [0, 30, 0],
          scale: [1, 1.1, 1]
        }}
        transition={isMobile ? undefined : {
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />
      
      {/* 次发光球 - 右下 - 移动端隐藏以减少渲染负担 */}
      {!isMobile && (
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
      )}

      {/* 小发光球 - 中间偏右 - 移动端隐藏 */}
      {!isMobile && (
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
      )}
    </div>
  )
}

interface HeroSectionProps {
  profile: PersonalProfile
  showResume?: boolean
  onToggleResume?: (show: boolean) => void
  onOpenCardModal?: () => void
  isEditMode?: boolean
  onUpdateProfile?: (field: keyof PersonalProfile, value: any) => void
  mode?: 'preview' | 'edit'
  onModeChange?: (mode: 'preview' | 'edit') => void
  onDownloadPDF?: () => void
  canUndo?: boolean
  canRedo?: boolean
  onUndo?: () => void
  onRedo?: () => void
  onResetToDefault?: () => void
}

// 哔哩哔哩图标组件 - 使用官方SVG图标
function BilibiliIcon({ size = 18, className }: { size?: number; className?: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="currentColor"
      className={className}
    >
      <path d="M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.511.556-2.765 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 0 1-.373-.906c0-.356.124-.658.373-.907l.027-.027c.267-.249.573-.373.92-.373.347 0 .653.124.92.373L9.653 4.44c.071.071.134.142.187.213h4.267a.836.836 0 0 1 .16-.213l2.853-2.747c.267-.249.573-.373.92-.373.347 0 .662.151.929.4.249.249.373.551.373.907 0 .355-.124.657-.373.906L17.813 4.653zM5.333 7.24c-.746.018-1.373.276-1.88.773-.506.498-.769 1.13-.786 1.894v7.52c.017.764.28 1.395.786 1.893.507.498 1.134.756 1.88.773h13.334c.746-.017 1.373-.275 1.88-.773.506-.498.769-1.129.786-1.893v-7.52c-.017-.765-.28-1.396-.786-1.894-.507-.497-1.134-.755-1.88-.773H5.333zm4 5.146c-.373 0-.64.107-.8.32-.16.214-.24.454-.24.72v.96c0 .266.08.506.24.72.16.213.427.32.8.32.373 0 .64-.107.8-.32.16-.214.24-.454.24-.72v-.96c0-.266-.08-.506-.24-.72-.16-.213-.427-.32-.8-.32zm5.334 0c-.374 0-.64.107-.8.32-.16.214-.24.454-.24.72v.96c0 .266.08.506.24.72.16.213.426.32.8.32.373 0 .64-.107.8-.32.16-.214.24-.454.24-.72v-.96c0-.266-.08-.506-.24-.72-.16-.213-.427-.32-.8-.32z"/>
    </svg>
  )
}

// 社交媒体图标映射
const socialIcons: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  github: Github,
  twitter: Twitter,
  linkedin: Linkedin,
  weibo: () => <span className="text-lg">微博</span>,
  bilibili: BilibiliIcon,
  zhihu: () => <span className="text-lg">知</span>,
  douyin: () => <span className="text-lg">抖</span>,
  wechat: () => <span className="text-lg">微</span>,
  email: Mail,
  website: LinkIcon
}

export function HeroSection({ profile, showResume = false, onToggleResume, onOpenCardModal, isEditMode = false, onUpdateProfile, mode = 'preview', onModeChange, onDownloadPDF, canUndo, canRedo, onUndo, onRedo, onResetToDefault }: HeroSectionProps) {
  const { themeConfig, currentTheme } = useTheme()
  const containerRef = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // 为极简主题设置专门的头像边框颜色（科技感配色）
  const avatarBorderColor = currentTheme === 'minimal' ? '#0ea5e9' : themeConfig.colors.primary // 极致科幻蓝
  const avatarAccentColor = currentTheme === 'minimal' ? '#3b82f6' : themeConfig.colors.accent // 科技蓝
  const avatarGlowColor = currentTheme === 'minimal' ? '#8b5cf6' : themeConfig.colors.primaryGlow // 霓虹紫
  
  // 处理头像上传
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && onUpdateProfile) {
      const reader = new FileReader()
      reader.onloadend = () => {
        onUpdateProfile('avatar', reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }
  
  // 视差滚动效果 - 仅在桌面端启用
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  })

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.3])
  
  // 移动端使用静态值而非动画值
  const motionTextY = isMobile ? 0 : textY

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-start justify-center overflow-hidden"
      style={{ background: themeConfig.colors.bg, paddingTop: '80px' }}
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

      {/* 模式切换按钮组 - 放置在左上角 */}
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
              <span>主页</span>
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
              <span>简历</span>
            </motion.button>
          </div>

          {/* 移动端编辑模式工具栏 - 仅在编辑模式下显示，位于主页/简历按钮下方 */}
          {mode === 'edit' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="md:hidden mt-2 flex items-center gap-1 px-2 py-1.5 rounded-xl backdrop-blur-md"
              style={{
                backgroundColor: `${themeConfig.colors.surface}80`,
                border: `1px solid ${themeConfig.colors.border}`
              }}
            >
              <button
                onClick={onUndo}
                disabled={!canUndo}
                className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 transition-colors"
                title="撤销"
                style={{ color: themeConfig.colors.text }}
              >
                <Undo2 size={16} />
              </button>
              <button
                onClick={onRedo}
                disabled={!canRedo}
                className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 transition-colors"
                title="重做"
                style={{ color: themeConfig.colors.text }}
              >
                <Redo2 size={16} />
              </button>
              <div className="w-px h-5" style={{ background: themeConfig.colors.border }} />
              <button
                onClick={onResetToDefault}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                title="重置"
                style={{ color: themeConfig.colors.primary }}
              >
                <RotateCcw size={16} />
              </button>
              <div className="w-px h-5" style={{ background: themeConfig.colors.border }} />
              <div className="text-xs font-medium" style={{ color: themeConfig.colors.text }}>
                点击内容编辑
              </div>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* 桌面端操作按钮组 - 放置在右上角，与主页/简历在同一行 */}
      {onToggleResume && !showResume && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="absolute top-6 right-6 z-20 hidden md:flex items-center gap-2"
        >
          {/* 分享、PDF、预览/编辑按钮组合 */}
          <div 
            className="flex items-center p-1 rounded-xl backdrop-blur-md"
            style={{ 
              backgroundColor: `${themeConfig.colors.surface}80`,
              border: `1px solid ${themeConfig.colors.border}`
            }}
          >
            {/* 分享按钮 */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onOpenCardModal}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all opacity-60 hover:opacity-80"
              style={{
                backgroundColor: 'transparent',
                color: themeConfig.colors.text
              }}
              title="分享当前页面"
            >
              <Share2 size={16} />
              <span>分享</span>
            </motion.button>

            {/* PDF下载按钮 - 仅在预览模式下显示 */}
            {mode === 'preview' && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onDownloadPDF}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all opacity-60 hover:opacity-80"
                style={{
                  backgroundColor: 'transparent',
                  color: themeConfig.colors.text
                }}
                title="下载PDF"
              >
                <Download size={16} />
                <span>PDF</span>
              </motion.button>
            )}

            {/* 预览按钮 */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onModeChange?.('preview')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                mode === 'preview' 
                  ? 'shadow-sm' 
                  : 'opacity-60 hover:opacity-80'
              }`}
              style={{
                backgroundColor: mode === 'preview' ? `${themeConfig.colors.bg}90` : 'transparent',
                color: themeConfig.colors.text
              }}
            >
              <Eye size={16} />
              <span>预览</span>
            </motion.button>

            {/* 编辑按钮 */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onModeChange?.('edit')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                mode === 'edit' 
                  ? 'shadow-sm' 
                  : 'opacity-60 hover:opacity-80'
              }`}
              style={{
                backgroundColor: mode === 'edit' ? `${themeConfig.colors.bg}90` : 'transparent',
                color: themeConfig.colors.text
              }}
            >
              <Edit3 size={16} />
              <span>编辑</span>
            </motion.button>
          </div>

          {/* 编辑模式工具栏 - 仅在编辑模式下显示 */}
          {mode === 'edit' && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 px-3 py-2 rounded-xl backdrop-blur-md"
              style={{
                backgroundColor: `${themeConfig.colors.surface}80`,
                border: `1px solid ${themeConfig.colors.border}`
              }}
            >
              <button
                onClick={onUndo}
                disabled={!canUndo}
                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 transition-colors"
                title="撤销"
                style={{ color: themeConfig.colors.text }}
              >
                <Undo2 size={18} />
              </button>
              <button
                onClick={onRedo}
                disabled={!canRedo}
                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 transition-colors"
                title="重做"
                style={{ color: themeConfig.colors.text }}
              >
                <Redo2 size={18} />
              </button>
              <div className="w-px h-6" style={{ background: themeConfig.colors.border }} />
              <button
                onClick={onResetToDefault}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                title="重置"
                style={{ color: themeConfig.colors.primary }}
              >
                <RotateCcw size={18} />
              </button>
              <div className="w-px h-6" style={{ background: themeConfig.colors.border }} />
              <div className="text-sm font-medium whitespace-nowrap" style={{ color: themeConfig.colors.text }}>
                点击内容编辑
              </div>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* 主要内容 */}
      <motion.div
        className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
        style={{ y: motionTextY, opacity }}
      >
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* 左侧：头像和个人信息 */}
          <div className="flex flex-col items-center lg:items-center lg:pl-12 text-center lg:text-left">
            {/* 头像 */}
            <AnimatedSection delay={0}>
              <Floating amplitude={8} duration={4}>
                <div className="relative group">
                  {/* 核心发光场 */}
                  <motion.div
                    className="absolute inset-0 rounded-full blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: `radial-gradient(circle, ${avatarBorderColor} 0%, transparent 70%)`,
                      transform: 'scale(1.4)'
                    }}
                    animate={isMobile ? undefined : { scale: [1.3, 1.5, 1.3], opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  
                  {/* 外层：数据流动轨道 */}
                  <motion.div
                    className="absolute -inset-6 rounded-full border opacity-40 z-0"
                    style={{ 
                      borderColor: avatarAccentColor,
                      borderWidth: '1.5px',
                      borderStyle: 'dashed'
                    }}
                    animate={isMobile ? undefined : { rotate: 360 }}
                    transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                  />

                  {/* 中层：科技感刻度环 */}
                  <motion.div
                    className="absolute -inset-3 rounded-full border-t-2 border-r-2 border-l-2 border-transparent"
                    style={{ 
                      borderTopColor: avatarBorderColor,
                      borderRightColor: `${avatarBorderColor}40`,
                      borderLeftColor: `${avatarBorderColor}40`,
                      opacity: 0.9
                    }}
                    animate={isMobile ? undefined : { rotate: -360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                  />

                  {/* 中层：反向点阵环 */}
                  <motion.div
                    className="absolute -inset-3 rounded-full border-b-2 border-transparent"
                    style={{ 
                      borderBottomColor: avatarAccentColor,
                      borderBottomStyle: 'dotted',
                      opacity: 0.8
                    }}
                    animate={isMobile ? undefined : { rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                  />

                  {/* 内层：渐变流光边框 */}
                  <div className="absolute -inset-1 rounded-full p-[2px] z-10"
                       style={{
                         background: `linear-gradient(135deg, ${avatarBorderColor}, transparent, ${avatarAccentColor}, transparent)`
                       }}
                  >
                    <div
                      className="w-full h-full rounded-full"
                      style={{ background: themeConfig.colors.bg }}
                    />
                  </div>
                  
                  {/* 头像图片容器 */}
                  <div
                    className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden z-20 border-2"
                    style={{
                      borderColor: themeConfig.colors.bg,
                      background: themeConfig.colors.bg,
                      boxShadow: `inset 0 0 30px ${avatarGlowColor}80`
                    }}
                  >
                    {/* 雷达扫描效果遮罩 */}
                    {!isMobile && (
                       <motion.div
                         className="absolute inset-0 pointer-events-none z-30 opacity-20 mix-blend-overlay"
                         style={{
                           background: `conic-gradient(from 0deg, transparent 70%, ${avatarBorderColor} 90%, ${avatarAccentColor} 100%)`
                         }}
                         animate={{ rotate: 360 }}
                         transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                       />
                    )}
                    <motion.img
                      src={profile.avatar}
                      alt={profile.name}
                      className="w-full h-full object-cover rounded-full relative z-20"
                      whileHover={{ scale: 1.08 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                    />
                    {/* 编辑模式下的上传按钮 */}
                    {isEditMode && (
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute inset-0 z-40 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center"
                        title="更换头像"
                      >
                        <Upload size={24} className="text-white" />
                      </button>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                  </div>
                  
                  {/* 悬浮能量核心（动态光点） */}
                  {!isMobile && (
                    <>
                      <motion.div
                        className="absolute w-2.5 h-2.5 rounded-full z-30"
                        style={{
                          background: avatarBorderColor,
                          top: '-10%', left: '70%',
                          boxShadow: `0 0 10px ${avatarBorderColor}, 0 0 20px ${avatarBorderColor}`
                        }}
                        animate={{ 
                          y: [-8, 8, -8], 
                          scale: [1, 1.2, 1], 
                          opacity: [0.6, 1, 0.6] 
                        }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                      />
                      <motion.div
                        className="absolute w-1.5 h-1.5 rounded-full z-30"
                        style={{
                          background: avatarAccentColor,
                          bottom: '-5%', right: '80%',
                          boxShadow: `0 0 8px ${avatarAccentColor}, 0 0 15px ${avatarAccentColor}`
                        }}
                        animate={{ 
                          y: [8, -8, 8], 
                          scale: [1, 1.5, 1], 
                          opacity: [0.5, 1, 0.5] 
                        }}
                        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                      />
                    </>
                  )}
                </div>
              </Floating>
            </AnimatedSection>

            {/* 姓名 */}
            <AnimatedSection delay={0.1} className="mt-8">
              {isEditMode && onUpdateProfile ? (
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => onUpdateProfile('name', e.target.value)}
                  className="text-3xl sm:text-4xl lg:text-5xl font-bold w-full text-center lg:text-left px-2 py-1 rounded border-2 border-primary/30 bg-primary/5"
                  style={{ color: themeConfig.colors.text }}
                />
              ) : (
                <h1
                  className="text-3xl sm:text-4xl lg:text-5xl font-bold gradient-text-dynamic"
                  style={{
                    backgroundImage: currentTheme === 'minimal'
                      ? `linear-gradient(135deg, #0ea5e9 0%, #3b82f6 50%, #8b5cf6 100%)`
                      : `linear-gradient(135deg, ${themeConfig.colors.text} 0%, ${themeConfig.colors.primary} 100%)`,
                    backgroundSize: '100% 100%'
                  }}
                >
                  {profile.name}
                </h1>
              )}
            </AnimatedSection>

            {/* 职业标签 */}
            <AnimatedSection delay={0.2}>
              {isEditMode && onUpdateProfile ? (
                <input
                  type="text"
                  value={profile.title}
                  onChange={(e) => onUpdateProfile('title', e.target.value)}
                  className="mt-3 text-lg sm:text-xl w-full text-center lg:text-left px-2 py-1 rounded border border-primary/30 bg-primary/5"
                  style={{ color: themeConfig.colors.textSecondary }}
                />
              ) : (
                <p
                  className="mt-3 text-lg sm:text-xl"
                  style={{ color: themeConfig.colors.textSecondary }}
                >
                  {profile.title}
                </p>
              )}
            </AnimatedSection>

            {/* 位置和邮箱 */}
            <AnimatedSection delay={0.3}>
              <div className="mt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-sm" style={{ color: themeConfig.colors.textMuted }}>
                {isEditMode && onUpdateProfile ? (
                  <>
                    <span className="flex items-center gap-1.5">
                      <MapPin size={16} />
                      <input
                        type="text"
                        value={profile.location}
                        onChange={(e) => onUpdateProfile('location', e.target.value)}
                        className="px-2 py-1 rounded border border-primary/30 bg-primary/5 min-w-[150px]"
                        style={{ color: themeConfig.colors.textMuted }}
                      />
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Mail size={16} />
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => onUpdateProfile('email', e.target.value)}
                        className="px-2 py-1 rounded border border-primary/30 bg-primary/5 min-w-[180px]"
                        style={{ color: themeConfig.colors.textMuted }}
                      />
                    </span>
                  </>
                ) : (
                  <>
                    <span className="flex items-center gap-1.5">
                      <MapPin size={16} />
                      {profile.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Mail size={16} />
                      {profile.email}
                    </span>
                  </>
                )}
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
                {isEditMode && onUpdateProfile ? (
                  <textarea
                    value={profile.bio}
                    onChange={(e) => onUpdateProfile('bio', e.target.value)}
                    rows={4}
                    className="w-full text-base sm:text-lg leading-relaxed px-2 py-1 rounded border border-primary/30 bg-primary/5 resize-none"
                    style={{ color: themeConfig.colors.textSecondary }}
                  />
                ) : (
                  <p
                    className="text-base sm:text-lg leading-relaxed"
                    style={{ color: themeConfig.colors.textSecondary }}
                  >
                    {profile.bio}
                  </p>
                )}
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
                  className="text-sm font-medium mb-3 text-center sm:text-left"
                  style={{ color: themeConfig.colors.textMuted }}
                >
                  荣誉成就
                </h3>
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
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
