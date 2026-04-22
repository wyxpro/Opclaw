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
import { Upload, History, MoreHorizontal } from 'lucide-react'
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
  
  // 历史对话状态
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [currentSessionId, setCurrentSessionId] = useState<string>(`session-${Date.now()}`)

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
      content: voiceModel && avatarModel 
        ? `你好！我是你的专属AI分身🌟\n\n我已经学会了你的声音和形象，现在可以：\n• 用你克隆的声音与你对话\n• 展示你创建的数字形象\n• 回答你的各种问题\n\n有什么可以帮助你的吗？`
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
              />
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

            <div className="flex items-center gap-3 pr-12 md:pr-20">
              {isMobile && currentStep === 'chat' && (
                <button 
                  onClick={() => setIsHistoryOpen(true)}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[11px] font-semibold text-white transition-all active:scale-95 shadow-lg"
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
      </div>
    </PageTransition>
  )
}