import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { ExternalLink, Github, Layers, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'
import type { PortfolioItem, PortfolioCategory } from '../../types/profile'
import { AnimatedSection } from './AnimatedSection'

interface PortfolioSectionProps {
  projects: PortfolioItem[]
}

const categoryLabels: Record<PortfolioCategory, string> = {
  web: 'Web 开发',
  mobile: '移动应用',
  design: '设计作品',
  article: '技术文章',
  video: '视频教程',
  ai: 'AI 项目',
  other: '其他'
}

const categoryColors: Record<PortfolioCategory, string> = {
  web: '#3B82F6',
  mobile: '#10B981',
  design: '#EC4899',
  article: '#F59E0B',
  video: '#8B5CF6',
  ai: '#06B6D4',
  other: '#6B7280'
}

// 项目卡片组件
function ProjectCard({ 
  project, 
  index,
  onClick 
}: { 
  project: PortfolioItem
  index: number
  onClick: () => void
}) {
  const { themeConfig } = useTheme()

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -8 }}
      onClick={onClick}
      className="group cursor-pointer"
    >
      <div
        className="rounded-2xl overflow-hidden transition-shadow duration-300"
        style={{
          background: themeConfig.colors.surface,
          border: `1px solid ${themeConfig.colors.border}`,
          boxShadow: themeConfig.shadows.card
        }}
      >
        {/* 缩略图 */}
        <div className="relative aspect-video overflow-hidden">
          <motion.img
            src={project.thumbnail}
            alt={project.title}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.4 }}
          />
          {/* 渐变遮罩 */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: `linear-gradient(to top, ${themeConfig.colors.bg}ee 0%, transparent 50%)`
            }}
          />
          {/* 分类标签 */}
          <div
            className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-medium"
            style={{
              background: `${categoryColors[project.category]}20`,
              color: categoryColors[project.category],
              border: `1px solid ${categoryColors[project.category]}40`
            }}
          >
            {categoryLabels[project.category]}
          </div>
          {/* 精选标记 */}
          {project.featured && (
            <div
              className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-medium"
              style={{
                background: `${themeConfig.colors.primary}20`,
                color: themeConfig.colors.primary,
                border: `1px solid ${themeConfig.colors.primary}40`
              }}
            >
              ⭐ 精选
            </div>
          )}
        </div>

        {/* 内容 */}
        <div className="p-5">
          <h3
            className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors"
            style={{ color: themeConfig.colors.text }}
          >
            {project.title}
          </h3>
          <p
            className="text-sm line-clamp-2 mb-4"
            style={{ color: themeConfig.colors.textMuted }}
          >
            {project.description}
          </p>

          {/* 标签 */}
          <div className="flex flex-wrap gap-1.5">
            {project.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded text-xs"
                style={{
                  background: themeConfig.colors.bg,
                  color: themeConfig.colors.textMuted
                }}
              >
                {tag}
              </span>
            ))}
            {project.tags.length > 3 && (
              <span
                className="px-2 py-0.5 rounded text-xs"
                style={{
                  background: themeConfig.colors.bg,
                  color: themeConfig.colors.textMuted
                }}
              >
                +{project.tags.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// 项目详情弹窗
function ProjectModal({ 
  project, 
  onClose,
  onPrev,
  onNext
}: { 
  project: PortfolioItem
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}) {
  const { themeConfig } = useTheme()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* 背景遮罩 */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* 弹窗内容 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl"
        style={{
          background: themeConfig.colors.surface,
          border: `1px solid ${themeConfig.colors.border}`
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full transition-colors"
          style={{
            background: themeConfig.colors.bg,
            color: themeConfig.colors.textMuted
          }}
        >
          <X size={20} />
        </button>

        {/* 导航按钮 */}
        <button
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full transition-colors"
          style={{
            background: themeConfig.colors.bg,
            color: themeConfig.colors.textMuted
          }}
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full transition-colors"
          style={{
            background: themeConfig.colors.bg,
            color: themeConfig.colors.textMuted
          }}
        >
          <ChevronRight size={24} />
        </button>

        {/* 图片 */}
        <div className="relative aspect-video">
          <img
            src={project.thumbnail}
            alt={project.title}
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to top, ${themeConfig.colors.surface} 0%, transparent 30%)`
            }}
          />
        </div>

        {/* 内容 */}
        <div className="p-6">
          {/* 标题和分类 */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="px-2.5 py-1 rounded-full text-xs font-medium"
                  style={{
                    background: `${categoryColors[project.category]}20`,
                    color: categoryColors[project.category]
                  }}
                >
                  {categoryLabels[project.category]}
                </span>
                {project.featured && (
                  <span
                    className="px-2.5 py-1 rounded-full text-xs font-medium"
                    style={{
                      background: `${themeConfig.colors.primary}20`,
                      color: themeConfig.colors.primary
                    }}
                  >
                    ⭐ 精选
                  </span>
                )}
              </div>
              <h2
                className="text-2xl font-bold"
                style={{ color: themeConfig.colors.text }}
              >
                {project.title}
              </h2>
            </div>
            <span
              className="text-sm"
              style={{ color: themeConfig.colors.textMuted }}
            >
              {project.date}
            </span>
          </div>

          {/* 描述 */}
          <p
            className="text-base leading-relaxed mb-6"
            style={{ color: themeConfig.colors.textSecondary }}
          >
            {project.description}
          </p>

          {/* 标签 */}
          <div className="flex flex-wrap gap-2 mb-6">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full text-sm"
                style={{
                  background: themeConfig.colors.bg,
                  color: themeConfig.colors.textMuted,
                  border: `1px solid ${themeConfig.colors.border}`
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* 操作按钮 */}
          <div className="flex gap-3">
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all"
                style={{
                  background: themeConfig.colors.primary,
                  color: '#fff'
                }}
              >
                <ExternalLink size={18} />
                访问项目
              </a>
            )}
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all"
                style={{
                  background: themeConfig.colors.bg,
                  color: themeConfig.colors.text,
                  border: `1px solid ${themeConfig.colors.border}`
                }}
              >
                <Github size={18} />
                查看源码
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export function PortfolioSection({ projects }: PortfolioSectionProps) {
  const { themeConfig } = useTheme()
  const [selectedCategory, setSelectedCategory] = useState<PortfolioCategory | 'all'>('all')
  const [selectedProject, setSelectedProject] = useState<PortfolioItem | null>(null)

  const categories: (PortfolioCategory | 'all')[] = ['all', ...Array.from(new Set(projects.map(p => p.category)))]

  const filteredProjects = selectedCategory === 'all'
    ? projects
    : projects.filter(p => p.category === selectedCategory)

  const handlePrev = () => {
    if (!selectedProject) return
    const currentIndex = filteredProjects.findIndex(p => p.id === selectedProject.id)
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : filteredProjects.length - 1
    setSelectedProject(filteredProjects[prevIndex])
  }

  const handleNext = () => {
    if (!selectedProject) return
    const currentIndex = filteredProjects.findIndex(p => p.id === selectedProject.id)
    const nextIndex = currentIndex < filteredProjects.length - 1 ? currentIndex + 1 : 0
    setSelectedProject(filteredProjects[nextIndex])
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8" style={{ background: themeConfig.colors.bgAlt }}>
      <div className="max-w-6xl mx-auto">
        {/* 标题 */}
        <AnimatedSection className="text-center mb-12">
          <h2
            className="text-3xl sm:text-4xl font-bold mb-4"
            style={{ color: themeConfig.colors.text }}
          >
            项目作品
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto"
            style={{ color: themeConfig.colors.textMuted }}
          >
            精选的项目作品，展示技术实力和创意能力
          </p>
        </AnimatedSection>

        {/* 分类筛选 */}
        <AnimatedSection delay={0.1} className="mb-8">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all"
                style={{
                  background: selectedCategory === category
                    ? themeConfig.colors.primary
                    : themeConfig.colors.surface,
                  color: selectedCategory === category
                    ? '#fff'
                    : themeConfig.colors.textMuted,
                  border: `1px solid ${selectedCategory === category ? themeConfig.colors.primary : themeConfig.colors.border}`
                }}
              >
                {category === 'all' ? (
                  <>
                    <Layers size={16} />
                    全部
                  </>
                ) : (
                  <>
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ background: categoryColors[category] }}
                    />
                    {categoryLabels[category]}
                  </>
                )}
              </button>
            ))}
          </div>
        </AnimatedSection>

        {/* 项目网格 */}
        <motion.div
          layout
          className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                onClick={() => setSelectedProject(project)}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* 空状态 */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-16">
            <Layers
              size={48}
              className="mx-auto mb-4"
              style={{ color: themeConfig.colors.textMuted }}
            />
            <p style={{ color: themeConfig.colors.textMuted }}>
              该分类下暂无项目
            </p>
          </div>
        )}
      </div>

      {/* 项目详情弹窗 */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
            onPrev={handlePrev}
            onNext={handleNext}
          />
        )}
      </AnimatePresence>
    </section>
  )
}
