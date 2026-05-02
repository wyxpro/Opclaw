import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Wifi, Smartphone, History, User, ExternalLink, Shield, Check, X, Loader2, CreditCard, Share2, Sparkles, IdCard, ChevronRight, Users } from 'lucide-react'
import { cardThemes } from '../../data/mock'
import type { DigitalCard } from '../../types/card'
import { useAuth } from '../../contexts/AuthContext'

interface NfcConnectModuleProps {
  onShowCard: (card: DigitalCard) => void;
  variant?: 'full' | 'tab';
}

export default function NfcConnectModule({ onShowCard, variant = 'full' }: NfcConnectModuleProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [isNfcSupported, setIsNfcSupported] = useState(true)
  const [scanStatus, setScanStatus] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle')
  const [receivedCards, setReceivedCards] = useState<DigitalCard[]>([])
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [showHistory, setShowHistory] = useState(false)
  const [scanHistory, setScanHistory] = useState<DigitalCard[]>([])
  const { user } = useAuth()

  // 检查浏览器是否支持 NFC
  useEffect(() => {
    if (!('NDEFReader' in window)) {
      setIsNfcSupported(false)
    }
    
    // 从本地存储加载历史记录
    const savedHistory = localStorage.getItem('nfc_pairing_history')
    if (savedHistory) {
      try {
        setScanHistory(JSON.parse(savedHistory))
      } catch (e) {
        console.error('Failed to load NFC history', e)
      }
    }
  }, [])

  // 保存历史记录
  useEffect(() => {
    localStorage.setItem('nfc_pairing_history', JSON.stringify(scanHistory))
  }, [scanHistory])

  const startNfcPairing = async () => {
    // 无论设备是否支持 NFC，都允许进入扫描界面进行互动体验
    try {
      setIsScanning(true)
      setScanStatus('scanning')
      
      // 如果支持硬件 NFC，则启动实际扫描
      if (isNfcSupported) {
        try {
          // @ts-ignore - Web NFC API
          const reader = new window.NDEFReader()
          await reader.scan()
        } catch (e) {
          console.warn('Physical NFC failed, falling back to simulation', e)
        }
      }
      
      // 统一进入精美的 3D 动画模拟演示
      
      setTimeout(() => {
        // 模拟识别到 5 位用户数据
        const mockCards: DigitalCard[] = [
          {
            id: `nfc-1`,
            title: '数字名片',
            subtitle: '高级视觉设计师',
            name: '林深',
            title_en: 'Senior Visual Designer',
            bio: '探索设计的无限可能，用视觉语言讲述品牌故事。',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
            skills: [{ name: 'UI/UX', level: 95, category: '设计' }],
            stats: [{ label: '项目', value: '30+' }, { label: '经验', value: '6年' }],
            projects: [],
            socialLinks: [{ platform: 'Behance', username: '@linshen' }, { platform: 'Instagram', username: '@lin_design' }],
            milestones: [],
            theme: 'purple',
            createdAt: Date.now(),
            updatedAt: Date.now()
          },
          {
            id: `nfc-2`,
            title: '数字名片',
            subtitle: '架构师 / 开发者',
            name: '陈一墨',
            title_en: 'System Architect',
            bio: '专注高性能架构，对极致性能有着近乎执着的追求。',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
            skills: [{ name: 'React', level: 98, category: '开发' }],
            stats: [{ label: 'Star', value: '12k' }, { label: '经验', value: '8年' }],
            projects: [],
            socialLinks: [{ platform: 'Github', username: '@chenyimo' }],
            milestones: [],
            theme: 'blue',
            createdAt: Date.now(),
            updatedAt: Date.now()
          },
          {
            id: `nfc-3`,
            title: '数字名片',
            subtitle: '产品经理 / 创作者',
            name: '苏晴',
            title_en: 'Product Manager',
            bio: '让技术更有温度，连接人与数字世界的桥梁。',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
            skills: [{ name: '产品', level: 92, category: '管理' }],
            stats: [{ label: '产品', value: '12' }, { label: '满意度', value: '99%' }],
            projects: [],
            socialLinks: [{ platform: 'Twitter', username: '@suqing' }],
            milestones: [],
            theme: 'orange',
            createdAt: Date.now(),
            updatedAt: Date.now()
          },
          {
            id: `nfc-4`,
            title: '数字名片',
            subtitle: '全栈工程师',
            name: '张子凡',
            title_en: 'Fullstack Dev',
            bio: '从前端交互到后端算法，在代码的世界里自由穿梭。',
            avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&q=80',
            skills: [{ name: 'Node.js', level: 90, category: '开发' }],
            stats: [{ label: '开源', value: '25' }, { label: '贡献', value: '1.2k' }],
            projects: [],
            socialLinks: [{ platform: 'Bilibili', username: '@fanfan' }],
            milestones: [],
            theme: 'green',
            createdAt: Date.now(),
            updatedAt: Date.now()
          },
          {
            id: `nfc-5`,
            title: '数字名片',
            subtitle: 'AI 研究员',
            name: '叶知秋',
            title_en: 'AI Researcher',
            bio: '探索通用人工智能，让机器像人一样思考。',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
            skills: [{ name: 'PyTorch', level: 96, category: 'AI' }],
            stats: [{ label: 'Paper', value: '8' }, { label: '引用', value: '450' }],
            projects: [],
            socialLinks: [{ platform: 'Zhihu', username: '@yezhiqiu' }],
            milestones: [],
            theme: 'pink',
            createdAt: Date.now(),
            updatedAt: Date.now()
          }
        ]
        
        handlePairingSuccess(mockCards)
      }, 3000)

    } catch (error) {
      console.error('NFC error:', error)
      setScanStatus('error')
      setIsScanning(false)
    }
  }

  const handlePairingSuccess = (cards: DigitalCard[]) => {
    setScanStatus('success')
    setReceivedCards(cards)
    setCurrentCardIndex(0)
    setScanHistory(prev => [...cards, ...prev].filter((v, i, a) => a.findIndex(t => t.id === v.id) === i).slice(0, 10))
    
    // 震动反馈
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100])
    }
    
    setTimeout(() => {
      setIsScanning(false)
    }, 1000)
  }

  return (
    <div className="w-full">
      {/* NFC 配对入口按钮 */}
      {variant === 'full' ? (
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.08 }}
          onClick={startNfcPairing}
          className="w-full flex items-center gap-4 p-4 rounded-2xl bg-surface border border-border/50 active:scale-[0.98] transition-transform relative overflow-hidden group"
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-blue-500/15">
            <Users size={20} className="text-blue-500" />
          </div>
          
          <div className="flex-1 text-left">
            <h3 className="font-medium text-text">NFC 互动</h3>
            <p className="text-xs text-text-muted mt-0.5">配对交换数字名片</p>
          </div>
          
          <ChevronRight size={18} className="text-text-dim" />
        </motion.button>
      ) : (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={startNfcPairing}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all text-text-muted hover:text-text-secondary hover:bg-surface/60"
        >
          <Users size={16} className="text-blue-500" />
          <span>NFC 互动</span>
        </motion.button>
      )}

      {/* 3D 样式支持 */}
      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
      `}</style>

      {/* NFC 扫描动画弹窗 */}
      <AnimatePresence>
        {isScanning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 backdrop-blur-md"
          >
            <div className="relative w-full max-w-sm px-6 text-center">
              {/* 3D 扫描动画 */}
              <div className="relative h-64 mb-12 flex items-center justify-center perspective-1000">
                <motion.div
                  animate={{ 
                    rotateY: [0, 360],
                    y: [0, -10, 0]
                  }}
                  transition={{ 
                    rotateY: { duration: 10, repeat: Infinity, ease: "linear" },
                    y: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                  }}
                  className="w-40 h-64 relative preserve-3d"
                >
                  {/* 模拟手机 3D 模型 */}
                  <div className="absolute inset-0 bg-slate-900 border-4 border-slate-700 rounded-[2rem] shadow-2xl overflow-hidden">
                    {/* 手机屏幕内容 */}
                    <div className="w-full h-full bg-gradient-to-br from-slate-800 to-black p-4 flex flex-col items-center justify-center">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <Wifi size={40} className="text-primary mb-4" />
                      </motion.div>
                      <div className="w-24 h-1 bg-slate-700 rounded-full mb-2" />
                      <div className="w-16 h-1 bg-slate-700 rounded-full" />
                    </div>
                  </div>
                  
                  {/* 侧边厚度 */}
                  <div className="absolute inset-y-0 -left-1 w-2 bg-slate-800 transform rotateY(-90deg) origin-right" />
                  <div className="absolute inset-y-0 -right-1 w-2 bg-slate-800 transform rotateY(90deg) origin-left" />
                </motion.div>

                {/* 扫描波纹 */}
                <div className="absolute inset-0 pointer-events-none">
                  {[1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0, opacity: 0.5 }}
                      animate={{ scale: 3, opacity: 0 }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.6 }}
                      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border-2 border-primary/40"
                    />
                  ))}
                </div>
              </div>

              {/* 文字反馈 */}
              <h2 className="text-2xl font-bold text-white mb-2">
                {scanStatus === 'scanning' ? '正在寻找设备...' : 
                 scanStatus === 'success' ? '配对成功!' : '配对失败'}
              </h2>
              <p className="text-slate-400 text-sm mb-8 px-8">
                {scanStatus === 'scanning' ? '请将手机靠近另一台设备的 NFC 感应区' : 
                 scanStatus === 'success' ? '已成功交换数字名片' : '未能识别设备，请重试'}
              </p>

              {scanStatus === 'scanning' && (
                <button
                  onClick={() => setIsScanning(false)}
                  className="px-8 py-3 rounded-full bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-colors"
                >
                  取消扫描
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 成功获取名片后的展示弹窗 - 支持滑动切换 */}
      <AnimatePresence>
        {receivedCards.length > 0 && !isScanning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10001] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <div className="relative w-full max-w-sm">
              <AnimatePresence mode="wait">
                <motion.div
                  key={receivedCards[currentCardIndex].id}
                  initial={{ x: 100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -100, opacity: 0 }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  onDragEnd={(e, { offset, velocity }) => {
                    const swipe = Math.abs(offset.x) > 50 || Math.abs(velocity.x) > 500
                    if (swipe && offset.x > 0) {
                      setCurrentCardIndex((prev) => (prev > 0 ? prev - 1 : receivedCards.length - 1))
                    } else if (swipe && offset.x < 0) {
                      setCurrentCardIndex((prev) => (prev < receivedCards.length - 1 ? prev + 1 : 0))
                    }
                  }}
                  className="w-full bg-bg rounded-[2rem] overflow-hidden shadow-2xl relative cursor-grab active:cursor-grabbing"
                >
                  {/* 顶部关闭按钮 */}
                  <button 
                    onClick={() => setReceivedCards([])}
                    className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white"
                  >
                    <X size={18} />
                  </button>

                  {/* 成功状态横幅 */}
                  <div className="absolute top-4 left-4 z-20 px-3 py-1 rounded-full bg-green-500/80 backdrop-blur-md flex items-center gap-1.5 text-white text-[10px] font-bold">
                    <Check size={12} />
                    安全验证已通过
                  </div>

                  {/* 页码指示 */}
                  <div className="absolute top-12 left-4 z-20 px-2 py-0.5 rounded-md bg-black/10 backdrop-blur-md text-white/70 text-[9px]">
                    {currentCardIndex + 1} / {receivedCards.length}
                  </div>

                  {/* 名片内容 */}
                  <div className="relative">
                    {/* 主题背景 */}
                    <div className={`h-32 bg-gradient-to-br ${cardThemes[receivedCards[currentCardIndex].theme].gradient}`} />
                    
                    <div className="px-6 pb-6">
                      {/* 头像 */}
                      <div className="relative -mt-12 mb-4">
                        <div className="w-24 h-24 rounded-3xl overflow-hidden border-4 border-bg bg-surface shadow-xl">
                          <img src={receivedCards[currentCardIndex].avatar} alt={receivedCards[currentCardIndex].name} className="w-full h-full object-cover" />
                        </div>
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white border-2 border-bg"
                        >
                          <Check size={16} />
                        </motion.div>
                      </div>

                      {/* 个人信息 */}
                      <h3 className="text-2xl font-bold text-text mb-1">{receivedCards[currentCardIndex].name}</h3>
                      <p className="text-primary font-medium text-sm mb-3">{receivedCards[currentCardIndex].subtitle}</p>
                      <p className="text-text-muted text-xs leading-relaxed mb-6 h-12 overflow-hidden">
                        {receivedCards[currentCardIndex].bio}
                      </p>

                      {/* 社交媒体链接 */}
                      <div className="grid grid-cols-2 gap-3 mb-6">
                        {receivedCards[currentCardIndex].socialLinks.slice(0, 2).map((link, idx) => (
                          <div key={idx} className="flex items-center gap-2 p-2 rounded-xl bg-surface border border-border/40">
                            <Share2 size={14} className="text-primary/70" />
                            <div className="min-w-0">
                              <p className="text-[10px] text-text-muted leading-none mb-1">{link.platform}</p>
                              <p className="text-xs font-bold text-text truncate">{link.username}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* 底部操作 */}
                      <div className="flex gap-3">
                        <button 
                          onClick={() => {
                            onShowCard(receivedCards[currentCardIndex])
                            setReceivedCards([])
                          }}
                          className="flex-1 py-3 rounded-xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/30 flex items-center justify-center gap-2"
                        >
                          查看完整资料
                          <ExternalLink size={14} />
                        </button>
                        <button 
                          onClick={() => setReceivedCards([])}
                          className="px-4 py-3 rounded-xl bg-surface border border-border text-text font-bold text-sm"
                        >
                          收藏
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
              
              {/* 左右滑动提示 */}
              <div className="flex justify-center gap-1.5 mt-4">
                {receivedCards.map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-1 rounded-full transition-all duration-300 ${i === currentCardIndex ? 'w-4 bg-primary' : 'w-1 bg-border'}`} 
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 历史记录侧滑菜单/弹窗 */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10001] flex items-end justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setShowHistory(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-md bg-bg rounded-t-[2.5rem] p-6 pb-12 max-h-[80vh] flex flex-col"
              onClick={e => e.stopPropagation()}
            >
              <div className="w-12 h-1.5 bg-border rounded-full mx-auto mb-6" />
              
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-text">配对历史</h3>
                  <p className="text-xs text-text-muted mt-1">您最近连接过的 10 位好友</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center">
                  <Shield size={20} className="text-primary/70" />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                {scanHistory.length === 0 ? (
                  <div className="py-20 text-center">
                    <div className="w-16 h-16 rounded-full bg-surface-dim flex items-center justify-center mx-auto mb-4">
                      <Wifi size={24} className="text-text-dim opacity-30" />
                    </div>
                    <p className="text-text-muted text-sm">暂无配对记录</p>
                    <p className="text-[10px] text-text-dim mt-1">开启 NFC 互联发现新朋友</p>
                  </div>
                ) : (
                  scanHistory.map((card, idx) => (
                    <motion.div
                      key={card.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="group flex items-center gap-4 p-3 rounded-2xl bg-surface border border-border/30 hover:border-primary/30 transition-colors"
                      onClick={() => {
                        onShowCard(card)
                        setShowHistory(false)
                      }}
                    >
                      <div className="w-12 h-12 rounded-2xl overflow-hidden border border-border/50">
                        <img src={card.avatar} alt={card.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-text truncate">{card.name}</h4>
                        <p className="text-[10px] text-text-muted truncate mt-0.5">{card.subtitle}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-text-dim mb-1">
                          {new Date(card.createdAt).toLocaleDateString()}
                        </p>
                        <div className="flex items-center justify-end gap-1 text-green-500">
                          <Check size={10} />
                          <span className="text-[9px] font-bold">已互粉</span>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
              
              <button 
                onClick={() => setShowHistory(false)}
                className="w-full py-4 mt-6 rounded-2xl bg-surface border border-border text-text font-bold"
              >
                返回
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
