import { useState, useMemo, useRef, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Html } from '@react-three/drei'
import * as THREE from 'three'
import {
  radarDimensions,
  skillStats,
  skillCategories,
  recentLearning,
  type SkillNode,
} from '../../data/skillTree'
import {
  Award,
  Clock,
  Target,
  BookOpen,
  Zap,
  ChevronRight,
  ChevronDown,
  Star,
  Trophy,
  Activity,
  Network,
} from 'lucide-react'

// 雷达图组件
function RadarChart() {
  const size = 240
  const center = size / 2
  const radius = 75
  const levels = 5

  const angleStep = (Math.PI * 2) / radarDimensions.length

  // 计算点的坐标
  const getPoint = (index: number, value: number, maxValue: number) => {
    const angle = index * angleStep - Math.PI / 2
    const r = (value / maxValue) * radius
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    }
  }

  // 生成网格线
  const gridLines = useMemo(() => {
    const lines = []
    for (let i = 1; i <= levels; i++) {
      const points = radarDimensions.map((_, index) => {
        const point = getPoint(index, i * 20, 100)
        return `${point.x},${point.y}`
      })
      lines.push(points.join(' '))
    }
    return lines
  }, [])

  // 生成数据多边形
  const dataPoints = radarDimensions.map((dim, index) =>
    getPoint(index, dim.score, dim.fullMark)
  )
  const dataPath = dataPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z'

  // 生成轴标签位置
  const labelPoints = radarDimensions.map((dim, index) => {
    const point = getPoint(index, 115, 100)
    return { ...point, name: dim.name }
  })

  return (
    <div className="flex flex-col items-center w-full">
      <div className="relative w-full max-w-[320px] mx-auto">
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-auto overflow-visible">
          {/* 背景网格 */}
          {gridLines.map((points, i) => (
            <polygon
              key={i}
              points={points}
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              className="text-border"
              opacity={0.5}
            />
          ))}

          {/* 轴线 */}
          {radarDimensions.map((_, index) => {
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
                opacity={0.3}
              />
            )
          })}

          {/* 数据区域 */}
          <motion.polygon
            points={dataPath}
            fill="url(#radarGradient)"
            stroke="#8b5cf6"
            strokeWidth="2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          />

          {/* 数据边线 */}
          <motion.path
            d={dataPath.replace(/M/g, 'M').replace(/L/g, 'L').replace(/ Z/, '')}
            fill="none"
            stroke="#8b5cf6"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          />

          {/* 数据点 */}
          {dataPoints.map((point, index) => (
            <motion.g key={index}>
              <motion.circle
                cx={point.x}
                cy={point.y}
                r="6"
                fill={radarDimensions[index].color}
                stroke="white"
                strokeWidth="2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              />
              <motion.circle
                cx={point.x}
                cy={point.y}
                r="10"
                fill={radarDimensions[index].color}
                opacity="0.3"
                initial={{ scale: 0 }}
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ delay: 0.5 + index * 0.1, duration: 1.5, repeat: Infinity }}
              />
            </motion.g>
          ))}

          {/* 轴标签 */}
          {labelPoints.map((label, index) => (
            <text
              key={index}
              x={label.x}
              y={label.y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-text font-medium"
              style={{ fontSize: '10px' }}
            >
              {label.name}
            </text>
          ))}

          {/* 渐变定义 */}
          <defs>
            <radialGradient id="radarGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.15" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      {/* 维度标签 */}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-4 px-2">
        {radarDimensions.map((dim, index) => (
          <div key={index} className="flex items-center gap-1 sm:gap-1.5 text-xs">
            <div
              className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: dim.color }}
            />
            <span className="text-text-muted hidden sm:inline">{dim.name}</span>
            <span className="font-semibold text-text">{dim.score}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// 3D知识图谱节点数据
const knowledgeNodes = [
  { id: 'ai', name: 'AI', position: [0, 0, 0], color: '#8b5cf6', size: 0.8 },
  { id: 'ml', name: '机器学习', position: [-2, 1.5, 0.5], color: '#ec4899', size: 0.6 },
  { id: 'dl', name: '深度学习', position: [2, 1.5, -0.5], color: '#3b82f6', size: 0.6 },
  { id: 'nlp', name: 'NLP', position: [-1.5, -1.5, 1], color: '#10b981', size: 0.55 },
  { id: 'cv', name: 'CV', position: [1.5, -1.5, -1], color: '#f59e0b', size: 0.55 },
  { id: 'rl', name: '强化学习', position: [0, 2, -1], color: '#06b6d4', size: 0.5 },
  { id: 'transformer', name: 'Transformer', position: [-2.5, 0, -0.5], color: '#f472b6', size: 0.5 },
  { id: 'cnn', name: 'CNN', position: [2.5, 0, 0.5], color: '#8b5cf6', size: 0.5 },
  { id: 'rnn', name: 'RNN', position: [-0.8, -2, 0], color: '#60a5fa', size: 0.45 },
  { id: 'llm', name: '大模型', position: [0.8, -2, 1], color: '#34d399', size: 0.5 },
  { id: 'pytorch', name: 'PyTorch', position: [-2, -0.8, -1], color: '#f97316', size: 0.45 },
  { id: 'tensorflow', name: 'TF', position: [2, -0.8, 1], color: '#fbbf24', size: 0.45 },
]

const knowledgeLinks = [
  ['ai', 'ml'], ['ai', 'dl'], ['ai', 'nlp'], ['ai', 'cv'], ['ai', 'rl'],
  ['ml', 'dl'], ['dl', 'transformer'], ['dl', 'cnn'], ['dl', 'rnn'],
  ['nlp', 'transformer'], ['nlp', 'llm'], ['cv', 'cnn'],
  ['ml', 'pytorch'], ['ml', 'tensorflow'], ['dl', 'pytorch'], ['dl', 'tensorflow'],
]

// 3D节点组件
function KnowledgeNode({ node, onHover }: { node: typeof knowledgeNodes[0]; onHover: (node: typeof knowledgeNodes[0] | null) => void }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3
    }
  })

  return (
    <group position={node.position as [number, number, number]}>
      <mesh
        ref={meshRef}
        onPointerOver={() => { setHovered(true); onHover(node) }}
        onPointerOut={() => { setHovered(false); onHover(null) }}
        scale={hovered ? node.size * 1.3 : node.size}
      >
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial
          color={node.color}
          emissive={node.color}
          emissiveIntensity={hovered ? 0.5 : 0.2}
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>
      {hovered && (
        <Html distanceFactor={10}>
          <div className="bg-surface/90 backdrop-blur-sm px-3 py-2 rounded-lg border border-border shadow-lg whitespace-nowrap">
            <p className="text-text font-medium text-sm">{node.name}</p>
          </div>
        </Html>
      )}
    </group>
  )
}

