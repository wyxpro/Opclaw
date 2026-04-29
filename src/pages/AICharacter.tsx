import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import PageTransition from '../components/ui/PageTransition'
import { Character3D } from '../components/ai/Character3D'
import { BackgroundCustomizer } from '../components/ai/BackgroundCustomizer'
import { CharacterChat } from '../components/ai/CharacterChat'

import { StepNavigator } from '../components/ai/StepNavigator'
import { VoiceClone } from '../components/ai/VoiceClone'
import { AvatarClone } from '../components/ai/AvatarClone'
import { CharacterVoiceUI } from '../components/ai/CharacterVoiceUI'
import { HistoryDialog, type ChatSession } from '../components/ai/HistoryDialog'
import { useTheme } from '../hooks/useTheme'
import { ragEngine } from '../lib/ragEngine'
import { aiService, type ChatMessage } from '../services/aiService'
import { Upload, History, MoreHorizontal, Sparkles, Bot } from 'lucide-react'
import { AvatarSelectionDialog, DEFAULT_AI_AVATAR } from '../components/ai/AvatarSelectionDialog'
import type { Message, CharacterStyle, StepType, VoiceModel, AvatarModel } from '../components/ai/types'

export default function AICharacter() {
  const { themeConfig } = useTheme()
  const [isMobile, setIsMobile] = useState(false)
  
  // 步骤导航状态
  const [currentStep, setCurrentStep] = useState<StepType>('chat')
  const [completedSteps, setCompletedSteps] = useState<StepType[]>([])
  
  // 数字人配置
  const [voiceModel, setVoiceModel] = useState<VoiceModel | null>(null)
  const [avatarModel, setAvatarModel] = useState<AvatarModel | null>(DEFAULT_AI_AVATAR)
  
  // 对话界面状态
  const [characterStyle, setCharacterStyle] = useState<CharacterStyle>('realistic')
  const [background, setBackground] = useState<string>('office')
  const [customBackgroundUrl, setCustomBackgroundUrl] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [customAvatar, setCustomAvatar] = useState<any>(DEFAULT_AI_AVATAR)
  // 历史对话状态
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [currentSessionId, setCurrentSessionId] = useState<string>(`session-${Date.now()}`)
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false)

    // 加载历史记录及已克隆的模型
    useEffect(() => {
      const checkMobile = () => {
        setIsMobile(window.innerWidth < 768)
      }
      checkMobile()
      window.addEventListener('resize', checkMobile)
      
      const savedSessions = localStorage.getItem('ai_chat_sessions')
      if (savedSessions) {
        try { setSessions(JSON.parse(savedSessions)) } catch (e) { console.error(e) }
      }

      const savedVoice = localStorage.getItem('ai_cloned_voice')
      if (savedVoice) {
        try { setVoiceModel(JSON.parse(savedVoice)) } catch (e) { console.error(e) }
      }

      const savedAvatar = localStorage.getItem('ai_cloned_avatar')
      if (savedAvatar) {
        try { 
          const avatar = JSON.parse(savedAvatar)
          setAvatarModel(avatar)
          setCustomAvatar(avatar)
        } catch (e) { console.error(e) }
      } else {
        // 没有保存的头像时使用默认AI头像
        setCustomAvatar(DEFAULT_AI_AVATAR)
      }

      return () => window.removeEventListener('resize', checkMobile)
    }, [])

  // 持久化保存数据
  useEffect(() => {
    if (sessions.length > 0) localStorage.setItem('ai_chat_sessions', JSON.stringify(sessions))
  }, [sessions])

  useEffect(() => {
    if (voiceModel) localStorage.setItem('ai_cloned_voice', JSON.stringify(voiceModel))
  }, [voiceModel])

  useEffect(() => {
    if (avatarModel) localStorage.setItem('ai_cloned_avatar', JSON.stringify(avatarModel))
  }, [avatarModel])

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
  }

  // 处理形象复刻完成
  const handleAvatarCloned = (avatar: any) => {
    const newAvatar = { ...avatar, id: 'custom', name: '我的分身', isCloned: true }
    setAvatarModel(newAvatar)
    setCustomAvatar(newAvatar)
    if (avatar.style) setCharacterStyle(avatar.style as any)
    
    // 同步到 localStorage
    localStorage.setItem('ai_cloned_avatar', JSON.stringify(newAvatar))
    
    if (!completedSteps.includes('avatar-clone')) {
      setCompletedSteps(prev => [...prev, 'avatar-clone'])
    }
  }

  // 处理从形象库选择
  const handleAvatarSelect = (avatar: any) => {
    setCustomAvatar(avatar)
    if (avatar.style) setCharacterStyle(avatar.style as any)
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

    try {
      // 1. 获取检索到的上下文
      const context = aiService.findRelevantContext(content)
      
      // 2. 准备消息列表 (系统提示词 + 历史消息)
      const chatMessages: ChatMessage[] = [
        { role: 'system', content: aiService.getSystemPrompt(context) },
        ...messages.map(m => ({ role: m.role as any, content: m.content })),
        { role: 'user', content }
      ]

      // 3. 创建空的助手回复消息
      const assistantMessageId = `assistant-${Date.now()}`
      const newAssistantMessage: Message = {
        id: assistantMessageId,
        role: 'assistant',
        content: '',
        timestamp: Date.now()
      }
      setMessages(prev => [...prev, newAssistantMessage])

      let fullContent = ''
      
      // 4. 调用流式接口
      await aiService.streamChat(chatMessages, (chunk) => {
        fullContent += chunk
        setMessages(prev => prev.map(msg => 
          msg.id === assistantMessageId ? { ...msg, content: fullContent } : msg
        ))
      })

      setIsLoading(false)
      
      // 5. 自动播放语音回复 (在流结束后)
      if ('speechSynthesis' in window && fullContent) {
        // 过滤掉开头的 emoji 以获得更好的语音效果
        const textToSpeak = fullContent.replace(/^[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]+ /u, '')
        const utterance = new SpeechSynthesisUtterance(textToSpeak)
        utterance.lang = 'zh-CN'
        utterance.rate = 1.0
        utterance.pitch = 1.0
        speechSynthesis.speak(utterance)
      }
    } catch (error) {
      console.error('Failed to stream chat:', error)
      setIsLoading(false)
    }
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
    setCharacterStyle('hidden') // 点击后自动隐藏数字人
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
                style={characterStyle}
                messages={messages}
                isLoading={isLoading}
                onSendMessage={handleSendMessage}
                background={background === 'custom' && customBackgroundUrl ? customBackgroundUrl : background}
                onStyleChange={(newStyle) => setCharacterStyle(newStyle)}
                onBackgroundChange={(newBackground) => setBackground(newBackground)}
                onEndCall={handleEndCall}
                onOpenHistory={() => setIsHistoryOpen(true)}
                customAvatar={customAvatar}
                onAvatarChange={handleAvatarSelect}
                myAvatar={avatarModel}
                onGoToClone={() => {
                  setCurrentStep('avatar-clone')
                  setIsAvatarDialogOpen(false)
                }}
              />
            </div>
          )
        }

        return (
          <div className="flex-1 flex flex-col overflow-hidden relative min-h-0 bg-black">
            {/* 3D Character Area (Now Full Screen) */}
            <div className="absolute inset-0 z-0">
              <Character3D 
                style={characterStyle}
                currentMessage={messages[messages.length - 1]}
                background={background === 'custom' && customBackgroundUrl ? customBackgroundUrl : background}
                onStyleChange={(newStyle) => setCharacterStyle(newStyle)}
                onBackgroundChange={(newBackground) => setBackground(newBackground)}
                customAvatar={customAvatar}
              />
              

            </div>

            {/* Floating Voice Call Overlay at Bottom */}
            <CharacterChat 
              style={characterStyle}
              messages={messages}
              isLoading={isLoading}
              themeConfig={themeConfig}
              customAvatar={customAvatar}
              onSendMessage={handleSendMessage}
              onEndCall={handleEndCall}
            />
          </div>
        )
    }
  }

  return (
    <PageTransition>
      <div className="fixed inset-0 top-0 md:top-[64px] bottom-0 md:bottom-0 flex flex-col bg-bg text-text overflow-hidden">
        {/* Header */}
        <div 
          className={`flex items-center justify-between px-3 md:px-6 py-1.5 md:py-2 flex-shrink-0 z-50 ${
            currentStep === 'chat' ? 'absolute top-0 left-0 right-0 border-none bg-transparent' : 'border-b'
          }`}
          style={{ 
            borderColor: currentStep === 'chat' ? 'transparent' : themeConfig.colors.border,
            background: currentStep === 'chat' ? 'transparent' : themeConfig.glassEffect.background,
            backdropFilter: currentStep === 'chat' ? 'none' : themeConfig.glassEffect.backdropBlur
          }}
        >
          <div className="flex items-center gap-2 min-w-max flex-1">
            <div className="hidden md:block flex-shrink-0">
              <h1 className="text-base md:text-lg font-bold truncate whitespace-nowrap lg:mr-4" style={{ color: currentStep === 'chat' ? 'white' : themeConfig.colors.text }}>
                AI 分身助手
              </h1>
            </div>

            {/* Desktop: StepNavigator + Controls */}
            <div className="hidden md:flex items-center gap-2">
              <StepNavigator 
                currentStep={currentStep}
                completedSteps={completedSteps}
                onStepChange={handleStepChange}
                themeConfig={themeConfig}
              />

              {/* Desktop Controls Area - 紧靠步骤导航器右边 */}
              {currentStep === 'chat' && (
                <div className="flex items-center gap-3 flex-shrink-0 whitespace-nowrap ml-4">
                  <motion.button
                    onClick={() => setIsAvatarDialogOpen(true)}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-bold bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md transition-all text-white shadow-lg"
                  >
                    <Bot size={16} className="text-indigo-400" />
                    <span>形象选择</span>
                  </motion.button>

                  <div className="flex items-center bg-white/10 rounded-full border border-white/20 backdrop-blur-md shadow-lg">
                    <BackgroundCustomizer 
                      currentBackground={background}
                      onBackgroundChange={(newBg) => setBackground(newBg)}
                    />
                  </div>

                  <motion.button
                    onClick={() => setCharacterStyle(characterStyle === 'realistic' ? 'cartoon' : characterStyle === 'cartoon' ? 'hidden' : 'realistic')}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-bold transition-all backdrop-blur-md border border-white/20 shadow-lg"
                    style={{
                      background: `linear-gradient(135deg, rgba(255, 234, 167, 0.2) 0%, rgba(253, 203, 110, 0.2) 50%)`,
                      color: 'white'
                    }}
                  >
                    <span>{characterStyle === 'cartoon' ? '🎨 卡通' : characterStyle === 'hidden' ? '🚫 隐藏' : '👤 真实'}</span>
                  </motion.button>

                  <motion.button
                    onClick={() => setIsHistoryOpen(true)}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-bold bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md transition-all text-white shadow-lg"
                  >
                    <History size={16} className="text-indigo-400" />
                    <span>历史</span>
                  </motion.button>
                </div>
              )}
            </div>

            {/* Mobile: StepNavigator + History Button */}
            <div className="md:hidden flex items-center gap-2">
              <StepNavigator 
                currentStep={currentStep}
                completedSteps={completedSteps}
                onStepChange={handleStepChange}
                themeConfig={themeConfig}
              />
              
              {/* Mobile History Button - 紧靠数字人对话右边 */}
              {currentStep === 'chat' && (
                <button 
                  onClick={() => setIsHistoryOpen(true)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full backdrop-blur-md border text-[11px] font-semibold transition-all active:scale-95 shadow-[0_4px_12px_rgba(0,0,0,0.05)] ml-2 ${
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
                  <History size={12} />
                  <span>历史对话</span>
                </button>
              )}
            </div>
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
          onSelectAvatar={handleAvatarSelect}
          myAvatar={avatarModel}
          currentAvatarUrl={customAvatar?.url}
          onGoToClone={() => {
            setCurrentStep('avatar-clone')
            setIsAvatarDialogOpen(false)
          }}
        />
      </div>
    </PageTransition>
  )
}