import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, Home as HomeIcon } from 'lucide-react'
import PageTransition from '../components/ui/PageTransition'
import { useTheme } from '../hooks/useTheme'
import { OnlineResume } from '../components/learning/resume'

// 导入个人主页组件
import { HeroSection } from '../components/profile/HeroSection'
import { SkillsSection } from '../components/profile/SkillsSection'
import { PortfolioSection } from '../components/profile/PortfolioSection'
import { SocialMediaSection } from '../components/profile/SocialMediaSection'
import { ModulesSection } from '../components/profile/ModulesSection'
import { ContactSection } from '../components/profile/ContactSection'

// 导入数据
import { 
  personalProfile, 
  skillCategories, 
  portfolioItems,
  moduleEntries
} from '../data/profile'

export default function Home() {
  const { themeConfig } = useTheme()
  const [showResume, setShowResume] = useState(false)

  return (
    <PageTransition>
      <div
        className="min-h-screen pb-24 transition-colors duration-300"
        style={{ backgroundColor: themeConfig.colors.bg }}
      >

        {/* 内容区域 - 根据模式切换 */}
        <AnimatePresence mode="wait">
          {showResume ? (
            <motion.div
              key="resume"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <OnlineResume isOpen={true} onClose={() => setShowResume(false)} />
            </motion.div>
          ) : (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
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

                {/* Social Media Section - 自媒体矩阵 */}
                <SocialMediaSection socials={personalProfile.socialLinks} />

                {/* Modules Section - 功能模块入口 */}
                <ModulesSection modules={moduleEntries} />

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
      className="fixed bottom-8 right-8 w-12 h-12 rounded-full flex items-center justify-center shadow-lg z-40"
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
      <svg 
        width="20" 
        height="20" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <path d="M18 15l-6-6-6 6"/>
      </svg>
    </motion.button>
  )
}
