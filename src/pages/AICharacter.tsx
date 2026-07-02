import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
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
import { ttsService } from '../services/ttsService'
import { avatarCloneService } from '../services/avatarCloneService'
import { Upload, History, MoreHorizontal, Sparkles, Bot, Brain, Zap, Share2, Settings } from 'lucide-react'
import { AvatarSelectionDialog, DEFAULT_AI_AVATAR } from '../components/ai/AvatarSelectionDialog'
import { ShareDialog } from '../components/ai/ShareDialog'
import { CharacterConfigDialog } from '../components/ai/CharacterConfigDialog'
import type { Message, CharacterStyle, StepType, VoiceModel, AvatarModel } from '../components/ai/types'

// 根据形象选择配对的稳定音色，保证同一个形象始终保持同一种音色，默认且女性形象均为女声，男性形象为男声
function getVoiceForAvatar(avatar: any): { id: string; name: string } {
  if (!avatar) {
    return { id: 'fnlp/MOSS-TTSD-v0.5:anna', name: '温柔女生' };
  }
  
  const avatarId = avatar.id || '';
  
  switch (avatarId) {
    // 女生预设
    case 'f1': // 职场专家
      return { id: 'fnlp/MOSS-TTSD-v0.5:anna', name: '职场专家音色' };
    case 'f2': // 元气甜妹
      return { id: 'fnlp/MOSS-TTSD-v0.5:elena', name: '元气甜妹音色' };
    case 'f3': // 古风女子
      return { id: 'fnlp/MOSS-TTSD-v0.5:anna', name: '古风女子音色' };
    case 'f4': // 可爱萝莉
      return { id: 'fnlp/MOSS-TTSD-v0.5:elena', name: '可爱萝莉音色' };
    case 'f5': // 甜酷辣妹
      return { id: 'fnlp/MOSS-TTSD-v0.5:anna', name: '甜酷辣妹音色' };
    case 'f6': // 赛博朋克少女
      return { id: 'fnlp/MOSS-TTSD-v0.5:elena', name: '赛博朋克少女音色' };
    case 'f7': // 韩系女神
      return { id: 'fnlp/MOSS-TTSD-v0.5:anna', name: '韩系女神音色' };

    // 男生预设
    case 'm1':
    case 'm2':
    case 'm3':
    case 'm4':
    case 'm5':
    case 'm6':
    case 'm7':
      return { id: 'fnlp/MOSS-TTSD-v0.5:brian', name: '磁性男生' };

    // Live2D Presets
    case 'l2d-hiyori':
      return { id: 'fnlp/MOSS-TTSD-v0.5:anna', name: 'Hiyori音色' };
    case 'l2d-harugreeter':
      return { id: 'fnlp/MOSS-TTSD-v0.5:elena', name: 'HaruGreeter音色' };
    case 'l2d-haru':
      return { id: 'fnlp/MOSS-TTSD-v0.5:anna', name: 'Haru音色' };
    case 'l2d-shizuku':
      return { id: 'fnlp/MOSS-TTSD-v0.5:elena', name: 'Shizuku音色' };
    case 'l2d-tsumiki':
      return { id: 'fnlp/MOSS-TTSD-v0.5:anna', name: 'Tsumiki音色' };
    case 'l2d-rice':
      return { id: 'fnlp/MOSS-TTSD-v0.5:elena', name: 'Rice音色' };
    case 'l2d-chitose':
      return { id: 'fnlp/MOSS-TTSD-v0.5:anna', name: 'Chitose音色' };

    case 'l2d-mao':
    case 'l2d-epsilon':
    case 'l2d-hibiki':
    case 'l2d-izumi':
    case 'l2d-kei':
      return { id: 'fnlp/MOSS-TTSD-v0.5:brian', name: '磁性男生' };

    default:
      // 默认使用女声以符合 "确保说话人是女生的声音" 需求
      return { id: 'fnlp/MOSS-TTSD-v0.5:anna', name: '默认女声' };
  }
}

