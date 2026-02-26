import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { ThemeProvider } from './contexts/ThemeContext'
import { SettingsProvider } from './contexts/SettingsContext'
import Navbar from './components/layout/Navbar'
import StarCursor from './components/ui/StarCursor'
import Home from './pages/Home'
import Assets from './pages/Assets'
import Learning from './pages/Learning'
import Life from './pages/Life'
import Entertainment from './pages/Entertainment'
import Social from './pages/Social'
import AICharacter from './pages/AICharacter'

function AppContent() {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-bg text-text">
      <StarCursor />
      <Navbar />
      <main className="pt-0 md:pt-20 pb-20 md:pb-0">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/assets" element={<Assets />} />
            <Route path="/learning" element={<Learning />} />
            <Route path="/life" element={<Life />} />
            <Route path="/entertainment" element={<Entertainment />} />
            <Route path="/ai-character" element={<AICharacter />} />
            <Route path="/social" element={<Social />} />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <SettingsProvider>
        <AppContent />
      </SettingsProvider>
    </ThemeProvider>
  )
}
