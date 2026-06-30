import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Eye, Check, Sparkles, X, Home, FileText, Phone, Mail, Github, MapPin
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../hooks/useTheme'
import { useResume } from '../components/learning/resume/useResume'
import { ResumePreview } from '../components/learning/resume/ResumePreview'
import PageTransition from '../components/ui/PageTransition'

interface ResumeTemplate {
  id: string
  category: string
  categoryName: string
  name: string
  description: string
  tags: string[]
  gradient: string
  previewColor: string
}

const templates: ResumeTemplate[] = [
  {
    id: 'minimal',
    category: 'minimal',
    categoryName: '简约',
    name: '极简雅致模板',
    description: '干净利落的极简设计，突出核心信息，适合大多数行业',
    tags: ['通用', '清爽', '极简'],
    gradient: 'from-slate-650 to-slate-800',
    previewColor: '#ffffff'
  },
  {
    id: 'business',
    category: 'business',
    categoryName: '商务',
    name: '专业精英模板',
    description: '沉稳大气的商务风格，彰显专业气质，适合金融/法律/咨询/管理',
    tags: ['专业', '稳重', '双栏'],
    gradient: 'from-blue-700 to-blue-900',
    previewColor: '#ffffff'
  },
  {
    id: 'creative',
    category: 'creative',
    categoryName: '创意',
    name: '极客先锋模板',
    description: '个性鲜明的创意设计，展现独特魅力，适合设计/互联网/媒体/艺术',
    tags: ['个性', '艺术', '极客'],
    gradient: 'from-purple-600 to-pink-600',
    previewColor: '#090d16'
  },
  {
    id: 'campus',
    category: 'campus',
    categoryName: '校园',
    name: '青春逐梦模板',
    description: '青春活力的校园风格，突出学习经历与活动，适合应届毕业生',
    tags: ['应届', '活力', '高颜值'],
    gradient: 'from-emerald-500 to-teal-600',
    previewColor: '#f0fdf4'
  }
]

// ==================== Miniature Card Previews ====================
function MinimalCardPreview() {
  return (
    <div className="w-full h-full flex flex-col p-4 bg-white text-slate-800 font-serif select-none pointer-events-none">
      <div className="text-center border-b border-slate-200 pb-2 mb-3">
        <div className="h-4 w-20 bg-slate-905 mx-auto rounded-sm mb-1" />
        <div className="h-2 w-12 bg-slate-400 mx-auto rounded-sm mb-2" />
        <div className="flex justify-center gap-1.5">
          <div className="h-1.5 w-6 bg-slate-200 rounded-sm" />
          <div className="h-1.5 w-6 bg-slate-200 rounded-sm" />
          <div className="h-1.5 w-6 bg-slate-200 rounded-sm" />
        </div>
      </div>
      <div className="space-y-3 flex-1">
        <div>
          <div className="h-2.5 w-10 bg-slate-905 rounded-sm mb-1.5" />
          <div className="h-1.5 w-full bg-slate-100 rounded-sm mb-1" />
          <div className="h-1.5 w-5/6 bg-slate-100 rounded-sm" />
        </div>
        <div>
          <div className="h-2.5 w-10 bg-slate-905 rounded-sm mb-1.5" />
          <div className="h-1.5 w-full bg-slate-100 rounded-sm mb-1" />
          <div className="h-1.5 w-4/6 bg-slate-100 rounded-sm" />
        </div>
      </div>
    </div>
  )
}

function BusinessCardPreview() {
  return (
    <div className="w-full h-full flex bg-white text-slate-850 font-sans select-none pointer-events-none">
      {/* Sidebar */}
      <div className="w-1/3 bg-slate-50 border-r border-slate-205 p-3 flex flex-col items-center">
        <div className="w-10 h-10 rounded-full bg-slate-200 mb-2 border border-slate-300" />
        <div className="h-2.5 w-10 bg-slate-800 rounded-sm mb-1" />
        <div className="h-1 w-8 bg-slate-400 rounded-sm mb-4" />
        <div className="space-y-1.5 w-full">
          <div className="h-2 w-12 bg-slate-650 rounded-sm mb-1" />
          <div className="h-1.5 w-full bg-slate-200 rounded-sm" />
          <div className="h-1.5 w-5/6 bg-slate-200 rounded-sm" />
        </div>
      </div>
      {/* Body */}
      <div className="flex-1 p-3 space-y-3">
        <div>
          <div className="h-3 w-14 bg-blue-800 rounded-sm mb-2" />
          <div className="h-1.5 w-full bg-slate-100 rounded-sm mb-1" />
          <div className="h-1.5 w-4/6 bg-slate-100 rounded-sm" />
        </div>
        <div>
          <div className="h-3 w-14 bg-blue-800 rounded-sm mb-2" />
          <div className="h-1.5 w-full bg-slate-100 rounded-sm mb-1" />
          <div className="h-1.5 w-5/6 bg-slate-100 rounded-sm" />
        </div>
      </div>
    </div>
  )
}

