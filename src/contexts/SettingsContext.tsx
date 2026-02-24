import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

type Language = 'zh' | 'en'

interface SettingsContextType {
  cursorEffectEnabled: boolean
  setCursorEffectEnabled: (enabled: boolean) => void
  language: Language
  setLanguage: (lang: Language) => void
}

export const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: ReactNode }) {
  // 鼠标特效开关 - 默认开启
  const [cursorEffectEnabled, setCursorEffectEnabled] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cursorEffectEnabled')
      return saved !== null ? saved === 'true' : true
    }
    return true
  })

  // 语言设置 - 默认中文
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('language') as Language
      return saved || 'zh'
    }
    return 'zh'
  })

  // 持久化鼠标特效设置
  useEffect(() => {
    localStorage.setItem('cursorEffectEnabled', String(cursorEffectEnabled))
  }, [cursorEffectEnabled])

  // 持久化语言设置
  useEffect(() => {
    localStorage.setItem('language', language)
  }, [language])

  return (
    <SettingsContext.Provider
      value={{
        cursorEffectEnabled,
        setCursorEffectEnabled,
        language,
        setLanguage,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}
