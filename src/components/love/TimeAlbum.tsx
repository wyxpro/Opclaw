import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Heart, Calendar, Camera, X, Image as ImageIcon, Plus } from 'lucide-react'
import type { LoveTimelineEvent } from '../LoveDetailModal'

interface TimeAlbumProps {
  events: LoveTimelineEvent[]
  onBack: () => void
}

// 示例图片数据
const sampleImages = [
  { id: '1', url: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&q=80', title: '第一次约会', date: '2024-02-14' },
  { id: '2', url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&q=80', title: '海边漫步', date: '2024-05-20' },
  { id: '3', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80', title: '周年纪念', date: '2024-08-08' },
  { id: '4', url: 'https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?w=800&q=80', title: '旅行日记', date: '2024-10-01' },
  { id: '5', url: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=800&q=80', title: '温馨时刻', date: '2024-11-11' },
  { id: '6', url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800&q=80', title: '甜蜜约会', date: '2024-12-25' },
]

export function TimeAlbum({ events, onBack }: TimeAlbumProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 收集所有带图片的事件，如果没有则使用示例图片
  const eventsWithImages = events.filter(event => event.images && event.images.length > 0)
  const displayImages = eventsWithImages.length > 0 
    ? eventsWithImages.flatMap(event => event.images?.map(img => ({ url: img, title: event.title, date: event.date })) || [])
    : sampleImages
  
  const [images, setImages] = useState(displayImages)

  const handleAddImage = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    // 模拟图片上传 - 使用本地预览URL
    Array.from(files).forEach(file => {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          const newImage = {
            id: Date.now().toString(),
            url: event.target.result as string,
            title: '新上传的照片',
            date: new Date().toISOString().split('T')[0]
          }
          setImages(prev => [...prev, newImage])
        }
      }
      reader.readAsDataURL(file)
    })
    
    // 清空input以便可以重复选择同一文件
    e.target.value = ''
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* 顶部导航 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 glass border-b border-border/50"
      >
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-text-secondary hover:text-text transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">返回</span>
          </button>
          <h1 className="text-xl font-bold bg-gradient-to-r from-rose to-primary bg-clip-text text-transparent">
            时光相册
          </h1>
          <div className="w-20" />
        </div>
      </motion.div>

      {/* 内容区域 */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* 头部介绍 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-rose/20 to-primary/20 mb-4">
            <Camera size={32} className="text-rose" />
          </div>
          <h2 className="text-2xl font-bold text-text mb-2">记录美好瞬间</h2>
          <p className="text-text-muted">每一张照片都是一段珍贵的回忆</p>
        </motion.div>

        {/* 新增图片按钮 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center mb-8"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddImage}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary-dim transition-colors"
          >
            <Plus size={20} />
            <span>新增图片</span>
          </motion.button>
        </motion.div>

        {/* 照片墙 */}
        {images.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.03, y: -4 }}
                onClick={() => setSelectedImage(image.url)}
                className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group"
              >
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-white text-sm font-medium truncate">{image.title}</p>
                  <p className="text-white/70 text-xs flex items-center gap-1">
                    <Calendar size={10} />
                    {image.date}
                  </p>
                </div>
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Heart size={16} className="text-rose fill-rose" />
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 mx-auto rounded-full bg-surface flex items-center justify-center mb-4">
              <ImageIcon size={40} className="text-text-muted" />
            </div>
            <p className="text-text-muted">还没有添加照片</p>
            <p className="text-text-dim text-sm mt-1">点击上方按钮上传照片</p>
          </motion.div>
        )}
      </div>

      {/* 图片预览弹窗 */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-4 right-4 p-2 text-white/80 hover:text-white"
              onClick={() => setSelectedImage(null)}
            >
              <X size={24} />
            </button>
            <img
              src={selectedImage}
              alt="大图预览"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default TimeAlbum