function CreativeCardPreview() {
  return (
    <div className="w-full h-full flex flex-col p-4 bg-slate-950 text-slate-100 font-sans select-none pointer-events-none relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-purple-500/10 blur-xl" />
      <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-pink-500/10 blur-xl" />
      <div className="flex items-center gap-2.5 pb-2 mb-3 border-b border-slate-800/80">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500" />
        <div>
          <div className="h-3 w-12 bg-purple-300 rounded-sm mb-1" />
          <div className="h-2 w-8 bg-slate-500 rounded-sm" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 flex-1">
        <div className="col-span-1 space-y-2">
          <div className="h-2 w-10 bg-purple-400/30 rounded-sm" />
          <div className="flex flex-wrap gap-1">
            <div className="h-2.5 w-6 bg-purple-500/20 rounded-md" />
            <div className="h-2.5 w-8 bg-purple-500/20 rounded-md" />
          </div>
        </div>
        <div className="col-span-2 space-y-2">
          <div className="h-2 w-12 bg-pink-400/30 rounded-sm" />
          <div className="h-1.5 w-full bg-slate-800 rounded-sm" />
          <div className="h-1.5 w-5/6 bg-slate-800 rounded-sm" />
        </div>
      </div>
    </div>
  )
}

function CampusCardPreview() {
  return (
    <div className="w-full h-full flex flex-col p-3 bg-white text-slate-850 font-sans select-none pointer-events-none">
      <div className="bg-gradient-to-r from-teal-500 to-emerald-600 rounded-xl p-2.5 flex items-center gap-2.5 mb-3 text-white">
        <div className="w-8 h-8 rounded-full bg-white/20 border border-white/10" />
        <div>
          <div className="h-3 w-12 bg-white rounded-sm mb-1" />
          <div className="h-2 w-8 bg-teal-100 rounded-sm" />
        </div>
      </div>
      <div className="space-y-2 flex-1">
        <div className="p-1.5 bg-emerald-50/20 rounded-lg border border-slate-100">
          <div className="h-2 w-12 bg-emerald-800 rounded-sm mb-1" />
          <div className="h-1.5 w-full bg-slate-205 rounded-sm" />
        </div>
        <div className="p-1.5 rounded-lg border border-slate-100">
          <div className="h-2 w-12 bg-teal-800 rounded-sm mb-1" />
          <div className="h-1.5 w-full bg-slate-205 rounded-sm" />
        </div>
      </div>
    </div>
  )
}

