import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Palette, X, Check, Share2, Rocket, Download, Share, History, Loader2, IdCard, Trash2, Sparkles, Eye, Edit3, Undo2, Redo2, RotateCcw } from 'lucide-react'
import PageTransition from '../components/ui/PageTransition'
import { useTheme } from '../hooks/useTheme'
import { useHomeEditor } from '../hooks/useHomeEditor'
import { OnlineResume } from '../components/learning/resume'
import { type ThemeType } from '../lib/themes'

// 导入个人主页组件
import { HeroSection } from '../components/profile/HeroSection'
import { SkillsSection } from '../components/profile/SkillsSection'
import { PortfolioSection } from '../components/profile/PortfolioSection'
import { HobbiesSection } from '../components/profile/HobbiesSection'
import { ContactSection } from '../components/profile/ContactSection'

// 导入数据
import { 
  personalProfile, 
  skillCategories, 
  portfolioItems
} from '../data/profile'

// 导入数字名片相关组件和工具
import { useAuth } from '../contexts/AuthContext'
import { generateDigitalCard, presetAvatars, cardThemes, type DigitalCard, type CardTheme } from '../data/mock'
import { generateCardImage, downloadImage, saveToHistory, wechatShare } from '../lib/cardUtils'

// 主题配置（用于移动端选择器）
const themeOptions: { id: ThemeType; name: string; description: string; icon: string; color: string }[] = [
  { id: 'minimal', name: '极简', description: '白色米白主色调，简洁线条', icon: '☀️', color: '#2563eb' },
  { id: 'cyber', name: '赛博', description: '霓虹紫蓝渐变，未来科技感', icon: '🌙', color: '#00d4ff' },
  { id: 'artistic', name: '艺术', description: '柔和渐变色彩，优雅字体', icon: '🎨', color: '#e85d75' },
  { id: 'cartoon', name: '童趣', description: '明亮活泼色彩，圆润边角', icon: '🌈', color: '#f472b6' },
  { id: 'retro', name: '复古', description: '暖黄棕色系，老式排版', icon: '📜', color: '#8b6914' },
]

