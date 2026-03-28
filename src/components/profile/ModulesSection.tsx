import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  FileText, 
  BookOpen, 
  Bot, 
  GitBranch, 
  Camera, 
  Heart, 
  Music, 
  Film, 
  Bookmark,
  ArrowRight,
  Sparkles,
  MessageCircle,
  Dumbbell
} from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'
import type { ModuleEntry } from '../../types/profile'
import { AnimatedSection } from './AnimatedSection'

interface ModulesSectionProps {
  modules?: ModuleEntry[]
}

// 图标映射
const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  FileText,
  BookOpen,
  Bot,
  GitBranch,
  Camera,
  Heart,
  Music,
  Film,
  Bookmark,
  MessageCircle,
  Dumbbell
}

// 默认模块数据
const defaultModules: ModuleEntry[] = [
  {
    id: 'resume',
    title: '在线简历',
    description: '专业的在线简历展示，支持 PDF 导出',
    icon: 'FileText',
    path: '/learning',
    color: '#3B82F6',
    gradient: 'from-blue-500 to-cyan-500',
    features: ['技能展示', '项目经历', '教育背景', 'PDF导出']
  },
  {
    id: 'articles',
    title: '文章博客',
    description: '技术文章和知识分享，支持 Markdown 编辑',
    icon: 'BookOpen',
    path: '/learning',
    color: '#10B981',
    gradient: 'from-emerald-500 to-teal-500',
    features: ['Markdown', '代码高亮', '标签管理', '全文搜索']
  },
  {
    id: 'ai-assistant',
    title: 'AI 助手',
    description: '智能 AI 助手，辅助学习和创作',
    icon: 'Bot',
    path: '/learning',
    color: '#8B5CF6',
    gradient: 'from-violet-500 to-purple-500',
    features: ['智能对话', '代码辅助', '文档分析', '知识问答']
  },
  {
    id: 'skilltree',
    title: '技能树',
    description: '可视化技能学习和成长路径',
    icon: 'GitBranch',
    path: '/learning',
    color: '#F59E0B',
    gradient: 'from-amber-500 to-orange-500',
    features: ['技能雷达', '知识图谱', '学习进度', '3D可视化']
  },
  {
    id: 'moments',
    title: '朋友圈',
    description: '分享生活点滴，记录美好瞬间',
    icon: 'MessageCircle',
    path: '/life',
    color: '#F59E0B',
    gradient: 'from-amber-500 to-orange-500',
    features: ['图文动态', '视频分享', '好友互动', '评论点赞']
  },
  {
    id: 'travel',
    title: '旅拍相册',
    description: '记录美好的旅行时光和风景',
    icon: 'Camera',
    path: '/life',
    color: '#EC4899',
    gradient: 'from-pink-500 to-rose-500',
    features: ['地图标记', '照片墙', '路线规划', '足迹统计']
  },
  {
    id: 'love',
    title: '恋爱记录',
    description: '甜蜜的恋爱时光和纪念日',
    icon: 'Heart',
    path: '/life',
    color: '#F43F5E',
    gradient: 'from-rose-500 to-red-500',
    features: ['纪念日', '时光相册', '愿望清单', '祝福墙']
  },
  {
    id: 'sports',
    title: '运动',
    description: '记录运动数据，保持健康生活方式',
    icon: 'Dumbbell',
    path: '/life',
    color: '#84CC16',
    gradient: 'from-lime-500 to-green-500',
    features: ['运动记录', '数据统计', '目标设定', '健康报告']
  },
  {
    id: 'music',
    title: '音乐盒',
    description: '收藏喜爱的音乐和歌单',
    icon: 'Music',
    path: '/entertainment',
    color: '#06B6D4',
    gradient: 'from-cyan-500 to-blue-500',
    features: ['黑胶播放', '歌单管理', '本地导入', '可视化']
  },
  {
    id: 'movies',
    title: '收藏电影',
    description: '电影收藏和观影记录',
    icon: 'Film',
    path: '/entertainment',
    color: '#6366F1',
    gradient: 'from-indigo-500 to-violet-500',
    features: ['评分系统', '观影记录', '推荐算法', '海报墙']
  },
  {
    id: 'bookmarks',
    title: '百宝箱',
    description: '收藏有用的工具和资源链接',
    icon: 'Bookmark',
    path: '/entertainment',
    color: '#14B8A6',
    gradient: 'from-teal-500 to-emerald-500',
    features: ['分类管理', '快速搜索', '标签系统', '链接预览']
  }
]

