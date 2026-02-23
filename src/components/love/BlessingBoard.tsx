import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Heart, Send, MessageCircle, Sparkles, User } from 'lucide-react'

interface Blessing {
  id: string
  author: string
  content: string
  createdAt: string
  color: string
  likes: number
}

interface BlessingBoardProps {
  onBack: () => void
}

const blessingColors = [
  '#f43f5e', '#8b5cf6', '#0ea5e9', '#10b981', '#f59e0b', '#ec4899', '#06b6d4', '#a78bfa'
]

const initialBlessings: Blessing[] = [
  { 
    id: '1', 
    author: '小鱼', 
    content: '祝你们永远幸福！🎉', 
    createdAt: '2025-02-14', 
    color: '#f43f5e',
    likes: 12
  },
  { 
    id: '2', 
    author: '老王', 
    content: '百年好合，早生贵子！', 
    createdAt: '2025-02-10', 
    color: '#8b5cf6',
    likes: 8
  },
  { 
    id: '3', 
    author: '小美', 
    content: '看到你们的甜蜜日常，我也相信爱情了 💕', 
    createdAt: '2025-02-08', 
    color: '#ec4899',
    likes: 15
  },
  { 
    id: '4', 
    author: '阿泽', 
    content: '程序员的爱情也可以这么浪漫！', 
    createdAt: '2025-02-05', 
    color: '#0ea5e9',
    likes: 6
  },
  { 
    id: '5', 
    author: '匿名好友', 
    content: '要一直一直在一起哦！', 
    createdAt: '2025-02-01', 
    color: '#10b981',
    likes: 20
  },
]

export function BlessingBoard({ onBack }: BlessingBoardProps) {
  const [blessings, setBlessings] = useState<Blessing[]>(initialBlessings)
  const [newBlessing, setNewBlessing] = useState('')
  const [authorName, setAuthorName] = useState('')
  const [selectedColor, setSelectedColor] = useState(blessingColors[0])
  const [showForm, setShowForm] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [blessings])

  const addBlessing = () => {
    if (!newBlessing.trim()) return
    const blessing: Blessing = {
      id: Date.now().toString(),
      author: authorName.trim() || '匿名好友',
      content: newBlessing.trim(),
      createdAt: new Date().toLocaleDateString('zh-CN'),
      color: selectedColor,
      likes: 0,
    }
    setBlessings([...blessings, blessing])
    setNewBlessing('')
    setAuthorName('')
    setShowForm(false)
  }

  const likeBlessing = (id: string) => {
    setBlessings(blessings.map(b => 
      b.id === id ? { ...b, likes: b.likes + 1 } : b
    ))
  }

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      {/* 顶部导航 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 glass border-b border-border/50"
      >
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-text-secondary hover:text-text transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">返回</span>
          </button>
          <h1 className="text-xl font-bold bg-gradient-to-r from-rose to-primary bg-clip-text text-transparent">
            祝福板
          </h1>
          <div className="w-20" />
        </div>
      </motion.div>

      {/* 内容区域 */}
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-8 flex flex-col">
        {/* 头部介绍 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-rose/20 to-pink/20 mb-4 relative">
            <Heart size={32} className="text-rose" />
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 rounded-full bg-rose/10"
            />
          </div>
          <h2 className="text-2xl font-bold text-text mb-2">写下你们的祝福</h2>
          <p className="text-text-muted">来自朋友们的温馨祝福</p>
        </motion.div>

        {/* 祝福墙 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex-1 glass-card p-6 mb-6 overflow-hidden flex flex-col"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <MessageCircle size={18} className="text-primary" />
              <span className="text-sm font-medium text-text">{blessings.length} 条祝福</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-text-muted">
              <Sparkles size={12} className="text-amber" />
              <span>实时更新</span>
            </div>
          </div>

          {/* 祝福列表 */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
            <AnimatePresence>
              {blessings.map((blessing, index) => (
                <motion.div
                  key={blessing.id}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  className="group"
                >
                  <div className="flex items-start gap-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium text-sm flex-shrink-0"
                      style={{ background: blessing.color }}
                    >
                      {blessing.author.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="glass-card p-3 relative" style={{ borderLeft: `3px solid ${blessing.color}` }}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-text">{blessing.author}</span>
                          <span className="text-xs text-text-dim">{blessing.createdAt}</span>
                        </div>
                        <p className="text-sm text-text-secondary leading-relaxed">{blessing.content}</p>
                        
                        {/* 点赞 */}
                        <button
                          onClick={() => likeBlessing(blessing.id)}
                          className="mt-2 flex items-center gap-1 text-xs text-text-muted hover:text-rose transition-colors"
                        >
                          <Heart size={12} className={blessing.likes > 0 ? 'fill-rose text-rose' : ''} />
                          <span>{blessing.likes > 0 ? blessing.likes : '点赞'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        </motion.div>

        {/* 添加祝福表单 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-rose/20 to-primary/20 border border-rose/20 hover:border-rose/40 transition-all flex items-center justify-center gap-2 text-rose"
            >
              <Send size={18} />
              <span className="font-medium">写下祝福</span>
            </button>
          ) : (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="glass-card p-4"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-surface flex items-center justify-center">
                  <User size={14} className="text-text-muted" />
                </div>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="你的名字（选填）"
                  className="flex-1 bg-transparent border-none text-sm text-text placeholder:text-text-muted focus:outline-none"
                />
              </div>
              <textarea
                value={newBlessing}
                onChange={(e) => setNewBlessing(e.target.value)}
                placeholder="写下你的祝福..."
                rows={3}
                className="w-full bg-transparent border-none resize-none text-sm text-text placeholder:text-text-muted focus:outline-none mb-3"
                autoFocus
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-text-muted">选择颜色:</span>
                  <div className="flex items-center gap-1">
                    {blessingColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`w-6 h-6 rounded-full transition-all ${
                          selectedColor === color ? 'ring-2 ring-offset-2 ring-offset-bg ring-primary scale-110' : 'hover:scale-105'
                        }`}
                        style={{ background: color }}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowForm(false)}
                    className="px-3 py-1.5 text-sm text-text-muted hover:text-text transition-colors"
                  >
                    取消
                  </button>
                  <button
                    onClick={addBlessing}
                    disabled={!newBlessing.trim()}
                    className="px-4 py-1.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dim disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5"
                  >
                    <Send size={14} />
                    发送
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default BlessingBoard
