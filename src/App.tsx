import { useEffect, useLayoutEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { ThemeProvider } from './contexts/ThemeContext'
import { SettingsProvider } from './contexts/SettingsContext'
import { AuthProvider } from './contexts/AuthContext'
import Navbar from './components/layout/Navbar'
import StarCursor from './components/ui/StarCursor'
import MusicPlayer from './components/ui/MusicPlayer'
import Home from './pages/Home'
import Assets from './pages/Assets'
import Learning from './pages/Learning'
import Life from './pages/Life'
import AICharacter from './pages/AICharacter'
import Profile from './pages/Profile'
import Community from './pages/Community'
import Social from './pages/Social'
import Laboratory from './pages/Laboratory'
import Work from './pages/Work'
import ResumeTemplates from './pages/ResumeTemplates'
import ResumeBuilder from './pages/ResumeBuilder'

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
    <div className="min-h-screen bg-bg text-text overflow-x-hidden">
      <StarCursor />
      <Navbar />
      <main className="pt-0 md:pt-20 pb-20 md:pb-0 mx-auto max-w-[480px] md:max-w-none w-full min-h-screen relative shadow-[0_0_50px_rgba(0,0,0,0.05)] md:shadow-none border-x border-border/10 md:border-none">
        <AnimatePresence mode="popLayout">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/assets" element={<Assets />} />
            <Route path="/learning" element={<Learning />} />
            <Route path="/life" element={<Life />} />
            <Route path="/ai-character" element={<AICharacter />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/community" element={<Community />} />
            <Route path="/social" element={<Social />} />
            <Route path="/laboratory" element={<Laboratory />} />
            <Route path="/work" element={<Work />} />
            <Route path="/resume-templates" element={<ResumeTemplates />} />
            <Route path="/resume-builder" element={<ResumeBuilder />} />
          </Routes>
        </AnimatePresence>
      </main>
      <MusicPlayer />
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
