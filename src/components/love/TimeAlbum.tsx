import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Heart, Calendar, Camera, X, Image as ImageIcon, Plus, MapPin, Edit2, Trash2 } from 'lucide-react'
import type { LoveTimelineEvent } from '../LoveDetailModal'

interface AlbumImage {
  id: string
  url: string
  title: string
  date: string
  location?: string
}

interface TimeAlbumProps {
  events: LoveTimelineEvent[]
  onBack: () => void
}

// 示例图片数据
const sampleImages: AlbumImage[] = [
  { id: '1', url: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&q=80', title: '第一次约会', date: '2024-02-14', location: '星巴克咖啡' },
  { id: '2', url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&q=80', title: '海边漫步', date: '2024-05-20', location: '厦门鼓浪屿' },
  { id: '3', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80', title: '周年纪念', date: '2024-08-08', location: '杭州西湖' },
  { id: '4', url: 'https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?w=800&q=80', title: '旅行日记', date: '2024-10-01', location: '云南大理' },
  { id: '5', url: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=800&q=80', title: '温馨时刻', date: '2024-11-11', location: '家中' },
  { id: '6', url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800&q=80', title: '甜蜜约会', date: '2024-12-25', location: '上海外滩' },
  { id: '7', url: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=800&q=80', title: '求婚时刻', date: '2025-01-01', location: '三亚海边' },
  { id: '8', url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=80', title: '新年愿望', date: '2025-02-14', location: '北京故宫' },
]

export function TimeAlbum({ events, onBack }: TimeAlbumProps) {
  const [selectedImage, setSelectedImage] = useState<AlbumImage | null>(null)
  const [editingImage, setEditingImage] = useState<AlbumImage | null>(null)
  const [editForm, setEditForm] = useState({ title: '', date: '', location: '' })
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 收集所有带图片的事件，如果没有则使用示例图片
  const eventsWithImages = events.filter(event => event.images && event.images.length > 0)
  const displayImages = eventsWithImages.length > 0 
    ? eventsWithImages.flatMap(event => event.images?.map(img => ({ 
        id: `event-${Date.now()}`,
        url: img, 
        title: event.title, 
        date: event.date,
        location: '未知地点'
      })) || [])
    : sampleImages
  
  const [images, setImages] = useState<AlbumImage[]>(displayImages)

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
          const newImage: AlbumImage = {
            id: Date.now().toString(),
            url: event.target.result as string,
            title: '新上传的照片',
            date: new Date().toISOString().split('T')[0],
            location: '未知地点'
          }
          setImages(prev => [...prev, newImage])
        }
      }
      reader.readAsDataURL(file)
    })
    
    // 清空input以便可以重复选择同一文件
    e.target.value = ''
  }

  const handleImageClick = (image: AlbumImage) => {
    setSelectedImage(image)
  }

  const handleEditClick = () => {
    if (selectedImage) {
      setEditingImage(selectedImage)
      setEditForm({
        title: selectedImage.title,
        date: selectedImage.date,
        location: selectedImage.location || ''
      })
    }
  }

  const handleSaveEdit = () => {
    if (editingImage && editForm.title.trim()) {
      setImages(prev => prev.map(img => 
        img.id === editingImage.id 
          ? { ...img, ...editForm }
          : img
      ))
      setEditingImage(null)
      setSelectedImage(null)
    }
  }

  const handleDeleteImage = () => {
    if (selectedImage) {
      setImages(prev => prev.filter(img => img.id !== selectedImage.id))
      setSelectedImage(null)
    }
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
                onClick={() => handleImageClick(image)}
                className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group"
              >
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* 默认显示的渐变遮罩 */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                
                {/* 默认显示的信息 */}
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-white text-sm font-medium truncate">{image.title}</p>
                  <p className="text-white/80 text-xs flex items-center gap-1">
                    <Calendar size={10} />
                    {image.date}
                  </p>
                  {image.location && (
                    <p className="text-white/70 text-xs flex items-center gap-1 mt-0.5">
                      <MapPin size={10} />
                      {image.location}
                    </p>
                  )}
                </div>
                
                {/* 悬停显示的爱心 */}
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
        {selectedImage && !editingImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            {/* 关闭按钮 */}
            <button
              className="absolute top-4 right-4 p-2 text-white/80 hover:text-white z-10"
              onClick={() => setSelectedImage(null)}
            >
              <X size={24} />
            </button>
            
            {/* 图片 */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage.url}
                alt={selectedImage.title}
                className="max-w-full max-h-[70vh] object-contain rounded-lg mx-auto"
              />
              
              {/* 图片信息 */}
              <div className="mt-4 text-center text-white">
                <h3 className="text-xl font-semibold mb-2">{selectedImage.title}</h3>
                <div className="flex items-center justify-center gap-4 text-sm text-white/70">
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    {selectedImage.date}
                  </span>
                  {selectedImage.location && (
                    <span className="flex items-center gap-1">
                      <MapPin size={14} />
                      {selectedImage.location}
                    </span>
                  )}
                </div>
              </div>
              
              {/* 操作按钮 */}
              <div className="flex items-center justify-center gap-3 mt-6">
                <button
                  onClick={handleEditClick}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
                >
                  <Edit2 size={16} />
                  编辑
                </button>
                <button
                  onClick={handleDeleteImage}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-rose/20 text-rose hover:bg-rose/30 transition-colors"
                >
                  <Trash2 size={16} />
                  删除
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 编辑弹窗 */}
      <AnimatePresence>
        {editingImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setEditingImage(null)}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md glass-card"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border/50">
                <h3 className="text-lg font-semibold text-text">编辑图片信息</h3>
                <button
                  onClick={() => setEditingImage(null)}
                  className="p-1.5 rounded-lg text-text-muted hover:text-text hover:bg-surface transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Form */}
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1.5">标题</label>
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="输入图片标题"
                    className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-text text-sm placeholder:text-text-muted focus:outline-none focus:border-rose/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1.5">日期</label>
                  <input
                    type="date"
                    value={editForm.date}
                    onChange={(e) => setEditForm(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-text text-sm focus:outline-none focus:border-rose/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1.5">地点</label>
                  <input
                    type="text"
                    value={editForm.location}
                    onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="输入地点"
                    className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-text text-sm placeholder:text-text-muted focus:outline-none focus:border-rose/50"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-2 p-4 border-t border-border/50">
                <button
                  onClick={() => setEditingImage(null)}
                  className="px-4 py-2 rounded-lg text-sm text-text-muted hover:text-text transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleSaveEdit}
                  disabled={!editForm.title.trim()}
                  className="px-4 py-2 rounded-lg bg-rose text-white text-sm font-medium hover:bg-rose/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  保存
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default TimeAlbum
