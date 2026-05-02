import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Brain, Target, Compass, Zap, Flame, Heart, Sparkles, Activity } from 'lucide-react'
import ReactECharts from 'echarts-for-react'
import type { ChatSession } from './HistoryDialog'

interface MemoryBankDialogProps {
  isOpen: boolean
  onClose: () => void
  sessions: ChatSession[]
}

const INDICATORS = [
  { name: '口吻', key: 'tone', icon: <Activity className="w-4 h-4" />, desc: '语言风格、用词习惯、表达方式等', color: '#8b5cf6' }, // violet-500
  { name: '习惯', key: 'habit', icon: <Heart className="w-4 h-4" />, desc: '聊天偏好、常见话题、行为模式等', color: '#ec4899' }, // pink-500
  { name: '性格', key: 'personality', icon: <Flame className="w-4 h-4" />, desc: '性格特点、情绪倾向、应对机制', color: '#f97316' }, // orange-500
  { name: '技能', key: 'skill', icon: <Zap className="w-4 h-4" />, desc: '专业能力、知识领域、特长展示', color: '#eab308' }, // yellow-500
  { name: '目标', key: 'goal', icon: <Target className="w-4 h-4" />, desc: '提及的短期和长期目标、计划等', color: '#10b981' }, // emerald-500
  { name: '世界观', key: 'worldview', icon: <Compass className="w-4 h-4" />, desc: '价值观、观点立场、人生哲学等', color: '#3b82f6' }, // blue-500
]

