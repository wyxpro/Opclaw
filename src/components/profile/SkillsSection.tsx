import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import { Zap, Award, Activity, Clock } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'
import type { SkillCategory, Skill, PersonalProfile } from '../../types/profile'
import { AnimatedSection } from './AnimatedSection'

interface SkillsSectionProps {
  skillCategories: SkillCategory[]
  isEditMode?: boolean
  onUpdateSkill?: (categoryId: string, skillId: string, field: string, value: any) => void
  profile?: PersonalProfile
  onUpdateProfile?: (field: keyof PersonalProfile, value: any) => void
}

import { EditableWrapper } from '../ui/EditableWrapper'

// 统计卡片组件
function StatCard({ 
  icon: Icon, 
  label, 
  value, 
  color,
  delay = 0,
  isEditMode = false,
  onSave,
  labelForEdit,
  type = 'text'
}: { 
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>
  label: string
  value: string | number
  color: string
  delay?: number
  isEditMode?: boolean
  onSave?: (newValue: string | number) => void
  labelForEdit?: string
  type?: 'text' | 'number' | 'percentage'
}) {
  const { themeConfig } = useTheme()

  return (
    <motion.div
      className="p-4 rounded-xl"
      style={{
        background: themeConfig.colors.surface,
        border: `1px solid ${themeConfig.colors.border}`
      }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${color}20` }}
        >
          <Icon size={20} style={{ color }} />
        </div>
        <div>
          <EditableWrapper
            value={value}
            onSave={(val) => onSave?.(val)}
            isEditMode={isEditMode}
            type={type === 'number' ? 'number' : type === 'percentage' ? 'percentage' : 'text'}
            label={labelForEdit || label}
          >
            <div
              className="text-xl font-bold"
              style={{ color: themeConfig.colors.text }}
            >
              {value}
            </div>
          </EditableWrapper>
          <div
            className="text-xs"
            style={{ color: themeConfig.colors.textMuted }}
          >
            {label}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// 技能进度条组件
function SkillBar({ 
  skill, 
  index, 
  isEditMode, 
  onUpdateSkill,
  categoryId
}: { 
  skill: Skill; 
  index: number;
  isEditMode?: boolean;
  onUpdateSkill?: (categoryId: string, skillId: string, field: string, value: any) => void;
  categoryId: string;
}) {
  const { themeConfig } = useTheme()

  const getLevelColor = (level: number) => {
    if (level >= 90) return '#10B981'
    if (level >= 80) return '#3B82F6'
    if (level >= 70) return '#F59E0B'
    if (level >= 60) return '#F97316'
    return '#EF4444'
  }

  const getLevelText = (level: number) => {
    if (level >= 90) return '精通'
    if (level >= 80) return '熟练'
    if (level >= 70) return '良好'
    if (level >= 60) return '入门'
    return '初学'
  }

  return (
    <motion.div
      className="group"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <EditableWrapper
            value={skill.name}
            onSave={(val) => onUpdateSkill?.(categoryId, skill.id, 'name', val)}
            isEditMode={isEditMode || false}
            label="技能名称"
          >
            <span
              className="text-sm font-medium"
              style={{ color: themeConfig.colors.text }}
            >
              {skill.name}
            </span>
          </EditableWrapper>
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: `${getLevelColor(skill.level)}20`,
              color: getLevelColor(skill.level)
            }}
          >
            {getLevelText(skill.level)}
          </span>
        </div>
        <EditableWrapper
          value={skill.level}
          onSave={(val) => onUpdateSkill?.(categoryId, skill.id, 'level', val)}
          type="percentage"
          isEditMode={isEditMode || false}
          label="熟练度"
        >
          <span
            className="text-sm font-medium"
            style={{ color: themeConfig.colors.textMuted }}
          >
            {skill.level}%
          </span>
        </EditableWrapper>
      </div>
      <div
        className="h-2 rounded-full overflow-hidden"
        style={{ background: themeConfig.colors.surface }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: skill.color || getLevelColor(skill.level) }}
          initial={{ width: 0 }}
          whileInView={{ width: `${skill.level}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: index * 0.05, ease: 'easeOut' }}
        />
      </div>
    </motion.div>
  )
}

