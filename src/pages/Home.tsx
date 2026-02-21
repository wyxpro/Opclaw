import { motion } from 'framer-motion'
import { useState } from 'react'
import { 
  ExternalLink, MapPin, Mail, ArrowDown, 
  Camera, BookOpen, Gamepad2, Plane, Palette, Dumbbell,
  Layout, Server, Smartphone, Cloud, Shield, Terminal,
  Sparkles, Zap, Target
} from 'lucide-react'
import PageTransition from '../components/ui/PageTransition'
import { personalInfo, portfolioProjects } from '../data/mock'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const } },
}

// 兴趣爱好数据
const hobbies = [
  { 
    id: 'photography', 
    name: '摄影', 
    icon: Camera, 
    color: '#f59e0b',
    description: '用镜头捕捉生活中的美好瞬间',
    images: ['📸', '🌅', '🏞️', '🎨'],
    level: 85
  },
  { 
    id: 'reading', 
    name: '阅读', 
    icon: BookOpen, 
    color: '#10b981',
    description: '在书海中探索知识的边界',
    images: ['📚', '📖', '✨', '🧠'],
    level: 92
  },
  { 
    id: 'gaming', 
    name: '游戏', 
    icon: Gamepad2, 
    color: '#8b5cf6',
    description: '沉浸式体验虚拟世界的精彩',
    images: ['🎮', '🎯', '🏆', '⚡'],
    level: 78
  },
  { 
    id: 'travel', 
    name: '旅行', 
    icon: Plane, 
    color: '#06b6d4',
    description: '用脚步丈量世界的广阔',
    images: ['✈️', '🌍', '🗺️', '🌟'],
    level: 70
  },
  { 
    id: 'design', 
    name: '设计', 
    icon: Palette, 
    color: '#ec4899',
    description: '用创意点亮视觉的灵感',
    images: ['🎨', '✏️', '🖌️', '💡'],
    level: 88
  },
  { 
    id: 'fitness', 
    name: '健身', 
    icon: Dumbbell, 
    color: '#ef4444',
    description: '用汗水铸就强健的体魄',
    images: ['💪', '🏃', '🔥', '⚡'],
    level: 75
  },
]

// 技能矩阵数据
const skillMatrix = [
  {
    category: '前端开发',
    icon: Layout,
    color: '#3b82f6',
    skills: [
      { name: 'React', level: 95, icon: '⚛️' },
      { name: 'TypeScript', level: 92, icon: '📘' },
      { name: 'Vue.js', level: 88, icon: '🟢' },
      { name: 'Next.js', level: 90, icon: '▲' },
      { name: 'Tailwind CSS', level: 94, icon: '🎨' },
      { name: 'Framer Motion', level: 85, icon: '✨' },
    ]
  },
  {
    category: '后端开发',
    icon: Server,
    color: '#10b981',
    skills: [
      { name: 'Node.js', level: 88, icon: '🟩' },
      { name: 'Python', level: 82, icon: '🐍' },
      { name: 'Go', level: 75, icon: '🐹' },
      { name: 'PostgreSQL', level: 80, icon: '🐘' },
      { name: 'Redis', level: 78, icon: '🔴' },
      { name: 'GraphQL', level: 72, icon: '◈' },
    ]
  },
  {
    category: 'DevOps',
    icon: Cloud,
    color: '#f59e0b',
    skills: [
      { name: 'Docker', level: 85, icon: '🐳' },
      { name: 'Kubernetes', level: 70, icon: '☸️' },
      { name: 'AWS', level: 76, icon: '☁️' },
      { name: 'CI/CD', level: 82, icon: '🔄' },
      { name: 'Terraform', level: 68, icon: '🏗️' },
      { name: 'Prometheus', level: 65, icon: '📊' },
    ]
  },
  {
    category: '移动开发',
    icon: Smartphone,
    color: '#8b5cf6',
    skills: [
      { name: 'React Native', level: 78, icon: '📱' },
      { name: 'Flutter', level: 70, icon: '🦋' },
      { name: 'iOS', level: 65, icon: '🍎' },
      { name: 'Android', level: 68, icon: '🤖' },
    ]
  },
  {
    category: '安全',
    icon: Shield,
    color: '#ef4444',
    skills: [
      { name: 'Web安全', level: 75, icon: '🔒' },
      { name: '渗透测试', level: 68, icon: '🎯' },
      { name: '加密算法', level: 72, icon: '🔐' },
    ]
  },
  {
    category: '工具',
    icon: Terminal,
    color: '#6b7280',
    skills: [
      { name: 'Git', level: 95, icon: '🌲' },
      { name: 'Vim', level: 80, icon: '📝' },
      { name: 'Linux', level: 88, icon: '🐧' },
      { name: 'Figma', level: 85, icon: '🎨' },
    ]
  },
]

