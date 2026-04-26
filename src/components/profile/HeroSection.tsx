import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import { MapPin, Mail, Link as LinkIcon, Github, Twitter, Linkedin, FileText, Home as HomeIcon, Share2, Upload, Eye, Edit3, Download, Undo2, Redo2, RotateCcw } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'
import type { PersonalProfile } from '../../types/profile'
import { AnimatedSection, Floating } from './AnimatedSection'
import { EditableWrapper } from '../ui/EditableWrapper'

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

// 官方图标组件
function QQIcon({ size = 18, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M21.395 15.035a40 40 0 0 0-.803-2.264l-1.079-2.695c.001-.032.014-.562.014-.836C19.526 4.632 17.351 0 12 0S4.474 4.632 4.474 9.241c0 .274.013.804.014.836l-1.08 2.695a39 39 0 0 0-.802 2.264c-1.021 3.283-.69 4.643-.438 4.673.54.065 2.103-2.472 2.103-2.472 0 1.469.756 3.387 2.394 4.771-.612.188-1.363.479-1.845.835-.434.32-.379.646-.301.778.343.578 5.883.369 7.482.189 1.6.18 7.14.389 7.483-.189.078-.132.132-.458-.301-.778-.483-.356-1.233-.646-1.846-.836 1.637-1.384 2.393-3.302 2.393-4.771 0 0 1.563 2.537 2.103 2.472.251-.03.581-1.39-.438-4.673"/>
    </svg>
  )
}

function WeChatIcon({ size = 18, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89c-.135-.01-.27-.027-.407-.03zm-2.53 3.274c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.969-.982z"/>
    </svg>
  )
}

function DouyinIcon({ size = 18, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
    </svg>
  )
}

