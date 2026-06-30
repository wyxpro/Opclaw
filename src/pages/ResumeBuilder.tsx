import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, Eye, Download, Save, ChevronLeft, ChevronRight,
  User, GraduationCap, Briefcase, Code2, FolderGit2,
  Plus, Trash2, GripVertical, Upload, Share2,
  FileText, Palette
} from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useTheme } from '../hooks/useTheme'
import { useResume } from '../components/learning/resume/useResume'
import { ResumePreview } from '../components/learning/resume/ResumePreview'
import type { ResumeData, PersonalInfo, WorkExperience, Project, Education, Skill } from '../components/learning/resume/types'
import PageTransition from '../components/ui/PageTransition'
import html2canvas from 'html2canvas'

type EditorTab = 'personal' | 'education' | 'work' | 'skills' | 'projects'
type MobileView = 'templates' | 'preview' | 'edit'

const templates = [
  { id: 'minimal', name: '简约', gradient: 'from-slate-600 to-slate-800', color: '#64748b' },
  { id: 'business', name: '商务', gradient: 'from-blue-700 to-blue-900', color: '#2563eb' },
  { id: 'creative', name: '创意', gradient: 'from-purple-600 to-pink-600', color: '#a855f7' },
  { id: 'campus', name: '校园', gradient: 'from-emerald-500 to-teal-600', color: '#10b981' },
]