// 3D连线组件
function KnowledgeLink({ start, end, color }: { start: number[]; end: number[]; color: string }) {
  const points = [new THREE.Vector3(...start as [number, number, number]), new THREE.Vector3(...end as [number, number, number])]
  const geometry = new THREE.BufferGeometry().setFromPoints(points)

  return (
    <primitive object={new THREE.Line(geometry, new THREE.LineBasicMaterial({ color, opacity: 0.4, transparent: true }))} />
  )
}

// 3D知识图谱场景
function KnowledgeGraphScene({ onHover }: { onHover: (node: typeof knowledgeNodes[0] | null) => void }) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.05
    }
  })

  return (
    <group ref={groupRef}>
      {/* 节点 */}
      {knowledgeNodes.map((node) => (
        <KnowledgeNode key={node.id} node={node} onHover={onHover} />
      ))}

      {/* 连线 */}
      {knowledgeLinks.map((link, index) => {
        const startNode = knowledgeNodes.find(n => n.id === link[0])
        const endNode = knowledgeNodes.find(n => n.id === link[1])
        if (!startNode || !endNode) return null
        return (
          <KnowledgeLink
            key={index}
            start={startNode.position}
            end={endNode.position}
            color="#8b5cf6"
          />
        )
      })}

      {/* 环境光 */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#8b5cf6" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ec4899" />
    </group>
  )
}

