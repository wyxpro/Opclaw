import { motion } from 'framer-motion'
import { Send, MessageCircle, Video } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'
import { AnimatedSection } from './AnimatedSection'

interface ContactSectionProps {
  isEditMode?: boolean
}

export function ContactSection({ isEditMode = false }: ContactSectionProps) {
  const { themeConfig } = useTheme()

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8" style={{ background: themeConfig.colors.bg }}>
      <div className="max-w-6xl mx-auto">
        <AnimatedSection className="text-center mb-12">
          <h2
            className="text-3xl sm:text-4xl font-bold mb-4"
            style={{ color: themeConfig.colors.text }}
          >
            联系我
          </h2>
          <p
            className="text-lg"
            style={{ color: themeConfig.colors.textMuted }}
          >
            有项目合作或技术交流？欢迎随时联系我
          </p>
        </AnimatedSection>

        {/* 两列布局：左侧二维码 + 右侧表单 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 左侧：二维码区域 */}
          <AnimatedSection delay={0.1}>
            <div
              className="p-6 rounded-2xl h-full"
              style={{
                background: themeConfig.glassEffect.background,
                border: themeConfig.glassEffect.border,
                backdropFilter: themeConfig.glassEffect.backdropBlur
              }}
            >
              <h3
                className="text-xl font-semibold mb-6"
                style={{ color: themeConfig.colors.text }}
              >
                扫码关注
              </h3>

              {/* 二维码网格 - 移动端和桌面端都是两列 */}
              <div className="grid grid-cols-2 gap-4">
                {/* 微信二维码 */}
                <div className="flex flex-col items-center">
                  <div
                    className="w-full aspect-square rounded-xl flex items-center justify-center mb-3 overflow-hidden"
                    style={{
                      background: themeConfig.colors.surface,
                      border: `1px solid ${themeConfig.colors.border}`
                    }}
                  >
                    {/* 微信二维码 */}
                    <img
                      src="/vibe_images/wx.jpg"
                      alt="微信二维码"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: '#07C160' }}>
                      <MessageCircle size={12} className="text-white" />
                    </div>
                    <span
                      className="text-sm font-medium"
                      style={{ color: themeConfig.colors.text }}
                    >
                      微信号
                    </span>
                  </div>
                  <span
                    className="text-xs mt-1"
                    style={{ color: themeConfig.colors.textMuted }}
                  >
                    交个朋友呀
                  </span>
                </div>

                {/* 抖音二维码 */}
                <div className="flex flex-col items-center">
                  <div
                    className="w-full aspect-square rounded-xl flex items-center justify-center mb-3 overflow-hidden"
                    style={{
                      background: themeConfig.colors.surface,
                      border: `1px solid ${themeConfig.colors.border}`
                    }}
                  >
                    {/* 抖音二维码 */}
                    <img
                      src="/vibe_images/dy.jpg"
                      alt="抖音二维码"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: '#000000' }}>
                      <Video size={12} className="text-white" />
                    </div>
                    <span
                      className="text-sm font-medium"
                      style={{ color: themeConfig.colors.text }}
                    >
                      抖音号
                    </span>
                  </div>
                  <span
                    className="text-xs mt-1"
                    style={{ color: themeConfig.colors.textMuted }}
                  >
                    我的日常生活
                  </span>
                </div>
              </div>


            </div>
          </AnimatedSection>

          {/* 右侧：联系表单 - 移动端隐藏 */}
          <AnimatedSection delay={0.2} className="hidden md:block">
            <div
              className="p-6 rounded-2xl h-full"
              style={{
                background: themeConfig.glassEffect.background,
                border: themeConfig.glassEffect.border,
                backdropFilter: themeConfig.glassEffect.backdropBlur
              }}
            >
              <h3
                className="text-xl font-semibold mb-6"
                style={{ color: themeConfig.colors.text }}
              >
                发送消息
              </h3>

              <form className="space-y-4">
                <div>
                  <label
                    className="block text-sm mb-2"
                    style={{ color: themeConfig.colors.textMuted }}
                  >
                    姓名
                  </label>
                  <input
                    type="text"
                    placeholder="你的名字"
                    className="w-full px-4 py-3 rounded-xl outline-none transition-all"
                    style={{
                      background: themeConfig.colors.surface,
                      border: `1px solid ${themeConfig.colors.border}`,
                      color: themeConfig.colors.text
                    }}
                  />
                </div>

                <div>
                  <label
                    className="block text-sm mb-2"
                    style={{ color: themeConfig.colors.textMuted }}
                  >
                    邮箱
                  </label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 rounded-xl outline-none transition-all"
                    style={{
                      background: themeConfig.colors.surface,
                      border: `1px solid ${themeConfig.colors.border}`,
                      color: themeConfig.colors.text
                    }}
                  />
                </div>

                <div>
                  <label
                    className="block text-sm mb-2"
                    style={{ color: themeConfig.colors.textMuted }}
                  >
                    消息
                  </label>
                  <textarea
                    rows={4}
                    placeholder="想说什么..."
                    className="w-full px-4 py-3 rounded-xl outline-none transition-all resize-none"
                    style={{
                      background: themeConfig.colors.surface,
                      border: `1px solid ${themeConfig.colors.border}`,
                      color: themeConfig.colors.text
                    }}
                  />
                </div>

                <motion.button
                  type="submit"
                  className="w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all"
                  style={{
                    background: themeConfig.colors.primary,
                    color: '#fff'
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Send size={18} />
                  发送消息
                </motion.button>
              </form>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  )
}
