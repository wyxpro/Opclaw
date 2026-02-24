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
  Type
} from 'lucide-react'
import { useState, useCallback } from 'react'

interface ArticleEditorProps {
  initialContent?: string
  onSave: (content: { title: string; content: string; excerpt: string }) => void
  onCancel: () => void
}

interface ToolbarButtonProps {
  onClick: () => void
  active?: boolean
  icon: React.ElementType
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

export function ArticleEditor({ initialContent = '', onSave, onCancel }: ArticleEditorProps) {
  const [title, setTitle] = useState('')
  const [isPreview, setIsPreview] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [showLinkInput, setShowLinkInput] = useState(false)

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
    content: initialContent,
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
    })
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
            新建文章
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
