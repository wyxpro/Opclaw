import { useState } from 'react'
import { 
  User, Award, Code2, Briefcase, FolderGit2, GraduationCap, Link2,
  Plus, Trash2, Undo2, Redo2, Download, Share2, RotateCcw
} from 'lucide-react'
import type { ResumeData, PersonalInfo, Skill, WorkExperience, Project, Education, SocialLink } from './types'
import type { ThemeConfig } from '../../../lib/themes'

interface ResumeEditorProps {
  data: ResumeData
  themeConfig: ThemeConfig
  onUpdate: (updater: (prev: ResumeData) => ResumeData) => void
  onUndo: () => void
  onRedo: () => void
  canUndo: boolean
  canRedo: boolean
  onExport: () => void
  onImport: (file: File) => Promise<void>
  onReset: () => void
  onShare: () => string
}

function Input({ label, value, onChange, type = 'text', placeholder = '' }: {
  label: string
  value: string | number
  onChange: (value: string) => void
  type?: string
  placeholder?: string
}) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-gray-500">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
      />
    </div>
  )
}



export function ResumeEditor({ 
  data, 
  themeConfig, 
  onUpdate, 
  onUndo, 
  onRedo, 
  canUndo, 
  canRedo,
  onExport,
  onReset
}: ResumeEditorProps) {
  const [activeTab, setActiveTab] = useState<'personal' | 'advantages' | 'skills' | 'work' | 'projects' | 'education' | 'links'>('personal')
  const [shareLink, setShareLink] = useState('')
  const [showShareModal, setShowShareModal] = useState(false)

  const tabs = [
    { id: 'personal', label: '个人信息', icon: User },
    { id: 'advantages', label: '个人优势', icon: Award },
    { id: 'skills', label: '专业技能', icon: Code2 },
    { id: 'work', label: '工作经历', icon: Briefcase },
    { id: 'projects', label: '项目经历', icon: FolderGit2 },
    { id: 'education', label: '教育背景', icon: GraduationCap },
    { id: 'links', label: '相关链接', icon: Link2 },
  ] as const

  const handleShare = () => {
    const link = `${window.location.origin}/resume/share`
    setShareLink(link)
    setShowShareModal(true)
    navigator.clipboard.writeText(link)
  }

  const updatePersonalInfo = (field: keyof PersonalInfo, value: string | number) => {
    onUpdate(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value }
    }))
  }

  const addAdvantage = () => {
    onUpdate(prev => ({
      ...prev,
      advantages: [...prev.advantages, { id: Date.now().toString(), content: '' }]
    }))
  }

  const updateAdvantage = (id: string, content: string) => {
    onUpdate(prev => ({
      ...prev,
      advantages: prev.advantages.map(a => a.id === id ? { ...a, content } : a)
    }))
  }

  const removeAdvantage = (id: string) => {
    onUpdate(prev => ({
      ...prev,
      advantages: prev.advantages.filter(a => a.id !== id)
    }))
  }

  const addSkill = () => {
    onUpdate(prev => ({
      ...prev,
      skills: [...prev.skills, { id: Date.now().toString(), category: '', items: [] }]
    }))
  }

  const updateSkill = (id: string, field: keyof Skill, value: string | string[]) => {
    onUpdate(prev => ({
      ...prev,
      skills: prev.skills.map(s => s.id === id ? { ...s, [field]: value } : s)
    }))
  }

  const removeSkill = (id: string) => {
    onUpdate(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s.id !== id)
    }))
  }

  const addWork = () => {
    onUpdate(prev => ({
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
    onUpdate(prev => ({
      ...prev,
      workExperiences: prev.workExperiences.map(w => w.id === id ? { ...w, [field]: value } : w)
    }))
  }

  const removeWork = (id: string) => {
    onUpdate(prev => ({
      ...prev,
      workExperiences: prev.workExperiences.filter(w => w.id !== id)
    }))
  }

  const addProject = () => {
    onUpdate(prev => ({
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
    onUpdate(prev => ({
      ...prev,
      projects: prev.projects.map(p => p.id === id ? { ...p, [field]: value } : p)
    }))
  }

  const removeProject = (id: string) => {
    onUpdate(prev => ({
      ...prev,
      projects: prev.projects.filter(p => p.id !== id)
    }))
  }

  const addEducation = () => {
    onUpdate(prev => ({
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
    onUpdate(prev => ({
      ...prev,
      education: prev.education.map(e => e.id === id ? { ...e, [field]: value } : e)
    }))
  }

  const removeEducation = (id: string) => {
    onUpdate(prev => ({
      ...prev,
      education: prev.education.filter(e => e.id !== id)
    }))
  }

  const addLink = () => {
    onUpdate(prev => ({
      ...prev,
      socialLinks: [...prev.socialLinks, { id: Date.now().toString(), name: '', url: '', icon: 'link' }]
    }))
  }

  const updateLink = (id: string, field: keyof SocialLink, value: string) => {
    onUpdate(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.map(l => l.id === id ? { ...l, [field]: value } : l)
    }))
  }

  const removeLink = (id: string) => {
    onUpdate(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.filter(l => l.id !== id)
    }))
  }

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: themeConfig.colors.border }}>
        <div className="flex items-center gap-2">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 transition-colors"
            title="撤销"
          >
            <Undo2 size={18} />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 transition-colors"
            title="重做"
          >
            <Redo2 size={18} />
          </button>
          <div className="w-px h-6 bg-gray-200 mx-2" />
          <button
            onClick={onExport}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-1.5 text-sm"
            title="导出JSON"
          >
            <Download size={18} />
            <span className="hidden sm:inline">导出</span>
          </button>
          <button
            onClick={handleShare}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-1.5 text-sm"
            title="分享链接"
          >
            <Share2 size={18} />
            <span className="hidden sm:inline">分享</span>
          </button>
          <button
            onClick={onReset}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-1.5 text-sm text-red-500"
            title="重置为默认"
          >
            <RotateCcw size={18} />
            <span className="hidden sm:inline">重置</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto border-b scrollbar-thin" style={{ borderColor: themeConfig.colors.border }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
              activeTab === tab.id 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Personal Info */}
        {activeTab === 'personal' && (
          <div className="space-y-4 max-w-xl">
            <h3 className="text-lg font-semibold mb-4">个人信息</h3>
            <div className="grid grid-cols-2 gap-4">
              <Input label="姓名" value={data.personalInfo.name} onChange={(v) => updatePersonalInfo('name', v)} />
              <Input label="职位" value={data.personalInfo.title} onChange={(v) => updatePersonalInfo('title', v)} />
              <Input label="年龄" type="number" value={data.personalInfo.age} onChange={(v) => updatePersonalInfo('age', parseInt(v) || 0)} />
              <Input label="地点" value={data.personalInfo.location} onChange={(v) => updatePersonalInfo('location', v)} />
              <Input label="电话" value={data.personalInfo.phone} onChange={(v) => updatePersonalInfo('phone', v)} />
              <Input label="邮箱" value={data.personalInfo.email} onChange={(v) => updatePersonalInfo('email', v)} />
              <Input label="GitHub" value={data.personalInfo.github} onChange={(v) => updatePersonalInfo('github', v)} />
              <Input label="头像URL" value={data.personalInfo.avatar || ''} onChange={(v) => updatePersonalInfo('avatar', v)} placeholder="可选" />
            </div>
          </div>
        )}

        {/* Advantages */}
        {activeTab === 'advantages' && (
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">个人优势</h3>
              <button
                onClick={addAdvantage}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
              >
                <Plus size={16} />
                添加
              </button>
            </div>
            <div className="space-y-3">
              {data.advantages.map((adv) => (
                <div key={adv.id} className="flex gap-2">
                  <textarea
                    value={adv.content}
                    onChange={(e) => updateAdvantage(adv.id, e.target.value)}
                    rows={2}
                    className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-blue-500 outline-none resize-none"
                    placeholder="输入优势描述..."
                  />
                  <button
                    onClick={() => removeAdvantage(adv.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {activeTab === 'skills' && (
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">专业技能</h3>
              <button
                onClick={addSkill}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
              >
                <Plus size={16} />
                添加
              </button>
            </div>
            <div className="space-y-4">
              {data.skills.map((skill) => (
                <div key={skill.id} className="p-4 rounded-xl border border-gray-200 space-y-3">
                  <div className="flex gap-2">
                    <input
                      value={skill.category}
                      onChange={(e) => updateSkill(skill.id, 'category', e.target.value)}
                      placeholder="技能类别"
                      className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-blue-500 outline-none"
                    />
                    <button
                      onClick={() => removeSkill(skill.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <textarea
                    value={skill.items.join(', ')}
                    onChange={(e) => updateSkill(skill.id, 'items', e.target.value.split(',').map(s => s.trim()))}
                    placeholder="技能项，用逗号分隔"
                    rows={2}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-blue-500 outline-none resize-none"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Work Experience */}
        {activeTab === 'work' && (
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">工作经历</h3>
              <button
                onClick={addWork}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
              >
                <Plus size={16} />
                添加
              </button>
            </div>
            <div className="space-y-4">
              {data.workExperiences.map((work) => (
                <div key={work.id} className="p-4 rounded-xl border border-gray-200 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      value={work.company}
                      onChange={(e) => updateWork(work.id, 'company', e.target.value)}
                      placeholder="公司名称"
                      className="px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-blue-500 outline-none"
                    />
                    <input
                      value={work.position}
                      onChange={(e) => updateWork(work.id, 'position', e.target.value)}
                      placeholder="职位"
                      className="px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-blue-500 outline-none"
                    />
                    <input
                      value={work.startDate}
                      onChange={(e) => updateWork(work.id, 'startDate', e.target.value)}
                      placeholder="开始时间 (如: 2024-01)"
                      className="px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-blue-500 outline-none"
                    />
                    <div className="flex items-center gap-2">
                      <input
                        value={work.endDate}
                        onChange={(e) => updateWork(work.id, 'endDate', e.target.value)}
                        placeholder="结束时间"
                        disabled={work.isCurrent}
                        className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-blue-500 outline-none disabled:bg-gray-100"
                      />
                      <label className="flex items-center gap-1 text-sm whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={work.isCurrent}
                          onChange={(e) => updateWork(work.id, 'isCurrent', e.target.checked)}
                          className="rounded"
                        />
                        至今
                      </label>
                    </div>
                  </div>
                  <textarea
                    value={work.responsibilities.join('\n')}
                    onChange={(e) => updateWork(work.id, 'responsibilities', e.target.value.split('\n'))}
                    placeholder="工作职责，每行一项"
                    rows={3}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-blue-500 outline-none resize-none"
                  />
                  <button
                    onClick={() => removeWork(work.id)}
                    className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600"
                  >
                    <Trash2 size={14} />
                    删除
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {activeTab === 'projects' && (
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">项目经历</h3>
              <button
                onClick={addProject}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
              >
                <Plus size={16} />
                添加
              </button>
            </div>
            <div className="space-y-4">
              {data.projects.map((project) => (
                <div key={project.id} className="p-4 rounded-xl border border-gray-200 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      value={project.name}
                      onChange={(e) => updateProject(project.id, 'name', e.target.value)}
                      placeholder="项目名称"
                      className="px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-blue-500 outline-none"
                    />
                    <input
                      value={project.role}
                      onChange={(e) => updateProject(project.id, 'role', e.target.value)}
                      placeholder="担任角色"
                      className="px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-blue-500 outline-none"
                    />
                    <input
                      value={project.startDate}
                      onChange={(e) => updateProject(project.id, 'startDate', e.target.value)}
                      placeholder="开始时间"
                      className="px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-blue-500 outline-none"
                    />
                    <div className="flex items-center gap-2">
                      <input
                        value={project.endDate}
                        onChange={(e) => updateProject(project.id, 'endDate', e.target.value)}
                        placeholder="结束时间"
                        disabled={project.isCurrent}
                        className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-blue-500 outline-none disabled:bg-gray-100"
                      />
                      <label className="flex items-center gap-1 text-sm whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={project.isCurrent}
                          onChange={(e) => updateProject(project.id, 'isCurrent', e.target.checked)}
                          className="rounded"
                        />
                        至今
                      </label>
                    </div>
                  </div>
                  <textarea
                    value={project.description}
                    onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                    placeholder="项目介绍"
                    rows={2}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-blue-500 outline-none resize-none"
                  />
                  <textarea
                    value={project.techStack}
                    onChange={(e) => updateProject(project.id, 'techStack', e.target.value)}
                    placeholder="技术栈"
                    rows={2}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-blue-500 outline-none resize-none"
                  />
                  <textarea
                    value={project.highlights.join('\n')}
                    onChange={(e) => updateProject(project.id, 'highlights', e.target.value.split('\n'))}
                    placeholder="项目亮点，每行一项"
                    rows={3}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-blue-500 outline-none resize-none"
                  />
                  <input
                    value={project.link || ''}
                    onChange={(e) => updateProject(project.id, 'link', e.target.value)}
                    placeholder="项目链接（可选）"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-blue-500 outline-none"
                  />
                  <button
                    onClick={() => removeProject(project.id)}
                    className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600"
                  >
                    <Trash2 size={14} />
                    删除
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {activeTab === 'education' && (
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">教育背景</h3>
              <button
                onClick={addEducation}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
              >
                <Plus size={16} />
                添加
              </button>
            </div>
            <div className="space-y-4">
              {data.education.map((edu) => (
                <div key={edu.id} className="p-4 rounded-xl border border-gray-200 space-y-3">
                  <div className="grid grid-cols-3 gap-3">
                    <input
                      value={edu.school}
                      onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                      placeholder="学校名称"
                      className="px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-blue-500 outline-none"
                    />
                    <input
                      value={edu.major}
                      onChange={(e) => updateEducation(edu.id, 'major', e.target.value)}
                      placeholder="专业"
                      className="px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-blue-500 outline-none"
                    />
                    <input
                      value={edu.degree}
                      onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                      placeholder="学历"
                      className="px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-blue-500 outline-none"
                    />
                  </div>
                  <textarea
                    value={edu.achievements.join('\n')}
                    onChange={(e) => updateEducation(edu.id, 'achievements', e.target.value.split('\n'))}
                    placeholder="成就/奖项，每行一项"
                    rows={3}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-blue-500 outline-none resize-none"
                  />
                  <button
                    onClick={() => removeEducation(edu.id)}
                    className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600"
                  >
                    <Trash2 size={14} />
                    删除
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Social Links */}
        {activeTab === 'links' && (
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">相关链接</h3>
              <button
                onClick={addLink}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
              >
                <Plus size={16} />
                添加
              </button>
            </div>
            <div className="space-y-3">
              {data.socialLinks.map((link) => (
                <div key={link.id} className="flex gap-2">
                  <input
                    value={link.name}
                    onChange={(e) => updateLink(link.id, 'name', e.target.value)}
                    placeholder="链接名称"
                    className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-blue-500 outline-none"
                  />
                  <input
                    value={link.url}
                    onChange={(e) => updateLink(link.id, 'url', e.target.value)}
                    placeholder="URL"
                    className="flex-[2] px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-blue-500 outline-none"
                  />
                  <button
                    onClick={() => removeLink(link.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">分享简历</h3>
            <p className="text-sm text-gray-600 mb-4">链接已复制到剪贴板</p>
            <div className="flex gap-2">
              <input
                value={shareLink}
                readOnly
                className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-200 bg-gray-50"
              />
              <button
                onClick={() => setShowShareModal(false)}
                className="px-4 py-2 text-sm rounded-lg bg-blue-500 text-white hover:bg-blue-600"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
