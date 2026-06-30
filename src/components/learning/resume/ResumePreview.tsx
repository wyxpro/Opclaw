import { 
  Phone, Mail, Github, MapPin, Award, Code2, Briefcase, 
  GraduationCap, FolderGit2
} from 'lucide-react'
import type { ResumeData } from './types'
import type { ThemeConfig } from '../../../lib/themes'

interface ResumePreviewProps {
  data: ResumeData
  themeConfig: ThemeConfig
  templateId?: string
}

// ==================== 1. 简约模板 (Minimalist) ====================
function MinimalLayout({ data }: { data: ResumeData }) {
  const { personalInfo, advantages, skills, workExperiences, projects, education } = data
  return (
    <div className="max-w-4xl mx-auto p-6 sm:p-10 md:p-12 bg-white text-slate-800 space-y-6 sm:space-y-8 font-serif select-text min-h-screen">
      {/* Header */}
      <div className="text-center pb-5 border-b border-slate-200">
        <h1 className="text-2xl sm:text-3.5xl font-normal tracking-wide text-slate-900 mb-2 font-serif">
          {personalInfo.name}
        </h1>
        <p className="text-sm tracking-wider text-slate-500 uppercase mb-3.5 font-medium">{personalInfo.title}</p>
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-xs text-slate-500">
          <span>{personalInfo.age}岁</span>
          <span>•</span>
          <span>{personalInfo.location}</span>
          {personalInfo.phone && (
            <>
              <span>•</span>
              <span>{personalInfo.phone}</span>
            </>
          )}
          {personalInfo.email && (
            <>
              <span>•</span>
              <span>{personalInfo.email}</span>
            </>
          )}
          {personalInfo.github && (
            <>
              <span>•</span>
              <span className="truncate max-w-[150px]">{personalInfo.github}</span>
            </>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-6 sm:space-y-8">
        {/* Education */}
        {education.length > 0 && (
          <div>
            <h2 className="text-xs sm:text-sm font-semibold tracking-widest text-slate-900 uppercase mb-2.5 pb-1 border-b border-slate-100">
              教育背景
            </h2>
            <div className="space-y-3.5">
              {education.map((edu) => (
                <div key={edu.id} className="text-xs sm:text-sm">
                  <div className="flex justify-between font-semibold text-slate-900">
                    <span>{edu.school}</span>
                    <span className="font-normal text-slate-500 text-xs">{edu.degree}</span>
                  </div>
                  <div className="text-xs text-slate-500 mb-1">{edu.major}</div>
                  <ul className="list-disc list-inside text-xs text-slate-600 space-y-1 pl-1 leading-relaxed">
                    {edu.achievements.map((ach, i) => (
                      <li key={i}>{ach}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Work Experience */}
        {workExperiences.length > 0 && (
          <div>
            <h2 className="text-xs sm:text-sm font-semibold tracking-widest text-slate-900 uppercase mb-2.5 pb-1 border-b border-slate-100">
              工作经历
            </h2>
            <div className="space-y-5">
              {workExperiences.map((work) => (
                <div key={work.id} className="text-xs sm:text-sm">
                  <div className="flex justify-between font-semibold text-slate-900 mb-0.5">
                    <span>{work.company}</span>
                    <span className="font-normal text-slate-500 text-xs">
                      {work.startDate} — {work.isCurrent ? '至今' : work.endDate}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-slate-600 mb-2">{work.position}</div>
                  <ul className="list-disc list-inside text-xs text-slate-600 space-y-1 pl-1 leading-relaxed">
                    {work.responsibilities.map((resp, i) => (
                      <li key={i}>{resp}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <div>
            <h2 className="text-xs sm:text-sm font-semibold tracking-widest text-slate-900 uppercase mb-2.5 pb-1 border-b border-slate-100">
              项目经历
            </h2>
            <div className="space-y-5">
              {projects.map((proj) => (
                <div key={proj.id} className="text-xs sm:text-sm">
                  <div className="flex justify-between font-semibold text-slate-900 mb-0.5">
                    <span className="flex items-center gap-1.5">
                      {proj.name}
                      {proj.link && (
                        <span className="text-[10px] text-slate-400 font-normal">({proj.link})</span>
                      )}
                    </span>
                    <span className="font-normal text-slate-500 text-xs">
                      {proj.startDate} — {proj.isCurrent ? '至今' : proj.endDate}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mb-1.5">{proj.role}</div>
                  <div className="text-xs text-slate-700 mb-1.5 leading-relaxed">
                    <span className="font-bold text-slate-800">项目描述：</span>{proj.description}
                  </div>
                  <div className="text-xs text-slate-700 mb-2 leading-relaxed">
                    <span className="font-bold text-slate-800">技术栈：</span>{proj.techStack}
                  </div>
                  <ul className="list-disc list-inside text-xs text-slate-600 space-y-1 pl-1 leading-relaxed">
                    {proj.highlights.map((highlight, i) => (
                      <li key={i}>{highlight}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div>
            <h2 className="text-xs sm:text-sm font-semibold tracking-widest text-slate-900 uppercase mb-2.5 pb-1 border-b border-slate-100">
              专业技能
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs text-slate-600">
              {skills.map((skill) => (
                <div key={skill.id} className="space-y-0.5">
                  <span className="font-semibold text-slate-850">{skill.category}：</span>
                  <span>{skill.items.join(', ')}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Advantages */}
        {advantages.length > 0 && (
          <div>
            <h2 className="text-xs sm:text-sm font-semibold tracking-widest text-slate-900 uppercase mb-2.5 pb-1 border-b border-slate-100">
              个人优势
            </h2>
            <ul className="list-disc list-inside text-xs text-slate-600 space-y-1 leading-relaxed pl-1">
              {advantages.map((adv) => (
                <li key={adv.id}>{adv.content}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

// ==================== 2. 商务模板 (Business) ====================
function BusinessLayout({ data }: { data: ResumeData }) {
  const { personalInfo, advantages, skills, workExperiences, projects, education } = data
  return (
    <div className="max-w-5xl mx-auto bg-white text-slate-800 flex flex-col md:flex-row min-h-screen shadow-sm select-text font-sans">
      {/* Sidebar (1/3 Width) */}
      <div className="w-full md:w-72 bg-slate-50 border-r border-slate-200 p-6 sm:p-8 space-y-6 flex-shrink-0">
        {/* Avatar & Basic Info */}
        <div className="text-center pb-5 border-b border-slate-200">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full mx-auto mb-3.5 overflow-hidden border-2 border-slate-300 bg-white">
            {personalInfo.avatar ? (
              <img src={personalInfo.avatar} alt={personalInfo.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl font-bold bg-slate-200 text-slate-600">
                {personalInfo.name.charAt(0)}
              </div>
            )}
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-0.5">{personalInfo.name}</h2>
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">{personalInfo.title}</p>
        </div>

        {/* Contact Info */}
        <div className="space-y-2.5">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest pb-1 border-b border-slate-200">
            联系方式
          </h3>
          <div className="space-y-1.5 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <Phone size={12} className="text-slate-400" />
              <span>{personalInfo.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail size={12} className="text-slate-400" />
              <span className="truncate">{personalInfo.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={12} className="text-slate-400" />
              <span>{personalInfo.location}</span>
            </div>
            {personalInfo.github && (
              <div className="flex items-center gap-2">
                <Github size={12} className="text-slate-400" />
                <span className="truncate max-w-[160px]">{personalInfo.github}</span>
              </div>
            )}
          </div>
        </div>

        {/* Education (Inside sidebar for business template) */}
        {education.length > 0 && (
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest pb-1 border-b border-slate-200">
              教育经历
            </h3>
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id} className="text-xs">
                  <div className="font-bold text-slate-800">{edu.school}</div>
                  <div className="text-[10px] text-slate-500">{edu.major} · {edu.degree}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest pb-1 border-b border-slate-200">
              专业技能
            </h3>
            <div className="space-y-2.5">
              {skills.map((skill) => (
                <div key={skill.id} className="text-xs">
                  <div className="font-semibold text-slate-700 mb-1">{skill.category}</div>
                  <div className="flex flex-wrap gap-1">
                    {skill.items.map((item, i) => (
                      <span key={i} className="px-1.5 py-0.5 rounded bg-slate-200/60 text-slate-700 text-[10px] font-medium">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Body (2/3 Width) */}
      <div className="flex-1 p-6 sm:p-8 space-y-5">
        {/* Objectives / Summary */}
        {advantages.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b pb-1.5">
              <span className="w-1.5 h-4 bg-blue-800 rounded-sm" />
              个人优势
            </h3>
            <ul className="list-disc list-inside text-xs text-slate-650 space-y-1 pl-1">
              {advantages.map((adv) => (
                <li key={adv.id}>{adv.content}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Work Experience */}
        {workExperiences.length > 0 && (
          <div className="space-y-3.5">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b pb-1.5">
              <span className="w-1.5 h-4 bg-blue-800 rounded-sm" />
              工作履历
            </h3>
            <div className="space-y-4">
              {workExperiences.map((work) => (
                <div key={work.id} className="text-xs space-y-1">
                  <div className="flex justify-between items-center font-bold text-slate-800">
                    <span className="text-sm">{work.company}</span>
                    <span className="font-normal text-slate-500 text-[11px]">{work.startDate} — {work.isCurrent ? '至今' : work.endDate}</span>
                  </div>
                  <div className="font-semibold text-blue-800">{work.position}</div>
                  <ul className="list-disc list-inside text-xs text-slate-600 space-y-1 pl-1 mt-1 leading-relaxed">
                    {work.responsibilities.map((resp, i) => (
                      <li key={i}>{resp}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <div className="space-y-3.5">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b pb-1.5">
              <span className="w-1.5 h-4 bg-blue-800 rounded-sm" />
              项目经验
            </h3>
            <div className="space-y-4.5">
              {projects.map((proj) => (
                <div key={proj.id} className="text-xs space-y-1">
                  <div className="flex justify-between items-center font-bold text-slate-800">
                    <span className="text-sm">{proj.name}</span>
                    <span className="font-normal text-slate-500 text-[11px]">{proj.startDate} — {proj.isCurrent ? '至今' : proj.endDate}</span>
                  </div>
                  <div className="font-semibold text-slate-500">{proj.role}</div>
                  <div className="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <div><span className="font-bold text-slate-700">项目描述：</span>{proj.description}</div>
                    <div className="mt-1"><span className="font-bold text-slate-700">技术选型：</span>{proj.techStack}</div>
                  </div>
                  <ul className="list-disc list-inside text-xs text-slate-650 space-y-1 pl-1 mt-1 leading-relaxed">
                    {proj.highlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ==================== 3. 创意模板 (Creative) ====================
function CreativeLayout({ data }: { data: ResumeData }) {
  const { personalInfo, advantages, skills, workExperiences, projects, education } = data
  return (
    <div className="max-w-5xl mx-auto bg-slate-950 text-slate-100 p-6 sm:p-8 md:p-10 rounded-3xl space-y-6 sm:space-y-8 shadow-2xl relative overflow-hidden select-text font-sans min-h-screen">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-pink-500/10 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
        <div className="flex items-center gap-5">
          <div className="relative group">
            <div className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 opacity-60 blur group-hover:opacity-100 transition duration-300 animate-pulse" />
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-slate-900 bg-slate-900">
              {personalInfo.avatar ? (
                <img src={personalInfo.avatar} alt={personalInfo.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl font-bold bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                  {personalInfo.name.charAt(0)}
                </div>
              )}
            </div>
          </div>
          <div>
            <h1 className="text-2.5xl sm:text-3.5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-1">
              {personalInfo.name}
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-slate-450">{personalInfo.title}</p>
            <div className="flex flex-wrap gap-2.5 mt-2 text-xs text-slate-500">
              <span>{personalInfo.age}岁</span>
              <span>•</span>
              <span>{personalInfo.location}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1 text-xs text-slate-400 bg-slate-900/60 p-4 rounded-2xl border border-slate-800/50 backdrop-blur-md w-full md:w-auto">
          <div className="flex items-center gap-2">
            <Phone size={12} className="text-purple-400" />
            <span>{personalInfo.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail size={12} className="text-pink-400" />
            <span>{personalInfo.email}</span>
          </div>
          {personalInfo.github && (
            <div className="flex items-center gap-2">
              <Github size={12} className="text-purple-400" />
              <span className="truncate max-w-[200px]">{personalInfo.github}</span>
            </div>
          )}
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
        {/* Left Column (Skills, Education) */}
        <div className="space-y-6">
          {/* Skills */}
          {skills.length > 0 && (
            <div className="bg-slate-900/50 p-5 rounded-2xl border border-slate-850 backdrop-blur-md">
              <h3 className="text-sm font-bold text-white mb-3.5 flex items-center gap-2">
                <Code2 size={15} className="text-purple-400" />
                技能图谱
              </h3>
              <div className="space-y-3.5">
                {skills.map((skill) => (
                  <div key={skill.id} className="space-y-1.5">
                    <div className="text-xs font-bold text-slate-350">{skill.category}</div>
                    <div className="flex flex-wrap gap-1.5">
                      {skill.items.map((item, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-300 text-[10px] font-medium">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {education.length > 0 && (
            <div className="bg-slate-900/50 p-5 rounded-2xl border border-slate-850 backdrop-blur-md">
              <h3 className="text-sm font-bold text-white mb-3.5 flex items-center gap-2">
                <GraduationCap size={15} className="text-pink-400" />
                教育背景
              </h3>
              <div className="space-y-4">
                {education.map((edu) => (
                  <div key={edu.id} className="text-xs space-y-1">
                    <div className="font-bold text-slate-200">{edu.school}</div>
                    <div className="text-slate-400">{edu.major} · {edu.degree}</div>
                    <ul className="list-disc list-inside text-slate-500 text-[10px] space-y-0.5 mt-1.5">
                      {edu.achievements.map((a, idx) => (
                        <li key={idx} className="truncate">{a}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column (Advantages, Work, Projects) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Advantages */}
          {advantages.length > 0 && (
            <div className="bg-slate-900/50 p-5 rounded-2xl border border-slate-850 backdrop-blur-md">
              <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <Award size={15} className="text-purple-400" />
                个人优势
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-350">
                {advantages.map((adv) => (
                  <li key={adv.id} className="flex gap-2 items-start">
                    <span className="text-pink-500 mt-0.5">•</span>
                    <span>{adv.content}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Work Experience */}
          {workExperiences.length > 0 && (
            <div className="bg-slate-900/50 p-5 rounded-2xl border border-slate-850 backdrop-blur-md">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <Briefcase size={15} className="text-pink-400" />
                工作经历
              </h3>
              <div className="space-y-5">
                {workExperiences.map((work) => (
                  <div key={work.id} className="relative pl-5 border-l border-purple-500/20 text-xs">
                    <div className="absolute -left-[4.5px] top-1 w-2 h-2 rounded-full bg-purple-500" />
                    <div className="flex justify-between items-center font-bold text-slate-200 mb-1">
                      <span className="text-sm">{work.company}</span>
                      <span className="font-normal text-slate-400 text-[10px] bg-slate-800 px-2 py-0.5 rounded-full">
                        {work.startDate} — {work.isCurrent ? '至今' : work.endDate}
                      </span>
                    </div>
                    <div className="text-pink-400 font-semibold mb-2">{work.position}</div>
                    <ul className="list-disc list-inside text-slate-400 space-y-1.5 leading-relaxed pl-1">
                      {work.responsibilities.map((resp, i) => (
                        <li key={i}>{resp}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <div className="bg-slate-900/50 p-5 rounded-2xl border border-slate-850 backdrop-blur-md">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <FolderGit2 size={15} className="text-purple-400" />
                精选项目
              </h3>
              <div className="space-y-5">
                {projects.map((proj) => (
                  <div key={proj.id} className="text-xs space-y-2">
                    <div className="flex justify-between items-center font-bold text-slate-200">
                      <span className="text-sm">{proj.name}</span>
                      <span className="font-normal text-slate-400 text-[10px] bg-slate-805 px-2 py-0.5 rounded-full">
                        {proj.startDate} — {proj.isCurrent ? '至今' : proj.endDate}
                      </span>
                    </div>
                    <div className="text-slate-400 italic">{proj.role}</div>
                    <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-900/60 leading-relaxed text-slate-400">
                      <div><span className="text-slate-350 font-bold">项目介绍: </span>{proj.description}</div>
                      <div className="mt-1.5"><span className="text-slate-350 font-bold">技术栈: </span>{proj.techStack}</div>
                    </div>
                    <ul className="list-disc list-inside text-slate-400 space-y-1.5 pl-1 leading-relaxed">
                      {proj.highlights.map((h, i) => (
                        <li key={i}>{h}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ==================== 4. 校园模板 (Campus) ====================
function CampusLayout({ data }: { data: ResumeData }) {
  const { personalInfo, advantages, skills, workExperiences, projects, education } = data
  return (
    <div className="max-w-4xl mx-auto bg-white text-slate-800 p-6 sm:p-8 md:p-10 space-y-6 shadow-sm select-text font-sans border border-teal-100 rounded-3xl min-h-screen">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-500 to-emerald-600 rounded-2xl p-5 sm:p-6 text-white flex flex-col md:flex-row items-center gap-5 shadow-sm">
        <div className="w-18 h-18 sm:w-22 sm:h-22 rounded-full overflow-hidden border-4 border-white/20 bg-white/10 flex-shrink-0">
          {personalInfo.avatar ? (
            <img src={personalInfo.avatar} alt={personalInfo.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-3xl font-bold bg-white/20 text-white">
              {personalInfo.name.charAt(0)}
            </div>
          )}
        </div>
        <div className="flex-1 text-center md:text-left space-y-1">
          <div className="flex flex-col md:flex-row md:items-baseline gap-2">
            <h1 className="text-2xl sm:text-2.5xl font-bold">{personalInfo.name}</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/20 text-white font-medium w-fit mx-auto md:mx-0">
              应届毕业生
            </span>
          </div>
          <p className="text-xs sm:text-sm text-teal-50/90">{personalInfo.title}</p>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-3.5 gap-y-1 text-xs text-teal-100 pt-1">
            <span>{personalInfo.age}岁</span>
            <span>|</span>
            <span>{personalInfo.location}</span>
            <span>|</span>
            <span>{personalInfo.phone}</span>
            <span>|</span>
            <span>{personalInfo.email}</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Education-First Layout */}
      <div className="space-y-6">
        {/* Education (Promoted to top for campus/graduates) */}
        {education.length > 0 && (
          <div className="border border-slate-100 rounded-2xl p-5 bg-emerald-50/10">
            <h3 className="text-sm font-bold text-emerald-800 mb-3 flex items-center gap-2">
              <GraduationCap size={16} className="text-emerald-600" />
              教育背景
            </h3>
            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id} className="text-xs space-y-1">
                  <div className="flex justify-between items-center font-bold text-slate-850">
                    <span className="text-sm">{edu.school}</span>
                    <span className="font-normal text-slate-500">本科</span>
                  </div>
                  <div className="text-teal-700 font-semibold">{edu.major} · {edu.degree}</div>
                  <div className="pt-1.5 space-y-1 leading-relaxed">
                    <div className="font-bold text-[10px] text-slate-400 uppercase tracking-wider">在校表现 / 荣誉奖项：</div>
                    <ul className="list-disc list-inside space-y-1 pl-1 text-slate-600">
                      {edu.achievements.map((ach, i) => (
                        <li key={i}>{ach}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Project Experiences (Important for grads) */}
        {projects.length > 0 && (
          <div className="border border-slate-100 rounded-2xl p-5">
            <h3 className="text-sm font-bold text-teal-800 mb-3 flex items-center gap-2">
              <FolderGit2 size={16} className="text-teal-600" />
              项目与学生活动经历
            </h3>
            <div className="space-y-5">
              {projects.map((proj) => (
                <div key={proj.id} className="text-xs space-y-1.5">
                  <div className="flex justify-between items-center font-bold text-slate-800">
                    <span className="text-sm">{proj.name}</span>
                    <span className="font-normal text-slate-500">{proj.startDate} — {proj.isCurrent ? '至今' : proj.endDate}</span>
                  </div>
                  <div className="text-teal-700 font-semibold">{proj.role}</div>
                  <p className="text-slate-650 bg-slate-50/50 p-2.5 rounded-xl border border-slate-100/50 leading-relaxed">
                    <span className="font-bold text-slate-705">主要工作：</span>{proj.description}
                  </p>
                  <p className="text-slate-600 leading-relaxed">
                    <span className="font-bold text-slate-705">涉及技术：</span>{proj.techStack}
                  </p>
                  <ul className="list-disc list-inside text-slate-650 space-y-1 pl-1 leading-relaxed">
                    {proj.highlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Internships/Work Experiences */}
        {workExperiences.length > 0 && (
          <div className="border border-slate-100 rounded-2xl p-5">
            <h3 className="text-sm font-bold text-emerald-800 mb-3 flex items-center gap-2">
              <Briefcase size={16} className="text-emerald-600" />
              实习与社会实践
            </h3>
            <div className="space-y-4">
              {workExperiences.map((work) => (
                <div key={work.id} className="text-xs space-y-1">
                  <div className="flex justify-between items-center font-bold text-slate-800">
                    <span className="text-sm">{work.company}</span>
                    <span className="font-normal text-slate-500">{work.startDate} — {work.isCurrent ? '至今' : work.endDate}</span>
                  </div>
                  <div className="text-teal-700 font-semibold">{work.position}</div>
                  <ul className="list-disc list-inside text-slate-650 space-y-1.5 pl-1 mt-1 leading-relaxed">
                    {work.responsibilities.map((resp, i) => (
                      <li key={i}>{resp}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills & Self-Evaluation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Skills */}
          {skills.length > 0 && (
            <div className="border border-slate-100 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-teal-800 mb-3.5 flex items-center gap-2">
                <Code2 size={16} className="text-teal-600" />
                技能与证书
              </h3>
              <div className="space-y-3">
                {skills.map((skill) => (
                  <div key={skill.id} className="text-xs">
                    <div className="font-bold text-slate-700 mb-1">{skill.category}</div>
                    <div className="flex flex-wrap gap-1">
                      {skill.items.map((item, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 font-medium text-[10px] border border-teal-100">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Personal Advantages */}
          {advantages.length > 0 && (
            <div className="border border-slate-100 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-emerald-800 mb-3.5 flex items-center gap-2">
                <Award size={16} className="text-emerald-600" />
                自我评价
              </h3>
              <ul className="list-disc list-inside text-xs text-slate-655 space-y-1.5 pl-1 leading-relaxed">
                {advantages.map((adv) => (
                  <li key={adv.id}>{adv.content}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function ResumePreview({ data, templateId = 'minimal' }: ResumePreviewProps) {
  if (templateId === 'business') {
    return <BusinessLayout data={data} />
  }
  if (templateId === 'creative') {
    return <CreativeLayout data={data} />
  }
  if (templateId === 'campus') {
    return <CampusLayout data={data} />
  }
  return <MinimalLayout data={data} />
}
