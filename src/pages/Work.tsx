import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  PenTool, ShoppingCart, Plus, Bookmark,
  Video, FileText, Calendar, Users, TrendingUp, Package,
  DollarSign, Eye, ThumbsUp, MessageSquare, Share2, Edit3,
  Trash2, Link as LinkIcon, BarChart3
} from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import PageTransition from '../components/ui/PageTransition'
import { useTheme } from '../hooks/useTheme'
import { TreasureBox } from '../components/entertainment/EntertainmentModules'

// 标签配置
const tabs = [
  { id: 'media', label: '新媒体', icon: PenTool },
  { id: 'ecommerce', label: '电商运营', icon: ShoppingCart },
  { id: 'bookmarks', label: '百宝箱', icon: Bookmark },
] as const

type TabId = (typeof tabs)[number]['id']

// ==================== 新媒体内容管理 ====================
interface SocialMediaPost {
  id: string
  title: string
  content: string
  platform: 'wechat' | 'weibo' | 'xiaohongshu' | 'douyin'
  status: 'draft' | 'published' | 'scheduled'
  images: string[]
  likes?: number
  comments?: number
  shares?: number
  views?: number
  createdAt: string
  scheduledAt?: string
}

interface MediaContent {
  id: string
  title: string
  type: 'article' | 'video' | 'image'
  description: string
  url?: string
  thumbnail?: string
  tags: string[]
  createdAt: string
}

