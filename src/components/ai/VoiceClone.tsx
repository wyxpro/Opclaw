import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, Square, Play, Pause, Trash2, Check, Volume2, RefreshCw, Sparkles, Upload, RotateCcw, VolumeX } from 'lucide-react'
import type { ThemeConfig } from '../../lib/themes'

const BASE_URL = 'https://api.siliconflow.cn/v1'

// 将 AudioBuffer 转换为 WAV 格式的 Blob
function bufferToWave(abuffer: AudioBuffer, len: number) {
  const numOfChan = abuffer.numberOfChannels
  const length = len * numOfChan * 2 + 44
  const buffer = new ArrayBuffer(length)
  const view = new DataView(buffer)
  const channels = []
  let sample
  let offset = 0
  let pos = 0

  const setUint16 = (data: number) => {
    view.setUint16(pos, data, true)
    pos += 2
  }

  const setUint32 = (data: number) => {
    view.setUint32(pos, data, true)
    pos += 4
  }

  const writeString = (s: string) => {
    for (let i = 0; i < s.length; i++) {
      view.setUint8(pos + i, s.charCodeAt(i))
    }
    pos += s.length
  }

  // 写 RIFF 头
  writeString('RIFF')
  setUint32(length - 8) // 文件长度 - 8
  writeString('WAVE')

  writeString('fmt ')
  setUint32(16) // 长度 = 16
  setUint16(1) // PCM (未压缩)
  setUint16(numOfChan)
  setUint32(abuffer.sampleRate)
  setUint32(abuffer.sampleRate * 2 * numOfChan) // 平均字节/秒
  setUint16(numOfChan * 2) // 块对齐
  setUint16(16) // 16位

  writeString('data')
  setUint32(length - pos - 4) // chunk 长度

  for (let i = 0; i < abuffer.numberOfChannels; i++) {
    channels.push(abuffer.getChannelData(i))
  }

  while (pos < length) {
    for (let i = 0; i < numOfChan; i++) {
      sample = Math.max(-1, Math.min(1, channels[i][offset]))
      sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0
      view.setInt16(pos, sample, true)
      pos += 2
    }
    offset++
  }

  return new Blob([buffer], { type: 'audio/wav' })
}

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
  const [isMobile, setIsMobile] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [recordedAudio, setRecordedAudio] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isCloning, setIsCloning] = useState(false)
  const [clonedVoice, setClonedVoice] = useState<VoiceModel | null>(existingVoice || null)
  const [testText, setTestText] = useState('')
  const [isTesting, setIsTesting] = useState(false)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const trainingText = '你好，很高兴认识你！'

  const sampleTestTexts = [
    '今天天气怎么样？',
    '给我讲一个冷笑话吧。',
    '你觉得人工智能未来会如何发展？',
    '很高兴能拥有属于自己的AI分身。'
  ]

  // 监听窗口大小变化
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // 监听音量变化
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume
    }
  }, [volume, isMuted])

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
        const audioBlob = new Blob(audioChunksRef.current, { type: mediaRecorder.mimeType })
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

  // 重新录制
  const reRecord = () => {
    clearRecording()
    startRecording()
  }

  // 播放录音
  const playRecording = () => {
    if (recordedAudio) {
      if (!audioRef.current || audioRef.current.src !== recordedAudio) {
        audioRef.current = new Audio(recordedAudio)
        audioRef.current.onended = () => setIsPlaying(false)
      }
      audioRef.current.volume = isMuted ? 0 : volume
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

  // 克隆声音 (上传到 StepFun)
  const cloneVoice = async () => {
    if (!recordedAudio) return

    setIsCloning(true)
    console.log('开始上传音频到 StepFun...')
    
    try {
      const apiKey = (import.meta.env.VITE_STEP_API_KEY || '').trim()
      if (!apiKey) throw new Error('StepFun API Key 未配置')

      // 1. 获取音频 Blob 并转换为 WAV
      const audioRes = await fetch(recordedAudio)
      const originalBlob = await audioRes.blob()
      console.log('原始录音大小:', originalBlob.size, '类型:', originalBlob.type)

      // 转换为 WAV
      console.log('正在转换为 WAV 格式...')
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
      const arrayBuffer = await originalBlob.arrayBuffer()
      const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer)
      const wavBlob = bufferToWave(audioBuffer, audioBuffer.length)
      console.log('WAV 转换完成, 大小:', wavBlob.size)
      
      // 2. 上传文件到 StepFun
      const formData = new FormData()
      formData.append('file', wavBlob, 'voice_sample.wav')
      formData.append('purpose', 'storage')

      const uploadRes = await fetch('https://api.stepfun.com/v1/files', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`
        },
        body: formData
      })

      if (!uploadRes.ok) {
        const err = await uploadRes.json().catch(() => ({ message: '上传请求失败' }))
        console.error('StepFun 上传失败详情:', err)
        throw new Error(err.error?.message || err.message || '文件上传失败')
      }

      const fileData = await uploadRes.json()
      console.log('文件上传成功, file_id:', fileData.id)
      const fileId = fileData.id

      // 3. 额外等待 3 秒，确保 StepFun 服务器完成索引
      console.log('正在准备模型，请稍候...')
      await new Promise(resolve => setTimeout(resolve, 3000))

      // 4. 创建声音模型信息
      const voiceModel: VoiceModel = {
        id: fileId,
        name: `我的声音模型 ${new Date().toLocaleDateString()}`,
        audioUrl: recordedAudio,
        duration: recordingTime,
        createdAt: Date.now(),
        isCloned: true
      }

      setClonedVoice(voiceModel)
      onVoiceCloned(voiceModel)
    } catch (error) {
      console.error('StepFun 克隆过程异常:', error)
      alert('声音克隆失败: ' + (error instanceof Error ? error.message : '未知错误'))
    } finally {
      setIsCloning(false)
    }
  }

  // 测试克隆的声音 (StepAudio 2.5 TTS)
  const testClonedVoice = async () => {
    if (!testText || !clonedVoice) return

    setIsTesting(true)
    console.log('开始测试 StepFun 语音合成, file_id:', clonedVoice.id)
    
    try {
      const apiKey = (import.meta.env.VITE_STEP_API_KEY || '').trim()
      if (!apiKey) throw new Error('StepFun API Key 未配置')

      const requestBody = {
        model: 'stepaudio-2.5-tts',
        file_id: clonedVoice.id,
        text: trainingText,    // 阶跃 API 要求：text 为参考音频的文本 (用于校验 CER)
        sample_text: testText, // 阶跃 API 要求：sample_text 为待合成的文本
        instruction: '语气自然，语速适中',
        response_format: 'mp3',
        stream: false
      }
      console.log('请求体内容:', requestBody)

      const response = await fetch('https://api.stepfun.com/v1/audio/voices/preview', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: '获取错误信息失败' }))
        console.error('StepFun 合成失败详情:', errorData)
        throw new Error(errorData.error?.message || errorData.message || '语音合成失败')
      }

      const audioBlob = await response.blob()
      const audioUrl = URL.createObjectURL(audioBlob)
      
      if (audioRef.current) {
        audioRef.current.pause()
      }
      
      const audio = new Audio(audioUrl)
      audioRef.current = audio
      audio.volume = isMuted ? 0 : volume
      audio.onended = () => setIsTesting(false)
      await audio.play()
    } catch (error) {
      console.error('StepFun 测试异常:', error)
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
    <div className="h-full flex flex-col gap-6 overflow-auto pb-10">

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 左侧：训练与录制 (8/12) */}
        <div className="lg:col-span-7 space-y-6">
          {isMobile ? (
            /* 移动端：合并示例文本与录制区 - 一行显示 */
            <section 
              className="rounded-2xl p-4"
              style={{ 
                background: themeConfig.colors.surface,
                border: `1px solid ${themeConfig.colors.border}`,
                boxShadow: themeConfig.glassEffect.boxShadow
              }}
            >
              <div className="flex flex-row gap-4 items-stretch">
                {/* 文本区域 */}
                <div className="flex-1 flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center bg-blue-500/10 text-blue-500">
                      <span className="font-bold text-xs">1</span>
                    </div>
                    <h3 className="font-bold text-sm" style={{ color: themeConfig.colors.text }}>训练文本</h3>
                  </div>
                  <div 
                    className="flex-1 p-3 rounded-xl text-sm leading-relaxed font-medium flex items-center justify-center italic"
                    style={{ 
                      background: themeConfig.colors.bgAlt,
                      color: themeConfig.colors.text,
                      border: `1px dashed ${themeConfig.colors.border}`
                    }}
                  >
                    "{trainingText}"
                  </div>
                </div>

                {/* 录音区域 */}
                <div 
                  className="flex flex-col items-center justify-center gap-3 min-w-[120px] p-2 rounded-xl"
                  style={{ background: `${themeConfig.colors.bgAlt}44` }}
                >
                  <div className="relative">
                    <motion.button
                      onClick={isRecording ? stopRecording : (recordedAudio ? reRecord : startRecording)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-16 h-16 rounded-full flex items-center justify-center z-10 relative"
                      style={{
                        background: isRecording 
                          ? `linear-gradient(135deg, ${themeConfig.colors.rose}, #ef4444)`
                          : recordedAudio 
                            ? `linear-gradient(135deg, #fbbf24, #f59e0b)`
                            : `linear-gradient(135deg, ${themeConfig.colors.primary}, ${themeConfig.colors.primaryGlow})`,
                        boxShadow: isRecording
                          ? `0 0 15px rgba(244, 63, 94, 0.4)`
                          : `0 0 15px ${themeConfig.colors.primaryMuted}`
                      }}
                    >
                      {isRecording ? <Square size={24} className="text-white" /> : recordedAudio ? <RotateCcw size={24} className="text-white" /> : <Mic size={24} className="text-white" />}
                    </motion.button>
                    <AnimatePresence>
                      {isRecording && (
                        <motion.div 
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1.6, opacity: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
                          className="absolute inset-0 rounded-full border-2 border-red-500 pointer-events-none"
                        />
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="text-center">
                    <div className="text-xl font-mono font-bold" style={{ color: isRecording ? themeConfig.colors.rose : themeConfig.colors.text }}>
                      {formatTime(recordingTime)}
                    </div>
                    <div className="text-[10px] font-medium" style={{ color: themeConfig.colors.textMuted }}>
                      {isRecording ? '停止' : recordedAudio ? '重录' : '开始'}
                    </div>
                  </div>
                </div>
              </div>

              {/* 移动端操作栏 */}
              {(recordedAudio || !isRecording) && (
                <div className="mt-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {recordedAudio && (
                      <>
                        <button onClick={isPlaying ? pauseRecording : playRecording} className="px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-500 text-xs font-medium">
                          {isPlaying ? '暂停' : '试听'}
                        </button>
                        <button onClick={clearRecording} className="p-1.5 rounded-lg bg-red-500/10 text-red-500">
                          <Trash2 size={14} />
                        </button>
                      </>
                    )}
                  </div>
                  {recordedAudio && (
                    <button onClick={cloneVoice} disabled={isCloning} className="px-5 py-2 rounded-xl bg-primary text-white text-xs font-bold shadow-lg flex items-center gap-1">
                      {isCloning ? <RefreshCw size={12} className="animate-spin" /> : <Sparkles size={12} />}
                      {isCloning ? '处理中' : '开始克隆'}
                    </button>
                  )}
                </div>
              )}
            </section>
          ) : (
            /* 电脑端：传统的垂直堆叠样式 */
            <>
              {/* 1. 示例文本区域 */}
              <section 
                className="rounded-2xl p-6"
                style={{ 
                  background: themeConfig.colors.surface,
                  border: `1px solid ${themeConfig.colors.border}`,
                  boxShadow: themeConfig.glassEffect.boxShadow
                }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-500/10 text-blue-500">
                    <span className="font-bold text-sm">1</span>
                  </div>
                  <h3 className="font-bold text-lg" style={{ color: themeConfig.colors.text }}>训练文本</h3>
                </div>
                <div 
                  className="p-6 rounded-xl text-xl leading-relaxed font-medium text-center"
                  style={{ 
                    background: themeConfig.colors.bgAlt,
                    color: themeConfig.colors.text,
                    border: `1px dashed ${themeConfig.colors.border}`
                  }}
                >
                  "{trainingText}"
                </div>
                <p className="mt-3 text-sm text-center" style={{ color: themeConfig.colors.textMuted }}>
                  请保持环境安静，用平稳自然的语速朗读以上文本
                </p>
              </section>

              {/* 2. 录制功能区 */}
              <section 
                className="rounded-2xl p-6"
                style={{ 
                  background: themeConfig.colors.surface,
                  border: `1px solid ${themeConfig.colors.border}`,
                  boxShadow: themeConfig.glassEffect.boxShadow
                }}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-red-500/10 text-red-500">
                      <span className="font-bold text-sm">2</span>
                    </div>
                    <h3 className="font-bold text-lg" style={{ color: themeConfig.colors.text }}>录制音频</h3>
                  </div>
                  
                  {isRecording && (
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-red-500 animate-pulse">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      <span className="text-xs font-bold uppercase tracking-wider">Recording</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-center py-6">
                  <div className="relative mb-8">
                    <motion.button
                      onClick={isRecording ? stopRecording : (recordedAudio ? reRecord : startRecording)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-24 h-24 rounded-full flex items-center justify-center z-10 relative"
                      style={{
                        background: isRecording 
                          ? `linear-gradient(135deg, ${themeConfig.colors.rose}, #ef4444)`
                          : recordedAudio 
                            ? `linear-gradient(135deg, #fbbf24, #f59e0b)`
                            : `linear-gradient(135deg, ${themeConfig.colors.primary}, ${themeConfig.colors.primaryGlow})`,
                        boxShadow: isRecording
                          ? `0 0 30px rgba(244, 63, 94, 0.4)`
                          : `0 0 30px ${themeConfig.colors.primaryMuted}`
                      }}
                    >
                      {isRecording ? <Square size={32} className="text-white" /> : recordedAudio ? <RotateCcw size={32} className="text-white" /> : <Mic size={32} className="text-white" />}
                    </motion.button>

                    <AnimatePresence>
                      {isRecording && (
                        <motion.div 
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 2, opacity: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                          className="absolute inset-0 rounded-full border-2 border-red-500 pointer-events-none"
                        />
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="text-center">
                    <div className="text-4xl font-mono font-bold mb-2" style={{ color: isRecording ? themeConfig.colors.rose : themeConfig.colors.text }}>
                      {formatTime(recordingTime)}
                    </div>
                    <p className="text-sm font-medium" style={{ color: themeConfig.colors.textMuted }}>
                      {isRecording ? '录制中，点击红色按钮停止' : recordedAudio ? '录制完成，点击可重新录制' : '点击图标开始录制'}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 mt-8">
                    {!isRecording && !recordedAudio && (
                      <label 
                        className="flex items-center gap-2 px-4 py-2 rounded-xl cursor-pointer hover:bg-white/5 transition-all"
                        style={{ border: `1px solid ${themeConfig.colors.border}`, color: themeConfig.colors.textSecondary }}
                      >
                        <Upload size={16} />
                        <span className="text-sm">上传已有音频</span>
                        <input type="file" accept="audio/*" onChange={handleFileUpload} className="hidden" />
                      </label>
                    )}

                    {recordedAudio && !isRecording && (
                      <div className="flex items-center gap-3">
                        <button onClick={isPlaying ? pauseRecording : playRecording} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition-all">
                          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                          <span className="text-sm font-medium">试听录音</span>
                        </button>
                        <button onClick={clearRecording} className="p-2.5 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {recordedAudio && !isRecording && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 pt-6 border-t" style={{ borderColor: themeConfig.colors.border }}>
                    <button onClick={cloneVoice} disabled={isCloning} className="w-full py-4 rounded-2xl flex items-center justify-center gap-3 font-bold text-lg shadow-xl transition-all" style={{ background: `linear-gradient(135deg, ${themeConfig.colors.primary}, ${themeConfig.colors.primaryGlow})`, color: 'white' }}>
                      {isCloning ? <RefreshCw size={24} className="animate-spin" /> : <Sparkles size={24} />}
                      {isCloning ? '正在提取声音特征...' : '开始声音克隆'}
                    </button>
                  </motion.div>
                )}
              </section>
            </>
          )}
        </div>


        {/* 右侧：测试与控制 (4/12) */}
        <div className="lg:col-span-5 space-y-6">
          {/* 4. 测试播放区域 */}
          <section 
            className="rounded-2xl p-6 h-full flex flex-col"
            style={{ 
              background: themeConfig.colors.surface,
              border: `1px solid ${themeConfig.colors.border}`,
              boxShadow: themeConfig.glassEffect.boxShadow
            }}
          >
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-indigo-500/10 text-indigo-500">
                <span className="font-bold text-sm">3</span>
              </div>
              <h3 className="font-bold text-lg" style={{ color: themeConfig.colors.text }}>模型测试</h3>
            </div>

            {clonedVoice ? (
              <div className="flex-1 flex flex-col space-y-5">
                {/* 模型信息 */}
                <div 
                  className="p-4 rounded-xl flex items-center gap-3 bg-emerald-500/5 border border-emerald-500/20"
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-emerald-500/10 text-emerald-500">
                    <Check size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold" style={{ color: themeConfig.colors.text }}>{clonedVoice.name}</p>
                    <p className="text-xs" style={{ color: themeConfig.colors.textMuted }}>创建时间: {new Date(clonedVoice.createdAt).toLocaleString()}</p>
                  </div>
                </div>

                {/* 测试输入 */}
                <div className="flex-1 flex flex-col">
                  <label className="text-xs font-bold mb-2 uppercase tracking-wider" style={{ color: themeConfig.colors.textMuted }}>测试文本</label>
                  <textarea
                    value={testText}
                    onChange={(e) => setTestText(e.target.value)}
                    placeholder="输入你想让AI分身说的话..."
                    className="w-full flex-1 p-3 md:p-4 rounded-xl resize-none focus:outline-none focus:ring-2 transition-all md:min-h-[120px] min-h-[80px]"
                    style={{
                      background: themeConfig.colors.bg,
                      border: `1px solid ${themeConfig.colors.border}`,
                      color: themeConfig.colors.text,
                      ringColor: themeConfig.colors.primary
                    }}
                  />
                </div>

                {/* 快速选择 */}
                <div className="flex flex-wrap gap-2">
                  {sampleTestTexts.map((text, i) => (
                    <button
                      key={i}
                      onClick={() => setTestText(text)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-white/5 transition-all"
                      style={{ border: `1px solid ${themeConfig.colors.border}`, color: themeConfig.colors.textSecondary }}
                    >
                      示例 {i + 1}
                    </button>
                  ))}
                </div>

                {/* 5. 音频控制 */}
                <div className="pt-4 space-y-4">
                  <div className="flex items-center gap-4 px-2">
                    <button 
                      onClick={() => setIsMuted(!isMuted)}
                      style={{ color: themeConfig.colors.textSecondary }}
                    >
                      {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
                    </button>
                    <input 
                      type="range" 
                      min="0" 
                      max="1" 
                      step="0.1" 
                      value={volume}
                      onChange={(e) => setVolume(parseFloat(e.target.value))}
                      className="flex-1 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                  </div>

                  <button
                    onClick={testClonedVoice}
                    disabled={!testText || isTesting}
                    className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-bold shadow-lg disabled:opacity-50 transition-all"
                    style={{
                      background: `linear-gradient(135deg, ${themeConfig.colors.primary}, ${themeConfig.colors.primaryGlow})`,
                      color: 'white'
                    }}
                  >
                    {isTesting ? (
                      <>
                        <RefreshCw size={20} className="animate-spin" />
                        语音合成中...
                      </>
                    ) : (
                      <>
                        <Play size={20} />
                        播放测试
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div 
                className="flex-1 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-2xl"
                style={{ borderColor: themeConfig.colors.border }}
              >
                <div 
                  className="w-20 h-20 rounded-full flex items-center justify-center mb-4 bg-white/5"
                >
                  <Sparkles size={40} className="text-gray-600" />
                </div>
                <h4 className="font-bold mb-2" style={{ color: themeConfig.colors.textMuted }}>等待声音模型</h4>
                <p className="text-xs max-w-[200px]" style={{ color: themeConfig.colors.textMuted }}>
                  请先完成左侧的录音并点击“开始克隆”生成您的专属模型
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}

