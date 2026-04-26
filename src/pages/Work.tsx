import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  PenTool, ShoppingCart, Plus, Bookmark,
  Video, FileText, Calendar, Users, TrendingUp, Package,
  DollarSign, Eye, ThumbsUp, MessageSquare, Share2, Edit3,
  Trash2, Link as LinkIcon, BarChart3, Search, Filter, X, Check, XCircle,
  Upload, Star, ChevronDown, Clock, CheckCircle, Truck
} from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import PageTransition from '../components/ui/PageTransition'
import { useTheme } from '../hooks/useTheme'
import { TreasureBox } from '../components/entertainment/EntertainmentModules'
import ReactECharts from 'echarts-for-react'

// 标签配置
const tabs = [
  { id: 'bookmarks', label: '百宝箱', icon: Bookmark },
  { id: 'ecommerce', label: '电商运营', icon: ShoppingCart },
  { id: 'media', label: '新媒体', icon: PenTool },
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
  const [chartType, setChartType] = useState<'line' | 'bar' | 'pie' | 'radar'>('line')
  const [modalPlatforms, setModalPlatforms] = useState<string[]>(['wechat'])
  const [modalContentType, setModalContentType] = useState('图文')

  // 扩展过滤状态
  const [filterType, setFilterType] = useState<string>('all')
  const [filterTag, setFilterTag] = useState<string>('all')
  const [isFilterExpanded, setIsFilterExpanded] = useState(false)

  // 模拟数据
  const contents: MediaContent[] = [
    { id: '1', title: 'AI 工具深度使用指南', type: 'article', description: '详细介绍常用 AI 工具的使用方法和技巧分享，适合小白入门', tags: ['AI', '工具', '教程'], platform: 'wechat', createdAt: '2024-01-15', thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=500' },
    { id: '2', title: '独立开发者如何变现', type: 'article', description: '关于个人开发产品如何找到第一批用户并实现盈利的思考', tags: ['变现', '开发', '成长'], platform: 'wechat', createdAt: '2024-01-12', thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500' },
    { id: '3', title: '互联网早报速读', type: 'article', description: '一分钟带你了解今天互联网圈发生的大小事', tags: ['早报', '资讯', '互联网'], platform: 'weibo', createdAt: '2024-01-16', thumbnail: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=500' },
    { id: '4', title: '抽奖福利大放送！', type: 'image', description: '关注并转发，揪一位小伙伴送出最新款耳机', tags: ['抽奖', '福利', '粉丝'], platform: 'weibo', createdAt: '2024-01-14', thumbnail: 'https://images.unsplash.com/photo-1544652478-6653e09f18a2?w=500' },
    { id: '5', title: '超好用的效率App清单推荐', type: 'image', description: '吐血整理的10款让你工作效率翻倍的神仙App，一定要看！', tags: ['职场', '效率', 'App推荐'], platform: 'xiaohongshu', createdAt: '2024-01-11', thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500' },
    { id: '6', title: '周末探店：发现宝藏咖啡馆', type: 'image', description: '氛围感拉满，拍照超出片的一家小众咖啡馆☕️', tags: ['探店', '周末去哪儿', '咖啡'], platform: 'xiaohongshu', createdAt: '2024-01-08', thumbnail: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500' },
    { id: '7', title: '产品设计思路大解密', type: 'video', description: '从用户需求出发，3步教你如何打造爆款产品逻辑', tags: ['设计', '产品', '思维'], platform: 'douyin', createdAt: '2024-01-10', thumbnail: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=500' },
    { id: '8', title: '搞笑日常：当程序员遇到断网', type: 'video', description: '太真实了哈哈哈哈，程序员的崩溃瞬间', tags: ['搞笑', '日常', '程序员'], platform: 'douyin', createdAt: '2024-01-05', thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500' },
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

  const allTags = Array.from(new Set(contents.flatMap(c => c.tags)))

  const filteredContents = contents.filter(c => {
    const matchesPlatform = selectedPlatform === 'all' || c.platform === selectedPlatform
    const matchesSearch = !searchQuery || c.title.includes(searchQuery) || c.tags.some(t => t.includes(searchQuery))
    const matchesType = filterType === 'all' || c.type === filterType
    const matchesTag = filterTag === 'all' || c.tags.includes(filterTag)
    return matchesPlatform && matchesSearch && matchesType && matchesTag
  })

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
            <div className="flex flex-col gap-4">
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: colors.textMuted }} />
                  <input
                    type="text"
                    placeholder="搜索内容标题、标签..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg text-sm outline-none focus:ring-1 focus:ring-primary shadow-sm"
                    style={{ 
                      backgroundColor: colors.surface,
                      border: `1px solid ${colors.border}`,
                      color: colors.text
                    }}
                  />
                </div>
                <button 
                  onClick={() => setIsFilterExpanded(!isFilterExpanded)}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm transition-all border ${isFilterExpanded ? 'bg-primary/10 text-primary border-primary/20' : 'bg-surface border-border text-text'}`}
                  style={{ borderColor: isFilterExpanded ? 'transparent' : colors.border }}
                >
                  <Filter size={16} />
                  <span>筛选</span>
                  <ChevronDown size={14} className={`transition-transform ${isFilterExpanded ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {/* 展开的筛选面板 */}
              <AnimatePresence>
                {isFilterExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden bg-surface-alt rounded-xl border border-border p-4 space-y-4 shadow-inner"
                    style={{ backgroundColor: colors.bgAlt }}
                  >
                    <div className="flex flex-wrap gap-6 text-sm">
                      <div className="space-y-2">
                        <span className="font-medium text-xs block" style={{ color: colors.textMuted }}>内容类型</span>
                        <div className="flex gap-2">
                          {[
                            { id: 'all', label: '全部' },
                            { id: 'article', label: '文章' },
                            { id: 'video', label: '视频' },
                            { id: 'image', label: '图片' }
                          ].map(type => (
                            <button
                              key={type.id}
                              onClick={() => setFilterType(type.id)}
                              className={`px-3 py-1 rounded-full text-xs transition-colors ${filterType === type.id ? 'bg-primary text-white' : 'bg-surface hover:bg-surface/80 border border-border text-text-muted'}`}
                              style={{ backgroundColor: filterType === type.id ? colors.primary : undefined }}
                            >
                              {type.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <span className="font-medium text-xs block" style={{ color: colors.textMuted }}>标签筛选</span>
                        <div className="flex flex-wrap gap-1.5 max-w-md">
                          <button
                            onClick={() => setFilterTag('all')}
                            className={`px-3 py-1 rounded-full text-xs transition-colors ${filterTag === 'all' ? 'bg-primary text-white' : 'bg-surface hover:bg-surface/80 border border-border text-text-muted'}`}
                            style={{ backgroundColor: filterTag === 'all' ? colors.primary : undefined }}
                          >
                            全部
                          </button>
                          {allTags.map(tag => (
                            <button
                              key={tag}
                              onClick={() => setFilterTag(tag)}
                              className={`px-3 py-1 rounded-full text-xs transition-colors ${filterTag === tag ? 'bg-primary text-white' : 'bg-surface hover:bg-surface/80 border border-border text-text-muted'}`}
                              style={{ backgroundColor: filterTag === tag ? colors.primary : undefined }}
                            >
                              #{tag}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {filteredContents.map(content => (
                <motion.div
                  key={content.id}
                  whileHover={{ y: -6, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' }}
                  className="group relative flex flex-col rounded-2xl overflow-hidden shadow-md"
                  style={{ 
                    backgroundColor: colors.surface,
                    border: `1px solid ${colors.border}`
                  }}
                >
                  {/* 封面图部分 */}
                  <div className="relative aspect-video overflow-hidden">
                    <img 
                      src={content.thumbnail || 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=500'} 
                      alt={content.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={(e) => { e.stopPropagation(); setModalType('edit'); setIsModalOpen(true); }}
                          className="p-2 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/40 transition-colors"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); setDeleteId(content.id); }}
                          className="p-2 rounded-full bg-rose-500/80 backdrop-blur-md text-white hover:bg-rose-500 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    {/* 类型悬停标签 */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold text-white shadow-xl backdrop-blur-sm"
                      style={{ backgroundColor: content.type === 'video' ? 'rgba(244, 63, 94, 0.8)' : content.type === 'article' ? 'rgba(59, 130, 246, 0.8)' : 'rgba(16, 185, 129, 0.8)' }}
                    >
                      {content.type === 'video' && <Video size={12} />}
                      {content.type === 'article' && <FileText size={12} />}
                      {content.type === 'image' && <PenTool size={12} />}
                      {content.type.toUpperCase()}
                    </div>
                  </div>

                  {/* 内容文本部分 */}
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">
                        {platforms.find(p => p.id === content.platform)?.icon || '🌐'}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: colors.textMuted }}>
                        {platforms.find(p => p.id === content.platform)?.name}
                      </span>
                    </div>
                    <h3 className="font-bold text-base mb-2 group-hover:text-primary transition-colors line-clamp-1" style={{ color: colors.text }}>
                      {content.title}
                    </h3>
                    <p className="text-xs mb-4 line-clamp-2 leading-relaxed" style={{ color: colors.textMuted }}>
                      {content.description}
                    </p>

                    <div className="mt-auto flex flex-wrap gap-1.5 mb-3">
                      {content.tags.map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-md text-[10px] font-medium"
                          style={{ 
                            backgroundColor: colors.primaryMuted,
                            color: colors.primary
                          }}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <div className="pt-4 border-t border-dashed flex items-center justify-between" style={{ borderColor: colors.border }}>
                      <span className="text-[10px] font-medium" style={{ color: colors.textMuted }}>
                        {content.createdAt}
                      </span>
                      <button className="text-primary hover:scale-110 transition-transform">
                        <LinkIcon size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* 添加新内容卡片 - 移动到最后 */}
              <motion.button
                onClick={() => { setModalType('create'); setIsModalOpen(true); }}
                whileHover={{ y: -4, scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="group relative h-full min-h-[300px] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-6 transition-colors shadow-sm overflow-hidden"
                style={{ 
                  backgroundColor: colors.surfaceAlt,
                  borderColor: colors.border
                }}
              >
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors" />
                <div className="w-16 h-16 rounded-full bg-surface border border-border flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Plus size={32} style={{ color: colors.primary }} />
                </div>
                <span className="text-sm font-semibold mb-1" style={{ color: colors.text }}>
                  创作新内容
                </span>
                <span className="text-xs text-center" style={{ color: colors.textMuted }}>
                  开始你的灵感创作
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

interface Order {
  id: string
  productName: string
  amount: number
  quantity: number
  status: 'completed' | 'pending' | 'shipped' | 'cancelled'
  date: string
  customer: string
  phone: string
  address: string
  payMethod: string
}

function EcommerceModule() {
  const { themeConfig } = useTheme()
  const { colors } = themeConfig
  const [activeTab, setActiveTab] = React.useState<'overview' | 'products' | 'orders' | 'analysis'>('overview')
  const [searchQuery, setSearchQuery] = React.useState('')
  const [isProductModalOpen, setIsProductModalOpen] = React.useState(false)
  const [salesTimeRange, setSalesTimeRange] = React.useState<'day' | 'week' | 'month' | 'quarter' | 'year'>('month')

  const [products, setProducts] = React.useState<Product[]>([
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
  ])

  const [editingProduct, setEditingProduct] = React.useState<Product | null>(null)
  const [formData, setFormData] = React.useState<Partial<Product>>({})

  const [orderStatusFilter, setOrderStatusFilter] = React.useState<'all' | 'completed' | 'pending' | 'shipped' | 'cancelled'>('all')
  const [orderSearchQuery, setOrderSearchQuery] = React.useState('')
  const [expandedOrderId, setExpandedOrderId] = React.useState<string | null>(null)
  
  // 订单创建状态
  const [isOrderModalOpen, setIsOrderModalOpen] = React.useState(false)
  const [orderFormData, setOrderFormData] = React.useState<Partial<Order>>({})

  // 附件上传状态
  const [uploadProgress, setUploadProgress] = React.useState<Record<string, number>>({})
  const [isDraggingProduct, setIsDraggingProduct] = React.useState(false)

  const handleFileUpload = (orderId: string, file: File) => {
    // 简单校验
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'text/plain']
    if (!allowedTypes.includes(file.type) && !file.name.endsWith('.xlsx') && !file.name.endsWith('.docx')) {
      alert('仅支持 PDF, Word, Excel, JPG, PNG 格式')
      return
    }

    // 模拟上传进度
    setUploadProgress(prev => ({ ...prev, [orderId]: 10 }))
    let progress = 10
    const interval = setInterval(() => {
      progress += Math.random() * 30
      if (progress >= 100) {
        progress = 100
        clearInterval(interval)
        setTimeout(() => {
          setUploadProgress(prev => {
            const next = { ...prev }
            delete next[orderId]
            return next
          })
          alert(`${file.name} 上传成功！`)
        }, 1000)
      }
      setUploadProgress(prev => ({ ...prev, [orderId]: Math.floor(progress) }))
    }, 500)
  }

  const [orders, setOrders] = React.useState<Order[]>([
    { id: 'DD20240115001', productName: '无线蓝牙耳机 降噪高音质', amount: 299, quantity: 1, status: 'completed', date: '2024-01-15 14:30', customer: '张三', phone: '138****8888', address: '北京市朝阳区XX路XX号', payMethod: '微信支付' },
    { id: 'DD20240115002', productName: '智能手表 运动健康监测', amount: 1798, quantity: 2, status: 'pending', date: '2024-01-15 15:45', customer: '李四', phone: '139****9999', address: '上海市浦东新区XX路XX室', payMethod: '支付宝' },
    { id: 'DD20240116001', productName: '无线蓝牙耳机 降噪高音质', amount: 299, quantity: 1, status: 'shipped', date: '2024-01-16 09:20', customer: '王五', phone: '187****7777', address: '广州市天河区XX街道XX号', payMethod: '银行卡' },
    { id: 'DD20240116002', productName: '智能手表 运动健康监测', amount: 899, quantity: 1, status: 'cancelled', date: '2024-01-16 11:10', customer: '赵六', phone: '136****6666', address: '深圳市南山区XX大道XX层', payMethod: '微信支付' },
    { id: 'DD20240117001', productName: '无线蓝牙耳机 降噪高音质', amount: 597, quantity: 2, status: 'completed', date: '2024-01-17 10:00', customer: '孙七', phone: '135****5555', address: '成都市武侯区XX大道XX号', payMethod: '支付宝' },
    { id: 'DD20240117002', productName: '智能手表 运动健康监测', amount: 899, quantity: 1, status: 'shipped', date: '2024-01-17 13:30', customer: '周八', phone: '177****1234', address: '杭州市西湖区XX路XX幢', payMethod: '花呗' },
    { id: 'DD20240118001', productName: '无线蓝牙耳机 降噪高音质', amount: 299, quantity: 1, status: 'pending', date: '2024-01-18 09:15', customer: '吴九', phone: '188****4321', address: '武汉市洪山区XX街XX号', payMethod: '微信支付' },
    { id: 'DD20240118002', productName: '智能手表 运动健康监测', amount: 2697, quantity: 3, status: 'completed', date: '2024-01-18 16:45', customer: '郑十', phone: '133****6789', address: '西安市雁塔区XX路XX楼', payMethod: '银行卡' }
  ])

  const stats = [
    { label: '今日销售额', value: '¥12,345', icon: DollarSign, change: '+18.5%', color: '#10b981' },
    { label: '订单数量', value: '156', icon: Package, change: '+12.3%', color: '#3b82f6' },
    { label: '访客数量', value: '3,456', icon: Users, change: '+8.7%', color: '#8b5cf6' },
    { label: '转化率', value: '4.5%', icon: TrendingUp, change: '+2.1%', color: '#f59e0b' }
  ]

  const handleOpenCreateModal = () => {
    setEditingProduct(null)
    setFormData({
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      price: 0,
      originalPrice: 0,
      sales: 0,
      stock: 0,
      category: '数码配件',
      image: undefined,
      rating: 5.0,
      status: 'onsale'
    })
    setIsProductModalOpen(true)
  }

  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product)
    setFormData({ ...product })
    setIsProductModalOpen(true)
  }

  const handleSaveProduct = () => {
    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id ? (formData as Product) : p))
    } else {
      setProducts([...products, formData as Product])
    }
    setIsProductModalOpen(false)
  }

  const handleOpenCreateOrderModal = () => {
    setOrderFormData({
      id: 'DD' + new Date().getTime().toString().slice(-8),
      status: 'pending',
      date: new Date().toLocaleString(),
      quantity: 1,
      payMethod: '微信支付'
    })
    setIsOrderModalOpen(true)
  }

  const handleSaveOrder = () => {
    if (!orderFormData.productName || !orderFormData.amount || !orderFormData.customer) {
      alert('请填写完整订单信息')
      return
    }
    setOrders([orderFormData as Order, ...orders])
    setIsOrderModalOpen(false)
  }

  const getTrafficFlowChartOption = () => {
    return {
      backgroundColor: 'transparent',
      tooltip: { trigger: 'axis', axisPointer: { type: 'cross' } },
      legend: { data: ['访客数', '浏览量', '加购数'], textStyle: { color: colors.textMuted }, top: 0 },
      grid: { left: '2%', right: '2%', bottom: '3%', top: '12%', containLabel: true },
      xAxis: { 
        type: 'category', 
        data: ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'],
        axisLine: { lineStyle: { color: colors.border } },
        axisLabel: { color: colors.textMuted, fontSize: 11 }
      },
      yAxis: { 
        type: 'value', 
        splitLine: { lineStyle: { color: colors.border, type: 'dashed' } },
        axisLabel: { color: colors.textMuted }
      },
      series: [
        {
          name: '访客数',
          data: [45, 28, 18, 32, 280, 560, 890, 1200, 980, 1350, 1100, 620],
          type: 'line',
          smooth: true,
          itemStyle: { color: colors.primary },
          areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: colors.primary + '55' }, { offset: 1, color: 'transparent' }] } }
        },
        {
          name: '浏览量',
          data: [90, 55, 35, 65, 520, 1100, 1750, 2300, 1900, 2600, 2100, 1200],
          type: 'line',
          smooth: true,
          itemStyle: { color: '#10b981' },
          areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: '#10b98155' }, { offset: 1, color: 'transparent' }] } }
        },
        {
          name: '加购数',
          data: [12, 8, 5, 10, 75, 160, 240, 320, 280, 380, 290, 150],
          type: 'line',
          smooth: true,
          itemStyle: { color: '#f59e0b' }
        }
      ]
    };
  }

  const getSalesChartOption = (timeRange: string) => {
    let days: string[] = [];
    if (timeRange === 'day') days = ['10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'];
    else if (timeRange === 'week') days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
    else if (timeRange === 'month') days = Array.from({length: 15}, (_, i) => String(i*2 + 1) + '日');
    else if (timeRange === 'quarter') days = ['第一季度', '第二季度', '第三季度', '第四季度'];
    else if (timeRange === 'year') days = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

    const salesData = days.map(() => Math.floor(Math.random() * 10000 + 2000));
    const ordersData = days.map(() => Math.floor(Math.random() * 100 + 20));

    return {
      backgroundColor: 'transparent',
      tooltip: { trigger: 'axis', axisPointer: { type: 'cross' } },
      legend: { data: ['销售额(元)', '订单量'], textStyle: { color: colors.textMuted }, top: 0 },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      dataZoom: [
        { type: 'inside', start: 0, end: 100 },
        { start: 0, end: 100 }
      ],
      xAxis: { type: 'category', data: days, axisLine: { lineStyle: { color: colors.border } }, axisLabel: { color: colors.textMuted } },
      yAxis: [
        { type: 'value', name: '销售额', splitLine: { lineStyle: { color: colors.border, type: 'dashed' } }, axisLabel: { color: colors.textMuted }, axisName: { color: colors.textMuted } },
        { type: 'value', name: '订单量', splitLine: { show: false }, axisLabel: { color: colors.textMuted }, axisName: { color: colors.textMuted } }
      ],
      series: [
        {
          name: '销售额(元)',
          type: 'line',
          smooth: true,
          data: salesData,
          itemStyle: { color: colors.primary },
          areaStyle: {
            color: {
              type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [{ offset: 0, color: colors.primary + '66' }, { offset: 1, color: 'transparent' }]
            }
          }
        },
        {
          name: '订单量',
          type: 'line',
          yAxisIndex: 1,
          smooth: true,
          data: ordersData,
          itemStyle: { color: '#10b981' }
        }
      ]
    };
  };

  const getAnalysisRadarOption = () => {
    return {
      backgroundColor: 'transparent',
      tooltip: {},
      radar: {
        indicator: [
          { name: '销售额', max: 100 },
          { name: '转化率', max: 100 },
          { name: '客单价', max: 100 },
          { name: '复购率', max: 100 },
          { name: '浏览量', max: 100 }
        ],
        axisName: { color: colors.textMuted },
        splitLine: { lineStyle: { color: colors.border } },
        splitArea: { show: false },
        axisLine: { lineStyle: { color: colors.border } }
      },
      series: [{
        type: 'radar',
        data: [
          {
            value: [85, 90, 75, 80, 95],
            name: '店铺综合评分',
            itemStyle: { color: colors.primary },
            areaStyle: { color: colors.primary + '50' }
          }
        ]
      }]
    };
  }

  const toggleProductStatus = (id: string) => {
    setProducts(products.map(p => {
      if (p.id === id) {
        return { ...p, status: p.status === 'onsale' ? 'offline' : 'onsale' }
      }
      return p;
    }))
  }

  return (
    <div className="space-y-6 relative">
      {/* 顶部导航与操作区域 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-2" style={{ borderColor: colors.border }}>
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'overview', label: '数据概览', icon: BarChart3 },
            { id: 'products', label: '商品管理', icon: Package },
            { id: 'orders', label: '订单管理', icon: ShoppingCart },
            { id: 'analysis', label: '经营分析', icon: TrendingUp }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={"flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap relative " + (activeTab === tab.id ? 'text-primary' : 'text-text-muted hover:text-text')}
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
          onClick={handleOpenCreateModal}
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
          <motion.div key="overview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
            {/* 数据统计卡片 */}
            <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
              {stats.map((stat, index) => (
                <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="glass-card p-4" style={{ backgroundColor: colors.surface, border: "1px solid" + colors.border }}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: stat.color + '20' }}>
                      <stat.icon size={18} style={{ color: stat.color }} />
                    </div>
                    <span className="text-xs font-medium text-emerald-500">{stat.change}</span>
                  </div>
                  <div className="text-xl md:text-2xl font-bold mb-1" style={{ color: colors.text }}>{stat.value}</div>
                  <div className="text-xs" style={{ color: colors.textMuted }}>{stat.label}</div>
                </motion.div>
              ))}
            </div>

            {/* 销售趋势图表 */}
            <div className="glass-card p-6" style={{ backgroundColor: colors.surface, border: "1px solid " + colors.border }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold" style={{ color: colors.text }}>销售趋势</h3>
                <div className="flex gap-2">
                  {['day', 'week', 'month', 'quarter', 'year'].map(r => (
                    <button
                      key={r}
                      onClick={() => setSalesTimeRange(r as any)}
                      className={"px-3 py-1 text-xs rounded-lg transition-colors " + (salesTimeRange === r ? 'bg-primary text-white' : 'hover:bg-surface/60')}
                      style={{ 
                        backgroundColor: salesTimeRange === r ? colors.primary : colors.surfaceAlt,
                        color: salesTimeRange === r ? '#fff' : colors.textMuted
                      }}
                    >
                      {r === 'day' ? '日' : r === 'week' ? '周' : r === 'month' ? '月' : r === 'quarter' ? '季' : '年'}
                    </button>
                  ))}
                </div>
              </div>
              <div className="h-72 w-full">
                <ReactECharts notMerge={true} option={getSalesChartOption(salesTimeRange)} style={{ height: '100%', width: '100%' }} />
              </div>
            </div>

            {/* 热门商品 */}
            <div className="glass-card p-6" style={{ backgroundColor: colors.surface, border: "1px solid " + colors.border }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold" style={{ color: colors.text }}>热门商品 TOP 5</h3>
                <button className="text-sm hover:underline" style={{ color: colors.primary }}>查看全部</button>
              </div>
              <div className="space-y-3">
                {products.slice(0, 3).map((product, index) => (
                  <div key={product.id} className="flex items-center gap-3 p-2 rounded-lg transition-colors hover:bg-black/5 dark:hover:bg-white/5">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium truncate" style={{ color: colors.text }}>{product.name}</h4>
                      <div className="text-xs" style={{ color: colors.textMuted }}>销量：{product.sales}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold" style={{ color: colors.primary }}>¥{product.price}</div>
                      <div className="text-xs line-through" style={{ color: colors.textMuted }}>¥{product.originalPrice}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'products' && (
          <motion.div key="products" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-4">
            {/* 搜索栏 */}
            <div className="relative">
               <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: colors.textMuted }} />
              <input
                type="text"
                placeholder="搜索商品名称、分类..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg outline-none focus:ring-1 focus:ring-primary"
                style={{ backgroundColor: colors.surface, border: "1px solid " + colors.border, color: colors.text }}
              />
            </div>

            {/* 商品列表 */}
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {products.filter(p => p.name.includes(searchQuery) || p.category.includes(searchQuery)).map(product => (
                <motion.div key={product.id} whileHover={{ y: -4 }} className="glass-card overflow-hidden" style={{ backgroundColor: colors.surface, border: "1px solid " + colors.border }}>
                  <div className="aspect-video relative">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    <div className="absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium bg-black/60 text-white">
                      {product.category}
                    </div>
                    <div className={"absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium shadow-sm " + (product.status === 'onsale' ? 'bg-emerald-500/90 text-white' : 'bg-rose-500/90 text-white')}>
                      {product.status === 'onsale' ? '售卖中' : '已下架'}
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    <h3 className="font-semibold line-clamp-2" style={{ color: colors.text }}>{product.name}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold" style={{ color: colors.primary }}>¥{product.price}</span>
                      <span className="text-sm line-through" style={{ color: colors.textMuted }}>¥{product.originalPrice}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs" style={{ color: colors.textMuted }}>
                      <div className="flex items-center gap-3">
                        <span>销量：{product.sales}</span>
                        <span>库存：{product.stock}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp size={12} />
                        <span className="text-amber-500">{product.rating}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2 border-t" style={{ borderColor: colors.border }}>
                      <button className="flex-1 py-1.5 rounded-lg text-sm font-medium hover:brightness-110 transition-all text-white flex justify-center items-center gap-1"
                        style={{ backgroundColor: colors.primary }}
                        onClick={() => handleOpenEditModal(product)}
                      >
                         <Edit3 size={14} /> 编辑
                      </button>
                      <button className="flex-1 py-1.5 rounded-lg text-sm font-medium hover:brightness-95 transition-all flex justify-center items-center gap-1"
                        style={{ backgroundColor: colors.surfaceAlt, border: "1px solid " + colors.border, color: colors.text }}
                        onClick={() => toggleProductStatus(product.id)}
                      >
                        {product.status === 'onsale' ? '下架' : '上架'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'orders' && (
           <motion.div key="orders" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-4">
             {/* 统计卡片行 */}
             <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
               {[
                 { label: '全部订单', count: orders.length, color: '#6366f1', icon: Package },
                 { label: '待付款', count: orders.filter(o => o.status === 'pending').length, color: '#f59e0b', icon: Clock },
                 { label: '已发货', count: orders.filter(o => o.status === 'shipped').length, color: '#3b82f6', icon: Truck },
                 { label: '已完成', count: orders.filter(o => o.status === 'completed').length, color: '#10b981', icon: CheckCircle }
               ].map(s => (
                 <div key={s.label} className="glass-card p-4 flex items-center gap-3" style={{ backgroundColor: colors.surface, border: '1px solid ' + colors.border }}>
                   <div className="p-2 rounded-lg" style={{ backgroundColor: s.color + '20' }}>
                     <s.icon size={18} style={{ color: s.color }} />
                   </div>
                   <div>
                     <div className="text-xl font-bold" style={{ color: colors.text }}>{s.count}</div>
                     <div className="text-xs" style={{ color: colors.textMuted }}>{s.label}</div>
                   </div>
                 </div>
               ))}
             </div>

             {/* 搜索 + 状态筛选 */}
             <div className="flex flex-col sm:flex-row gap-3">
               <div className="relative flex-1">
                 <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: colors.textMuted }} />
                 <input
                   type="text"
                   placeholder="搜索订单号、商品名称、客户..."
                   value={orderSearchQuery}
                   onChange={e => setOrderSearchQuery(e.target.value)}
                   className="w-full pl-9 pr-4 py-2 rounded-lg text-sm outline-none focus:ring-1 focus:ring-primary shadow-sm"
                   style={{ backgroundColor: colors.surface, border: '1px solid ' + colors.border, color: colors.text }}
                 />
               </div>
               <div className="flex gap-2 flex-wrap items-center">
                 <button
                   onClick={handleOpenCreateOrderModal}
                   className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-primary hover:brightness-110 transition-all flex items-center gap-1.5 shadow-md"
                   style={{ backgroundColor: colors.primary }}
                 >
                   <Plus size={14} />
                   新建订单
                 </button>
                 <div className="h-6 w-[1px] bg-border mx-1 hidden sm:block" />
                 {(['all', 'pending', 'shipped', 'completed', 'cancelled'] as const).map(s => (
                   <button
                     key={s}
                     onClick={() => setOrderStatusFilter(s)}
                     className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                     style={{
                       backgroundColor: orderStatusFilter === s ? colors.primary : colors.surfaceAlt,
                       color: orderStatusFilter === s ? '#fff' : colors.textMuted,
                       border: '1px solid ' + (orderStatusFilter === s ? colors.primary : colors.border)
                     }}
                   >
                     {s === 'all' ? '全部' : s === 'pending' ? '待付款' : s === 'shipped' ? '已发货' : s === 'completed' ? '已完成' : '已取消'}
                   </button>
                 ))}
               </div>
             </div>

             {/* 订单列表 */}
             <div className="space-y-3">
               {orders
                 .filter(o => orderStatusFilter === 'all' || o.status === orderStatusFilter)
                 .filter(o => !orderSearchQuery || o.id.includes(orderSearchQuery) || o.productName.includes(orderSearchQuery) || o.customer.includes(orderSearchQuery))
                 .map(order => (
                   <motion.div
                     key={order.id}
                     layout
                     className="glass-card overflow-hidden"
                     style={{ backgroundColor: colors.surface, border: '1px solid ' + colors.border }}
                   >
                     <div
                       className="flex items-center gap-4 p-4 cursor-pointer hover:bg-black/3 dark:hover:bg-white/3 transition-colors"
                       onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                     >
                       <div className="flex-1 min-w-0">
                         <div className="flex items-center gap-2 flex-wrap">
                           <span className="text-sm font-mono font-medium" style={{ color: colors.primary }}>{order.id}</span>
                           <span className={"px-2 py-0.5 rounded-full text-[10px] font-medium " + (
                             order.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500' :
                             order.status === 'pending' ? 'bg-amber-500/10 text-amber-500' :
                             order.status === 'shipped' ? 'bg-blue-500/10 text-blue-500' :
                             'bg-rose-500/10 text-rose-500'
                           )}>
                             {order.status === 'completed' ? '✓ 已完成' : order.status === 'pending' ? '⏳ 待付款' : order.status === 'shipped' ? '🚚 已发货' : '✗ 已取消'}
                           </span>
                         </div>
                         <div className="text-sm mt-0.5 truncate" style={{ color: colors.text }}>{order.productName} × {order.quantity}</div>
                         <div className="text-xs mt-0.5" style={{ color: colors.textMuted }}>{order.customer} · {order.date}</div>
                       </div>
                       <div className="text-right shrink-0">
                         <div className="text-base font-bold" style={{ color: colors.primary }}>¥{order.amount}</div>
                         <div className="text-xs" style={{ color: colors.textMuted }}>{order.payMethod}</div>
                       </div>
                       <ChevronDown
                         size={16}
                         style={{ color: colors.textMuted, transform: expandedOrderId === order.id ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
                       />
                     </div>
                     <AnimatePresence>
                       {expandedOrderId === order.id && (
                         <motion.div
                           initial={{ height: 0, opacity: 0 }}
                           animate={{ height: 'auto', opacity: 1 }}
                           exit={{ height: 0, opacity: 0 }}
                           transition={{ duration: 0.2 }}
                           className="border-t overflow-hidden"
                           style={{ borderColor: colors.border }}
                         >
                           <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                             <div>
                               <span className="text-xs font-medium" style={{ color: colors.textMuted }}>联系电话</span>
                               <div style={{ color: colors.text }}>{order.phone}</div>
                             </div>
                             <div>
                               <span className="text-xs font-medium" style={{ color: colors.textMuted }}>支付方式</span>
                               <div style={{ color: colors.text }}>{order.payMethod}</div>
                             </div>
                             <div className="sm:col-span-2">
                               <span className="text-xs font-medium" style={{ color: colors.textMuted }}>收货地址</span>
                               <div style={{ color: colors.text }}>{order.address}</div>
                             </div>

                             {/* 订单附件上传 */}
                             <div className="sm:col-span-2 mt-2 pt-3 border-t border-dashed" style={{ borderColor: colors.border }}>
                               <span className="text-xs font-bold block mb-2" style={{ color: colors.textSecondary }}>订单附件 / 凭证</span>
                               <div className="flex items-center gap-3">
                                 <button 
                                   onClick={() => document.getElementById(`file-upload-${order.id}`)?.click()}
                                   disabled={!!uploadProgress[order.id]}
                                   className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors disabled:opacity-50"
                                   style={{ 
                                     borderColor: colors.border, 
                                     backgroundColor: colors.surfaceAlt,
                                     color: colors.text
                                   }}
                                 >
                                    <Upload size={14} />
                                    {uploadProgress[order.id] ? '正在上传...' : '上传附件'}
                                 </button>
                                 <input 
                                   id={`file-upload-${order.id}`}
                                   type="file"
                                   className="hidden"
                                   onChange={(e) => {
                                     const file = e.target.files?.[0]
                                     if (file) handleFileUpload(order.id, file)
                                   }}
                                 />
                                 <span className="text-[10px]" style={{ color: colors.textMuted }}>支持 PDF, Word, Excel (Max 10MB)</span>
                               </div>

                               {/* 进度条 */}
                               {uploadProgress[order.id] !== undefined && (
                                 <div className="mt-3 space-y-1">
                                   <div className="flex justify-between text-[10px]">
                                     <span style={{ color: colors.textMuted }}>文件上传中...</span>
                                     <span className="font-bold text-primary">{uploadProgress[order.id]}%</span>
                                   </div>
                                   <div className="h-1 w-full bg-surface-alt rounded-full overflow-hidden" style={{ backgroundColor: colors.border + '20' }}>
                                     <motion.div 
                                       initial={{ width: 0 }}
                                       animate={{ width: `${uploadProgress[order.id]}%` }}
                                       className="h-full bg-primary"
                                       style={{ backgroundColor: colors.primary }}
                                     />
                                   </div>
                                 </div>
                               )}
                             </div>

                             <div className="sm:col-span-2 flex gap-2 pt-2">
                               {order.status === 'pending' && (
                                 <button
                                   onClick={() => setOrders(orders.map(o => o.id === order.id ? { ...o, status: 'shipped' } : o))}
                                   className="px-3 py-1.5 rounded-lg text-xs font-medium text-white transition-all hover:brightness-110"
                                   style={{ backgroundColor: '#3b82f6' }}
                                 >
                                   🚚 确认发货
                                 </button>
                               )}
                               {order.status === 'shipped' && (
                                 <button
                                   onClick={() => setOrders(orders.map(o => o.id === order.id ? { ...o, status: 'completed' } : o))}
                                   className="px-3 py-1.5 rounded-lg text-xs font-medium text-white transition-all hover:brightness-110"
                                   style={{ backgroundColor: '#10b981' }}
                                 >
                                   ✓ 确认收货
                                 </button>
                               )}
                               {(order.status === 'pending' || order.status === 'shipped') && (
                                 <button
                                   onClick={() => setOrders(orders.map(o => o.id === order.id ? { ...o, status: 'cancelled' } : o))}
                                   className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:brightness-95"
                                   style={{ backgroundColor: colors.surfaceAlt, border: '1px solid ' + colors.border, color: colors.textMuted }}
                                 >
                                   取消订单
                                 </button>
                               )}
                             </div>
                           </div>
                         </motion.div>
                       )}
                     </AnimatePresence>
                   </motion.div>
                 ))}
             </div>
           </motion.div>
        )}

        {activeTab === 'analysis' && (
          <motion.div key="analysis" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-4">
            {/* 图表区 - 品类表现雷达图 + 流量折线图 */}
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
              <div className="glass-card p-6" style={{ backgroundColor: colors.surface, border: "1px solid " + colors.border }}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold" style={{ color: colors.text }}>品类表现分析</h3>
                  <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: colors.primary + '15', color: colors.primary }}>雷达图</span>
                </div>
                <div className="h-72">
                  <ReactECharts notMerge={true} option={getAnalysisRadarOption()} style={{ height: '100%', width: '100%' }} />
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                  {[{ label: '数码配件', val: '85分', color: '#6366f1' }, { label: '智能穿戴', val: '90分', color: '#10b981' }, { label: '生活用品', val: '72分', color: '#f59e0b' }].map(c => (
                    <div key={c.label} className="rounded-lg p-2" style={{ backgroundColor: c.color + '10' }}>
                      <div className="text-sm font-bold" style={{ color: c.color }}>{c.val}</div>
                      <div className="text-[10px]" style={{ color: colors.textMuted }}>{c.label}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="glass-card p-6" style={{ backgroundColor: colors.surface, border: "1px solid " + colors.border }}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold" style={{ color: colors.text }}>流量分布波动</h3>
                  <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: '#10b981' + '15', color: '#10b981' }}>折线图</span>
                </div>
                <div className="h-72">
                  <ReactECharts notMerge={true} option={getTrafficFlowChartOption()} style={{ height: '100%', width: '100%' }} />
                </div>
                <div className="mt-3 flex gap-4 text-xs" style={{ color: colors.textMuted }}>
                  <span>📈 日均访客 <strong style={{ color: colors.text }}>1,247</strong></span>
                  <span>👁 日均浏览量 <strong style={{ color: colors.text }}>2,890</strong></span>
                  <span>🛒 加购转化 <strong style={{ color: colors.text }}>12.6%</strong></span>
                </div>
              </div>
            </div>

            {/* 运营核心指标汇总 - 在两图表下方 */}
            <div className="glass-card p-6" style={{ backgroundColor: colors.surface, border: "1px solid " + colors.border }}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold" style={{ color: colors.text }}>运营核心指标汇总</h3>
                <span className="text-xs" style={{ color: colors.textMuted }}>数据更新至今日</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { label: '人均浏览量', value: '8.5页', icon: Eye, color: '#3b82f6', change: '+0.8', desc: '较昨日提升' },
                  { label: '互动率', value: '12.4%', icon: MessageSquare, color: '#10b981', change: '+1.2%', desc: '较上周提升' },
                  { label: '分享转化量', value: '456', icon: Share2, color: '#8b5cf6', change: '+38', desc: '较上月提升' },
                  { label: '好评率', value: '98.2%', icon: ThumbsUp, color: '#f59e0b', change: '+0.3%', desc: '近30天均值' }
                ].map(item => (
                  <div key={item.label} className="glass-card p-4 rounded-xl" style={{ backgroundColor: colors.bgAlt || colors.surfaceAlt, border: '1px solid ' + colors.border }}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-1.5 rounded-lg" style={{ backgroundColor: item.color + '20' }}>
                        <item.icon size={16} style={{ color: item.color }} />
                      </div>
                      <span className="text-xs" style={{ color: colors.textMuted }}>{item.label}</span>
                    </div>
                    <div className="text-2xl font-bold mb-1" style={{ color: colors.text }}>{item.value}</div>
                    <div className="flex items-center gap-1 text-xs">
                      <span className="text-emerald-500 font-medium">{item.change}</span>
                      <span style={{ color: colors.textMuted }}>{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 上传/编辑商品弹窗 */}
      <AnimatePresence>
        {isProductModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden glass-card flex flex-col max-h-[90vh]"
              style={{ backgroundColor: colors.surface, border: "1px solid " + colors.border }}
            >
              <div className="flex items-center justify-between p-4 border-b shrink-0" style={{ borderColor: colors.border, backgroundColor: colors.surface }}>
                <h3 className="font-semibold text-lg" style={{ color: colors.text }}>
                  {editingProduct ? '编辑商品' : '上传商品'}
                </h3>
                <button onClick={() => setIsProductModalOpen(false)} className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                  <X size={20} style={{ color: colors.textMuted }} />
                </button>
              </div>
              <div className="p-6 space-y-5 overflow-y-auto w-full no-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-medium mb-1.5" style={{ color: colors.text }}>商品名称</label>
                    <input 
                      type="text" 
                      placeholder="输入商品名称" 
                      className="w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-1 focus:ring-primary" 
                      style={{ backgroundColor: colors.bgAlt, border: "1px solid " + colors.border, color: colors.text }} 
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: colors.text }}>销售价格</label>
                    <input 
                      type="number" 
                      placeholder="0.00" 
                      className="w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-1 focus:ring-primary" 
                      style={{ backgroundColor: colors.bgAlt, border: "1px solid " + colors.border, color: colors.text }} 
                      value={formData.price || 0}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: colors.text }}>库存数量</label>
                    <input 
                      type="number" 
                      placeholder="0" 
                      className="w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-1 focus:ring-primary" 
                      style={{ backgroundColor: colors.bgAlt, border: "1px solid " + colors.border, color: colors.text }} 
                      value={formData.stock || 0}
                      onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    />
                  </div>
                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-medium mb-1.5" style={{ color: colors.text }}>商品分类</label>
                    <select 
                      className="w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-1 focus:ring-primary" 
                      style={{ backgroundColor: colors.bgAlt, border: "1px solid " + colors.border, color: colors.text }}
                      value={formData.category || '数码配件'}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option>数码配件</option>
                      <option>智能穿戴</option>
                      <option>生活用品</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: colors.text }}>原始价格</label>
                    <input 
                      type="number" 
                      placeholder="0.00" 
                      className="w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-1 focus:ring-primary" 
                      style={{ backgroundColor: colors.bgAlt, border: "1px solid " + colors.border, color: colors.text }} 
                      value={formData.originalPrice || 0}
                      onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: colors.text }}>商品评分</label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="number" 
                        min="0" max="5" step="0.1"
                        placeholder="5.0" 
                        className="w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-1 focus:ring-primary" 
                        style={{ backgroundColor: colors.bgAlt, border: "1px solid " + colors.border, color: colors.text }} 
                        value={formData.rating || 5.0}
                        onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                      />
                      <Star size={16} className="text-amber-500 shrink-0" />
                    </div>
                  </div>
                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-medium mb-1.5" style={{ color: colors.text }}>商品主图</label>
                    <div 
                      className={`relative border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all ${isDraggingProduct ? 'scale-[0.98] border-primary bg-primary/5' : 'border-border/40 bg-surface-alt'}`}
                      style={{ 
                        borderColor: isDraggingProduct ? colors.primary : colors.border + '40', 
                        backgroundColor: isDraggingProduct ? colors.primary + '05' : colors.surfaceAlt 
                      }}
                      onDragOver={(e) => { e.preventDefault(); setIsDraggingProduct(true); }}
                      onDragLeave={() => setIsDraggingProduct(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsDraggingProduct(false);
                        const file = e.dataTransfer.files[0];
                        if (file && ['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
                          alert(`图片 ${file.name} 已准备上传`);
                          setFormData({ ...formData, image: URL.createObjectURL(file) });
                        } else {
                          alert('仅支持 JPG, PNG, WEBP 格式图片');
                        }
                      }}
                      onClick={() => document.getElementById('product-image-upload')?.click()}
                    >
                      <input 
                        id="product-image-upload"
                        type="file" 
                        accept=".jpg,.jpeg,.png,.webp"
                        className="hidden" 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setFormData({ ...formData, image: URL.createObjectURL(file) });
                          }
                        }}
                      />
                      {formData.image ? (
                        <div className="relative w-full aspect-video rounded-lg overflow-hidden group">
                          <img src={formData.image} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <Upload size={24} className="text-white" />
                          </div>
                        </div>
                      ) : (
                        <>
                          <Upload size={32} className="mb-3 transition-transform group-hover:scale-110" style={{ color: colors.textMuted }} />
                          <p className="text-sm font-bold" style={{ color: colors.text }}>点击或拖拽上传图片</p>
                          <p className="text-[10px] mt-1" style={{ color: colors.textMuted }}>支持 JPG, PNG, WEBP 格式 (建议尺寸 800x600)</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 p-4 border-t shrink-0" style={{ borderColor: colors.border, backgroundColor: colors.surface }}>
                <button onClick={() => setIsProductModalOpen(false)} className="px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:brightness-95" style={{ color: colors.text, backgroundColor: colors.surface, border: "1px solid " + colors.border }}>
                  取消
                </button>
                <button onClick={handleSaveProduct} className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-all hover:brightness-110" style={{ backgroundColor: colors.primary }}>
                  保存商品
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 新建订单弹窗 */}
      <AnimatePresence>
        {isOrderModalOpen && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              className="w-full max-w-xl rounded-2xl shadow-xl overflow-hidden glass-card flex flex-col max-h-[90vh]"
              style={{ backgroundColor: colors.surface, border: `1px solid ${colors.border}` }}
            >
              <div className="flex items-center justify-between p-4 border-b shrink-0" style={{ borderColor: colors.border, backgroundColor: colors.surface }}>
                <h3 className="font-semibold text-lg" style={{ color: colors.text }}>新建订单</h3>
                <button onClick={() => setIsOrderModalOpen(false)} className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                  <X size={20} style={{ color: colors.textMuted }} />
                </button>
              </div>
              
              <div className="p-6 space-y-4 overflow-y-auto no-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1.5" style={{ color: colors.text }}>商品名称</label>
                    <input
                      type="text"
                      placeholder="请输入商品名称"
                      className="w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-1 focus:ring-primary"
                      style={{ backgroundColor: colors.bgAlt, border: "1px solid " + colors.border, color: colors.text }}
                      value={orderFormData.productName || ''}
                      onChange={(e) => setOrderFormData({ ...orderFormData, productName: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: colors.text }}>客户姓名</label>
                    <input
                      type="text"
                      placeholder="如何称呼客户"
                      className="w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-1 focus:ring-primary"
                      style={{ backgroundColor: colors.bgAlt, border: "1px solid " + colors.border, color: colors.text }}
                      value={orderFormData.customer || ''}
                      onChange={(e) => setOrderFormData({ ...orderFormData, customer: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: colors.text }}>联系电话</label>
                    <input
                      type="text"
                      placeholder="联系电话"
                      className="w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-1 focus:ring-primary"
                      style={{ backgroundColor: colors.bgAlt, border: "1px solid " + colors.border, color: colors.text }}
                      value={orderFormData.phone || ''}
                      onChange={(e) => setOrderFormData({ ...orderFormData, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: colors.text }}>交易金额 (¥)</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-1 focus:ring-primary"
                      style={{ backgroundColor: colors.bgAlt, border: "1px solid " + colors.border, color: colors.text }}
                      value={orderFormData.amount || ''}
                      onChange={(e) => setOrderFormData({ ...orderFormData, amount: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: colors.text }}>支付方式</label>
                    <select
                      className="w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-1 focus:ring-primary"
                      style={{ backgroundColor: colors.bgAlt, border: "1px solid " + colors.border, color: colors.text }}
                      value={orderFormData.payMethod}
                      onChange={(e) => setOrderFormData({ ...orderFormData, payMethod: e.target.value })}
                    >
                      <option value="微信支付">微信支付</option>
                      <option value="支付宝">支付宝</option>
                      <option value="银联支付">银联支付</option>
                      <option value="货到付款">货到付款</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1.5" style={{ color: colors.text }}>收货地址</label>
                    <textarea
                      placeholder="请输入详细地址"
                      className="w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-1 focus:ring-primary min-h-[80px]"
                      style={{ backgroundColor: colors.bgAlt, border: "1px solid " + colors.border, color: colors.text }}
                      value={orderFormData.address || ''}
                      onChange={(e) => setOrderFormData({ ...orderFormData, address: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 border-t flex justify-end gap-3 shrink-0" style={{ borderColor: colors.border }}>
                <button onClick={() => setIsOrderModalOpen(false)} className="px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:brightness-95" style={{ color: colors.text, backgroundColor: colors.surface, border: "1px solid " + colors.border }}>
                  取消
                </button>
                <button onClick={handleSaveOrder} className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-all hover:brightness-110" style={{ backgroundColor: colors.primary }}>
                  提交订单
                </button>
              </div>
            </motion.div>
          </div>
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
    return 'bookmarks'
  }
  
  const [activeTab, setActiveTab] = useState<TabId>(getInitialTab)

  return (
    <PageTransition>
      <div className="mx-auto max-w-6xl px-6 py-8">
        {/* 顶部页眉与标签导航 */}
        <div className="mb-4 md:mb-8 flex flex-col md:flex-row md:items-center justify-start gap-4 md:gap-12">
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
