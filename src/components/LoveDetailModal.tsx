import { motion, AnimatePresence } from 'framer-motion'
import { X, Calendar, Heart, Edit2, Trash2, Sparkles } from 'lucide-react'

export interface LoveTimelineEvent {
  id: string
  date: string
  title: string
  description: string
  emoji: string
  images?: string[]
  location?: string
  mood?: string
}

interface LoveDetailModalProps {
  event: LoveTimelineEvent | null
  isOpen: boolean
  isEditMode?: boolean
  editForm?: { title: string; description: string; date: string; emoji: string }
  onClose: () => void
  onEdit: (event: LoveTimelineEvent) => void
  onDelete: (id: string) => void
  onSaveEdit?: () => void
  onEditFormChange?: (form: { title: string; description: string; date: string; emoji: string }) => void
}

export function LoveDetailModal({ 
  event, 
  isOpen, 
  isEditMode = false,
  editForm,
  onClose, 
  onEdit, 
  onDelete,
  onSaveEdit,
  onEditFormChange
}: LoveDetailModalProps) {
  if (!event) return null

  const handleFormChange = (field: string, value: string) => {
    if (onEditFormChange && editForm) {
      onEditFormChange({ ...editForm, [field]: value })
    }
  }

  const handleDelete = () => {
    if (confirm('确定要删除这条记录吗？')) {
      onDelete(event.id)
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          {/* 背景遮罩 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
          />
          
          {/* 弹窗内容 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ 
              type: 'spring', 
              stiffness: 300, 
              damping: 30,
              delay: 0.1 
            }}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl glass-card pointer-events-auto"
            style={{
              background: 'linear-gradient(135deg, rgba(19, 25, 34, 0.95) 0%, rgba(13, 17, 23, 0.98) 100%)',
              border: '1px solid rgba(244, 63, 94, 0.2)',
              boxShadow: '0 25px 80px rgba(244, 63, 94, 0.15), 0 0 0 1px rgba(255,255,255,0.05)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 顶部装饰 */}
            <div className="relative h-32 overflow-hidden">
              <div 
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(135deg, rgba(244, 63, 94, 0.3) 0%, rgba(139, 92, 246, 0.2) 50%, transparent 100%)'
                }}
              />
              
              {/* 浮动的心形装饰 */}
              <motion.div
                animate={{ 
                  y: [0, -10, 0],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute top-4 left-8"
              >
                <Heart size={24} className="text-rose/40 fill-rose/20" />
              </motion.div>
              <motion.div
                animate={{ 
                  y: [0, -15, 0],
                  opacity: [0.3, 0.8, 0.3]
                }}
                transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
                className="absolute top-8 right-12"
              >
                <Heart size={32} className="text-rose/30 fill-rose/10" />
              </motion.div>
              <motion.div
                animate={{ 
                  y: [0, -8, 0],
                  opacity: [0.4, 0.9, 0.4]
                }}
                transition={{ duration: 3.5, repeat: Infinity, delay: 1 }}
                className="absolute bottom-4 left-1/4"
              >
                <Heart size={20} className="text-primary/40 fill-primary/20" />
              </motion.div>

              {/* 关闭按钮 */}
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                onClick={(e) => {
                  e.stopPropagation()
                  onClose()
                }}
                className="absolute top-4 right-4 p-2.5 rounded-full bg-black/40 backdrop-blur-sm text-white/90 hover:bg-black/60 hover:text-white transition-all border border-white/10 z-50"
              >
                <X size={20} />
              </motion.button>

              {/* 标题区域 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="absolute bottom-0 left-0 right-0 p-6"
              >
                <div className="flex items-center gap-3 mb-2">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: 'spring' }}
                    className="w-12 h-12 rounded-full bg-gradient-to-br from-rose to-primary flex items-center justify-center text-2xl shadow-lg shadow-rose/30"
                  >
                    {event.emoji}
                  </motion.div>
                  <div>
                    <span className="text-rose/80 text-sm font-medium flex items-center gap-1">
                      <Calendar size={12} />
                      {event.date}
                    </span>
                    {event.location && (
                      <span className="text-text-muted text-xs flex items-center gap-1 mt-0.5">
                        📍 {event.location}
                      </span>
                    )}
                  </div>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  {event.title}
                </h2>
              </motion.div>
            </div>
            
            {/* 内容区域 */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-8rem)] custom-scrollbar">
              {isEditMode && editForm ? (
                /* 编辑模式 */
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="text-sm text-text-muted mb-1 block">标题</label>
                    <input
                      type="text"
                      value={editForm.title}
                      onChange={(e) => handleFormChange('title', e.target.value)}
                      className="w-full bg-surface rounded-lg px-3 py-2 text-text border border-border focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-text-muted mb-1 block">日期</label>
                    <input
                      type="date"
                      value={editForm.date}
                      onChange={(e) => handleFormChange('date', e.target.value)}
                      className="w-full bg-surface rounded-lg px-3 py-2 text-text border border-border focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-text-muted mb-1 block">表情</label>
                    <input
                      type="text"
                      value={editForm.emoji}
                      onChange={(e) => handleFormChange('emoji', e.target.value)}
                      className="w-full bg-surface rounded-lg px-3 py-2 text-text border border-border focus:border-primary focus:outline-none"
                      maxLength={2}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-text-muted mb-1 block">描述</label>
                    <textarea
                      value={editForm.description}
                      onChange={(e) => handleFormChange('description', e.target.value)}
                      rows={4}
                      className="w-full bg-surface rounded-lg px-3 py-2 text-text border border-border focus:border-primary focus:outline-none resize-none"
                    />
                  </div>
                  
                  {/* 操作按钮 */}
                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/50">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onEdit(event)
                      }}
                      className="px-4 py-2 rounded-xl text-sm font-medium text-text-muted hover:text-text transition-colors"
                    >
                      取消
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onSaveEdit?.()
                      }}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-primary text-white hover:bg-primary-dim transition-all"
                    >
                      <Edit2 size={16} />
                      保存
                    </button>
                  </div>
                </motion.div>
              ) : (
                <>
                  {/* 心情标签 */}
                  {event.mood && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.25 }}
                      className="mb-4"
                    >
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-rose/10 text-rose border border-rose/20">
                        <Sparkles size={12} />
                        {event.mood}
                      </span>
                    </motion.div>
                  )}

                  {/* 描述 */}
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-text-secondary text-base leading-relaxed mb-6 whitespace-pre-wrap"
                  >
                    {event.description}
                  </motion.p>
                  
                  {/* 图片画廊 */}
                  {event.images && event.images.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35 }}
                      className="mb-6"
                    >
                      <h4 className="text-sm font-semibold text-text mb-3 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose" />
                        美好瞬间
                      </h4>
                      <div className="grid grid-cols-3 gap-2">
                        {event.images.map((image, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.4 + index * 0.08 }}
                            whileHover={{ scale: 1.05, zIndex: 10 }}
                            className="aspect-square rounded-lg overflow-hidden cursor-pointer group relative"
                          >
                            <img
                              src={image}
                              alt={`${event.title} ${index + 1}`}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-rose/40 to-transparent" />
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* 操作按钮 */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex items-center justify-end gap-3 pt-4 border-t border-border/50"
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onEdit(event)
                      }}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-text-secondary hover:text-primary hover:bg-primary/10 transition-all cursor-pointer"
                    >
                      <Edit2 size={16} />
                      编辑
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete()
                      }}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-rose hover:bg-rose/10 transition-all cursor-pointer"
                    >
                      <Trash2 size={16} />
                      删除
                    </button>
                  </motion.div>
                </>
              )}
            </div>
            
            {/* 底部装饰线 */}
            <div 
              className="absolute bottom-0 left-0 right-0 h-1"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, #f43f5e 50%, transparent 100%)'
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default LoveDetailModal
