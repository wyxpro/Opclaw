import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FlaskConical, Clock, Rocket, CheckCircle2,
  Calendar, Tag, ArrowLeft,
  Beaker, Layers, Wifi, Smartphone, Brain, Eye, Palette, Database
} from 'lucide-react'
import { useTheme } from '../hooks/useTheme'
import PageTransition from '../components/ui/PageTransition'

// 历史实验记录数据 - SuperUI 项目开发历程
const timelineData = [
  {
    id: 1,
    date: '2024-03',
    title: 'AI 分身系统上线',
    description: '集成多模态 AI 能力，实现个性化数字分身创建与交互',
    icon: Brain,
    color: '#8b5cf6',
    status: 'completed',
    tags: ['AI', 'React', 'TypeScript']
  },
  {
    id: 2,
    date: '2024-02',
    title: '动态主题系统',
    description: '实现极简/赛博/艺术/童趣/复古五种主题切换，支持自定义配色',
    icon: Palette,
    color: '#ec4899',
    status: 'completed',
    tags: ['CSS变量', '主题系统', 'Tailwind']
  },
  {
    id: 3,
    date: '2024-01',
    title: '3D 轮播组件',
    description: '开发兴趣爱好模块的 3D 卡片轮播，支持悬停展开和手势滑动',
    icon: Eye,
    color: '#f59e0b',
    status: 'completed',
    tags: ['Framer Motion', '3D变换', '手势交互']
  },
  {
    id: 4,
    date: '2023-12',
    title: '数字名片生成器',
    description: '实现个性化数字名片设计，支持多主题模板和一键分享',
    icon: Smartphone,
    color: '#10b981',
    status: 'completed',
    tags: ['Canvas', '图片生成', '分享']
  },
  {
    id: 5,
    date: '2023-11',
    title: 'RAG 知识库系统',
    description: '构建基于向量检索的 AI 知识库，支持文档导入和智能问答',
    icon: Database,
    color: '#3b82f6',
    status: 'completed',
    tags: ['RAG', '向量检索', 'AI助手']
  },
  {
    id: 6,
    date: '2023-10',
    title: '项目架构重构',
    description: '从单体应用重构为模块化架构，实现懒加载和性能优化',
    icon: Layers,
    color: '#06b6d4',
    status: 'completed',
    tags: ['Vite', '模块化', '性能优化']
  }
]

// 未来开发计划数据 - SuperUI 发展规划
const futurePlans = [
  {
    id: 1,
    title: 'AI 简历优化器',
    description: '基于大模型的智能简历分析和优化建议，支持多行业模板',
    icon: Brain,
    color: '#8b5cf6',
    priority: 'high',
    quarter: '2024 Q2',
    progress: 25,
    tags: ['LLM', 'NLP', '简历解析']
  },
  {
    id: 2,
    title: '实时协作编辑器',
    description: '支持多人实时协作的富文本编辑器，用于文章和笔记创作',
    icon: Palette,
    color: '#ec4899',
    priority: 'high',
    quarter: '2024 Q2',
    progress: 15,
    tags: ['WebSocket', 'CRDT', '协同编辑']
  },
  {
    id: 3,
    title: '数据可视化大屏',
    description: '个人数字资产数据可视化展示，支持自定义图表和实时更新',
    icon: Eye,
    color: '#f59e0b',
    priority: 'medium',
    quarter: '2024 Q3',
    progress: 10,
    tags: ['D3.js', 'ECharts', '数据可视化']
  },
  {
    id: 4,
    title: '语音交互系统',
    description: '集成语音识别和合成，支持语音控制和语音笔记',
    icon: Wifi,
    color: '#10b981',
    priority: 'medium',
    quarter: '2024 Q3',
    progress: 5,
    tags: ['Web Speech API', 'TTS', '语音识别']
  },
  {
    id: 5,
    title: 'PWA 离线支持',
    description: '实现完整的离线访问能力，支持本地数据缓存和同步',
    icon: Smartphone,
    color: '#3b82f6',
    priority: 'low',
    quarter: '2024 Q4',
    progress: 0,
    tags: ['PWA', 'Service Worker', 'IndexedDB']
  },
  {
    id: 6,
    title: 'WebGL 3D 展示',
    description: '探索 Three.js 实现 3D 个人空间展示和交互体验',
    icon: Beaker,
    color: '#06b6d4',
    priority: 'research',
    quarter: '2025 Q1',
    progress: 0,
    tags: ['Three.js', 'WebGL', '3D渲染']
  }
]

