import { motion, useScroll, useTransform, useMotionValue } from 'framer-motion'
import { useState, useRef, useEffect, useMemo } from 'react'
import {
  BookOpen, Heart, Gamepad2, Users, ArrowRight, Zap,
  Star, Quote, Play, Layers, Code, RefreshCw,
  Target, MapPin, Mail, Sparkles, TrendingUp, Award,
  BarChart3, Code2
} from 'lucide-react'
import PageTransition from '../components/ui/PageTransition'
import {
  productInfo,
  coreFeatures,
  competitorData,
  comparisonDimensions,
  userTestimonials,
  wordCloudData
} from '../data/mock'

// Animation variants
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const } },
}

// Icon mapping
const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>> = {
  BookOpen,
  Heart,
  Gamepad2,
  Users,
  Layers,
  Code,
  RefreshCw,
}

// ===== Animated Background Component =====
function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let particles: Array<{
      x: number
      y: number
      vx: number
      vy: number
      size: number
      color: string
      alpha: number
    }> = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const createParticles = () => {
      particles = []
      const colors = ['#8b5cf6', '#ec4899', '#06b6d4', '#f59e0b', '#10b981']
      for (let i = 0; i < 50; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 3 + 1,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: Math.random() * 0.5 + 0.2,
        })
      }
    }

    const drawGradientOrbs = (time: number) => {
      const orbs = [
        { x: canvas.width * 0.2, y: canvas.height * 0.3, color: '#8b5cf6', size: 300 },
        { x: canvas.width * 0.8, y: canvas.height * 0.7, color: '#ec4899', size: 250 },
        { x: canvas.width * 0.5, y: canvas.height * 0.5, color: '#06b6d4', size: 200 },
      ]

      orbs.forEach((orb, index) => {
        const offsetX = Math.sin(time * 0.001 + index) * 50
        const offsetY = Math.cos(time * 0.001 + index) * 50
        
        const gradient = ctx.createRadialGradient(
          orb.x + offsetX, orb.y + offsetY, 0,
          orb.x + offsetX, orb.y + offsetY, orb.size
        )
        gradient.addColorStop(0, orb.color + '20')
        gradient.addColorStop(0.5, orb.color + '10')
        gradient.addColorStop(1, 'transparent')
        
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      })
    }

    const drawParticles = () => {
      particles.forEach((p) => {
        p.x += p.vx
        p.y += p.vy

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = p.color + Math.floor(p.alpha * 255).toString(16).padStart(2, '0')
        ctx.fill()
      })

      // Draw connections
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach((p2) => {
          const dx = p1.x - p2.x
          const dy = p1.y - p2.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < 150) {
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = `rgba(139, 92, 246, ${0.1 * (1 - dist / 150)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        })
      })
    }

    const animate = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      drawGradientOrbs(time)
      drawParticles()
      
      animationId = requestAnimationFrame(animate)
    }

    resize()
    createParticles()
    animationId = requestAnimationFrame(animate)

    window.addEventListener('resize', resize)

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationId)
    }
  }, [])

  const handleMouseMove = (e: React.MouseEvent) => {
    mouseX.set(e.clientX)
    mouseY.set(e.clientY)
  }

  return (
    <canvas
      ref={canvasRef}
      onMouseMove={handleMouseMove}
      className="absolute inset-0 pointer-events-auto"
      style={{ background: 'transparent' }}
    />
  )
}

// ===== Floating Icons Component =====
function FloatingIcons() {
  const icons = [
    { Icon: BookOpen, color: '#8b5cf6', delay: 0, x: '10%', y: '20%' },
    { Icon: Heart, color: '#ec4899', delay: 0.5, x: '85%', y: '15%' },
    { Icon: Gamepad2, color: '#06b6d4', delay: 1, x: '90%', y: '70%' },
    { Icon: Users, color: '#10b981', delay: 1.5, x: '5%', y: '75%' },
    { Icon: Sparkles, color: '#f59e0b', delay: 2, x: '75%', y: '40%' },
    { Icon: Zap, color: '#f43f5e', delay: 2.5, x: '20%', y: '60%' },
  ]

  return (
    <>
      {icons.map(({ Icon, color, delay, x, y }, index) => (
        <motion.div
          key={index}
          className="absolute pointer-events-none"
          style={{ left: x, top: y }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.2, 1],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 4,
            delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <div 
            className="p-4 rounded-2xl backdrop-blur-sm"
            style={{ 
              background: `${color}15`,
              border: `1px solid ${color}30`,
              boxShadow: `0 0 30px ${color}20`,
            }}
          >
            <Icon size={24} style={{ color }} />
          </div>
        </motion.div>
      ))}
    </>
  )
}

// ===== Hero Section =====
function HeroSection() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ['start start', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <section ref={scrollRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <motion.div style={{ y, opacity }} className="absolute inset-0">
        <AnimatedBackground />
        <FloatingIcons />
        
        {/* Grid Pattern Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(rgba(139, 92, 246, 0.5) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(139, 92, 246, 0.5) 1px, transparent 1px)`,
            backgroundSize: '80px 80px',
          }}
        />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-6xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        >
          

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-5xl sm:text-6xl lg:text-8xl font-bold tracking-tight mb-6"
          >
            <span className="gradient-text">{productInfo.name}</span>
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-text mb-4"
          >
            {productInfo.tagline}
          </motion.p>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-lg text-text-muted max-w-2xl mx-auto mb-8 leading-relaxed"
          >
            {productInfo.description}
          </motion.p>

          {/* Target Users */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-3 mb-10"
          >
            {productInfo.targetUsers.map((user, index) => (
              <motion.span
                key={user}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                whileHover={{ scale: 1.1, y: -2 }}
                className="px-4 py-1.5 rounded-full text-sm font-medium bg-surface/80 backdrop-blur-sm border border-border text-text-secondary hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10 transition-all cursor-default"
              >
                {user}
              </motion.span>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <motion.a
              href="/learning"
              whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(139, 92, 246, 0.4)' }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-white font-semibold shadow-lg shadow-primary/25 transition-all relative overflow-hidden group"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.6 }}
              />
              <Play size={18} />
              <span className="relative z-10">开始使用</span>
            </motion.a>
            <motion.a
              href="#features"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl glass-card font-semibold text-text hover:border-primary/30 transition-all backdrop-blur-md"
            >
              了解更多
              <ArrowRight size={18} />
            </motion.a>
          </motion.div>
        </motion.div>

        
      </div>
    </section>
  )
}

// ===== Feature Card Component =====
function FeatureCard({ feature, index }: { feature: typeof coreFeatures[0]; index: number }) {
  const Icon = iconMap[feature.icon] || BookOpen
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      variants={item}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative"
    >
      <div 
        className="glass-card h-full overflow-hidden transition-all duration-500"
        style={{
          borderColor: isHovered ? `${feature.color}40` : undefined,
          boxShadow: isHovered ? `0 0 40px ${feature.color}15` : undefined,
        }}
      >
        {/* Header with Gradient - Smaller on mobile */}
        <div className={`${feature.gradient} h-20 sm:h-32 flex items-center justify-center relative overflow-hidden`}>
          <motion.div
            animate={{ 
              scale: isHovered ? 1.1 : 1,
              rotate: isHovered ? 5 : 0,
            }}
            transition={{ duration: 0.4 }}
            className="relative z-10"
          >
            <Icon size={28} className="text-white sm:w-12 sm:h-12" />
          </motion.div>
          
          {/* Decorative Circles */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              animate={{ 
                x: isHovered ? 20 : 0,
                y: isHovered ? -20 : 0,
              }}
              className="absolute -top-10 -right-10 w-20 h-20 sm:w-40 sm:h-40 rounded-full bg-white/10"
            />
            <motion.div
              animate={{ 
                x: isHovered ? -20 : 0,
                y: isHovered ? 20 : 0,
              }}
              className="absolute -bottom-10 -left-10 w-16 h-16 sm:w-32 sm:h-32 rounded-full bg-white/10"
            />
          </div>
        </div>

        {/* Content - Compact on mobile */}
        <div className="p-3 sm:p-6">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <h3 className="text-sm sm:text-xl font-bold text-text">{feature.title}</h3>
            <span className="text-[10px] sm:text-xs font-medium text-text-muted uppercase tracking-wider hidden sm:inline">
              {feature.subtitle}
            </span>
          </div>
          
          <p className="text-text-muted text-xs sm:text-sm leading-relaxed mb-2 sm:mb-4 line-clamp-2 sm:line-clamp-none">
            {feature.description}
          </p>

          {/* Features List - Hidden on mobile */}
          <div className="hidden sm:flex flex-wrap gap-2 mb-4">
            {feature.features.map((item, i) => (
              <motion.span
                key={item}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 + i * 0.05 }}
                className="px-3 py-1 text-xs rounded-full bg-surface border border-border text-text-secondary"
              >
                {item}
              </motion.span>
            ))}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-3 sm:gap-4 pt-2 sm:pt-4 border-t border-border">
            <div className="flex items-center gap-1">
              <Users size={12} className="text-text-muted sm:w-4 sm:h-4" />
              <span className="text-xs sm:text-sm font-semibold text-text">{feature.stats.users}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star size={12} className="text-amber-400 sm:w-4 sm:h-4" />
              <span className="text-xs sm:text-sm font-semibold text-text">{feature.stats.satisfaction}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ===== Features Section =====
function FeaturesSection() {
  return (
    <section id="features" className="py-24 px-6 bg-gradient-section">
      <div className="mx-auto max-w-6xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-4">
            <Zap size={16} className="text-accent" />
            <span className="text-sm font-medium text-accent">核心功能</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-text mb-4">
            四大模块，覆盖你的数字生活
          </h2>
          <p className="text-text-muted max-w-xl mx-auto">
            从学习到娱乐，从生活到我的，一个平台满足你的全部需求
          </p>
        </motion.div>

        {/* Features Grid - Mobile: 2 columns, Desktop: 2 columns */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-2 gap-3 sm:gap-6"
        >
          {coreFeatures.map((feature, index) => (
            <FeatureCard key={feature.id} feature={feature} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ===== Word Cloud Component =====
function WordCloud() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const positions = useMemo(() => {
    // Pre-defined positions for consistent rendering - optimized for mobile to prevent overlap
    const basePositions = [
      { x: 10, y: 15, rotation: -5 },
      { x: 35, y: 10, rotation: 3 },
      { x: 60, y: 18, rotation: -3 },
      { x: 85, y: 12, rotation: 5 },
      { x: 15, y: 35, rotation: 4 },
      { x: 45, y: 30, rotation: -6 },
      { x: 75, y: 38, rotation: 2 },
      { x: 5, y: 55, rotation: -4 },
      { x: 30, y: 50, rotation: 6 },
      { x: 55, y: 58, rotation: -2 },
      { x: 80, y: 52, rotation: 4 },
      { x: 20, y: 72, rotation: -3 },
      { x: 50, y: 78, rotation: 5 },
      { x: 70, y: 70, rotation: -5 },
      { x: 90, y: 75, rotation: 3 },
      { x: 8, y: 88, rotation: -4 },
      { x: 38, y: 92, rotation: 4 },
      { x: 65, y: 88, rotation: -3 },
      { x: 88, y: 92, rotation: 2 },
      { x: 25, y: 65, rotation: -6 },
    ]
    return wordCloudData.map((_, idx) => basePositions[idx % basePositions.length])
  }, [])

  return (
    <div className="relative w-full h-[300px] overflow-hidden">
      {wordCloudData.map((word, index) => {
        const isHovered = hoveredIndex === index
        const pos = positions[index]
        
        return (
          <motion.span
            key={word.text}
            className="absolute cursor-pointer font-medium select-none"
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              color: word.color,
              fontSize: `${0.55 + word.weight * 0.1}rem`,
              transform: `rotate(${pos.rotation}deg)`,
              textShadow: isHovered ? `0 0 20px ${word.color}60` : 'none',
            }}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 0.8, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05, type: 'spring' }}
            whileHover={{ 
              scale: 1.2, 
              opacity: 1,
              zIndex: 10,
            }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {word.text}
          </motion.span>
        )
      })}
    </div>
  )
}

// ===== Radar Chart Component =====
function RadarChart() {
  const size = 260
  const center = size / 2
  const radius = 85
  const levels = 5

  const angleStep = (Math.PI * 2) / comparisonDimensions.length

  const getPoint = (index: number, value: number, maxValue: number) => {
    const angle = index * angleStep - Math.PI / 2
    const r = (value / maxValue) * radius
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    }
  }

  const gridLines = Array.from({ length: levels }, (_, i) => {
    const points = comparisonDimensions.map((_, index) => {
      const point = getPoint(index, (i + 1) * 20, 100)
      return `${point.x},${point.y}`
    })
    return points.join(' ')
  })

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full max-w-[300px] mx-auto">
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-auto overflow-visible">
          {/* Grid Lines */}
          {gridLines.map((points, i) => (
            <polygon
              key={i}
              points={points}
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              className="text-border"
              opacity={0.2}
            />
          ))}

          {/* Axes */}
          {comparisonDimensions.map((_, index) => {
            const end = getPoint(index, 100, 100)
            return (
              <line
                key={index}
                x1={center}
                y1={center}
                x2={end.x}
                y2={end.y}
                stroke="currentColor"
                strokeWidth="1"
                className="text-border"
                opacity={0.15}
              />
            )
          })}

          {/* Data Polygons - draw from inner (低均分) 到外层 (高均分) */}
          {[...competitorData]
            .map((c) => ({
              competitor: c,
              avg:
                (c.scores.functionality +
                  c.scores.usability +
                  c.scores.aesthetics +
                  c.scores.performance +
                  c.scores.extensibility) /
                5,
            }))
            .sort((a, b) => a.avg - b.avg)
            .map(({ competitor }, compIndex, arr) => {
            const scores = comparisonDimensions.map(d => competitor.scores[d.key as keyof typeof competitor.scores])
            const dataPoints = scores.map((score, index) => getPoint(index, score, 100))
            const polygonPoints = dataPoints.map((p) => `${p.x},${p.y}`).join(' ')

            return (
              <motion.g key={competitor.name}>
                <motion.polygon
                  points={polygonPoints}
                  fill={competitor.color}
                  fillOpacity={compIndex === arr.length - 1 ? 0.18 : 0.06}
                  stroke={competitor.color}
                  strokeWidth={compIndex === arr.length - 1 ? 3 : compIndex === arr.length - 2 ? 2 : 1}
                  strokeDasharray={compIndex === arr.length - 1 ? '0' : '4 4'}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: compIndex * 0.15 }}
                />
                {compIndex === arr.length - 1 && dataPoints.map((point, index) => (
                  <motion.g key={index}>
                    <motion.circle
                      cx={point.x}
                      cy={point.y}
                      r="6"
                      fill={competitor.color}
                      stroke="white"
                      strokeWidth="2"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 + index * 0.1, type: 'spring' }}
                    />
                    <motion.circle
                      cx={point.x}
                      cy={point.y}
                      r="12"
                      fill={competitor.color}
                      opacity="0.2"
                      initial={{ scale: 0 }}
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 2, repeat: Infinity }}
                    />
                  </motion.g>
                ))}
              </motion.g>
            )
          })}

          {/* Labels */}
          {comparisonDimensions.map((dim, index) => {
            const point = getPoint(index, 120, 100)
            return (
              <text
                key={dim.key}
                x={point.x}
                y={point.y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-text text-[11px] font-medium"
              >
                {dim.name}
              </text>
            )
          })}
        </svg>
      </div>
    </div>
  )
}

