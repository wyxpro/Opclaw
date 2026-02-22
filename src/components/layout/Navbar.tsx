import { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, BookOpen, Heart, Music2, Users, Menu, X, Cloud, Sun, CloudRain } from 'lucide-react'

const navItems = [
  { path: '/', label: '首页', icon: Home },
  { path: '/learning', label: '学习', icon: BookOpen },
  { path: '/life', label: '生活', icon: Heart },
  { path: '/entertainment', label: '娱乐', icon: Music2 },
  { path: '/social', label: '社交', icon: Users },
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
    <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-surface/50 border border-border/50">
      {/* 时间 - 固定宽度避免跳动 */}
      <div className="flex items-center gap-0.5 font-mono">
        <span className="text-sm font-semibold text-text w-[22px] text-center">{hours}</span>
        <span className="text-sm font-semibold text-text-muted">:</span>
        <span className="text-sm font-semibold text-text w-[22px] text-center">{minutes}</span>
        <span className="text-sm font-semibold text-text-muted">:</span>
        <span className="text-sm font-semibold text-text w-[22px] text-center">{seconds}</span>
      </div>
      <span className="text-xs text-text-muted">{formatDate(currentTime)}</span>
      <div className="w-px h-4 bg-border" />
      {/* 天气 */}
      <div className="flex items-center gap-1.5">
        <WeatherIcon size={14} className="text-accent" />
        <span className="text-xs text-text-secondary">{weather.location}</span>
        <span className="text-xs font-medium text-text">{weather.temp}°C</span>
      </div>
    </div>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()

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
      {/* Desktop Navbar */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'glass shadow-card py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6">
          {/* Logo & TimeWeather */}
          <div className="flex items-center gap-4">
            <NavLink to="/" className="flex items-center gap-2 group">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-primary/20 text-primary transition-all group-hover:bg-primary/30 group-hover:shadow-glow">
                <span className="text-lg font-bold">叶</span>
              </div>
              <span className="text-lg font-semibold text-text hidden sm:block">
                小叶<span className="text-text-muted font-normal">.dev</span>
              </span>
            </NavLink>
            {/* Time & Weather Widget */}
            <TimeWeatherWidget />
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
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
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-border">
        <div className="flex items-center justify-around px-2 py-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg text-xs transition-all ${
                  isActive
                    ? 'text-primary'
                    : 'text-text-muted hover:text-text-secondary'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />
                  <span className={`${isActive ? 'font-medium' : 'font-normal'}`}>
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  )
}