/* ===== Hobbies Section Component ===== */
function HobbiesSection() {
  const [activeHobby, setActiveHobby] = useState<string | null>(null)

  return (
    <section className="py-20 px-6 bg-gradient-section">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Sparkles size={16} className="text-primary" />
            <span className="text-sm font-medium text-primary">多彩生活</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-text mb-3">兴趣爱好</h2>
          <p className="text-text-muted max-w-xl mx-auto">工作之外的精彩世界，用热情点亮生活的每一个角落</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {hobbies.map((hobby, index) => {
            const Icon = hobby.icon
            const isActive = activeHobby === hobby.id
            
            return (
              <motion.div
                key={hobby.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                onMouseEnter={() => setActiveHobby(hobby.id)}
                onMouseLeave={() => setActiveHobby(null)}
                className="group relative"
              >
                <div 
                  className="glass-card p-6 h-full transition-all duration-500 cursor-pointer overflow-hidden"
                  style={{ 
                    borderColor: isActive ? `${hobby.color}40` : undefined,
                    boxShadow: isActive ? `0 0 30px ${hobby.color}20` : undefined 
                  }}
                >
                  {/* Background Gradient */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ 
                      background: `radial-gradient(circle at 50% 0%, ${hobby.color}15, transparent 70%)` 
                    }}
                  />
                  
                  {/* Content */}
                  <div className="relative z-10">
                    {/* Icon & Level */}
                    <div className="flex items-start justify-between mb-4">
                      <motion.div
                        whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                        className="p-3 rounded-2xl"
                        style={{ background: `${hobby.color}20` }}
                      >
                        <Icon size={28} style={{ color: hobby.color }} />
                      </motion.div>
                      <div className="flex items-center gap-1 text-xs font-medium" style={{ color: hobby.color }}>
                        <Target size={12} />
                        <span>{hobby.level}%</span>
                      </div>
                    </div>

                    {/* Title & Description */}
                    <h3 className="text-xl font-bold text-text mb-2 group-hover:text-primary transition-colors">
                      {hobby.name}
                    </h3>
                    <p className="text-sm text-text-muted mb-4 leading-relaxed">
                      {hobby.description}
                    </p>

                    {/* Emoji Images */}
                    <div className="flex items-center gap-2">
                      {hobby.images.map((img, i) => (
                        <motion.span
                          key={i}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: index * 0.1 + i * 0.05 }}
                          className="text-2xl filter grayscale group-hover:grayscale-0 transition-all duration-300"
                          style={{ transitionDelay: `${i * 50}ms` }}
                        >
                          {img}
                        </motion.span>
                      ))}
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4 h-1.5 bg-surface rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${hobby.level}%` }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 + 0.3, duration: 1, ease: 'easeOut' }}
                        className="h-full rounded-full"
                        style={{ background: hobby.color }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ===== Skills Matrix Section Component ===== */
function SkillsMatrixSection() {
  const [activeCategory, setActiveCategory] = useState<number | null>(null)
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null)

  return (
    <section className="py-20 px-6">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-4">
            <Zap size={16} className="text-accent" />
            <span className="text-sm font-medium text-accent">技术栈</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-text mb-3">技能矩阵</h2>
          <p className="text-text-muted max-w-xl mx-auto">全栈开发能力覆盖，从前端到后端，从开发到部署</p>
        </motion.div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillMatrix.map((category, catIndex) => {
            const Icon = category.icon
            const isActive = activeCategory === catIndex
            
            return (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: catIndex * 0.1, duration: 0.5 }}
                onMouseEnter={() => setActiveCategory(catIndex)}
                onMouseLeave={() => setActiveCategory(null)}
                className="group"
              >
                <div 
                  className="glass-card p-5 h-full transition-all duration-300"
                  style={{ 
                    borderColor: isActive ? `${category.color}40` : undefined,
                    transform: isActive ? 'translateY(-4px)' : undefined
                  }}
                >
                  {/* Category Header */}
                  <div className="flex items-center gap-3 mb-4 pb-3 border-b border-border/50">
                    <div 
                      className="p-2.5 rounded-xl transition-transform group-hover:scale-110"
                      style={{ background: `${category.color}20` }}
                    >
                      <Icon size={22} style={{ color: category.color }} />
                    </div>
                    <h3 className="text-lg font-bold text-text">{category.category}</h3>
                  </div>

                  {/* Skills List */}
                  <div className="space-y-3">
                    {category.skills.map((skill, skillIndex) => {
                      const isHovered = hoveredSkill === `${category.category}-${skill.name}`
                      
                      return (
                        <motion.div
                          key={skill.name}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: catIndex * 0.1 + skillIndex * 0.05 }}
                          onMouseEnter={() => setHoveredSkill(`${category.category}-${skill.name}`)}
                          onMouseLeave={() => setHoveredSkill(null)}
                          className="relative"
                        >
                          <div 
                            className="flex items-center gap-3 p-2 rounded-lg transition-all duration-200 cursor-pointer"
                            style={{ 
                              background: isHovered ? `${category.color}10` : 'transparent',
                            }}
                          >
                            {/* Skill Icon */}
                            <span className="text-lg">{skill.icon}</span>
                            
                            {/* Skill Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium text-text truncate">
                                  {skill.name}
                                </span>
                                <span 
                                  className="text-xs font-bold"
                                  style={{ color: category.color }}
                                >
                                  {skill.level}%
                                </span>
                              </div>
                              
                              {/* Progress Bar */}
                              <div className="h-1.5 bg-surface rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  whileInView={{ width: `${skill.level}%` }}
                                  viewport={{ once: true }}
                                  transition={{ 
                                    delay: catIndex * 0.1 + skillIndex * 0.05 + 0.2, 
                                    duration: 0.8, 
                                    ease: 'easeOut' 
                                  }}
                                  className="h-full rounded-full transition-all duration-300"
                                  style={{ 
                                    background: category.color,
                                    opacity: isHovered ? 1 : 0.7
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>


      </div>
    </section>
  )
}

export default function Home() {
  return (
    <PageTransition>
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center bg-gradient-hero overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-rose/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan/3 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            className="mb-8"
          >
            <div className="relative mx-auto mb-6 h-28 w-28 rounded-full overflow-hidden ring-2 ring-primary/30 ring-offset-4 ring-offset-bg">
              <img
                src={personalInfo.avatar}
                alt={`${personalInfo.name}的头像`}
                className="h-full w-full object-cover"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <p className="mb-3 text-sm font-medium tracking-widest uppercase text-primary-glow">
              👋 你好，我是
            </p>
            <h1 className="mb-4 text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
              <span className="gradient-text">{personalInfo.name}</span>
            </h1>
            <p className="mb-4 text-xl text-text-secondary sm:text-2xl">
              {personalInfo.title}
            </p>
            <p className="mx-auto mb-8 max-w-xl text-base text-text-muted leading-relaxed">
              {personalInfo.tagline}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-3"
          >
            <div className="flex items-center gap-2 text-sm text-text-muted">
              <MapPin size={14} />
              {personalInfo.location}
            </div>
            <span className="text-border">·</span>
            <a href={`mailto:${personalInfo.email}`} className="flex items-center gap-2 text-sm text-text-muted hover:text-primary transition-colors">
              <Mail size={14} />
              {personalInfo.email}
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="mt-16"
          >
            <ArrowDown size={20} className="mx-auto text-text-muted animate-bounce" />
          </motion.div>
        </div>
      </section>

      {/* Hobbies Section - 兴趣爱好 */}
      <HobbiesSection />

      {/* Skills Matrix Section - 技能矩阵 */}
      <SkillsMatrixSection />

      {/* Portfolio Section */}
      <section className="py-20 px-6 bg-gradient-section">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-12 text-center"
          >
            <h2 className="text-3xl font-bold text-text mb-3">精选作品</h2>
            <p className="text-text-muted">探索我最引以为豪的项目</p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-50px' }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {portfolioProjects.map((project) => (
              <motion.div
                key={project.id}
                variants={item}
                className="group glass-card overflow-hidden"
              >
                {/* Card Header with gradient */}
                <div className={`${project.gradient} h-40 flex items-center justify-center relative overflow-hidden`}>
                  <span className="text-5xl group-hover:scale-110 transition-transform duration-300">
                    {project.icon}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
                </div>
                {/* Card Body */}
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-text">{project.title}</h3>
                    <ExternalLink size={16} className="text-text-muted group-hover:text-primary transition-colors" />
                  </div>
                  <p className="text-sm text-text-muted mb-4 leading-relaxed line-clamp-2">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-surface text-text-secondary border border-border">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-6">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-text mb-6">关于我</h2>
            <p className="text-lg text-text-secondary leading-relaxed mb-8">
              {personalInfo.bio}
            </p>
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium hover:bg-primary/20 transition-colors cursor-pointer">
              <Mail size={16} />
              与我取得联系
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="mx-auto max-w-6xl text-center">
          <p className="text-sm text-text-muted">
            © 2025 {personalInfo.name} · 用 ❤️ 和代码构建
          </p>
        </div>
      </footer>
    </PageTransition>
  )
}
