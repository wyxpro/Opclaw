import { useState, useEffect, useCallback, useRef } from 'react'
import type { ResumeData } from './types'
import { defaultResumeData } from './types'

const STORAGE_KEY = 'opclaw-resume-data'

interface HistoryState {
  data: ResumeData
  timestamp: number
}

export function useResume() {
  const [resumeData, setResumeData] = useState<ResumeData>(defaultResumeData)
  const [isLoading, setIsLoading] = useState(true)
  const [history, setHistory] = useState<HistoryState[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const historyRef = useRef<HistoryState[]>([])
  const historyIndexRef = useRef(-1)

  // Load data from localStorage
  useEffect(() => {
    const loadData = () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved) {
          const parsed = JSON.parse(saved)
          setResumeData(parsed)
          // Initialize history with loaded data
          const initialState = { data: parsed, timestamp: Date.now() }
          historyRef.current = [initialState]
          historyIndexRef.current = 0
          setHistory([initialState])
          setHistoryIndex(0)
        } else {
          // Initialize with default data
          const initialState = { data: defaultResumeData, timestamp: Date.now() }
          historyRef.current = [initialState]
          historyIndexRef.current = 0
          setHistory([initialState])
          setHistoryIndex(0)
        }
      } catch (error) {
        console.error('Failed to load resume data:', error)
        setResumeData(defaultResumeData)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  // Save data to localStorage
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(resumeData))
    }
  }, [resumeData, isLoading])

  // Update resume data with history tracking
  const updateResumeData = useCallback((updater: (prev: ResumeData) => ResumeData) => {
    setResumeData(prev => {
      const newData = updater(prev)
      
      // Add to history
      const newState = { data: newData, timestamp: Date.now() }
      const newHistory = historyRef.current.slice(0, historyIndexRef.current + 1)
      newHistory.push(newState)
      
      // Limit history to 50 states
      if (newHistory.length > 50) {
        newHistory.shift()
      }
      
      historyRef.current = newHistory
      historyIndexRef.current = newHistory.length - 1
      setHistory(newHistory)
      setHistoryIndex(historyIndexRef.current)
      
      return newData
    })
  }, [])

  // Undo
  const undo = useCallback(() => {
    if (historyIndexRef.current > 0) {
      historyIndexRef.current -= 1
      setHistoryIndex(historyIndexRef.current)
      const prevState = historyRef.current[historyIndexRef.current]
      setResumeData(prevState.data)
    }
  }, [])

  // Redo
  const redo = useCallback(() => {
    if (historyIndexRef.current < historyRef.current.length - 1) {
      historyIndexRef.current += 1
      setHistoryIndex(historyIndexRef.current)
      const nextState = historyRef.current[historyIndexRef.current]
      setResumeData(nextState.data)
    }
  }, [])

  // Check if can undo/redo
  const canUndo = historyIndex > 0
  const canRedo = historyIndex < history.length - 1

  // Reset to default
  const resetToDefault = useCallback(() => {
    updateResumeData(() => ({ ...defaultResumeData }))
  }, [updateResumeData])

  // Export data
  const exportData = useCallback(() => {
    const dataStr = JSON.stringify(resumeData, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `resume-${resumeData.personalInfo.name || 'data'}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, [resumeData])

  // Import data
  const importData = useCallback((file: File) => {
    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string)
          updateResumeData(() => data)
          resolve()
        } catch {
          reject(new Error('Invalid JSON file'))
        }
      }
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsText(file)
    })
  }, [updateResumeData])

  // Generate share link (simulated)
  const generateShareLink = useCallback(() => {
    const dataStr = btoa(JSON.stringify(resumeData))
    return `${window.location.origin}/resume/share?data=${encodeURIComponent(dataStr)}`
  }, [resumeData])

  return {
    resumeData,
    isLoading,
    updateResumeData,
    undo,
    redo,
    canUndo,
    canRedo,
    resetToDefault,
    exportData,
    importData,
    generateShareLink
  }
}