// 雷达图组件
function RadarChart({ 
  data, 
  isEditMode, 
  onUpdate 
}: { 
  data: { name: string; score: number; color: string }[]
  isEditMode?: boolean
  onUpdate?: (index: number, field: string, value: any) => void
}) {
  const { themeConfig } = useTheme()
  const [isVisible, setIsVisible] = useState(false)
  const chartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (chartRef.current) {
      observer.observe(chartRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const dimensions = data || []
  const size = 280
  const center = size / 2
  const radius = 90
  const angleStep = (Math.PI * 2) / (dimensions.length || 1)

  const getPoint = (index: number, value: number) => {
    const angle = index * angleStep - Math.PI / 2
    const r = (value / 100) * radius
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle)
    }
  }

  const dataPoints = dimensions.map((dim, index) => getPoint(index, dim.score))
  const polygonPoints = dataPoints.map(p => `${p.x},${p.y}`).join(' ')

  return (
    <div ref={chartRef} className="flex flex-col items-center w-full">
      <svg 
        viewBox={`0 0 ${size} ${size}`} 
        className="w-full max-w-[300px] h-auto overflow-visible"
        style={{ minHeight: '280px' }}
      >
        {/* 背景网格 */}
        {[20, 40, 60, 80, 100].map((level) => {
          const points = dimensions.map((_, index) => {
            const point = getPoint(index, level)
            return `${point.x},${point.y}`
          }).join(' ')
          return (
            <polygon
              key={level}
              points={points}
              fill="none"
              stroke={themeConfig.colors.textMuted}
              strokeWidth="1"
              opacity={0.2}
            />
          )
        })}

        {/* 轴线 */}
        {dimensions.map((_, index) => {
          const end = getPoint(index, 100)
          return (
            <line
              key={index}
              x1={center}
              y1={center}
              x2={end.x}
              y2={end.y}
              stroke={themeConfig.colors.textMuted}
              strokeWidth="1"
              opacity={0.2}
            />
          )
        })}

        {/* 数据区域 */}
        <motion.polygon
          points={polygonPoints}
          fill={`${themeConfig.colors.primary}30`}
          stroke={themeConfig.colors.primary}
          strokeWidth="2.5"
          strokeLinejoin="round"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
        />

        {/* 数据点 */}
        {dataPoints.map((point, index) => (
          <motion.circle
            key={index}
            cx={point.x}
            cy={point.y}
            r="6"
            fill={dimensions[index].color}
            stroke={themeConfig.colors.surface}
            strokeWidth="2"
            initial={{ scale: 0, opacity: 0 }}
            animate={isVisible ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
            transition={{ delay: 0.4 + index * 0.1, duration: 0.4, ease: 'backOut' }}
          />
        ))}

        {/* 标签 */}
        {dimensions.map((dim, index) => {
          const point = getPoint(index, 120)
          return (
            <motion.text
              key={index}
              x={point.x}
              y={point.y}
              textAnchor="middle"
              dominantBaseline="middle"
              initial={{ opacity: 0 }}
              animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 0.6 + index * 0.05 }}
              style={{
                fontSize: '11px',
                fontWeight: 500,
                fill: themeConfig.colors.textMuted
              }}
            >
              {dim.name}
            </motion.text>
          )
        })}
      </svg>

      {/* 图例 (可编辑) */}
      <motion.div 
        className="flex flex-wrap justify-center gap-x-8 gap-y-4 mt-8 px-4"
        initial={{ opacity: 0, y: 10 }}
        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        transition={{ delay: 0.8, duration: 0.4 }}
      >
        {dimensions.map((dim, index) => (
          <div key={index} className="flex items-center gap-1.5 text-xs">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: dim.color }}
            />
            <EditableWrapper
              value={dim.name}
              onSave={(val) => onUpdate?.(index, 'name', val)}
              isEditMode={isEditMode || false}
              label="分类名称"
            >
              <span style={{ color: themeConfig.colors.textMuted }}>{dim.name}</span>
            </EditableWrapper>
            <EditableWrapper
              value={dim.score}
              onSave={(val) => onUpdate?.(index, 'score', Number(val))}
              isEditMode={isEditMode || false}
              type="number"
              label="掌握度"
            >
              <span style={{ color: themeConfig.colors.text, fontWeight: 600 }}>{dim.score}</span>
            </EditableWrapper>
          </div>
        ))}
      </motion.div>
    </div>
  )
}

