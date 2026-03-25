import { motion, useInView, type Variants } from 'framer-motion'
import { useRef, type ReactNode } from 'react'

interface AnimatedSectionProps {
  children: ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  duration?: number
  once?: boolean
  amount?: number
}

const getVariants = (direction: string): Variants => {
  const directions: Record<string, { x?: number; y?: number }> = {
    up: { y: 40 },
    down: { y: -40 },
    left: { x: 40 },
    right: { x: -40 },
    none: {}
  }

  const { x = 0, y = 0 } = directions[direction] || directions.up

  return {
    hidden: {
      opacity: 0,
      x,
      y
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0
    }
  }
}

export function AnimatedSection({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  duration = 0.6,
  once = true,
  amount = 0.2
}: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once, amount })

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={getVariants(direction)}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1]
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// 交错动画容器
interface StaggerContainerProps {
  children: ReactNode
  className?: string
  staggerDelay?: number
  once?: boolean
}

export function StaggerContainer({
  children,
  className = '',
  staggerDelay = 0.1,
  once = true
}: StaggerContainerProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once, amount: 0.1 })

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// 交错动画子元素
interface StaggerItemProps {
  children: ReactNode
  className?: string
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
}

export function StaggerItem({
  children,
  className = '',
  direction = 'up'
}: StaggerItemProps) {
  return (
    <motion.div
      variants={getVariants(direction)}
      transition={{
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1]
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// 浮动动画组件
interface FloatingProps {
  children: ReactNode
  className?: string
  amplitude?: number
  duration?: number
}

export function Floating({
  children,
  className = '',
  amplitude = 10,
  duration = 3
}: FloatingProps) {
  return (
    <motion.div
      animate={{
        y: [-amplitude, amplitude, -amplitude]
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// 发光效果组件
interface GlowProps {
  children: ReactNode
  className?: string
  color?: string
  intensity?: 'low' | 'medium' | 'high'
}

export function Glow({
  children,
  className = '',
  color = 'currentColor',
  intensity = 'medium'
}: GlowProps) {
  const intensityMap = {
    low: '0 0 20px',
    medium: '0 0 40px',
    high: '0 0 60px'
  }

  return (
    <motion.div
      whileHover={{
        filter: `drop-shadow(${intensityMap[intensity]} ${color})`
      }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// 脉冲动画组件
interface PulseProps {
  children: ReactNode
  className?: string
  scale?: number
  duration?: number
}

export function Pulse({
  children,
  className = '',
  scale = 1.05,
  duration = 2
}: PulseProps) {
  return (
    <motion.div
      animate={{
        scale: [1, scale, 1]
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// 计数动画组件
interface CountUpProps {
  end: number
  duration?: number
  suffix?: string
  className?: string
}

export function CountUp({
  end,
  duration = 2,
  suffix = '',
  className = ''
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })

  return (
    <motion.span
      ref={ref}
      className={className}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
    >
      {isInView && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <CountUpAnimation end={end} duration={duration} />
          {suffix}
        </motion.span>
      )}
    </motion.span>
  )
}

// 计数动画实现
function CountUpAnimation({ end }: { end: number; duration: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
    >
      <motion.span
        initial={{ opacity: 1 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      >
        {end}
      </motion.span>
    </motion.span>
  )
}

// 视差滚动组件
interface ParallaxProps {
  children: ReactNode
  className?: string
  speed?: number
}

export function Parallax({
  children,
  className = '',
  speed = 0.5
}: ParallaxProps) {
  return (
    <motion.div
      initial={{ y: 0 }}
      whileInView={{ y: speed * 100 }}
      transition={{ type: 'spring', stiffness: 100 }}
      viewport={{ once: false }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
