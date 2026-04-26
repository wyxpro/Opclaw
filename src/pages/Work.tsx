import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  PenTool, ShoppingCart, Plus, Bookmark,
  Video, FileText, Calendar, Users, TrendingUp, Package,
  DollarSign, Eye, ThumbsUp, MessageSquare, Share2, Edit3,
  Trash2, Link as LinkIcon, BarChart3, Search, Filter, X, Check, XCircle
} from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import PageTransition from '../components/ui/PageTransition'
import { useTheme } from '../hooks/useTheme'
import { TreasureBox } from '../components/entertainment/EntertainmentModules'
import ReactECharts from 'echarts-for-react'

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
  platform: string
  createdAt: string
}

function NewMediaModule() {
  const { themeConfig } = useTheme()
  const { colors } = themeConfig
  const [activeTab, setActiveTab] = useState<'content' | 'posts' | 'analytics'>('content')
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalType, setModalType] = useState<'create' | 'edit'>('create')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [chartType, setChartType] = useState<'line' | 'bar' | 'pie' | 'radar'>('radar')
  const [modalPlatforms, setModalPlatforms] = useState<string[]>(['wechat'])
  const [modalContentType, setModalContentType] = useState('图文')

  // 模拟数据
  const contents: MediaContent[] = [
    { id: '1', title: 'AI 工具深度使用指南', type: 'article', description: '详细介绍常用 AI 工具的使用方法和技巧分享，适合小白入门', tags: ['AI', '工具', '教程'], platform: 'wechat', createdAt: '2024-01-15' },
    { id: '2', title: '独立开发者如何变现', type: 'article', description: '关于个人开发产品如何找到第一批用户并实现盈利的思考', tags: ['变现', '开发', '成长'], platform: 'wechat', createdAt: '2024-01-12' },
    { id: '3', title: '互联网早报速读', type: 'article', description: '一分钟带你了解今天互联网圈发生的大小事', tags: ['早报', '资讯', '互联网'], platform: 'weibo', createdAt: '2024-01-16' },
    { id: '4', title: '抽奖福利大放送！', type: 'image', description: '关注并转发，揪一位小伙伴送出最新款耳机', tags: ['抽奖', '福利', '粉丝'], platform: 'weibo', createdAt: '2024-01-14' },
    { id: '5', title: '超好用的效率App清单推荐', type: 'image', description: '吐血整理的10款让你工作效率翻倍的神仙App，一定要看！', tags: ['职场', '效率', 'App推荐'], platform: 'xiaohongshu', createdAt: '2024-01-11' },
    { id: '6', title: '周末探店：发现宝藏咖啡馆', type: 'image', description: '氛围感拉满，拍照超出片的一家小众咖啡馆☕️', tags: ['探店', '周末去哪儿', '咖啡'], platform: 'xiaohongshu', createdAt: '2024-01-08' },
    { id: '7', title: '产品设计思路大解密', type: 'video', description: '从用户需求出发，3步教你如何打造爆款产品逻辑', tags: ['设计', '产品', '思维'], platform: 'douyin', createdAt: '2024-01-10' },
    { id: '8', title: '搞笑日常：当程序员遇到断网', type: 'video', description: '太真实了哈哈哈哈，程序员的崩溃瞬间', tags: ['搞笑', '日常', '程序员'], platform: 'douyin', createdAt: '2024-01-05' },
  ]

  const posts: SocialMediaPost[] = [
    { id: '1', title: '新年工作计划与展望', content: '新的一年，新的开始，分享一下我们团队在2024年的具体规划...', platform: 'wechat', status: 'published', images: [], likes: 1280, comments: 236, shares: 154, views: 23400, createdAt: '2024-01-10 10:00' },
    { id: '2', title: '公众号粉丝突破10万纪念', content: '感谢大家一路走来的支持，这是送给你们的一封信！', platform: 'wechat', status: 'scheduled', images: [], likes: 0, comments: 0, shares: 0, views: 0, createdAt: '2024-01-15 09:30', scheduledAt: '2024-01-20 18:00' },
    { id: '3', title: '行业趋势分析报告', content: '根据最新数据，下半年行业将迎来这些新变化。完整报告请看长图👇', platform: 'weibo', status: 'published', images: [], likes: 450, comments: 89, shares: 320, views: 15600, createdAt: '2024-01-16 09:00' },
    { id: '4', title: '讨论：AI会不会取代设计师？', content: '今天和几位大牛聊了聊，欢迎在评论区说说你的看法。#AI科技热议#', platform: 'weibo', status: 'draft', images: [], likes: 0, comments: 0, shares: 0, views: 0, createdAt: '2024-01-17 11:20' },
    { id: '5', title: '教你快速上手AI绘画', content: '#AI绘画 #Midjourney 想要画出好看的图？这5个秘籍赶紧码住👇', platform: 'xiaohongshu', status: 'published', images: [], likes: 3500, comments: 890, shares: 1200, views: 89000, createdAt: '2024-01-12 18:30' },
    { id: '6', title: '桌面好物大公开！', content: '很多姐妹问我的桌面布置，今天给大家盘点一下那些提升幸福感的平价好物~', platform: 'xiaohongshu', status: 'published', images: [], likes: 1200, comments: 340, shares: 450, views: 45000, createdAt: '2024-01-09 20:00' },
    { id: '7', title: '办公室日常vlog', content: '今天也是活力满满的一天！来看看我们平时都在忙些什么吧～', platform: 'douyin', status: 'draft', images: [], likes: 0, comments: 0, shares: 0, views: 0, createdAt: '2024-01-15 14:20' },
    { id: '8', title: '3分钟带你了解什么是元宇宙', content: '通俗易懂的硬核科普局！看懂这些概念不再被忽悠。', platform: 'douyin', status: 'published', images: [], likes: 18900, comments: 2300, shares: 8900, views: 250000, createdAt: '2024-01-14 19:30' }
  ]

  const platformStatsData: Record<string, any> = {
    wechat: { followers: '12.5w', interactRate: '8.2%', postsCount: 156, monthlyGrowth: '+1200' },
    weibo: { followers: '34.2w', interactRate: '4.5%', postsCount: 892, monthlyGrowth: '+3500' },
    xiaohongshu: { followers: '8.9w', interactRate: '12.4%', postsCount: 234, monthlyGrowth: '+4200' },
    douyin: { followers: '56.8w', interactRate: '15.6%', postsCount: 128, monthlyGrowth: '+1.2w' }
  }

  const platforms = [
    { id: 'wechat', name: '微信号', color: '#07c160', icon: '💬' },
    { id: 'weibo', name: '微博', color: '#e6162d', icon: '🔴' },
    { id: 'xiaohongshu', name: '小红书', color: '#ff2442', icon: '📕' },
    { id: 'douyin', name: '抖音', color: '#00f0ff', icon: '🎵' }
  ]

  const filteredContents = selectedPlatform === 'all' ? contents : contents.filter(c => c.platform === selectedPlatform)
  const filteredPosts = selectedPlatform === 'all' ? posts : posts.filter(p => p.platform === selectedPlatform)

  const getChartOption = (type: 'line' | 'bar' | 'pie' | 'radar', colors: any, platform: string) => {
    const baseOption = {
      backgroundColor: 'transparent',
      tooltip: { trigger: type === 'pie' ? 'item' : 'axis' },
      textStyle: { color: colors.textMuted },
    };
    
    if (type === 'pie') {
      return {
        ...baseOption,
        series: [
          {
            name: '平台分布',
            type: 'pie',
            radius: ['40%', '70%'],
            data: [
              { value: 1048, name: '微信' },
              { value: 735, name: '微博' },
              { value: 580, name: '小红书' },
              { value: 300, name: '抖音' }
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };
    }

    if (type === 'radar') {
      const isDouyin = platform === 'douyin';
      const isXHS = platform === 'xiaohongshu';
      const isWeibo = platform === 'weibo';
      const values = isDouyin ? [95, 88, 75, 98, 85] : 
                     isXHS ? [85, 95, 80, 90, 92] : 
                     isWeibo ? [90, 60, 50, 70, 75] : 
                     [80, 75, 65, 80, 85];

      return {
        ...baseOption,
        radar: {
          indicator: [
            { name: '曝光量(Impressions)', max: 100 },
            { name: '互动率(Engagement)', max: 100 },
            { name: '转化率(Conversion)', max: 100 },
            { name: '粉丝增长(Growth)', max: 100 },
            { name: '内容质量(Quality)', max: 100 }
          ],
          axisName: { color: colors.textMuted },
          splitArea: {
            areaStyle: {
              color: ['rgba(250,250,250,0.02)', 'rgba(200,200,200,0.02)']
            }
          },
          splitLine: { lineStyle: { color: colors.border } },
          axisLine: { lineStyle: { color: colors.border } }
        },
        series: [
          {
            name: '平台综合能力展现',
            type: 'radar',
            data: [
              {
                value: values,
                name: platforms.find(p => p.id === platform)?.name || '全平台综合',
                itemStyle: { color: colors.primary },
                areaStyle: { color: colors.primary + '50' }
              }
            ]
          }
        ]
      };
    }

    return {
      ...baseOption,
      xAxis: {
        type: 'category',
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        axisLine: { lineStyle: { color: colors.border } }
      },
      yAxis: {
        type: 'value',
        splitLine: { lineStyle: { color: colors.border, type: 'dashed' } }
      },
      series: [
        {
          data: [820, 932, 901, 934, 1290, 1330, 1320],
          type: type,
          smooth: true,
          itemStyle: { color: colors.primary },
          areaStyle: type === 'line' ? {
            color: {
              type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [{ offset: 0, color: colors.primary }, { offset: 1, color: 'transparent' }]
            }
          } : undefined
        }
      ]
    };
  };

  return (
    <div className="space-y-6 relative">
      {/* 平级平台筛选与操作 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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

        <motion.button
          onClick={() => { setModalType('create'); setIsModalOpen(true); }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-4 py-2 rounded-lg text-white font-medium flex items-center gap-2"
          style={{ background: colors.primary }}
        >
          <Plus size={18} />
          <span>创建内容</span>
        </motion.button>
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
            className="space-y-4"
          >
            {/* 搜索与筛选 */}
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: colors.textMuted }} />
                <input
                  type="text"
                  placeholder="搜索内容标题、标签..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg text-sm outline-none focus:ring-1 focus:ring-primary"
                  style={{ 
                    backgroundColor: colors.surface,
                    border: `1px solid ${colors.border}`,
                    color: colors.text
                  }}
                />
              </div>
              <button 
                className="px-4 py-2 rounded-lg flex items-center gap-2 text-sm hover:brightness-95 transition-all"
                style={{ backgroundColor: colors.surface, border: `1px solid ${colors.border}`, color: colors.text }}
              >
                <Filter size={16} />
                <span>筛选</span>
              </button>
            </div>

            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {filteredContents.map(content => (
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
                    <button 
                      onClick={(e) => { e.stopPropagation(); setModalType('edit'); setIsModalOpen(true); }}
                      className="p-1.5 rounded-lg hover:bg-surface/60 transition-colors"
                    >
                      <Edit3 size={14} style={{ color: colors.textMuted }} />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setDeleteId(content.id); }}
                      className="p-1.5 rounded-lg hover:bg-rose-500/10 transition-colors"
                    >
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
              onClick={() => { setModalType('create'); setIsModalOpen(true); }}
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
            </div>
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
            {filteredPosts.map(post => (
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
                        <span style={{ color: colors.textMuted }}>
                          {post.status === 'scheduled' && post.scheduledAt ? `预定: ${post.scheduledAt}` : post.createdAt}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setModalType('edit'); setIsModalOpen(true); }} className="p-2 rounded-lg hover:bg-surface/60 transition-colors">
                      <Edit3 size={16} style={{ color: colors.textMuted }} />
                    </button>
                    <button onClick={() => setDeleteId(post.id)} className="p-2 rounded-lg hover:bg-rose-500/10 transition-colors">
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
            className="space-y-6"
          >
            <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
              {[
                { label: '总阅读量', value: selectedPlatform !== 'all' && platformStatsData[selectedPlatform] ? platformStatsData[selectedPlatform].followers : '12,345', icon: Eye, change: '+12.5%', color: '#3b82f6' },
                { label: '总点赞数', value: selectedPlatform !== 'all' && platformStatsData[selectedPlatform] ? platformStatsData[selectedPlatform].interactRate : '2,456', icon: ThumbsUp, change: '+8.3%', color: '#ef4444' },
                { label: '总评论数', value: selectedPlatform !== 'all' && platformStatsData[selectedPlatform] ? platformStatsData[selectedPlatform].postsCount : '567', icon: MessageSquare, change: '+15.2%', color: '#10b981' },
                { label: '总分享数', value: selectedPlatform !== 'all' && platformStatsData[selectedPlatform] ? platformStatsData[selectedPlatform].monthlyGrowth : '234', icon: Share2, change: '+6.7%', color: '#8b5cf6' }
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
            </div>

            {/* 图表展示区 */}
            <div className="glass-card p-6" style={{ backgroundColor: colors.surface, border: `1px solid ${colors.border}` }}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold" style={{ color: colors.text }}>数据展现分析</h3>
                <div className="flex gap-2">
                  {(['line', 'bar', 'pie', 'radar'] as const).map(t => (
                    <button
                      key={t}
                      onClick={() => setChartType(t)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        chartType === t
                          ? 'bg-primary/10 text-primary border border-primary/20'
                          : 'bg-surface border border-border text-text-muted hover:text-text'
                      }`}
                    >
                      {t === 'line' ? '折线图' : t === 'bar' ? '柱状图' : t === 'pie' ? '饼图' : '雷达图'}
                    </button>
                  ))}
                </div>
              </div>
              <div className="h-[300px] w-full">
                <ReactECharts 
                  notMerge={true}
                  option={getChartOption(chartType, colors, selectedPlatform)} 
                  style={{ height: '100%', width: '100%' }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 创建/编辑 内容弹窗 */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl rounded-2xl shadow-xl overflow-hidden glass-card"
              style={{ backgroundColor: colors.surface, border: `1px solid ${colors.border}` }}
            >
              <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: colors.border }}>
                <h3 className="font-semibold text-lg" style={{ color: colors.text }}>
                  {modalType === 'create' ? '创建内容' : '编辑内容'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-lg hover:bg-surface/60 transition-colors">
                  <X size={20} style={{ color: colors.textMuted }} />
                </button>
              </div>
              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: colors.text }}>标题</label>
                  <input type="text" placeholder="输入内容标题" className="w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-1 focus:ring-primary" style={{ backgroundColor: colors.bgAlt, border: `1px solid ${colors.border}`, color: colors.text }} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: colors.text }}>内容类型</label>
                  <div className="flex gap-2">
                    {['图文', '视频', '动态'].map(t => {
                      const isSelected = modalContentType === t;
                      return (
                        <button 
                          key={t} 
                          onClick={() => setModalContentType(t)}
                          className={`px-4 py-1.5 rounded-lg text-sm transition-colors border ${isSelected ? 'bg-primary/10 text-primary border-primary/20' : ''}`} 
                          style={{ borderColor: isSelected ? 'transparent' : colors.border, color: isSelected ? colors.primary : colors.text }}
                        >
                          {t}
                        </button>
                      )
                    })}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: colors.text }}>分发平台</label>
                  <div className="flex flex-wrap gap-2">
                    {platforms.map(p => {
                      const isSelected = modalPlatforms.includes(p.id)
                      return (
                        <button
                          key={p.id}
                          onClick={() => setModalPlatforms(prev => 
                            prev.includes(p.id) ? prev.filter(id => id !== p.id) : [...prev, p.id]
                          )}
                          className={`px-3 py-1.5 border rounded-lg text-xs flex items-center gap-1 transition-colors`}
                          style={{ 
                            backgroundColor: isSelected ? `${p.color}15` : 'transparent',
                            borderColor: isSelected ? `${p.color}40` : colors.border,
                            color: isSelected ? p.color : colors.textMuted
                          }}
                        >
                          {isSelected ? <Check size={12} /> : <Plus size={12} />}
                          {p.name}
                        </button>
                      )
                    })}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: colors.text }}>正文/描述</label>
                  <textarea rows={4} placeholder="在此处编写新媒体文案..." className="w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-1 focus:ring-primary resize-none" style={{ backgroundColor: colors.bgAlt, border: `1px solid ${colors.border}`, color: colors.text }} />
                </div>
              </div>
              <div className="flex justify-end gap-3 p-4 border-t" style={{ borderColor: colors.border }}>
                <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:brightness-95" style={{ color: colors.text, backgroundColor: colors.surface, border: `1px solid ${colors.border}` }}>
                  取消
                </button>
                <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-all hover:brightness-110" style={{ backgroundColor: colors.primary }}>
                  保存内容
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 删除确认弹窗 */}
      <AnimatePresence>
        {deleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm rounded-2xl shadow-xl overflow-hidden glass-card p-6 text-center"
              style={{ backgroundColor: colors.surface, border: `1px solid ${colors.border}` }}
            >
              <div className="w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center mx-auto mb-4">
                <Trash2 size={24} className="text-rose-500" />
              </div>
              <h3 className="font-semibold text-lg mb-2" style={{ color: colors.text }}>确认删除</h3>
              <p className="text-sm mb-6" style={{ color: colors.textMuted }}>此操作不可恢复，确定要删除这条内容吗？</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId(null)} className="flex-1 py-2 rounded-lg text-sm font-medium transition-colors hover:brightness-95" style={{ color: colors.text, backgroundColor: colors.surface, border: `1px solid ${colors.border}` }}>
                  取消
                </button>
                <button onClick={() => setDeleteId(null)} className="flex-1 py-2 rounded-lg text-sm font-medium text-white bg-rose-500 hover:bg-rose-600 transition-colors">
                  确定删除
                </button>
              </div>
            </motion.div>
          </div>
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
      {/* 顶部导航与操作区域 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b" style={{ borderColor: colors.border }}>
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
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

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-4 py-2 mb-2 rounded-lg text-white font-medium flex items-center gap-2"
          style={{ background: colors.primary }}
        >
          <Plus size={18} />
          <span>上传商品</span>
        </motion.button>
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
