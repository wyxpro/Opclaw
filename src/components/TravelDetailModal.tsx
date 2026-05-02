import { motion, AnimatePresence } from 'framer-motion'
import { X, Calendar, Sparkles, Lightbulb, MapPin, Star, Camera } from 'lucide-react'
import type { TravelLocation } from '../data/mock'

interface TravelDetailModalProps {
  location: TravelLocation | null
  isOpen: boolean
  onClose: () => void
}

export function TravelDetailModal({ location, isOpen, onClose }: TravelDetailModalProps) {
  if (!location) return null

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
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
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
            className="relative w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-2xl bg-white/95 backdrop-blur-xl border border-white shadow-2xl shadow-black/10"
            style={{
              border: `1px solid ${location.color}20`,
              boxShadow: `0 25px 80px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.02)`
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 顶部图片区域 */}
            <div className="relative h-56 sm:h-72 overflow-hidden">
              <motion.img
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.6 }}
                src={location.images[0]}
                alt={location.name}
                className="w-full h-full object-cover"
              />
              
              {/* 渐变遮罩 - 调整为向白色渐变以适配亮色主题 */}
              <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/20 to-transparent" />
              <div 
                className="absolute inset-0 opacity-20"
                style={{
                  background: `linear-gradient(135deg, ${location.color} 0%, transparent 50%)`
                }}
              />
              
              {/* 关闭按钮 */}
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                onClick={onClose}
                className="absolute top-4 right-4 p-2.5 rounded-full bg-white/60 backdrop-blur-md text-slate-900 hover:bg-white/80 hover:scale-110 transition-all border border-black/5"
              >
                <X size={20} />
              </motion.button>
              
              {/* 图片计数 */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/60 backdrop-blur-md text-slate-700 text-xs font-medium border border-black/5"
              >
                <Camera size={12} />
                <span>{location.images.length} 张照片</span>
              </motion.div>
              
              {/* 标题区域 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="absolute bottom-0 left-0 right-0 p-6"
              >
                <div className="flex items-center gap-2 mb-2">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: 'spring' }}
                    className="w-3 h-3 rounded-full"
                    style={{ background: location.color, boxShadow: `0 0 12px ${location.color}40` }}
                  />
                  <span className="text-slate-600 text-sm font-semibold flex items-center gap-1">
                    <MapPin size={12} />
                    {location.country}
                  </span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                  {location.name}
                </h2>
              </motion.div>
            </div>
            
            {/* 内容区域 */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-18rem)] custom-scrollbar">
              {/* 描述 */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="text-slate-600 text-base leading-relaxed mb-6"
              >
                {location.description}
              </motion.p>
              
              {/* 信息卡片网格 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {/* 最佳旅行时间 */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div 
                      className="p-2.5 rounded-lg shrink-0"
                      style={{ background: `${location.color}10` }}
                    >
                      <Calendar size={18} style={{ color: location.color }} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 mb-1">最佳旅行时间</h4>
                      <p className="text-sm text-slate-500">{location.details.bestTime}</p>
                    </div>
                  </div>
                </motion.div>
                
                {/* 推荐指数 */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 }}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div 
                      className="p-2.5 rounded-lg shrink-0"
                      style={{ background: `${location.color}10` }}
                    >
                      <Star size={18} style={{ color: location.color }} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 mb-1">推荐指数</h4>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={14}
                            className={star <= 4 ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}
                          />
                        ))}
                        <span className="text-xs text-slate-500 ml-1">4.8/5</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
              
              {/* 必游景点 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mb-6"
              >
                <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Sparkles size={16} style={{ color: location.color }} />
                  必游景点
                </h4>
                <div className="flex flex-wrap gap-2">
                  {location.details.highlights.map((highlight, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.45 + index * 0.05 }}
                      className="px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all hover:scale-105 cursor-default"
                      style={{
                        background: `${location.color}10`,
                        borderColor: `${location.color}30`,
                        color: location.color
                      }}
                    >
                      {highlight}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
              
              {/* 旅行贴士 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="p-4 rounded-xl mb-6"
                style={{
                  background: `linear-gradient(135deg, ${location.color}08 0%, transparent 100%)`,
                  border: `1px solid ${location.color}20`
                }}
              >
                <div className="flex items-start gap-3">
                  <div 
                    className="p-2 rounded-lg shrink-0"
                    style={{ background: `${location.color}15` }}
                  >
                    <Lightbulb size={18} style={{ color: location.color }} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 mb-1">旅行贴士</h4>
                    <p className="text-sm text-slate-600 leading-relaxed">{location.details.tips}</p>
                  </div>
                </div>
              </motion.div>
              
              {/* 图片画廊 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
              >
                <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Camera size={16} className="text-slate-400" />
                  精彩瞬间
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  {location.images.map((image, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 + index * 0.08 }}
                      whileHover={{ scale: 1.05, zIndex: 10 }}
                      className="aspect-square rounded-lg overflow-hidden cursor-pointer group relative"
                    >
                      <img
                        src={image}
                        alt={`${location.name} ${index + 1}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                      />
                      <div 
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{
                          background: `linear-gradient(135deg, ${location.color}40 0%, transparent 100%)`
                        }}
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
            
            {/* 底部装饰线 */}
            <div 
              className="absolute bottom-0 left-0 right-0 h-1"
              style={{
                background: `linear-gradient(90deg, transparent 0%, ${location.color} 50%, transparent 100%)`
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default TravelDetailModal
