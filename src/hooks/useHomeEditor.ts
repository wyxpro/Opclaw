import { useState, useCallback, useEffect } from 'react'
import type { PersonalProfile, SkillCategory, PortfolioItem, HobbyItem, ContactConfig, HomeEditorData } from '../types/profile'
import { 
  personalProfile as defaultProfile, 
  skillCategories as defaultSkills, 
  portfolioItems as defaultPortfolio,
  hobbiesData as defaultHobbies,
  contactConfig as defaultContact
} from '../data/profile'
import { getSupabaseClient } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

interface UseHomeEditorReturn {
  mode: 'preview' | 'edit'
  setMode: (mode: 'preview' | 'edit') => void
  profile: PersonalProfile
  skillCategories: SkillCategory[]
  portfolioItems: PortfolioItem[]
  hobbies: HobbyItem[]
  contact: ContactConfig
  updateProfile: (field: keyof PersonalProfile, value: any) => void
  updateSkill: (categoryId: string, skillId: string, field: string, value: any) => void
  updatePortfolio: (itemId: string, field: keyof PortfolioItem, value: any) => void
  updateHobby: (hobbyId: string, field: string, value: any) => void
  updateContact: (field: string, value: any) => void
  canUndo: boolean
  canRedo: boolean
  undo: () => void
  redo: () => void
  saveToCloud: () => Promise<void>
  resetToDefault: () => void
}

const STORAGE_KEY = 'home_editor_data'
const MODE_KEY = 'home_editor_mode'
const HISTORY_LIMIT = 20

