import { 
  Phone, Mail, Github, MapPin, User, Award, Code2, Briefcase, 
  GraduationCap, Link2, FolderGit2, ChevronRight, type LucideIcon 
} from 'lucide-react'
import type { ResumeData } from './types'
import type { ThemeConfig } from '../../../lib/themes'

interface ResumePreviewProps {
  data: ResumeData
  themeConfig: ThemeConfig
}

// Helper component for section titles
function SectionTitle({ icon: Icon, title, themeConfig }: { icon: LucideIcon; title: string; themeConfig: ThemeConfig }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div 
        className="w-8 h-8 rounded-lg flex items-center justify-center"
        style={{ background: themeConfig.colors.primaryMuted }}
      >
        <Icon size={18} style={{ color: themeConfig.colors.primary }} />
      </div>
      <h3 className="text-lg font-bold" style={{ color: themeConfig.colors.text }}>
        {title}
      </h3>
    </div>
  )
}

// Helper component for cards
function Card({ children, className = '', themeConfig }: { children: React.ReactNode; className?: string; themeConfig: ThemeConfig }) {
  return (
    <div 
      className={`rounded-2xl p-5 ${className}`}
      style={{ 
        background: themeConfig.colors.surface,
        border: `1px solid ${themeConfig.colors.border}`,
        boxShadow: themeConfig.shadows.card
      }}
    >
      {children}
    </div>
  )
}