export default function ResumeTemplates() {
  const { themeConfig } = useTheme()
  const { resumeData } = useResume()
  const navigate = useNavigate()
  const [filterCategory, setFilterCategory] = useState<'all' | 'minimal' | 'business' | 'creative' | 'campus'>('all')
  const [previewTemplate, setPreviewTemplate] = useState<ResumeTemplate | null>(null)

  const handleUseTemplate = (templateId: string) => {
    localStorage.setItem('opclaw-resume-template', templateId)
    navigate(`/resume-builder?template=${templateId}`)
  }

  const handlePreview = (template: ResumeTemplate) => {
    setPreviewTemplate(template)
  }

  const filteredTemplates = filterCategory === 'all' 
    ? templates 
    : templates.filter(t => t.category === filterCategory)

  const categories = [
    { id: 'all', name: '全部' },
    { id: 'minimal', name: '简约' },
    { id: 'business', name: '商务' },
    { id: 'creative', name: '创意' },
    { id: 'campus', name: '校园' }
  ]

  return (
    <PageTransition>
      <div className="min-h-screen pb-20" style={{ background: themeConfig.colors.bg }}>
        {/* Header with Navigation */}
        <div className="sticky top-0 z-40 px-4 sm:px-6 py-4 border-b" style={{ 
          borderColor: themeConfig.colors.border,
          background: themeConfig.colors.surface
        }}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2" style={{ color: themeConfig.colors.text }}>
                <Sparkles size={22} className="text-primary" />
                简历模板工坊
              </h1>
              <p className="text-xs sm:text-sm mt-1" style={{ color: themeConfig.colors.textMuted }}>
                选择心仪分类，一键套用专业设计，助力斩获名企Offer
              </p>
            </div>
            
            {/* Header Unified Navigation Bar */}
            <div className="flex items-center gap-4">
              <div 
                className="flex items-center rounded-lg p-1"
                style={{ background: themeConfig.colors.bg }}
              >
                <button
                  onClick={() => navigate('/')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all hover:opacity-85"
                  style={{ color: themeConfig.colors.textMuted }}
                >
                  <Home size={16} />
                  <span className="hidden sm:inline">主页</span>
                </button>
                <button
                  onClick={() => navigate('/?tab=resume')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all hover:opacity-85"
                  style={{ color: themeConfig.colors.textMuted }}
                >
                  <FileText size={16} />
                  <span className="hidden sm:inline">简历</span>
                </button>
                <button
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all text-white shadow-sm"
                  style={{ background: themeConfig.colors.primary }}
                >
                  <Sparkles size={16} />
                  <span className="hidden sm:inline">模版</span>
                </button>
              </div>

              <button
                onClick={() => navigate('/')}
                className="p-2 rounded-lg hover:bg-gray-150 transition-colors border"
                style={{ borderColor: themeConfig.colors.border, color: themeConfig.colors.textMuted }}
              >
                <X size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Category Switcher Tabs */}
        <div className="px-4 sm:px-6 py-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar mb-6">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilterCategory(cat.id as never)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all relative whitespace-nowrap`}
                style={{
                  background: filterCategory === cat.id ? themeConfig.colors.primaryMuted : themeConfig.colors.surface,
                  color: filterCategory === cat.id ? themeConfig.colors.primary : themeConfig.colors.textMuted,
                  border: `1px solid ${filterCategory === cat.id ? themeConfig.colors.primary : themeConfig.colors.border}`
                }}
              >
                {cat.name}
                {filterCategory === cat.id && (
                  <motion.div
                    layoutId="activeCategoryBorder"
                    className="absolute -bottom-1 left-2 right-2 h-0.5 rounded-full"
                    style={{ background: themeConfig.colors.primary }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredTemplates.map((template, index) => (
                <motion.div
                  key={template.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05, duration: 0.25 }}
                  className="group relative rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 border flex flex-col h-full bg-surface"
                  style={{ 
                    borderColor: themeConfig.colors.border,
                  }}
                >
                  {/* Miniature Card Preview Wrapper */}
                  <div className="aspect-[3/4] relative overflow-hidden bg-slate-50 border-b flex items-center justify-center p-3 sm:p-4" style={{ borderColor: themeConfig.colors.border }}>
                    <div className="w-full h-full rounded-xl overflow-hidden shadow-sm border border-slate-200 group-hover:scale-102 transition-transform duration-500">
                      {template.id === 'minimal' && <MinimalCardPreview />}
                      {template.id === 'business' && <BusinessCardPreview />}
                      {template.id === 'creative' && <CreativeCardPreview />}
                      {template.id === 'campus' && <CampusCardPreview />}
                    </div>

                    {/* Hover Actions Overlay */}
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-3">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation()
                          handlePreview(template)
                        }}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-gray-800 text-sm font-semibold shadow-lg hover:bg-slate-50 transition-colors"
                      >
                        <Eye size={16} />
                        预览
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleUseTemplate(template.id)
                        }}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-sm font-semibold shadow-lg"
                        style={{ background: `linear-gradient(135deg, ${template.gradient})` }}
                      >
                        <Check size={16} />
                        使用此模板
                      </motion.button>
                    </div>
                  </div>

                  {/* Template Info Panel */}
                  <div className="p-4 flex flex-col flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-base font-bold" style={{ color: themeConfig.colors.text }}>
                        {template.name}
                      </h3>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-slate-100" style={{ color: themeConfig.colors.textMuted }}>
                        {template.categoryName}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed mb-4 flex-1" style={{ color: themeConfig.colors.textMuted }}>
                      {template.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {template.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                          style={{ 
                            background: themeConfig.colors.primaryMuted,
                            color: themeConfig.colors.primary
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Fullscreen Template Preview Modal */}
        <AnimatePresence>
          {previewTemplate && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
              onClick={() => setPreviewTemplate(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative w-full max-w-4xl max-h-[90vh] overflow-auto rounded-2xl shadow-2xl flex flex-col"
                style={{ 
                  background: previewTemplate.id === 'creative' ? '#090d16' : '#ffffff' 
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  onClick={() => setPreviewTemplate(null)}
                  className={`absolute top-4 right-4 z-10 p-2 rounded-full transition-colors ${
                    previewTemplate.id === 'creative' 
                      ? 'bg-white/10 hover:bg-white/20 text-white' 
                      : 'bg-black/5 hover:bg-black/10 text-slate-800'
                  }`}
                >
                  <X size={20} />
                </button>

                {/* Live Resume Preview styled inside Template Wrapper */}
                <div className="p-4 sm:p-8 overflow-y-auto flex-1">
                  <ResumePreview 
                    data={resumeData} 
                    themeConfig={themeConfig} 
                    templateId={previewTemplate.id} 
                  />
                </div>

                {/* Bottom Action Footer */}
                <div className="p-4 border-t flex items-center justify-center bg-slate-50/50 backdrop-blur-xs rounded-b-2xl" style={{ borderColor: themeConfig.colors.border }}>
                  <button
                    onClick={() => {
                      setPreviewTemplate(null)
                      handleUseTemplate(previewTemplate.id)
                    }}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold shadow-lg transition-all hover:scale-102 active:scale-98"
                    style={{ background: `linear-gradient(135deg, ${previewTemplate.gradient})` }}
                  >
                    <Check size={18} />
                    套用此模板并编辑
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  )
}