// ===== Comparison Card Component =====
function ComparisonCard({ 
  competitor, 
  index, 
  isActive, 
  onClick 
}: { 
  competitor: typeof competitorData[0]
  index: number
  isActive: boolean
  onClick: () => void
}) {
  const avgScore = Math.round(
    Object.values(competitor.scores).reduce((a, b) => a + b, 0) / 5
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      onClick={onClick}
      className={`glass-card p-3 cursor-pointer transition-all duration-300 ${
        isActive ? 'ring-2' : ''
      }`}
      style={{ 
        boxShadow: isActive ? `0 0 0 2px ${competitor.color}50` : undefined 
      }}
      whileHover={{ y: -2, boxShadow: `0 8px 30px ${competitor.color}20` }}
    >
      <div className="flex items-center gap-2 mb-2">
        <div 
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${competitor.color}15` }}
        >
          <div 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: competitor.color }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className={`font-semibold text-xs truncate ${isActive ? 'text-text' : 'text-text'}`}>
            {competitor.name}
          </h4>
          <div className="flex items-center gap-1">
            <TrendingUp size={10} className="text-text-muted" />
            <span className="text-[10px] text-text-muted">评分</span>
          </div>
        </div>
        <div 
          className="text-xl font-bold"
          style={{ color: competitor.color }}
        >
          {avgScore}
        </div>
      </div>

      {/* Mini Progress Bars */}
      <div className="space-y-1">
        {comparisonDimensions.slice(0, 3).map((dim) => (
          <div key={dim.key} className="flex items-center gap-1.5">
            <span className="text-[9px] text-text-muted w-10 truncate">{dim.name}</span>
            <div className="flex-1 h-1 bg-surface rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: competitor.color }}
                initial={{ width: 0 }}
                whileInView={{ width: `${competitor.scores[dim.key as keyof typeof competitor.scores]}%` }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + index * 0.1, duration: 0.6 }}
              />
            </div>
            <span className="text-[9px] text-text-muted w-4">
              {competitor.scores[dim.key as keyof typeof competitor.scores]}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

// ===== Comparison Section =====
function ComparisonSection() {
  const [activeCompetitor, setActiveCompetitor] = useState(0)

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 relative overflow-hidden">
      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Target size={16} className="text-primary" />
            <span className="text-sm font-medium text-primary">竞品分析</span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-text mb-4">
            为什么选择 <span className="gradient-text">SuperUI</span>？
          </h2>
          <p className="text-text-muted max-w-2xl mx-auto text-sm sm:text-base">
            与市面上主流的个人管理工具相比，SuperUI 在功能丰富度、美观度和易用性上都有着明显的优势
          </p>
        </motion.div>

        {/* Main Content Grid - Compact Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          {/* Left: Competitor Cards - Compact */}
          <div className="lg:col-span-3 space-y-3">
            {competitorData.map((competitor, index) => (
              <ComparisonCard
                key={competitor.name}
                competitor={competitor}
                index={index}
                isActive={activeCompetitor === index}
                onClick={() => setActiveCompetitor(index)}
              />
            ))}

            {/* Feature Highlights - Enhanced Design */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="glass-card p-4 mt-4 relative overflow-hidden"
            >
              {/* Decorative gradient */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-primary/20 to-transparent rounded-full blur-xl" />
              
              <h4 className="font-semibold text-text mb-3 flex items-center gap-2 text-sm relative z-10">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                  <Award size={14} className="text-white" />
                </div>
                <span className="gradient-text">核心优势</span>
              </h4>
              
              <div className="grid grid-cols-2 gap-2 relative z-10">
                {[
                  { icon: Layers, text: 'All in ai', desc: '整合方案' },
                  { icon: Sparkles, text: '现代化', desc: 'UI/UX 设计' },
                  { icon: BarChart3, text: '强大的', desc: '可视化能力' },
                  { icon: Code2, text: '开源', desc: '可扩展' },
                ].map((item, i) => (
                  <motion.div
                    key={item.text}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className="flex items-center gap-2 p-2 rounded-lg bg-surface/50 hover:bg-surface transition-colors group"
                  >
                    <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <item.icon size={12} className="text-primary" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-medium text-text leading-tight">{item.text}</span>
                      <span className="text-[9px] text-text-muted leading-tight">{item.desc}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right: Radar Chart & Word Cloud - Side by side on mobile */}
          <div className="lg:col-span-9">
            <div className="grid grid-cols-2 gap-3 sm:gap-6 h-full">
              {/* Radar Chart */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="glass-card p-3 sm:p-6 flex flex-col"
              >
                <h3 className="text-sm sm:text-lg font-semibold text-text mb-2 sm:mb-4 text-center">能力雷达图</h3>
                <div className="flex-1 flex items-center justify-center min-h-[150px] sm:min-h-[200px]">
                  <RadarChart />
                </div>
                
                {/* Legend */}
                <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-2 sm:mt-4 pt-2 sm:pt-4 border-t border-border">
                  {competitorData.map((competitor) => (
                    <div 
                      key={competitor.name} 
                      className="flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs"
                    >
                      <div
                        className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full"
                        style={{ backgroundColor: competitor.color }}
                      />
                      <span className={competitor.name === 'SuperUI' ? 'font-medium text-text' : 'text-text-muted'}>
                        {competitor.name}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Word Cloud */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="glass-card p-3 sm:p-6 flex flex-col"
              >
                <h3 className="text-sm sm:text-lg font-semibold text-text mb-0.5 sm:mb-2 text-center">产品特性词云</h3>
                <p className="text-[10px] sm:text-xs text-text-muted text-center mb-2 sm:mb-4">悬停查看热门标签</p>
                <div className="flex-1 flex items-center justify-center min-h-[150px] sm:min-h-[200px]">
                  <WordCloud />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ===== Testimonial Card =====
function TestimonialCard({ testimonial }: { testimonial: typeof userTestimonials[0] }) {
  return (
    <div className="glass-card p-5 w-75 shrink-0">
      <div className="flex items-start gap-3 mb-3">
        <img
          src={testimonial.avatar}
          alt={testimonial.name}
          className="w-10 h-10 rounded-full bg-surface"
        />
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-text text-sm">{testimonial.name}</h4>
          <p className="text-xs text-text-muted">{testimonial.role}</p>
        </div>
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={12}
              className={i < testimonial.rating ? 'text-amber-400 fill-amber-400' : 'text-text-muted'}
            />
          ))}
        </div>
      </div>
      
      <div className="relative mb-3">
        <Quote size={16} className="absolute -top-1 -left-1 text-primary/30" />
        <p className="text-sm text-text-secondary leading-relaxed pl-4">
          {testimonial.content}
        </p>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div className="flex flex-wrap gap-1">
          {testimonial.tags.map(tag => (
            <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary">
              {tag}
            </span>
          ))}
        </div>
        <span className="text-xs text-text-muted">{testimonial.usageTime}</span>
      </div>
    </div>
  )
}

// ===== Testimonials Wall =====
function TestimonialsWall() {
  const row1 = userTestimonials.slice(0, 4)
  const row2 = userTestimonials.slice(4)

  return (
    <section className="py-24 bg-gradient-section overflow-hidden">
      <div className="mx-auto max-w-6xl px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose/10 border border-rose/20 mb-4">
            <Heart size={16} className="text-rose" />
            <span className="text-sm font-medium text-rose">用户评价</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-text mb-4">
            听听他们怎么说
          </h2>
          <p className="text-text-muted max-w-xl mx-auto">
            来自真实用户的反馈，是我们不断前进的动力
          </p>
        </motion.div>
      </div>

      {/* Scrolling Wall - Full Width, Outside Container */}
      <div className="space-y-4">
        {/* Row 1 - Left to Right - Faster on mobile */}
        <div className="relative overflow-hidden">
          <motion.div
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            className="flex gap-4 hover:[animation-play-state:paused]"
          >
            {[...row1, ...row1, ...row1, ...row1, ...row1, ...row1, ...row1, ...row1].map((testimonial, index) => (
              <TestimonialCard key={`r1-${testimonial.id}-${index}`} testimonial={testimonial} />
            ))}
          </motion.div>
        </div>

        {/* Row 2 - Right to Left - Faster on mobile */}
        <div className="relative overflow-hidden">
          <motion.div
            animate={{ x: ['-50%', '0%'] }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            className="flex gap-4 hover:[animation-play-state:paused]"
          >
            {[...row2, ...row2, ...row2, ...row2, ...row2, ...row2, ...row2, ...row2].map((testimonial, index) => (
              <TestimonialCard key={`r2-${testimonial.id}-${index}`} testimonial={testimonial} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ===== CTA Section =====
function CTASection() {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-rose/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text mb-6">
            准备好开启你的
            <span className="gradient-text"> 数字生活 </span>
            了吗？
          </h2>
          <p className="text-lg text-text-muted mb-10 max-w-2xl mx-auto">
            加入 25,000+ 用户，体验全新的个人管理方式。让 SuperUI 成为你数字生活的得力助手。
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <motion.a
              href="/learning"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-white font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow"
            >
              立即开始
              <ArrowRight size={18} />
            </motion.a>
            <motion.a
              href="/social"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl glass-card font-semibold text-text hover:border-primary/30 transition-colors"
            >
              <Users size={18} />
              加入社区
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ===== Footer =====
function Footer() {
  return (
    <footer className="border-t border-border py-12 px-6">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold gradient-text mb-2">{productInfo.name}</h3>
            <p className="text-text-muted text-sm mb-4">{productInfo.tagline}</p>
            <p className="text-text-muted text-sm">{productInfo.description}</p>
          </div>

          {/* Quick Links & Contact - Side by Side on Mobile */}
          <div className="grid grid-cols-2 gap-4 md:contents">
            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-text mb-3 md:mb-4">快速链接</h4>
              <div className="flex flex-col gap-2">
                <a href="/learning" className="text-sm text-text-muted hover:text-primary transition-colors">学习空间</a>
                <a href="/life" className="text-sm text-text-muted hover:text-primary transition-colors">生活管理</a>
                <a href="/entertainment" className="text-sm text-text-muted hover:text-primary transition-colors">娱乐中心</a>
                <a href="/social" className="text-sm text-text-muted hover:text-primary transition-colors">我的互动</a>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold text-text mb-3 md:mb-4">联系我们</h4>
              <div className="flex flex-col gap-2 text-sm text-text-muted">
                <span className="flex items-center gap-2">
                  <Mail size={14} />
                  <span>hello@superui.dev</span>
                </span>
                <span className="flex items-center gap-2">
                  <MapPin size={14} />
                  <span>中国 · 深圳</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-text-muted">
            © 2026 {productInfo.name}. All rights reserved.
          </p>
          <p className="text-sm text-text-muted">
            Made with <Heart size={14} className="inline text-rose" /> by Xiaoye Team
          </p>
        </div>
      </div>
    </footer>
  )
}

// ===== Main Component =====
export default function Home() {
  return (
    <PageTransition>
      <HeroSection />
      <FeaturesSection />
      <ComparisonSection />
      <TestimonialsWall />
      <CTASection />
      <Footer />
    </PageTransition>
  )
}
