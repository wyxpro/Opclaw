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
  compact?: boolean
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
  themeConfig,
  compact = false
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
      {/* 桌面端 - 根据 compact 属性选择不同样式 */}
      <div className="hidden md:flex items-center justify-center">
        {compact ? (
          // 紧凑模式：用于顶部导航栏
          <div className="flex items-center" style={{ gap: '4px' }}>
            {steps.map((step) => {
              const status = getStepStatus(step.id)
              const isClickable = canNavigateTo(steps.findIndex(s => s.id === step.id))

              return (
                <motion.button
                  key={step.id}
                  onClick={() => isClickable && onStepChange(step.id)}
                  disabled={!isClickable}
                  whileHover={isClickable ? { scale: 1.05 } : {}}
                  whileTap={isClickable ? { scale: 0.95 } : {}}
                  className={`flex items-center gap-1 px-1.5 py-1 rounded transition-all ${
                    !isClickable ? 'cursor-not-allowed' : 'cursor-pointer'
                  }`}
                >
                  <div
                    className="flex items-center justify-center w-5 h-5 rounded-full transition-all"
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
                        : themeConfig.colors.textMuted
                    }}
                  >
                    {status === 'completed' ? (
                      <Check size={10} />
                    ) : (
                      <span style={{ fontSize: '10px' }}>{step.icon}</span>
                    )}
                  </div>
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
              )
            })}
          </div>
        ) : (
          // 完整模式：带连接线的横向布局
          <div className="flex items-center justify-center" style={{ gap: '0' }}>
            {steps.map((step, index) => {
              const status = getStepStatus(step.id)
              const isClickable = canNavigateTo(index)
              const isLast = index === steps.length - 1
              const isLineVisible = index < currentIndex

              return (
                <div key={step.id} className="flex items-center">
                  <motion.button
                    onClick={() => isClickable && onStepChange(step.id)}
                    disabled={!isClickable}
                    whileHover={isClickable ? { scale: 1.05 } : {}}
                    whileTap={isClickable ? { scale: 0.95 } : {}}
                    className={`relative flex flex-col items-center gap-0.5 transition-all duration-300 ${
                      !isClickable ? 'cursor-not-allowed' : 'cursor-pointer'
                    }`}
                    style={{ minWidth: '90px' }}
                  >
                    <motion.div
                      className="relative flex items-center justify-center w-9 h-9 rounded-full transition-all duration-300"
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
                        <Check size={16} />
                      ) : (
                        step.icon
                      )}
                    </motion.div>
                    <span 
                      className="text-xs font-medium whitespace-nowrap transition-colors duration-300 mt-0.5"
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
                  {!isLast && (
                    <div className="w-14 h-0.5 relative mx-1.5">
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
        )}
      </div>

      {/* 移动端 - 紧凑横向布局（带连接线） */}
      <div className="md:hidden flex items-center justify-center py-2" style={{ gap: '0' }}>
        {steps.map((step, index) => {
          const status = getStepStatus(step.id)
          const isLast = index === steps.length - 1
          const isLineVisible = index < currentIndex

          return (
            <div key={step.id} className="flex items-center">
              <motion.button
                onClick={() => onStepChange(step.id)}
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center gap-1 transition-all cursor-pointer"
              >
                <div
                  className="flex items-center justify-center w-8 h-8 rounded-full transition-all"
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
                  {status === 'completed' ? (
                    <Check size={14} />
                  ) : (
                    <span style={{ fontSize: '12px' }}>{step.icon}</span>
                  )}
                </div>
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
              {!isLast && (
                <div className="w-10 h-0.5 relative mx-1">
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
  )
}