export default function Home() {
  const { themeConfig, currentTheme, setTheme } = useTheme()
  const { user } = useAuth()
  const {
    mode,
    setMode,
    profile,
    skillCategories,
    portfolioItems,
    updateProfile,
    updateSkill,
    updatePortfolio,
    canUndo,
    canRedo,
    undo,
    redo,
    resetToDefault
  } = useHomeEditor()
  const [showResume, setShowResume] = useState(false)
  const [showThemeModal, setShowThemeModal] = useState(false)
  const [showCardModal, setShowCardModal] = useState(false)
  const [showHistoryModal, setShowHistoryModal] = useState(false)
  const [showCardEditModal, setShowCardEditModal] = useState(false)
  const [editingCard, setEditingCard] = useState<DigitalCard | null>(null)

  // 处理主题切换
  const handleThemeChange = (themeId: ThemeType) => {
    setTheme(themeId)
    setShowThemeModal(false)
  }

  // 处理分享按钮点击 - 打开数字名片弹窗
  const handleShareClick = () => {
    setShowCardModal(true)
  }

  // 处理下载PDF
  const handleDownloadPDF = () => {
    window.print()
  }

  return (
    <PageTransition>
      <div
        className="relative min-h-screen transition-colors duration-300"
        style={{ backgroundColor: themeConfig.colors.bg }}
      >

        {/* 内容层 */}
        <div className="relative z-10">
        {/* 移动端分享按钮 - 仅在移动端显示，位于最左边 */}
        {!showResume && (
          <motion.button
            onClick={handleShareClick}
            className="md:hidden fixed top-4 right-[7rem] z-30 w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
            style={{
              background: themeConfig.colors.surface,
              border: `1px solid ${themeConfig.colors.border}`,
              color: themeConfig.colors.primary,
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            title="分享当前页面"
          >
            <Share2 size={20} />
          </motion.button>
        )}

        {/* 移动端预览/编辑模式切换按钮 */}
        {!showResume && (
          <motion.button
            onClick={() => setMode(mode === 'preview' ? 'edit' : 'preview')}
            className="md:hidden fixed top-4 right-[4rem] z-30 w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
            style={{
              background: mode === 'edit' ? themeConfig.colors.primary : themeConfig.colors.surface,
              border: `1px solid ${mode === 'edit' ? themeConfig.colors.primary : themeConfig.colors.border}`,
              color: mode === 'edit' ? '#fff' : themeConfig.colors.primary,
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            title={mode === 'preview' ? '切换到编辑模式' : '切换到预览模式'}
          >
            {mode === 'preview' ? <Edit3 size={20} /> : <Eye size={20} />}
          </motion.button>
        )}

        {/* 移动端主题切换按钮 - 仅在移动端显示 */}
        {!showResume && (
          <motion.button
            onClick={() => setShowThemeModal(true)}
            className="md:hidden fixed top-4 right-4 z-30 w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
            style={{
              background: themeConfig.colors.surface,
              border: `1px solid ${themeConfig.colors.border}`,
              color: themeConfig.colors.primary,
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Palette size={20} />
          </motion.button>
        )}

        {/* 主题选择模态框 */}
        <AnimatePresence>
          {showThemeModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 z-50 flex items-center justify-center p-4"
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
              onClick={() => setShowThemeModal(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl"
                style={{
                  background: themeConfig.colors.surface,
                  border: `1px solid ${themeConfig.colors.border}`,
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* 模态框头部 */}
                <div
                  className="flex items-center justify-between px-4 py-3 border-b"
                  style={{ borderColor: themeConfig.colors.border }}
                >
                  <h3
                    className="text-lg font-semibold"
                    style={{ color: themeConfig.colors.text }}
                  >
                    选择主题风格
                  </h3>
                  <button
                    onClick={() => setShowThemeModal(false)}
                    className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                    style={{ color: themeConfig.colors.textMuted }}
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* 主题列表 */}
                <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
                  {themeOptions.map((theme) => (
                    <motion.button
                      key={theme.id}
                      onClick={() => handleThemeChange(theme.id)}
                      className="w-full flex items-center gap-3 p-3 rounded-xl transition-all"
                      style={{
                        background:
                          currentTheme === theme.id
                            ? `${theme.color}15`
                            : themeConfig.colors.bg,
                        border: `2px solid ${
                          currentTheme === theme.id
                            ? theme.color
                            : themeConfig.colors.border
                        }`,
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {/* 主题图标 */}
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                        style={{
                          background: `${theme.color}20`,
                        }}
                      >
                        <span>{theme.icon}</span>
                      </div>

                      {/* 主题信息 */}
                      <div className="flex-1 text-left">
                        <div
                          className="font-medium"
                          style={{ color: themeConfig.colors.text }}
                        >
                          {theme.name}
                        </div>
                        <div
                          className="text-xs mt-0.5"
                          style={{ color: themeConfig.colors.textMuted }}
                        >
                          {theme.description}
                        </div>
                      </div>

                      {/* 选中标记 */}
                      {currentTheme === theme.id && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-6 h-6 rounded-full flex items-center justify-center"
                          style={{
                            background: theme.color,
                            color: '#fff',
                          }}
                        >
                          <Check size={14} />
                        </motion.div>
                      )}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 内容区域 - 根据模式切换 */}
        <AnimatePresence mode="sync">
          {showResume ? (
            <motion.div
              key="resume"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="w-full"
            >
              <OnlineResume isOpen={true} onClose={() => setShowResume(false)} />
            </motion.div>
          ) : (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {/* 个人主页内容 */}
              <div style={{ background: themeConfig.colors.bg }}>

                {/* Hero Section - 个人简介区 */}
                <HeroSection 
                  profile={profile} 
                  showResume={showResume}
                  onToggleResume={setShowResume}
                  onOpenCardModal={handleShareClick}
                  isEditMode={mode === 'edit'}
                  onUpdateProfile={updateProfile}
                  mode={mode}
                  onModeChange={setMode}
                  onDownloadPDF={handleDownloadPDF}
                  canUndo={canUndo}
                  canRedo={canRedo}
                  onUndo={undo}
                  onRedo={redo}
                  onResetToDefault={resetToDefault}
                />

                {/* Skills Section - 技能展示区 */}
                <SkillsSection 
                  skillCategories={skillCategories}
                  isEditMode={mode === 'edit'}
                  onUpdateSkill={updateSkill}
                />

                {/* Portfolio Section - 项目作品集 */}
                <PortfolioSection 
                  projects={portfolioItems}
                  isEditMode={mode === 'edit'}
                  onUpdatePortfolio={updatePortfolio}
                />

                {/* Hobbies Section - 兴趣爱好 */}
                <HobbiesSection isEditMode={mode === 'edit'} />

                {/* Contact Section - 联系区域 */}
                <ContactSection isEditMode={mode === 'edit'} />

                {/* Footer */}
                <footer 
                  className="py-8 px-4 text-center"
                  style={{ 
                    background: themeConfig.colors.surface,
                    borderTop: `1px solid ${themeConfig.colors.border}`
                  }}
                >
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                  >
                    <p 
                      className="text-sm mb-2"
                      style={{ color: themeConfig.colors.textMuted }}
                    >
                      Made with ❤️ by {personalProfile.name}
                    </p>
                    <p 
                      className="text-xs"
                      style={{ color: themeConfig.colors.textDim }}
                    >
                      © {new Date().getFullYear()} All rights reserved.
                    </p>
                  </motion.div>
                </footer>

                {/* 返回顶部按钮 */}
                <BackToTop />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        </div>

        {/* 数字名片弹窗 */}
        <AnimatePresence>
          {showCardModal && (
            <DigitalCardModal
              onClose={() => setShowCardModal(false)}
              onOpenHistory={() => {
                setShowCardModal(false)
                setShowHistoryModal(true)
              }}
              onOpenEdit={(card) => {
                setEditingCard(card)
                setShowCardEditModal(true)
              }}
              initialCard={editingCard || undefined}
            />
          )}
        </AnimatePresence>

        {/* 数字名片编辑弹窗 */}
        <AnimatePresence>
          {showCardEditModal && editingCard && (
            <DigitalCardEditModal
              card={editingCard}
              onSave={(newCard) => {
                setEditingCard(newCard)
                setShowCardEditModal(false)
                setShowCardModal(true)
              }}
              onClose={() => setShowCardEditModal(false)}
            />
          )}
        </AnimatePresence>

        {/* 历史记录弹窗 */}
        <AnimatePresence>
          {showHistoryModal && (
            <CardHistoryModal onClose={() => setShowHistoryModal(false)} />
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  )
}

// 返回顶部按钮组件
function BackToTop() {
  const { themeConfig } = useTheme()

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <motion.button
      onClick={scrollToTop}
      className="fixed bottom-24 right-8 w-12 h-12 rounded-full flex items-center justify-center shadow-lg z-40 md:bottom-10 md:w-[4.5rem] md:h-[4.5rem]"
      style={{
        background: themeConfig.colors.surface,
        border: `1px solid ${themeConfig.colors.border}`,
        color: themeConfig.colors.text
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ 
        scale: 1.1,
        boxShadow: `0 0 20px ${themeConfig.colors.primary}40`
      }}
      whileTap={{ scale: 0.9 }}
    >
      <Rocket className="w-5 h-5 md:w-[1.875rem] md:h-[1.875rem]" />
    </motion.button>
  )
}

// 简易雷达图组件
function SimpleRadarChart({ skills, theme }: { skills: { name: string; level: number }[]; theme: { primary: string; secondary: string } }) {
  const size = 100
  const center = size / 2
  const radius = 35
  const angleStep = (Math.PI * 2) / skills.length

  const points = skills.map((skill, i) => {
    const angle = i * angleStep - Math.PI / 2
    const value = (skill.level / 100) * radius
    return {
      x: center + Math.cos(angle) * value,
      y: center + Math.sin(angle) * value,
    }
  })

  const polygonPoints = points.map(p => `${p.x},${p.y}`).join(' ')

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Grid circles */}
      {[0.25, 0.5, 0.75, 1].map((scale, i) => (
        <circle
          key={i}
          cx={center}
          cy={center}
          r={radius * scale}
          fill="none"
          stroke={theme.primary}
          strokeOpacity={0.1 + i * 0.05}
          strokeWidth={1}
        />
      ))}
      {/* Axis lines */}
      {skills.map((_, i) => {
        const angle = i * angleStep - Math.PI / 2
        return (
          <line
            key={i}
            x1={center}
            y1={center}
            x2={center + Math.cos(angle) * radius}
            y2={center + Math.sin(angle) * radius}
            stroke={theme.primary}
            strokeOpacity={0.2}
            strokeWidth={1}
          />
        )
      })}
      {/* Data polygon */}
      <polygon
        points={polygonPoints}
        fill={theme.primary}
        fillOpacity={0.3}
        stroke={theme.primary}
        strokeWidth={2}
      />
      {/* Data points */}
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={3} fill={theme.secondary} />
      ))}
    </svg>
  )
}

// 数字名片弹窗
function DigitalCardModal({ 
  onClose, 
  onOpenHistory,
  onOpenEdit,
  initialCard
}: { 
  onClose: () => void; 
  onOpenHistory?: () => void;
  onOpenEdit?: (card: DigitalCard) => void;
  initialCard?: DigitalCard;
}) {
  const { user } = useAuth()
  const [card, setCard] = useState<DigitalCard>(() => {
    if (initialCard) {
      return initialCard
    }
    const defaultCard = generateDigitalCard('blue')
    if (user) {
      return {
        ...defaultCard,
        name: user.username,
        avatar: user.avatar || presetAvatars[0]?.url,
      }
    }
    return defaultCard
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const handleDownload = async () => {
    if (!cardRef.current) {
      alert('名片元素未找到')
      return
    }
    setIsGenerating(true)
    try {
      await new Promise(resolve => requestAnimationFrame(resolve))
      const imageUrl = await generateCardImage(cardRef.current, card.theme)
      downloadImage(imageUrl, `${card.name}-数字名片.png`)
      saveToHistory(card, imageUrl)
      alert('名片已下载并保存到历史记录')
    } catch (err) {
      console.error('下载失败:', err)
      alert('下载失败，请重试')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleShare = async () => {
    await wechatShare(card)
  }

  const theme = cardThemes[card.theme]

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-end sm:items-center justify-center"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-bg w-full max-w-md max-h-[90vh] rounded-t-3xl sm:rounded-3xl overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 relative z-10">
            <h2 className="text-lg font-semibold text-text">个人数字名片</h2>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-surface/60 transition-colors cursor-pointer flex items-center justify-center"
              aria-label="关闭"
            >
              <X size={20} className="text-text" />
            </button>
          </div>

          {/* Card Preview */}
          <div className="flex-1 overflow-y-auto p-4">
            <div ref={cardRef} className="rounded-2xl overflow-hidden shadow-2xl bg-surface">
              {/* Card Header */}
              <div className={`bg-gradient-to-br ${theme.gradient} p-6 text-white`}>
                <div className="flex items-center gap-4">
                  <img 
                    src={card.avatar} 
                    alt={card.name}
                    className="w-16 h-16 rounded-full bg-white/20 border-2 border-white/30 object-cover"
                    crossOrigin="anonymous"
                  />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold">{card.name}</h3>
                    <p className="text-white/80 text-sm">{card.title_en}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm text-white/90 leading-relaxed">{card.bio}</p>
              </div>

              {/* Card Body */}
              <div className="bg-surface p-5 space-y-4">
                {/* Stats */}
                <div className="grid grid-cols-4 gap-2">
                  {card.stats.map((stat, i) => (
                    <div key={i} className="text-center">
                      <div className="text-lg font-bold" style={{ color: theme.primary }}>{stat.value}</div>
                      <div className="text-xs text-text-muted">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Skills with Radar Chart */}
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <h4 className="text-xs font-medium text-text-muted mb-2">技能分布</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {card.skills.map((skill, i) => (
                        <span 
                          key={i} 
                          className="px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary"
                        >
                          {skill.name} {skill.level}%
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="w-28">
                    <SimpleRadarChart skills={card.skills} theme={theme} />
                  </div>
                </div>

                {/* Projects with Images */}
                <div>
                  <h4 className="text-xs font-medium text-text-muted mb-2">精选项目</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {card.projects.map((project, i) => (
                      <div key={i} className={`${project.gradient} rounded-xl p-3 text-center`}>
                        <div className="text-2xl mb-1">{project.icon}</div>
                        <h5 className="text-xs font-medium text-white truncate">{project.title}</h5>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Milestones */}
                <div>
                  <h4 className="text-xs font-medium text-text-muted mb-2">成长里程碑</h4>
                  <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                    {card.milestones.map((milestone, i) => (
                      <div key={i} className="flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-lg bg-surface/50 border border-border/50">
                        <span className="text-lg">{milestone.icon}</span>
                        <div>
                          <div className="text-xs font-medium text-text">{milestone.title}</div>
                          <div className="text-[10px] text-text-muted">{milestone.date}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Social Links */}
                <div>
                  <h4 className="text-xs font-medium text-text-muted mb-2">我的账号</h4>
                  <div className="flex flex-wrap gap-2">
                    {card.socialLinks.map((link, i) => (
                      <div key={i} className="flex items-center gap-1 text-xs text-text-secondary bg-surface/50 px-2 py-1 rounded-lg">
                        <span className="text-text-muted">{link.platform}:</span>
                        <span>{link.username}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="pt-3 border-t border-border/50 flex items-center justify-between">
                  <span className="text-xs text-text-dim">晓叶的个人空间</span>
                  <Sparkles size={14} className="text-primary" />
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="p-4 border-t border-border/50 pb-20 md:pb-4">
            <div className="grid grid-cols-4 gap-3">
              <button
                onClick={handleDownload}
                disabled={isGenerating}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-primary/10 text-primary active:scale-95 transition-transform disabled:opacity-50"
              >
                {isGenerating ? <Loader2 size={20} className="animate-spin" /> : <Download size={20} />}
                <span className="text-sm font-medium">下载</span>
              </button>
              <button
                onClick={handleShare}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-green-500/10 text-green-500 active:scale-95 transition-transform"
              >
                <Share size={20} />
                <span className="text-sm font-medium">分享</span>
              </button>
              <button
                onClick={() => {
                  onOpenEdit?.(card)
                  onClose()
                }}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-amber-500/10 text-amber-500 active:scale-95 transition-transform"
              >
                <Palette size={20} />
                <span className="text-sm font-medium">编辑</span>
              </button>
              <button
                onClick={() => onOpenHistory?.()}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-rose-500/10 text-rose-500 active:scale-95 transition-transform"
              >
                <History size={20} />
                <span className="text-sm font-medium">历史</span>
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </>
  )
}

// 名片编辑弹窗
function DigitalCardEditModal({ 
  card, 
  onSave, 
  onClose 
}: { 
  card: DigitalCard
  onSave: (card: DigitalCard) => void
  onClose: () => void 
}) {
  const [editedCard, setEditedCard] = useState<DigitalCard>(card)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleThemeChange = (theme: CardTheme) => {
    setEditedCard({ ...editedCard, theme })
  }

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setEditedCard({ ...editedCard, avatar: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = () => {
    onSave(editedCard)
  }

  const theme = cardThemes[editedCard.theme]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-end sm:items-center justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="bg-bg w-full max-w-md max-h-[90vh] rounded-t-3xl sm:rounded-3xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
          <h2 className="text-lg font-semibold text-text">编辑名片</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-surface/60 transition-colors cursor-pointer flex items-center justify-center"
            aria-label="关闭"
          >
            <X size={20} className="text-text" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Avatar Upload */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-dashed border-border hover:border-primary transition-colors"
            >
              <img src={editedCard.avatar} alt="Avatar" className="w-full h-full object-cover" />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </button>
            <div className="flex-1">
              <p className="text-sm font-medium text-text">头像</p>
              <p className="text-xs text-text-muted">点击更换头像</p>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="text-sm font-medium text-text mb-1 block">姓名</label>
            <input
              type="text"
              value={editedCard.name}
              onChange={(e) => setEditedCard({ ...editedCard, name: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-text text-sm"
            />
          </div>

          {/* Title */}
          <div>
            <label className="text-sm font-medium text-text mb-1 block">职位</label>
            <input
              type="text"
              value={editedCard.title_en}
              onChange={(e) => setEditedCard({ ...editedCard, title_en: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-text text-sm"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="text-sm font-medium text-text mb-1 block">简介</label>
            <textarea
              value={editedCard.bio}
              onChange={(e) => setEditedCard({ ...editedCard, bio: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-text text-sm resize-none"
            />
          </div>

          {/* Theme Selection */}
          <div>
            <label className="text-sm font-medium text-text mb-2 block">主题颜色</label>
            <div className="grid grid-cols-3 gap-2">
              {(Object.entries(cardThemes) as [CardTheme, typeof cardThemes.blue][]).map(([key, themeData]) => (
                <button
                  key={key}
                  onClick={() => handleThemeChange(key)}
                  className={`h-10 rounded-lg bg-gradient-to-br ${themeData.gradient} ${
                    editedCard.theme === key ? 'ring-2 ring-primary ring-offset-2' : ''
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border/50 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-lg border border-border text-text text-sm font-medium hover:bg-surface/60 transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:opacity-90 transition-opacity"
          >
            保存
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// 历史记录弹窗
function CardHistoryModal({ onClose }: { onClose: () => void }) {
  const [history, setHistory] = useState(() => {
    try {
      const stored = localStorage.getItem('card_history')
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  const handleDelete = (id: string) => {
    const newHistory = history.filter((item: any) => item.id !== id)
    setHistory(newHistory)
    localStorage.setItem('card_history', JSON.stringify(newHistory))
  }

  const formatRelativeTime = (timestamp: number) => {
    const diff = Date.now() - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 60) return `${minutes}分钟前`
    if (hours < 24) return `${hours}小时前`
    return `${days}天前`
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-end sm:items-center justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="bg-bg w-full max-w-md max-h-[80vh] rounded-t-3xl sm:rounded-3xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
          <h2 className="text-lg font-semibold text-text">历史记录</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-surface/60 transition-colors cursor-pointer flex items-center justify-center"
            aria-label="关闭"
          >
            <X size={20} className="text-text" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {history.length === 0 ? (
            <div className="text-center py-12 text-text-muted">
              <History size={48} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">暂无历史记录</p>
            </div>
          ) : (
            <div className="space-y-2">
              {history.map((item: any) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-surface/50 border border-border/50"
                >
                  {item.previewImage ? (
                    <img
                      src={item.previewImage}
                      alt="名片预览"
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
                      <IdCard size={24} className="text-primary" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text">数字名片</p>
                    <p className="text-xs text-text-muted">{formatRelativeTime(item.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {item.previewImage && (
                      <button
                        onClick={() => downloadImage(item.previewImage, `名片-${item.id}.png`)}
                        className="p-2 rounded-lg hover:bg-surface/60 text-text-secondary"
                      >
                        <Download size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 rounded-lg hover:bg-rose-500/10 text-rose-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