function XiaohongshuIcon({ size = 18, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M22.405 9.879c.002.016.01.02.07.019h.725a.797.797 0 0 0 .78-.972.794.794 0 0 0-.884-.618.795.795 0 0 0-.692.794c0 .101-.002.666.001.777zm-11.509 4.808c-.203.001-1.353.004-1.685.003a2.528 2.528 0 0 1-.766-.126.025.025 0 0 0-.03.014L7.7 16.127a.025.025 0 0 0 .01.032c.111.06.336.124.495.124.66.01 1.32.002 1.981 0 .01 0 .02-.006.023-.015l.712-1.545a.025.025 0 0 0-.024-.036zM.477 9.91c-.071 0-.076.002-.076.01a.834.834 0 0 0-.01.08c-.027.397-.038.495-.234 3.06-.012.24-.034.389-.135.607-.026.057-.033.042.003.112.046.092.681 1.523.787 1.74.008.015.011.02.017.02.008 0 .033-.026.047-.044.147-.187.268-.391.371-.606.306-.635.44-1.325.486-1.706.014-.11.021-.22.03-.33l.204-2.616.022-.293c.003-.029 0-.033-.03-.034zm7.203 3.757a1.427 1.427 0 0 1-.135-.607c-.004-.084-.031-.39-.235-3.06a.443.443 0 0 0-.01-.082c-.004-.011-.052-.008-.076-.008h-1.48c-.03.001-.034.005-.03.034l.021.293c.076.982.153 1.964.233 2.946.05.4.186 1.085.487 1.706.103.215.223.419.37.606.015.018.037.051.048.049.02-.003.742-1.642.804-1.765.036-.07.03-.055.003-.112zm3.861-.913h-.872a.126.126 0 0 1-.116-.178l1.178-2.625a.025.025 0 0 0-.023-.035l-1.318-.003a.148.148 0 0 1-.135-.21l.876-1.954a.025.025 0 0 0-.023-.035h-1.56c-.01 0-.02.006-.024.015l-.926 2.068c-.085.169-.314.634-.399.938a.534.534 0 0 0-.02.191.46.46 0 0 0 .23.378.981.981 0 0 0 .46.119h.59c.041 0-.688 1.482-.834 1.972a.53.53 0 0 0-.023.172.465.465 0 0 0 .23.398c.15.092.342.12.475.12l1.66-.001c.01 0 .02-.006.023-.015l.575-1.28a.025.025 0 0 0-.024-.035zm-6.93-4.937H3.1a.032.032 0 0 0-.034.033c0 1.048-.01 2.795-.01 6.829 0 .288-.269.262-.28.262h-.74c-.04.001-.044.004-.04.047.001.037.465 1.064.555 1.263.01.02.03.033.051.033.157.003.767.009.938-.014.153-.02.3-.06.438-.132.3-.156.49-.419.595-.765.052-.172.075-.353.075-.533.002-2.33 0-4.66-.007-6.991a.032.032 0 0 0-.032-.032zm11.784 6.896c0-.014-.01-.021-.024-.022h-1.465c-.048-.001-.049-.002-.05-.049v-4.66c0-.072-.005-.07.07-.07h.863c.08 0 .075.004.075-.074V8.393c0-.082.006-.076-.08-.076h-3.5c-.064 0-.075-.006-.075.073v1.445c0 .083-.006.077.08.077h.854c.075 0 .07-.004.07.07v4.624c0 .095.008.084-.085.084-.37 0-1.11-.002-1.304 0-.048.001-.06.03-.06.03l-.697 1.519s-.014.025-.008.036c.006.01.013.008.058.008 1.748.003 3.495.002 5.243.002.03-.001.034-.006.035-.033v-1.539zm4.177-3.43c0 .013-.007.023-.02.024-.346.006-.692.004-1.037.004-.014-.002-.022-.01-.022-.024-.005-.434-.007-.869-.01-1.303 0-.072-.006-.071.07-.07l.733-.003c.041 0 .081.002.12.015.093.025.16.107.165.204.006.431.002 1.153.001 1.153zm2.67.244a1.953 1.953 0 0 0-.883-.222h-.18c-.04-.001-.04-.003-.042-.04V10.21c0-.132-.007-.263-.025-.394a1.823 1.823 0 0 0-.153-.53 1.533 1.533 0 0 0-.677-.71 2.167 2.167 0 0 0-1-.258c-.153-.003-.567 0-.72 0-.07 0-.068.004-.068-.065V7.76c0-.031-.01-.041-.046-.039H17.93s-.016 0-.023.007c-.006.006-.008.012-.008.023v.546c-.008.036-.057.015-.082.022h-.95c-.022.002-.028.008-.03.032v1.481c0 .09-.004.082.082.082h.913c.082 0 .072.128.072.128V11.19s.003.117-.06.117h-1.482c-.068 0-.06.082-.06.082v1.445s-.01.068.064.068h1.457c.082 0 .076-.006.076.079v3.225c0 .088-.007.081.082.081h1.43c.09 0 .082.007.082-.08v-3.27c0-.029.006-.035.033-.035l2.323-.003c.098 0 .191.02.28.061a.46.46 0 0 1 .274.407c.008.395.003.79.003 1.185 0 .259-.107.367-.33.367h-1.218c-.023.002-.029.008-.028.033.184.437.374.871.57 1.303a.045.045 0 0 0 .04.026c.17.005.34.002.51.003.15-.002.517.004.666-.01a2.03 2.03 0 0 0 .408-.075c.59-.18.975-.698.976-1.313v-1.981c0-.128-.01-.254-.034-.38 0 .078-.029-.641-.724-.998z"/>
    </svg>
  )
}