function NewMediaModule() {
  const { themeConfig } = useTheme()
  const { colors } = themeConfig
  const [activeTab, setActiveTab] = useState<'content' | 'posts' | 'analytics'>('content')
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all')

  // 模拟数据
  const contents: MediaContent[] = [
    {
      id: '1',
      title: 'AI 工具使用指南',
      type: 'article',
      description: '详细介绍常用 AI 工具的使用方法和技巧',
      tags: ['AI', '工具', '教程'],
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      title: '产品设计思维分享',
      type: 'video',
      description: '从用户需求出发的产品设计方法论',
      tags: ['设计', '产品', '思维'],
      createdAt: '2024-01-14'
    }
  ]

  const posts: SocialMediaPost[] = [
    {
      id: '1',
      title: '新年工作计划',
      content: '新的一年，新的开始...',
      platform: 'wechat',
      status: 'published',
      images: [],
      likes: 128,
      comments: 23,
      shares: 15,
      views: 2340,
      createdAt: '2024-01-10'
    }
  ]

  const platforms = [
    { id: 'wechat', name: '微信号', color: '#07c160', icon: '💬' },
    { id: 'weibo', name: '微博', color: '#e6162d', icon: '🔴' },
    { id: 'xiaohongshu', name: '小红书', color: '#ff2442', icon: '📕' },
    { id: 'douyin', name: '抖音', color: '#00f0ff', icon: '🎵' }
  ]

  return (
    <div className="space-y-6">
      {/* 顶部操作栏 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold" style={{ color: colors.text }}>新媒体运营</h2>
          <p className="text-sm" style={{ color: colors.textMuted }}>社交媒体内容创作和管理</p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-4 py-2 rounded-lg text-white font-medium flex items-center gap-2"
          style={{ background: colors.primary }}
        >
          <Plus size={18} />
          <span>创建内容</span>
        </motion.button>
      </div>

      {/* 平台筛选 */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedPlatform('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            selectedPlatform === 'all'
              ? 'bg-primary/10 text-primary border border-primary/20'
              : 'bg-surface border border-border text-text-muted hover:text-text'
          }`}
        >
          全部平台
        </button>
        {platforms.map(platform => (
          <button
            key={platform.id}
            onClick={() => setSelectedPlatform(platform.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              selectedPlatform === platform.id
                ? 'bg-primary/10 text-primary border border-primary/20'
                : 'bg-surface border border-border text-text-muted hover:text-text'
            }`}
          >
            <span>{platform.icon}</span>
            <span className="hidden sm:inline">{platform.name}</span>
          </button>
        ))}
      </div>

      {/* 标签页切换 */}
      <div className="flex gap-2 border-b" style={{ borderColor: colors.border }}>
        {[
          { id: 'content', label: '内容库', icon: FileText },
          { id: 'posts', label: '发布管理', icon: Calendar },
          { id: 'analytics', label: '数据分析', icon: BarChart3 }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as 'content' | 'posts' | 'analytics')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors relative ${
              activeTab === tab.id
                ? 'text-primary'
                : 'text-text-muted hover:text-text'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                layoutId="mediaTab"
                className="absolute bottom-0 left-0 right-0 h-0.5"
                style={{ backgroundColor: colors.primary }}
              />
            )}
          </button>
        ))}
      </div>

      {/* 内容区域 */}
      <AnimatePresence mode="wait">
        {activeTab === 'content' && (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          >
            {contents.map(content => (
              <motion.div
                key={content.id}
                whileHover={{ y: -4 }}
                className="glass-card p-4 cursor-pointer"
                style={{ 
                  backgroundColor: colors.surface,
                  border: `1px solid ${colors.border}`
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2 rounded-lg ${
                    content.type === 'video' ? 'bg-rose-500/10' : 'bg-blue-500/10'
                  }`}>
                    {content.type === 'video' ? (
                      <Video size={20} className="text-rose-500" />
                    ) : (
                      <FileText size={20} className="text-blue-500" />
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button className="p-1.5 rounded-lg hover:bg-surface/60">
                      <Edit3 size={14} style={{ color: colors.textMuted }} />
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-rose-500/10">
                      <Trash2 size={14} className="text-rose-500" />
                    </button>
                  </div>
                </div>

                <h3 className="font-semibold mb-2" style={{ color: colors.text }}>
                  {content.title}
                </h3>
                <p className="text-sm mb-3 line-clamp-2" style={{ color: colors.textMuted }}>
                  {content.description}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-3">
                  {content.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-full text-[10px] font-medium"
                      style={{ 
                        backgroundColor: colors.primaryMuted,
                        color: colors.primary
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs" style={{ color: colors.textMuted }}>
                  <span>{content.createdAt}</span>
                  <LinkIcon size={14} />
                </div>
              </motion.div>
            ))}

            {/* 添加新内容卡片 */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="glass-card p-4 border-2 border-dashed flex flex-col items-center justify-center min-h-[200px]"
              style={{ 
                backgroundColor: colors.surfaceAlt,
                borderColor: colors.border
              }}
            >
              <Plus size={32} style={{ color: colors.textMuted }} />
              <span className="mt-2 text-sm font-medium" style={{ color: colors.textMuted }}>
                添加新内容
              </span>
            </motion.button>
          </motion.div>
        )}

        {activeTab === 'posts' && (
          <motion.div
            key="posts"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-3"
          >
            {posts.map(post => (
              <motion.div
                key={post.id}
                whileHover={{ x: 4 }}
                className="glass-card p-4"
                style={{ 
                  backgroundColor: colors.surface,
                  border: `1px solid ${colors.border}`
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">
                      {platforms.find(p => p.id === post.platform)?.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold" style={{ color: colors.text }}>
                        {post.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs mt-1">
                        <span className={`px-2 py-0.5 rounded-full font-medium ${
                          post.status === 'published' ? 'bg-emerald-500/10 text-emerald-500' :
                          post.status === 'draft' ? 'bg-amber-500/10 text-amber-500' :
                          'bg-blue-500/10 text-blue-500'
                        }`}>
                          {post.status === 'published' ? '已发布' :
                           post.status === 'draft' ? '草稿' : '定时发布'}
                        </span>
                        <span style={{ color: colors.textMuted }}>{post.createdAt}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 rounded-lg hover:bg-surface/60">
                      <Edit3 size={16} style={{ color: colors.textMuted }} />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-rose-500/10">
                      <Trash2 size={16} className="text-rose-500" />
                    </button>
                  </div>
                </div>

                <p className="text-sm mb-4 line-clamp-2" style={{ color: colors.textSecondary }}>
                  {post.content}
                </p>

                <div className="flex items-center gap-4 text-xs" style={{ color: colors.textMuted }}>
                  <div className="flex items-center gap-1">
                    <Eye size={14} />
                    <span>{post.views}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ThumbsUp size={14} />
                    <span>{post.likes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare size={14} />
                    <span>{post.comments}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Share2 size={14} />
                    <span>{post.shares}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {activeTab === 'analytics' && (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid gap-4 grid-cols-2 md:grid-cols-4"
          >
            {[
              { label: '总阅读量', value: '12,345', icon: Eye, change: '+12.5%', color: '#3b82f6' },
              { label: '总点赞数', value: '2,456', icon: ThumbsUp, change: '+8.3%', color: '#ef4444' },
              { label: '总评论数', value: '567', icon: MessageSquare, change: '+15.2%', color: '#10b981' },
              { label: '总分享数', value: '234', icon: Share2, change: '+6.7%', color: '#8b5cf6' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-4"
                style={{ 
                  backgroundColor: colors.surface,
                  border: `1px solid ${colors.border}`
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div 
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: `${stat.color}20` }}
                  >
                    <stat.icon size={18} style={{ color: stat.color }} />
                  </div>
                  <span className="text-xs font-medium text-emerald-500">{stat.change}</span>
                </div>
                <div className="text-2xl font-bold mb-1" style={{ color: colors.text }}>
                  {stat.value}
                </div>
                <div className="text-xs" style={{ color: colors.textMuted }}>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ==================== 电商运营管理 ====================
interface Product {
  id: string
  name: string
  price: number
  originalPrice: number
  sales: number
  stock: number
  image: string
  category: string
  rating: number
  status: 'onsale' | 'outsold' | 'offline'
}

function EcommerceModule() {
  const { themeConfig } = useTheme()
  const { colors } = themeConfig
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'analysis'>('overview')
  const [searchQuery, setSearchQuery] = useState('')

  // 模拟数据
  const products: Product[] = [
    {
      id: '1',
      name: '无线蓝牙耳机 降噪高音质',
      price: 299,
      originalPrice: 599,
      sales: 1234,
      stock: 568,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200',
      category: '数码配件',
      rating: 4.8,
      status: 'onsale'
    },
    {
      id: '2',
      name: '智能手表 运动健康监测',
      price: 899,
      originalPrice: 1299,
      sales: 856,
      stock: 234,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200',
      category: '智能穿戴',
      rating: 4.9,
      status: 'onsale'
    }
  ]

  const stats = [
    { label: '今日销售额', value: '¥12,345', icon: DollarSign, change: '+18.5%', color: '#10b981' },
    { label: '订单数量', value: '156', icon: Package, change: '+12.3%', color: '#3b82f6' },
    { label: '访客数量', value: '3,456', icon: Users, change: '+8.7%', color: '#8b5cf6' },
    { label: '转化率', value: '4.5%', icon: TrendingUp, change: '+2.1%', color: '#f59e0b' }
  ]

  return (
    <div className="space-y-6">
      {/* 顶部导航 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold" style={{ color: colors.text }}>电商运营</h2>
          <p className="text-sm" style={{ color: colors.textMuted }}>电商平台管理和数据分析</p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-4 py-2 rounded-lg text-white font-medium flex items-center gap-2"
          style={{ background: colors.primary }}
        >
          <Plus size={18} />
          <span>上架商品</span>
        </motion.button>
      </div>

      {/* 标签页切换 */}
      <div className="flex gap-2 border-b overflow-x-auto" style={{ borderColor: colors.border }}>
        {[
          { id: 'overview', label: '数据概览', icon: BarChart3 },
          { id: 'products', label: '商品管理', icon: Package },
          { id: 'orders', label: '订单管理', icon: ShoppingCart },
          { id: 'analysis', label: '经营分析', icon: TrendingUp }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as 'overview' | 'products' | 'orders' | 'analysis')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap relative ${
              activeTab === tab.id
                ? 'text-primary'
                : 'text-text-muted hover:text-text'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                layoutId="ecommerceTab"
                className="absolute bottom-0 left-0 right-0 h-0.5"
                style={{ backgroundColor: colors.primary }}
              />
            )}
          </button>
        ))}
      </div>

      {/* 内容区域 */}
      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* 数据统计卡片 */}
            <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card p-4"
                  style={{ 
                    backgroundColor: colors.surface,
                    border: `1px solid ${colors.border}`
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div 
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: `${stat.color}20` }}
                    >
                      <stat.icon size={18} style={{ color: stat.color }} />
                    </div>
                    <span className="text-xs font-medium text-emerald-500">{stat.change}</span>
                  </div>
                  <div className="text-xl md:text-2xl font-bold mb-1" style={{ color: colors.text }}>
                    {stat.value}
                  </div>
                  <div className="text-xs" style={{ color: colors.textMuted }}>
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* 销售趋势图表占位 */}
            <div className="glass-card p-6">
              <h3 className="font-semibold mb-4" style={{ color: colors.text }}>
                销售趋势
              </h3>
              <div className="h-64 flex items-center justify-center" style={{ backgroundColor: colors.bgAlt }}>
                <BarChart3 size={48} style={{ color: colors.textMuted, opacity: 0.3 }} />
              </div>
            </div>

            {/* 热门商品 */}
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold" style={{ color: colors.text }}>
                  热门商品 TOP 5
                </h3>
                <button className="text-sm text-primary hover:underline">
                  查看全部
                </button>
              </div>
              <div className="space-y-3">
                {products.slice(0, 3).map((product, index) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface/60 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium truncate" style={{ color: colors.text }}>
                        {product.name}
                      </h4>
                      <div className="text-xs" style={{ color: colors.textMuted }}>
                        销量：{product.sales}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold" style={{ color: colors.primary }}>
                        ¥{product.price}
                      </div>
                      <div className="text-xs line-through" style={{ color: colors.textMuted }}>
                        ¥{product.originalPrice}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'products' && (
          <motion.div
            key="products"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {/* 搜索栏 */}
            <div className="relative">
              <input
                type="text"
                placeholder="搜索商品名称、分类..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg"
                style={{ 
                  backgroundColor: colors.surface,
                  border: `1px solid ${colors.border}`,
                  color: colors.text
                }}
              />
            </div>

            {/* 商品列表 */}
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {products.map(product => (
                <motion.div
                  key={product.id}
                  whileHover={{ y: -4 }}
                  className="glass-card overflow-hidden"
                  style={{ 
                    backgroundColor: colors.surface,
                    border: `1px solid ${colors.border}`
                  }}
                >
                  <div className="aspect-square relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium bg-black/60 text-white">
                      {product.category}
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    <h3 className="font-semibold line-clamp-2" style={{ color: colors.text }}>
                      {product.name}
                    </h3>

                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold" style={{ color: colors.primary }}>
                        ¥{product.price}
                      </span>
                      <span className="text-sm line-through" style={{ color: colors.textMuted }}>
                        ¥{product.originalPrice}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs" style={{ color: colors.textMuted }}>
                      <div className="flex items-center gap-3">
                        <span>销量：{product.sales}</span>
                        <span>库存：{product.stock}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp size={12} />
                        <span>{product.rating}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button className="flex-1 py-2 rounded-lg text-sm font-medium text-white"
                        style={{ backgroundColor: colors.primary }}
                      >
                        编辑
                      </button>
                      <button className="px-3 py-2 rounded-lg text-sm font-medium"
                        style={{ 
                          backgroundColor: colors.surface,
                          border: `1px solid ${colors.border}`,
                          color: colors.text
                        }}
                      >
                        下架
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {(activeTab === 'orders' || activeTab === 'analysis') && (
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-card p-12 text-center"
            style={{ 
              backgroundColor: colors.surface,
              border: `1px solid ${colors.border}`
            }}
          >
            <Package size={48} className="mx-auto mb-4" style={{ color: colors.textMuted, opacity: 0.3 }} />
            <h3 className="font-semibold mb-2" style={{ color: colors.text }}>
              功能开发中
            </h3>
            <p style={{ color: colors.textMuted }}>
              {activeTab === 'orders' ? '订单管理功能即将上线' : '经营分析功能即将上线'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ==================== 主页面组件 ====================
export default function Work() {
  const [searchParams] = useSearchParams()
  const tabParam = searchParams.get('tab')
  
  // 根据 URL 参数确定当前标签，默认为 media
  const getInitialTab = (): TabId => {
    if (tabParam === 'ecommerce') return 'ecommerce'
    if (tabParam === 'bookmarks') return 'bookmarks'
    return 'media'
  }
  
  const [activeTab, setActiveTab] = useState<TabId>(getInitialTab)

  return (
    <PageTransition>
      <div className="mx-auto max-w-6xl px-6 py-8">
        {/* 顶部页眉与标签导航 */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-start gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-3xl font-bold text-text mb-1">工作助手</h1>
            <p className="text-sm text-text-muted">提升工作效率的得力助手</p>
          </motion.div>

          {/* 选项卡导航 - 在右侧 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="flex gap-2 overflow-x-auto no-scrollbar pb-1"
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
                    layoutId="workPageTab"
                    className="absolute inset-0 bg-primary/10 border border-primary/20 rounded-xl -z-10"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </motion.div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'media' && (
            <motion.div
              key="media"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <NewMediaModule />
            </motion.div>
          )}
          {activeTab === 'ecommerce' && (
            <motion.div
              key="ecommerce"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <EcommerceModule />
            </motion.div>
          )}
          {activeTab === 'bookmarks' && (
            <motion.div
              key="bookmarks"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <TreasureBox />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  )
}