// 优先级配置
const priorityConfig = {
  high: { label: '高优先级', color: '#ef4444', bgColor: '#fef2f2' },
  medium: { label: '中优先级', color: '#f59e0b', bgColor: '#fffbeb' },
  low: { label: '低优先级', color: '#10b981', bgColor: '#ecfdf5' },
  research: { label: '研究中', color: '#8b5cf6', bgColor: '#f5f3ff' }
}

// 时间轴项目组件
function TimelineItem({ item, index }: { item: typeof timelineData[0]; index: number }) {
  const { themeConfig } = useTheme()
  const Icon = item.icon

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="relative flex gap-4 pb-8 last:pb-0"
    >
      {/* 时间线 */}
      <div className="flex flex-col items-center">
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ background: `${item.color}20`, border: `2px solid ${item.color}40` }}
        >
          <Icon size={20} style={{ color: item.color }} />
        </motion.div>
        {index < timelineData.length - 1 && (
          <div className="w-0.5 flex-1 mt-2" style={{ background: `linear-gradient(to bottom, ${item.color}40, transparent)` }} />
        )}
      </div>

      {/* 内容卡片 */}
      <div className="flex-1 -mt-1">
        <motion.div
          whileHover={{ y: -4 }}
          className="p-4 rounded-2xl cursor-pointer"
          style={{
            background: themeConfig.colors.surface,
            border: `1px solid ${themeConfig.colors.border}`,
            boxShadow: `0 4px 20px ${item.color}10`
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: `${item.color}15`, color: item.color }}>
              {item.date}
            </span>
            <CheckCircle2 size={14} style={{ color: '#10b981' }} />
          </div>
          <h3 className="text-lg font-bold mb-1" style={{ color: themeConfig.colors.text }}>
            {item.title}
          </h3>
          <p className="text-sm mb-3" style={{ color: themeConfig.colors.textMuted }}>
            {item.description}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {item.tags.map(tag => (
              <span
                key={tag}
                className="text-xs px-2 py-1 rounded-md"
                style={{ background: themeConfig.colors.bg, color: themeConfig.colors.textSecondary }}
              >
                {tag}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

// 计划卡片组件
function PlanCard({ plan, index }: { plan: typeof futurePlans[0]; index: number }) {
  const { themeConfig } = useTheme()
  const Icon = plan.icon
  const priority = priorityConfig[plan.priority]

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -6, scale: 1.02 }}
      className="relative p-5 rounded-2xl cursor-pointer overflow-hidden"
      style={{
        background: themeConfig.colors.surface,
        border: `1px solid ${themeConfig.colors.border}`,
        boxShadow: `0 4px 24px ${plan.color}15`
      }}
    >
      {/* 顶部装饰条 */}
      <div className="absolute top-0 left-0 right-0 h-1" style={{ background: `linear-gradient(to right, ${plan.color}, ${plan.color}60)` }} />

      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: `${plan.color}15` }}
          >
            <Icon size={20} style={{ color: plan.color }} />
          </div>
          <div>
            <h3 className="font-bold" style={{ color: themeConfig.colors.text }}>{plan.title}</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <Calendar size={12} style={{ color: themeConfig.colors.textMuted }} />
              <span className="text-xs" style={{ color: themeConfig.colors.textMuted }}>{plan.quarter}</span>
            </div>
          </div>
        </div>
        <span
          className="text-xs px-2 py-1 rounded-full font-medium"
          style={{ background: priority.bgColor, color: priority.color }}
        >
          {priority.label}
        </span>
      </div>

      <p className="text-sm mb-4 line-clamp-2" style={{ color: themeConfig.colors.textMuted }}>
        {plan.description}
      </p>

      {/* 进度条 */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs" style={{ color: themeConfig.colors.textMuted }}>开发进度</span>
          <span className="text-xs font-medium" style={{ color: plan.color }}>{plan.progress}%</span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: themeConfig.colors.bg }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${plan.progress}%` }}
            transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
            className="h-full rounded-full"
            style={{ background: `linear-gradient(to right, ${plan.color}, ${plan.color}80)` }}
          />
        </div>
      </div>

      {/* 标签 */}
      <div className="flex flex-wrap gap-1.5">
        {plan.tags.map(tag => (
          <span
            key={tag}
            className="text-xs px-2 py-1 rounded-md flex items-center gap-1"
            style={{ background: `${plan.color}10`, color: plan.color }}
          >
            <Tag size={10} />
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  )
}

export default function Laboratory() {
  const { themeConfig } = useTheme()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'timeline' | 'plans'>('timeline')

  return (
    <PageTransition>
      <div className="min-h-screen pb-20" style={{ background: themeConfig.colors.bg }}>
        {/* 头部区域 */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl" style={{ background: 'linear-gradient(135deg, #8b5cf6, #ec4899)' }} />
            <div className="absolute top-40 right-10 w-96 h-96 rounded-full blur-3xl" style={{ background: 'linear-gradient(135deg, #3b82f6, #10b981)' }} />
          </div>

          <div className="relative px-4 sm:px-6 lg:px-8 pt-8 pb-6">
            {/* 返回按钮 */}
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => navigate('/social')}
              className="flex items-center gap-2 mb-4 text-sm font-medium transition-colors"
              style={{ color: themeConfig.colors.textMuted }}
            >
              <ArrowLeft size={18} />
              返回我的
            </motion.button>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-6xl mx-auto"
            >
              {/* 标题 */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #8b5cf6, #ec4899)' }}>
                  <FlaskConical size={28} className="text-white" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: themeConfig.colors.text }}>实验室</h1>
                  <p className="text-sm mt-0.5" style={{ color: themeConfig.colors.textMuted }}>技术实验 · 开发计划 · 创新探索</p>
                </div>
              </div>

              {/* 标签切换 */}
              <div className="flex gap-2 p-1 rounded-xl" style={{ background: themeConfig.colors.bg }}>
                <button
                  onClick={() => setActiveTab('timeline')}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all"
                  style={{
                    background: activeTab === 'timeline' ? themeConfig.colors.surface : 'transparent',
                    color: activeTab === 'timeline' ? themeConfig.colors.primary : themeConfig.colors.textMuted,
                    boxShadow: activeTab === 'timeline' ? `0 2px 8px ${themeConfig.colors.primary}20` : 'none'
                  }}
                >
                  <Clock size={16} />
                  历史时间轴
                </button>
                <button
                  onClick={() => setActiveTab('plans')}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all"
                  style={{
                    background: activeTab === 'plans' ? themeConfig.colors.surface : 'transparent',
                    color: activeTab === 'plans' ? themeConfig.colors.primary : themeConfig.colors.textMuted,
                    boxShadow: activeTab === 'plans' ? `0 2px 8px ${themeConfig.colors.primary}20` : 'none'
                  }}
                >
                  <Rocket size={16} />
                  未来计划
                </button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* 内容区域 */}
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <AnimatePresence mode="wait">
              {activeTab === 'timeline' ? (
                <motion.div
                  key="timeline"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="py-6"
                >
                  <div className="max-w-2xl">
                    {timelineData.map((item, index) => (
                      <TimelineItem key={item.id} item={item} index={index} />
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="plans"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="py-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {futurePlans.map((plan, index) => (
                      <PlanCard key={plan.id} plan={plan} index={index} />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