export function useHomeEditor(): UseHomeEditorReturn {
  const { user } = useAuth()
  const [mode, setModeState] = useState<'preview' | 'edit'>(() => {
    return (localStorage.getItem(MODE_KEY) as 'preview' | 'edit') || 'preview'
  })
  
  const [history, setHistory] = useState<HomeEditorData[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  
  // 初始化数据
  const [currentState, setCurrentState] = useState<HomeEditorData>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        return {
          profile: { ...defaultProfile, ...parsed.profile },
          skillCategories: parsed.skillCategories || defaultSkills,
          portfolioItems: parsed.portfolioItems || defaultPortfolio,
          hobbies: (parsed.hobbies || defaultHobbies).map((hobby: HobbyItem) => {
            const defaultHobby = defaultHobbies.find(h => h.id === hobby.id)
            return defaultHobby ? { ...defaultHobby, ...hobby } : hobby
          }),
          contact: { ...defaultContact, ...parsed.contact }
        }
      }
    } catch (e) {
      console.error('Failed to load stored data:', e)
    }
    return {
      profile: defaultProfile,
      skillCategories: defaultSkills,
      portfolioItems: defaultPortfolio,
      hobbies: defaultHobbies,
      contact: defaultContact
    }
  })

  // 同步 mode 到 localStorage
  const setMode = useCallback((newMode: 'preview' | 'edit') => {
    setModeState(newMode)
    localStorage.setItem(MODE_KEY, newMode)
  }, [])

  // 保存到历史
  const addToHistory = useCallback((state: HomeEditorData) => {
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1)
      newHistory.push(state)
      if (newHistory.length > HISTORY_LIMIT) {
        newHistory.shift()
      }
      return newHistory
    })
    setHistoryIndex(prev => {
      const newIdx = prev + 1
      return Math.min(newIdx, HISTORY_LIMIT - 1)
    })
  }, [historyIndex])

  // 更新状态并添加历史记录的通用函数
  const updateState = useCallback((newState: HomeEditorData) => {
    setCurrentState(newState)
    addToHistory(newState)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState))
  }, [addToHistory])

  // 各个区域的更新函数
  const updateProfile = useCallback((field: keyof PersonalProfile, value: any) => {
    const newState = {
      ...currentState,
      profile: { ...currentState.profile, [field]: value }
    }
    updateState(newState)
  }, [currentState, updateState])

  const updateSkill = useCallback((categoryId: string, skillId: string, field: string, value: any) => {
    const newState = {
      ...currentState,
      skillCategories: currentState.skillCategories.map(category => {
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
    updateState(newState)
  }, [currentState, updateState])

  const updatePortfolio = useCallback((itemId: string, field: keyof PortfolioItem, value: any) => {
    const newState = {
      ...currentState,
      portfolioItems: currentState.portfolioItems.map(item => {
        if (item.id !== itemId) return item
        return { ...item, [field]: value }
      })
    }
    updateState(newState)
  }, [currentState, updateState])

  const updateHobby = useCallback((hobbyId: string, field: string, value: any) => {
    const newState = {
      ...currentState,
      hobbies: currentState.hobbies.map(hobby => {
        if (hobby.id !== hobbyId) return hobby
        // 支持嵌套字段如 details.fullDescription
        if (field.includes('.')) {
          const [parent, child] = field.split('.')
          return {
            ...hobby,
            [parent]: {
              ...(hobby as any)[parent],
              [child]: value
            }
          }
        }
        return { ...hobby, [field]: value }
      })
    }
    updateState(newState)
  }, [currentState, updateState])

  const updateContact = useCallback((field: string, value: any) => {
    const newState = {
      ...currentState,
      contact: { ...currentState.contact, [field]: value }
    }
    updateState(newState)
  }, [currentState, updateState])

  // 撤销/重做
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1]
      setCurrentState(prevState)
      setHistoryIndex(prev => prev - 1)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prevState))
    }
  }, [history, historyIndex])

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1]
      setCurrentState(nextState)
      setHistoryIndex(prev => prev + 1)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState))
    }
  }, [history, historyIndex])

  // 云端同步 (Supabase)
  const saveToCloud = async () => {
    if (!user) return
    const supabase = getSupabaseClient()
    const { error } = await supabase
      .from('user_profiles')
      .upsert({
        id: user.id,
        home_data: currentState,
        updated_at: new Date().toISOString()
      })
    
    if (error) {
      console.error('Failed to save to cloud:', error)
      throw error
    }
  }

  // 重置
  const resetToDefault = useCallback(() => {
    const defaultState = {
      profile: defaultProfile,
      skillCategories: defaultSkills,
      portfolioItems: defaultPortfolio,
      hobbies: defaultHobbies,
      contact: defaultContact
    }
    updateState(defaultState)
    localStorage.removeItem(STORAGE_KEY)
  }, [updateState])

  // 初始加载时尝试从云端同步
  useEffect(() => {
    const loadFromCloud = async () => {
      if (!user) return
      const supabase = getSupabaseClient()
      const { data, error } = await supabase
        .from('user_profiles')
        .select('home_data')
        .eq('id', user.id)
        .maybeSingle()
      
      if (data?.home_data) {
        setCurrentState(data.home_data)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data.home_data))
      }
    }
    loadFromCloud()
  }, [user])

  // 同步全局用户头像和昵称到个人主页
  useEffect(() => {
    if (user) {
      const needsUpdate = (user.avatar && user.avatar !== currentState.profile.avatar) || 
                          (user.username && user.username !== currentState.profile.name);
      
      if (needsUpdate) {
        const updatedProfile = {
          ...currentState.profile,
          avatar: user.avatar || currentState.profile.avatar,
          name: user.username || currentState.profile.name
        };
        const newState = {
          ...currentState,
          profile: updatedProfile
        };
        setCurrentState(newState);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      }
    }
  }, [user?.avatar, user?.username])

  return {
    mode,
    setMode,
    profile: currentState.profile,
    skillCategories: currentState.skillCategories,
    portfolioItems: currentState.portfolioItems,
    hobbies: currentState.hobbies,
    contact: currentState.contact,
    updateProfile,
    updateSkill,
    updatePortfolio,
    updateHobby,
    updateContact,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
    undo,
    redo,
    saveToCloud,
    resetToDefault
  }
}
