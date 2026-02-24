import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { useSettings } from '../../hooks/useSettings'

export function CursorEffectToggle() {
  const { cursorEffectEnabled, setCursorEffectEnabled } = useSettings()

  return (
    <motion.button
      onClick={() => setCursorEffectEnabled(!cursorEffectEnabled)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`p-2 rounded-lg glass-card transition-all ${
        cursorEffectEnabled 
          ? 'text-primary' 
          : 'text-text-muted hover:text-text'
      }`}
      title={cursorEffectEnabled ? '关闭鼠标特效' : '开启鼠标特效'}
    >
      <Sparkles size={20} className={cursorEffectEnabled ? '' : 'opacity-50'} />
    </motion.button>
  )
}