export function SkillsSection({ 
  skillCategories, 
  isEditMode = false, 
  onUpdateSkill,
  profile,
  onUpdateProfile
}: SkillsSectionProps) {
  const { themeConfig } = useTheme()
  const [activeCategory, setActiveCategory] = useState(skillCategories[0]?.id)

  const activeSkills = skillCategories.find(cat => cat.id === activeCategory)?.skills || []

  // 计算统计数据
  const totalSkills = skillCategories.reduce((sum, cat) => sum + cat.skills.length, 0)
  const masteredSkills = skillCategories.reduce(
    (sum, cat) => sum + cat.skills.filter(s => s.level >= 80).length, 
    0
  )
  const avgLevel = Math.round(
    skillCategories.reduce(
      (sum, cat) => sum + cat.skills.reduce((s, skill) => s + skill.level, 0) / cat.skills.length,
      0
    ) / skillCategories.length
  )

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8" style={{ background: themeConfig.colors.bg }}>
      <div className="max-w-6xl mx-auto">
        {/* 标题 */}
        <AnimatedSection className="text-center mb-12">
          <h2
            className="text-3xl sm:text-4xl font-bold mb-4"
            style={{ color: themeConfig.colors.text }}
          >
            技能专长
          </h2>
          <EditableWrapper
            value={profile?.skillsBio || "多维度可视化数据呈现你的技能矩阵"}
            onSave={(val) => onUpdateProfile?.('skillsBio', val)}
            isEditMode={isEditMode || false}
            label="技能描述"
            type="textarea"
          >
            <p
              className="text-lg max-w-2xl mx-auto"
              style={{ color: themeConfig.colors.textMuted }}
            >
              {profile?.skillsBio || "多维度可视化数据呈现你的技能矩阵"}
            </p>
          </EditableWrapper>
        </AnimatedSection>

        {/* 统计数据 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <StatCard
            icon={Zap}
            label="总技能数"
            value={profile?.stats.totalSkills || totalSkills}
            color="#8B5CF6"
            delay={0}
            isEditMode={isEditMode}
            type="number"
            onSave={(val) => {
              if (profile) {
                onUpdateProfile?.('stats', { ...profile.stats, totalSkills: Number(val) })
              }
            }}
          />
          <StatCard
            icon={Award}
            label="已精通"
            value={profile?.stats.masteredSkills || masteredSkills}
            color="#10B981"
            delay={0.1}
            isEditMode={isEditMode}
            type="number"
            onSave={(val) => {
              if (profile) {
                onUpdateProfile?.('stats', { ...profile.stats, masteredSkills: Number(val) })
              }
            }}
          />
          <StatCard
            icon={Activity}
            label="平均掌握度"
            value={profile?.stats.avgLevel ? `${profile.stats.avgLevel}%` : `${avgLevel}%`}
            color="#F59E0B"
            delay={0.2}
            isEditMode={isEditMode}
            onSave={(val) => {
              if (profile) {
                // 如果用户输入了带 % 的字符串，尝试提取数字
                const num = parseInt(val.toString().replace('%', ''))
                if (!isNaN(num)) {
                  onUpdateProfile?.('stats', { ...profile.stats, avgLevel: num })
                }
              }
            }}
          />
          <StatCard
            icon={Clock}
            label="学习时长"
            value={profile?.stats.learningHours || "2000h+"}
            color="#06B6D4"
            delay={0.3}
            isEditMode={isEditMode}
            onSave={(val) => {
              if (profile) {
                onUpdateProfile?.('stats', { ...profile.stats, learningHours: val.toString() })
              }
            }}
          />
        </div>

        {/* 技能展示区域 */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* 左侧：雷达图 */}
          <AnimatedSection delay={0.2}>
            <div
              className="p-6 rounded-2xl h-full"
              style={{
                background: themeConfig.glassEffect.background,
                border: themeConfig.glassEffect.border,
                backdropFilter: themeConfig.glassEffect.backdropBlur
              }}
            >
              <h3
                className="text-lg font-semibold mb-6 flex items-center gap-2"
                style={{ color: themeConfig.colors.text }}
              >
                <Zap size={20} style={{ color: themeConfig.colors.primary }} />
                技能雷达图
              </h3>
              <RadarChart 
                data={profile?.skillsRadar || []}
                isEditMode={isEditMode || false}
                onUpdate={(index, field, value) => {
                  if (profile?.skillsRadar) {
                    const newRadar = [...profile.skillsRadar]
                    newRadar[index] = { ...newRadar[index], [field]: value }
                    onUpdateProfile?.('skillsRadar', newRadar)
                  }
                }}
              />
            </div>
          </AnimatedSection>

          {/* 右侧：技能列表 */}
          <AnimatedSection delay={0.3}>
            <div
              className="p-6 rounded-2xl h-full"
              style={{
                background: themeConfig.glassEffect.background,
                border: themeConfig.glassEffect.border,
                backdropFilter: themeConfig.glassEffect.backdropBlur
              }}
            >
              {/* 分类标签 */}
              <div className="flex flex-wrap gap-2 mb-6">
                {skillCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                    style={{
                      background: activeCategory === category.id
                        ? category.color
                        : themeConfig.colors.surface,
                      color: activeCategory === category.id
                        ? '#fff'
                        : themeConfig.colors.textMuted,
                      border: `1px solid ${activeCategory === category.id ? category.color : themeConfig.colors.border}`
                    }}
                  >
                    <span>{category.icon}</span>
                    <span className="hidden sm:inline">{category.name}</span>
                  </button>
                ))}
              </div>

              {/* 技能列表 */}
              <AnimatePresence mode="sync">
                <motion.div
                  key={activeCategory}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-4"
                >
                  {activeSkills.map((skill, index) => (
                    <SkillBar 
                      key={skill.id} 
                      skill={skill} 
                      index={index} 
                      isEditMode={isEditMode}
                      onUpdateSkill={onUpdateSkill}
                      categoryId={activeCategory || ''}
                    />
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  )
}
