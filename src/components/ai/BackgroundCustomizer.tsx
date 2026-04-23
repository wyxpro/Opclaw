import { useState, useEffect } from 'react'
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
  const [isMobileUI, setIsMobileUI] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobileUI(window.innerWidth < 768)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('请上传图片文件')
        return
      }
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
      reader.readAsDataURL(file)
    }
  }

  const handleBackgroundSelect = (background: BackgroundType) => {
    if (background === 'custom' && !customImage) {
      const fileInput = document.getElementById('background-upload') as HTMLInputElement
      fileInput?.click()
    } else {
      onBackgroundChange(background)
      setIsOpen(false)
    }
  }

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
        style={{
          background: themeConfig.glassEffect.background,
          backdropFilter: themeConfig.glassEffect.backdropBlur,
          color: themeConfig.colors.text,
          border: themeConfig.glassEffect.border,
          boxShadow: themeConfig.shadows.card
        }}
      >
        <div className="w-5 h-5 rounded-full overflow-hidden flex-shrink-0 bg-white/20">
           {currentBackground === 'custom' && customImage ? (
             <img src={customImage} alt="custom" className="w-full h-full object-cover" />
           ) : (
             <img src={backgroundOptions.find(opt => opt.id === currentBackground)?.thumbnail || ''} alt="bg" className="w-full h-full object-cover" />
           )}
        </div>
        <span className="hidden sm:inline">背景</span>
        <motion.span
          className="text-[10px]"
          animate={{ rotate: isOpen ? 180 : 0 }}
        >
          ▼
        </motion.span>
      </motion.button>

      {isOpen && createPortal(
        <AnimatePresence>
          <div className="fixed inset-0 z-[99998] flex items-end sm:items-center justify-center p-0 sm:p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            />
            
            {/* Panel */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={`relative w-full max-w-lg bg-white rounded-t-[32px] sm:rounded-3xl overflow-hidden flex flex-col max-h-[75vh] shadow-[0_-10px_50px_rgba(0,0,0,0.1)]`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Handle for mobile */}
              <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mt-2 mb-1 sm:hidden" />
              
              <div className="px-5 py-3 flex items-center justify-between border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <Image size={16} />
                  </div>
                  <h3 className="text-base font-bold text-gray-900">选择背景</h3>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="w-7 h-7 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-400 shadow-sm border border-gray-100 transition-colors"
                >
                  <span className="text-lg leading-none mb-0.5">×</span>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-5 pb-5 pt-3 space-y-3">
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="px-2">
                    <div className="h-2 rounded-full overflow-hidden bg-gray-100">
                      <motion.div
                        className="h-full bg-indigo-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-3 gap-2">
                  {backgroundOptions.map((option) => {
                    const isSelected = currentBackground === option.id
                    return (
                      <button
                        key={option.id}
                        onClick={() => handleBackgroundSelect(option.id)}
                        className={`group relative flex flex-col p-1.5 rounded-xl border-2 transition-all ${
                          isSelected ? 'border-indigo-500 bg-indigo-50/30' : 'border-gray-100 hover:border-indigo-200'
                        }`}
                      >
                        <div className="w-full aspect-[4/3] rounded-lg overflow-hidden mb-1.5">
                          <img src={option.thumbnail} alt={option.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                        </div>
                        <div className="px-1 text-left w-full">
                          <div className={`font-bold text-[11px] truncate ${isSelected ? 'text-indigo-600' : 'text-gray-800'}`}>{option.name}</div>
                        </div>
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-indigo-500 flex items-center justify-center text-white shadow-md">
                            <Check size={10} />
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
                
                <button
                  onClick={() => handleBackgroundSelect('custom')}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 border-dashed transition-all ${
                    currentBackground === 'custom' ? 'border-indigo-500 bg-indigo-50/30' : 'border-gray-200 hover:border-indigo-300'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-indigo-500">
                    <Image size={20} />
                  </div>
                  <div className="text-left flex-1">
                    <div className="font-bold text-sm text-gray-800">上传自定义图片</div>
                    <p className="text-[10px] text-gray-400 mt-0.5">支持 JPG, PNG (最大5MB)</p>
                  </div>
                  {currentBackground === 'custom' && <Check size={16} className="text-indigo-500" />}
                </button>

                {customImage && currentBackground === 'custom' && (
                  <div className="rounded-2xl overflow-hidden border border-gray-100">
                    <img src={customImage} alt="Preview" className="w-full h-32 object-cover" />
                  </div>
                )}
                
                <div className="h-10 shrink-0" />
              </div>
            </motion.div>
          </div>
        </AnimatePresence>,
        document.body
      )}

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