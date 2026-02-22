import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Calendar, Clock, ChevronRight, ChevronDown, ArrowLeft, Tag, Hash, Menu, X, BookOpen, GitBranch } from 'lucide-react'
import PageTransition from '../components/ui/PageTransition'
import SkillTreeView from '../components/ui/SkillTreeView'
import { learningCategories } from '../data/mock'
import type { Article } from '../data/mock'

interface Heading {
  id: string
  text: string
  level: 2 | 3
}

interface ArticleWithMeta extends Article {
  categoryName: string
  seriesName: string
}

type ViewMode = 'knowledge' | 'skilltree'

export default function Learning() {
  const [viewMode, setViewMode] = useState<ViewMode>('knowledge')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedSeries, setSelectedSeries] = useState<string | null>(null)
  const [selectedArticle, setSelectedArticle] = useState<ArticleWithMeta | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedCategories, setExpandedCategories] = useState<string[]>(
    learningCategories.map((c) => c.name)
  )
  const [headings, setHeadings] = useState<Heading[]>([])
  const [activeHeading, setActiveHeading] = useState<string>('')
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  const toggleCategory = (name: string) => {
    setExpandedCategories((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]
    )
  }

  // Get all articles flat
  const allArticles: ArticleWithMeta[] = learningCategories.flatMap((cat) =>
    cat.series.flatMap((series) =>
      series.articles.map((article) => ({
        ...article,
        categoryName: cat.name,
        seriesName: series.name,
      }))
    )
  )

  // Filter articles
  const filteredArticles = allArticles.filter((article) => {
    const matchesSearch =
      !searchQuery ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = !selectedCategory || article.categoryName === selectedCategory
    const matchesSeries = !selectedSeries || article.seriesName === selectedSeries
    return matchesSearch && matchesCategory && matchesSeries
  })

  // Extract headings from article content
  useEffect(() => {
    if (!selectedArticle) {
      requestAnimationFrame(() => {
        setHeadings([])
        setActiveHeading('')
      })
      return
    }
    
    const extractedHeadings: Heading[] = []
    const lines = selectedArticle.content.split('\n\n')
    lines.forEach((line) => {
      if (line.startsWith('## ')) {
        const text = line.replace('## ', '')
        extractedHeadings.push({
          id: `heading-${text}`,
          text,
          level: 2
        })
      } else if (line.startsWith('### ')) {
        const text = line.replace('### ', '')
        extractedHeadings.push({
          id: `heading-${text}`,
          text,
          level: 3
        })
      }
    })
    requestAnimationFrame(() => {
      setHeadings(extractedHeadings)
    })
  }, [selectedArticle])

  // Scroll to heading
  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const offset = 120
      const elementPosition = element.getBoundingClientRect().top + window.scrollY
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      })
      setActiveHeading(id)
      setShowMobileMenu(false)
    }
  }

  // Track active heading on scroll
  useEffect(() => {
    if (!selectedArticle || headings.length === 0) return

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150
      
      for (let i = headings.length - 1; i >= 0; i--) {
        const element = document.getElementById(headings[i].id)
        if (element && element.offsetTop <= scrollPosition) {
          setActiveHeading(headings[i].id)
          break
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [headings, selectedArticle])

  // Handle article selection
  const handleSelectArticle = (article: ArticleWithMeta) => {
    setSelectedArticle(article)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Handle back to list
  const handleBackToList = () => {
    setSelectedArticle(null)
    setHeadings([])
    setActiveHeading('')
  }

  // Category Sidebar JSX
  const categorySidebarJSX = (isSticky: boolean) => (
    <div className={`glass-card p-4 ${isSticky ? 'sticky top-24' : ''}`}>
      <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-4 px-2">
        目录导航
      </h3>

      <button
        onClick={() => { setSelectedCategory(null); setSelectedSeries(null) }}
        className={`w-full text-left px-3 py-2 rounded-lg text-sm mb-2 transition-all ${
          !selectedCategory
            ? 'bg-primary/10 text-primary border border-primary/20'
            : 'text-text-secondary hover:text-text hover:bg-surface'
        }`}
      >
        全部文章
      </button>

      {learningCategories.map((category) => (
        <div key={category.name} className="mb-1">
          <button
            onClick={() => toggleCategory(category.name)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-text-secondary hover:text-text hover:bg-surface transition-all"
          >
            <span className="flex items-center gap-2">
              <span>{category.icon}</span>
              {category.name}
            </span>
            {expandedCategories.includes(category.name) ? (
              <ChevronDown size={14} />
            ) : (
              <ChevronRight size={14} />
            )}
          </button>

          <AnimatePresence>
            {expandedCategories.includes(category.name) && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <button
                  onClick={() => {
                    setSelectedCategory(category.name)
                    setSelectedSeries(null)
                  }}
                  className={`w-full text-left pl-9 pr-3 py-1.5 text-xs transition-all ${
                    selectedCategory === category.name && !selectedSeries
                      ? 'text-primary'
                      : 'text-text-muted hover:text-text-secondary'
                  }`}
                >
                  全部 {category.name}
                </button>

                {category.series.map((series) => (
                  <button
                    key={series.name}
                    onClick={() => {
                      setSelectedCategory(category.name)
                      setSelectedSeries(series.name)
                    }}
                    className={`w-full text-left pl-9 pr-3 py-1.5 text-xs transition-all flex items-center justify-between ${
                      selectedSeries === series.name
                        ? 'text-primary'
                        : 'text-text-muted hover:text-text-secondary'
                    }`}
                  >
                    <span>{series.name}</span>
                    <span className="text-text-dim">{series.articles.length}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  )

  // TOC Sidebar JSX
  const tocSidebarJSX = (isSticky: boolean) => {
    if (headings.length === 0) return null
    
    return (
      <div className={`glass-card p-5 ${isSticky ? 'sticky top-24' : ''}`}>
        <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-4 flex items-center gap-2">
          <Hash size={14} />
          目录索引
        </h3>
        <nav className="space-y-1 max-h-[calc(100vh-200px)] overflow-y-auto">
          {headings.map((heading) => (
            <button
              key={heading.id}
              onClick={() => scrollToHeading(heading.id)}
              className={`w-full text-left text-sm transition-all py-1.5 rounded-md ${
                heading.level === 3 ? 'pl-4' : 'pl-2'
              } ${
                activeHeading === heading.id
                  ? 'text-primary bg-primary/10 font-medium'
                  : 'text-text-muted hover:text-text hover:bg-surface'
              }`}
            >
              {heading.text}
            </button>
          ))}
        </nav>
      </div>
    )
  }

  // Article Detail View (Three Column Layout)
  if (selectedArticle) {
    return (
      <PageTransition>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
          {/* Mobile Header with Menu */}
          <div className="lg:hidden flex items-center justify-between mb-6">
            <button
              onClick={handleBackToList}
              className="flex items-center gap-2 text-sm text-text-muted hover:text-primary transition-colors"
            >
              <ArrowLeft size={16} />
              返回
            </button>
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface border border-border text-sm text-text-secondary"
            >
              {showMobileMenu ? <X size={16} /> : <Menu size={16} />}
              目录
            </button>
          </div>

          {/* Desktop Back Button */}
          <button
            onClick={handleBackToList}
            className="hidden lg:flex items-center gap-2 text-sm text-text-muted hover:text-primary mb-8 transition-colors"
          >
            <ArrowLeft size={16} />
            返回文章列表
          </button>

          {/* Mobile Menu Overlay */}
          <AnimatePresence>
            {showMobileMenu && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="lg:hidden mb-6"
              >
                {tocSidebarJSX(false)}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Three Column Layout */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Sidebar - Category Navigation */}
            <motion.aside
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="hidden lg:block w-56 flex-shrink-0"
            >
              {categorySidebarJSX(true)}
            </motion.aside>

            {/* Main Content */}
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex-1 min-w-0"
              ref={contentRef}
            >
              <div className="mb-8">
                <div className="flex flex-wrap items-center gap-3 mb-4 text-sm text-text-muted">
                  <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs">
                    {selectedArticle.categoryName}
                  </span>
                  <span className="text-text-dim">/</span>
                  <span>{selectedArticle.seriesName}</span>
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-text mb-4">
                  {selectedArticle.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-text-muted mb-4">
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    {selectedArticle.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    {selectedArticle.readTime}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedArticle.tags.map((tag) => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
              </div>

              <div className="article-content">
                {selectedArticle.content.split('\n\n').map((para, i) => {
                  if (para.startsWith('## ')) {
                    const text = para.replace('## ', '')
                    return <h2 key={i} id={`heading-${text}`}>{text}</h2>
                  }
                  if (para.startsWith('### ')) {
                    const text = para.replace('### ', '')
                    return <h3 key={i} id={`heading-${text}`}>{text}</h3>
                  }
                  return <p key={i}>{para}</p>
                })}
              </div>
            </motion.article>

            {/* Right Sidebar - Table of Contents */}
            <motion.aside
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="hidden lg:block w-56 flex-shrink-0"
            >
              {tocSidebarJSX(true)}
            </motion.aside>
          </div>
        </div>
      </PageTransition>
    )
  }

  // Skill Tree View
  if (viewMode === 'skilltree') {
    return (
      <PageTransition>
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
          {/* Header with View Switcher */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-text mb-2">学习空间</h1>
                <p className="text-text-muted">记录学习、分享知识、持续成长</p>
              </div>
              
              {/* View Mode Switcher */}
              <div className="flex items-center gap-1 p-1 rounded-xl bg-surface border border-border">
                <button
                  onClick={() => setViewMode('knowledge')}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all text-text-muted hover:text-text"
                >
                  <BookOpen size={16} />
                  <span className="hidden sm:inline">知识库</span>
                </button>
                <button
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all bg-primary/10 text-primary"
                >
                  <GitBranch size={16} />
                  <span className="hidden sm:inline">技能树</span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Skill Tree Content */}
          <SkillTreeView />
        </div>
      </PageTransition>
    )
  }

  // Article List View (Two Column Layout)
  return (
    <PageTransition>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
        {/* Header with View Switcher */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-text mb-2">学习空间</h1>
              <p className="text-text-muted">记录学习、分享知识、持续成长</p>
            </div>
            
            {/* View Mode Switcher */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-surface border border-border">
              <button
                onClick={() => setViewMode('knowledge')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  viewMode === 'knowledge'
                    ? 'bg-primary/10 text-primary'
                    : 'text-text-muted hover:text-text'
                }`}
              >
                <BookOpen size={16} />
                <span className="hidden sm:inline">知识库</span>
              </button>
              <button
                onClick={() => setViewMode('skilltree')}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all text-text-muted hover:text-text"
              >
                <GitBranch size={16} />
                <span className="hidden sm:inline">技能树</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="搜索文章标题或标签..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-surface border border-border text-text placeholder:text-text-muted focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
            />
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Category Tree */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="w-full lg:w-64 flex-shrink-0"
          >
            {categorySidebarJSX(true)}
          </motion.aside>

          {/* Main Content - Article List */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-text-muted">
                共 {filteredArticles.length} 篇文章
                {selectedCategory && ` · ${selectedCategory}`}
                {selectedSeries && ` · ${selectedSeries}`}
              </p>
            </div>

            <motion.div
              layout
              className="space-y-4"
            >
              <AnimatePresence mode="popLayout">
                {filteredArticles.map((article, index) => (
                  <motion.div
                    key={article.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    onClick={() => handleSelectArticle(article)}
                    className="glass-card p-5 cursor-pointer group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2 text-xs text-text-muted">
                          <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                            {article.categoryName}
                          </span>
                          <span>·</span>
                          <span>{article.seriesName}</span>
                        </div>
                        <h3 className="text-lg font-semibold text-text group-hover:text-primary transition-colors mb-2">
                          {article.title}
                        </h3>
                        <p className="text-sm text-text-muted line-clamp-2 mb-3">
                          {article.excerpt}
                        </p>
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="flex items-center gap-1 text-xs text-text-dim">
                            <Calendar size={12} />
                            {article.date}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-text-dim">
                            <Clock size={12} />
                            {article.readTime}
                          </span>
                          <div className="flex items-center gap-1">
                            <Tag size={12} className="text-text-dim" />
                            {article.tags.map((tag) => (
                              <span key={tag} className="text-xs text-text-dim">{tag}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <ChevronRight size={18} className="text-text-muted group-hover:text-primary transition-colors mt-1 flex-shrink-0" />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {filteredArticles.length === 0 && (
                <div className="text-center py-16">
                  <p className="text-text-muted">没有找到匹配的文章</p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