// 3D知识图谱组件
function KnowledgeGraph() {
  const [, setHoveredNode] = useState<typeof knowledgeNodes[0] | null>(null)

  return (
    <div className="w-full h-[200px] sm:h-[260px] md:h-[300px] rounded-xl overflow-hidden bg-gradient-to-b from-surface/50 to-surface">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <KnowledgeGraphScene onHover={setHoveredNode} />
          <OrbitControls
            enableZoom={true}
            enablePan={false}
            minDistance={5}
            maxDistance={15}
            autoRotate
            autoRotateSpeed={0.5}
          />
        </Suspense>
      </Canvas>

      {/* 操作提示 */}
      <div className="absolute bottom-2 left-2 right-2 flex justify-center">
        <div className="flex items-center gap-2 sm:gap-4 text-[10px] sm:text-xs text-text-muted bg-surface/80 backdrop-blur-sm px-2 sm:px-4 py-1.5 sm:py-2 rounded-full">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-primary/20 flex items-center justify-center text-[8px] sm:text-xs">↻</span>
            <span className="hidden sm:inline">拖动旋转</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-primary/20 flex items-center justify-center text-[8px] sm:text-xs">⚲</span>
            <span className="hidden sm:inline">滚轮缩放</span>
          </span>
          <span className="flex items-center gap-1 sm:hidden">
            <span className="w-3 h-3 rounded-full bg-primary/20 flex items-center justify-center text-[8px]">👆</span>
            点击查看
          </span>
          <span className="items-center gap-1 hidden sm:flex">
            <span className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center text-xs">👆</span>
            悬停查看
          </span>
        </div>
      </div>
    </div>
  )
}

