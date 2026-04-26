import React, { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Edit3, Check, X, Upload, Link as LinkIcon, Hash } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'

interface EditableWrapperProps {
  value: string | number
  onSave: (newValue: string | number) => void
  type?: 'text' | 'textarea' | 'number' | 'image' | 'link' | 'percentage'
  isEditMode: boolean
  children: React.ReactNode
  label?: string
  className?: string
  position?: 'center' | 'top-right' | 'bottom-right' | 'top-left' | 'bottom-left'
}

export function EditableWrapper({
  value,
  onSave,
  type = 'text',
  isEditMode,
  children,
  label,
  className = '',
  position = 'center'
}: EditableWrapperProps) {
  const { themeConfig } = useTheme()
  const [isEditing, setIsEditing] = useState(false)
  const [tempValue, setTempValue] = useState(value)
  const [isHovered, setIsHovered] = useState(false)
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const [coords, setCoords] = useState<{ x: number; y: number } | null>(null)

  useEffect(() => {
    setTempValue(value)
  }, [value])

  useEffect(() => {
    if (isEditing && type !== 'image') {
      inputRef.current?.focus()
    }
  }, [isEditing, type])

  // Track position for the portal
  useEffect(() => {
    if (!isEditing) {
      setCoords(null)
      return
    }

    const updateCoords = () => {
      if (wrapperRef.current) {
        const rect = wrapperRef.current.getBoundingClientRect()
        setCoords({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2
        })
      }
    }

    updateCoords()
    window.addEventListener('resize', updateCoords)
    window.addEventListener('scroll', updateCoords, true)
    
    return () => {
      window.removeEventListener('resize', updateCoords)
      window.removeEventListener('scroll', updateCoords, true)
    }
  }, [isEditing])

  const handleSave = () => {
    if (type === 'number') {
      onSave(Number(tempValue))
    } else {
      onSave(tempValue)
    }
    setIsEditing(false)
  }

  const handleCancel = () => {
    setTempValue(value)
    setIsEditing(false)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        onSave(reader.result as string)
        setIsEditing(false)
      }
      reader.readAsDataURL(file)
    }
  }

  if (!isEditMode) return <div className={className}>{children}</div>

  return (
    <div 
      ref={wrapperRef}
      className={`relative group ${className} ${isEditing ? 'z-[9999]' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 原始内容 */}
      <div className={`${isEditing ? 'opacity-30 blur-sm' : 'group-hover:opacity-60 transition-all cursor-pointer'} transition-all duration-300`}>
        {children}
      </div>

      {/* 悬浮编辑图标 (移动端点击直接触发) */}
      {!isEditing && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: (isHovered || isEditing || 'ontouchstart' in window) ? 1 : 0 }}
          onPointerDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (type === 'image') {
              fileInputRef.current?.click()
            } else {
              setIsEditing(true)
            }
          }}
          className={`absolute z-30 p-2.5 rounded-full shadow-lg border backdrop-blur-md transition-all cursor-pointer ${
            position === 'top-right' ? 'top-0 right-0 -translate-y-1/2 translate-x-1/2 scale-75' :
            position === 'bottom-right' ? 'bottom-0 right-0 translate-y-1/2 translate-x-1/2 scale-75' :
            position === 'top-left' ? 'top-0 left-0 -translate-y-1/2 -translate-x-1/2 scale-75' :
            position === 'bottom-left' ? 'bottom-0 left-0 translate-y-1/2 -translate-x-1/2 scale-75' :
            'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
          }`}
          style={{ 
            background: themeConfig.colors.primary,
            borderColor: themeConfig.colors.border,
            color: '#fff'
          }}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
        >
          {type === 'image' ? <Upload size={18} /> : <Edit3 size={18} />}
        </motion.button>
      )}

      {/* 编辑界面 - 采用 React Portal 完全脱离文档流，杜绝 z-index 遮挡和事件阻断 */}
      {createPortal(
        <AnimatePresence>
          {isEditing && coords && (
            <div className="fixed inset-0 z-[999999] pointer-events-none">
              {/* 背景透明遮罩 */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 pointer-events-auto"
                onPointerDown={(e) => {
                  e.stopPropagation();
                  handleCancel();
                }}
              />
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                className="absolute flex flex-col items-center justify-center p-4 rounded-2xl shadow-2xl border pointer-events-auto"
                onPointerDown={(e) => e.stopPropagation()} // 阻止在弹窗内点击触发关闭
                style={{ 
                  left: coords.x,
                  top: coords.y,
                  transform: 'translate(-50%, -50%)',
                  minWidth: '200px',
                  background: themeConfig.colors.surface,
                  borderColor: themeConfig.colors.primary,
                  boxShadow: `0 20px 40px rgba(0,0,0,0.3)`
                }}
              >
                {label && (
                  <label 
                    className="text-[10px] uppercase tracking-wider font-bold mb-2 block"
                    style={{ color: themeConfig.colors.primary }}
                  >
                    {label}
                  </label>
                )}

                <div className="w-full mb-3">
                  {(type === 'text' || type === 'number') && (
                    <input
                      ref={inputRef as React.RefObject<HTMLInputElement>}
                      type={type === 'number' ? 'number' : 'text'}
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      className="w-full bg-transparent border-b-2 text-center outline-none py-1 font-bold text-base"
                      style={{ 
                        borderColor: themeConfig.colors.primary,
                        color: themeConfig.colors.text 
                      }}
                      onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                    />
                  )}

                  {type === 'textarea' && (
                    <textarea
                      ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                      value={tempValue as string}
                      onChange={(e) => setTempValue(e.target.value)}
                      className="w-full bg-transparent border rounded-lg p-2 text-sm outline-none min-h-[80px]"
                      style={{ 
                        borderColor: `${themeConfig.colors.primary}40`,
                        color: themeConfig.colors.text 
                      }}
                    />
                  )}

                  {type === 'percentage' && (
                    <div className="flex flex-col items-center gap-2 w-full">
                      <input
                        ref={inputRef as React.RefObject<HTMLInputElement>}
                        type="range"
                        min="0"
                        max="100"
                        value={tempValue as number}
                        onChange={(e) => setTempValue(parseInt(e.target.value))}
                        className="w-full accent-primary"
                      />
                      <span className="font-bold text-center" style={{ color: themeConfig.colors.text }}>
                        {tempValue}%
                      </span>
                    </div>
                  )}

                  {type === 'link' && (
                    <div className="flex items-center gap-2 w-full">
                      <LinkIcon size={14} style={{ color: themeConfig.colors.primary }} />
                      <input
                        ref={inputRef as React.RefObject<HTMLInputElement>}
                        type="text"
                        value={tempValue as string}
                        onChange={(e) => setTempValue(e.target.value)}
                        placeholder="https://..."
                        className="flex-1 bg-transparent border-b text-xs outline-none"
                        style={{ 
                          borderColor: themeConfig.colors.primary,
                          color: themeConfig.colors.text 
                      }}
                      onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                    />
                  </div>
                )}
              </div>

              <div 
                className="flex gap-4 p-1"
              >
                <button
                  type="button"
                  onPointerDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleSave();
                  }}
                  className="w-10 h-10 rounded-full hover:brightness-110 transition-all shadow-md flex items-center justify-center cursor-pointer"
                  style={{ 
                    background: themeConfig.colors.primary,
                    color: '#fff' 
                  }}
                  title="保存 (Enter)"
                >
                  <Check size={20} strokeWidth={3} />
                </button>
                <button
                  type="button"
                  onPointerDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleCancel();
                  }}
                  className="w-10 h-10 rounded-full hover:brightness-110 transition-all shadow-md flex items-center justify-center cursor-pointer"
                  style={{ 
                    background: '#f43f5e',
                    color: '#fff' 
                  }}
                  title="取消 (Esc)"
                >
                  <X size={20} strokeWidth={3} />
                </button>
              </div>
            </motion.div>
          </div>
          )}
        </AnimatePresence>,
        document.body
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
      />
    </div>
  )
}

