import { useState, useEffect, useRef, useCallback, useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Calendar, Clock, ChevronDown, ChevronRight, ArrowLeft, Hash, Menu, X, BookOpen, GitBranch, Plus, Upload, Edit2, Trash2 } from 'lucide-react'
import PageTransition from '../components/ui/PageTransition'
import SkillTreeView from '../components/ui/SkillTreeView'
import ArticleEditor from '../components/learning/ArticleEditor'
import DocumentImport from '../components/learning/DocumentImport'
import { AIAssistant } from '../components/learning/AIAssistant'
import { AIChatSidebar } from '../components/learning/AIChatSidebar'
import { ResizableDivider } from '../components/learning/ResizableDivider'
import { OnlineResume } from '../components/learning/resume'
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
type EditorMode = 'none' | 'create' | 'edit' | 'import'

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
  const [editorMode, setEditorMode] = useState<EditorMode>('none')
  const [customArticles, setCustomArticles] = useState<ArticleWithMeta[]>([])
  const [editingArticle, setEditingArticle] = useState<ArticleWithMeta | null>(null)
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false)
  const [showResume, setShowResume] = useState(false)
  const [aiSidebarOpen, setAiSidebarOpen] = useState(true)
  const [aiSidebarWidth, setAiSidebarWidth] = useState(380)
  const contentRef = useRef<HTMLDivElement>(null)
  const location = useLocation()

  // Scroll to top when entering the page - useLayoutEffect to prevent flash
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [location.pathname])

  // Additional scroll to top on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'instant' })
    }, 0)
    return () => clearTimeout(timer)
  }, [])

  // Minimum and maximum width for AI sidebar
  const MIN_SIDEBAR_WIDTH = 320
  const MAX_SIDEBAR_WIDTH = 600

  // Handle sidebar resize
  const handleSidebarResize = useCallback((delta: number) => {
    setAiSidebarWidth(prev => {
      const newWidth = prev + delta
      return Math.max(MIN_SIDEBAR_WIDTH, Math.min(MAX_SIDEBAR_WIDTH, newWidth))
    })
  }, [])

  const toggleCategory = (name: string) => {
    setExpandedCategories((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]
    )
  }

  // Get all articles flat (including custom articles)
  const allArticles: ArticleWithMeta[] = [
    ...learningCategories.flatMap((cat) =>
      cat.series.flatMap((series) =>
        series.articles.map((article) => ({
          ...article,
          categoryName: cat.name,
          seriesName: series.name,
        }))
      )
    ),
    ...customArticles
  ]

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
    // Auto-show mobile menu (TOC) on mobile devices when article has headings
    const hasHeadings = article.content.includes('## ')
    setShowMobileMenu(hasHeadings)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Handle back to list
  const handleBackToList = () => {
    setSelectedArticle(null)
    setHeadings([])
    setActiveHeading('')
    setShowMobileMenu(false)
  }

  // Handle article creation
  const handleCreateArticle = (data: { title: string; content: string; excerpt: string; tags?: string[]; coverImage?: string }) => {
    const newArticle: ArticleWithMeta = {
      id: `custom-${Date.now()}`,
      title: data.title,
      excerpt: data.excerpt,
      content: data.content,
      date: new Date().toISOString().split('T')[0],
      tags: data.tags || ['自定义'],
      readTime: `${Math.ceil(data.content.length / 500)} 分钟`,
      categoryName: selectedCategory || '前端开发',
      seriesName: selectedSeries || '自定义文章',
      coverImage: data.coverImage,
    }
    setCustomArticles(prev => [newArticle, ...prev])
    setEditorMode('none')
  }

  // Handle article update
  const handleUpdateArticle = (data: { title: string; content: string; excerpt: string; tags?: string[]; coverImage?: string }) => {
    if (!editingArticle) return
    
    const updatedArticle: ArticleWithMeta = {
      ...editingArticle,
      title: data.title,
      excerpt: data.excerpt,
      content: data.content,
      tags: data.tags || editingArticle.tags,
      readTime: `${Math.ceil(data.content.length / 500)} 分钟`,
      coverImage: data.coverImage,
    }
    
    // Update in customArticles if it's a custom article
    if (editingArticle.id.startsWith('custom-') || editingArticle.id.startsWith('imported-')) {
      setCustomArticles(prev => prev.map(article => 
        article.id === editingArticle.id ? updatedArticle : article
      ))
    }
    
    // Update selected article
    setSelectedArticle(updatedArticle)
    setEditingArticle(null)
    setEditorMode('none')
  }

  // Handle article delete
  const handleDeleteArticle = () => {
    if (!selectedArticle) return
    
    if (confirm('确定要删除这篇文章吗？此操作不可恢复。')) {
      // Remove from customArticles if it's a custom article
      if (selectedArticle.id.startsWith('custom-') || selectedArticle.id.startsWith('imported-')) {
        setCustomArticles(prev => prev.filter(article => article.id !== selectedArticle.id))
      }
      
      // Return to list
      handleBackToList()
    }
  }

  // Handle edit button click
  const handleEditClick = () => {
    if (!selectedArticle) return
    setEditingArticle(selectedArticle)
    setEditorMode('edit')
  }

  // Handle document import
  const handleImportDocuments = (articles: Array<{ title: string; content: string; excerpt: string; tags: string[] }>) => {
    const newArticles: ArticleWithMeta[] = articles.map((article, index) => ({
      id: `imported-${Date.now()}-${index}`,
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      date: new Date().toISOString().split('T')[0],
      tags: article.tags.length > 0 ? article.tags : ['导入'],
      readTime: `${Math.ceil(article.content.length / 500)} 分钟`,
      categoryName: selectedCategory || '前端开发',
      seriesName: selectedSeries || '导入文档',
    }))
    setCustomArticles(prev => [...newArticles, ...prev])
    setEditorMode('none')
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

      <div className="border-t border-border my-3" />

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
      <div className={`glass-card p-5 pointer-events-auto ${isSticky ? 'sticky top-24' : ''}`}>
        <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-4 flex items-center gap-2">
          <Hash size={14} />
          目录索引
        </h3>
        <nav className="space-y-1 max-h-[calc(100vh-200px)] overflow-y-auto">
          {headings.map((heading) => (
            <button
              key={heading.id}
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                scrollToHeading(heading.id)
              }}
              className={`w-full text-left text-sm transition-all py-1.5 rounded-md pointer-events-auto ${
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

  // Editor Modal Component
  const editorModal = (
    <AnimatePresence>
      {editorMode === 'create' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setEditorMode('none')}
        >
          <div className="w-full max-w-4xl max-h-[90vh] overflow-auto" onClick={e => e.stopPropagation()}>
            <ArticleEditor
              onSave={handleCreateArticle}
              onCancel={() => setEditorMode('none')}
            />
          </div>
        </motion.div>
      )}

      {editorMode === 'import' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setEditorMode('none')}
        >
          <div className="w-full max-w-2xl max-h-[90vh] overflow-auto" onClick={e => e.stopPropagation()}>
            <DocumentImport
              onImport={handleImportDocuments}
              onCancel={() => setEditorMode('none')}
            />
          </div>
        </motion.div>
      )}

      {editorMode === 'edit' && editingArticle && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setEditorMode('none')}
        >
          <div className="w-full max-w-4xl max-h-[90vh] overflow-auto" onClick={e => e.stopPropagation()}>
            <ArticleEditor
              mode="edit"
              initialData={{
                title: editingArticle.title,
                content: editingArticle.content,
                excerpt: editingArticle.excerpt,
                tags: editingArticle.tags,
              }}
              onSave={handleUpdateArticle}
              onCancel={() => {
                setEditorMode('none')
                setEditingArticle(null)
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  // Article Detail View (Three Column Layout with TOC + AI Sidebar)
  if (selectedArticle) {
    return (
      <PageTransition>
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 py-8">
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

          {/* Three Column Layout: TOC | Article | AI Sidebar */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Sidebar - Table of Contents (Desktop Only) */}
            {headings.length > 0 && (
              <aside className="hidden lg:block w-56 flex-shrink-0">
                {tocSidebarJSX(true)}
              </aside>
            )}

            {/* Main Content */}
            <article
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
                  <div className="flex items-center gap-2 ml-auto">
                    <button
                      onClick={handleEditClick}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-xs font-medium"
                    >
                      <Edit2 size={14} />
                      编辑
                    </button>
                    <button
                      onClick={handleDeleteArticle}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose/10 text-rose hover:bg-rose/20 transition-colors text-xs font-medium"
                    >
                      <Trash2 size={14} />
                      删除
                    </button>
                  </div>
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
            </article>

            {/* Right Sidebar - AI Chat (Desktop Only, Default Open) */}
            <aside className="hidden xl:flex flex-shrink-0 h-[calc(100vh-200px)] sticky top-24">
              <>
                <ResizableDivider 
                  onResize={handleSidebarResize}
                />
                <AIChatSidebar
                  currentArticle={selectedArticle}
                  isOpen={true}
                  onToggle={() => {}}
                  width={aiSidebarWidth}
                />
              </>
            </aside>
          </div>
        </div>
        {editorModal}
        
        {/* Mobile AI Assistant */}
        <div className="xl:hidden">
          <AIAssistant 
            currentArticle={selectedArticle}
            isOpen={aiAssistantOpen}
            onToggle={() => setAiAssistantOpen(prev => !prev)}
          />
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
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-text mb-2">学习空间</h1>
                <p className="text-text-muted">记录学习、分享知识、持续成长</p>
              </div>
              
              {/* View Mode Switcher */}
              <div className="flex items-center gap-1 p-1 rounded-xl bg-surface border border-border">
                <button
                  onClick={() => setViewMode('knowledge')}
                  className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all text-text-muted hover:text-text"
                >
                  <BookOpen size={16} />
                  <span>知识库</span>
                </button>
                <button
                  onClick={() => setViewMode('skilltree')}
                  className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all bg-primary/10 text-primary"
                >
                  <GitBranch size={16} />
                  <span>技能树</span>
                </button>
              </div>
            </div>
          </div>

          {/* Skill Tree Content */}
          <SkillTreeView />
        </div>
        
        {/* Online Resume - Available in skill tree view too */}
        <OnlineResume 
          isOpen={showResume}
          onClose={() => setShowResume(false)}
        />

      </PageTransition>
    )
  }

  // Article List View (Three Column Layout for Desktop)
  return (
    <PageTransition>
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 py-8">
        {/* Header with View Switcher */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-text mb-2">学习空间</h1>
              <p className="text-text-muted">记录学习、分享知识、持续成长</p>
            </div>
            
            {/* View Mode Switcher */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-surface border border-border">
              <button
                onClick={() => setViewMode('knowledge')}
                className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  viewMode === 'knowledge'
                    ? 'bg-primary/10 text-primary'
                    : 'text-text-muted hover:text-text'
                }`}
              >
                <BookOpen size={16} />
                <span>知识库</span>
              </button>
              <button
                onClick={() => setViewMode('skilltree' as ViewMode)}
                className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  (viewMode as string) === 'skilltree'
                    ? 'bg-primary/10 text-primary'
                    : 'text-text-muted hover:text-text'
                }`}
              >
                <GitBranch size={16} />
                <span>技能树</span>
              </button>
  
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <button
            onClick={() => setEditorMode('create')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-dim transition-all shadow-lg shadow-primary/20"
          >
            <Plus size={18} />
            新建文章
          </button>
          <button
            onClick={() => setEditorMode('import')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface border border-border text-text text-sm font-medium hover:bg-surface/80 transition-all"
          >
            <Upload size={18} />
            导入文档
          </button>
        </div>

        {/* Search */}
        <div className="mb-8">
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
        </div>

        {/* Three Column Layout Container */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar - Category Tree */}
          <aside className="w-full lg:w-56 flex-shrink-0">
            {categorySidebarJSX(true)}
          </aside>

          {/* Middle - Article List */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-text-muted">
                共 {filteredArticles.length} 篇文章
                {selectedCategory && ` · ${selectedCategory}`}
                {selectedSeries && ` · ${selectedSeries}`}
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredArticles.map((article) => (
                <div
                  key={article.id}
                  onClick={() => handleSelectArticle(article)}
                  className="glass-card overflow-hidden cursor-pointer group transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
                >
                    {/* Card Header - Cover Image or Gradient Background */}
                    <div className="h-28 sm:h-36 relative overflow-hidden bg-surface">
                      {article.coverImage ? (
                        <img
                          src={article.coverImage}
                          alt={article.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 flex items-center justify-center">
                          <BookOpen size={36} className="text-primary/30 group-hover:text-primary/50 group-hover:scale-110 transition-all duration-300" />
                        </div>
                      )}
                    </div>
                    
                    {/* Card Content */}
                    <div className="p-3 sm:p-4">
                      {/* Series Name */}
                      <div className="text-[10px] sm:text-xs text-text-muted mb-1.5 truncate">
                        {article.seriesName}
                      </div>
                      
                      {/* Title */}
                      <h3 className="text-sm sm:text-base font-semibold text-text group-hover:text-primary transition-colors mb-2 line-clamp-2 leading-tight">
                        {article.title}
                      </h3>
                      
                      {/* Excerpt */}
                      <p className="text-[11px] sm:text-xs text-text-muted line-clamp-2 mb-3 leading-relaxed">
                        {article.excerpt}
                      </p>
                      
                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {article.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-surface text-text-dim">
                            #{tag}
                          </span>
                        ))}
                        {article.tags.length > 3 && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface text-text-dim">
                            +{article.tags.length - 3}
                          </span>
                        )}
                      </div>
                      
                      {/* Footer Info */}
                      <div className="flex items-center justify-between text-[10px] sm:text-xs text-text-dim pt-2 border-t border-border/50">
                        <span className="flex items-center gap-1">
                          <Calendar size={11} />
                          {article.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={11} />
                          {article.readTime}
                        </span>
                      </div>
                    </div>
                </div>
              ))}

              {filteredArticles.length === 0 && (
                <div className="text-center py-16 col-span-full">
                  <p className="text-text-muted">没有找到匹配的文章</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar - AI Chat (Desktop Only) */}
          <aside className="hidden xl:flex flex-shrink-0 h-[calc(100vh-200px)] sticky top-24">
            {aiSidebarOpen && (
              <>
                <ResizableDivider 
                  onResize={handleSidebarResize}
                />
                <AIChatSidebar
                  currentArticle={selectedArticle}
                  isOpen={aiSidebarOpen}
                  onToggle={() => setAiSidebarOpen(false)}
                  width={aiSidebarWidth}
                />
              </>
            )}
          </aside>
        </div>

        {editorModal}
        
        {/* AI Assistant - Floating Button (Mobile & Tablet) */}
        <div className="xl:hidden">
          <AIAssistant 
            currentArticle={selectedArticle}
            isOpen={aiAssistantOpen}
            onToggle={() => setAiAssistantOpen(prev => !prev)}
          />
        </div>

        {/* AI Sidebar Toggle Button (Desktop - when sidebar is closed) */}
        {(!aiSidebarOpen) && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setAiSidebarOpen(true)}
            className="hidden xl:flex fixed bottom-6 right-6 z-[100] w-14 h-14 rounded-full items-center justify-center shadow-lg"
            style={{
              background: `linear-gradient(135deg, var(--color-primary), var(--color-primary-glow))`,
              boxShadow: `0 4px 20px var(--color-primary-muted)`,
            }}
          >
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </motion.button>
        )}
        
        {/* Online Resume */}
        <OnlineResume 
          isOpen={showResume}
          onClose={() => setShowResume(false)}
        />

      </div>
    </PageTransition>
  )
}
