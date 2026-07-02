import React, { useState, useEffect, useMemo, useRef, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Html } from '@react-three/drei'
import * as THREE from 'three'
import { 
  X, Zap, Brain, Target, Trophy, Activity, Clock, 
  Award, BookOpen, Star, Network, ChevronRight, ChevronDown,
  Sparkles, Shield, User, Briefcase, GraduationCap
} from 'lucide-react'

// --- Data Types ---
interface SkillNode {
  id: string
  name: string
  level: number
  description: string
  children?: SkillNode[]
}

interface SkillCategory {
  id: string
  name: string
  icon: React.ReactNode
  color: string
  skills: SkillNode[]
}

// --- Radar Chart Component ---
function RadarChart({ dimensions, isDark = true }: { dimensions: { name: string; score: number; color: string }[]; isDark?: boolean }) {
  const size = 200
  const center = size / 2
  const radius = 60
  const levels = 5
  const angleStep = (Math.PI * 2) / dimensions.length

  const getPoint = (index: number, value: number, maxValue: number) => {
    const angle = index * angleStep - Math.PI / 2
    const r = (value / maxValue) * radius
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    }
  }

  const gridLines = useMemo(() => {
    const lines = []
    for (let i = 1; i <= levels; i++) {
      const points = dimensions.map((_, index) => {
        const point = getPoint(index, i * 20, 100)
        return `${point.x},${point.y}`
      })
      lines.push(points.join(' '))
    }
    return lines
  }, [dimensions])

  const dataPoints = dimensions.map((dim, index) => getPoint(index, dim.score, 100))
  const dataPath = dataPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z'

  return (
    <div className="flex flex-col items-center w-full">
      <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-auto max-w-[200px] overflow-visible">
        <defs>
          <radialGradient id="skillRadarGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.1" />
          </radialGradient>
          <filter id="radarGlow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        
        {/* Grid and Axes */}
        {gridLines.map((points, i) => (
          <polygon key={i} points={points} fill="none" stroke={isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"} strokeWidth="0.5" />
        ))}
        {dimensions.map((_, index) => {
          const end = getPoint(index, 100, 100)
          return <line key={index} x1={center} y1={center} x2={end.x} y2={end.y} stroke={isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"} strokeWidth="0.5" />
        })}

        {/* Data Area Path */}
        <motion.path
          d={dataPath}
          fill="url(#skillRadarGradient)"
          stroke="#8b5cf6"
          strokeWidth="2"
          filter="url(#radarGlow)"
          initial={{ opacity: 0, pathLength: 0 }}
          animate={{ opacity: 1, pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />

        {/* Labels and Points */}
        {dataPoints.map((point, index) => {
          const labelPos = getPoint(index, 125, 100)
          return (
            <g key={index}>
              <circle cx={point.x} cy={point.y} r="3" fill={dimensions[index].color} stroke="white" strokeWidth="1" className="shadow-lg" />
              <text
                x={labelPos.x}
                y={labelPos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="font-bold"
                style={{ fontSize: '8px' }}
              >
                <tspan x={labelPos.x} dy="-4" fill={isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)"}>{dimensions[index].name}</tspan>
                <tspan x={labelPos.x} dy="9" fill={dimensions[index].color} className="text-[7px]">{dimensions[index].score}</tspan>
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

// --- 3D Knowledge Graph Components ---
const knowledgeNodes = [
  { id: 'tech', name: '技术', position: [0, 0, 0], color: '#8b5cf6', size: 0.8 },
  { id: 'soft', name: '软技能', position: [-2, 1.5, 0.5], color: '#ec4899', size: 0.6 },
  { id: 'domain', name: '专业', position: [2, 1.5, -0.5], color: '#3b82f6', size: 0.6 },
  { id: 'react', name: 'React', position: [-1.5, -1.5, 1], color: '#10b981', size: 0.5 },
  { id: 'ai', name: 'AI对话', position: [1.5, -1.5, -1], color: '#f59e0b', size: 0.5 },
]

function KnowledgeNode({ node }: { node: any }) {
  const meshRef = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3
    }
  })
  return (
    <mesh ref={meshRef} position={node.position}>
      <sphereGeometry args={[node.size * 0.5, 32, 32]} />
      <meshStandardMaterial color={node.color} emissive={node.color} emissiveIntensity={0.2} />
      <Html distanceFactor={10}>
        <div className="bg-black/60 backdrop-blur-md px-2 py-1 rounded text-white text-[10px] whitespace-nowrap border border-white/10">
          {node.name}
        </div>
      </Html>
    </mesh>
  )
}

function KnowledgeGraph({ isDark = true }: { isDark?: boolean }) {
  return (
    <div className={`w-full h-[180px] rounded-xl overflow-hidden relative ${isDark ? 'bg-white/5 border border-white/10' : 'bg-slate-50 border border-slate-200'}`}>
      <Canvas camera={{ position: [0, 0, 8] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Suspense fallback={null}>
          <group>
            {knowledgeNodes.map(node => <KnowledgeNode key={node.id} node={node} />)}
          </group>
          <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
        </Suspense>
      </Canvas>
      <div className={`absolute top-2 left-2 flex items-center gap-1.5 px-2 py-1 rounded-full backdrop-blur-md border text-[10px] ${isDark ? 'bg-white/5 border-white/10 text-white/60' : 'bg-white/80 border-slate-200 text-slate-600'}`}>
        <Network size={10} />
        <span>3D 技能图谱</span>
      </div>
    </div>
  )
}

// --- Skill Tree Components ---
function SkillTreeNode({ node, depth = 0, isDark = true }: { node: SkillNode; depth?: number; isDark?: boolean }) {
  const [expanded, setExpanded] = useState(depth < 1)
  const hasChildren = node.children && node.children.length > 0

  const getLevelColor = (level: number) => {
    if (level >= 90) return 'bg-emerald-500'
    if (level >= 80) return 'bg-blue-500'
    if (level >= 70) return 'bg-amber-500'
    return 'bg-indigo-500'
  }

  return (
    <div className="relative">
      <div 
        className={`flex items-center gap-2 py-2 px-2 rounded-lg transition-colors cursor-pointer ${isDark ? 'hover:bg-white/5' : 'hover:bg-slate-100'}`}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={() => hasChildren && setExpanded(!expanded)}
      >
        <div className="w-4 h-4 flex items-center justify-center">
          {hasChildren ? (
            expanded ? <ChevronDown size={14} className={isDark ? "text-white/40" : "text-slate-400"} /> : <ChevronRight size={14} className={isDark ? "text-white/40" : "text-slate-400"} />
          ) : (
            <div className={`w-1 h-1 rounded-full ${isDark ? 'bg-white/20' : 'bg-slate-300'}`} />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className={`text-sm font-medium ${isDark ? 'text-white/90' : 'text-slate-800'}`}>{node.name}</span>
            <span className={`text-[10px] font-bold ${isDark ? 'text-white/40' : 'text-slate-400'}`}>{node.level}%</span>
          </div>
          <div className={`mt-1 h-1 w-full rounded-full overflow-hidden ${isDark ? 'bg-white/5' : 'bg-slate-200'}`}>
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${node.level}%` }}
              className={`h-full ${getLevelColor(node.level)}`}
            />
          </div>
        </div>
      </div>
      <AnimatePresence>
        {expanded && hasChildren && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            {node.children!.map(child => (
              <SkillTreeNode key={child.id} node={child} depth={depth + 1} isDark={isDark} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// --- Reusable Skills Content ---
export const SkillsContent: React.FC<{ isDark?: boolean }> = ({ isDark = true }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(true)

  useEffect(() => {
    setIsAnalyzing(true)
    const timer = setTimeout(() => setIsAnalyzing(false), 1200)
    return () => clearTimeout(timer)
  }, [])

  const skillCategories: SkillCategory[] = useMemo(() => [
    {
      id: 'tech',
      name: '技术技能',
      icon: <GraduationCap size={18} />,
      color: '#8b5cf6',
      skills: [
        { 
          id: 'ai-chat', name: 'AI 对话交互', level: 88, description: 'Prompt Engineering, RAG 应用',
          children: [
            { id: 'prompt', name: '提示词工程', level: 92, description: '多步提示词设计' },
            { id: 'rag', name: '检索增强', level: 82, description: '知识库集成' }
          ]
        },
        { id: 'frontend', name: '前端开发', level: 85, description: 'React, TypeScript, Tailwind' }
      ]
    },
    {
      id: 'professional',
      name: '专业能力',
      icon: <Briefcase size={18} />,
      color: '#3b82f6',
      skills: [
        { id: 'project-mgmt', name: '项目管理', level: 78, description: '敏捷开发, 进度掌控' },
        { id: 'ecommerce', name: '电商运营', level: 82, description: '流量分析, 转化优化' }
      ]
    },
    {
      id: 'soft',
      name: '软技能',
      icon: <User size={18} />,
      color: '#ec4899',
      skills: [
        { id: 'comm', name: '沟通表达', level: 90, description: '跨部门协作, 方案演示' },
        { id: 'learning', name: '持续学习', level: 95, description: '新技术快速上手' }
      ]
    }
  ], [])

  const radarDimensions = [
    { name: '学习空间', score: 85, color: '#8b5cf6' },
    { name: '工作助手', score: 78, color: '#3b82f6' },
    { name: '生活记录', score: 72, color: '#ec4899' },
    { name: '技术深度', score: 82, color: '#10b981' },
    { name: '软性实力', score: 88, color: '#f59e0b' },
    { name: '综合素质', score: 84, color: '#06b6d4' },
  ]

  if (isAnalyzing) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className={`w-16 h-16 rounded-full border-2 border-dashed flex items-center justify-center mb-6 ${isDark ? 'border-amber-500/50' : 'border-amber-500/35'}`}
        >
          <Sparkles className="w-8 h-8 text-amber-500" />
        </motion.div>
        <h4 className={`font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>正在同步跨模块技能数据...</h4>
        <p className={`text-xs px-6 ${isDark ? 'text-white/40' : 'text-slate-400'}`}>从学习空间、工作助手及生活记录中提取特征</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Top Section: Radar & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Radar Chart */}
        <div className={`rounded-2xl p-4 border flex flex-col items-center justify-center ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-100'}`}>
          <h4 className={`text-xs font-bold mb-3 flex items-center gap-2 self-start w-full ${isDark ? 'text-white/80' : 'text-slate-700'}`}>
            <Activity size={14} className="text-amber-500" />
            技能均衡度
          </h4>
          <RadarChart dimensions={radarDimensions} isDark={isDark} />
          <div className="mt-4 grid grid-cols-2 gap-2 w-full">
            {radarDimensions.slice(0, 4).map(dim => (
              <div key={dim.name} className={`flex items-center gap-2 text-[10px] p-1.5 rounded-lg ${isDark ? 'text-white/40 bg-white/5' : 'text-slate-500 bg-white border border-slate-100'}`}>
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: dim.color }} />
                <span className="truncate">{dim.name}</span>
                <span className={`ml-auto font-bold ${isDark ? 'text-white/60' : 'text-slate-700'}`}>{dim.score}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats & 3D */}
        <div className="md:col-span-2 space-y-4">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { label: '总技能数', value: '42', icon: Target, color: '#8b5cf6' },
              { label: '已精通', value: '12', icon: Trophy, color: '#10b981' },
              { label: '学习中', value: '8', icon: Clock, color: '#f59e0b' },
              { label: '超越用户', value: '85%', icon: Award, color: '#3b82f6' },
            ].map((stat, i) => (
              <div key={i} className={`rounded-xl p-2.5 border ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-100'}`}>
                <stat.icon size={14} style={{ color: stat.color }} className="mb-1.5" />
                <div className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{stat.value}</div>
                <div className={`text-[9px] uppercase tracking-wider ${isDark ? 'text-white/40' : 'text-slate-400'}`}>{stat.label}</div>
              </div>
            ))}
          </div>
          
          {/* 3D Visual */}
          <KnowledgeGraph isDark={isDark} />

          {/* AI Summary */}
          <div className={`rounded-2xl p-4 border relative overflow-hidden bg-gradient-to-r ${isDark ? 'from-amber-500/10 to-orange-500/10 border-amber-500/20' : 'from-amber-50/50 to-orange-50/50 border-amber-100'}`}>
            <div className="flex items-start gap-3 relative z-10">
              <div className="p-2 rounded-lg bg-amber-500/20 shrink-0">
                <Sparkles size={14} className="text-amber-505" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-amber-600 mb-1">能力诊断报告</h4>
                <p className={`text-[11px] leading-relaxed ${isDark ? 'text-white/70' : 'text-slate-600'}`}>
                  你在<span className={`font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>技术创新</span>和<span className={`font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>跨领域学习</span>方面表现卓越。建议在接下来的周期中，结合工作助手中的项目需求，加强对<span className={`font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>系统架构</span>的深度探索，当前你的学习进度已领先 85% 的同类用户。
                </p>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-3xl rounded-full" />
          </div>
        </div>
      </div>

      {/* Skills Categorization & Tree */}
      <div className="space-y-3">
        <h4 className={`text-xs font-bold flex items-center gap-2 ${isDark ? 'text-white/80' : 'text-slate-700'}`}>
          <BookOpen size={14} className="text-amber-500" />
          技能体系架构
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {skillCategories.map(category => (
            <div key={category.id} className={`rounded-2xl p-4 border ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-100'}`}>
              <div className={`flex items-center gap-2 mb-3 pb-2.5 border-b ${isDark ? 'border-white/5' : 'border-b border-slate-200'}`}>
                <div className="p-1.5 rounded-lg" style={{ backgroundColor: `${category.color}20`, color: category.color }}>
                  {category.icon}
                </div>
                <h5 className={`text-xs font-bold ${isDark ? 'text-white/90' : 'text-slate-800'}`}>{category.name}</h5>
              </div>
              <div className="space-y-1">
                {category.skills.map(skill => (
                  <SkillTreeNode key={skill.id} node={skill} isDark={isDark} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Source Breakdown */}
      <div className={`rounded-2xl p-4 border ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-100'}`}>
        <h4 className={`text-xs font-bold mb-3 ${isDark ? 'text-white/80' : 'text-slate-700'}`}>数据溯源分析</h4>
        <div className="space-y-2">
          {[
            { name: '学习空间', desc: '提取自 AI 对话记录及 3 篇核心知识库文档', value: 92, icon: Brain },
            { name: '工作助手', desc: '根据 5 个近期项目及工作经历自动识别', value: 85, icon: Briefcase },
            { name: '生活记录', desc: '识别出 3 项长期坚持的兴趣爱好与特长', value: 76, icon: Star },
          ].map((source, i) => (
            <div key={i} className="flex items-center gap-3 group">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center border shrink-0 transition-colors ${isDark ? 'bg-white/5 text-white/40 group-hover:text-amber-400 border-white/10' : 'bg-white text-slate-400 group-hover:text-amber-500 border-slate-200'}`}>
                <source.icon size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className={`text-[11px] font-bold ${isDark ? 'text-white/80' : 'text-slate-700'}`}>{source.name}</span>
                  <span className={`text-[9px] ${isDark ? 'text-white/40' : 'text-slate-400'}`}>贡献度 {source.value}%</span>
                </div>
                <p className={`text-[9px] truncate ${isDark ? 'text-white/40' : 'text-slate-455'}`}>{source.desc}</p>
              </div>
              <div className={`w-16 h-1 rounded-full overflow-hidden shrink-0 ${isDark ? 'bg-white/5' : 'bg-slate-200'}`}>
                <div className="h-full bg-amber-500/50" style={{ width: `${source.value}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

interface SkillsDialogProps {
  isOpen: boolean
  onClose: () => void
}

export const SkillsDialog: React.FC<SkillsDialogProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-4xl bg-white/5 border border-white/10 rounded-[32px] overflow-hidden flex flex-col max-h-[85vh] shadow-2xl backdrop-blur-xl"
          >
            {/* Header */}
            <div className="px-6 py-5 flex items-center justify-between border-b border-white/10 bg-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
                  <Zap size={20} fill="currentColor" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    Skills 技能中心
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold tracking-wider border border-amber-500/30">
                      LIVE
                    </span>
                  </h3>
                  <p className="text-xs text-white/40">基于全空间数据动态分析</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 transition-colors border border-white/10"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
              <SkillsContent />
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-white/10 bg-white/5 flex items-center justify-between">
              <div className="text-[10px] text-white/30 flex items-center gap-2">
                <Shield size={12} />
                <span>数据已加密处理，仅用于个性化能力分析</span>
              </div>
              <button 
                onClick={onClose}
                className="px-6 py-2 rounded-full bg-amber-500 text-white text-xs font-bold hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/20 active:scale-95"
              >
                了解更多
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
