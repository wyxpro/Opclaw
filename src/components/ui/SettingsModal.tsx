import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, MousePointer2, Shield, Bell, Volume2, PlayCircle, 
  MessageSquare, Info, ChevronRight 
} from 'lucide-react'
import { useSettings } from '../../hooks/useSettings'
import { useTheme } from '../../hooks/useTheme'
import { useState } from 'react'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { 
    cursorEffectEnabled, setCursorEffectEnabled,
    privacyMode, setPrivacyMode,
    notificationsEnabled, setNotificationsEnabled,
    soundEnabled, setSoundEnabled,
    autoPlayEnabled, setAutoPlayEnabled
  } = useSettings()
  const { themeConfig } = useTheme()
  const [activeModal, setActiveModal] = useState<'feedback' | 'about' | null>(null)

  const toggleSettings = [
    {
      id: 'cursor',
      icon: MousePointer2,
      title: '鼠标特效',
      description: '开启/关闭鼠标跟随特效',
      value: cursorEffectEnabled,
      onChange: setCursorEffectEnabled,
      type: 'toggle' as const,
    },
    {
      id: 'privacy',
      icon: Shield,
      title: '隐私模式',
      description: '隐藏敏感信息，保护个人隐私',
      value: privacyMode,
      onChange: setPrivacyMode,
      type: 'toggle' as const,
    },
    {
      id: 'notifications',
      icon: Bell,
      title: '通知提醒',
      description: '接收新消息和更新提醒',
      value: notificationsEnabled,
      onChange: setNotificationsEnabled,
      type: 'toggle' as const,
    },
    {
      id: 'sound',
      icon: Volume2,
      title: '音效',
      description: '开启/关闭界面音效',
      value: soundEnabled,
      onChange: setSoundEnabled,
      type: 'toggle' as const,
    },
    {
      id: 'autoplay',
      icon: PlayCircle,
      title: '自动播放',
      description: '自动播放媒体和动画内容',
      value: autoPlayEnabled,
      onChange: setAutoPlayEnabled,
      type: 'toggle' as const,
    },
  ]

  const actionSettings = [
    {
      id: 'feedback',
      icon: MessageSquare,
      title: '建议反馈',
      description: '向我们提交您的宝贵建议',
      onClick: () => setActiveModal('feedback'),
    },
    {
      id: 'about',
      icon: Info,
      title: '关于我们',
      description: '了解项目信息和版本详情',
      onClick: () => setActiveModal('about'),
    },
  ]

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none"
            >
              <div 
                className="w-full max-w-md max-h-[85vh] overflow-y-auto rounded-2xl p-6 pointer-events-auto"
                style={{
                  background: themeConfig.glassEffect.background,
                  border: themeConfig.glassEffect.border,
                  backdropFilter: themeConfig.glassEffect.backdropBlur,
                  WebkitBackdropFilter: themeConfig.glassEffect.backdropBlur,
                  boxShadow: themeConfig.shadows.float,
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 
                    className="text-xl font-bold"
                    style={{ color: themeConfig.colors.text }}
                  >
                    系统设置
                  </h2>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-full transition-colors hover:opacity-70"
                    style={{ color: themeConfig.colors.textMuted }}
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* 功能设置 */}
                <div className="mb-6">
                  <h3 
                    className="text-sm font-medium mb-3 px-1"
                    style={{ color: themeConfig.colors.textMuted }}
                  >
                    功能设置
                  </h3>
                  <div className="space-y-3">
                    {toggleSettings.map((setting, index) => (
                      <motion.div
                        key={setting.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center justify-between p-4 rounded-xl"
                        style={{
                          background: themeConfig.colors.surface,
                          border: `1px solid ${themeConfig.colors.border}`,
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center"
                            style={{
                              background: themeConfig.colors.primaryMuted,
                              color: themeConfig.colors.primary,
                            }}
                          >
                            <setting.icon size={20} />
                          </div>
                          <div>
                            <h3 
                              className="font-medium"
                              style={{ color: themeConfig.colors.text }}
                            >
                              {setting.title}
                            </h3>
                            <p 
                              className="text-sm"
                              style={{ color: themeConfig.colors.textMuted }}
                            >
                              {setting.description}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => setting.onChange(!setting.value)}
                          className="relative w-12 h-6 rounded-full transition-colors duration-300"
                          style={{
                            background: setting.value 
                              ? themeConfig.colors.primary 
                              : themeConfig.colors.border,
                          }}
                        >
                          <motion.div
                            animate={{ x: setting.value ? 24 : 2 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
                          />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* 更多选项 */}
                <div className="mb-6">
                  <h3 
                    className="text-sm font-medium mb-3 px-1"
                    style={{ color: themeConfig.colors.textMuted }}
                  >
                    更多选项
                  </h3>
                  <div className="space-y-3">
                    {actionSettings.map((setting, index) => (
                      <motion.button
                        key={setting.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (toggleSettings.length + index) * 0.05 }}
                        onClick={setting.onClick}
                        className="w-full flex items-center justify-between p-4 rounded-xl text-left"
                        style={{
                          background: themeConfig.colors.surface,
                          border: `1px solid ${themeConfig.colors.border}`,
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center"
                            style={{
                              background: themeConfig.colors.primaryMuted,
                              color: themeConfig.colors.primary,
                            }}
                          >
                            <setting.icon size={20} />
                          </div>
                          <div>
                            <h3 
                              className="font-medium"
                              style={{ color: themeConfig.colors.text }}
                            >
                              {setting.title}
                            </h3>
                            <p 
                              className="text-sm"
                              style={{ color: themeConfig.colors.textMuted }}
                            >
                              {setting.description}
                            </p>
                          </div>
                        </div>
                        <ChevronRight size={20} style={{ color: themeConfig.colors.textMuted }} />
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="pt-4 border-t" style={{ borderColor: themeConfig.colors.border }}>
                  <button
                    onClick={onClose}
                    className="w-full py-3 rounded-xl font-medium transition-all"
                    style={{
                      background: themeConfig.colors.primary,
                      color: '#fff',
                    }}
                  >
                    完成
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Feedback Modal */}
      <FeedbackModal 
        isOpen={activeModal === 'feedback'} 
        onClose={() => setActiveModal(null)} 
      />

      {/* About Modal */}
      <AboutModal 
        isOpen={activeModal === 'about'} 
        onClose={() => setActiveModal(null)} 
      />
    </>
  )
}

// 建议反馈弹窗
function FeedbackModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { themeConfig } = useTheme()
  const [feedback, setFeedback] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    if (!feedback.trim()) return
    // 这里可以添加实际的提交逻辑
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFeedback('')
      onClose()
    }, 1500)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[102]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[103] flex items-center justify-center p-4 pointer-events-none"
          >
            <div 
              className="w-full max-w-md rounded-2xl p-6 pointer-events-auto"
              style={{
                background: themeConfig.glassEffect.background,
                border: themeConfig.glassEffect.border,
                backdropFilter: themeConfig.glassEffect.backdropBlur,
                WebkitBackdropFilter: themeConfig.glassEffect.backdropBlur,
                boxShadow: themeConfig.shadows.float,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 
                  className="text-xl font-bold"
                  style={{ color: themeConfig.colors.text }}
                >
                  建议反馈
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full transition-colors hover:opacity-70"
                  style={{ color: themeConfig.colors.textMuted }}
                >
                  <X size={20} />
                </button>
              </div>

              {submitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div 
                    className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                    style={{ background: themeConfig.colors.primaryMuted }}
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    >
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={themeConfig.colors.primary} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </motion.div>
                  </div>
                  <p style={{ color: themeConfig.colors.text }}>感谢您的反馈！</p>
                  <p className="text-sm mt-1" style={{ color: themeConfig.colors.textMuted }}>我们会认真阅读每一条建议</p>
                </motion.div>
              ) : (
                <>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="请输入您的建议或反馈..."
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl resize-none mb-4"
                    style={{
                      background: themeConfig.colors.bg,
                      border: `1px solid ${themeConfig.colors.border}`,
                      color: themeConfig.colors.text,
                    }}
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={onClose}
                      className="flex-1 py-3 rounded-xl font-medium transition-all"
                      style={{
                        background: themeConfig.colors.surface,
                        border: `1px solid ${themeConfig.colors.border}`,
                        color: themeConfig.colors.text,
                      }}
                    >
                      取消
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={!feedback.trim()}
                      className="flex-1 py-3 rounded-xl font-medium transition-all disabled:opacity-50"
                      style={{
                        background: themeConfig.colors.primary,
                        color: '#fff',
                      }}
                    >
                      提交
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// 关于我们弹窗
function AboutModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { themeConfig } = useTheme()

  const features = [
    { label: '版本', value: 'v1.0.0' },
    { label: '开发者', value: '小叶团队' },
    { label: '技术栈', value: 'React + TypeScript + Tailwind' },
    { label: '更新日期', value: '2026年2月' },
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[102]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[103] flex items-center justify-center p-4 pointer-events-none"
          >
            <div 
              className="w-full max-w-md rounded-2xl p-6 pointer-events-auto"
              style={{
                background: themeConfig.glassEffect.background,
                border: themeConfig.glassEffect.border,
                backdropFilter: themeConfig.glassEffect.backdropBlur,
                WebkitBackdropFilter: themeConfig.glassEffect.backdropBlur,
                boxShadow: themeConfig.shadows.float,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 
                  className="text-xl font-bold"
                  style={{ color: themeConfig.colors.text }}
                >
                  关于我们
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full transition-colors hover:opacity-70"
                  style={{ color: themeConfig.colors.textMuted }}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="text-center mb-6">
                <div 
                  className="w-20 h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center text-3xl font-bold"
                  style={{ 
                    background: themeConfig.colors.primaryMuted,
                    color: themeConfig.colors.primary,
                  }}
                >
                  叶
                </div>
                <h3 
                  className="text-lg font-bold mb-1"
                  style={{ color: themeConfig.colors.text }}
                >
                  小叶的个人空间
                </h3>
                <p 
                  className="text-sm"
                  style={{ color: themeConfig.colors.textMuted }}
                >
                  记录生活，分享成长
                </p>
              </div>

              <div className="space-y-3 mb-6">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between py-3 px-4 rounded-xl"
                    style={{
                      background: themeConfig.colors.surface,
                      border: `1px solid ${themeConfig.colors.border}`,
                    }}
                  >
                    <span style={{ color: themeConfig.colors.textMuted }}>{feature.label}</span>
                    <span 
                      className="font-medium"
                      style={{ color: themeConfig.colors.text }}
                    >
                      {feature.value}
                    </span>
                  </motion.div>
                ))}
              </div>

              <button
                onClick={onClose}
                className="w-full py-3 rounded-xl font-medium transition-all"
                style={{
                  background: themeConfig.colors.primary,
                  color: '#fff',
                }}
              >
                知道了
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
