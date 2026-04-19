import { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, Wallet, Users, Menu, X, Palette, Sparkles, Globe, Sparkles as SparklesIcon } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'
import { useAuth } from '../../contexts/AuthContext'
import { ThemeSelectorPanel } from '../ui/ThemeSwitcher'
import AuthModal from '../auth/AuthModal'

const navItems = [
  { path: '/', label: '🏠 首页', icon: Home },
  // PC 端专属菜单项
  { path: '/learning', label: '📚 学习空间', icon: null, isPcOnly: true },
  { path: '/work', label: '📺 工作助手', icon: null, isPcOnly: true },
  { path: '/life', label: '🌈 生活记录', icon: null, isPcOnly: true },
  // 资产菜单 - 移动端显示，PC 端隐藏
  { path: '/assets', label: '💎 资产', icon: Wallet, isMobileOnly: true },
  { path: '/ai-character', label: '✨ AI 分身', icon: SparklesIcon },
  { path: '/social', label: '👤 我的', icon: Users },
]

// 移动端导航项（不含表情）
const mobileNavLabels = {
  '/': '首页',
  '/assets': '资产',
  '/ai-character': 'AI 分身',
  '/social': '我的',
}

// 时间组件
function TimeWidget() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const { currentTheme } = useTheme()

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
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

  const { hours, minutes, seconds } = formatTimeParts(currentTime)

  // 极简主题下使用黑色，其他主题使用主题色
  const timeColor = currentTheme === 'minimal' ? '#1a1a1a' : undefined

  return (
    <div className="hidden sm:flex items-center gap-4 px-4 py-2 rounded-xl backdrop-blur-sm">
      {/* 时间 - 固定宽度避免跳动 */}
      <div className="flex items-center gap-1" style={{ fontFamily: "'KaiTi', 'STKaiti', monospace" }}>
        <span className="text-base font-bold w-[26px] text-center" style={{ color: timeColor }}>{hours}</span>
        <span className="text-base font-bold" style={{ color: timeColor ? `${timeColor}99` : undefined }}>:</span>
        <span className="text-base font-bold w-[26px] text-center" style={{ color: timeColor }}>{minutes}</span>
        <span className="text-base font-bold" style={{ color: timeColor ? `${timeColor}99` : undefined }}>:</span>
        <span className="text-base font-bold w-[26px] text-center" style={{ color: timeColor }}>{seconds}</span>
      </div>
      <span className="text-sm text-text-muted font-medium">{formatDate(currentTime)}</span>
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
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-base font-semibold transition-all duration-300 bg-primary/10 border border-primary/20 backdrop-blur-sm"
      >
        <span className="text-lg">{themeConfig.icon}</span>
        <span className="text-text">{themeConfig.name}</span>
        <Palette size={18} className="text-primary opacity-70" />
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
  const [showAuthModal, setShowAuthModal] = useState(false)
  const location = useLocation()
  const { themeConfig } = useTheme()
  const { isAuthenticated } = useAuth()

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

  // 处理"我的"导航点击
  const handleSocialClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault()
      setShowAuthModal(true)
    }
  }

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
                Opclaw
              </span>
            </a>
            {/* Time Widget */}
            <TimeWidget />
          </div>

          {/* Right: Desktop Nav Links + Theme Toggle */}
          <div className="hidden md:flex items-center gap-1">
            {navItems
              .filter(item => !item.isMobileOnly) // PC 端过滤掉移动端专属项
              .map((item) => {
                // PC 端专属菜单项 - 使用 NavLink 以支持选中状态
                if (item.isPcOnly) {
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={({ isActive }) =>
                        `relative px-4 py-2.5 rounded-xl text-base font-semibold transition-all duration-200 ${
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
                  );
                }
                
                // 普通导航项
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === '/'}
                    onClick={item.path === '/social' ? handleSocialClick : undefined}
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
                );
              })}
            {/* Theme Toggle - 紧靠在"我的"右边，间隔 2 个空格 */}
            <div className="ml-2">
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
                {navItems
                  .filter(item => !item.isPcOnly) // 移动端过滤掉 PC 端专属项
                  .map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === '/'}
                    onClick={item.path === '/social' && !isAuthenticated ? (e) => { e.preventDefault(); setShowAuthModal(true); } : undefined}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-primary/10 text-primary border border-primary/20'
                          : 'text-text-secondary hover:text-text hover:bg-surface/40'
                      }`
                    }
                  >
                    {item.icon && <item.icon size={18} />}
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
          {navItems
            .filter(item => !item.isPcOnly) // 移动端过滤掉 PC 端专属项
            .map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              onClick={item.path === '/social' && !isAuthenticated ? (e) => { e.preventDefault(); setShowAuthModal(true); } : undefined}
              className={({ isActive }) =>
                `relative flex flex-col items-center justify-center gap-1 px-2 py-1 rounded-lg text-xs transition-all ${
                  isActive
                    ? 'text-primary'
                    : 'text-text-muted hover:text-text-secondary'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {item.icon && (
                    <item.icon 
                      size={20} 
                      strokeWidth={isActive ? 2.5 : 1.5}
                      style={{
                        color: isActive ? themeConfig.colors.primary : themeConfig.colors.textMuted
                      }}
                    />
                  )}
                  <span 
                    className={`text-[10px] ${isActive ? 'font-medium' : 'font-normal'}`}
                    style={{
                      color: isActive ? themeConfig.colors.primary : themeConfig.colors.textMuted
                    }}
                  >
                    {mobileNavLabels[item.path as keyof typeof mobileNavLabels]}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultMode="login"
      />
    </>
  )
}
