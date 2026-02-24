import { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, FileText, X, Check, AlertCircle } from 'lucide-react'

interface DocumentImportProps {
  onImport: (articles: Array<{
    title: string
    content: string
    excerpt: string
    tags: string[]
  }>) => void
  onCancel: () => void
}

interface ParsedDocument {
  id: string
  title: string
  content: string
  excerpt: string
  tags: string[]
  status: 'pending' | 'parsing' | 'success' | 'error'
  error?: string
}

export function DocumentImport({ onImport, onCancel }: DocumentImportProps) {
  const [files, setFiles] = useState<ParsedDocument[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('前端开发')
  const idCounter = useRef(0)

  const supportedFormats = ['.txt', '.md', '.doc', '.docx', '.pdf']

  const parseDocument = async (file: File): Promise<ParsedDocument> => {
    idCounter.current += 1
    const id = `${idCounter.current}-${file.name}`
    
    try {
      const content = await readFileContent(file)
      const title = extractTitle(content, file.name)
      const excerpt = generateExcerpt(content)
      const tags = extractTags(content, file.name)

      return {
        id,
        title,
        content,
        excerpt,
        tags,
        status: 'success',
      }
    } catch (error) {
      return {
        id,
        title: file.name,
        content: '',
        excerpt: '',
        tags: [],
        status: 'error',
        error: error instanceof Error ? error.message : '解析失败',
      }
    }
  }

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        resolve(content || '')
      }
      reader.onerror = () => reject(new Error('读取文件失败'))
      
      // 对于文本文件直接读取
      if (file.type.includes('text') || file.name.endsWith('.md') || file.name.endsWith('.txt')) {
        reader.readAsText(file)
      } else {
        // 对于其他格式，返回文件名作为占位内容
        resolve(`[${file.name}]\n\n该文件格式需要后端解析支持。当前仅支持文本文件(.txt, .md)的直接导入。`)
      }
    })
  }

  const extractTitle = (content: string, filename: string): string => {
    // 尝试从内容中提取标题（第一行或第一个#标题）
    const lines = content.split('\n').filter(line => line.trim())
    
    for (const line of lines.slice(0, 5)) {
      const trimmed = line.trim()
      if (trimmed.startsWith('# ')) {
        return trimmed.replace('# ', '').trim()
      }
    }
    
    // 使用文件名（去掉扩展名）
    return filename.replace(/\.[^/.]+$/, '')
  }

  const generateExcerpt = (content: string): string => {
    const plainText = content
      .replace(/#+ /g, '')
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/`{3}[\s\S]*?`{3}/g, '[代码块]')
      .replace(/`([^`]+)`/g, '$1')
      .trim()
    
    return plainText.slice(0, 150) + (plainText.length > 150 ? '...' : '')
  }

  const extractTags = (content: string, filename: string): string[] => {
    const tags: string[] = []
    
    // 从文件名提取关键词
    const nameLower = filename.toLowerCase()
    const keywords: Record<string, string> = {
      'react': 'React',
      'vue': 'Vue',
      'angular': 'Angular',
      'typescript': 'TypeScript',
      'javascript': 'JavaScript',
      'css': 'CSS',
      'html': 'HTML',
      'node': 'Node.js',
      'python': 'Python',
      'java': 'Java',
      'go': 'Go',
      'rust': 'Rust',
      'docker': 'Docker',
      'k8s': 'Kubernetes',
      'aws': 'AWS',
      'git': 'Git',
    }
    
    Object.entries(keywords).forEach(([key, value]) => {
      if (nameLower.includes(key) || content.toLowerCase().includes(key)) {
        tags.push(value)
      }
    })
    
    // 限制标签数量
    return tags.slice(0, 5)
  }

  const handleFileSelect = useCallback(async (selectedFiles: FileList | null) => {
    if (!selectedFiles) return

    const newFiles: ParsedDocument[] = []
    
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i]
      const parsed = await parseDocument(file)
      newFiles.push(parsed)
    }
    
    setFiles(prev => [...prev, ...newFiles])
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileSelect(e.dataTransfer.files)
  }, [handleFileSelect])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id))
  }

  const handleImport = () => {
    const validFiles = files.filter(f => f.status === 'success')
    onImport(validFiles.map(f => ({
      title: f.title,
      content: f.content,
      excerpt: f.excerpt,
      tags: f.tags,
    })))
  }

  const successCount = files.filter(f => f.status === 'success').length
  const errorCount = files.filter(f => f.status === 'error').length

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="glass-card overflow-hidden"
    >
      {/* Header */}
      <div className="border-b border-border/50 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text flex items-center gap-2">
            <Upload size={20} className="text-primary" />
            导入文档
          </h2>
          <button
            onClick={onCancel}
            className="p-2 rounded-lg text-text-muted hover:text-text hover:bg-surface transition-all"
          >
            <X size={18} />
          </button>
        </div>
        <p className="text-sm text-text-muted mt-1">
          支持格式: {supportedFormats.join(', ')}
        </p>
      </div>

      {/* Drop Zone */}
      <div className="p-4">
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/50 hover:bg-surface/50'
          }`}
        >
          <Upload size={40} className="mx-auto text-text-muted mb-3" />
          <p className="text-text mb-2">拖拽文件到此处，或点击选择文件</p>
          <p className="text-xs text-text-muted mb-4">支持 TXT, MD, DOC, DOCX, PDF</p>
          <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium cursor-pointer hover:bg-primary-dim transition-colors">
            <FileText size={16} />
            选择文件
            <input
              type="file"
              multiple
              accept={supportedFormats.join(',')}
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
            />
          </label>
        </div>

        {/* Category Selection */}
        <div className="mt-4">
          <label className="text-sm text-text-muted mb-2 block">导入到分类</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-text focus:outline-none focus:border-primary"
          >
            <option value="前端开发">前端开发</option>
            <option value="后端技术">后端技术</option>
            <option value="AI 探索">AI 探索</option>
            <option value="设计思维">设计思维</option>
          </select>
        </div>

        {/* File List */}
        <AnimatePresence>
          {files.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 space-y-2"
            >
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-muted">
                  已选择 {files.length} 个文件
                  {successCount > 0 && ` · ${successCount} 个成功`}
                  {errorCount > 0 && ` · ${errorCount} 个失败`}
                </span>
              </div>

              <div className="max-h-60 overflow-y-auto space-y-2">
                {files.map((file) => (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className={`p-3 rounded-lg border ${
                      file.status === 'success'
                        ? 'bg-emerald/5 border-emerald/20'
                        : file.status === 'error'
                        ? 'bg-rose/5 border-rose/20'
                        : 'bg-surface border-border'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <FileText size={16} className="text-text-muted flex-shrink-0" />
                          <span className="font-medium text-text truncate">{file.title}</span>
                          {file.status === 'success' && (
                            <Check size={14} className="text-emerald flex-shrink-0" />
                          )}
                          {file.status === 'error' && (
                            <AlertCircle size={14} className="text-rose flex-shrink-0" />
                          )}
                        </div>
                        {file.status === 'success' && (
                          <p className="text-xs text-text-muted mt-1 line-clamp-1">
                            {file.excerpt}
                          </p>
                        )}
                        {file.status === 'error' && file.error && (
                          <p className="text-xs text-rose mt-1">{file.error}</p>
                        )}
                        {file.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {file.tags.map(tag => (
                              <span
                                key={tag}
                                className="px-2 py-0.5 rounded-full text-[10px] bg-primary/10 text-primary"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => removeFile(file.id)}
                        className="p-1 rounded text-text-muted hover:text-rose hover:bg-rose/10 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="border-t border-border/50 p-4 flex items-center justify-between">
        <button
          onClick={onCancel}
          className="px-4 py-2 rounded-lg text-text-secondary hover:text-text transition-colors"
        >
          取消
        </button>
        <button
          onClick={handleImport}
          disabled={successCount === 0}
          className="flex items-center gap-2 px-6 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary-dim disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <Check size={18} />
          导入 {successCount > 0 && `(${successCount})`}
        </button>
      </div>
    </motion.div>
  )
}

export default DocumentImport
