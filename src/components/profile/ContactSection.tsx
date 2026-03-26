import { motion } from 'framer-motion'
import { Send } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'
import { AnimatedSection } from './AnimatedSection'

export function ContactSection() {
  const { themeConfig } = useTheme()

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8" style={{ background: themeConfig.colors.bg }}>
      <div className="max-w-4xl mx-auto">
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

        <div className="max-w-xl mx-auto">
          {/* 联系表单 */}
          <AnimatedSection delay={0.2}>
            <div
              className="p-6 rounded-2xl"
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
