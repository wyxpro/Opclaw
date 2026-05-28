import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, 
  ChevronDown, Music, RotateCw, ListMusic, X
} from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'
import { useSettings } from '../../hooks/useSettings'

interface Track {
  title: string
  artist: string
  url: string
  cover: string
}

const playlist: Track[] = [
  {
    title: '晴天',
    artist: '周杰伦',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=150&auto=format&fit=crop&q=60',
  },
  {
    title: '起风了',
    artist: '买辣椒也用券',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    cover: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=150&auto=format&fit=crop&q=60',
  },
  {
    title: '小情歌',
    artist: '苏打绿',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=150&auto=format&fit=crop&q=60',
  },
  {
    title: '告白气球',
    artist: '周杰伦',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150&auto=format&fit=crop&q=60',
  },
]

export default function MusicPlayer() {
  const { themeConfig } = useTheme()
  const { musicPlayerEnabled, setMusicPlayerEnabled } = useSettings()
  const audioRef = useRef<HTMLAudioElement | null>(null)
  
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.5)
  const [isMuted, setIsMuted] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [showVolumeSlider, setShowVolumeSlider] = useState(false)
  const [showPlaylist, setShowPlaylist] = useState(false)
  const [isCollapsedHovered, setIsCollapsedHovered] = useState(false)

  const currentTrack = playlist[currentTrackIndex]

  // 初始化 Audio 实例
  useEffect(() => {
    if (!musicPlayerEnabled) {
      if (audioRef.current) {
        audioRef.current.pause()
        setIsPlaying(false)
      }
      return
    }

    const audio = new Audio(currentTrack.url)
    audio.volume = volume
    audioRef.current = audio

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime)
    const handleDurationChange = () => setDuration(audio.duration || 0)
    const handleEnded = () => handleNext()

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('durationchange', handleDurationChange)
    audio.addEventListener('ended', handleEnded)

    if (isPlaying) {
      audio.play().catch(err => console.log('Audio autoplay prevented:', err))
    }

    return () => {
      audio.pause()
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('durationchange', handleDurationChange)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [currentTrackIndex, musicPlayerEnabled])

  // 控制播放/暂停
  const togglePlay = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play().catch(err => console.log('Playback error:', err))
      setIsPlaying(true)
    }
  }

  // 下一首
  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % playlist.length)
  }

  // 上一首
  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + playlist.length) % playlist.length)
  }

  // 调节进度条
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return
    const seekTime = parseFloat(e.target.value)
    audioRef.current.currentTime = seekTime
    setCurrentTime(seekTime)
  }

  // 静音控制
  const toggleMute = () => {
    if (!audioRef.current) return
    const nextMuted = !isMuted
    audioRef.current.muted = nextMuted
    setIsMuted(nextMuted)
  }

  // 调节音量
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextVolume = parseFloat(e.target.value)
    setVolume(nextVolume)
    if (audioRef.current) {
      audioRef.current.volume = nextVolume
      audioRef.current.muted = nextVolume === 0
      setIsMuted(nextVolume === 0)
    }
  }

  // 格式化时间
  const formatTime = (time: number) => {
    if (isNaN(time)) return '00:00'
    const mins = Math.floor(time / 60).toString().padStart(2, '0')
    const secs = Math.floor(time % 60).toString().padStart(2, '0')
    return `${mins}:${secs}`
  }

  if (!musicPlayerEnabled) return null

  return (
    <motion.div 
      drag
      dragMomentum={false}
      dragElastic={0.05}
      className="fixed bottom-[88px] md:bottom-6 left-6 z-[45] flex items-end cursor-grab active:cursor-grabbing"
    >
      <AnimatePresence>
        {!isExpanded ? (
          /* 收起状态 - 旋转黑胶唱片悬浮球 */
          <motion.button
            key="collapsed"
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            whileHover={{ scale: 1.05 }}
            onMouseEnter={() => setIsCollapsedHovered(true)}
            onMouseLeave={() => setIsCollapsedHovered(false)}
            onClick={() => setIsExpanded(true)}
            className="relative w-14 h-14 rounded-full flex items-center justify-center shadow-lg cursor-pointer overflow-hidden border group select-none"
            style={{
              borderColor: themeConfig.colors.border,
              boxShadow: themeConfig.shadows.float,
            }}
          >
            {/* 旋转封面 */}
            <div 
              className={`absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-1000 ${isPlaying ? 'animate-spin-slow' : ''}`}
              style={{ 
                backgroundImage: `url(${currentTrack.cover})`,
                animationPlayState: isPlaying ? 'running' : 'paused'
              }}
            />
            {/* 唱片黑胶内圈装饰纹理 */}
            <div className="absolute inset-0 bg-black/15 group-hover:bg-black/30 transition-colors" />
            <div className="absolute w-3.5 h-3.5 rounded-full bg-bg border border-border flex items-center justify-center z-10">
              <Music size={8} className="text-primary animate-pulse" />
            </div>
            
            {/* 正在播放的微光波动环 */}
            {isPlaying && (
              <span className="absolute inset-0 rounded-full border border-primary/40 animate-ping opacity-60 pointer-events-none" />
            )}

            {/* 悬浮关闭小按钮 */}
            {isCollapsedHovered && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={(e) => {
                  e.stopPropagation()
                  setMusicPlayerEnabled(false)
                }}
                className="absolute top-1 right-1 w-4 h-4 rounded-full bg-black/75 hover:bg-rose-600 text-white flex items-center justify-center z-20 transition-colors"
              >
                <X size={10} />
              </motion.button>
            )}
          </motion.button>
        ) : (
          /* 展开状态 - 玻璃感控制面板 */
          <motion.div
            key="expanded"
            initial={{ width: 60, height: 60, opacity: 0, y: 20 }}
            animate={{ width: 320, height: 'auto', opacity: 1, y: 0 }}
            exit={{ width: 60, height: 60, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="rounded-2xl shadow-xl overflow-hidden p-4 select-none border"
            style={{
              background: themeConfig.glassEffect.background,
              border: themeConfig.glassEffect.border,
              backdropFilter: themeConfig.glassEffect.backdropBlur,
              WebkitBackdropFilter: themeConfig.glassEffect.backdropBlur,
              boxShadow: themeConfig.shadows.float,
              color: themeConfig.colors.text,
            }}
          >
            {/* 顶部标题与最小化/关闭 */}
            <div className="flex items-center justify-between mb-3.5 drag-handle">
              <span className="text-[11px] font-semibold tracking-widest text-text-muted flex items-center gap-1">
                <Music size={11} className="text-primary animate-pulse" />
                正在播放
              </span>
              <div className="flex items-center gap-1">
                {/* 最小化 */}
                <button 
                  onClick={() => {
                    setIsExpanded(false)
                    setShowPlaylist(false)
                  }}
                  className="p-1 rounded-lg hover:bg-surface/50 text-text-muted hover:text-text transition-colors"
                  title="最小化"
                >
                  <ChevronDown size={16} />
                </button>
                {/* 关闭 */}
                <button 
                  onClick={() => setMusicPlayerEnabled(false)}
                  className="p-1 rounded-lg hover:bg-rose-500/10 text-text-muted hover:text-rose-500 transition-colors"
                  title="关闭播放器"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* 音乐信息行 */}
            <div className="flex gap-3.5 items-center mb-3">
              {/* 封面 */}
              <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-border/50 shadow-inner">
                <img 
                  src={currentTrack.cover} 
                  alt={currentTrack.title} 
                  className={`w-full h-full object-cover transition-transform duration-1000 ${isPlaying ? 'animate-spin-slow' : ''}`}
                  style={{ animationPlayState: isPlaying ? 'running' : 'paused' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
              </div>

              {/* 歌名/歌手 */}
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm truncate text-text">{currentTrack.title}</h4>
                <p className="text-xs text-text-muted mt-0.5 truncate">{currentTrack.artist}</p>
              </div>
            </div>

            {/* 进度条 */}
            <div className="mb-4">
              <input 
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1 bg-border/60 hover:bg-border rounded-lg appearance-none cursor-pointer accent-primary transition-all [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-md"
              />
              <div className="flex justify-between text-[10px] text-text-muted mt-1.5 font-medium">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* 控制器 */}
            <div className="flex items-center justify-between">
              {/* 音量控制 */}
              <div className="relative flex items-center">
                <button
                  onMouseEnter={() => setShowVolumeSlider(true)}
                  onClick={toggleMute}
                  className="p-2 rounded-xl text-text-muted hover:text-text hover:bg-surface/50 transition-colors"
                >
                  {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>

                <AnimatePresence>
                  {showVolumeSlider && (
                    <motion.div
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: 70, opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      onMouseLeave={() => setShowVolumeSlider(false)}
                      className="flex items-center overflow-hidden h-8"
                    >
                      <input 
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={isMuted ? 0 : volume}
                        onChange={handleVolumeChange}
                        className="w-16 h-1 bg-border/60 rounded-lg appearance-none cursor-pointer accent-primary ml-1.5 [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-primary"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 核心控制键 */}
              <div className="flex items-center gap-1.5">
                <button 
                  onClick={handlePrev}
                  className="p-2.5 rounded-xl text-text-muted hover:text-text hover:bg-surface/50 active:scale-95 transition-all"
                >
                  <SkipBack size={16} />
                </button>
                <button 
                  onClick={togglePlay}
                  className="p-3 rounded-full text-white active:scale-95 transition-all shadow-md"
                  style={{ background: themeConfig.colors.primary }}
                >
                  {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="translate-x-0.5" />}
                </button>
                <button 
                  onClick={handleNext}
                  className="p-2.5 rounded-xl text-text-muted hover:text-text hover:bg-surface/50 active:scale-95 transition-all"
                >
                  <SkipForward size={16} />
                </button>
              </div>

              {/* 歌单列表 */}
              <div className="relative">
                <button 
                  onClick={() => setShowPlaylist(!showPlaylist)}
                  className={`p-2 rounded-xl transition-colors ${showPlaylist ? 'text-primary bg-primary/10' : 'text-text-muted hover:text-text hover:bg-surface/50'}`}
                >
                  <ListMusic size={16} />
                </button>

                <AnimatePresence>
                  {showPlaylist && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute bottom-full right-0 mb-2 w-48 rounded-xl border p-2 shadow-lg flex flex-col gap-0.5 overflow-hidden max-h-48 overflow-y-auto z-[60]"
                      style={{
                        background: themeConfig.colors.surface,
                        borderColor: themeConfig.colors.border,
                        boxShadow: themeConfig.shadows.float,
                      }}
                    >
                      {playlist.map((track, index) => (
                        <button
                          key={track.url}
                          onClick={() => {
                            setCurrentTrackIndex(index)
                            setIsPlaying(true)
                          }}
                          className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold truncate flex items-center justify-between transition-colors ${
                            index === currentTrackIndex 
                              ? 'text-primary bg-primary/10' 
                              : 'text-text-secondary hover:bg-surface/80 hover:text-text'
                          }`}
                        >
                          <span className="truncate flex-1">{track.title}</span>
                          <span className="text-[10px] text-text-muted shrink-0 ml-2">{track.artist}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