export default function AICharacter() {
  const { themeConfig } = useTheme()
  const [isMobile, setIsMobile] = useState(false)
  
  // 步骤导航状态
  const [currentStep, setCurrentStep] = useState<StepType>('chat')
  const [completedSteps, setCompletedSteps] = useState<StepType[]>([])

  const [searchParams] = useSearchParams()
  const tabParam = searchParams.get('tab')

  useEffect(() => {
    if (tabParam === 'voice') {
      setCurrentStep('voice-clone')
    } else if (tabParam === 'avatar') {
      setCurrentStep('avatar-clone')
    } else if (tabParam === 'chat') {
      setCurrentStep('chat')
    }
  }, [tabParam])
  
  // 数字人配置
  const [voiceModel, setVoiceModel] = useState<VoiceModel | null>(null)
  const [avatarModel, setAvatarModel] = useState<AvatarModel | null>(null)
  
  // 对话界面状态
  const [characterStyle, setCharacterStyle] = useState<CharacterStyle>('realistic')
  const [background, setBackground] = useState<string>('library')
  const [customBackgroundUrl, setCustomBackgroundUrl] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [isAvatarLoading, setIsAvatarLoading] = useState(false)
  const [customAvatar, setCustomAvatar] = useState<any>(DEFAULT_AI_AVATAR)
  // 历史对话状态
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [currentSessionId, setCurrentSessionId] = useState<string>(`session-${Date.now()}`)
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isShareOpen, setIsShareOpen] = useState(false)
  const [isConfigOpen, setIsConfigOpen] = useState(false)
  const [shareToast, setShareToast] = useState<string | null>(null)

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
        } catch (e) { console.error(e) }
      }
      
      
      // 无论是否有克隆形象，打开界面时默认使用第一个预设形象
      const params = new URLSearchParams(window.location.search)
      const hasShareId = params.has('shareId')
      if (!hasShareId) {
        setCustomAvatar(DEFAULT_AI_AVATAR)
      }

      return () => window.removeEventListener('resize', checkMobile)
    }, [])

  // 解析分享链接并恢复数字人配置
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const shareId = params.get('shareId')
    if (shareId) {
      let sharedConfig: any = null
      if (shareId.startsWith('data_')) {
        try {
          let base64 = shareId.substring(5)
            .replace(/-/g, '+')
            .replace(/_/g, '/')
          while (base64.length % 4) {
            base64 += '='
          }
          const jsonStr = decodeURIComponent(escape(atob(base64)))
          sharedConfig = JSON.parse(jsonStr)
        } catch (e) {
          console.error('Failed to parse shareId base64 from URL:', e)
        }
      } else {
        try {
          const shares = JSON.parse(localStorage.getItem('ai_character_shares') || '{}')
          sharedConfig = shares[shareId]
        } catch (e) {
          console.error('Failed to read shareId from localStorage:', e)
        }
      }

      if (sharedConfig) {
        if (sharedConfig.voiceModel) {
          setVoiceModel(sharedConfig.voiceModel)
          localStorage.setItem('ai_cloned_voice', JSON.stringify(sharedConfig.voiceModel))
        }
        if (sharedConfig.avatarModel) {
          setAvatarModel(sharedConfig.avatarModel)
          localStorage.setItem('ai_cloned_avatar', JSON.stringify(sharedConfig.avatarModel))
        }
        if (sharedConfig.customAvatar) {
          setCustomAvatar(sharedConfig.customAvatar)
        }
        if (sharedConfig.characterStyle) {
          setCharacterStyle(sharedConfig.characterStyle)
        }
        if (sharedConfig.background) {
          setBackground(sharedConfig.background)
        }
        
        setShareToast(`已成功加载来自「${sharedConfig.profile?.name || '用户'}」分享的数字人配置！`)
        setTimeout(() => setShareToast(null), 5000)
      }
    }
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
      content: '😊 Hi！我是你的专属AI分身。我可以帮你检索资料、记录生活并进行深度对话。快去完成"声音克隆"和"形象复刻"，创建属于你的数字人吧！',
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
    const prevStyle = customAvatar?.style
    setCustomAvatar(avatar)
    if (avatar.style) {
      setCharacterStyle(avatar.style as any)
      // 如果选择的是我的分身，且风格发生了变化，触发重绘
      if (avatar.isCloned && avatar.originalUrl && avatar.style !== prevStyle) {
        handleStyleSwitch(avatar.style)
      }
    }
  }

  // 处理风格切换
  const handleStyleSwitch = async (newStyle: CharacterStyle) => {
    setCharacterStyle(newStyle)
    
    // 如果是我的分身且有原始图片，则触发风格重绘
    if (customAvatar?.isCloned && customAvatar.originalUrl) {
      setIsAvatarLoading(true)
      try {
        const result = await avatarCloneService.cloneAvatar({
          imageUrl: customAvatar.originalUrl,
          style: newStyle
        })
        
        if (result.url) {
          const updatedAvatar = { 
            ...customAvatar, 
            url: result.url, 
            style: newStyle,
            styleUrls: {
              ...(customAvatar.styleUrls || {}),
              [newStyle]: result.url
            }
          }
          setCustomAvatar(updatedAvatar)
          // 如果是我的分身，同步更新到 avatarModel 以便持久化到 localStorage
          if (customAvatar.isCloned) {
            setAvatarModel(updatedAvatar)
          }
        }

      } catch (err) {
        console.error('Failed to regenerate style:', err)
      } finally {
        setIsAvatarLoading(false)
      }
    }
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
    
    // 停止当前正在播放的语音
    ttsService.stop()

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
        if (fullContent === '') setIsLoading(false)
        fullContent += chunk
        setMessages(prev => prev.map(msg => 
          msg.id === assistantMessageId ? { ...msg, content: fullContent } : msg
        ))
      })

      setIsLoading(false)
      
      // 5. 自动播放语音回复 (使用 SiliconFlow TTS)
      if (fullContent) {
        // 根据当前形象 (customAvatar) 决定发音音色，确保声音与形象绑定且在对话中保持一致
        let activeVoice: VoiceModel | null = null;
        if (customAvatar?.isCloned && voiceModel?.isCloned) {
          activeVoice = voiceModel;
        } else {
          const matchedVoice = getVoiceForAvatar(customAvatar);
          activeVoice = {
            id: matchedVoice.id,
            name: matchedVoice.name,
            audioUrl: '',
            duration: 0,
            createdAt: Date.now(),
            isCloned: false
          };
        }

        ttsService.speak(
          fullContent, 
          activeVoice,
          () => setIsSpeaking(true), 
          () => setIsSpeaking(false),
          customAvatar?.type === 'live2d'
        )
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
    // 停止当前语音
    ttsService.stop()
    // 重置对话
    setMessages([messages[0]])
    setCurrentSessionId(`session-${Date.now()}`)
  }

  // 选中历史会话
  const handleSelectSession = (session: ChatSession) => {
    ttsService.stop()
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
                isLoading={isLoading || isAvatarLoading}
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
                isSpeaking={isSpeaking}
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
                isSpeaking={isSpeaking}
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
              onBackgroundChange={(newBg) => setBackground(newBg)}
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
                forceWhite={currentStep === 'chat'}
              />

              {/* Desktop Controls Area - 紧靠步骤导航器右边 */}
              {currentStep === 'chat' && (
                <div className="flex items-center gap-3 flex-shrink-0 whitespace-nowrap ml-4">
                  <motion.button
                    onClick={() => setIsConfigOpen(true)}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-bold bg-teal-500/25 hover:bg-teal-500/35 border border-teal-400/40 backdrop-blur-md transition-all text-white shadow-[0_8px_20px_rgba(20,184,166,0.2),_inset_0_1px_1px_rgba(255,255,255,0.25)] hover:shadow-[0_8px_24px_rgba(20,184,166,0.35),_inset_0_1px_1px_rgba(255,255,255,0.4)]"
                  >
                    <Settings size={16} className="text-teal-200" />
                    <span>数字人配置</span>
                  </motion.button>

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
                      onCustomImageUpload={setCustomBackgroundUrl}
                      customBackgroundUrl={customBackgroundUrl}
                    />
                  </div>

                  <motion.button
                    onClick={() => {
                      const nextStyle = characterStyle === 'realistic' ? 'cartoon' : characterStyle === 'cartoon' ? 'hidden' : 'realistic'
                      handleStyleSwitch(nextStyle)
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-bold transition-all backdrop-blur-md border border-white/20 shadow-lg"
                    style={{
                      background: `linear-gradient(135deg, rgba(255, 234, 167, 0.2) 0%, rgba(253, 203, 110, 0.2) 50%)`,
                      color: 'white'
                    }}
                  >
                    <span>{characterStyle === 'cartoon' ? '🎨 卡通' : characterStyle === 'hidden' ? '🚫 隐藏' : '👤 真实'}</span>
                  </motion.button>

                  <div className="flex items-center gap-3">
                    <motion.button
                      onClick={() => setIsHistoryOpen(true)}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-bold bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 backdrop-blur-md transition-all text-white shadow-lg"
                    >
                      <History size={16} className="text-rose-300" />
                      <span>历史</span>
                    </motion.button>
                    <motion.button
                      onClick={() => setIsShareOpen(true)}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-bold bg-indigo-500/25 hover:bg-indigo-500/35 border border-indigo-400/40 backdrop-blur-md transition-all text-white shadow-[0_8px_20px_rgba(99,102,241,0.2),_inset_0_1px_1px_rgba(255,255,255,0.25)] hover:shadow-[0_8px_24px_rgba(99,102,241,0.35),_inset_0_1px_1px_rgba(255,255,255,0.4)]"
                    >
                      <Share2 size={16} className="text-indigo-200" />
                      <span>分享分身</span>
                    </motion.button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Layout: Left Column (StepNavigator, Avatar Selection, Background, Style Switcher) & Right Column (Config, History, Share) */}
            <div className={`md:hidden flex items-start justify-between w-full mt-1 px-2 relative ${currentStep === 'chat' ? 'min-h-[165px]' : ''}`}>
              {/* Left Column */}
              <div className="flex flex-col items-start gap-2.5 z-[60] pt-1">
                <StepNavigator 
                  currentStep={currentStep}
                  completedSteps={completedSteps}
                  onStepChange={handleStepChange}
                  themeConfig={themeConfig}
                  forceWhite={currentStep === 'chat'}
                />
                
                {currentStep === 'chat' && (
                  <div className="flex flex-col items-start gap-1.5">
                    <button 
                      onClick={() => setIsAvatarDialogOpen(true)}
                      className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold bg-white/10 border border-white/20 backdrop-blur-md text-white shadow-lg active:scale-95 transition-all"
                    >
                      <Bot size={13} className="text-indigo-300" />
                      <span>形象选择</span>
                    </button>
                    <div className="flex items-center bg-white/10 rounded-full border border-white/20 backdrop-blur-md shadow-lg scale-90 origin-left">
                      <BackgroundCustomizer 
                        currentBackground={background}
                        onBackgroundChange={(newBg) => setBackground(newBg)}
                        onCustomImageUpload={setCustomBackgroundUrl}
                        customBackgroundUrl={customBackgroundUrl}
                      />
                    </div>
                    <button
                      onClick={() => {
                        const nextStyle = characterStyle === 'realistic' ? 'cartoon' : characterStyle === 'cartoon' ? 'hidden' : 'realistic'
                        handleStyleSwitch(nextStyle)
                      }}
                      className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold transition-all backdrop-blur-md border border-white/20 shadow-lg active:scale-95 text-white"
                      style={{
                        background: `linear-gradient(135deg, rgba(255, 234, 167, 0.2) 0%, rgba(253, 203, 110, 0.2) 50%)`
                      }}
                    >
                      <span>{characterStyle === 'cartoon' ? '🎨 卡通' : characterStyle === 'hidden' ? '🚫 隐藏' : '👤 真实'}</span>
                    </button>
                  </div>
                )}
              </div>
              
              {/* Right Column */}
              {currentStep === 'chat' && (
                <div className="flex flex-col items-end gap-1.5 z-[60] pt-1">
                  <button 
                    onClick={() => setIsConfigOpen(true)}
                    className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold bg-teal-500/20 border border-teal-500/30 text-teal-200 backdrop-blur-md active:scale-95 transition-all"
                    title="数字人配置"
                  >
                    <Settings size={13} />
                    <span>数字人配置</span>
                  </button>
                  <button 
                    onClick={() => setIsHistoryOpen(true)}
                    className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold bg-rose-500/20 border border-rose-500/30 text-rose-200 backdrop-blur-md active:scale-95 transition-all"
                    title="历史对话"
                  >
                    <History size={13} />
                    <span>历史对话</span>
                  </button>
                  <button 
                    onClick={() => setIsShareOpen(true)}
                    className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold bg-indigo-500/20 border border-indigo-500/30 text-indigo-200 backdrop-blur-md active:scale-95 transition-all"
                    title="分享分身"
                  >
                    <Share2 size={13} />
                    <span>分享分身</span>
                  </button>
                </div>
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
        {/* Share Dialog */}
        <ShareDialog 
          isOpen={isShareOpen}
          onClose={() => setIsShareOpen(false)}
          voiceModel={voiceModel}
          avatarModel={avatarModel}
          characterStyle={characterStyle}
          background={background}
          customAvatar={customAvatar}
        />
        {/* Character Config Dialog */}
        <CharacterConfigDialog 
          isOpen={isConfigOpen}
          onClose={() => setIsConfigOpen(false)}
          sessions={sessions}
        />
        {/* Share Load Toast */}
        <AnimatePresence>
          {shareToast && (
            <motion.div
              initial={{ opacity: 0, y: -50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.9 }}
              className="fixed top-20 left-1/2 -translate-x-1/2 z-[200] px-6 py-3 rounded-full bg-indigo-600/90 text-white font-bold text-sm shadow-xl backdrop-blur-md flex items-center gap-2 border border-indigo-400/20"
            >
              <Sparkles size={16} className="text-indigo-200 animate-spin" />
              <span>{shareToast}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  )
}