import { useEffect, useLayoutEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { ThemeProvider } from './contexts/ThemeContext'
import { SettingsProvider } from './contexts/SettingsContext'
import { AuthProvider } from './contexts/AuthContext'
import Navbar from './components/layout/Navbar'
import StarCursor from './components/ui/StarCursor'
import Home from './pages/Home'
import Assets from './pages/Assets'
import Learning from './pages/Learning'
import Life from './pages/Life'
import Social from './pages/Social'
import AICharacter from './pages/AICharacter'
import Community from './pages/Community'
import Laboratory from './pages/Laboratory'
import Work from './pages/Work'

function AppContent() {
  const location = useLocation()

  // 监听路径变化，自动滚动到顶部
  // 使用 useLayoutEffect 确保在浏览器重绘前执行，避免视觉跳动
  useLayoutEffect(() => {
    window.scrollTo(0, 0)
    if (document.documentElement) {
      document.documentElement.scrollTo(0, 0)
    }
  }, [location])

  return (
    <div className="min-h-screen bg-bg text-text">
      <StarCursor />
      <Navbar />
      <main className="pt-0 md:pt-20 pb-20 md:pb-0">
        <AnimatePresence mode="popLayout">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/assets" element={<Assets />} />
            <Route path="/learning" element={<Learning />} />
            <Route path="/life" element={<Life />} />
            <Route path="/ai-character" element={<AICharacter />} />
            <Route path="/community" element={<Community />} />
            <Route path="/social" element={<Social />} />
            <Route path="/laboratory" element={<Laboratory />} />
            <Route path="/work" element={<Work />} />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SettingsProvider>
          <AppContent />
        </SettingsProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
