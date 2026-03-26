import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, Edit3, Eye, FileText, Download, Home
} from 'lucide-react'
import { useTheme } from '../../../hooks/useTheme'
import { useResume } from './useResume'
import { ResumePreview } from './ResumePreview'
import { ResumeEditor } from './ResumeEditor'


interface OnlineResumeProps {
  isOpen: boolean
  onClose: () => void
}

export function OnlineResume({ isOpen, onClose }: OnlineResumeProps) {
  const { themeConfig } = useTheme()
  const { 
    resumeData, 
    isLoading, 
    updateResumeData, 
    undo, 
    redo, 
    canUndo, 
    canRedo,
    resetToDefault,
    exportData,
    importData
  } = useResume()
  const [mode, setMode] = useState<'preview' | 'edit'>('preview')
  const [showImportModal, setShowImportModal] = useState(false)
  const [importError, setImportError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    try {
      await importData(file)
      setShowImportModal(false)
      setImportError('')
    } catch {
      setImportError('导入失败，请检查文件格式')
    }
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleExportPDF = () => {
    // Trigger print dialog for PDF export
    window.print()
  }

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex items-center justify-center py-20"
      >
        <div style={{ color: themeConfig.colors.textMuted }}>加载中...</div>
      </motion.div>
    )
  }

  return (
    <AnimatePresence mode="sync">
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="flex flex-col min-h-screen"
          style={{ background: themeConfig.colors.bg }}
        >
          {/* Header */}
          <div 
            className="flex items-center justify-between px-4 sm:px-6 py-4 border-b"
            style={{ 
              borderColor: themeConfig.colors.border,
              background: themeConfig.colors.surface
            }}
          >
            <div className="flex items-center gap-3">
              {/* 主页/简历切换按钮 - 放在左侧 */}
              <div 
                className="flex items-center rounded-lg p-1"
                style={{ background: themeConfig.colors.bg }}
              >
                <button
                  onClick={onClose}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all"
                  style={{ 
                    color: themeConfig.colors.textMuted,
                  }}
                >
                  <Home size={16} />
                  <span className="hidden sm:inline">主页</span>
                </button>
                <button
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all text-white"
                  style={{ background: themeConfig.colors.primary }}
                >
                  <FileText size={16} />
                  <span className="hidden sm:inline">简历</span>
                </button>
              </div>

              <div>
                <h2 className="text-lg font-bold" style={{ color: themeConfig.colors.text }}>
                  在线简历
                </h2>
                <p className="text-xs" style={{ color: themeConfig.colors.textMuted }}>
                  {mode === 'preview' ? '预览模式' : '编辑模式'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Mode Toggle */}
              <div 
                className="flex items-center rounded-lg p-1"
                style={{ background: themeConfig.colors.bg }}
              >
                <button
                  onClick={() => setMode('preview')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    mode === 'preview' 
                      ? 'text-white' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  style={mode === 'preview' ? { background: themeConfig.colors.primary } : {}}
                >
                  <Eye size={16} />
                  <span className="hidden sm:inline">预览</span>
                </button>
                <button
                  onClick={() => setMode('edit')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    mode === 'edit' 
                      ? 'text-white' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  style={mode === 'edit' ? { background: themeConfig.colors.primary } : {}}
                >
                  <Edit3 size={16} />
                  <span className="hidden sm:inline">编辑</span>
                </button>
              </div>

              {/* Actions */}
              {mode === 'preview' && (
                <>
                  <button
                    onClick={handleExportPDF}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    title="导出PDF"
                  >
                    <Download size={18} style={{ color: themeConfig.colors.textMuted }} />
                  </button>
                </>
              )}
              
              <button
                onClick={onClose}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors text-sm font-medium"
                style={{ 
                  background: themeConfig.colors.bg,
                  color: themeConfig.colors.textMuted
                }}
                title="返回个人主页"
              >
                <X size={18} />
                <span className="hidden sm:inline">关闭</span>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden">
            {mode === 'preview' ? (
              <div className="h-full overflow-y-auto">
                <ResumePreview data={resumeData} themeConfig={themeConfig} />
              </div>
            ) : (
              <ResumeEditor
                data={resumeData}
                themeConfig={themeConfig}
                onUpdate={updateResumeData}
                onUndo={undo}
                onRedo={redo}
                canUndo={canUndo}
                canRedo={canRedo}
                onExport={exportData}
                onImport={importData}
                onReset={resetToDefault}
                onShare={() => `${window.location.origin}/resume/share`}
              />
            )}
          </div>

          {/* Import Modal */}
          {showImportModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl p-6 max-w-md w-full"
              >
                <h3 className="text-lg font-semibold mb-4">导入简历数据</h3>
                <p className="text-sm text-gray-600 mb-4">
                  选择之前导出的 JSON 文件进行导入
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="w-full mb-4"
                />
                {importError && (
                  <p className="text-sm text-red-500 mb-4">{importError}</p>
                )}
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setShowImportModal(false)
                      setImportError('')
                    }}
                    className="px-4 py-2 text-sm rounded-lg border hover:bg-gray-50"
                  >
                    取消
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
