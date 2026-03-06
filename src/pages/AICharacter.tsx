import { useState } from 'react'
import PageTransition from '../components/ui/PageTransition'
import { Character3D } from '../components/ai/Character3D'
import { BackgroundCustomizer } from '../components/ai/BackgroundCustomizer'
import { MultiModalInput } from '../components/ai/MultiModalInput'
import { CharacterChat } from '../components/ai/CharacterChat'
import { useTheme } from '../hooks/useTheme'
import { ragEngine } from '../lib/ragEngine'
import type { Message, CharacterStyle } from '../components/ai/types'

export default function AICharacter() {
  const { themeConfig } = useTheme()
  const [characterStyle, setCharacterStyle] = useState<CharacterStyle>('cartoon')
  const [background, setBackground] = useState<string>('office')
  const [customBackgroundUrl, setCustomBackgroundUrl] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  // 初始化欢迎消息
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      content: '你好！我是你的AI分身助手🌟\n\n我可以帮助你：\n• 检索学习、生活、娱乐相关的内容\n•回答你的各种问题\n• 和你进行有趣的对话\n\n有什么可以帮助你的吗？',
      timestamp: 1700000000000
    }
  ])

  const handleSendMessage = async (content: string, attachments?: Message['attachments']) => {
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      timestamp: Date.now(),
      attachments: attachments || []
    }

    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    // 使用RAG引擎生成智能回复
    setTimeout(() => {
      const ragResponse = ragEngine.generateResponse(content)
      const responseMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: ragResponse,
        timestamp: Date.now()
      }
      setMessages(prev => [...prev, responseMessage])
      setIsLoading(false)
    }, 1500)
  }

  const handleCustomBackgroundUpload = (imageUrl: string) => {
    setCustomBackgroundUrl(imageUrl)
  }

  return (
    <PageTransition>
      <div className="fixed inset-0 top-0 md:top-[64px] bottom-[60px] md:bottom-0 flex flex-col bg-bg text-text overflow-hidden">
        {/* Header - 移动端紧凑布局 */}
        <div 
          className="flex items-center justify-between px-3 md:px-4 py-1.5 md:py-2 border-b flex-shrink-0"
          style={{ 
            borderColor: themeConfig.colors.border,
            background: themeConfig.glassEffect.background,
            backdropFilter: themeConfig.glassEffect.backdropBlur
          }}
        >
          <div className="flex-1 min-w-0">
            <h1 className="text-sm md:text-lg font-bold truncate" style={{ color: themeConfig.colors.text }}>
              AI分身助手
            </h1>
            <p className="text-xs hidden sm:block" style={{ color: themeConfig.colors.textMuted }}>
              智能对话 · 3D交互 · 内容检索
            </p>
          </div>
          
          <div className="flex items-center gap-1.5 md:gap-2 flex-shrink-0">
            <BackgroundCustomizer 
              currentBackground={background}
              onBackgroundChange={setBackground}
              onCustomImageUpload={handleCustomBackgroundUpload}
            />
            <button
              onClick={() => setCharacterStyle((prev: CharacterStyle) => 
                prev === 'cartoon' ? 'realistic' : 'cartoon'
              )}
              className="px-2 md:px-3 py-1 md:py-2 rounded-lg md:rounded-xl text-xs font-medium transition-all flex items-center gap-1 md:gap-1.5"
              style={{
                background: `linear-gradient(135deg, ${themeConfig.colors.primaryMuted}, ${themeConfig.colors.primaryDim})`,
                color: themeConfig.colors.primary,
                border: `1px solid ${themeConfig.colors.primary}`
              }}
            >
              <span className="text-sm md:text-base">{characterStyle === 'cartoon' ? '🎨' : '👤'}</span>
              <span className="hidden sm:inline text-xs">{characterStyle === 'cartoon' ? '卡通' : '真实'}</span>
            </button>
          </div>
        </div>

        {/* Main Content - 移动端紧凑布局 */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative min-h-0">
          {/* 3D Character Area - Desktop: Left, Mobile: Top Half */}
          <div className="relative md:relative w-full md:w-1/2 lg:w-2/3 h-[38vh] md:h-full flex-shrink-0 z-0 md:z-auto">
            <Character3D 
              style={characterStyle}
              currentMessage={messages[messages.length - 1]}
              background={background === 'custom' && customBackgroundUrl ? customBackgroundUrl : background}
            />
          </div>

          {/* Chat Area - Desktop: Right, Mobile: Bottom Half */}
          <div className="relative z-10 w-full md:w-1/2 lg:w-1/3 flex-1 md:h-full flex flex-col border-t md:border-t-0 md:border-l"
               style={{ 
                 borderColor: themeConfig.colors.border,
                 background: themeConfig.colors.bg
               }}>
            {/* 聊天记录区域 */}
            <div className="flex-1 overflow-y-auto min-h-0">
              <CharacterChat 
                messages={messages}
                isLoading={isLoading}
                themeConfig={themeConfig}
              />
            </div>
            
            {/* 输入框区域 - 紧贴底部 */}
            <div className="flex-shrink-0 p-2.5 md:p-4 border-t" 
                 style={{ 
                   borderColor: themeConfig.colors.border,
                   background: themeConfig.colors.surface
                 }}>
              <MultiModalInput 
                onSend={handleSendMessage}
                themeConfig={themeConfig}
                disabled={isLoading}
              />
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}