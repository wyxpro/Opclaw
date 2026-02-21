import { createContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { themes, type ThemeType, type ThemeConfig, defaultTheme } from '../lib/themes'

interface ThemeContextType {
  currentTheme: ThemeType
  themeConfig: ThemeConfig
  setTheme: (theme: ThemeType) => void
  isTransitioning: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const STORAGE_KEY = 'site-theme'

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<ThemeType>(defaultTheme)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  // Load theme from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as ThemeType | null
    if (stored && themes[stored]) {
      requestAnimationFrame(() => {
        setCurrentTheme(stored)
      })
    }
    requestAnimationFrame(() => {
      setIsInitialized(true)
    })
  }, [])

  // Apply theme CSS variables
  useEffect(() => {
    if (!isInitialized) return

    const theme = themes[currentTheme]
    const root = document.documentElement

    // Apply color variables
    root.style.setProperty('--color-bg', theme.colors.bg)
    root.style.setProperty('--color-bg-alt', theme.colors.bgAlt)
    root.style.setProperty('--color-surface', theme.colors.surface)
    root.style.setProperty('--color-surface-alt', theme.colors.surfaceAlt)
    root.style.setProperty('--color-card', theme.colors.card)
    root.style.setProperty('--color-card-hover', theme.colors.cardHover)
    root.style.setProperty('--color-primary', theme.colors.primary)
    root.style.setProperty('--color-primary-glow', theme.colors.primaryGlow)
    root.style.setProperty('--color-primary-dim', theme.colors.primaryDim)
    root.style.setProperty('--color-primary-muted', theme.colors.primaryMuted)
    root.style.setProperty('--color-accent', theme.colors.accent)
    root.style.setProperty('--color-accent-glow', theme.colors.accentGlow)
    root.style.setProperty('--color-accent-dim', theme.colors.accentDim)
    root.style.setProperty('--color-rose', theme.colors.rose)
    root.style.setProperty('--color-cyan', theme.colors.cyan)
    root.style.setProperty('--color-emerald', theme.colors.emerald)
    root.style.setProperty('--color-sky', theme.colors.sky)
    root.style.setProperty('--color-text', theme.colors.text)
    root.style.setProperty('--color-text-secondary', theme.colors.textSecondary)
    root.style.setProperty('--color-text-muted', theme.colors.textMuted)
    root.style.setProperty('--color-text-dim', theme.colors.textDim)
    root.style.setProperty('--color-border', theme.colors.border)
    root.style.setProperty('--color-border-light', theme.colors.borderLight)

    // Apply font variables
    root.style.setProperty('--font-sans', theme.fonts.sans)
    root.style.setProperty('--font-mono', theme.fonts.mono)

    // Apply border radius variables
    root.style.setProperty('--radius-sm', theme.borderRadius.sm)
    root.style.setProperty('--radius-md', theme.borderRadius.md)
    root.style.setProperty('--radius-lg', theme.borderRadius.lg)
    root.style.setProperty('--radius-xl', theme.borderRadius.xl)

    // Apply shadow variables
    root.style.setProperty('--shadow-glow', theme.shadows.glow)
    root.style.setProperty('--shadow-card', theme.shadows.card)
    root.style.setProperty('--shadow-card-hover', theme.shadows.cardHover)
    root.style.setProperty('--shadow-float', theme.shadows.float)

    // Apply glass effect variables
    root.style.setProperty('--glass-bg', theme.glassEffect.background)
    root.style.setProperty('--glass-border', theme.glassEffect.border)
    root.style.setProperty('--glass-blur', theme.glassEffect.backdropBlur)

    // Update body background and text color
    document.body.style.backgroundColor = theme.colors.bg
    document.body.style.color = theme.colors.text
    document.body.style.fontFamily = theme.fonts.sans

    // Update scrollbar colors
    root.style.setProperty('--scrollbar-thumb', theme.colors.borderLight)
    root.style.setProperty('--scrollbar-track', theme.colors.surface)

    // Set data attribute for theme-specific CSS selectors
    root.setAttribute('data-theme', currentTheme)
  }, [currentTheme, isInitialized])

  const setTheme = useCallback((theme: ThemeType) => {
    if (theme === currentTheme) return
    
    setIsTransitioning(true)
    
    // Small delay to allow transition animation to start
    setTimeout(() => {
      setCurrentTheme(theme)
      localStorage.setItem(STORAGE_KEY, theme)
      
      // End transition after theme change
      setTimeout(() => {
        setIsTransitioning(false)
      }, 300)
    }, 50)
  }, [currentTheme])

  // Keyboard shortcut: Tab+Q to cycle themes
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Tab+Q combination
      if (e.key === 'q' && e.shiftKey) {
        e.preventDefault()
        const themeKeys = Object.keys(themes) as ThemeType[]
        const currentIndex = themeKeys.indexOf(currentTheme)
        const nextIndex = (currentIndex + 1) % themeKeys.length
        setTheme(themeKeys[nextIndex])
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentTheme, setTheme])

  const value: ThemeContextType = {
    currentTheme,
    themeConfig: themes[currentTheme],
    setTheme,
    isTransitioning,
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export { ThemeContext }
