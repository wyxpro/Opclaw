import { motion } from 'framer-motion'
import { Mic, UserCircle, MessageCircle, Check } from 'lucide-react'
import type { ThemeConfig } from '../../lib/themes'

export type StepType = 'voice-clone' | 'avatar-clone' | 'chat'

export interface Step {
  id: StepType
  title: string
  icon: React.ReactNode
}

interface StepNavigatorProps {
  currentStep: StepType
  completedSteps: StepType[]
  onStepChange: (step: StepType) => void
  themeConfig: ThemeConfig
}

const steps: Step[] = [
  {
    id: 'voice-clone',
    title: '声音克隆',
    icon: <Mic size={22} />
  },
  {
    id: 'avatar-clone',
    title: '形象复刻',
    icon: <UserCircle size={22} />
  },
  {
    id: 'chat',
    title: '数字人对话',
    icon: <MessageCircle size={22} />
  }
]

export function StepNavigator({ 
  currentStep, 
  completedSteps, 
  onStepChange, 
  themeConfig 
}: StepNavigatorProps) {
  const currentIndex = steps.findIndex(s => s.id === currentStep)

  const getStepStatus = (stepId: StepType) => {
    if (completedSteps.includes(stepId)) return 'completed'
    if (stepId === currentStep) return 'active'
    return 'pending'
  }

  const canNavigateTo = (stepIndex: number) => {
    // 允许跳转到已完成的步骤或当前步骤
    if (stepIndex <= currentIndex) return true
    // 允许按顺序跳转到下一步
    if (stepIndex === currentIndex + 1) return true
    return false
  }

  return (
    <div className="w-full">
      {/* 桌面端横向时间轴 - 紧凑布局 */}
      <div className="hidden md:flex items-center justify-center">
        <div className="flex items-center justify-center" style={{ gap: '0' }}>
          {steps.map((step, index) => {
            const status = getStepStatus(step.id)
            const isClickable = canNavigateTo(index)
            const isLast = index === steps.length - 1
            const isLineVisible = index < currentIndex

            return (
              <div key={step.id} className="flex items-center">
                {/* 步骤按钮 */}
                <motion.button
                  onClick={() => isClickable && onStepChange(step.id)}
                  disabled={!isClickable}
                  whileHover={isClickable ? { scale: 1.05 } : {}}
                  whileTap={isClickable ? { scale: 0.95 } : {}}
                  className={`relative flex flex-col items-center gap-1 transition-all duration-300 ${
                    !isClickable ? 'cursor-not-allowed' : 'cursor-pointer'
                  }`}
                  style={{ minWidth: '100px' }}
                >
                  {/* 图标圆圈 - 更紧凑 */}
                  <motion.div
                    className="relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300"
                    style={{
                      background: status === 'active' 
                        ? themeConfig.colors.primary
                        : status === 'completed'
                        ? themeConfig.colors.emerald
                        : themeConfig.colors.bg,
                      border: `2px solid ${
                        status === 'active' 
                          ? themeConfig.colors.primary 
                          : status === 'completed'
                          ? themeConfig.colors.emerald
                          : themeConfig.colors.border
                      }`,
                      color: status === 'active' || status === 'completed'
                        ? 'white'
                        : themeConfig.colors.textMuted,
                      boxShadow: status === 'active' 
                        ? `0 0 0 3px ${themeConfig.colors.primaryMuted}`
                        : status === 'completed'
                        ? `0 0 0 3px rgba(16, 185, 129, 0.15)`
                        : 'none'
                    }}
                    animate={status === 'active' ? {
                      boxShadow: [
                        `0 0 0 3px ${themeConfig.colors.primaryMuted}`,
                        `0 0 0 6px ${themeConfig.colors.primaryMuted}`,
                        `0 0 0 3px ${themeConfig.colors.primaryMuted}`
                      ]
                    } : {}}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    {status === 'completed' ? (
                      <Check size={18} />
                    ) : (
                      step.icon
                    )}
                  </motion.div>

                  {/* 标题文字 */}
                  <span 
                    className="text-xs font-medium whitespace-nowrap transition-colors duration-300"
                    style={{
                      color: status === 'active' 
                        ? themeConfig.colors.primary 
                        : status === 'completed'
                        ? themeConfig.colors.text
                        : themeConfig.colors.textMuted
                    }}
                  >
                    {step.title}
                  </span>
                </motion.button>

                {/* 连接线 - 只有完成上一步才显示 */}
                {!isLast && (
                  <div className="w-16 h-0.5 relative mx-2">
                    {/* 背景线（未完成时显示） */}
                    <div 
                      className="absolute inset-0 rounded-full transition-opacity duration-300"
                      style={{ 
                        background: themeConfig.colors.border,
                        opacity: isLineVisible ? 0 : 1
                      }}
                    />
                    {/* 完成线（完成上一步后显示） */}
                    <motion.div 
                      className="absolute inset-y-0 left-0 rounded-full"
                      style={{ 
                        background: themeConfig.colors.emerald,
                        opacity: isLineVisible ? 1 : 0
                      }}
                      initial={{ width: '0%' }}
                      animate={{ 
                        width: isLineVisible ? '100%' : '0%',
                        opacity: isLineVisible ? 1 : 0
                      }}
                      transition={{ duration: 0.4, ease: 'easeInOut' }}
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* 移动端纵向时间轴 */}
      <div className="md:hidden px-6 py-3">
        <div className="flex items-center justify-center" style={{ gap: '0' }}>
          {steps.map((step, index) => {
            const status = getStepStatus(step.id)
            const isClickable = canNavigateTo(index)
            const isLast = index === steps.length - 1
            const isLineVisible = index < currentIndex

            return (
              <div key={step.id} className="flex items-center">
                {/* 步骤按钮 */}
                <motion.button
                  onClick={() => isClickable && onStepChange(step.id)}
                  disabled={!isClickable}
                  whileTap={isClickable ? { scale: 0.95 } : {}}
                  className={`flex flex-col items-center gap-1.5 transition-all ${
                    !isClickable ? 'opacity-50' : ''
                  }`}
                  style={{ minWidth: '80px' }}
                >
                  {/* 图标圆圈 */}
                  <div
                    className="flex items-center justify-center w-10 h-10 rounded-full transition-all"
                    style={{
                      background: status === 'active' 
                        ? themeConfig.colors.primary
                        : status === 'completed'
                        ? themeConfig.colors.emerald
                        : themeConfig.colors.bg,
                      border: `2px solid ${
                        status === 'active' 
                          ? themeConfig.colors.primary 
                          : status === 'completed'
                          ? themeConfig.colors.emerald
                          : themeConfig.colors.border
                      }`,
                      color: status === 'active' || status === 'completed'
                        ? 'white'
                        : themeConfig.colors.textMuted,
                      boxShadow: status === 'active' 
                        ? `0 0 0 3px ${themeConfig.colors.primaryMuted}`
                        : 'none'
                    }}
                  >
                    {status === 'completed' ? <Check size={16} /> : step.icon}
                  </div>

                  {/* 标题 */}
                  <span 
                    className="text-xs font-medium whitespace-nowrap"
                    style={{
                      color: status === 'active'
                        ? themeConfig.colors.primary
                        : status === 'completed'
                        ? themeConfig.colors.text
                        : themeConfig.colors.textMuted
                    }}
                  >
                    {step.title}
                  </span>
                </motion.button>

                {/* 连接线 - 只有完成上一步才显示 */}
                {!isLast && (
                  <div className="w-12 h-0.5 relative mx-1">
                    <div 
                      className="absolute inset-0 rounded-full transition-opacity duration-300"
                      style={{ 
                        background: themeConfig.colors.border,
                        opacity: isLineVisible ? 0 : 1
                      }}
                    />
                    <motion.div 
                      className="absolute inset-y-0 left-0 rounded-full"
                      style={{ 
                        background: themeConfig.colors.emerald,
                        opacity: isLineVisible ? 1 : 0
                      }}
                      initial={{ width: '0%' }}
                      animate={{ 
                        width: isLineVisible ? '100%' : '0%',
                        opacity: isLineVisible ? 1 : 0
                      }}
                      transition={{ duration: 0.4, ease: 'easeInOut' }}
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
