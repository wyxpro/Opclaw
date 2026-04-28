import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, Camera, User, Check, RefreshCw, Sparkles, Image, Video, Box, Trash2 } from 'lucide-react'
import type { ThemeConfig } from '../../lib/themes'
import type { CharacterStyle } from './types'

export interface AvatarModel {
  id: string
  name: string
  type: 'image' | 'video' | '3d'
  url: string
  style: CharacterStyle
  createdAt: number
  isCloned: boolean
}

interface AvatarCloneProps {
  themeConfig: ThemeConfig
  onAvatarCloned: (avatarModel: AvatarModel) => void
  existingAvatar?: AvatarModel | null
}

export function AvatarClone({ themeConfig, onAvatarCloned, existingAvatar }: AvatarCloneProps) {
  const [selectedStyle, setSelectedStyle] = useState<CharacterStyle>('cartoon')
  const [uploadedMedia, setUploadedMedia] = useState<{ type: 'image' | 'video', url: string, file: File } | null>(null)
  const [isCloning, setIsCloning] = useState(false)
  const [clonedAvatar, setClonedAvatar] = useState<AvatarModel | null>(existingAvatar || null)

  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const styleOptions: { id: CharacterStyle; name: string; icon: string; description: string }[] = [
    { id: 'cartoon', name: '卡通风格', icon: '🎨', description: '可爱活泼的卡通形象' },
    { id: 'realistic', name: '真实风格', icon: '👤', description: '逼真写实的人物形象' }
  ]

  // 处理文件上传
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      const type = file.type.startsWith('video/') ? 'video' : 'image'
      setUploadedMedia({ type, url, file })
    }
  }

  // 处理相机拍照
  const handleCameraCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setUploadedMedia({ type: 'image', url, file })
    }
  }

  // 清除上传的媒体
  const clearMedia = () => {
    if (uploadedMedia) {
      URL.revokeObjectURL(uploadedMedia.url)
      setUploadedMedia(null)
    }
  }

  // 克隆形象
  const cloneAvatar = async () => {
    setIsCloning(true)
    
    // 模拟形象克隆过程
    await new Promise(resolve => setTimeout(resolve, 3000))

    const avatarModel: AvatarModel = {
      id: `avatar-${Date.now()}`,
      name: `我的数字形象 ${new Date().toLocaleDateString()}`,
      type: uploadedMedia?.type || 'image',
      url: uploadedMedia?.url || '',
      style: selectedStyle,
      createdAt: Date.now(),
      isCloned: true
    }

    setClonedAvatar(avatarModel)
    onAvatarCloned(avatarModel)
    setIsCloning(false)
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 overflow-auto">
        {/* 左侧：上传区域 - 包含标题和标签切换 */}
        <div 
          className="rounded-2xl p-4 md:p-6"
          style={{ 
            background: themeConfig.colors.surface,
            border: `1px solid ${themeConfig.colors.border}`
          }}
        >
          {/* 标题合并到卡片中 */}
          <div className="mb-4">
            <motion.h2 
              className="text-lg md:text-xl font-bold mb-1"
              style={{ color: themeConfig.colors.text }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              形象复刻
            </motion.h2>
            <p className="text-xs md:text-sm" style={{ color: themeConfig.colors.textMuted }}>
              上传照片或视频，创建您的专属数字形象
            </p>
          </div>

          {/* 上传和风格选择统一界面 */}
          <AnimatePresence mode="sync">
            <motion.div
              key="upload-style"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="space-y-4"
            >
              {/* 隐藏的文件输入 */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                className="hidden"
                onChange={handleFileUpload}
              />
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="user"
                className="hidden"
                onChange={handleCameraCapture}
              />
            {!uploadedMedia ? (
              <div className="space-y-4">
                {/* 上传按钮组 */}
                <div className="grid grid-cols-2 gap-4">
                  <motion.button
                    onClick={() => fileInputRef.current?.click()}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="p-6 rounded-xl border-2 border-dashed flex flex-col items-center gap-3 transition-all"
                    style={{
                      borderColor: themeConfig.colors.border,
                      background: themeConfig.colors.bg
                    }}
                  >
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ background: themeConfig.colors.primaryMuted }}
                    >
                      <Upload size={24} style={{ color: themeConfig.colors.primary }} />
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-sm" style={{ color: themeConfig.colors.text }}>
                        选择文件
                      </p>
                      <p className="text-xs" style={{ color: themeConfig.colors.textMuted }}>
                        支持图片/视频
                      </p>
                    </div>
                  </motion.button>

                  <motion.button
                    onClick={() => cameraInputRef.current?.click()}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="p-6 rounded-xl border-2 border-dashed flex flex-col items-center gap-3 transition-all"
                    style={{
                      borderColor: themeConfig.colors.border,
                      background: themeConfig.colors.bg
                    }}
                  >
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ background: themeConfig.colors.primaryMuted }}
                    >
                      <Camera size={24} style={{ color: themeConfig.colors.primary }} />
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-sm" style={{ color: themeConfig.colors.text }}>
                        拍照
                      </p>
                      <p className="text-xs" style={{ color: themeConfig.colors.textMuted }}>
                        使用相机
                      </p>
                    </div>
                  </motion.button>
                </div>

                {/* 风格选择 */}
                <div className="pt-2">
                  <p 
                    className="text-sm font-medium mb-3"
                    style={{ color: themeConfig.colors.text }}
                  >
                    选择风格
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {styleOptions.map((style) => (
                      <motion.button
                        key={style.id}
                        onClick={() => setSelectedStyle(style.id)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="p-3 rounded-xl border-2 flex items-center gap-3 transition-all"
                        style={{
                          borderColor: selectedStyle === style.id 
                            ? themeConfig.colors.primary 
                            : themeConfig.colors.border,
                          background: selectedStyle === style.id 
                            ? themeConfig.colors.primaryMuted 
                            : themeConfig.colors.bg
                        }}
                      >
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                          style={{ 
                            background: selectedStyle === style.id 
                              ? themeConfig.colors.primary 
                              : themeConfig.colors.bgAlt 
                          }}
                        >
                          <span style={{ color: selectedStyle === style.id ? 'white' : themeConfig.colors.text }}>
                            {style.icon}
                          </span>
                        </div>
                        <div className="flex-1 text-left">
                          <p 
                            className="font-medium text-sm"
                            style={{ 
                              color: selectedStyle === style.id 
                                ? themeConfig.colors.primary 
                                : themeConfig.colors.text 
                            }}
                          >
                            {style.name}
                          </p>
                        </div>
                        {selectedStyle === style.id && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-5 h-5 rounded-full flex items-center justify-center"
                            style={{ background: themeConfig.colors.primary }}
                          >
                            <Check size={12} className="text-white" />
                          </motion.div>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>

              </div>
            ) : (
              <div className="space-y-4">
                {/* 预览区域 */}
                <div 
                  className="relative rounded-xl overflow-hidden"
                  style={{ aspectRatio: '4/3', background: themeConfig.colors.bgAlt }}
                >
                  {uploadedMedia.type === 'video' ? (
                    <video
                      src={uploadedMedia.url}
                      controls
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <img
                      src={uploadedMedia.url}
                      alt="预览"
                      className="w-full h-full object-contain"
                    />
                  )}

                  {/* 清除按钮 */}
                  <motion.button
                    onClick={clearMedia}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center"
                    style={{
                      background: 'rgba(244, 63, 94, 0.9)',
                      color: 'white'
                    }}
                  >
                    <Trash2 size={16} />
                  </motion.button>

                  {/* 类型标签 */}
                  <div 
                    className="absolute bottom-2 left-2 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1"
                    style={{
                      background: themeConfig.colors.primary,
                      color: 'white'
                    }}
                  >
                    {uploadedMedia.type === 'video' ? <Video size={12} /> : <Image size={12} />}
                    {uploadedMedia.type === 'video' ? '视频' : '图片'}
                  </div>
                </div>

                {/* 风格选择（已上传素材时显示） */}
                <div className="pt-2">
                  <p 
                    className="text-sm font-medium mb-3"
                    style={{ color: themeConfig.colors.text }}
                  >
                    选择风格
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {styleOptions.map((style) => (
                      <motion.button
                        key={style.id}
                        onClick={() => setSelectedStyle(style.id)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="p-3 rounded-xl border-2 flex items-center gap-3 transition-all"
                        style={{
                          borderColor: selectedStyle === style.id 
                            ? themeConfig.colors.primary 
                            : themeConfig.colors.border,
                          background: selectedStyle === style.id 
                            ? themeConfig.colors.primaryMuted 
                            : themeConfig.colors.bg
                        }}
                      >
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                          style={{ 
                            background: selectedStyle === style.id 
                              ? themeConfig.colors.primary 
                              : themeConfig.colors.bgAlt 
                          }}
                        >
                          <span style={{ color: selectedStyle === style.id ? 'white' : themeConfig.colors.text }}>
                            {style.icon}
                          </span>
                        </div>
                        <div className="flex-1 text-left">
                          <p 
                            className="font-medium text-sm"
                            style={{ 
                              color: selectedStyle === style.id 
                                ? themeConfig.colors.primary 
                                : themeConfig.colors.text 
                            }}
                          >
                            {style.name}
                          </p>
                        </div>
                        {selectedStyle === style.id && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-5 h-5 rounded-full flex items-center justify-center"
                            style={{ background: themeConfig.colors.primary }}
                          >
                            <Check size={12} className="text-white" />
                          </motion.div>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* 操作按钮 */}
                <motion.button
                  onClick={cloneAvatar}
                  disabled={isCloning}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 rounded-xl flex items-center justify-center gap-2 font-medium disabled:opacity-50"
                  style={{
                    background: `linear-gradient(135deg, ${themeConfig.colors.primary}, ${themeConfig.colors.primaryGlow})`,
                    color: 'white'
                  }}
                >
                  {isCloning ? (
                    <>
                      <RefreshCw size={18} className="animate-spin" />
                      生成中...
                    </>
                  ) : (
                    <>
                      <Sparkles size={18} />
                      生成数字形象
                    </>
                  )}
                </motion.button>
              </div>
            )}
            </motion.div>
          </AnimatePresence>
        </div>


        {/* 右侧：预览区域 */}
        <div 
          className="rounded-2xl p-6"
          style={{ 
            background: themeConfig.colors.surface,
            border: `1px solid ${themeConfig.colors.border}`
          }}
        >
          <h3 
            className="text-lg font-semibold mb-4 flex items-center gap-2"
            style={{ color: themeConfig.colors.text }}
          >
            <User size={20} style={{ color: themeConfig.colors.primary }} />
            形象预览
          </h3>

          {clonedAvatar ? (
            <div className="space-y-4">
              {/* 克隆成功提示 */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 rounded-xl flex items-center gap-3"
                style={{
                  background: `rgba(16, 185, 129, 0.1)`,
                  border: `1px solid ${themeConfig.colors.emerald}`
                }}
              >
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: `rgba(16, 185, 129, 0.2)` }}
                >
                  <Check size={20} style={{ color: themeConfig.colors.emerald }} />
                </div>
                <div>
                  <p className="font-medium" style={{ color: themeConfig.colors.text }}>
                    形象复刻成功！
                  </p>
                  <p className="text-sm" style={{ color: themeConfig.colors.textMuted }}>
                    已保存: {clonedAvatar.name}
                  </p>
                </div>
              </motion.div>

              {/* 形象预览 */}
              <div 
                className="rounded-xl overflow-hidden"
                style={{ 
                  aspectRatio: '4/3', 
                  background: themeConfig.colors.bgAlt,
                  border: `1px solid ${themeConfig.colors.border}`
                }}
              >
                {clonedAvatar.type === 'video' ? (
                  <video
                    src={clonedAvatar.url}
                    controls
                    className="w-full h-full object-contain"
                  />
                ) : clonedAvatar.url ? (
                  <img
                    src={clonedAvatar.url}
                    alt="数字形象"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div 
                      className="w-32 h-40 rounded-2xl flex items-center justify-center text-6xl"
                      style={{
                        background: clonedAvatar.style === 'cartoon'
                          ? 'linear-gradient(135deg, #ffeaa7, #fdcb6e)'
                          : 'linear-gradient(135deg, #dfe6e9, #b2bec3)',
                        border: `4px solid ${clonedAvatar.style === 'cartoon' ? '#fd79a8' : '#2d3436'}`,
                        boxShadow: themeConfig.shadows.card
                      }}
                    >
                      {clonedAvatar.style === 'cartoon' ? '🎨' : '👤'}
                    </div>
                  </div>
                )}
              </div>

              {/* 形象信息 */}
              <div 
                className="p-4 rounded-xl space-y-2"
                style={{ background: themeConfig.colors.bgAlt }}
              >
                <div className="flex justify-between text-sm">
                  <span style={{ color: themeConfig.colors.textMuted }}>风格</span>
                  <span style={{ color: themeConfig.colors.text }}>
                    {clonedAvatar.style === 'cartoon' ? '卡通' : '真实'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: themeConfig.colors.textMuted }}>类型</span>
                  <span style={{ color: themeConfig.colors.text }}>
                    {clonedAvatar.type === 'video' ? '视频' : clonedAvatar.type === '3d' ? '3D模型' : '图片'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: themeConfig.colors.textMuted }}>创建时间</span>
                  <span style={{ color: themeConfig.colors.text }}>
                    {new Date(clonedAvatar.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div 
              className="h-full flex flex-col items-center justify-center text-center p-8"
              style={{ minHeight: '300px' }}
            >
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                style={{ background: themeConfig.colors.bgAlt }}
              >
                <Box size={32} style={{ color: themeConfig.colors.textMuted }} />
              </div>
              <p style={{ color: themeConfig.colors.textMuted }}>
                请先上传素材并生成数字形象<br />
                然后可以在这里预览效果
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