function WeiboIcon({ size = 18, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M10.098 20.323c-3.977.391-7.414-1.406-7.672-4.02-.259-2.609 2.759-5.047 6.74-5.441 3.979-.394 7.413 1.404 7.671 4.018.259 2.6-2.759 5.049-6.737 5.439l-.002.004zM9.05 17.219c-.384.616-1.208.884-1.829.602-.612-.279-.793-.991-.406-1.593.379-.595 1.176-.861 1.793-.601.622.263.82.972.442 1.592zm1.27-1.627c-.141.237-.449.353-.689.253-.236-.09-.313-.361-.177-.586.138-.227.436-.346.672-.24.239.09.315.36.18.601l.014-.028zm.176-2.719c-1.893-.493-4.033.45-4.857 2.118-.836 1.704-.026 3.591 1.886 4.21 1.983.64 4.318-.341 5.132-2.179.8-1.793-.201-3.642-2.161-4.149zm7.563-1.224c-.346-.105-.57-.18-.405-.615.375-.977.42-1.804 0-2.404-.781-1.112-2.915-1.053-5.364-.03 0 0-.766.331-.571-.271.376-1.217.315-2.224-.27-2.809-1.338-1.337-4.869.045-7.888 3.08C1.309 10.87 0 13.273 0 15.348c0 3.981 5.099 6.395 10.086 6.395 6.536 0 10.888-3.801 10.888-6.82 0-1.822-1.547-2.854-2.915-3.284v.01zm1.908-5.092c-.766-.856-1.908-1.187-2.96-.962-.436.09-.706.511-.616.932.09.42.511.691.932.602.511-.105 1.067.044 1.442.465.376.421.466.977.316 1.473-.136.406.089.856.51.992.405.119.857-.105.992-.512.33-1.021.12-2.178-.646-3.035l.03.045zm2.418-2.195c-1.576-1.757-3.905-2.419-6.054-1.968-.496.104-.812.587-.706 1.081.104.496.586.813 1.082.707 1.532-.331 3.185.15 4.296 1.383 1.112 1.246 1.429 2.943.947 4.416-.165.48.106 1.007.586 1.157.479.165.991-.104 1.157-.586.675-2.088.241-4.478-1.338-6.235l.03.045z"/>
    </svg>
  )
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

// 社交媒体图标映射及品牌色
const socialIcons: Record<string, { icon: React.ComponentType<{ size?: number; className?: string }>; color?: string }> = {
  github: { icon: Github, color: '#333333' },
  twitter: { icon: Twitter, color: '#1DA1F2' },
  linkedin: { icon: Linkedin, color: '#0A66C2' },
  weibo: { icon: WeiboIcon, color: '#E6162D' },
  bilibili: { icon: BilibiliIcon, color: '#FB7299' },
  zhihu: { icon: () => <span className="text-lg">知</span>, color: '#0066FF' },
  douyin: { icon: DouyinIcon, color: '#000000' },
  wechat: { icon: WeChatIcon, color: '#07C160' },
  qq: { icon: QQIcon, color: '#12B7F5' },
  xiaohongshu: { icon: XiaohongshuIcon, color: '#FF2442' },
  email: { icon: Mail, color: '#EA4335' },
  website: { icon: LinkIcon, color: '#4F46E5' }
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
                    <EditableWrapper
                      value={profile.avatar}
                      onSave={(val) => onUpdateProfile?.('avatar', val)}
                      type="image"
                      isEditMode={isEditMode}
                      label="更换头像"
                      className="w-full h-full"
                    >
                      <motion.img
                        src={profile.avatar}
                        alt={profile.name}
                        className="w-full h-full object-cover rounded-full relative z-20"
                        whileHover={{ scale: 1.08 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                      />
                    </EditableWrapper>
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

            <AnimatedSection delay={0.1} className="mt-8">
              <EditableWrapper
                value={profile.name}
                onSave={(val) => onUpdateProfile?.('name', val)}
                isEditMode={isEditMode}
                label="姓名"
              >
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
              </EditableWrapper>
            </AnimatedSection>

            {/* 职业标签 */}
            <AnimatedSection delay={0.2}>
              <EditableWrapper
                value={profile.title}
                onSave={(val) => onUpdateProfile?.('title', val)}
                isEditMode={isEditMode}
                label="职位"
              >
                <p
                  className="mt-3 text-lg sm:text-xl"
                  style={{ color: themeConfig.colors.textSecondary }}
                >
                  {profile.title}
                </p>
              </EditableWrapper>
            </AnimatedSection>

            {/* 位置和邮箱 */}
            <AnimatedSection delay={0.3}>
              <div className="mt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-sm" style={{ color: themeConfig.colors.textMuted }}>
                <EditableWrapper
                  value={profile.location}
                  onSave={(val) => onUpdateProfile?.('location', val)}
                  isEditMode={isEditMode}
                  label="地点"
                >
                  <span className="flex items-center gap-1.5">
                    <MapPin size={16} />
                    {profile.location}
                  </span>
                </EditableWrapper>
                <EditableWrapper
                  value={profile.email}
                  onSave={(val) => onUpdateProfile?.('email', val)}
                  isEditMode={isEditMode}
                  label="邮箱"
                >
                  <span className="flex items-center gap-1.5">
                    <Mail size={16} />
                    {profile.email}
                  </span>
                </EditableWrapper>
              </div>
            </AnimatedSection>

            {/* 社交链接 */}
            <AnimatedSection delay={0.4}>
              <div className="mt-6 flex items-center gap-3">
                {profile.socialLinks.map((social, index) => {
                  const socialConfig = socialIcons[social.platform] || { icon: LinkIcon, color: themeConfig.colors.primary }
                  const PlatformIcon = socialConfig.icon
                  const brandColor = socialConfig.color
                  return (
                    <EditableWrapper
                      key={social.platform}
                      value={social.url}
                      onSave={(val) => {
                        const newLinks = [...profile.socialLinks]
                        newLinks[index] = { ...newLinks[index], url: val as string }
                        onUpdateProfile?.('socialLinks', newLinks)
                      }}
                      type="link"
                      isEditMode={isEditMode}
                      label={`${social.displayName} 链接`}
                      position="top-right"
                    >
                      <EditableWrapper
                        value={social.icon || ''}
                        onSave={(val) => {
                          const newLinks = [...profile.socialLinks]
                          newLinks[index] = { ...newLinks[index], icon: val as string }
                          onUpdateProfile?.('socialLinks', newLinks)
                        }}
                        type="image"
                        isEditMode={isEditMode}
                        label={`${social.displayName} 图标`}
                        position="center"
                      >
                        <motion.a
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group relative p-3 rounded-xl transition-all duration-300 block overflow-hidden"
                          style={{
                            background: social.icon ? themeConfig.colors.surface : brandColor,
                            border: `1px solid ${social.icon ? themeConfig.colors.border : brandColor}`,
                            width: '44px',
                            height: '44px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          whileHover={{
                            scale: 1.1,
                            boxShadow: `0 0 20px ${social.icon ? themeConfig.colors.primary : brandColor}40`
                          }}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 + index * 0.1 }}
                        >
                          <span style={{ color: social.icon ? themeConfig.colors.textMuted : '#ffffff' }}>
                            {social.icon ? (
                              <img 
                                src={social.icon} 
                                alt={social.displayName} 
                                className="w-5 h-5 object-contain"
                              />
                            ) : (
                              <PlatformIcon size={20} className="transition-colors" />
                            )}
                          </span>
                          {/* 悬停提示 */}
                          <div
                            className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-[100]"
                            style={{
                              background: themeConfig.colors.surface,
                              border: `1px solid ${themeConfig.colors.border}`,
                              color: themeConfig.colors.text
                            }}
                          >
                            {social.displayName}
                          </div>
                        </motion.a>
                      </EditableWrapper>
                    </EditableWrapper>
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
                <EditableWrapper
                  value={profile.bio}
                  onSave={(val) => onUpdateProfile?.('bio', val)}
                  type="textarea"
                  isEditMode={isEditMode}
                  label="个人简介"
                >
                  <p
                    className="text-base sm:text-lg leading-relaxed"
                    style={{ color: themeConfig.colors.textSecondary }}
                  >
                    {profile.bio}
                  </p>
                </EditableWrapper>
              </div>
            </AnimatedSection>

            {/* 统计数据 */}
            <AnimatedSection delay={0.4} direction="right">
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
                {(() => {
                  const labels: Record<string, string> = {
                    yearsOfExperience: '年经验',
                    projectsCompleted: '项目完成',
                    happyClients: '满意客户',
                    awards: '获得荣誉'
                  }
                  return Object.entries(profile.stats)
                    .filter(([key]) => labels[key])
                    .map(([key, value], index) => (
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
                        <EditableWrapper
                          value={value}
                          onSave={(val) => {
                            const newStats = { ...profile.stats, [key]: Number(val) }
                            onUpdateProfile?.('stats', newStats)
                          }}
                          type="number"
                          isEditMode={isEditMode}
                          label={labels[key]}
                        >
                          <div
                            className="text-2xl sm:text-3xl font-bold"
                            style={{ color: themeConfig.colors.primary }}
                          >
                            {value}+
                          </div>
                        </EditableWrapper>
                        <div
                          className="text-xs mt-1"
                          style={{ color: themeConfig.colors.textMuted }}
                        >
                          {labels[key]}
                        </div>
                      </motion.div>
                    ))
                })()}
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
                      <EditableWrapper
                        value={achievement.icon}
                        onSave={(val) => {
                          const newAchievements = [...profile.achievements]
                          newAchievements[index] = { ...newAchievements[index], icon: val as string }
                          onUpdateProfile?.('achievements', newAchievements)
                        }}
                        isEditMode={isEditMode}
                        label="编辑图标"
                      >
                        <span>{achievement.icon}</span>
                      </EditableWrapper>
                      <EditableWrapper
                        value={achievement.title}
                        onSave={(val) => {
                          const newAchievements = [...profile.achievements]
                          newAchievements[index] = { ...newAchievements[index], title: val as string }
                          onUpdateProfile?.('achievements', newAchievements)
                        }}
                        isEditMode={isEditMode}
                        label="编辑成就"
                      >
                        <span className="hidden sm:inline">{achievement.title}</span>
                      </EditableWrapper>
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
