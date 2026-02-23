import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Sparkles, Plus, Check, X, Star, Trash2, Edit2 } from 'lucide-react'

interface Wish {
  id: string
  content: string
  completed: boolean
  createdAt: string
  priority: 'low' | 'medium' | 'high'
}

interface WishListProps {
  onBack: () => void
}

const initialWishes: Wish[] = [
  { id: '1', content: '一起去冰岛看极光', completed: false, createdAt: '2025-01-15', priority: 'high' },
  { id: '2', content: '学做对方最爱吃的菜', completed: true, createdAt: '2025-01-10', priority: 'medium' },
  { id: '3', content: '养一只宠物猫', completed: false, createdAt: '2025-01-20', priority: 'low' },
  { id: '4', content: '去日本看樱花', completed: false, createdAt: '2025-02-01', priority: 'high' },
  { id: '5', content: '一起完成1000片拼图', completed: false, createdAt: '2025-02-10', priority: 'medium' },
]

const priorityColors = {
  high: { bg: 'bg-rose/10', border: 'border-rose/30', text: 'text-rose', dot: 'bg-rose' },
  medium: { bg: 'bg-amber/10', border: 'border-amber/30', text: 'text-amber', dot: 'bg-amber' },
  low: { bg: 'bg-emerald/10', border: 'border-emerald/30', text: 'text-emerald', dot: 'bg-emerald' },
}

const priorityLabels = {
  high: '高优先级',
  medium: '中优先级',
  low: '低优先级',
}

export function WishList({ onBack }: WishListProps) {
  const [wishes, setWishes] = useState<Wish[]>(initialWishes)
  const [newWish, setNewWish] = useState('')
  const [newPriority, setNewPriority] = useState<'low' | 'medium' | 'high'>('medium')
  const [showInput, setShowInput] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')

  const completedCount = wishes.filter(w => w.completed).length
  const progress = wishes.length > 0 ? (completedCount / wishes.length) * 100 : 0

  const addWish = () => {
    if (!newWish.trim()) return
    const wish: Wish = {
      id: Date.now().toString(),
      content: newWish.trim(),
      completed: false,
      createdAt: new Date().toISOString().split('T')[0],
      priority: newPriority,
    }
    setWishes([wish, ...wishes])
    setNewWish('')
    setShowInput(false)
  }

  const toggleWish = (id: string) => {
    setWishes(wishes.map(w => w.id === id ? { ...w, completed: !w.completed } : w))
  }

  const deleteWish = (id: string) => {
    if (confirm('确定要删除这个愿望吗？')) {
      setWishes(wishes.filter(w => w.id !== id))
    }
  }

  const startEdit = (wish: Wish) => {
    setEditingId(wish.id)
    setEditContent(wish.content)
  }

  const saveEdit = () => {
    if (editContent.trim()) {
      setWishes(wishes.map(w => w.id === editingId ? { ...w, content: editContent.trim() } : w))
    }
    setEditingId(null)
    setEditContent('')
  }

  return (
    <div className="min-h-screen bg-bg">
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
            许愿清单
          </h1>
          <div className="w-20" />
        </div>
      </motion.div>

      {/* 内容区域 */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 头部介绍 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-6"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-cyan/20 to-blue/20 mb-4">
            <Sparkles size={32} className="text-cyan" />
          </div>
          <h2 className="text-2xl font-bold text-text mb-2">我们的愿望清单</h2>
          <p className="text-text-muted mb-4">一起完成这些美好的愿望</p>
          
          {/* 添加新愿望 - 移到标题下方 */}
          {!showInput ? (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              onClick={() => setShowInput(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium shadow-lg shadow-cyan/20 hover:shadow-xl hover:shadow-cyan/30 transition-all"
            >
              <Plus size={20} />
              <span>添加新愿望</span>
            </motion.button>
          ) : (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="glass-card p-4 text-left"
            >
              <textarea
                value={newWish}
                onChange={(e) => setNewWish(e.target.value)}
                placeholder="写下你们的愿望..."
                rows={2}
                className="w-full bg-transparent border-none resize-none text-text placeholder:text-text-muted focus:outline-none mb-3"
                autoFocus
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {(['high', 'medium', 'low'] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => setNewPriority(p)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                        newPriority === p 
                          ? `${priorityColors[p].bg} ${priorityColors[p].text} border ${priorityColors[p].border}` 
                          : 'text-text-muted hover:text-text'
                      }`}
                    >
                      {priorityLabels[p]}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowInput(false)}
                    className="px-3 py-1.5 text-sm text-text-muted hover:text-text transition-colors"
                  >
                    取消
                  </button>
                  <button
                    onClick={addWish}
                    disabled={!newWish.trim()}
                    className="px-4 py-1.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dim disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    添加
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* 进度条 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="glass-card p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-text-secondary">完成进度</span>
            <span className="text-sm font-medium text-primary">{completedCount} / {wishes.length}</span>
          </div>
          <div className="h-3 bg-surface rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, delay: 0.3 }}
              className="h-full bg-gradient-to-r from-cyan via-primary to-blue rounded-full"
            />
          </div>
          <p className="text-center text-text-muted text-sm mt-3">
            已完成 {Math.round(progress)}% 的愿望
          </p>
        </motion.div>

        {/* 愿望列表 */}
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {wishes.map((wish, index) => (
              <motion.div
                key={wish.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                layout
                className={`glass-card p-4 group ${wish.completed ? 'opacity-60' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleWish(wish.id)}
                    className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      wish.completed 
                        ? 'bg-emerald border-emerald' 
                        : 'border-text-muted hover:border-primary'
                    }`}
                  >
                    {wish.completed && <Check size={12} className="text-white" />}
                  </button>
                  <div className="flex-1 min-w-0">
                    {editingId === wish.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                          className="flex-1 bg-surface rounded-lg px-3 py-1.5 text-sm text-text border border-border focus:border-primary focus:outline-none"
                          autoFocus
                        />
                        <button
                          onClick={saveEdit}
                          className="p-1.5 rounded-lg text-emerald hover:bg-emerald/10"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="p-1.5 rounded-lg text-text-muted hover:bg-surface"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <p className={`text-sm ${wish.completed ? 'line-through text-text-muted' : 'text-text'}`}>
                          {wish.content}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${priorityColors[wish.priority].bg} ${priorityColors[wish.priority].text} border ${priorityColors[wish.priority].border}`}>
                            <span className={`w-1 h-1 rounded-full ${priorityColors[wish.priority].dot}`} />
                            {priorityLabels[wish.priority]}
                          </span>
                          <span className="text-xs text-text-dim">{wish.createdAt}</span>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => startEdit(wish)}
                      className="p-1.5 rounded-lg text-text-muted hover:text-primary hover:bg-primary/10"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => deleteWish(wish.id)}
                      className="p-1.5 rounded-lg text-text-muted hover:text-rose hover:bg-rose/10"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {wishes.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Star size={48} className="mx-auto text-text-muted mb-4" />
            <p className="text-text-muted">还没有愿望</p>
            <p className="text-text-dim text-sm mt-1">点击上方按钮添加你们的第一个愿望</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default WishList
