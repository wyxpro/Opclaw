import { useState, useCallback, useEffect } from 'react'
import type { PersonalProfile, SkillCategory, PortfolioItem } from '../types/profile'
import { personalProfile as defaultProfile, skillCategories as defaultSkills, portfolioItems as defaultPortfolio } from '../data/profile'

interface HomeEditorState {
  profile: PersonalProfile
  skillCategories: SkillCategory[]
  portfolioItems: PortfolioItem[]
}

interface UseHomeEditorReturn {
  mode: 'preview' | 'edit'
  setMode: (mode: 'preview' | 'edit') => void
  profile: PersonalProfile
  skillCategories: SkillCategory[]
  portfolioItems: PortfolioItem[]
  updateProfile: (field: keyof PersonalProfile, value: any) => void
  updateSkill: (categoryId: string, skillId: string, field: string, value: any) => void
  updatePortfolio: (itemId: string, field: keyof PortfolioItem, value: any) => void
  canUndo: boolean
  canRedo: boolean
  undo: () => void
  redo: () => void
  saveToStorage: () => void
  resetToDefault: () => void
}

const STORAGE_KEY = 'home_editor_data'
const HISTORY_LIMIT = 20

export function useHomeEditor(): UseHomeEditorReturn {
  const [mode, setMode] = useState<'preview' | 'edit'>('preview')
  const [history, setHistory] = useState<HomeEditorState[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  
  // 初始化数据
  const [currentState, setCurrentState] = useState<HomeEditorState>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        return JSON.parse(stored)
      }
    } catch (e) {
      console.error('Failed to load stored data:', e)
    }
    return {
      profile: defaultProfile,
      skillCategories: defaultSkills,
      portfolioItems: defaultPortfolio
    }
  })

  // 保存到历史
  const addToHistory = useCallback((state: HomeEditorState) => {
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1)
      newHistory.push(state)
      if (newHistory.length > HISTORY_LIMIT) {
        newHistory.shift()
      }
      return newHistory
    })
    setHistoryIndex(prev => Math.min(prev + 1, HISTORY_LIMIT - 1))
  }, [historyIndex])

  // 更新个人简介
  const updateProfile = useCallback((field: keyof PersonalProfile, value: any) => {
    setCurrentState(prev => {
      const newState = {
        ...prev,
        profile: {
          ...prev.profile,
          [field]: value
        }
      }
      addToHistory(newState)
      return newState
    })
  }, [addToHistory])

  // 更新技能
  const updateSkill = useCallback((categoryId: string, skillId: string, field: string, value: any) => {
    setCurrentState(prev => {
      const newState = {
        ...prev,
        skillCategories: prev.skillCategories.map(category => {
          if (category.id !== categoryId) return category
          return {
            ...category,
            skills: category.skills.map(skill => {
              if (skill.id !== skillId) return skill
              return { ...skill, [field]: value }
            })
          }
        })
      }
      addToHistory(newState)
      return newState
    })
  }, [addToHistory])

  // 更新项目
  const updatePortfolio = useCallback((itemId: string, field: keyof PortfolioItem, value: any) => {
    setCurrentState(prev => {
      const newState = {
        ...prev,
        portfolioItems: prev.portfolioItems.map(item => {
          if (item.id !== itemId) return item
          return { ...item, [field]: value }
        })
      }
      addToHistory(newState)
      return newState
    })
  }, [addToHistory])

  // 撤销
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1)
      setCurrentState(history[historyIndex - 1])
    }
  }, [history, historyIndex])

  // 重做
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1)
      setCurrentState(history[historyIndex + 1])
    }
  }, [history, historyIndex])

  // 保存到localStorage
  const saveToStorage = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentState))
    } catch (e) {
      console.error('Failed to save data:', e)
    }
  }, [currentState])

  // 重置为默认
  const resetToDefault = useCallback(() => {
    const defaultState = {
      profile: defaultProfile,
      skillCategories: defaultSkills,
      portfolioItems: defaultPortfolio
    }
    setCurrentState(defaultState)
    addToHistory(defaultState)
    localStorage.removeItem(STORAGE_KEY)
  }, [addToHistory])

  // 自动保存到localStorage
  useEffect(() => {
    saveToStorage()
  }, [currentState, saveToStorage])

  return {
    mode,
    setMode,
    profile: currentState.profile,
    skillCategories: currentState.skillCategories,
    portfolioItems: currentState.portfolioItems,
    updateProfile,
    updateSkill,
    updatePortfolio,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
    undo,
    redo,
    saveToStorage,
    resetToDefault
  }
}
