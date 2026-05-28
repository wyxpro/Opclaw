import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, MousePointer2, Shield, Bell, Volume2, LogOut, Music, FlaskConical, Info, ChevronRight
} from 'lucide-react'
import { useSettings } from '../../hooks/useSettings'
import { useTheme } from '../../hooks/useTheme'
import { useAuth } from '../../contexts/AuthContext'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  onOpenAbout?: () => void
  onOpenLaboratory?: () => void
}

export function SettingsModal({ isOpen, onClose, onOpenAbout, onOpenLaboratory }: SettingsModalProps) {
  const { 
    cursorEffectEnabled, setCursorEffectEnabled,
    privacyMode, setPrivacyMode,
    notificationsEnabled, setNotificationsEnabled,
    soundEnabled, setSoundEnabled,
    musicPlayerEnabled, setMusicPlayerEnabled
  } = useSettings()
  const { themeConfig } = useTheme()
  const { isAuthenticated, logout } = useAuth()
  
  // 处理退出登录
  const handleLogout = () => {
    logout()
    onClose()
  }

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
      id: 'musicPlayer',
      icon: Music,
      title: '音乐播放器',
      description: '开启/关闭悬浮音乐播放器小组件',
      value: musicPlayerEnabled,
      onChange: setMusicPlayerEnabled,
      type: 'toggle' as const,
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

                    {/* 实验室 - 移动端显示 */}
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        onClose()
                        if (onOpenLaboratory) onOpenLaboratory()
                      }}
                      className="md:hidden w-full flex items-center justify-between p-4 rounded-xl transition-all"
                      style={{
                        background: themeConfig.colors.surface,
                        border: `1px solid ${themeConfig.colors.border}`,
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                          style={{
                            background: 'rgba(139, 92, 246, 0.1)',
                            color: '#8b5cf6',
                          }}
                        >
                          <FlaskConical size={20} />
                        </div>
                        <div className="text-left">
                          <h3 className="font-medium" style={{ color: themeConfig.colors.text }}>实验室</h3>
                          <p className="text-xs mt-0.5" style={{ color: themeConfig.colors.textMuted }}>技术实验与开发计划</p>
                        </div>
                      </div>
                      <ChevronRight size={18} style={{ color: themeConfig.colors.textMuted }} />
                    </motion.button>

                    {/* 关于我们 - 移动端显示 */}
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        onClose()
                        if (onOpenAbout) onOpenAbout()
                      }}
                      className="md:hidden w-full flex items-center justify-between p-4 rounded-xl transition-all"
                      style={{
                        background: themeConfig.colors.surface,
                        border: `1px solid ${themeConfig.colors.border}`,
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                          style={{
                            background: 'rgba(59, 130, 246, 0.1)',
                            color: '#3b82f6',
                          }}
                        >
                          <Info size={20} />
                        </div>
                        <div className="text-left">
                          <h3 className="font-medium" style={{ color: themeConfig.colors.text }}>关于我们</h3>
                          <p className="text-xs mt-0.5" style={{ color: themeConfig.colors.textMuted }}>开发者信息与反馈</p>
                        </div>
                      </div>
                      <ChevronRight size={18} style={{ color: themeConfig.colors.textMuted }} />
                    </motion.button>
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
    </>
  )
}
