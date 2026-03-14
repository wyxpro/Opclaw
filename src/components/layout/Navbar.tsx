import { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, Wallet, Users, Menu, X, Cloud, Sun, CloudRain, Palette, Sparkles, Atom, Globe } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'
import { ThemeSelectorPanel } from '../ui/ThemeSwitcher'

const navItems = [
  { path: '/', label: '首页', icon: Home },
  { path: '/ai-character', label: 'AI分身', icon: Sparkles },
  { path: '/community', label: '元宇宙', icon: Atom },
  { path: '/assets', label: '资产', icon: Wallet },
  { path: '/social', label: '我的', icon: Users },
]

// 天气图标映射
const weatherIcons: Record<string, typeof Sun> = {
  sunny: Sun,
  cloudy: Cloud,
  rainy: CloudRain,
}

// 时间和天气组件
function TimeWeatherWidget() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [weather, setWeather] = useState({ temp: 22, condition: 'sunny', location: '深圳' })

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // 模拟获取天气（实际项目中可以调用天气API）
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const mockWeatherData = { temp: 22, condition: 'sunny', location: '深圳' }
      setWeather(mockWeatherData)
    })
    return () => cancelAnimationFrame(frame)
  }, [])

  const formatTimeParts = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const seconds = date.getSeconds().toString().padStart(2, '0')
    return { hours, minutes, seconds }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric', weekday: 'short' })
  }

  const WeatherIcon = weatherIcons[weather.condition] || Sun
  const { hours, minutes, seconds } = formatTimeParts(currentTime)

  return (
    <div className="hidden sm:flex items-center gap-4 px-4 py-2 rounded-xl bg-surface/50 border border-border/50">
      {/* 时间 - 固定宽度避免跳动 */}
      <div className="flex items-center gap-1 font-mono">
        <span className="text-base font-bold text-text w-[26px] text-center">{hours}</span>
        <span className="text-base font-bold text-text-muted">:</span>
        <span className="text-base font-bold text-text w-[26px] text-center">{minutes}</span>
        <span className="text-base font-bold text-text-muted">:</span>
        <span className="text-base font-bold text-text w-[26px] text-center">{seconds}</span>
      </div>
      <span className="text-sm text-text-muted font-medium">{formatDate(currentTime)}</span>
      <div className="w-px h-5 bg-border" />
      {/* 天气 */}
      <div className="flex items-center gap-2">
        <WeatherIcon size={18} className="text-accent" />
        <span className="text-sm text-text-secondary font-medium">{weather.location}</span>
        <span className="text-sm font-bold text-text">{weather.temp}°C</span>
      </div>
    </div>
  )
}

