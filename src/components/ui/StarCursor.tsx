import { useEffect, useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSettings } from '../../hooks/useSettings'

interface Star {
  id: number
  x: number
  y: number
  size: number
  color: string
  rotation: number
  type: 'sparkle' | 'star' | 'diamond'
}

const starColors = [
  '#fbbf24', // amber-400 金色
  '#f59e0b', // amber-500 深金
  '#fcd34d', // amber-300 浅金
  '#f472b6', // pink-400 粉色
  '#ec4899', // pink-500 深粉
  '#a78bfa', // violet-400 紫色
  '#8b5cf6', // violet-500 深紫
  '#60a5fa', // blue-400 蓝色
  '#3b82f6', // blue-500 深蓝
  '#34d399', // emerald-400 绿色
  '#10b981', // emerald-500 深绿
  '#f87171', // red-400 红色
  '#22d3ee', // cyan-400 青色
  '#e879f9', // fuchsia-400 品红
]

// 星星SVG路径
const starPaths = {
  star: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  sparkle: 'M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z',
  diamond: 'M12 2L22 12L12 22L2 12L12 2Z',
}

export default function StarCursor() {
  const [stars, setStars] = useState<Star[]>([])
  const starIdRef = useRef(0)
  const starsRef = useRef<Star[]>([])
  const { cursorEffectEnabled } = useSettings()

  // 同步 starsRef 和 stars state
  useEffect(() => {
    starsRef.current = stars
  }, [stars])

  const createStar = useCallback((x: number, y: number, isBurst = false) => {
    const types: Array<'sparkle' | 'star' | 'diamond'> = ['sparkle', 'star', 'diamond']
    const newStar: Star = {
      id: starIdRef.current++,
      x,
      y,
      size: isBurst ? Math.random() * 16 + 12 : Math.random() * 10 + 6,
      color: starColors[Math.floor(Math.random() * starColors.length)],
      rotation: Math.random() * 360,
      type: types[Math.floor(Math.random() * types.length)],
    }

    setStars((prev) => {
      const updated = [...prev, newStar]
      // 限制最大星星数量
      return updated.length > 30 ? updated.slice(-30) : updated
    })

    // 自动移除星星
    setTimeout(() => {
      setStars((prev) => prev.filter((s) => s.id !== newStar.id))
    }, 800)
  }, [])

  useEffect(() => {
    let lastX = 0
    let lastY = 0
    let lastTime = 0
    const throttleMs = 40

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now()
      if (now - lastTime < throttleMs) return

      const distance = Math.sqrt(
        Math.pow(e.clientX - lastX, 2) + Math.pow(e.clientY - lastY, 2)
      )

      if (distance > 20) {
        createStar(e.clientX, e.clientY)
        lastX = e.clientX
        lastY = e.clientY
        lastTime = now
      }
    }

    // 点击爆发效果 - 生成更多星星
    const handleClick = (e: MouseEvent) => {
      const burstCount = 12
      for (let i = 0; i < burstCount; i++) {
        setTimeout(() => {
          const angle = (i / burstCount) * Math.PI * 2
          const distance = Math.random() * 60 + 20
          const offsetX = Math.cos(angle) * distance
          const offsetY = Math.sin(angle) * distance
          createStar(e.clientX + offsetX, e.clientY + offsetY, true)
        }, i * 25)
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('click', handleClick)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('click', handleClick)
    }
  }, [createStar])

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      <AnimatePresence mode="popLayout">
        {stars.map((star) => (
          <motion.div
            key={star.id}
            initial={{
              opacity: 1,
              scale: 0,
              rotate: star.rotation,
            }}
            animate={{
              opacity: [1, 1, 0],
              scale: [0, 1.3, 0.6],
              y: -40,
              rotate: star.rotation + 270,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.7,
              ease: [0.25, 0.46, 0.45, 0.94],
              times: [0, 0.3, 1],
            }}
            className="absolute"
            style={{
              left: star.x - star.size / 2,
              top: star.y - star.size / 2,
            }}
          >
            <svg
              width={star.size}
              height={star.size}
              viewBox="0 0 24 24"
              fill={star.color}
              style={{
                filter: `drop-shadow(0 0 ${star.size / 2}px ${star.color}) drop-shadow(0 0 ${star.size}px ${star.color}80)`,
                willChange: 'transform',
              }}
            >
              <path d={starPaths[star.type]} />
            </svg>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