// 模块分组
const moduleGroups = [
  {
    id: 'learning',
    title: '学习空间',
    description: '知识管理与技能提升',
    modules: ['resume', 'articles', 'ai-assistant', 'skilltree']
  },
  {
    id: 'life',
    title: '生活记录',
    description: '美好时光与回忆',
    modules: ['moments', 'travel', 'love', 'sports']
  },
  {
    id: 'entertainment',
    title: '娱乐中心',
    description: '兴趣爱好与休闲',
    modules: ['music', 'movies', 'bookmarks']
  }
]

// 模块卡片组件
function ModuleCard({ module, index }: { module: ModuleEntry; index: number }) {
  const { themeConfig } = useTheme()
  const navigate = useNavigate()
  const Icon = iconMap[module.icon] || Sparkles

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -5, scale: 1.02 }}
      onClick={() => navigate(module.path)}
      className="group cursor-pointer relative p-5 rounded-2xl overflow-hidden"
      style={{
        background: themeConfig.colors.surface,
        border: `1px solid ${themeConfig.colors.border}`
      }}
    >
      {/* 渐变背景 */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${module.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
      />

      <div className="relative">
        {/* 头部：图标和标题 */}
        <div className="flex items-start justify-between mb-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ 
              background: `linear-gradient(135deg, ${module.color}20, ${module.color}10)`,
              color: module.color
            }}
          >
            <Icon size={24} />
          </div>
          <motion.div
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            whileHover={{ x: 3 }}
          >
            <ArrowRight size={18} style={{ color: module.color }} />
          </motion.div>
        </div>

        {/* 标题和描述 */}
        <h3
          className="text-lg font-semibold mb-1 transition-colors"
          style={{ color: themeConfig.colors.text }}
        >
          {module.title}
        </h3>
        <p
          className="text-sm mb-3"
          style={{ color: themeConfig.colors.textMuted }}
        >
          {module.description}
        </p>

        {/* 功能标签 */}
        <div className="flex flex-wrap gap-1.5">
          {module.features.slice(0, 2).map((feature) => (
            <span
              key={feature}
              className="px-2 py-0.5 rounded text-xs"
              style={{
                background: themeConfig.colors.bg,
                color: themeConfig.colors.textMuted
              }}
            >
              {feature}
            </span>
          ))}
          {module.features.length > 2 && (
            <span
              className="px-2 py-0.5 rounded text-xs"
              style={{
                background: themeConfig.colors.bg,
                color: themeConfig.colors.textMuted
              }}
            >
              +{module.features.length - 2}
            </span>
          )}
        </div>
      </div>

      {/* 底部渐变条 */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{
          background: `linear-gradient(90deg, ${module.color}, ${module.color}80)`
        }}
      />
    </motion.div>
  )
}

// 模块组组件
function ModuleGroup({ 
  group, 
  modules,
  startIndex 
}: { 
  group: typeof moduleGroups[0]
  modules: ModuleEntry[]
  startIndex: number
}) {
  const { themeConfig } = useTheme()
  const groupModules = modules.filter(m => group.modules.includes(m.id))

  return (
    <div className="mb-12">
      {/* 组标题 */}
      <AnimatedSection className="mb-6">
        <div className="flex items-center gap-3">
          <div
            className="w-1 h-6 rounded-full"
            style={{ background: themeConfig.colors.primary }}
          />
          <div>
            <h3
              className="text-xl font-semibold"
              style={{ color: themeConfig.colors.text }}
            >
              {group.title}
            </h3>
            <p
              className="text-sm"
              style={{ color: themeConfig.colors.textMuted }}
            >
              {group.description}
            </p>
          </div>
        </div>
      </AnimatedSection>

      {/* 模块网格 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {groupModules.map((module, index) => (
          <ModuleCard 
            key={module.id} 
            module={module} 
            index={startIndex + index}
          />
        ))}
      </div>
    </div>
  )
}

export function ModulesSection({ modules = defaultModules }: ModulesSectionProps) {
  const { themeConfig } = useTheme()

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8" style={{ background: themeConfig.colors.bgAlt }}>
      <div className="max-w-6xl mx-auto">
        {/* 标题 */}
        <AnimatedSection className="text-center mb-12">
          <h2
            className="text-3xl sm:text-4xl font-bold mb-4"
            style={{ color: themeConfig.colors.text }}
          >
            我的世界
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto"
            style={{ color: themeConfig.colors.textMuted }}
          >
            探索更多功能，管理你的学习、生活和娱乐
          </p>
        </AnimatedSection>

        {/* 模块组 */}
        {moduleGroups.map((group, groupIndex) => (
          <ModuleGroup
            key={group.id}
            group={group}
            modules={modules}
            startIndex={groupIndex * 4}
          />
        ))}
      </div>
    </section>
  )
}
