import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

interface SettingsContextType {
  // 鼠标特效
  cursorEffectEnabled: boolean
  setCursorEffectEnabled: (enabled: boolean) => void
  // 隐私权限
  privacyMode: boolean
  setPrivacyMode: (enabled: boolean) => void
  // 通知提醒
  notificationsEnabled: boolean
  setNotificationsEnabled: (enabled: boolean) => void
  // 音效
  soundEnabled: boolean
  setSoundEnabled: (enabled: boolean) => void
  // 自动播放
  autoPlayEnabled: boolean
  setAutoPlayEnabled: (enabled: boolean) => void
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

  // 隐私模式 - 默认关闭
  const [privacyMode, setPrivacyMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('privacyMode')
      return saved !== null ? saved === 'true' : false
    }
    return false
  })

  // 通知提醒 - 默认开启
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('notificationsEnabled')
      return saved !== null ? saved === 'true' : true
    }
    return true
  })

  // 音效 - 默认开启
  const [soundEnabled, setSoundEnabled] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('soundEnabled')
      return saved !== null ? saved === 'true' : true
    }
    return true
  })

  // 自动播放 - 默认关闭
  const [autoPlayEnabled, setAutoPlayEnabled] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('autoPlayEnabled')
      return saved !== null ? saved === 'true' : false
    }
    return false
  })

  // 持久化鼠标特效设置
  useEffect(() => {
    localStorage.setItem('cursorEffectEnabled', String(cursorEffectEnabled))
  }, [cursorEffectEnabled])

  // 持久化隐私模式设置
  useEffect(() => {
    localStorage.setItem('privacyMode', String(privacyMode))
  }, [privacyMode])

  // 持久化通知提醒设置
  useEffect(() => {
    localStorage.setItem('notificationsEnabled', String(notificationsEnabled))
  }, [notificationsEnabled])

  // 持久化音效设置
  useEffect(() => {
    localStorage.setItem('soundEnabled', String(soundEnabled))
  }, [soundEnabled])

  // 持久化自动播放设置
  useEffect(() => {
    localStorage.setItem('autoPlayEnabled', String(autoPlayEnabled))
  }, [autoPlayEnabled])

  return (
    <SettingsContext.Provider
      value={{
        cursorEffectEnabled,
        setCursorEffectEnabled,
        privacyMode,
        setPrivacyMode,
        notificationsEnabled,
        setNotificationsEnabled,
        soundEnabled,
        setSoundEnabled,
        autoPlayEnabled,
        setAutoPlayEnabled,
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
