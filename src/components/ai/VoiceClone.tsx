import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, Square, Play, Pause, Trash2, Check, Volume2, RefreshCw, Sparkles, Upload } from 'lucide-react'
import type { ThemeConfig } from '../../lib/themes'

const BASE_URL = 'https://api.siliconflow.cn/v1'

export interface VoiceModel {
  id: string
  name: string
  audioUrl: string
  duration: number
  createdAt: number
  isCloned: boolean
}

interface VoiceCloneProps {
  themeConfig: ThemeConfig
  onVoiceCloned: (voiceModel: VoiceModel) => void
  existingVoice?: VoiceModel | null
}

export function VoiceClone({ themeConfig, onVoiceCloned, existingVoice }: VoiceCloneProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [recordedAudio, setRecordedAudio] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isCloning, setIsCloning] = useState(false)
  const [clonedVoice, setClonedVoice] = useState<VoiceModel | null>(existingVoice || null)
  const [sampleText, setSampleText] = useState('')
  const [isTesting, setIsTesting] = useState(false)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const sampleTexts = [
    '你好，我是你的AI分身助手。',
    '今天天气真不错，我们一起去散步吧。',
    '人工智能正在改变我们的生活方式。',
    '请录制一段清晰的语音，用于克隆您的声音。'
  ]

  // 开始录音
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' })
        const audioUrl = URL.createObjectURL(audioBlob)
        setRecordedAudio(audioUrl)
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)

      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
    } catch (error) {
      console.error('录音失败:', error)
      alert('无法访问麦克风，请检查权限设置')
    }
  }

  // 停止录音
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }

  // 播放录音
  const playRecording = () => {
    if (recordedAudio) {
      if (!audioRef.current) {
        audioRef.current = new Audio(recordedAudio)
        audioRef.current.onended = () => setIsPlaying(false)
      }
      audioRef.current.play()
      setIsPlaying(true)
    }
  }

  // 暂停播放
  const pauseRecording = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }

  // 清除录音
  const clearRecording = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    if (recordedAudio) {
      URL.revokeObjectURL(recordedAudio)
    }
    setRecordedAudio(null)
    setIsPlaying(false)
    setRecordingTime(0)
  }

  // 上传音频文件
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (recordedAudio) {
        URL.revokeObjectURL(recordedAudio)
      }
      const url = URL.createObjectURL(file)
      setRecordedAudio(url)
      
      const audio = new Audio(url)
      audio.onloadedmetadata = () => {
        setRecordingTime(Math.round(audio.duration))
      }
    }
  }

  // 克隆声音
  const cloneVoice = async () => {
    if (!recordedAudio) return

    setIsCloning(true)
    
    try {
      // 获取音频 Blob 并转换为 Base64 进行零样本 (Zero-Shot) 克隆
      const response = await fetch(recordedAudio)
      if (!response.ok) throw new Error('读取录音数据失败')
      const blob = await response.blob()
      
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(blob)
      })

      // 对于 MOSS-TTSD-v0.5，我们可以直接在合成请求中带上参考音频
      // 所以克隆步骤主要是准备好音频数据
      const voiceModel: VoiceModel = {
        id: 'zero-shot-moss',
        name: `我的声音克隆 ${new Date().toLocaleDateString()}`,
        audioUrl: base64, // 这里存储 Base64 数据
        duration: recordingTime,
        createdAt: Date.now(),
        isCloned: true
      }

      // 模拟一点处理时间，增强用户体验
      await new Promise(resolve => setTimeout(resolve, 1500))

      setClonedVoice(voiceModel)
      onVoiceCloned(voiceModel)
    } catch (error) {
      console.error('声音克隆准备失败:', error)
      alert('声音克隆准备失败: ' + (error instanceof Error ? error.message : '未知错误'))
    } finally {
      setIsCloning(false)
    }
  }

  // 测试克隆的声音
  const testClonedVoice = async () => {
    if (!sampleText || !clonedVoice) return

    setIsTesting(true)
    
    try {
      const apiKey = (import.meta.env.VITE_SILICON_FLOW_API_KEY || '').trim()
      
      if (!apiKey) {
        throw new Error('API Key 未配置，请在 .env 中设置 VITE_SILICON_FLOW_API_KEY')
      }

      const response = await fetch(`${BASE_URL}/audio/speech`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'fnlp/MOSS-TTSD-v0.5',
          input: `[S1]${sampleText}`,
          response_format: 'mp3',
          stream: false,
          // 尝试将 references 放在外层（部分版本模型要求）
          references: [
            {
              audio: clonedVoice.audioUrl,
              text: sampleTexts[3]
            }
          ]
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: '语音合成服务不可用' }))
        throw new Error(errorData.message || '语音合成失败')
      }

      const audioBlob = await response.blob()
      const audioUrl = URL.createObjectURL(audioBlob)
      
      if (audioRef.current) {
        audioRef.current.pause()
      }
      
      const audio = new Audio(audioUrl)
      audioRef.current = audio
      audio.onended = () => setIsTesting(false)
      await audio.play()
    } catch (error) {
      console.error('语音合成失败:', error)
      alert('合成语音失败: ' + (error instanceof Error ? error.message : '未知错误'))
      setIsTesting(false)
    }
  }

  // 格式化时间
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 overflow-auto">
        {/* 左侧：录音区域 - 包含标题 */}
        <div 
          className="rounded-2xl p-4 md:p-6"
          style={{ 
            background: themeConfig.colors.surface,
            border: `1px solid ${themeConfig.colors.border}`
          }}
        >
          {/* 标题合并到卡片中 */}
          <div className="mb-4">
            <motion.h2 
              className="text-lg md:text-xl font-bold mb-1"
              style={{ color: themeConfig.colors.text }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              声音克隆
            </motion.h2>
            <p className="text-xs md:text-sm" style={{ color: themeConfig.colors.textMuted }}>
              录制一段语音，让AI学习并克隆您的声音
            </p>
          </div>

          <h3 
            className="text-base md:text-lg font-semibold mb-4 flex items-center gap-2"
            style={{ color: themeConfig.colors.text }}
          >
            <Mic size={18} style={{ color: themeConfig.colors.primary }} />
            录音
          </h3>

          <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
            <motion.button
              onClick={isRecording ? stopRecording : startRecording}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative w-20 h-20 rounded-full flex items-center justify-center shrink-0"
              style={{
                background: isRecording 
                  ? `linear-gradient(135deg, ${themeConfig.colors.rose}, #ef4444)`
                  : `linear-gradient(135deg, ${themeConfig.colors.primary}, ${themeConfig.colors.primaryGlow})`,
                boxShadow: isRecording
                  ? `0 0 25px rgba(244, 63, 94, 0.4)`
                  : `0 0 25px ${themeConfig.colors.primaryMuted}`
              }}
            >
              {isRecording ? <Square size={28} className="text-white" /> : <Mic size={28} className="text-white" />}
              {isRecording && (
                <>
                  <motion.div className="absolute inset-0 rounded-full" style={{ border: `2px solid ${themeConfig.colors.rose}` }} animate={{ scale: [1, 1.3, 1], opacity: [1, 0, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
                  <motion.div className="absolute inset-0 rounded-full" style={{ border: `2px solid ${themeConfig.colors.rose}` }} animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }} />
                </>
              )}
            </motion.button>

              <div className="flex flex-col items-center sm:items-start gap-2">
                <div className="text-2xl font-mono font-bold" style={{ color: isRecording ? themeConfig.colors.rose : themeConfig.colors.text }}>
                  {formatTime(recordingTime)}
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-xs font-medium" style={{ color: themeConfig.colors.textMuted }}>
                    {isRecording ? '点击结束录制' : '点击图标录制'}
                  </p>
                  {!isRecording && !recordedAudio && (
                    <>
                      <span style={{ color: themeConfig.colors.border }}>|</span>
                      <label 
                        className="text-xs font-medium cursor-pointer flex items-center gap-1 hover:opacity-80 transition-opacity"
                        style={{ color: themeConfig.colors.primary }}
                      >
                        <Upload size={12} />
                        上传文件
                        <input type="file" accept="audio/*" onChange={handleFileUpload} className="hidden" />
                      </label>
                    </>
                  )}
                </div>
              </div>
          </div>

          {/* 录音控制 */}
          <AnimatePresence>
            {recordedAudio && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 pt-6 border-t"
                style={{ borderColor: themeConfig.colors.border }}
              >
                <div className="flex items-center justify-center gap-4">
                  <motion.button
                    onClick={isPlaying ? pauseRecording : playRecording}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{
                      background: themeConfig.colors.primaryMuted,
                      color: themeConfig.colors.primary
                    }}
                  >
                    {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                  </motion.button>

                  <motion.button
                    onClick={clearRecording}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{
                      background: `rgba(244, 63, 94, 0.1)`,
                      color: themeConfig.colors.rose
                    }}
                  >
                    <Trash2 size={20} />
                  </motion.button>

                  <motion.button
                    onClick={cloneVoice}
                    disabled={isCloning}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="px-6 py-3 rounded-full flex items-center gap-2 font-medium"
                    style={{
                      background: `linear-gradient(135deg, ${themeConfig.colors.primary}, ${themeConfig.colors.primaryGlow})`,
                      color: 'white'
                    }}
                  >
                    {isCloning ? (
                      <>
                        <RefreshCw size={18} className="animate-spin" />
                        克隆中...
                      </>
                    ) : (
                      <>
                        <Sparkles size={18} />
                        开始克隆
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 右侧：测试区域 */}
        <div 
          className="rounded-2xl p-4 md:p-6"
          style={{ 
            background: themeConfig.colors.surface,
            border: `1px solid ${themeConfig.colors.border}`
          }}
        >
          <h3 
            className="text-base md:text-lg font-semibold mb-4 flex items-center gap-2"
            style={{ color: themeConfig.colors.text }}
          >
            <Volume2 size={18} style={{ color: themeConfig.colors.primary }} />
            声音测试
          </h3>

          {clonedVoice ? (
            <div className="space-y-4">
              {/* 克隆成功提示 */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 rounded-xl flex items-center gap-3"
                style={{
                  background: `rgba(16, 185, 129, 0.1)`,
                  border: `1px solid ${themeConfig.colors.emerald}`
                }}
              >
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: `rgba(16, 185, 129, 0.2)` }}
                >
                  <Check size={20} style={{ color: themeConfig.colors.emerald }} />
                </div>
                <div>
                  <p className="font-medium" style={{ color: themeConfig.colors.text }}>
                    声音克隆成功！
                  </p>
                  <p className="text-sm" style={{ color: themeConfig.colors.textMuted }}>
                    已保存: {clonedVoice.name}
                  </p>
                </div>
              </motion.div>

              {/* 测试文本输入 */}
              <div>
                <label 
                  className="block text-sm font-medium mb-2"
                  style={{ color: themeConfig.colors.textSecondary }}
                >
                  输入测试文本
                </label>
                <textarea
                  value={sampleText}
                  onChange={(e) => setSampleText(e.target.value)}
                  placeholder="输入一段文字来测试克隆的声音..."
                  className="w-full p-3 rounded-xl resize-none focus:outline-none focus:ring-2 transition-all"
                  style={{
                    background: themeConfig.colors.bg,
                    border: `1px solid ${themeConfig.colors.border}`,
                    color: themeConfig.colors.text,
                    minHeight: '100px'
                  }}
                />
              </div>

              {/* 快速选择示例文本 */}
              <div className="flex flex-wrap gap-2">
                {sampleTexts.map((text, index) => (
                  <button
                    key={index}
                    onClick={() => setSampleText(text)}
                    className="px-3 py-1.5 rounded-full text-xs transition-all hover:opacity-80"
                    style={{
                      background: themeConfig.colors.bgAlt,
                      color: themeConfig.colors.textMuted,
                      border: `1px solid ${themeConfig.colors.border}`
                    }}
                  >
                    示例 {index + 1}
                  </button>
                ))}
              </div>

              {/* 播放按钮 */}
              <motion.button
                onClick={testClonedVoice}
                disabled={!sampleText || isTesting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 rounded-xl flex items-center justify-center gap-2 font-medium disabled:opacity-50"
                style={{
                  background: `linear-gradient(135deg, ${themeConfig.colors.primary}, ${themeConfig.colors.primaryGlow})`,
                  color: 'white'
                }}
              >
                {isTesting ? (
                  <>
                    <RefreshCw size={18} className="animate-spin" />
                    合成中...
                  </>
                ) : (
                  <>
                    <Play size={18} />
                    播放测试
                  </>
                )}
              </motion.button>
            </div>
          ) : (
            <div 
              className="h-full flex flex-col items-center justify-center text-center p-8"
              style={{ minHeight: '300px' }}
            >
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                style={{ background: themeConfig.colors.bgAlt }}
              >
                <Mic size={32} style={{ color: themeConfig.colors.textMuted }} />
              </div>
              <p style={{ color: themeConfig.colors.textMuted }}>
                请先完成录音并克隆声音<br />
                然后可以在这里测试效果
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
