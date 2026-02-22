import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit2, Trash2, X, Camera, Check, AlertCircle, Upload } from 'lucide-react'
import type { TravelLocation } from '../data/mock'

interface TravelManagerProps {
  locations: TravelLocation[]
  onAdd: (location: Omit<TravelLocation, 'id'>) => void
  onEdit: (id: string, location: Partial<TravelLocation>) => void
  onDelete: (id: string) => void
  onLocationClick?: (location: TravelLocation) => void
}

interface FormData {
  name: string
  country: string
  description: string
  x: number
  y: number
  color: string
  bestTime: string
  highlights: string[]
  tips: string
  images: string[]
}

const colorOptions = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16',
  '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9',
  '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
  '#ec4899', '#f43f5e', '#fb7185'
]

const initialFormData: FormData = {
  name: '',
  country: '中国',
  description: '',
  x: 50,
  y: 50,
  color: '#3b82f6',
  bestTime: '',
  highlights: [],
  tips: '',
  images: []
}

export function TravelManager({ locations, onAdd, onEdit, onDelete, onLocationClick }: TravelManagerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [newHighlight, setNewHighlight] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const openAddModal = () => {
    setEditingId(null)
    setFormData(initialFormData)
    setIsModalOpen(true)
  }

  const openEditModal = (location: TravelLocation) => {
    setEditingId(location.id)
    setFormData({
      name: location.name,
      country: location.country,
      description: location.description,
      x: location.x,
      y: location.y,
      color: location.color,
      bestTime: location.details.bestTime,
      highlights: [...location.details.highlights],
      tips: location.details.tips,
      images: [...location.images]
    })
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingId(null)
    setFormData(initialFormData)
    setNewHighlight('')
  }

  const handleSubmit = () => {
    if (!formData.name.trim()) return

    const locationData = {
      name: formData.name,
      country: formData.country,
      description: formData.description,
      x: formData.x,
      y: formData.y,
      color: formData.color,
      images: formData.images.length > 0 ? formData.images : [
        `https://picsum.photos/seed/${Date.now()}/800/600`
      ],
      details: {
        bestTime: formData.bestTime,
        highlights: formData.highlights,
        tips: formData.tips
      }
    }

    if (editingId) {
      onEdit(editingId, locationData)
    } else {
      onAdd(locationData)
    }
    closeModal()
  }

  const handleDelete = (id: string) => {
    onDelete(id)
    setDeleteConfirmId(null)
  }

  const addHighlight = () => {
    if (newHighlight.trim() && formData.highlights.length < 8) {
      setFormData(prev => ({
        ...prev,
        highlights: [...prev.highlights, newHighlight.trim()]
      }))
      setNewHighlight('')
    }
  }

  const removeHighlight = (index: number) => {
    setFormData(prev => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index)
    }))
  }

  return (
    <div>
      {/* 管理按钮 */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base sm:text-lg font-semibold text-text flex items-center gap-2">
          <Camera size={18} className="text-accent" />
          旅行足迹管理
        </h3>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={openAddModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dim transition-colors"
        >
          <Plus size={14} />
          新增地点
        </motion.button>
      </div>

      {/* 地点卡片网格 */}
      <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {locations.map((location, index) => (
          <motion.div
            key={location.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            onClick={() => onLocationClick?.(location)}
            className="group cursor-pointer"
          >
            {/* 卡片容器 - 玻璃态风格 */}
            <div className="glass-card overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1">
              {/* 图片区域 */}
              <div className="relative h-40 sm:h-44 overflow-hidden">
                <img
                  src={location.images[0]}
                  alt={location.name}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                {/* 图片遮罩 - 悬停时显示 */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* 序号标记 - 右下角 */}
                <div className="absolute bottom-3 right-3 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-xs font-semibold text-text shadow-lg">
                  {index + 1}
                </div>

                {/* 操作按钮 - 悬停时显示在右上角 */}
                <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      openEditModal(location)
                    }}
                    className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-text-muted hover:text-primary hover:bg-white transition-all shadow-lg"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setDeleteConfirmId(location.id)
                    }}
                    className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-text-muted hover:text-rose hover:bg-white transition-all shadow-lg"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                {/* 地点标记 - 左上角 */}
                <div 
                  className="absolute top-3 left-3 px-2.5 py-1 rounded-full flex items-center gap-1.5"
                  style={{ 
                    background: `${location.color}15`,
                    backdropFilter: 'blur(4px)'
                  }}
                >
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ background: location.color, boxShadow: `0 0 6px ${location.color}` }}
                  />
                  <span className="text-[10px] font-medium" style={{ color: location.color }}>
                    {location.country}
                  </span>
                </div>
              </div>

              {/* 内容区域 */}
              <div className="p-4">
                {/* 标题 */}
                <h3 className="font-semibold text-text text-base mb-2 group-hover:text-primary transition-colors line-clamp-1">
                  {location.name}
                </h3>
                
                {/* 描述 */}
                <p className="text-sm text-text-muted line-clamp-2 leading-relaxed mb-3">
                  {location.description}
                </p>

                {/* 底部信息 */}
                <div className="flex items-center justify-between pt-3 border-t border-border/20">
                  <div className="flex items-center gap-2 text-[11px] text-text-muted">
                    <span className="flex items-center gap-1">
                      <div 
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: location.color }}
                      />
                      {location.details.bestTime || '全年适宜'}
                    </span>
                  </div>
                  <span className="text-[11px] text-primary/70 group-hover:text-primary transition-colors">
                    查看详情 →
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 新增/编辑弹窗 */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto glass-card"
              onClick={e => e.stopPropagation()}
            >
              {/* 头部 */}
              <div className="flex items-center justify-between p-4 border-b border-border/50">
                <h3 className="text-lg font-semibold text-text">
                  {editingId ? '编辑旅行地点' : '新增旅行地点'}
                </h3>
                <button
                  onClick={closeModal}
                  className="p-1.5 rounded-lg text-text-muted hover:text-text hover:bg-surface transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* 表单内容 */}
              <div className="p-4 space-y-4">
                {/* 名称 */}
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1.5">地点名称</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="例如：北京"
                    className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-text text-sm placeholder:text-text-muted focus:outline-none focus:border-primary/50"
                  />
                </div>

                {/* 描述 */}
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1.5">描述</label>
                  <textarea
                    value={formData.description}
                    onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="简短描述这个地方..."
                    rows={2}
                    className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-text text-sm placeholder:text-text-muted focus:outline-none focus:border-primary/50 resize-none"
                  />
                </div>

                {/* 地图坐标 */}
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1.5">地图位置</label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-[10px] text-text-muted">经度 (X)</span>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={formData.x}
                        onChange={e => setFormData(prev => ({ ...prev, x: Number(e.target.value) }))}
                        className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-text text-sm focus:outline-none focus:border-primary/50"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-text-muted">纬度 (Y)</span>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={formData.y}
                        onChange={e => setFormData(prev => ({ ...prev, y: Number(e.target.value) }))}
                        className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-text text-sm focus:outline-none focus:border-primary/50"
                      />
                    </div>
                  </div>
                </div>

                {/* 颜色选择 */}
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1.5">标记颜色</label>
                  <div className="flex flex-wrap gap-2">
                    {colorOptions.map(color => (
                      <button
                        key={color}
                        onClick={() => setFormData(prev => ({ ...prev, color }))}
                        className={`w-6 h-6 rounded-full transition-all ${formData.color === color ? 'ring-2 ring-white ring-offset-2 ring-offset-bg' : ''}`}
                        style={{ background: color }}
                      />
                    ))}
                  </div>
                </div>

                {/* 最佳旅行时间 */}
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1.5">最佳旅行时间</label>
                  <input
                    type="text"
                    value={formData.bestTime}
                    onChange={e => setFormData(prev => ({ ...prev, bestTime: e.target.value }))}
                    placeholder="例如：3-5月、9-11月"
                    className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-text text-sm placeholder:text-text-muted focus:outline-none focus:border-primary/50"
                  />
                </div>

                {/* 必游景点 */}
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1.5">必游景点</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.highlights.map((highlight, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-primary/10 text-primary border border-primary/20"
                      >
                        {highlight}
                        <button
                          onClick={() => removeHighlight(index)}
                          className="hover:text-rose"
                        >
                          <X size={10} />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newHighlight}
                      onChange={e => setNewHighlight(e.target.value)}
                      onKeyPress={e => e.key === 'Enter' && addHighlight()}
                      placeholder="添加景点..."
                      className="flex-1 px-3 py-2 rounded-lg bg-surface border border-border text-text text-sm placeholder:text-text-muted focus:outline-none focus:border-primary/50"
                    />
                    <button
                      onClick={addHighlight}
                      disabled={!newHighlight.trim() || formData.highlights.length >= 8}
                      className="px-3 py-2 rounded-lg bg-surface border border-border text-text-muted hover:text-primary hover:border-primary/50 transition-colors disabled:opacity-50"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                {/* 旅行贴士 */}
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1.5">旅行贴士</label>
                  <textarea
                    value={formData.tips}
                    onChange={e => setFormData(prev => ({ ...prev, tips: e.target.value }))}
                    placeholder="分享一些实用的旅行建议..."
                    rows={2}
                    className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-text text-sm placeholder:text-text-muted focus:outline-none focus:border-primary/50 resize-none"
                  />
                </div>

                {/* 图片上传 */}
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1.5">图片</label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      const files = e.target.files
                      if (!files) return
                      
                      // 模拟图片上传 - 使用随机 Unsplash 图片
                      const newImages: string[] = []
                      for (let i = 0; i < Math.min(files.length, 9 - formData.images.length); i++) {
                        newImages.push(`https://picsum.photos/seed/${Date.now() + i}/800/600`)
                      }
                      
                      setFormData(prev => ({
                        ...prev,
                        images: [...prev.images, ...newImages].slice(0, 9)
                      }))
                    }}
                  />
                  
                  {/* 图片预览网格 */}
                  {formData.images.length > 0 && (
                    <div className="grid grid-cols-4 gap-2 mb-3">
                      {formData.images.map((img, index) => (
                        <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                          <img src={img} alt={`预览 ${index + 1}`} className="w-full h-full object-cover" />
                          <button
                            onClick={() => setFormData(prev => ({
                              ...prev,
                              images: prev.images.filter((_, i) => i !== index)
                            }))}
                            className="absolute top-0.5 right-0.5 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center text-white text-xs hover:bg-black/80"
                          >
                            <X size={10} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* 上传按钮 */}
                  {formData.images.length < 9 && (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed border-border text-text-muted hover:border-primary hover:text-primary transition-colors"
                    >
                      <Upload size={16} />
                      <span className="text-sm">上传图片 ({formData.images.length}/9)</span>
                    </button>
                  )}
                </div>
              </div>

              {/* 底部按钮 */}
              <div className="flex items-center justify-end gap-2 p-4 border-t border-border/50">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 rounded-lg text-sm text-text-muted hover:text-text transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!formData.name.trim()}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dim disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Check size={14} />
                  {editingId ? '保存修改' : '添加地点'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 删除确认弹窗 */}
      <AnimatePresence>
        {deleteConfirmId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setDeleteConfirmId(null)}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm glass-card p-5"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-full bg-rose/10">
                  <AlertCircle size={20} className="text-rose" />
                </div>
                <div>
                  <h4 className="font-semibold text-text">确认删除</h4>
                  <p className="text-xs text-text-muted">此操作无法撤销</p>
                </div>
              </div>
              <p className="text-sm text-text-secondary mb-4">
                确定要删除 "{locations.find(l => l.id === deleteConfirmId)?.name}" 这个旅行地点吗？
              </p>
              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-4 py-2 rounded-lg text-sm text-text-muted hover:text-text transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirmId)}
                  className="px-4 py-2 rounded-lg bg-rose text-white text-sm font-medium hover:bg-rose/80 transition-colors"
                >
                  确认删除
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default TravelManager
