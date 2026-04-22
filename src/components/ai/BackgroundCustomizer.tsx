import { useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Image, Check } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'
import type { BackgroundType, BackgroundOption } from './types'

const backgroundOptions: BackgroundOption[] = [
  {
    id: 'office',
    name: '办公室',
    thumbnail: 'https://img2.baidu.com/it/u=2810055108,4136944177&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=667',
    description: '专业办公环境'
  },
  {
    id: 'living-room',
    name: '客厅',
    thumbnail: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&q=80&w=400',
    description: '温馨居家环境'
  },
  {
    id: 'outdoor',
    name: '户外',
    thumbnail: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=400',
    description: '自然风景背景'
  },
  {
    id: 'studio',
    name: '演播室',
    thumbnail: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=400',
    description: '专业录制环境'
  },
  {
    id: 'library',
    name: '图书馆',
    thumbnail: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=400',
    description: '安静学习氛围'
  },
  {
    id: 'cafe',
    name: '咖啡厅',
    thumbnail: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=400',
    description: '休闲放松环境'
  }
]

interface BackgroundCustomizerProps {
  currentBackground: BackgroundType
  onBackgroundChange: (background: BackgroundType) => void
  onCustomImageUpload?: (imageUrl: string) => void
}

export function BackgroundCustomizer({ 
  currentBackground, 
  onBackgroundChange,
  onCustomImageUpload
}: BackgroundCustomizerProps) {
  const { themeConfig } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const [customImage, setCustomImage] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // 验证文件类型
      if (!file.type.startsWith('image/')) {
        alert('请上传图片文件')
        return
      }
      
      // 验证文件大小 (最大5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('图片大小不能超过5MB')
        return
      }
      
      setUploadProgress(0)
      const reader = new FileReader()
      
      reader.onprogress = (e) => {
        if (e.lengthComputable) {
          setUploadProgress((e.loaded / e.total) * 100)
        }
      }
      
      reader.onload = (e) => {
        const result = e.target?.result as string
        setCustomImage(result)
        onBackgroundChange('custom')
        if (onCustomImageUpload) {
          onCustomImageUpload(result)
        }
        setUploadProgress(100)
        setTimeout(() => {
          setIsOpen(false)
          setUploadProgress(0)
        }, 500)
      }
      
      reader.onerror = () => {
        alert('图片上传失败，请重试')
        setUploadProgress(0)
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
    if (currentBackground === 'custom') return '自定义背景'
    const option = backgroundOptions.find(opt => opt.id === currentBackground)
    return option?.name || '办公室'
  }

  const getCurrentBackgroundIcon = () => {
    if (currentBackground === 'custom') return '🖼️'
    const option = backgroundOptions.find(opt => opt.id === currentBackground)
    return option?.thumbnail || '🏢'
  }

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-1 md:gap-2 px-2 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl text-xs md:text-sm font-medium transition-all"
        style={{
          background: themeConfig.glassEffect.background,
          backdropFilter: themeConfig.glassEffect.backdropBlur,
          color: themeConfig.colors.text,
          border: themeConfig.glassEffect.border,
          boxShadow: themeConfig.shadows.card
        }}
      >
        <div className="w-6 h-6 rounded-md overflow-hidden bg-white/20 flex-shrink-0">
           {currentBackground === 'custom' && customImage ? (
             <img src={customImage} alt="custom" className="w-full h-full object-cover" />
           ) : (
             <img src={backgroundOptions.find(opt => opt.id === currentBackground)?.thumbnail || ''} alt="bg" className="w-full h-full object-cover" />
           )}
        </div>
        <span className="hidden md:inline">{getCurrentBackgroundName()}</span>
        <motion.span
          className="text-xs hidden sm:inline"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          ▼
        </motion.span>
      </motion.button>

      {isOpen && createPortal(
        <AnimatePresence>
          <>
            {/* Backdrop - 使用更高的 z-index 确保在最顶层 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20"
              style={{ zIndex: 99998 }}
              onClick={() => setIsOpen(false)}
            />
            
            {/* Panel - 使用更高的 z-index 确保在最顶层，定位在按钮组下方 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed rounded-2xl overflow-hidden max-h-[70vh] overflow-y-auto"
              style={{
                zIndex: 99999,
                top: '220px',
                left: '20px',
                width: '320px',
                background: themeConfig.glassEffect.background,
                backdropFilter: themeConfig.glassEffect.backdropBlur,
                border: themeConfig.glassEffect.border,
                boxShadow: themeConfig.shadows.float
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 
                    className="text-base font-bold flex items-center gap-2"
                    style={{ color: themeConfig.colors.text }}
                  >
                    <Image size={18} />
                    选择背景
                  </h3>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-xl opacity-60 hover:opacity-100 transition-opacity"
                    style={{ color: themeConfig.colors.text }}
                  >
                    ×
                  </button>
                </div>
                
                {/* 上传进度条 */}
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="mb-4">
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: themeConfig.colors.border }}>
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: themeConfig.colors.primary }}
                        initial={{ width: 0 }}
                        animate={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <p className="text-xs mt-1 text-center" style={{ color: themeConfig.colors.textMuted }}>
                      上传中... {Math.round(uploadProgress)}%
                    </p>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {backgroundOptions.map((option) => {
                    const isSelected = currentBackground === option.id
                    return (
                      <motion.button
                        key={option.id}
                        onClick={() => handleBackgroundSelect(option.id)}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="w-full flex flex-col items-center gap-2 p-4 rounded-xl text-center transition-all relative overflow-hidden"
                        style={{
                          background: isSelected 
                            ? `linear-gradient(135deg, ${themeConfig.colors.primaryMuted}, ${themeConfig.colors.primaryDim})` 
                            : themeConfig.colors.surface,
                          border: `2px solid ${isSelected ? themeConfig.colors.primary : themeConfig.colors.border}`,
                          color: isSelected 
                            ? themeConfig.colors.primary 
                            : themeConfig.colors.text
                        }}
                      >
                        {isSelected && (
                          <motion.div
                            layoutId="selected-bg"
                            className="absolute inset-0 opacity-10"
                            style={{ background: themeConfig.colors.primary }}
                          />
                        )}
                        <div className="w-full h-20 rounded-lg overflow-hidden mb-1 relative z-10">
                          <img src={option.thumbnail} alt={option.name} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/10 hover:bg-transparent transition-colors" />
                        </div>
                        <div className="relative z-10">
                          <div className="font-semibold text-sm">{option.name}</div>
                          <div 
                            className="text-xs mt-0.5"
                            style={{ color: themeConfig.colors.textMuted }}
                          >
                            {option.description}
                          </div>
                        </div>
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-2 right-2"
                          >
                            <Check size={16} style={{ color: themeConfig.colors.primary }} />
                          </motion.div>
                        )}
                      </motion.button>
                    )
                  })}
                </div>
                
                {/* Custom Upload */}
                <motion.button
                  onClick={() => handleBackgroundSelect('custom')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-3 p-4 rounded-xl text-center transition-all border-2 border-dashed"
                  style={{
                    background: currentBackground === 'custom' 
                      ? `linear-gradient(135deg, ${themeConfig.colors.primaryMuted}, ${themeConfig.colors.primaryDim})` 
                      : themeConfig.colors.surface,
                    borderColor: currentBackground === 'custom' ? themeConfig.colors.primary : themeConfig.colors.border,
                    color: currentBackground === 'custom' 
                      ? themeConfig.colors.primary 
                      : themeConfig.colors.text
                  }}
                >
                  <Image size={24} />
                  <div className="flex-1 text-left">
                    <div className="font-semibold text-sm">上传自定义图片</div>
                    <div 
                      className="text-xs mt-0.5"
                      style={{ color: themeConfig.colors.textMuted }}
                    >
                      支持 JPG, PNG (最大5MB)
                    </div>
                  </div>
                  {currentBackground === 'custom' && <Check size={18} />}
                </motion.button>
                
                {/* 自定义背景预览 */}
                {customImage && currentBackground === 'custom' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-3 rounded-xl overflow-hidden border"
                    style={{ borderColor: themeConfig.colors.border }}
                  >
                    <img 
                      src={customImage} 
                      alt="自定义背景预览" 
                      className="w-full h-32 object-cover"
                    />
                  </motion.div>
                )}
              </div>
            </motion.div>
          </>
        </AnimatePresence>,
        document.body
      )}

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