export function ResumePreview({ data, themeConfig }: ResumePreviewProps) {
  const { personalInfo, advantages, skills, workExperiences, projects, education, socialLinks } = data

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header - Personal Info */}
      <Card className="flex flex-col sm:flex-row items-center sm:items-start gap-6" themeConfig={themeConfig}>
        {/* Avatar */}
        <div 
          className="w-24 h-24 sm:w-28 sm:h-28 rounded-full flex-shrink-0 flex items-center justify-center text-3xl font-bold"
          style={{ 
            background: themeConfig.colors.primaryMuted,
            color: themeConfig.colors.primary,
            border: `3px solid ${themeConfig.colors.primary}`
          }}
        >
          {personalInfo.avatar ? (
            <img src={personalInfo.avatar} alt={personalInfo.name} className="w-full h-full rounded-full object-cover" />
          ) : (
            personalInfo.name.charAt(0)
          )}
        </div>
        
        {/* Info */}
        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: themeConfig.colors.text }}>
            {personalInfo.name}
          </h1>
          <p 
            className="text-lg font-medium mb-3"
            style={{ color: themeConfig.colors.primary }}
          >
            {personalInfo.title}
          </p>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-sm" style={{ color: themeConfig.colors.textMuted }}>
            <span className="flex items-center gap-1">
              <User size={14} />
              年龄: {personalInfo.age}岁
            </span>
            <span className="flex items-center gap-1">
              <MapPin size={14} />
              地点: {personalInfo.location}
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-3 text-sm">
            <a 
              href={`tel:${personalInfo.phone}`}
              className="flex items-center gap-1.5 hover:opacity-70 transition-opacity"
              style={{ color: themeConfig.colors.primary }}
            >
              <Phone size={14} />
              {personalInfo.phone}
            </a>
            <a 
              href={`mailto:${personalInfo.email}`}
              className="flex items-center gap-1.5 hover:opacity-70 transition-opacity"
              style={{ color: themeConfig.colors.primary }}
            >
              <Mail size={14} />
              {personalInfo.email}
            </a>
            <a 
              href={`https://${personalInfo.github}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:opacity-70 transition-opacity"
              style={{ color: themeConfig.colors.primary }}
            >
              <Github size={14} />
              GitHub
            </a>
          </div>
        </div>
      </Card>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Personal Advantages */}
          <Card themeConfig={themeConfig}>
            <SectionTitle icon={Award} title="个人优势" themeConfig={themeConfig} />
            <ul className="space-y-3">
              {advantages.map((adv) => (
                <li 
                  key={adv.id}
                  className="text-sm leading-relaxed flex gap-2"
                  style={{ color: themeConfig.colors.text }}
                >
                  <ChevronRight size={16} className="flex-shrink-0 mt-0.5" style={{ color: themeConfig.colors.primary }} />
                  <span>{adv.content}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Professional Skills */}
          <Card themeConfig={themeConfig}>
            <SectionTitle icon={Code2} title="专业技能" themeConfig={themeConfig} />
            <div className="space-y-4">
              {skills.map((skill) => (
                <div key={skill.id}>
                  <h4 className="text-sm font-semibold mb-2" style={{ color: themeConfig.colors.text }}>
                    {skill.category}
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {skill.items.map((item, idx) => (
                      <span 
                        key={idx}
                        className="px-2 py-0.5 text-xs rounded-md"
                        style={{ 
                          background: themeConfig.colors.primaryMuted,
                          color: themeConfig.colors.primary
                        }}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Education */}
          <Card themeConfig={themeConfig}>
            <SectionTitle icon={GraduationCap} title="教育背景" themeConfig={themeConfig} />
            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id}>
                  <h4 className="font-semibold" style={{ color: themeConfig.colors.text }}>
                    {edu.school}
                  </h4>
                  <p className="text-sm mb-2" style={{ color: themeConfig.colors.textMuted }}>
                    {edu.major} | {edu.degree}
                  </p>
                  <ul className="space-y-1">
                    {edu.achievements.map((achievement, idx) => (
                      <li 
                        key={idx}
                        className="text-xs flex items-start gap-1.5"
                        style={{ color: themeConfig.colors.textDim }}
                      >
                        <span style={{ color: themeConfig.colors.primary }}>•</span>
                        {achievement}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Card>

          {/* Social Links */}
          <Card themeConfig={themeConfig}>
            <SectionTitle icon={Link2} title="相关链接" themeConfig={themeConfig} />
            <div className="space-y-2">
              {socialLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm hover:opacity-70 transition-opacity"
                  style={{ color: themeConfig.colors.primary }}
                >
                  <Link2 size={14} />
                  {link.name}
                </a>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Work Experience */}
          <Card themeConfig={themeConfig}>
            <SectionTitle icon={Briefcase} title="工作经历" themeConfig={themeConfig} />
            <div className="space-y-6">
              {workExperiences.map((work) => (
                <div key={work.id} className="relative pl-4 border-l-2" style={{ borderColor: themeConfig.colors.primaryMuted }}>
                  <div 
                    className="absolute -left-[9px] top-0 w-4 h-4 rounded-full"
                    style={{ background: themeConfig.colors.primary }}
                  />
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                    <h4 className="font-semibold" style={{ color: themeConfig.colors.text }}>
                      {work.company}
                    </h4>
                    <span 
                      className="text-xs px-2 py-1 rounded-full w-fit mt-1 sm:mt-0"
                      style={{ 
                        background: themeConfig.colors.primaryMuted,
                        color: themeConfig.colors.primary
                      }}
                    >
                      {work.startDate} - {work.isCurrent ? '至今' : work.endDate}
                    </span>
                  </div>
                  <p className="text-sm mb-2" style={{ color: themeConfig.colors.textMuted }}>
                    {work.position}
                  </p>
                  <ul className="space-y-1">
                    {work.responsibilities.map((resp, idx) => (
                      <li 
                        key={idx}
                        className="text-sm flex items-start gap-2"
                        style={{ color: themeConfig.colors.textDim }}
                      >
                        <span style={{ color: themeConfig.colors.primary }}>•</span>
                        {resp}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Card>

          {/* Projects */}
          <Card themeConfig={themeConfig}>
            <SectionTitle icon={FolderGit2} title="项目经历" themeConfig={themeConfig} />
            <div className="space-y-6">
              {projects.map((project) => (
                <div key={project.id} className="pb-6 border-b last:border-b-0 last:pb-0" style={{ borderColor: themeConfig.colors.border }}>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                    <h4 className="font-semibold" style={{ color: themeConfig.colors.text }}>
                      {project.name}
                    </h4>
                    <span 
                      className="text-xs px-2 py-1 rounded-full w-fit mt-1 sm:mt-0"
                      style={{ 
                        background: themeConfig.colors.primaryMuted,
                        color: themeConfig.colors.primary
                      }}
                    >
                      {project.startDate} - {project.isCurrent ? '至今' : project.endDate}
                    </span>
                  </div>
                  <p className="text-sm mb-3" style={{ color: themeConfig.colors.textMuted }}>
                    {project.role}
                  </p>
                  
                  <div className="mb-3">
                    <h5 className="text-xs font-semibold mb-1" style={{ color: themeConfig.colors.text }}>
                      项目介绍
                    </h5>
                    <p className="text-sm leading-relaxed" style={{ color: themeConfig.colors.textDim }}>
                      {project.description}
                    </p>
                  </div>

                  <div className="mb-3">
                    <h5 className="text-xs font-semibold mb-1" style={{ color: themeConfig.colors.text }}>
                      技术栈
                    </h5>
                    <p className="text-sm leading-relaxed" style={{ color: themeConfig.colors.textDim }}>
                      {project.techStack}
                    </p>
                  </div>

                  <div>
                    <h5 className="text-xs font-semibold mb-2" style={{ color: themeConfig.colors.text }}>
                      项目亮点
                    </h5>
                    <ul className="space-y-1">
                      {project.highlights.map((highlight, idx) => (
                        <li 
                          key={idx}
                          className="text-sm flex items-start gap-2"
                          style={{ color: themeConfig.colors.textDim }}
                        >
                          <span style={{ color: themeConfig.colors.primary }}>•</span>
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 mt-3 text-sm hover:opacity-70 transition-opacity"
                      style={{ color: themeConfig.colors.primary }}
                    >
                      <Link2 size={14} />
                      项目官网
                    </a>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