export const MemoryBankDialog: React.FC<MemoryBankDialogProps> = ({
  isOpen,
  onClose,
  sessions
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(true)

  useEffect(() => {
    if (isOpen) {
      setIsAnalyzing(true)
      const timer = setTimeout(() => {
        setIsAnalyzing(false)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  // Simulate data based on session count to show "progressive" accuracy
  const analysisData = useMemo(() => {
    const messageCount = sessions.reduce((acc, curr) => acc + curr.messages.length, 0)
    const baseValue = Math.min(40 + messageCount * 2, 85) // Max out at 85 for base
    
    // Slight random variations based on message count hash-like logic
    return {
      tone: Math.min(baseValue + (messageCount % 10), 95),
      habit: Math.min(baseValue + (messageCount % 7), 92),
      personality: Math.min(baseValue + (messageCount % 12), 90),
      skill: Math.min(baseValue - 5 + (messageCount % 8), 85),
      goal: Math.min(baseValue - 10 + (messageCount % 15), 88),
      worldview: Math.min(baseValue - 15 + (messageCount % 20), 80),
    }
  }, [sessions])

  const radarOption = {
    backgroundColor: 'transparent',
    color: ['#6366f1'],
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderColor: '#e2e8f0',
      textStyle: {
        color: '#1e293b'
      }
    },
    radar: {
      indicator: INDICATORS.map(ind => ({ name: ind.name, max: 100 })),
      radius: '65%',
      center: ['50%', '50%'],
      splitNumber: 4,
      shape: 'polygon',
      axisName: {
        color: '#64748b',
        fontSize: 12,
        fontWeight: 500,
        formatter: (value: string) => {
          return value;
        }
      },
      splitArea: {
        areaStyle: {
          color: ['rgba(99, 102, 241, 0.02)', 'rgba(99, 102, 241, 0.05)', 'rgba(99, 102, 241, 0.08)', 'rgba(99, 102, 241, 0.11)'].reverse(),
          shadowColor: 'rgba(0, 0, 0, 0.02)',
          shadowBlur: 10
        }
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(99, 102, 241, 0.2)'
        }
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(99, 102, 241, 0.2)'
        }
      }
    },
    series: [
      {
        name: '用户画像',
        type: 'radar',
        data: [
          {
            value: [
              analysisData.tone,
              analysisData.habit,
              analysisData.personality,
              analysisData.skill,
              analysisData.goal,
              analysisData.worldview
            ],
            name: '分析指标',
            symbol: 'circle',
            symbolSize: 6,
            itemStyle: {
              color: '#6366f1',
              borderColor: '#fff',
              borderWidth: 2,
            },
            areaStyle: {
              color: 'rgba(99, 102, 241, 0.2)'
            },
            lineStyle: {
              width: 2,
              color: '#6366f1'
            }
          }
        ]
      }
    ]
  }

  // Generate descriptions based on analysis values
  const getDescriptions = () => {
    const isDetailed = sessions.length > 3
    return {
      tone: isDetailed ? '表达严谨且逻辑清晰，常使用专业术语，偏好直接高效的沟通方式。' : '正在收集语言习惯...',
      habit: isDetailed ? '喜欢在晚间进行深度交流，偏好技术和效率类话题，有固定的提问模式。' : '正在分析互动偏好...',
      personality: isDetailed ? '展现出较强的好奇心和探索欲，遇到问题时表现出冷静理性的态度。' : '正在描绘性格轮廓...',
      skill: isDetailed ? '具备良好的逻辑思维和编程基础，对新技术有敏锐的嗅觉。' : '正在识别技能特征...',
      goal: isDetailed ? '近期关注个人效率提升和技术视野拓展，有明确的学习规划。' : '正在提取核心目标...',
      worldview: isDetailed ? '推崇实用主义，相信技术能够带来积极的改变，具有开放包容的心态。' : '正在构建价值体系...'
    }
  }

  const descriptions = getDescriptions()

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-0 sm:p-4 pb-8 md:pb-0">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
          />

          {/* Dialog Container */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative w-full max-w-lg bg-white sm:rounded-3xl rounded-t-[32px] overflow-hidden flex flex-col max-h-[90vh] shadow-[0_-10px_50px_rgba(0,0,0,0.1)] mb-4 sm:mb-0"
          >
            {/* Header */}
            <div className="px-6 py-5 flex items-center justify-between border-b border-gray-100 bg-gradient-to-r from-indigo-50/50 to-purple-50/50">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                  <Brain size={20} />
                  {isAnalyzing && (
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 rounded-xl border-2 border-dashed border-white/30"
                    />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    数字记忆库
                    <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-600 text-[10px] font-bold tracking-wider">
                      BETA
                    </span>
                  </h3>
                  <p className="text-xs text-gray-500 font-medium">基于 {sessions.length} 段对话深度分析</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white hover:bg-gray-50 flex items-center justify-center text-gray-400 shadow-sm border border-gray-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto min-h-0 bg-slate-50/30">
              {isAnalyzing ? (
                <div className="py-24 flex flex-col items-center justify-center">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-20 h-20 rounded-full bg-indigo-50 flex items-center justify-center mb-6 relative"
                  >
                    <Sparkles className="w-10 h-10 text-indigo-500" />
                    <motion.div 
                      className="absolute inset-0 rounded-full border-4 border-indigo-500/20"
                      animate={{ scale: [1, 1.5], opacity: [1, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  </motion.div>
                  <h4 className="text-gray-800 font-bold mb-2">正在重构数字画像...</h4>
                  <p className="text-sm text-gray-500">深入解析语言习惯与思维模式</p>
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-6"
                >
                  {/* Radar Chart Section */}
                  <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 mb-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-100/40 to-purple-100/40 rounded-bl-full -z-10" />
                    <div className="text-center mb-2">
                      <h4 className="font-bold text-gray-800">认知结构模型</h4>
                      <p className="text-[11px] text-gray-400 mt-1">数据随对话深度持续进化</p>
                    </div>
                    <div className="h-[260px] w-full">
                      <ReactECharts 
                        option={radarOption} 
                        style={{ height: '100%', width: '100%' }}
                        opts={{ renderer: 'svg' }}
                      />
                    </div>
                  </div>

                  {/* Indicators List Section */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-gray-800 mb-4 px-1 flex items-center gap-2">
                      <Activity size={16} className="text-indigo-500" />
                      特征解析报告
                    </h4>
                    {INDICATORS.map((indicator, index) => {
                      const score = analysisData[indicator.key as keyof typeof analysisData]
                      return (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          key={indicator.key} 
                          className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow group"
                        >
                          <div className="flex items-start gap-4">
                            <div 
                              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
                              style={{ backgroundColor: `${indicator.color}15`, color: indicator.color }}
                            >
                              {indicator.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <h5 className="font-bold text-gray-800">{indicator.name}</h5>
                                <span className="text-xs font-bold" style={{ color: indicator.color }}>
                                  {score} / 100
                                </span>
                              </div>
                              <p className="text-xs text-gray-400 mb-2">{indicator.desc}</p>
                              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                                <p className="text-sm text-gray-600 leading-relaxed">
                                  {descriptions[indicator.key as keyof typeof descriptions]}
                                </p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
