import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Compass, MessageSquare, Users, Sparkles, Heart, 
  Zap, Globe, Send, ChevronLeft, MoreHorizontal,
  Phone, Image, Smile, Gift
} from 'lucide-react'
import PageTransition from '../components/ui/PageTransition'
import { useTheme } from '../hooks/useTheme'
import { useCommunity } from '../components/community/useCommunity'
import PostCreator from '../components/community/PostCreator'
import PostList from '../components/community/PostList'

type TabType = 'explore' | 'messages'

// 探索页面的功能卡片数据
const exploreCards = [
  { id: 'soul-match', title: '灵魂匹配', subtitle: '和懂你的人聊天', color: 'bg-blue-500', icon: Sparkles },
  { id: 'love-bell', title: '恋爱铃', subtitle: '当缘分靠近会响铃', color: 'bg-rose-500', icon: Heart },
  { id: 'group-party', title: '群聊派对', subtitle: '听听大家在聊什么', color: 'bg-violet-500', icon: Users },
  { id: 'voice-match', title: '语音匹配', subtitle: '今日剩余10次', color: 'bg-amber-500', icon: Zap },
]

// 消息列表数据
const messageList = [
  { id: 1, name: '蒙面Souler', avatar: '🎭', lastMessage: 'Hi，很高兴与你相遇...', time: '17:36', unread: 2, matchRate: 94 },
  { id: 2, name: '艺术家星球', avatar: '🎨', lastMessage: '欢迎来到蒙面小酒馆', time: '17:30', unread: 0, matchRate: 88 },
  { id: 3, name: '音乐达人', avatar: '🎵', lastMessage: '干杯🍻男女？', time: '17:25', unread: 1, matchRate: 82 },
  { id: 4, name: '旅行者', avatar: '🌍', lastMessage: '分享你的旅行故事', time: '16:45', unread: 0, matchRate: 76 },
  { id: 5, name: '美食家', avatar: '🍜', lastMessage: '推荐一家好吃的餐厅', time: '16:20', unread: 0, matchRate: 71 },
]

// 星球上的用户数据
const planetUsers = [
  { id: 1, name: '迷雾笼罩', x: '20%', y: '25%', size: 'small' },
  { id: 2, name: '最新人', x: '35%', y: '30%', size: 'medium' },
  { id: 3, name: '老牛想', x: '45%', y: '45%', size: 'large' },
  { id: 4, name: '小崔崔来了', x: '60%', y: '40%', size: 'medium' },
  { id: 5, name: '天王盖地虎', x: '25%', y: '55%', size: 'small' },
  { id: 6, name: '八爪', x: '50%', y: '60%', size: 'large' },
  { id: 7, name: '太阳当空照', x: '70%', y: '55%', size: 'medium' },
  { id: 8, name: '星星泡饭', x: '15%', y: '70%', size: 'small' },
  { id: 9, name: '熊熊Za', x: '40%', y: '75%', size: 'medium' },
  { id: 10, name: 'Sunshine', x: '55%', y: '80%', size: 'small' },
]

