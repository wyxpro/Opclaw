import { motion } from 'framer-motion'
import { Globe } from 'lucide-react'
import { useSettings } from '../../hooks/useSettings'

export function LanguageToggle() {
  const { language, setLanguage } = useSettings()

  return (
    <motion.button
      onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="flex items-center gap-1.5 px-3 py-2 rounded-lg glass-card text-sm font-medium text-text-secondary hover:text-text transition-all"
      title="切换语言"
    >
      <Globe size={18} />
      <span>{language === 'zh' ? '中' : 'EN'}</span>
    </motion.button>
  )
}
