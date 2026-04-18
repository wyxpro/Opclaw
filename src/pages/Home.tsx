import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Palette, X, Check, Share2, Rocket } from 'lucide-react'
import PageTransition from '../components/ui/PageTransition'
import { useTheme } from '../hooks/useTheme'
import { OnlineResume } from '../components/learning/resume'
import { type ThemeType } from '../lib/themes'

// 导入个人主页组件
import { HeroSection } from '../components/profile/HeroSection'
import { SkillsSection } from '../components/profile/SkillsSection'
import { PortfolioSection } from '../components/profile/PortfolioSection'
import { SocialMediaSection } from '../components/profile/SocialMediaSection'
import { HobbiesSection } from '../components/profile/HobbiesSection'
import { ContactSection } from '../components/profile/ContactSection'

// 导入数据
import { 
  personalProfile, 
  skillCategories, 
  portfolioItems
} from '../data/profile'

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
  const [showResume, setShowResume] = useState(false)
  const [showThemeModal, setShowThemeModal] = useState(false)

  // 处理主题切换
  const handleThemeChange = (themeId: ThemeType) => {
    setTheme(themeId)
    setShowThemeModal(false)
  }

  return (
    <PageTransition>
      <div
        className="min-h-screen pb-24 transition-colors duration-300"
        style={{ backgroundColor: themeConfig.colors.bg }}
      >
        {/* 移动端分享按钮 - 仅在移动端显示，位于主题切换按钮左边 */}
        <motion.button
          onClick={() => {
            const url = window.location.href
            navigator.clipboard.writeText(url)
            alert('链接已复制到剪贴板')
          }}
          className="md:hidden fixed top-4 right-16 z-30 w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
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

        {/* 移动端主题切换按钮 - 仅在移动端显示 */}
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
                  profile={personalProfile} 
                  showResume={showResume}
                  onToggleResume={setShowResume}
                />

                {/* Skills Section - 技能展示区 */}
                <SkillsSection skillCategories={skillCategories} />

                {/* Portfolio Section - 项目作品集 */}
                <PortfolioSection projects={portfolioItems} />

                {/* Hobbies Section - 兴趣爱好 */}
                <HobbiesSection />

                {/* Social Media Section - 自媒体矩阵 */}
                <SocialMediaSection socials={personalProfile.socialLinks} />

                {/* Contact Section - 联系区域 */}
                <ContactSection />

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