// 探索页面组件
function ExploreView({ themeConfig, onUserClick }: { 
  themeConfig: ReturnType<typeof useTheme>['themeConfig']
  onUserClick: (user: typeof planetUsers[0]) => void
}) {
  return (
    <div className="space-y-6">
      {/* 星球区域 */}
      <div 
        className="relative rounded-3xl overflow-hidden"
        style={{ 
          background: `radial-gradient(ellipse at center, ${themeConfig.colors.surface} 0%, ${themeConfig.colors.bg} 70%)`,
          height: '320px',
        }}
      >
        {/* 星球背景 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div 
            className="w-64 h-64 rounded-full opacity-30"
            style={{ 
              background: `radial-gradient(circle, ${themeConfig.colors.primary}20 0%, transparent 70%)`,
            }}
          />
        </div>
        
        {/* 星球上的用户 */}
        {planetUsers.map((user, index) => (
          <motion.button
            key={user.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onUserClick(user)}
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
            style={{ left: user.x, top: user.y }}
          >
            <div className="flex flex-col items-center gap-1">
              <div 
                className={`rounded-full flex items-center justify-center transition-transform hover:scale-110 ${
                  user.size === 'large' ? 'w-10 h-10' : user.size === 'medium' ? 'w-8 h-8' : 'w-6 h-6'
                }`}
                style={{ 
                  background: `${themeConfig.colors.primary}${user.size === 'large' ? '40' : user.size === 'medium' ? '30' : '20'}`,
                  border: `2px solid ${themeConfig.colors.primary}${user.size === 'large' ? '60' : '40'}`,
                }}
              >
                <span className={`text-white ${user.size === 'large' ? 'text-xs' : 'text-[10px]'}`}>
                  {user.name.charAt(0)}
                </span>
              </div>
              <span 
                className="text-[10px] whitespace-nowrap"
                style={{ color: themeConfig.colors.textMuted }}
              >
                {user.name}
              </span>
            </div>
          </motion.button>
        ))}
        
        {/* 在线人数 */}
        <div className="absolute bottom-4 left-0 right-0 text-center">
          <span 
            className="text-sm"
            style={{ color: themeConfig.colors.textMuted }}
          >
            当前 <span style={{ color: themeConfig.colors.primary }}>10,980,448</span> 人在线
          </span>
        </div>
      </div>

      {/* 功能卡片网格 */}
      <div className="grid grid-cols-2 gap-3">
        {exploreCards.map((card, index) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`${card.color} rounded-2xl p-4 cursor-pointer`}
            style={{ aspectRatio: '1/0.8' }}
          >
            <div className="flex flex-col h-full justify-between">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <card.icon size={20} className="text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-base">{card.title}</h3>
                <p className="text-white/70 text-xs mt-1">{card.subtitle}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// 消息列表组件
function MessageListView({ 
  themeConfig, 
  onChatClick 
}: { 
  themeConfig: ReturnType<typeof useTheme>['themeConfig']
  onChatClick: (chat: typeof messageList[0]) => void
}) {
  return (
    <div className="space-y-2">
      {messageList.map((chat, index) => (
        <motion.button
          key={chat.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          onClick={() => onChatClick(chat)}
          className="w-full flex items-center gap-3 p-3 rounded-2xl transition-colors"
          style={{ 
            background: themeConfig.colors.surface,
            border: `1px solid ${themeConfig.colors.border}`,
          }}
        >
          {/* 头像 */}
          <div className="relative">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
              style={{ background: `${themeConfig.colors.primary}20` }}
            >
              {chat.avatar}
            </div>
            {chat.unread > 0 && (
              <div 
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs text-white"
                style={{ background: themeConfig.colors.rose }}
              >
                {chat.unread}
              </div>
            )}
          </div>
          
          {/* 内容 */}
          <div className="flex-1 text-left">
            <div className="flex items-center justify-between">
              <h3 
                className="font-semibold text-sm"
                style={{ color: themeConfig.colors.text }}
              >
                {chat.name}
              </h3>
              <span 
                className="text-xs"
                style={{ color: themeConfig.colors.textMuted }}
              >
                {chat.time}
              </span>
            </div>
            <p 
              className="text-xs mt-1 line-clamp-1"
              style={{ color: themeConfig.colors.textMuted }}
            >
              {chat.lastMessage}
            </p>
            <div 
              className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-[10px]"
              style={{ 
                background: `${themeConfig.colors.primary}20`,
                color: themeConfig.colors.primary,
              }}
            >
              匹配度 {chat.matchRate}%
            </div>
          </div>
        </motion.button>
      ))}
    </div>
  )
}

// 聊天界面组件
function ChatView({ 
  chat, 
  themeConfig, 
  onBack 
}: { 
  chat: typeof messageList[0]
  themeConfig: ReturnType<typeof useTheme>['themeConfig']
  onBack: () => void
}) {
  const [inputMessage, setInputMessage] = useState('')
  const [messages, setMessages] = useState([
    { id: 1, type: 'system', content: 'Ta来自艺术家星球' },
    { id: 2, type: 'match', content: `匹配度 ${chat.matchRate}%` },
    { id: 3, type: 'info', content: 'Ta的引力签：游泳，羽毛球，跑步，网球' },
    { id: 4, type: 'info', content: '你们属于风象星座哦' },
    { id: 5, type: 'info', content: '跟ta聊聊下雨天你最喜欢做的事情吧' },
    { id: 6, type: 'banner', title: '欢迎来到「蒙面小酒馆」', subtitle: '小酌一杯，和Ta猜拳，赢了可以选一个系统推荐的问题，让Ta回答' },
    { id: 7, type: 'received', content: 'Hi，很高兴与你相遇在蒙面小酒馆，我们在60分钟内点亮Soulmate中的第一个字母就能进入揭面时刻哦' },
    { id: 8, type: 'received', content: '干杯🍻男女？' },
  ])

  const handleSend = () => {
    if (!inputMessage.trim()) return
    setMessages(prev => [...prev, { id: Date.now(), type: 'sent', content: inputMessage }])
    setInputMessage('')
  }

  return (
    <div className="flex flex-col h-full" style={{ minHeight: 'calc(100vh - 200px)' }}>
      {/* 头部 */}
      <div 
        className="flex items-center justify-between p-4 rounded-2xl mb-4"
        style={{ 
          background: themeConfig.colors.surface,
          border: `1px solid ${themeConfig.colors.border}`,
        }}
      >
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="p-2 rounded-full transition-colors"
            style={{ background: `${themeConfig.colors.primary}15` }}
          >
            <ChevronLeft size={20} style={{ color: themeConfig.colors.primary }} />
          </button>
          <div>
            <h3 
              className="font-bold"
              style={{ color: themeConfig.colors.text }}
            >
              {chat.name}
            </h3>
            <p 
              className="text-xs"
              style={{ color: themeConfig.colors.textMuted }}
            >
              剩余时间 59:52
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span 
            className="px-3 py-1 rounded-full text-xs"
            style={{ 
              background: `${themeConfig.colors.primary}20`,
              color: themeConfig.colors.primary,
            }}
          >
            小酒馆
          </span>
          <button 
            className="p-2 rounded-full transition-colors"
            style={{ background: `${themeConfig.colors.rose}15` }}
          >
            <span className="text-rose-500">×</span>
          </button>
        </div>
      </div>

      {/* 消息区域 */}
      <div className="flex-1 space-y-3 overflow-y-auto pb-4">
        {messages.map((msg) => {
          if (msg.type === 'system') {
            return (
              <div key={msg.id} className="text-center">
                <span 
                  className="inline-block px-3 py-1 rounded-full text-xs"
                  style={{ 
                    background: themeConfig.colors.surface,
                    color: themeConfig.colors.textMuted,
                    border: `1px solid ${themeConfig.colors.border}`,
                  }}
                >
                  {msg.content}
                </span>
              </div>
            )
          }
          if (msg.type === 'match') {
            return (
              <div key={msg.id} className="text-center">
                <span 
                  className="inline-block px-3 py-1 rounded-full text-xs"
                  style={{ 
                    background: `linear-gradient(135deg, ${themeConfig.colors.primary}, ${themeConfig.colors.accent})`,
                    color: 'white',
                  }}
                >
                  {msg.content}
                </span>
              </div>
            )
          }
          if (msg.type === 'info') {
            return (
              <div key={msg.id} className="flex items-center gap-2">
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ background: themeConfig.colors.primary }}
                />
                <span 
                  className="text-sm"
                  style={{ color: themeConfig.colors.textSecondary }}
                >
                  {msg.content}
                </span>
              </div>
            )
          }
          if (msg.type === 'banner') {
            return (
              <div 
                key={msg.id}
                className="rounded-2xl p-4"
                style={{ 
                  background: `linear-gradient(135deg, ${themeConfig.colors.surface}, ${themeConfig.colors.surfaceAlt})`,
                  border: `1px solid ${themeConfig.colors.border}`,
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 
                    className="font-bold"
                    style={{ color: themeConfig.colors.text }}
                  >
                    {msg.title}
                  </h4>
                  <button 
                    className="px-3 py-1 rounded-full text-xs"
                    style={{ 
                      background: `${themeConfig.colors.primary}20`,
                      color: themeConfig.colors.primary,
                    }}
                  >
                    查看详情
                  </button>
                </div>
                <p 
                  className="text-xs"
                  style={{ color: themeConfig.colors.textMuted }}
                >
                  {msg.subtitle}
                </p>
              </div>
            )
          }
          if (msg.type === 'received') {
            return (
              <div key={msg.id} className="flex items-start gap-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: `${themeConfig.colors.primary}20` }}
                >
                  <span className="text-lg">{chat.avatar}</span>
                </div>
                <div 
                  className="max-w-[70%] rounded-2xl rounded-tl-sm px-4 py-3"
                  style={{ 
                    background: themeConfig.colors.surface,
                    border: `1px solid ${themeConfig.colors.border}`,
                    color: themeConfig.colors.text,
                  }}
                >
                  <p className="text-sm">{msg.content}</p>
                </div>
              </div>
            )
          }
          if (msg.type === 'sent') {
            return (
              <div key={msg.id} className="flex items-start gap-3 justify-end">
                <div 
                  className="max-w-[70%] rounded-2xl rounded-tr-sm px-4 py-3"
                  style={{ 
                    background: themeConfig.colors.primary,
                    color: 'white',
                  }}
                >
                  <p className="text-sm">{msg.content}</p>
                </div>
              </div>
            )
          }
          return null
        })}
      </div>

      {/* 输入区域 */}
      <div 
        className="p-3 rounded-2xl"
        style={{ 
          background: themeConfig.colors.surface,
          border: `1px solid ${themeConfig.colors.border}`,
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="输入消息..."
            className="flex-1 px-4 py-2 rounded-full text-sm outline-none"
            style={{ 
              background: themeConfig.colors.bg,
              color: themeConfig.colors.text,
            }}
          />
          <button 
            onClick={handleSend}
            className="p-2 rounded-full"
            style={{ background: themeConfig.colors.primary }}
          >
            <Send size={18} className="text-white" />
          </button>
        </div>
        <div className="flex items-center justify-around">
          <button className="p-2 rounded-full" style={{ color: themeConfig.colors.textMuted }}>
            <Phone size={20} />
          </button>
          <button className="p-2 rounded-full" style={{ color: themeConfig.colors.textMuted }}>
            <Image size={20} />
          </button>
          <button className="p-2 rounded-full" style={{ color: themeConfig.colors.textMuted }}>
            <Gift size={20} />
          </button>
          <button className="p-2 rounded-full" style={{ color: themeConfig.colors.textMuted }}>
            <MoreHorizontal size={20} />
          </button>
          <button className="p-2 rounded-full" style={{ color: themeConfig.colors.textMuted }}>
            <Smile size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Community() {
  const { themeConfig } = useTheme()
  const [activeTab, setActiveTab] = useState<TabType>('explore')
  const [selectedChat, setSelectedChat] = useState<typeof messageList[0] | null>(null)
  const {
    posts,
    comments,
    currentUser,
    isLoading,
    hasMore,
    loadMore,
    createPost,
    toggleLikePost,
    sharePost,
    loadComments,
    addComment,
    toggleLikeComment,
    refreshCurrentUser,
  } = useCommunity()

  // 当AI分身更新时刷新用户信息
  useEffect(() => {
    const handleStorageChange = () => {
      refreshCurrentUser()
    }
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [refreshCurrentUser])

  return (
    <PageTransition>
      <div 
        className="min-h-screen pb-24 md:pb-8"
        style={{ background: themeConfig.colors.bg }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ 
                    background: `linear-gradient(135deg, ${themeConfig.colors.primary}, ${themeConfig.colors.accent})`,
                    boxShadow: `0 8px 24px ${themeConfig.colors.primary}30`,
                  }}
                >
                  <Globe size={24} className="text-white" />
                </div>
                <div>
                  <h1 
                    className="text-2xl font-bold"
                    style={{ color: themeConfig.colors.text }}
                  >
                    元宇宙
                  </h1>
                  <p style={{ color: themeConfig.colors.textMuted }}>
                    探索虚拟世界，连接无限可能
                  </p>
                </div>
              </div>
            </div>

            {/* Tab Buttons */}
            <div 
              className="flex gap-2 p-1 rounded-xl"
              style={{ 
                background: themeConfig.colors.surface,
                border: `1px solid ${themeConfig.colors.border}`,
              }}
            >
              <button
                onClick={() => { setActiveTab('explore'); setSelectedChat(null) }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all"
                style={{
                  background: activeTab === 'explore' ? themeConfig.colors.primary : 'transparent',
                  color: activeTab === 'explore' ? 'white' : themeConfig.colors.textMuted,
                }}
              >
                <Compass size={18} />
                探索
              </button>
              <button
                onClick={() => setActiveTab('messages')}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all"
                style={{
                  background: activeTab === 'messages' ? themeConfig.colors.primary : 'transparent',
                  color: activeTab === 'messages' ? 'white' : themeConfig.colors.textMuted,
                }}
              >
                <MessageSquare size={18} />
                消息
              </button>
            </div>
          </motion.div>

          {/* Content Area */}
          <AnimatePresence mode="wait">
            {activeTab === 'explore' && (
              <motion.div
                key="explore"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <ExploreView 
                  themeConfig={themeConfig} 
                  onUserClick={(user) => console.log('Clicked user:', user)}
                />
              </motion.div>
            )}
            
            {activeTab === 'messages' && !selectedChat && (
              <motion.div
                key="messageList"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <MessageListView 
                  themeConfig={themeConfig}
                  onChatClick={setSelectedChat}
                />
              </motion.div>
            )}
            
            {activeTab === 'messages' && selectedChat && (
              <motion.div
                key="chat"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <ChatView 
                  chat={selectedChat}
                  themeConfig={themeConfig}
                  onBack={() => setSelectedChat(null)}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Original Community Content - Only show in explore tab and when not in chat */}
          {activeTab === 'explore' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-8"
            >
              <div 
                className="rounded-2xl p-4 mb-6"
                style={{
                  background: themeConfig.colors.surface,
                  border: `1px solid ${themeConfig.colors.border}`,
                  boxShadow: themeConfig.shadows.card,
                }}
              >
                <h3 
                  className="font-semibold text-sm mb-3"
                  style={{ color: themeConfig.colors.text }}
                >
                  社区动态
                </h3>
                
                {/* Post Creator */}
                <PostCreator
                  currentUser={currentUser}
                  themeConfig={themeConfig}
                  onSubmit={createPost}
                />

                {/* Posts List */}
                <PostList
                  posts={posts}
                  comments={comments}
                  isLoading={isLoading}
                  hasMore={hasMore}
                  themeConfig={themeConfig}
                  onLoadMore={loadMore}
                  onLikePost={toggleLikePost}
                  onSharePost={sharePost}
                  onLoadComments={loadComments}
                  onAddComment={addComment}
                  onLikeComment={toggleLikeComment}
                />
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </PageTransition>
  )
}
