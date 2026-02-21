import { motion } from 'framer-motion'
import { Code, GitBranch, FileText, Star, ExternalLink, MapPin, Mail, ArrowDown } from 'lucide-react'
import PageTransition from '../components/ui/PageTransition'
import { personalInfo, skills, stats, portfolioProjects } from '../data/mock'

const statIcons: Record<string, typeof Code> = { Code, GitBranch, FileText, Star }

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
}

const skillCategories = [...new Set(skills.map((s) => s.category))]

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

      {/* Stats Section */}
      <section className="py-16 bg-gradient-section">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {stats.map((stat) => {
              const Icon = statIcons[stat.icon] || Code
              return (
                <motion.div
                  key={stat.label}
                  variants={item}
                  className="glass-card p-6 text-center group"
                >
                  <Icon size={24} className="mx-auto mb-3 text-primary group-hover:text-primary-glow transition-colors" />
                  <p className="text-3xl font-bold text-text mb-1">{stat.value}</p>
                  <p className="text-sm text-text-muted">{stat.label}</p>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-20 px-6">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-12 text-center"
          >
            <h2 className="text-3xl font-bold text-text mb-3">技能与兴趣</h2>
            <p className="text-text-muted">持续学习，不断进步</p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-50px' }}
            className="space-y-8"
          >
            {skillCategories.map((category) => (
              <motion.div key={category} variants={item}>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-text-muted mb-4">
                  {category}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {skills
                    .filter((s) => s.category === category)
                    .map((skill) => (
                      <div
                        key={skill.name}
                        className="group relative"
                      >
                        <div className="tag cursor-default group-hover:bg-primary/20 group-hover:border-primary/40">
                          {skill.name}
                          <span className="ml-2 text-text-muted text-xs group-hover:text-primary-glow transition-colors">
                            {skill.level}%
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

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