export default function ResumeBuilder() {
  const { themeConfig } = useTheme()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const templateId = searchParams.get('template') || 'minimal'

  const { 
    resumeData, 
    updateResumeData, 
    exportData, 
    resetToDefault 
  } = useResume()

  const [activeTab, setActiveTab] = useState<EditorTab>('personal')
  const [selectedTemplate, setSelectedTemplate] = useState(templateId)
  const [isFullscreenPreview, setIsFullscreenPreview] = useState(false)
  const [showExportMenu, setShowExportMenu] = useState(false)
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' ? window.innerWidth < 1024 : false)
  const [mobileView, setMobileView] = useState<MobileView>('edit')

  const previewRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Update template when URL changes
  useEffect(() => {
    setSelectedTemplate(templateId)
    localStorage.setItem('opclaw-resume-template', templateId)
  }, [templateId])

  const tabs = [
    { id: 'personal' as EditorTab, label: '基本信息', icon: User },
    { id: 'education' as EditorTab, label: '教育经历', icon: GraduationCap },
    { id: 'work' as EditorTab, label: '工作经历', icon: Briefcase },
    { id: 'skills' as EditorTab, label: '技能证书', icon: Code2 },
    { id: 'projects' as EditorTab, label: '项目经历', icon: FolderGit2 },
  ]

  const getTemplateColor = () => {
    const template = templates.find(t => t.id === selectedTemplate)
    return template?.color || themeConfig.colors.primary
  }

  // Personal Info
  const updatePersonalInfo = (field: keyof PersonalInfo, value: string | number) => {
    updateResumeData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value }
    }))
  }

  // Education
  const addEducation = () => {
    updateResumeData(prev => ({
      ...prev,
      education: [...prev.education, {
        id: Date.now().toString(),
        school: '',
        major: '',
        degree: '',
        achievements: ['']
      }]
    }))
  }

  const updateEducation = (id: string, field: keyof Education, value: unknown) => {
    updateResumeData(prev => ({
      ...prev,
      education: prev.education.map(e => e.id === id ? { ...e, [field]: value } : e)
    }))
  }

  const removeEducation = (id: string) => {
    updateResumeData(prev => ({
      ...prev,
      education: prev.education.filter(e => e.id !== id)
    }))
  }

  // Work Experience
  const addWork = () => {
    updateResumeData(prev => ({
      ...prev,
      workExperiences: [...prev.workExperiences, {
        id: Date.now().toString(),
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        isCurrent: false,
        responsibilities: ['']
      }]
    }))
  }

  const updateWork = (id: string, field: keyof WorkExperience, value: unknown) => {
    updateResumeData(prev => ({
      ...prev,
      workExperiences: prev.workExperiences.map(w => w.id === id ? { ...w, [field]: value } : w)
    }))
  }

  const removeWork = (id: string) => {
    updateResumeData(prev => ({
      ...prev,
      workExperiences: prev.workExperiences.filter(w => w.id !== id)
    }))
  }

  // Skills
  const addSkill = () => {
    updateResumeData(prev => ({
      ...prev,
      skills: [...prev.skills, { id: Date.now().toString(), category: '', items: [] }]
    }))
  }

  const updateSkill = (id: string, field: keyof Skill, value: unknown) => {
    updateResumeData(prev => ({
      ...prev,
      skills: prev.skills.map(s => s.id === id ? { ...s, [field]: value } : s)
    }))
  }

  const removeSkill = (id: string) => {
    updateResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s.id !== id)
    }))
  }

  // Projects
  const addProject = () => {
    updateResumeData(prev => ({
      ...prev,
      projects: [...prev.projects, {
        id: Date.now().toString(),
        name: '',
        role: '',
        startDate: '',
        endDate: '',
        isCurrent: false,
        description: '',
        techStack: '',
        highlights: [''],
        link: ''
      }]
    }))
  }

  const updateProject = (id: string, field: keyof Project, value: unknown) => {
    updateResumeData(prev => ({
      ...prev,
      projects: prev.projects.map(p => p.id === id ? { ...p, [field]: value } : p)
    }))
  }

  const removeProject = (id: string) => {
    updateResumeData(prev => ({
      ...prev,
      projects: prev.projects.filter(p => p.id !== id)
    }))
  }

  const handleExportPDF = async () => {
    if (!previewRef.current) return
    try {
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      })
      const link = document.createElement('a')
      link.download = `简历-${resumeData.personalInfo.name || '导出'}.png`
      link.href = canvas.toDataURL()
      link.click()
    } catch (error) {
      console.error('导出失败:', error)
      alert('导出失败，请重试')
    }
  }

  const handleExportJSON = () => {
    exportData()
    setShowExportMenu(false)
  }

  // Desktop Three Column Layout
  if (!isMobile) {
    return (
      <div className="h-screen flex flex-col" style={{ background: themeConfig.colors.bg }}>
        {/* Top Toolbar */}
        <div 
          className="flex items-center justify-between px-4 sm:px-6 py-3 border-b flex-shrink-0"
          style={{ 
            borderColor: themeConfig.colors.border,
            background: themeConfig.colors.surface
          }}
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-70"
              style={{ color: themeConfig.colors.textMuted }}
            >
              <ChevronLeft size={18} />
              返回
            </button>
            <div className="h-6 w-px" style={{ background: themeConfig.colors.border }} />
            <h1 className="text-base font-bold" style={{ color: themeConfig.colors.text }}>
              A4 预览 · {templates.find(t => t.id === selectedTemplate)?.name}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFullscreenPreview(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{ 
                background: themeConfig.colors.bg,
                color: themeConfig.colors.textSecondary
              }}
            >
              <Eye size={16} />
              <span className="hidden sm:inline">全屏预览</span>
            </button>
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-white text-sm font-medium shadow-lg transition-all"
                style={{ background: `linear-gradient(135deg, ${getTemplateColor()}, ${getTemplateColor()}dd)` }}
              >
                <Download size={16} />
                导出
              </button>
              {showExportMenu && (
                <div 
                  className="absolute right-0 mt-2 w-48 rounded-xl shadow-xl overflow-hidden z-50"
                  style={{ 
                    background: themeConfig.colors.surface,
                    border: `1px solid ${themeConfig.colors.border}`
                  }}
                >
                  <button
                    onClick={handleExportPDF}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm text-left hover:bg-primary/10 transition-colors"
                    style={{ color: themeConfig.colors.text }}
                  >
                    <FileText size={16} />
                    导出为图片
                  </button>
                  <button
                    onClick={handleExportJSON}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm text-left hover:bg-primary/10 transition-colors"
                    style={{ color: themeConfig.colors.text }}
                  >
                    <Save size={16} />
                    导出为JSON
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Three Column Layout */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar - Template Selection */}
          <div 
            className="w-48 flex-shrink-0 border-r overflow-y-auto"
            style={{ 
              borderColor: themeConfig.colors.border,
              background: themeConfig.colors.surface
            }}
          >
            <div className="p-3">
              <h3 className="text-xs font-bold uppercase tracking-wider mb-3 px-1" style={{ color: themeConfig.colors.textMuted }}>
                选择模板
              </h3>
              <div className="space-y-2">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => {
                      setSelectedTemplate(template.id)
                      localStorage.setItem('opclaw-resume-template', template.id)
                    }}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${
                      selectedTemplate === template.id ? 'shadow-md' : 'hover:bg-black/5'
                    }`}
                    style={{ 
                      background: selectedTemplate === template.id ? themeConfig.colors.primaryMuted : 'transparent',
                      border: `1px solid ${selectedTemplate === template.id ? themeConfig.colors.primary : themeConfig.colors.border}`
                    }}
                  >
                    <div 
                      className="w-10 h-12 rounded-lg flex-shrink-0"
                      style={{ background: `linear-gradient(135deg, ${template.gradient})` }}
                    />
                    <div>
                      <div className="text-sm font-bold" style={{ color: themeConfig.colors.text }}>
                        {template.name}
                      </div>
                      {selectedTemplate === template.id && (
                        <div className="text-[10px] mt-0.5" style={{ color: themeConfig.colors.primary }}>
                          已选择
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Middle - Preview Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-8" style={{ background: themeConfig.colors.bg }}>
            <div className="max-w-2xl mx-auto">
              <div 
                ref={previewRef}
                className="bg-white rounded-lg shadow-2xl overflow-hidden"
                style={{ aspectRatio: '210/297' }}
              >
                <ResumePreview data={resumeData} themeConfig={themeConfig} templateId={selectedTemplate} />
              </div>
            </div>
          </div>

          {/* Right Sidebar - Editor */}
          <div 
            className="w-80 flex-shrink-0 border-l overflow-y-auto"
            style={{ 
              borderColor: themeConfig.colors.border,
              background: themeConfig.colors.surface
            }}
          >
            {/* Editor Tabs */}
            <div className="sticky top-0 z-10 border-b" style={{ borderColor: themeConfig.colors.border, background: themeConfig.colors.surface }}>
              <div className="flex overflow-x-auto scrollbar-thin">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 px-3 py-3 text-xs font-medium whitespace-nowrap transition-colors border-b-2 flex-shrink-0 ${
                      activeTab === tab.id ? 'border-current' : 'border-transparent'
                    }`}
                    style={{ 
                      color: activeTab === tab.id ? themeConfig.colors.primary : themeConfig.colors.textMuted,
                      borderColor: activeTab === tab.id ? themeConfig.colors.primary : 'transparent'
                    }}
                  >
                    <tab.icon size={14} />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Editor Content */}
            <div className="p-4 space-y-4">
              {/* Personal Info */}
              {activeTab === 'personal' && (
                <div className="space-y-3">
                  <h3 className="text-sm font-bold mb-3" style={{ color: themeConfig.colors.text }}>基本信息</h3>
                  <InputField themeConfig={themeConfig} label="姓名" value={resumeData.personalInfo.name} onChange={(v) => updatePersonalInfo('name', v)} />
                  <InputField themeConfig={themeConfig} label="职位" value={resumeData.personalInfo.title} onChange={(v) => updatePersonalInfo('title', v)} />
                  <InputField themeConfig={themeConfig} label="年龄" type="number" value={resumeData.personalInfo.age} onChange={(v) => updatePersonalInfo('age', parseInt(v) || 0)} />
                  <InputField themeConfig={themeConfig} label="地点" value={resumeData.personalInfo.location} onChange={(v) => updatePersonalInfo('location', v)} />
                  <InputField themeConfig={themeConfig} label="电话" value={resumeData.personalInfo.phone} onChange={(v) => updatePersonalInfo('phone', v)} />
                  <InputField themeConfig={themeConfig} label="邮箱" value={resumeData.personalInfo.email} onChange={(v) => updatePersonalInfo('email', v)} />
                  <InputField themeConfig={themeConfig} label="GitHub" value={resumeData.personalInfo.github} onChange={(v) => updatePersonalInfo('github', v)} />
                </div>
              )}

              {/* Education */}
              {activeTab === 'education' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold" style={{ color: themeConfig.colors.text }}>教育经历</h3>
                    <button onClick={addEducation} className="p-1.5 rounded-lg hover:bg-primary/10 transition-colors" style={{ color: themeConfig.colors.primary }}>
                      <Plus size={16} />
                    </button>
                  </div>
                  {resumeData.education.map((edu) => (
                    <div key={edu.id} className="p-3 rounded-xl space-y-2" style={{ background: themeConfig.colors.bg, border: `1px solid ${themeConfig.colors.border}` }}>
                      <InputField themeConfig={themeConfig} label="学校" value={edu.school} onChange={(v) => updateEducation(edu.id, 'school', v)} />
                      <InputField themeConfig={themeConfig} label="专业" value={edu.major} onChange={(v) => updateEducation(edu.id, 'major', v)} />
                      <InputField themeConfig={themeConfig} label="学历" value={edu.degree} onChange={(v) => updateEducation(edu.id, 'degree', v)} />
                      <textarea
                        value={edu.achievements.join('\n')}
                        onChange={(e) => updateEducation(edu.id, 'achievements', e.target.value.split('\n'))}
                        placeholder="成就/奖项，每行一项"
                        rows={3}
                        className="w-full px-3 py-2 text-xs rounded-lg border outline-none resize-none"
                        style={{ borderColor: themeConfig.colors.border, color: themeConfig.colors.text }}
                      />
                      <button onClick={() => removeEducation(edu.id)} className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1">
                        <Trash2 size={12} /> 删除
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Work Experience */}
              {activeTab === 'work' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold" style={{ color: themeConfig.colors.text }}>工作经历</h3>
                    <button onClick={addWork} className="p-1.5 rounded-lg hover:bg-primary/10 transition-colors" style={{ color: themeConfig.colors.primary }}>
                      <Plus size={16} />
                    </button>
                  </div>
                  {resumeData.workExperiences.map((work) => (
                    <div key={work.id} className="p-3 rounded-xl space-y-2" style={{ background: themeConfig.colors.bg, border: `1px solid ${themeConfig.colors.border}` }}>
                      <InputField themeConfig={themeConfig} label="公司" value={work.company} onChange={(v) => updateWork(work.id, 'company', v)} />
                      <InputField themeConfig={themeConfig} label="职位" value={work.position} onChange={(v) => updateWork(work.id, 'position', v)} />
                      <InputField themeConfig={themeConfig} label="开始时间" value={work.startDate} onChange={(v) => updateWork(work.id, 'startDate', v)} />
                      <InputField themeConfig={themeConfig} label="结束时间" value={work.endDate} onChange={(v) => updateWork(work.id, 'endDate', v)} disabled={work.isCurrent} />
                      <label className="flex items-center gap-2 text-xs cursor-pointer" style={{ color: themeConfig.colors.textSecondary }}>
                        <input
                          type="checkbox"
                          checked={work.isCurrent}
                          onChange={(e) => updateWork(work.id, 'isCurrent', e.target.checked)}
                          className="rounded"
                        />
                        至今
                      </label>
                      <textarea
                        value={work.responsibilities.join('\n')}
                        onChange={(e) => updateWork(work.id, 'responsibilities', e.target.value.split('\n'))}
                        placeholder="工作职责，每行一项"
                        rows={3}
                        className="w-full px-3 py-2 text-xs rounded-lg border outline-none resize-none"
                        style={{ borderColor: themeConfig.colors.border, color: themeConfig.colors.text }}
                      />
                      <button onClick={() => removeWork(work.id)} className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1">
                        <Trash2 size={12} /> 删除
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Skills */}
              {activeTab === 'skills' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold" style={{ color: themeConfig.colors.text }}>技能证书</h3>
                    <button onClick={addSkill} className="p-1.5 rounded-lg hover:bg-primary/10 transition-colors" style={{ color: themeConfig.colors.primary }}>
                      <Plus size={16} />
                    </button>
                  </div>
                  {resumeData.skills.map((skill) => (
                    <div key={skill.id} className="p-3 rounded-xl space-y-2" style={{ background: themeConfig.colors.bg, border: `1px solid ${themeConfig.colors.border}` }}>
                      <InputField themeConfig={themeConfig} label="类别" value={skill.category} onChange={(v) => updateSkill(skill.id, 'category', v)} />
                      <textarea
                        value={skill.items.join(', ')}
                        onChange={(e) => updateSkill(skill.id, 'items', e.target.value.split(',').map(s => s.trim()))}
                        placeholder="技能项，用逗号分隔"
                        rows={2}
                        className="w-full px-3 py-2 text-xs rounded-lg border outline-none resize-none"
                        style={{ borderColor: themeConfig.colors.border, color: themeConfig.colors.text }}
                      />
                      <button onClick={() => removeSkill(skill.id)} className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1">
                        <Trash2 size={12} /> 删除
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Projects */}
              {activeTab === 'projects' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold" style={{ color: themeConfig.colors.text }}>项目经历</h3>
                    <button onClick={addProject} className="p-1.5 rounded-lg hover:bg-primary/10 transition-colors" style={{ color: themeConfig.colors.primary }}>
                      <Plus size={16} />
                    </button>
                  </div>
                  {resumeData.projects.map((project) => (
                    <div key={project.id} className="p-3 rounded-xl space-y-2" style={{ background: themeConfig.colors.bg, border: `1px solid ${themeConfig.colors.border}` }}>
                      <InputField themeConfig={themeConfig} label="项目名称" value={project.name} onChange={(v) => updateProject(project.id, 'name', v)} />
                      <InputField themeConfig={themeConfig} label="角色" value={project.role} onChange={(v) => updateProject(project.id, 'role', v)} />
                      <InputField themeConfig={themeConfig} label="开始时间" value={project.startDate} onChange={(v) => updateProject(project.id, 'startDate', v)} />
                      <InputField themeConfig={themeConfig} label="结束时间" value={project.endDate} onChange={(v) => updateProject(project.id, 'endDate', v)} disabled={project.isCurrent} />
                      <label className="flex items-center gap-2 text-xs cursor-pointer" style={{ color: themeConfig.colors.textSecondary }}>
                        <input
                          type="checkbox"
                          checked={project.isCurrent}
                          onChange={(e) => updateProject(project.id, 'isCurrent', e.target.checked)}
                          className="rounded"
                        />
                        至今
                      </label>
                      <textarea
                        value={project.description}
                        onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                        placeholder="项目介绍"
                        rows={2}
                        className="w-full px-3 py-2 text-xs rounded-lg border outline-none resize-none"
                        style={{ borderColor: themeConfig.colors.border, color: themeConfig.colors.text }}
                      />
                      <textarea
                        value={project.techStack}
                        onChange={(e) => updateProject(project.id, 'techStack', e.target.value)}
                        placeholder="技术栈"
                        rows={2}
                        className="w-full px-3 py-2 text-xs rounded-lg border outline-none resize-none"
                        style={{ borderColor: themeConfig.colors.border, color: themeConfig.colors.text }}
                      />
                      <textarea
                        value={project.highlights.join('\n')}
                        onChange={(e) => updateProject(project.id, 'highlights', e.target.value.split('\n'))}
                        placeholder="项目亮点，每行一项"
                        rows={3}
                        className="w-full px-3 py-2 text-xs rounded-lg border outline-none resize-none"
                        style={{ borderColor: themeConfig.colors.border, color: themeConfig.colors.text }}
                      />
                      <button onClick={() => removeProject(project.id)} className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1">
                        <Trash2 size={12} /> 删除
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Fullscreen Preview Modal */}
        <AnimatePresence>
          {isFullscreenPreview && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() => setIsFullscreenPreview(false)}
            >
              <div className="relative max-w-4xl max-h-[95vh] overflow-auto">
                <button
                  onClick={() => setIsFullscreenPreview(false)}
                  className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <X size={24} className="text-white" />
                </button>
                <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
                  <ResumePreview data={resumeData} themeConfig={themeConfig} templateId={selectedTemplate} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  // Mobile Layout
  return (
    <PageTransition>
      <div className="h-screen flex flex-col" style={{ background: themeConfig.colors.bg }}>
        {/* Mobile Header */}
        <div 
          className="flex items-center justify-between px-4 py-3 border-b flex-shrink-0"
          style={{ 
            borderColor: themeConfig.colors.border,
            background: themeConfig.colors.surface
          }}
        >
          <button
            onClick={() => navigate('/resume-templates')}
            className="flex items-center gap-1 text-sm font-medium"
            style={{ color: themeConfig.colors.textSecondary }}
          >
            <ChevronLeft size={18} />
            模板
          </button>
          <h1 className="text-sm font-bold" style={{ color: themeConfig.colors.text }}>
            {mobileView === 'templates' ? '选择模板' : mobileView === 'preview' ? '预览' : '编辑简历'}
          </h1>
          <div className="w-12" />
        </div>

        {/* Mobile Content */}
        <div className="flex-1 overflow-hidden">
          {mobileView === 'templates' && (
            <div className="h-full overflow-y-auto p-4">
              <div className="grid grid-cols-2 gap-3">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => {
                      setSelectedTemplate(template.id)
                      localStorage.setItem('opclaw-resume-template', template.id)
                      setMobileView('edit')
                    }}
                    className="p-4 rounded-2xl text-left transition-all"
                    style={{ 
                      background: themeConfig.colors.surface,
                      border: `1px solid ${selectedTemplate === template.id ? themeConfig.colors.primary : themeConfig.colors.border}`
                    }}
                  >
                    <div 
                      className="w-full aspect-[3/4] rounded-xl mb-3"
                      style={{ background: `linear-gradient(135deg, ${template.gradient})` }}
                    />
                    <div className="text-sm font-bold" style={{ color: themeConfig.colors.text }}>
                      {template.name}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {mobileView === 'preview' && (
            <div className="h-full overflow-y-auto p-4">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <ResumePreview data={resumeData} themeConfig={themeConfig} templateId={selectedTemplate} />
              </div>
            </div>
          )}

          {mobileView === 'edit' && (
            <div className="h-full flex flex-col">
              {/* Mobile Template Selector */}
              <div className="px-4 py-3 border-b flex-shrink-0" style={{ borderColor: themeConfig.colors.border }}>
                <div className="flex gap-2 overflow-x-auto no-scrollbar">
                  {templates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => {
                        setSelectedTemplate(template.id)
                        localStorage.setItem('opclaw-resume-template', template.id)
                      }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap flex-shrink-0 ${
                        selectedTemplate === template.id ? 'text-white' : ''
                      }`}
                      style={{ 
                        background: selectedTemplate === template.id ? `linear-gradient(135deg, ${template.gradient})` : themeConfig.colors.bg,
                        color: selectedTemplate === template.id ? 'white' : themeConfig.colors.textSecondary,
                        border: `1px solid ${selectedTemplate === template.id ? 'transparent' : themeConfig.colors.border}`
                      }}
                    >
                      <Palette size={12} />
                      {template.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Editor Tabs */}
              <div className="flex overflow-x-auto border-b scrollbar-thin flex-shrink-0" style={{ borderColor: themeConfig.colors.border }}>
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium whitespace-nowrap transition-colors border-b-2 flex-shrink-0 ${
                      activeTab === tab.id ? 'border-current' : 'border-transparent'
                    }`}
                    style={{ 
                      color: activeTab === tab.id ? themeConfig.colors.primary : themeConfig.colors.textMuted,
                      borderColor: activeTab === tab.id ? themeConfig.colors.primary : 'transparent'
                    }}
                  >
                    <tab.icon size={14} />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Mobile Editor Content */}
              <div className="flex-1 overflow-y-auto p-4">
                {/* Same editor content as desktop */}
                {activeTab === 'personal' && (
                  <div className="space-y-3">
                    <InputField themeConfig={themeConfig} label="姓名" value={resumeData.personalInfo.name} onChange={(v) => updatePersonalInfo('name', v)} />
                  <InputField themeConfig={themeConfig} label="职位" value={resumeData.personalInfo.title} onChange={(v) => updatePersonalInfo('title', v)} />
                  <InputField themeConfig={themeConfig} label="年龄" type="number" value={resumeData.personalInfo.age} onChange={(v) => updatePersonalInfo('age', parseInt(v) || 0)} />
                  <InputField themeConfig={themeConfig} label="地点" value={resumeData.personalInfo.location} onChange={(v) => updatePersonalInfo('location', v)} />
                  <InputField themeConfig={themeConfig} label="电话" value={resumeData.personalInfo.phone} onChange={(v) => updatePersonalInfo('phone', v)} />
                  <InputField themeConfig={themeConfig} label="邮箱" value={resumeData.personalInfo.email} onChange={(v) => updatePersonalInfo('email', v)} />
                  <InputField themeConfig={themeConfig} label="GitHub" value={resumeData.personalInfo.github} onChange={(v) => updatePersonalInfo('github', v)} />
                  </div>
                )}

                {activeTab === 'education' && (
                  <div className="space-y-3">
                    <button onClick={addEducation} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium" style={{ background: themeConfig.colors.primaryMuted, color: themeConfig.colors.primary }}>
                      <Plus size={16} /> 添加教育经历
                    </button>
                    {resumeData.education.map((edu) => (
                      <div key={edu.id} className="p-3 rounded-xl space-y-2" style={{ background: themeConfig.colors.bg, border: `1px solid ${themeConfig.colors.border}` }}>
                        <InputField themeConfig={themeConfig} label="学校" value={edu.school} onChange={(v) => updateEducation(edu.id, 'school', v)} />
                        <InputField themeConfig={themeConfig} label="专业" value={edu.major} onChange={(v) => updateEducation(edu.id, 'major', v)} />
                        <InputField themeConfig={themeConfig} label="学历" value={edu.degree} onChange={(v) => updateEducation(edu.id, 'degree', v)} />
                        <textarea
                          value={edu.achievements.join('\n')}
                          onChange={(e) => updateEducation(edu.id, 'achievements', e.target.value.split('\n'))}
                          placeholder="成就/奖项，每行一项"
                          rows={3}
                          className="w-full px-3 py-2 text-xs rounded-lg border outline-none resize-none"
                          style={{ borderColor: themeConfig.colors.border, color: themeConfig.colors.text }}
                        />
                        <button onClick={() => removeEducation(edu.id)} className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1">
                          <Trash2 size={12} /> 删除
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'work' && (
                  <div className="space-y-3">
                    <button onClick={addWork} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium" style={{ background: themeConfig.colors.primaryMuted, color: themeConfig.colors.primary }}>
                      <Plus size={16} /> 添加工作经历
                    </button>
                    {resumeData.workExperiences.map((work) => (
                      <div key={work.id} className="p-3 rounded-xl space-y-2" style={{ background: themeConfig.colors.bg, border: `1px solid ${themeConfig.colors.border}` }}>
                        <InputField themeConfig={themeConfig} label="公司" value={work.company} onChange={(v) => updateWork(work.id, 'company', v)} />
                        <InputField themeConfig={themeConfig} label="职位" value={work.position} onChange={(v) => updateWork(work.id, 'position', v)} />
                        <InputField themeConfig={themeConfig} label="开始时间" value={work.startDate} onChange={(v) => updateWork(work.id, 'startDate', v)} />
                        <InputField themeConfig={themeConfig} label="结束时间" value={work.endDate} onChange={(v) => updateWork(work.id, 'endDate', v)} disabled={work.isCurrent} />
                        <label className="flex items-center gap-2 text-xs cursor-pointer" style={{ color: themeConfig.colors.textSecondary }}>
                          <input type="checkbox" checked={work.isCurrent} onChange={(e) => updateWork(work.id, 'isCurrent', e.target.checked)} className="rounded" />
                          至今
                        </label>
                        <textarea
                          value={work.responsibilities.join('\n')}
                          onChange={(e) => updateWork(work.id, 'responsibilities', e.target.value.split('\n'))}
                          placeholder="工作职责，每行一项"
                          rows={3}
                          className="w-full px-3 py-2 text-xs rounded-lg border outline-none resize-none"
                          style={{ borderColor: themeConfig.colors.border, color: themeConfig.colors.text }}
                        />
                        <button onClick={() => removeWork(work.id)} className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1">
                          <Trash2 size={12} /> 删除
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'skills' && (
                  <div className="space-y-3">
                    <button onClick={addSkill} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium" style={{ background: themeConfig.colors.primaryMuted, color: themeConfig.colors.primary }}>
                      <Plus size={16} /> 添加技能
                    </button>
                    {resumeData.skills.map((skill) => (
                      <div key={skill.id} className="p-3 rounded-xl space-y-2" style={{ background: themeConfig.colors.bg, border: `1px solid ${themeConfig.colors.border}` }}>
                        <InputField themeConfig={themeConfig} label="类别" value={skill.category} onChange={(v) => updateSkill(skill.id, 'category', v)} />
                        <textarea
                          value={skill.items.join(', ')}
                          onChange={(e) => updateSkill(skill.id, 'items', e.target.value.split(',').map(s => s.trim()))}
                          placeholder="技能项，用逗号分隔"
                          rows={2}
                          className="w-full px-3 py-2 text-xs rounded-lg border outline-none resize-none"
                          style={{ borderColor: themeConfig.colors.border, color: themeConfig.colors.text }}
                        />
                        <button onClick={() => removeSkill(skill.id)} className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1">
                          <Trash2 size={12} /> 删除
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'projects' && (
                  <div className="space-y-3">
                    <button onClick={addProject} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium" style={{ background: themeConfig.colors.primaryMuted, color: themeConfig.colors.primary }}>
                      <Plus size={16} /> 添加项目
                    </button>
                    {resumeData.projects.map((project) => (
                      <div key={project.id} className="p-3 rounded-xl space-y-2" style={{ background: themeConfig.colors.bg, border: `1px solid ${themeConfig.colors.border}` }}>
                        <InputField themeConfig={themeConfig} label="项目名称" value={project.name} onChange={(v) => updateProject(project.id, 'name', v)} />
                        <InputField themeConfig={themeConfig} label="角色" value={project.role} onChange={(v) => updateProject(project.id, 'role', v)} />
                        <InputField themeConfig={themeConfig} label="开始时间" value={project.startDate} onChange={(v) => updateProject(project.id, 'startDate', v)} />
                        <InputField themeConfig={themeConfig} label="结束时间" value={project.endDate} onChange={(v) => updateProject(project.id, 'endDate', v)} disabled={project.isCurrent} />
                        <label className="flex items-center gap-2 text-xs cursor-pointer" style={{ color: themeConfig.colors.textSecondary }}>
                          <input type="checkbox" checked={project.isCurrent} onChange={(e) => updateProject(project.id, 'isCurrent', e.target.checked)} className="rounded" />
                          至今
                        </label>
                        <textarea
                          value={project.description}
                          onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                          placeholder="项目介绍"
                          rows={2}
                          className="w-full px-3 py-2 text-xs rounded-lg border outline-none resize-none"
                          style={{ borderColor: themeConfig.colors.border, color: themeConfig.colors.text }}
                        />
                        <textarea
                          value={project.techStack}
                          onChange={(e) => updateProject(project.id, 'techStack', e.target.value)}
                          placeholder="技术栈"
                          rows={2}
                          className="w-full px-3 py-2 text-xs rounded-lg border outline-none resize-none"
                          style={{ borderColor: themeConfig.colors.border, color: themeConfig.colors.text }}
                        />
                        <textarea
                          value={project.highlights.join('\n')}
                          onChange={(e) => updateProject(project.id, 'highlights', e.target.value.split('\n'))}
                          placeholder="项目亮点，每行一项"
                          rows={3}
                          className="w-full px-3 py-2 text-xs rounded-lg border outline-none resize-none"
                          style={{ borderColor: themeConfig.colors.border, color: themeConfig.colors.text }}
                        />
                        <button onClick={() => removeProject(project.id)} className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1">
                          <Trash2 size={12} /> 删除
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Mobile Bottom Actions */}
        <div 
          className="flex items-center justify-around px-4 py-2 border-t flex-shrink-0"
          style={{ 
            borderColor: themeConfig.colors.border,
            background: themeConfig.colors.surface
          }}
        >
          <button
            onClick={() => setMobileView('templates')}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${mobileView === 'templates' ? '' : 'opacity-60'}`}
            style={{ color: mobileView === 'templates' ? themeConfig.colors.primary : themeConfig.colors.textSecondary }}
          >
            <Palette size={20} />
            <span className="text-[10px]">模板</span>
          </button>
          <button
            onClick={() => setMobileView('preview')}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${mobileView === 'preview' ? '' : 'opacity-60'}`}
            style={{ color: mobileView === 'preview' ? themeConfig.colors.primary : themeConfig.colors.textSecondary }}
          >
            <Eye size={20} />
            <span className="text-[10px]">预览</span>
          </button>
          <button
            onClick={() => setMobileView('edit')}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${mobileView === 'edit' ? '' : 'opacity-60'}`}
            style={{ color: mobileView === 'edit' ? themeConfig.colors.primary : themeConfig.colors.textSecondary }}
          >
            <FileText size={20} />
            <span className="text-[10px]">编辑</span>
          </button>
          <button
            onClick={handleExportPDF}
            className="flex flex-col items-center gap-1 p-2 rounded-lg transition-colors"
            style={{ color: themeConfig.colors.primary }}
          >
            <Download size={20} />
            <span className="text-[10px]">导出</span>
          </button>
        </div>
      </div>
    </PageTransition>
  )
}

// Helper component for input fields
function InputField({ label, value, onChange, type = 'text', placeholder = '', disabled = false, themeConfig }: {
  label: string
  value: string | number
  onChange: (value: string) => void
  type?: string
  placeholder?: string
  disabled?: boolean
  themeConfig: any
}) {
  return (
    <div className="space-y-1">
      <label className="text-[11px] font-medium" style={{ color: themeConfig.colors.textMuted }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full px-3 py-2 text-xs rounded-lg border outline-none transition-all disabled:opacity-50"
        style={{ 
          borderColor: themeConfig.colors.border,
          color: themeConfig.colors.text,
          background: themeConfig.colors.bg
        }}
      />
    </div>
  )
}
