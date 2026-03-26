import { useState } from 'react'
import { motion } from 'framer-motion'
import PageTransition from '../components/ui/PageTransition'
import { Character3D } from '../components/ai/Character3D'
import { BackgroundCustomizer } from '../components/ai/BackgroundCustomizer'
import { MultiModalInput } from '../components/ai/MultiModalInput'
import { CharacterChat } from '../components/ai/CharacterChat'
import { StepNavigator } from '../components/ai/StepNavigator'
import { VoiceClone } from '../components/ai/VoiceClone'
import { AvatarClone } from '../components/ai/AvatarClone'
import { useTheme } from '../hooks/useTheme'
import { ragEngine } from '../lib/ragEngine'
import type { Message, CharacterStyle, StepType, VoiceModel, AvatarModel } from '../components/ai/types'

export default function AICharacter() {
  const { themeConfig } = useTheme()
  
  // 步骤导航状态
  const [currentStep, setCurrentStep] = useState<StepType>('chat')
  const [completedSteps, setCompletedSteps] = useState<StepType[]>([])
  
  // 数字人配置
  const [voiceModel, setVoiceModel] = useState<VoiceModel | null>(null)
  const [avatarModel, setAvatarModel] = useState<AvatarModel | null>(null)
  
  // 对话界面状态
  const [characterStyle, setCharacterStyle] = useState<CharacterStyle>('cartoon')
  const [background, setBackground] = useState<string>('office')
  const [customBackgroundUrl, setCustomBackgroundUrl] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  // 初始化欢迎消息
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      content: voiceModel && avatarModel 
        ? `你好！我是你的专属AI分身🌟

我已经学会了你的声音和形象，现在可以：
• 用你克隆的声音与你对话
• 展示你创建的数字形象
• 回答你的各种问题

有什么可以帮助你的吗？`
        : '你好！我是你的AI分身助手🌟\n\n我可以帮助你：\n• 检索学习、生活、娱乐相关的内容\n• 回答你的各种问题\n• 和你进行有趣的对话\n\n提示：你可以先完成"声音克隆"和"形象复刻"，创建专属的数字人！',
      timestamp: 1700000000000
    }
  ])

  // 处理步骤切换
  const handleStepChange = (step: StepType) => {
    setCurrentStep(step)
  }

  // 处理声音克隆完成
  const handleVoiceCloned = (voice: VoiceModel) => {
    setVoiceModel(voice)
    if (!completedSteps.includes('voice-clone')) {
      setCompletedSteps(prev => [...prev, 'voice-clone'])
    }
    // 自动跳转到下一步
    setTimeout(() => {
      setCurrentStep('avatar-clone')
    }, 1000)
  }

  // 处理形象复刻完成
  const handleAvatarCloned = (avatar: AvatarModel) => {
    setAvatarModel(avatar)
    setCharacterStyle(avatar.style)
    if (!completedSteps.includes('avatar-clone')) {
      setCompletedSteps(prev => [...prev, 'avatar-clone'])
    }
    // 自动跳转到对话界面
    setTimeout(() => {
      setCurrentStep('chat')
    }, 1000)
  }

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
      
      // 如果有克隆的声音，自动播放语音
      if (voiceModel && 'speechSynthesis' in window) {
        setTimeout(() => {
          const utterance = new SpeechSynthesisUtterance(ragResponse)
          utterance.lang = 'zh-CN'
          utterance.rate = 1.0
          utterance.pitch = 1.0
          speechSynthesis.speak(utterance)
        }, 500)
      }
    }, 1500)
  }

  const handleCustomBackgroundUpload = (imageUrl: string) => {
    setCustomBackgroundUrl(imageUrl)
  }

  // 渲染当前步骤的内容
  const renderStepContent = () => {
    switch (currentStep) {
      case 'voice-clone':
        return (
          <div className="flex-1 p-4 md:p-6 overflow-auto">
            <VoiceClone 
              themeConfig={themeConfig}
              onVoiceCloned={handleVoiceCloned}
              existingVoice={voiceModel}
            />
          </div>
        )
      case 'avatar-clone':
        return (
          <div className="flex-1 p-4 md:p-6 overflow-auto">
            <AvatarClone 
              themeConfig={themeConfig}
              onAvatarCloned={handleAvatarCloned}
              existingAvatar={avatarModel}
            />
          </div>
        )
      case 'chat':
      default:
        return (
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative min-h-0">
            {/* 3D Character Area */}
            <div className="relative w-full md:w-1/2 lg:w-2/3 h-[38vh] md:h-full flex-shrink-0 z-0 md:z-auto">
              <Character3D 
                style={avatarModel?.style || characterStyle}
                currentMessage={messages[messages.length - 1]}
                background={background === 'custom' && customBackgroundUrl ? customBackgroundUrl : background}
                onStyleChange={(newStyle) => setCharacterStyle(newStyle)}
                onBackgroundChange={(newBackground) => setBackground(newBackground)}
              />
            </div>

            {/* Chat Area */}
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
              
              {/* 输入框区域 */}
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
        )
    }
  }

  return (
    <PageTransition>
      <div className="fixed inset-0 top-0 md:top-[64px] bottom-[60px] md:bottom-0 flex flex-col bg-bg text-text overflow-hidden">
        {/* Header - 桌面端：标题和导航在一行，导航在标题右侧 */}
        <div 
          className="flex items-center justify-between px-3 md:px-6 py-1.5 md:py-2 border-b flex-shrink-0"
          style={{ 
            borderColor: themeConfig.colors.border,
            background: themeConfig.glassEffect.background,
            backdropFilter: themeConfig.glassEffect.backdropBlur
          }}
        >
          {/* 全部内容在同一行 */}
          <div className="flex items-center gap-2 min-w-max">
            {/* 电脑端标题 - 移动端隐藏 */}
            <div className="hidden md:block flex-shrink-0">
              <h1 className="text-base md:text-lg font-bold truncate whitespace-nowrap" style={{ color: themeConfig.colors.text }}>
                AI 分身助手
              </h1>
            </div>

            {/* Step Navigator - 移动端和电脑端都显示 */}
            <div className="flex items-center">
              <StepNavigator 
                currentStep={currentStep}
                completedSteps={completedSteps}
                onStepChange={handleStepChange}
                themeConfig={themeConfig}
              />
            </div>
          </div>
                  
          {/* 右侧：操作按钮 */}
          {currentStep === 'chat' && (
            <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
              {/* 移动端：场景切换按钮 */}
              <div className="md:hidden">
                <BackgroundCustomizer 
                  currentBackground={background === 'custom' && customBackgroundUrl ? customBackgroundUrl : background}
                  onBackgroundChange={(newBackground) => setBackground(newBackground)}
                />
              </div>
              {/* 移动端：卡通切换按钮 */}
              <div className="md:hidden">
                <motion.button
                  onClick={() => setCharacterStyle(style => style === 'cartoon' ? 'realistic' : 'cartoon')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-1 px-1.5 py-1 rounded-md text-xs font-medium transition-all"
                  style={{
                    background: `linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 50%, #fab1a0 100%)`,
                    border: `2px solid ${characterStyle === 'cartoon' ? '#fd79a8' : '#2d3436'}`,
                    color: characterStyle === 'cartoon' ? '#fd79a8' : '#2d3436'
                  }}
                >
                  <span className="text-sm">{characterStyle === 'cartoon' ? '🎨' : '👤'}</span>
                </motion.button>
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        {renderStepContent()}
      </div>
    </PageTransition>
  )
}