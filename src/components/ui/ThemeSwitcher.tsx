import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Palette, X, Check, Sun, Moon, Sparkles, Flower2, Scroll } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'
import { themeList, type ThemeType } from '../../lib/themes'

// Theme icon mapping with Lucide icons
const themeIcons: Record<string, typeof Sun> = {
  minimal: Sun,
  cyber: Moon,
  artistic: Sparkles,
  cartoon: Flower2,
  retro: Scroll,
}

export default function ThemeSwitcher() {
  const { currentTheme, setTheme, themeConfig } = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  const handleThemeChange = (themeId: ThemeType) => {
    setTheme(themeId)
    setIsOpen(false)
  }

  return (
    <div className="fixed top-4 right-4 z-[100]">
      {/* Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-2 px-3 py-2 rounded-full glass-card text-sm font-medium transition-all duration-300"
        style={{
          background: themeConfig.glassEffect.background,
          border: themeConfig.glassEffect.border,
          color: themeConfig.colors.text,
          boxShadow: themeConfig.shadows.card,
        }}
      >
        <span className="text-lg">{themeConfig.icon}</span>
        <span className="hidden sm:inline">{themeConfig.name}</span>
        <Palette size={16} className="opacity-70" />
      </motion.button>

      {/* Theme Selector Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[99]"
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full right-0 mt-2 w-72 rounded-2xl p-4 z-[101]"
              style={{
                background: themeConfig.glassEffect.background,
                border: themeConfig.glassEffect.border,
                backdropFilter: themeConfig.glassEffect.backdropBlur,
                WebkitBackdropFilter: themeConfig.glassEffect.backdropBlur,
                boxShadow: themeConfig.shadows.float,
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 
                  className="text-sm font-semibold"
                  style={{ color: themeConfig.colors.text }}
                >
                  选择主题风格
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-full transition-colors hover:opacity-70"
                  style={{ color: themeConfig.colors.textMuted }}
                >
                  <X size={16} />
                </button>
              </div>

              {/* Theme Options */}
              <div className="space-y-2">
                {themeList.map((theme) => {
                  const ThemeIcon = themeIcons[theme.id]
                  const isActive = currentTheme === theme.id
                  return (
                    <motion.button
                      key={theme.id}
                      onClick={() => handleThemeChange(theme.id)}
                      whileHover={{ x: 2 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200"
                      style={{
                        background: isActive 
                          ? themeConfig.colors.primaryMuted 
                          : 'transparent',
                        border: `1px solid ${isActive 
                          ? themeConfig.colors.primary 
                          : 'transparent'}`,
                      }}
                    >
                      {/* Theme Preview Icon */}
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300"
                        style={{
                          background: isActive 
                            ? theme.colors.primaryMuted 
                            : theme.colors.surface,
                          border: `2px solid ${isActive 
                            ? theme.colors.primary 
                            : theme.colors.border}`,
                          color: theme.colors.primary,
                          borderRadius: theme.id === 'cartoon' ? '20px' : 
                                       theme.id === 'artistic' ? '16px' : 
                                       theme.id === 'retro' ? '4px' : '10px',
                        }}
                      >
                        <ThemeIcon size={20} />
                      </div>

                      {/* Theme Info */}
                      <div className="flex-1 text-left">
                        <div 
                          className="font-medium text-sm"
                          style={{ color: themeConfig.colors.text }}
                        >
                          {theme.name}
                        </div>
                        <div 
                          className="text-xs mt-0.5"
                          style={{ color: themeConfig.colors.textMuted }}
                        >
                          {theme.description}
                        </div>
                      </div>

                      {/* Check Icon */}
                      {isActive && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="flex items-center justify-center w-5 h-5 rounded-full"
                          style={{
                            background: themeConfig.colors.primary,
                            color: '#fff',
                          }}
                        >
                          <Check size={12} />
                        </motion.div>
                      )}
                    </motion.button>
                  )
                })}
              </div>

              {/* Keyboard Shortcut Hint */}
              <div 
                className="mt-4 pt-3 text-xs text-center border-t"
                style={{ 
                  color: themeConfig.colors.textMuted,
                  borderColor: themeConfig.colors.border 
                }}
              >
                快捷键：Shift + Q 切换主题
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
