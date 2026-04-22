import React from 'react'
import { motion } from 'framer-motion'

interface VoiceWaveAnimationProps {
  isListening: boolean
  color?: string
}

export const VoiceWaveAnimation: React.FC<VoiceWaveAnimationProps> = ({ 
  isListening, 
  color = '#3b82f6' 
}) => {
  const bars = Array.from({ length: 8 }, (_, i) => i)

  return (
    <div className="flex items-center justify-center gap-1 h-8">
      {bars.map((i) => (
        <motion.div
          key={i}
          className="w-1 rounded-full"
          style={{ backgroundColor: color }}
          animate={isListening ? {
            height: [8, 24, 12, 28, 8],
          } : {
            height: 4,
          }}
          transition={isListening ? {
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.1,
            ease: "easeInOut"
          } : {
            duration: 0.3
          }}
        />
      ))}
    </div>
  )
}
