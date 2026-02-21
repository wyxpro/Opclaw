import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, MessageCircle, ThumbsUp, Send, MapPin, Camera } from 'lucide-react'
import PageTransition from '../components/ui/PageTransition'
import { loveTimeline, socialPosts, travelLocations } from '../data/mock'

const tabs = [
  { id: 'love', label: '恋爱记录', icon: Heart },
  { id: 'moments', label: '朋友圈', icon: MessageCircle },
  { id: 'travel', label: '旅拍相册', icon: Camera },
] as const

type TabId = (typeof tabs)[number]['id']

export default function Life() {
  const [activeTab, setActiveTab] = useState<TabId>('love')
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)

  return (
    <PageTransition>
      <div className="mx-auto max-w-6xl px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-text mb-2">生活</h1>
          <p className="text-text-muted">记录生活中的美好时刻</p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-2 mb-8 overflow-x-auto no-scrollbar"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'text-primary'
                  : 'text-text-muted hover:text-text-secondary'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="lifeTab"
                  className="absolute inset-0 bg-primary/10 border border-primary/20 rounded-xl -z-10"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          ))}
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'love' && (
            <motion.div
              key="love"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <LoveTimeline />
            </motion.div>
          )}
          {activeTab === 'moments' && (
            <motion.div
              key="moments"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <Moments />
            </motion.div>
          )}
          {activeTab === 'travel' && (
            <motion.div
              key="travel"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <TravelAlbum selectedLocation={selectedLocation} onSelect={setSelectedLocation} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  )
}

/* ===== Love Timeline ===== */
function LoveTimeline() {
  return (
    <div className="relative max-w-2xl mx-auto">
      {/* Timeline line */}
      <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-rose/50 via-primary/30 to-transparent" />

      <div className="space-y-8">
        {loveTimeline.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className="relative pl-16"
          >
            {/* Timeline dot */}
            <div className="absolute left-4 top-2 w-5 h-5 rounded-full bg-bg border-2 border-rose flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-rose" />
            </div>

            <div className="glass-card p-6 hover:border-rose/20">
              <div className="flex items-center gap-2 mb-2 text-xs text-text-muted">
                <span>{event.date}</span>
              </div>
              <h3 className="text-lg font-semibold text-text mb-2">{event.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{event.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom decoration */}
      <div className="text-center mt-12">
        <p className="text-text-muted text-sm">故事还在继续...</p>
        <Heart size={16} className="mx-auto mt-2 text-rose animate-pulse" />
      </div>
    </div>
  )
}

/* ===== Moments (朋友圈) ===== */
function Moments() {
  const [newPost, setNewPost] = useState('')

  return (
    <div className="max-w-2xl mx-auto">
      {/* Post input */}
      <div className="glass-card p-4 mb-6">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold flex-shrink-0">
            叶
          </div>
          <div className="flex-1">
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="分享你的想法..."
              rows={3}
              className="w-full bg-transparent border-none resize-none text-sm text-text placeholder:text-text-muted focus:outline-none"
            />
            <div className="flex items-center justify-end pt-2 border-t border-border">
              <button className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-primary/20 text-primary text-sm font-medium hover:bg-primary/30 transition-colors">
                <Send size={14} />
                发布
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Posts feed */}
      <div className="space-y-4">
        {socialPosts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            className="glass-card p-5"
          >
            <div className="flex gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold flex-shrink-0">
                叶
              </div>
              <div>
                <p className="text-sm font-semibold text-text">小叶</p>
                <p className="text-xs text-text-muted">{post.date}</p>
              </div>
            </div>

            <p className="text-sm text-text-secondary leading-relaxed mb-3">{post.content}</p>

            {post.images.length > 0 && (
              <div className={`grid gap-2 mb-3 ${post.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                {post.images.map((gradient, i) => (
                  <div key={i} className={`${gradient} h-32 rounded-lg`} />
                ))}
              </div>
            )}

            <div className="flex items-center gap-6 pt-3 border-t border-border">
              <button className="flex items-center gap-1.5 text-xs text-text-muted hover:text-rose transition-colors">
                <ThumbsUp size={14} />
                {post.likes}
              </button>
              <button className="flex items-center gap-1.5 text-xs text-text-muted hover:text-primary transition-colors">
                <MessageCircle size={14} />
                {post.comments}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

/* ===== Travel Album ===== */
function TravelAlbum({ selectedLocation, onSelect }: {
  selectedLocation: string | null
  onSelect: (id: string | null) => void
}) {
  const selected = travelLocations.find((l) => l.id === selectedLocation)

  return (
    <div>
      {/* World Map (Simplified) */}
      <div className="glass-card p-6 mb-8 relative overflow-hidden" style={{ minHeight: 360 }}>
        {/* Map background */}
        <div className="absolute inset-0 bg-surface opacity-50" />
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(139,92,246,0.03) 0%, transparent 70%)',
        }} />

        {/* Map title */}
        <div className="relative z-10 mb-4">
          <h3 className="text-lg font-semibold text-text flex items-center gap-2">
            <MapPin size={18} className="text-primary" />
            足迹地图
          </h3>
          <p className="text-xs text-text-muted mt-1">点击标记查看旅行记录</p>
        </div>

        {/* Location markers */}
        <div className="relative z-10" style={{ height: 280 }}>
          {travelLocations.map((location) => (
            <motion.button
              key={location.id}
              onClick={() => onSelect(selectedLocation === location.id ? null : location.id)}
              className="absolute group"
              style={{ left: `${location.x}%`, top: `${location.y}%` }}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="relative">
                <div
                  className="w-4 h-4 rounded-full border-2 border-bg"
                  style={{ background: location.color }}
                />
                <div
                  className="absolute inset-0 rounded-full animate-ping opacity-30"
                  style={{ background: location.color }}
                />
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 rounded-lg bg-card border border-border text-xs text-text whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <span className="font-medium">{location.name}</span>
                  <span className="text-text-muted ml-1">· {location.country}</span>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Selected location detail */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8 overflow-hidden"
          >
            <div className="glass-card p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-xl font-bold text-text">{selected.name}</h3>
                  <p className="text-sm text-text-muted">{selected.country}</p>
                </div>
                <button
                  onClick={() => onSelect(null)}
                  className="text-text-muted hover:text-text text-sm"
                >
                  关闭
                </button>
              </div>
              <p className="text-sm text-text-secondary mb-4">{selected.description}</p>
              <div className="grid grid-cols-3 gap-2">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="h-24 rounded-lg"
                    style={{
                      background: `linear-gradient(135deg, ${selected.color}33, ${selected.color}11)`,
                      border: `1px solid ${selected.color}22`,
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Location cards grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {travelLocations.map((location, index) => (
          <motion.div
            key={location.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            onClick={() => onSelect(location.id)}
            className="glass-card p-5 cursor-pointer"
          >
            <div
              className="h-32 rounded-lg mb-4"
              style={{
                background: `linear-gradient(135deg, ${location.color}44, ${location.color}11)`,
              }}
            />
            <div className="flex items-center gap-2 mb-1">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ background: location.color }}
              />
              <h3 className="font-semibold text-text">{location.name}</h3>
            </div>
            <p className="text-xs text-text-muted">{location.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
