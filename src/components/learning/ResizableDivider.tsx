import { useState, useCallback, useEffect, useRef } from 'react'
import { useTheme } from '../../hooks/useTheme'

interface ResizableDividerProps {
  onResize: (delta: number) => void
  onResizeStart?: () => void
  onResizeEnd?: () => void
}

export function ResizableDivider({ onResize, onResizeStart, onResizeEnd }: ResizableDividerProps) {
  const { themeConfig } = useTheme()
  const [isDragging, setIsDragging] = useState(false)
  const startXRef = useRef<number>(0)

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    startXRef.current = e.clientX
    setIsDragging(true)
    onResizeStart?.()
    
    // Add global cursor style
    document.body.style.cursor = 'ew-resize'
    document.body.style.userSelect = 'none'
  }, [onResizeStart])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return
    
    const delta = startXRef.current - e.clientX
    startXRef.current = e.clientX
    onResize(delta)
  }, [isDragging, onResize])

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false)
      onResizeEnd?.()
      
      // Remove global cursor style
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [isDragging, onResizeEnd])

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
      
      return () => {
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  return (
    <div
      className={`relative flex-shrink-0 w-4 cursor-ew-resize group flex items-center justify-center transition-all duration-150 ${
        isDragging ? 'bg-primary/10' : 'hover:bg-primary/5'
      }`}
      onMouseDown={handleMouseDown}
      style={{
        backgroundColor: isDragging ? `${themeConfig.colors.primary}15` : undefined,
      }}
    >
      {/* Visual indicator */}
      <div 
        className={`w-1 h-12 rounded-full transition-all duration-150 ${
          isDragging 
            ? 'bg-primary scale-y-125' 
            : 'bg-border group-hover:bg-primary/50 group-hover:scale-y-110'
        }`}
        style={{
          backgroundColor: isDragging ? themeConfig.colors.primary : undefined,
        }}
      />
      
      {/* Tooltip on hover */}
      <div 
        className={`absolute top-1/2 -translate-y-1/2 right-full mr-2 px-2 py-1 rounded text-xs whitespace-nowrap pointer-events-none transition-opacity duration-200 ${
          isDragging ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}
        style={{
          background: themeConfig.colors.surface,
          color: themeConfig.colors.textMuted,
          border: `1px solid ${themeConfig.colors.border}`,
        }}
      >
        拖动调整宽度
      </div>
    </div>
  )
}

export default ResizableDivider
