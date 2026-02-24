import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { motion } from 'framer-motion'
import {
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Quote,
  Code,
  Link as LinkIcon,
  Image as ImageIcon,
  Undo,
  Redo,
  Eye,
  Edit3,
  X,
  Check,
  Type,
  Tag as TagIcon,
  Plus as PlusIcon,
  Upload
} from 'lucide-react'
import { useState, useCallback, useRef } from 'react'
import type { LucideIcon } from 'lucide-react'

interface ArticleEditorProps {
  initialContent?: string
  initialData?: {
    title: string
    content: string
    excerpt: string
    tags?: string[]
    coverImage?: string
  }
  onSave: (content: { title: string; content: string; excerpt: string; tags?: string[]; coverImage?: string }) => void
  onCancel: () => void
  mode?: 'create' | 'edit'
}

interface ToolbarButtonProps {
  onClick: () => void
  active?: boolean
  icon: LucideIcon
  title: string
}

function ToolbarButton({ onClick, active = false, icon: Icon, title }: ToolbarButtonProps) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`p-2 rounded-lg transition-all ${
        active
          ? 'bg-primary text-white'
          : 'text-text-secondary hover:text-text hover:bg-surface'
      }`}
    >
      <Icon size={18} />
    </button>
  )
}

export function ArticleEditor({ initialContent = '', initialData, onSave, onCancel, mode = 'create' }: ArticleEditorProps) {
  const [title, setTitle] = useState(initialData?.title || '')
  const [tags, setTags] = useState<string[]>(initialData?.tags || [])
  const [tagInput, setTagInput] = useState('')
  const [coverImage, setCoverImage] = useState(initialData?.coverImage || '')
  const [isPreview, setIsPreview] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [showLinkInput, setShowLinkInput] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder: '开始写作...',
      }),
    ],
    content: initialData?.content || initialContent,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base max-w-none focus:outline-none min-h-[300px] px-4 py-4',
      },
    },
  })

  const setLink = useCallback(() => {
    if (!editor) return
    
    if (linkUrl) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run()
      setLinkUrl('')
      setShowLinkInput(false)
    }
  }, [editor, linkUrl])

  const addImage = useCallback(() => {
    if (!editor) return
    const url = window.prompt('请输入图片URL:')
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }, [editor])

  const handleSave = () => {
    if (!editor || !title.trim()) return
    
    const content = editor.getHTML()
    const plainText = editor.getText()
    const excerpt = plainText.slice(0, 150) + (plainText.length > 150 ? '...' : '')
    
    onSave({
      title: title.trim(),
      content,
      excerpt,
      tags: tags.length > 0 ? tags : ['自定义'],
      coverImage: coverImage || undefined,
    })
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  if (!editor) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="glass-card overflow-hidden"
    >
      {/* Header */}
      <div className="border-b border-border/50 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-text flex items-center gap-2">
            <Type size={20} className="text-primary" />
            {mode === 'edit' ? '编辑文章' : '新建文章'}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPreview(!isPreview)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all ${
                isPreview
                  ? 'bg-primary/10 text-primary'
                  : 'text-text-secondary hover:text-text hover:bg-surface'
              }`}
            >
              {isPreview ? <Edit3 size={16} /> : <Eye size={16} />}
              {isPreview ? '编辑' : '预览'}
            </button>
            <button
              onClick={onCancel}
              className="p-2 rounded-lg text-text-muted hover:text-text hover:bg-surface transition-all"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Title Input */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="输入文章标题..."
          className="w-full text-xl sm:text-2xl font-bold bg-transparent border-none text-text placeholder:text-text-muted focus:outline-none"
        />

        {/* Tags Input */}
        <div className="mt-4">
          <div className="flex items-center gap-2 mb-2">
            <TagIcon size={14} className="text-text-muted" />
            <span className="text-sm text-text-muted">标签</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-primary/10 text-primary text-xs"
              >
                {tag}
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:text-rose transition-colors"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
            <div className="flex items-center gap-1">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                placeholder="添加标签..."
                className="px-2 py-1 rounded-lg bg-surface border border-border text-xs text-text placeholder:text-text-muted focus:outline-none focus:border-primary/50 w-24"
              />
              <button
                onClick={handleAddTag}
                disabled={!tagInput.trim()}
                className="p-1 rounded-lg bg-surface border border-border text-text-muted hover:text-primary hover:border-primary/50 transition-colors disabled:opacity-50"
              >
                <PlusIcon size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Cover Image Input */}
        <div className="mt-4">
          <div className="flex items-center gap-2 mb-2">
            <ImageIcon size={14} className="text-text-muted" />
            <span className="text-sm text-text-muted">封面图片</span>
          </div>
          
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) {
                const reader = new FileReader()
                reader.onload = (event) => {
                  setCoverImage(event.target?.result as string)
                }
                reader.readAsDataURL(file)
              }
            }}
          />
          
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="输入图片URL、上传本地文件或留空使用默认封面..."
              className="flex-1 px-3 py-2 rounded-lg bg-surface border border-border text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-primary/50"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface border border-border text-text-secondary hover:text-text hover:bg-surface/80 transition-colors text-sm whitespace-nowrap"
            >
              <Upload size={14} />
              上传
            </button>
            <button
              onClick={() => {
                const url = window.prompt('请输入图片URL:')
                if (url) setCoverImage(url)
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface border border-border text-text-secondary hover:text-text hover:bg-surface/80 transition-colors text-sm whitespace-nowrap"
            >
              <ImageIcon size={14} />
              URL
            </button>
          </div>
          {coverImage && (
            <div className="mt-2 relative">
              <img
                src={coverImage}
                alt="封面预览"
                className="w-full h-24 object-cover rounded-lg"
                onError={() => setCoverImage('')}
              />
              <button
                onClick={() => setCoverImage('')}
                className="absolute top-2 right-2 p-1 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Toolbar */}
      {!isPreview && (
        <div className="border-b border-border/50 p-2 flex flex-wrap items-center gap-1">
          <div className="flex items-center gap-1 pr-2 border-r border-border/50">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              active={editor.isActive('bold')}
              icon={Bold}
              title="粗体"
            />
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              active={editor.isActive('italic')}
              icon={Italic}
              title="斜体"
            />
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleStrike().run()}
              active={editor.isActive('strike')}
              icon={Strikethrough}
              title="删除线"
            />
          </div>

          <div className="flex items-center gap-1 px-2 border-r border-border/50">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              active={editor.isActive('heading', { level: 1 })}
              icon={Heading1}
              title="标题1"
            />
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              active={editor.isActive('heading', { level: 2 })}
              icon={Heading2}
              title="标题2"
            />
          </div>

          <div className="flex items-center gap-1 px-2 border-r border-border/50">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              active={editor.isActive('bulletList')}
              icon={List}
              title="无序列表"
            />
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              active={editor.isActive('orderedList')}
              icon={ListOrdered}
              title="有序列表"
            />
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              active={editor.isActive('blockquote')}
              icon={Quote}
              title="引用"
            />
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              active={editor.isActive('codeBlock')}
              icon={Code}
              title="代码块"
            />
          </div>

          <div className="flex items-center gap-1 px-2 border-r border-border/50">
            <div className="relative">
              <ToolbarButton
                onClick={() => setShowLinkInput(!showLinkInput)}
                active={editor.isActive('link')}
                icon={LinkIcon}
                title="链接"
              />
              {showLinkInput && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full left-0 mt-2 p-2 glass-card z-50 min-w-[200px]"
                >
                  <input
                    type="text"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-1.5 rounded-lg bg-surface border border-border text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-primary mb-2"
                    onKeyDown={(e) => e.key === 'Enter' && setLink()}
                  />
                  <div className="flex items-center gap-2">
                    <button
                      onClick={setLink}
                      className="flex-1 py-1.5 rounded-lg bg-primary text-white text-xs font-medium hover:bg-primary-dim transition-colors"
                    >
                      确定
                    </button>
                    <button
                      onClick={() => {
                        setShowLinkInput(false)
                        setLinkUrl('')
                      }}
                      className="flex-1 py-1.5 rounded-lg text-text-muted text-xs hover:text-text transition-colors"
                    >
                      取消
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
            <ToolbarButton
              onClick={addImage}
              icon={ImageIcon}
              title="图片"
            />
          </div>

          <div className="flex items-center gap-1 pl-2">
            <ToolbarButton
              onClick={() => editor.chain().focus().undo().run()}
              icon={Undo}
              title="撤销"
            />
            <ToolbarButton
              onClick={() => editor.chain().focus().redo().run()}
              icon={Redo}
              title="重做"
            />
          </div>
        </div>
      )}

      {/* Editor Content */}
      <div className="relative">
        {isPreview ? (
          <div
            className="prose prose-sm sm:prose-base max-w-none px-4 py-4 min-h-[300px] text-text"
            dangerouslySetInnerHTML={{ __html: editor.getHTML() }}
          />
        ) : (
          <EditorContent editor={editor} />
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-border/50 p-4 flex items-center justify-between">
        <div className="text-xs text-text-muted">
          {editor.getText().length} 字符
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-text-secondary hover:text-text transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            disabled={!title.trim() || !editor.getText().trim()}
            className="flex items-center gap-2 px-6 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary-dim disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Check size={18} />
            保存文章
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default ArticleEditor
