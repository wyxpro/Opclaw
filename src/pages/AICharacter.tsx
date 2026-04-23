import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import PageTransition from '../components/ui/PageTransition'
import { Character3D } from '../components/ai/Character3D'
import { BackgroundCustomizer } from '../components/ai/BackgroundCustomizer'
import { MultiModalInput } from '../components/ai/MultiModalInput'
import { CharacterChat } from '../components/ai/CharacterChat'
import { StepNavigator } from '../components/ai/StepNavigator'
import { VoiceClone } from '../components/ai/VoiceClone'
import { AvatarClone } from '../components/ai/AvatarClone'
import { CharacterVoiceUI } from '../components/ai/CharacterVoiceUI'
import { HistoryDialog, type ChatSession } from '../components/ai/HistoryDialog'
import { useTheme } from '../hooks/useTheme'
import { ragEngine } from '../lib/ragEngine'
import { Upload, History, MoreHorizontal, Sparkles, Bot } from 'lucide-react'
import { AvatarSelectionDialog } from '../components/ai/AvatarSelectionDialog'
import type { Message, CharacterStyle, StepType, VoiceModel, AvatarModel } from '../components/ai/types'

export default function AICharacter() {
  const { themeConfig } = useTheme()
  const [isMobile, setIsMobile] = useState(false)
  
  // 步骤导航状态
  const [currentStep, setCurrentStep] = useState<StepType>('chat')
  const [completedSteps, setCompletedSteps] = useState<StepType[]>([])
  
  // 数字人配置
  const [voiceModel, setVoiceModel] = useState<VoiceModel | null>(null)
  const [avatarModel, setAvatarModel] = useState<AvatarModel | null>(null)
  
  // 对话界面状态
  const [characterStyle, setCharacterStyle] = useState<CharacterStyle>('realistic')
  const [background, setBackground] = useState<string>('office')
  const [customBackgroundUrl, setCustomBackgroundUrl] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [customAvatar, setCustomAvatar] = useState<{ type: 'image' | 'video' | 'custom', url: string, style?: string } | null>(null)
  
  // 历史对话状态
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [currentSessionId, setCurrentSessionId] = useState<string>(`session-${Date.now()}`)
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false)

  // 检测窗口大小及加载历史记录
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    // 加载历史记录
    const savedSessions = localStorage.getItem('ai_chat_sessions')
    if (savedSessions) {
      try {
        setSessions(JSON.parse(savedSessions))
      } catch (e) {
        console.error('Failed to parse sessions', e)
      }
    }

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // 持久化保存历史
  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem('ai_chat_sessions', JSON.stringify(sessions))
    }
  }, [sessions])

  // 初始化欢迎消息
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      content: 'Hi, 我是你的专属AI分身助手，帮助检索学习、生活、工作相关的内容，进行有趣的对话。Tips：您可以先完成"声音克隆"和"形象复刻"，创建您的数字人！',
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
  const handleAvatarCloned = (avatar: any) => {
    setAvatarModel({ ...avatar, id: 'custom', name: '我的分身' })
    setCustomAvatar(avatar)
    if (avatar.style) setCharacterStyle(avatar.style as any)
    
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
      
      // 自动播放语音回复
      if ('speechSynthesis' in window) {
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

  // 保存当前对话到历史
  const saveCurrentSession = () => {
    if (messages.length <= 1) return // 只有欢迎语不保存

    const newSession: ChatSession = {
      id: currentSessionId,
      title: messages[1]?.content.substring(0, 20) || '新对话',
      timestamp: Date.now(),
      messages: messages,
      characterName: '小梦'
    }

    setSessions(prev => {
      const filtered = prev.filter(s => s.id !== currentSessionId)
      return [newSession, ...filtered]
    })
  }

  // 处理挂断 (结束通话)
  const handleEndCall = () => {
    saveCurrentSession()
    // 重置对话
    setMessages([messages[0]])
    setCurrentSessionId(`session-${Date.now()}`)
  }

  // 选中历史会话
  const handleSelectSession = (session: ChatSession) => {
    setMessages(session.messages)
    setCurrentSessionId(session.id)
    setIsHistoryOpen(false)
  }

  // 删除历史会话
  const handleDeleteSession = (id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id))
    if (id === currentSessionId) {
      handleEndCall()
    }
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
        if (isMobile) {
          return (
            <div className="flex-1 relative">
              <CharacterVoiceUI 
                style={avatarModel?.style || characterStyle}
                messages={messages}
                isLoading={isLoading}
                onSendMessage={handleSendMessage}
                background={background === 'custom' && customBackgroundUrl ? customBackgroundUrl : background}
                onStyleChange={(newStyle) => setCharacterStyle(newStyle)}
                onBackgroundChange={(newBackground) => setBackground(newBackground)}
                onEndCall={handleEndCall}
                onOpenHistory={() => setIsHistoryOpen(true)}
                customAvatar={customAvatar}
                onAvatarChange={handleAvatarCloned}
              />
            </div>
          )
        }

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
                customAvatar={customAvatar}
              />
              
              {/* Desktop Controls Overlay */}
              <div className="absolute top-6 left-6 z-20 hidden md:flex items-center gap-3">
                <motion.button
                  onClick={() => setIsAvatarDialogOpen(true)}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md transition-all text-white shadow-lg"
                >
                  <Bot size={13} className="text-indigo-400" />
                  <span>数字分身</span>
                </motion.button>

                <div className="flex items-center bg-white/10 rounded-full border border-white/20 backdrop-blur-md shadow-lg">
                  <BackgroundCustomizer 
                    currentBackground={background}
                    onBackgroundChange={(newBg) => setBackground(newBg)}
                  />
                </div>

                <motion.button
                  onClick={() => setCharacterStyle(characterStyle === 'cartoon' ? 'realistic' : 'cartoon')}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold transition-all backdrop-blur-md border border-white/20 shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, rgba(255, 234, 167, 0.2) 0%, rgba(253, 203, 110, 0.2) 50%)`,
                    color: 'white'
                  }}
                >
                  <span>{characterStyle === 'cartoon' ? '🎨 卡通' : '👤 真实'}</span>
                </motion.button>
              </div>
            </div>

            {/* Chat Area */}
            <div className="relative z-10 w-full md:w-1/2 lg:w-1/3 flex-1 md:h-full flex flex-col border-t md:border-t-0 md:border-l"
                 style={{ 
                   borderColor: themeConfig.colors.border,
                   background: themeConfig.colors.bg
                 }}>
              <div className="flex-1 overflow-y-auto min-h-0">
                <CharacterChat 
                  messages={messages}
                  isLoading={isLoading}
                  themeConfig={themeConfig}
                  customAvatar={customAvatar}
                />
              </div>
              
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
      <div className="fixed inset-0 top-0 md:top-[64px] bottom-0 md:bottom-0 flex flex-col bg-bg text-text overflow-hidden">
        {/* Header */}
        <div 
          className={`flex items-center justify-between px-3 md:px-6 py-1.5 md:py-2 border-b flex-shrink-0 z-50 ${
            isMobile && currentStep === 'chat' ? 'absolute top-0 left-0 right-0 border-none bg-transparent' : ''
          }`}
          style={{ 
            borderColor: isMobile && currentStep === 'chat' ? 'transparent' : themeConfig.colors.border,
            background: isMobile && currentStep === 'chat' ? 'transparent' : themeConfig.glassEffect.background,
            backdropFilter: isMobile && currentStep === 'chat' ? 'none' : themeConfig.glassEffect.backdropBlur
          }}
        >
          <div className="flex items-center gap-2 min-w-max">
            <div className="hidden md:block flex-shrink-0">
              <h1 className="text-base md:text-lg font-bold truncate whitespace-nowrap" style={{ color: themeConfig.colors.text }}>
                AI 分身助手
              </h1>
            </div>

            <StepNavigator 
              currentStep={currentStep}
              completedSteps={completedSteps}
              onStepChange={handleStepChange}
              themeConfig={themeConfig}
            />
          </div>

            <div className="flex items-center gap-3 pr-4 md:pr-6">
              {currentStep === 'chat' && (
                <button 
                  onClick={() => setIsHistoryOpen(true)}
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full backdrop-blur-md border text-[11px] font-semibold transition-all active:scale-95 shadow-[0_4px_12px_rgba(0,0,0,0.05)] ${
                    isMobile && currentStep === 'chat' 
                      ? 'bg-white/10 border-white/20 text-white shadow-lg' 
                      : 'hover:opacity-80'
                  }`}
                  style={!(isMobile && currentStep === 'chat') ? {
                    background: themeConfig.colors.surface,
                    borderColor: themeConfig.colors.border,
                    color: themeConfig.colors.text
                  } : {}}
                >
                  <History size={14} />
                  <span>历史</span>
                </button>
              )}
            </div>
        </div>

        {/* Main Content */}
        {renderStepContent()}

        {/* History Dialog */}
        <HistoryDialog 
          isOpen={isHistoryOpen}
          onClose={() => setIsHistoryOpen(false)}
          sessions={sessions}
          onSelectSession={handleSelectSession}
          onDeleteSession={handleDeleteSession}
        />
        {/* Avatar Selection Dialog */}
        <AvatarSelectionDialog 
          isOpen={isAvatarDialogOpen} 
          onClose={() => setIsAvatarDialogOpen(false)}
          onSelectAvatar={handleAvatarCloned}
        />
      </div>
    </PageTransition>
  )
}