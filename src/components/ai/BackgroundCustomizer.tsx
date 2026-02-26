import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Image, Check } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'
import type { BackgroundType, BackgroundOption } from './types'

const backgroundOptions: BackgroundOption[] = [
  {
    id: 'office',
    name: '办公室',
    thumbnail: '🏢',
    description: '现代化办公环境'
  },
  {
    id: 'living-room',
    name: '客厅',
    thumbnail: '🛋️',
    description: '温馨居家环境'
  },
  {
    id: 'outdoor',
    name: '户外',
    thumbnail: '🌅',
    description: '自然风景背景'
  }
]

interface BackgroundCustomizerProps {
  currentBackground: BackgroundType
  onBackgroundChange: (background: BackgroundType) => void
}

export function BackgroundCustomizer({ 
  currentBackground, 
  onBackgroundChange 
}: BackgroundCustomizerProps) {
  const { themeConfig } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const [customImage, setCustomImage] = useState<string | null>(null)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setCustomImage(result)
        onBackgroundChange('custom')
        setIsOpen(false)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleBackgroundSelect = (background: BackgroundType) => {
    if (background === 'custom' && !customImage) {
      // 触发文件上传
      const fileInput = document.getElementById('background-upload') as HTMLInputElement
      fileInput?.click()
    } else {
      onBackgroundChange(background)
      setIsOpen(false)
    }
  }

  const getCurrentBackgroundName = () => {
    if (currentBackground === 'custom') return '自定义'
    const option = backgroundOptions.find(opt => opt.id === currentBackground)
    return option?.name || '办公室'
  }

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
        style={{
          background: themeConfig.colors.surface,
          color: themeConfig.colors.text,
          border: `1px solid ${themeConfig.colors.border}`,
          boxShadow: themeConfig.shadows.card
        }}
      >
        <Image size={16} />
        <span>{getCurrentBackgroundName()}</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/20"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', damping: 25 }}
              className="absolute right-0 top-full mt-2 w-64 rounded-xl overflow-hidden z-50"
              style={{
                background: themeConfig.glassEffect.background,
                backdropFilter: themeConfig.glassEffect.backdropBlur,
                border: themeConfig.glassEffect.border,
                boxShadow: themeConfig.shadows.float
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4">
                <h3 
                  className="text-sm font-semibold mb-3"
                  style={{ color: themeConfig.colors.text }}
                >
                  选择背景
                </h3>
                
                <div className="space-y-2">
                  {backgroundOptions.map((option) => {
                    const isSelected = currentBackground === option.id
                    return (
                      <motion.button
                        key={option.id}
                        onClick={() => handleBackgroundSelect(option.id)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all"
                        style={{
                          background: isSelected 
                            ? themeConfig.colors.primaryMuted 
                            : themeConfig.colors.surface,
                          border: `1px solid ${isSelected ? themeConfig.colors.primary : themeConfig.colors.border}`,
                          color: isSelected 
                            ? themeConfig.colors.primary 
                            : themeConfig.colors.text
                        }}
                      >
                        <span className="text-xl">{option.thumbnail}</span>
                        <div className="flex-1">
                          <div className="font-medium text-sm">{option.name}</div>
                          <div 
                            className="text-xs"
                            style={{ color: themeConfig.colors.textMuted }}
                          >
                            {option.description}
                          </div>
                        </div>
                        {isSelected && <Check size={16} />}
                      </motion.button>
                    )
                  })}
                  
                  {/* Custom Upload */}
                  <motion.button
                    onClick={() => handleBackgroundSelect('custom')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all"
                    style={{
                      background: currentBackground === 'custom' 
                        ? themeConfig.colors.primaryMuted 
                        : themeConfig.colors.surface,
                      border: `1px solid ${currentBackground === 'custom' ? themeConfig.colors.primary : themeConfig.colors.border}`,
                      color: currentBackground === 'custom' 
                        ? themeConfig.colors.primary 
                        : themeConfig.colors.text
                    }}
                  >
                    <Image size={20} />
                    <div className="flex-1">
                      <div className="font-medium text-sm">自定义图片</div>
                      <div 
                        className="text-xs"
                        style={{ color: themeConfig.colors.textMuted }}
                      >
                        上传自己的背景图片
                      </div>
                    </div>
                    {currentBackground === 'custom' && <Check size={16} />}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Hidden file input */}
      <input
        id="background-upload"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
      />
    </div>
  )
}