// 主题切换按钮组件
function ThemeToggle() {
  const { currentTheme, setTheme, themeConfig } = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass-card text-base font-semibold transition-all duration-300"
        style={{
          background: themeConfig.glassEffect.background,
          border: themeConfig.glassEffect.border,
          color: themeConfig.colors.text,
          boxShadow: themeConfig.shadows.card,
        }}
      >
        <span className="text-lg">{themeConfig.icon}</span>
        <span>{themeConfig.name}</span>
        <Palette size={18} className="opacity-70" />
      </motion.button>

      <ThemeSelectorPanel
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        currentTheme={currentTheme}
        themeConfig={themeConfig}
        onThemeChange={setTheme}
      />
    </div>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()
  const { themeConfig } = useTheme()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // 使用 requestAnimationFrame 避免同步 setState
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setMobileMenuOpen(false)
    })
    return () => cancelAnimationFrame(frame)
  }, [location.pathname])

  return (
    <>
      {/* Desktop Navbar - 仅在桌面端显示 */}
      <header
        className={`hidden md:block fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'glass shadow-card py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <nav className="flex items-center justify-between px-6">
          {/* Left: Logo & TimeWeather - 靠最左端 */}
          <div className="flex items-center gap-5">
            {/* Logo - 点击跳转到官网首页 */}
            <a 
              href="/index.html" 
              className="flex items-center gap-3 group"
              title="返回官网"
            >
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 text-primary transition-all group-hover:bg-primary/30 group-hover:shadow-glow">
                <Globe size={18} />
              </div>
              <span className="text-xl font-bold text-text hidden sm:block">
                SuperUI
              </span>
            </a>
            {/* Time & Weather Widget */}
            <TimeWeatherWidget />
          </div>

          {/* Right: Desktop Nav Links + Theme Toggle */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `relative px-5 py-2.5 rounded-xl text-base font-semibold transition-all duration-200 ${
                    isActive
                      ? 'text-primary'
                      : 'text-text-secondary hover:text-text hover:bg-surface/60'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {item.label}
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 rounded-lg bg-primary/10 border border-primary/20"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
            {/* Theme Toggle - 紧靠在"我的"右边，间隔2个空格 */}
            <div className="ml-4">
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg text-text-secondary hover:text-text hover:bg-surface/60 transition-colors"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden glass border-t border-border overflow-hidden"
            >
              <div className="px-4 py-3 flex flex-col gap-1">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === '/'}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-primary/10 text-primary border border-primary/20'
                          : 'text-text-secondary hover:text-text hover:bg-surface/40'
                      }`
                    }
                  >
                    <item.icon size={18} />
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Bottom Tab Bar */}
      <nav 
        className="md:hidden fixed bottom-0 left-0 right-0 z-50"
        style={{
          background: themeConfig.glassEffect.background,
          backdropFilter: themeConfig.glassEffect.backdropBlur,
          borderTop: `1px solid ${themeConfig.colors.border}`,
        }}
      >
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.map((item) => {
            const isMetaverse = item.label === '元宇宙'
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `relative flex flex-col items-center justify-center gap-1 px-2 py-1 rounded-lg text-xs transition-all ${
                    isActive && !isMetaverse
                      ? 'text-primary'
                      : isMetaverse
                      ? ''
                      : 'text-text-muted hover:text-text-secondary'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {/* 元宇宙特殊按钮 */}
                    {isMetaverse ? (
                      <>
                        {/* 按钮容器 */}
                        <motion.div 
                          className="relative mb-0.5"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.92 }}
                          transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        >
                          {/* 外发光层 - 始终显示柔和光晕 */}
                          <div 
                            className="absolute -inset-1 rounded-3xl opacity-60 blur-sm"
                            style={{
                              background: isActive 
                                ? `linear-gradient(135deg, ${themeConfig.colors.primary}, ${themeConfig.colors.primaryGlow})`
                                : 'transparent',
                            }}
                          />
                          
                          {/* 动态脉冲光环 - 仅激活时 */}
                          {isActive && (
                            <motion.div
                              className="absolute -inset-2 rounded-3xl"
                              animate={{ 
                                scale: [1, 1.15, 1],
                                opacity: [0.5, 0, 0.5],
                              }}
                              transition={{ 
                                duration: 2, 
                                repeat: Infinity,
                                ease: "easeInOut"
                              }}
                              style={{
                                background: `radial-gradient(circle, ${themeConfig.colors.primary}40 0%, transparent 70%)`,
                              }}
                            />
                          )}
                          
                          {/* 主按钮 */}
                          <div 
                            className="w-11 h-11 rounded-2xl flex items-center justify-center relative overflow-hidden"
                            style={{
                              background: isActive 
                                ? `linear-gradient(135deg, ${themeConfig.colors.primary}, ${themeConfig.colors.sky})`
                                : `linear-gradient(145deg, ${themeConfig.colors.surface}, ${themeConfig.colors.bg})`,
                              border: isActive 
                                ? `2px solid ${themeConfig.colors.primary}`
                                : `2px solid ${themeConfig.colors.border}`,
                              boxShadow: isActive 
                                ? `0 4px 15px ${themeConfig.colors.primary}60, inset 0 2px 4px rgba(255,255,255,0.25)`
                                : `0 2px 8px rgba(0,0,0,0.08), inset 0 1px 2px rgba(255,255,255,0.5)`,
                            }}
                          >
                            {/* 玻璃光泽效果 */}
                            <div 
                              className="absolute top-0 left-0 right-0 h-[55%] rounded-t-2xl"
                              style={{
                                background: 'linear-gradient(180deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.05) 100%)',
                              }}
                            />
                            
                            {/* 图标容器 */}
                            <motion.div
                              className="relative z-10"
                              animate={isActive ? { 
                                rotate: [0, -10, 10, -10, 10, 0],
                                scale: [1, 1.1, 1]
                              } : { rotate: 0, scale: 1 }}
                              transition={{ 
                                duration: 0.5,
                                repeat: isActive ? Infinity : 0,
                                repeatDelay: 3,
                                ease: "easeInOut"
                              }}
                            >
                              <item.icon 
                                size={22} 
                                strokeWidth={1.5}
                                style={{ 
                                  color: isActive ? 'white' : themeConfig.colors.primary,
                                  filter: isActive 
                                    ? 'drop-shadow(0 2px 3px rgba(0,0,0,0.25))' 
                                    : 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))',
                                }}
                              />
                            </motion.div>
                          </div>
                        </motion.div>
                        
                        {/* 标签 */}
                        <motion.span 
                          className="text-[10px] font-semibold"
                          animate={isActive ? { y: [0, -1, 0] } : { y: 0 }}
                          transition={{ duration: 0.3 }}
                          style={{ 
                            color: isActive ? themeConfig.colors.primary : themeConfig.colors.textMuted,
                          }}
                        >
                          {item.label}
                        </motion.span>
                      </>
                    ) : (
                      <>
                        <item.icon 
                          size={20} 
                          strokeWidth={isActive ? 2.5 : 1.5}
                          style={{
                            color: isActive ? themeConfig.colors.primary : themeConfig.colors.textMuted
                          }}
                        />
                        <span 
                          className={`text-[10px] ${isActive ? 'font-medium' : 'font-normal'}`}
                          style={{
                            color: isActive ? themeConfig.colors.primary : themeConfig.colors.textMuted
                          }}
                        >
                          {item.label}
                        </span>
                      </>
                    )}
                  </>
                )}
              </NavLink>
            )
          })}
        </div>
      </nav>
    </>
  )
}