// 技能树节点组件
function SkillTreeNode({
  node,
  depth = 0,
  parentExpanded = true,
}: {
  node: SkillNode
  depth?: number
  parentExpanded?: boolean
}) {
  const [expanded, setExpanded] = useState(depth < 1)
  const hasChildren = node.children && node.children.length > 0

  const getLevelColor = (level: number) => {
    if (level >= 90) return 'bg-emerald-500'
    if (level >= 80) return 'bg-blue-500'
    if (level >= 70) return 'bg-amber-500'
    if (level >= 60) return 'bg-orange-500'
    return 'bg-red-500'
  }

  const getLevelText = (level: number) => {
    if (level >= 90) return '精通'
    if (level >= 80) return '熟练'
    if (level >= 70) return '良好'
    if (level >= 60) return '入门'
    return '初学'
  }

  return (
    <div className={`${!parentExpanded ? 'hidden' : ''}`}>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-2 py-2"
        style={{ paddingLeft: `${depth * 24}px` }}
      >
        {/* 连接线 */}
        {depth > 0 && (
          <div className="absolute left-0 w-4 h-px bg-border" style={{ marginLeft: `${(depth - 1) * 24 + 16}px` }} />
        )}

        {/* 展开按钮 */}
        {hasChildren ? (
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center justify-center w-5 h-5 rounded bg-surface border border-border text-text-muted hover:text-text transition-colors"
          >
            {expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
          </button>
        ) : (
          <div className="w-5 h-5" />
        )}

        {/* 技能信息 */}
        <div className="flex-1 flex items-center gap-3 min-w-0">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium text-text text-sm truncate">{node.name}</span>
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${getLevelColor(node.level)} text-white font-medium`}>
                {getLevelText(node.level)}
              </span>
            </div>
            <p className="text-xs text-text-muted truncate">{node.description}</p>
          </div>

          {/* 进度条 */}
          <div className="w-20 sm:w-24 flex-shrink-0">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-text-muted">{node.level}%</span>
            </div>
            <div className="h-1.5 bg-surface rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${getLevelColor(node.level)}`}
                initial={{ width: 0 }}
                animate={{ width: `${node.level}%` }}
                transition={{ duration: 0.8, delay: 0.2 }}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* 子节点 */}
      <AnimatePresence>
        {expanded && hasChildren && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden relative"
          >
            {/* 垂直连接线 */}
            <div
              className="absolute w-px bg-border"
              style={{
                left: `${depth * 24 + 26}px`,
                top: 0,
                bottom: 0,
              }}
            />
            {node.children!.map((child) => (
              <SkillTreeNode
                key={child.id}
                node={child}
                depth={depth + 1}
                parentExpanded={expanded}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// 统计卡片组件
function StatCard({
  icon: Icon,
  label,
  value,
  color,
  delay = 0,
}: {
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>
  label: string
  value: string | number
  color: string
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass-card p-4 flex items-center gap-3"
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center"
        style={{ backgroundColor: `${color}20` }}
      >
        <Icon size={20} style={{ color }} />
      </div>
      <div>
        <p className="text-2xl font-bold text-text">{value}</p>
        <p className="text-xs text-text-muted">{label}</p>
      </div>
    </motion.div>
  )
}

// 技能分类卡片
function CategoryCard({
  category,
  index,
}: {
  category: (typeof skillCategories)[0]
  index: number
}) {
  const [expanded, setExpanded] = useState(index < 3)

  const totalSkills = category.skills.length
  const avgLevel = Math.round(
    category.skills.reduce((sum, s) => sum + s.level, 0) / totalSkills
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="glass-card overflow-hidden"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-surface/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{category.icon}</span>
          <div className="text-left">
            <h3 className="font-semibold text-text">{category.name}</h3>
            <p className="text-xs text-text-muted">
              {totalSkills} 个技能 · 平均 {avgLevel}%
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-20 h-2 bg-surface rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${avgLevel}%`, backgroundColor: category.color }}
            />
          </div>
          {expanded ? <ChevronDown size={18} className="text-text-muted" /> : <ChevronRight size={18} className="text-text-muted" />}
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="overflow-hidden border-t border-border"
          >
            <div className="p-4">
              {category.skills.map((skill) => (
                <SkillTreeNode key={skill.id} node={skill} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// 最近学习记录
function RecentLearning() {
  return (
    <div className="space-y-3">
      {recentLearning.map((item, index) => (
        <motion.div
          key={item.skill}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center gap-3 p-3 rounded-lg bg-surface/50 hover:bg-surface transition-colors"
        >
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <BookOpen size={18} className="text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-text text-sm truncate">{item.skill}</h4>
            <p className="text-xs text-text-muted">{item.category} · {item.date}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-16 h-1.5 bg-surface rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${item.progress}%` }}
              />
            </div>
            <span className="text-xs font-medium text-text">{item.progress}%</span>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

// 主组件
export default function SkillTreeView() {
  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-4"
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-text mb-2">AI技能树</h1>
        <p className="text-text-muted">探索人工智能领域的技能体系，追踪学习进度</p>
      </motion.div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Target}
          label="总技能数"
          value={skillStats.totalSkills}
          color="#8b5cf6"
          delay={0}
        />
        <StatCard
          icon={Trophy}
          label="已掌握"
          value={skillStats.masteredSkills}
          color="#10b981"
          delay={0.1}
        />
        <StatCard
          icon={Activity}
          label="学习中"
          value={skillStats.learningSkills}
          color="#f59e0b"
          delay={0.2}
        />
        <StatCard
          icon={Clock}
          label="学习时长"
          value={`${skillStats.totalHours}h`}
          color="#06b6d4"
          delay={0.3}
        />
      </div>

      {/* 雷达图和知识图谱 - 并排显示 */}
      <div className="grid grid-cols-2 gap-4 sm:gap-6">
        {/* 雷达图 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-4 sm:p-6"
        >
          <h2 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
            <Zap size={18} className="text-primary" />
            技能雷达图
          </h2>
          <RadarChart />
        </motion.div>

        {/* 3D知识图谱 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-4 sm:p-6 relative"
        >
          <h2 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
            <Network size={18} className="text-primary" />
            知识图谱
          </h2>
          <KnowledgeGraph />
        </motion.div>
      </div>

      {/* 技能分类 */}
      <div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-lg font-semibold text-text mb-4 flex items-center gap-2"
        >
          <Award size={18} className="text-primary" />
          技能分类
        </motion.h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {skillCategories.map((category, index) => (
            <CategoryCard key={category.id} category={category} index={index} />
          ))}
        </div>
      </div>

      {/* 最近学习 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass-card p-6"
      >
        <h2 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
          <Star size={18} className="text-primary" />
          最近学习
        </h2>
        <RecentLearning />
      </motion.div>
    </div>
  )
}
