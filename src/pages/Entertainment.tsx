import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Music, Film, Bookmark as BookmarkIcon, Play, Pause, SkipBack, SkipForward, Star, Search, List, Heart, X, Edit2, Trash2, Calendar, User, Plus, ExternalLink, Link as LinkIcon, Upload } from 'lucide-react'
import PageTransition from '../components/ui/PageTransition'
import { musicPlaylist as initialMusicPlaylist, movieCollection, bookmarks } from '../data/mock'
import type { Movie, Bookmark } from '../data/mock'

interface Song {
  id: string
  title: string
  artist: string
  album: string
  duration: string
  color: string
  url?: string
}

const tabs = [
  { id: 'music', label: '音乐盒', icon: Music },
  { id: 'movies', label: '收藏电影', icon: Film },
  { id: 'bookmarks', label: '百宝箱', icon: BookmarkIcon },
] as const

type TabId = (typeof tabs)[number]['id']

export default function Entertainment() {
  const [activeTab, setActiveTab] = useState<TabId>('music')

  return (
    <PageTransition>
      <div className="mx-auto max-w-6xl px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-text mb-2">娱乐</h1>
          <p className="text-text-muted">音乐、电影和收藏的宝藏</p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-2 mb-8 overflow-x-auto no-scrollbar"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'text-primary'
                  : 'text-text-muted hover:text-text-secondary'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="entertainmentTab"
                  className="absolute inset-0 bg-primary/10 border border-primary/20 rounded-xl -z-10"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          ))}
        </motion.div>

        <AnimatePresence mode="sync">
          {activeTab === 'music' && (
            <motion.div key="music" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
              <MusicBox />
            </motion.div>
          )}
          {activeTab === 'movies' && (
            <motion.div key="movies" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
              <MovieWall />
            </motion.div>
          )}
          {activeTab === 'bookmarks' && (
            <motion.div key="bookmarks" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
              <TreasureBox />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  )
}

/* ===== Audio Visualizer Component ===== */
function AudioVisualizer({ isPlaying, color }: { isPlaying: boolean; color: string }) {
  const bars = 32
  
  return (
    <div className="flex items-end justify-center gap-[2px] sm:gap-1 h-8 sm:h-12">
      {[...Array(bars)].map((_, i) => (
        <motion.div
          key={i}
          className="w-[2px] sm:w-1 rounded-full"
          style={{ background: color }}
          animate={isPlaying ? {
            height: [4, 8 + Math.sin(i * 0.3) * 16, 6, 12 + Math.cos(i * 0.2) * 12, 4],
          } : { height: 4 }}
          transition={{
            duration: 0.6 + (i % 4) * 0.15,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

/* ===== Rotating Vinyl Record Component ===== */
function VinylRecord({ 
  isPlaying, 
  color, 
  imageUrl 
}: { 
  isPlaying: boolean
  color: string
  imageUrl?: string 
}) {
  return (
    <div className="relative">
      {/* 唱片外圈底座 - 移动端尺寸缩小 */}
      <div className="relative w-36 h-36 sm:w-52 sm:h-52 md:w-72 md:h-72">
        {/* 唱片旋转动画容器 */}
        <motion.div
          className="absolute inset-0"
          animate={{ rotate: isPlaying ? 360 : 0 }}
          transition={{ 
            duration: 3, 
            repeat: Infinity, 
            ease: 'linear',
          }}
        >
          {/* 唱片主体 - 黑胶质感 */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-800 via-gray-900 to-black shadow-2xl">
            {/* 唱片纹路 - 同心圆 */}
            {[...Array(8)].map((_, i) => (
              <div 
                key={i}
                className="absolute rounded-full border border-gray-700/30"
                style={{
                  inset: `${8 + i * 5}%`,
                }}
              />
            ))}
            
            {/* 唱片光泽效果 */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/5 to-transparent" />
            <div className="absolute inset-0 rounded-full bg-gradient-to-bl from-transparent via-black/20 to-transparent" />
            
            {/* 中心专辑封面 */}
            <div className="absolute inset-[22%] sm:inset-[20%] rounded-full overflow-hidden shadow-inner ring-4 sm:ring-8 ring-gray-800">
              {imageUrl ? (
                <img src={imageUrl} alt="album" className="w-full h-full object-cover" />
              ) : (
                <div 
                  className="w-full h-full flex items-center justify-center"
                  style={{ background: `linear-gradient(135deg, ${color}dd, ${color}66)` }}
                >
                  <Music size={32} className="text-white/80 sm:size-10" />
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* 唱片反光效果 - 不旋转 */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />
        
        {/* 播放状态指示器 - 已移除文字提示 */}
      </div>
    </div>
  )
}

/* ===== Vinyl Record Player (NetEase Style) ===== */
function MusicBox() {
  const [currentSong, setCurrentSong] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [musicPlaylist, setMusicPlaylist] = useState<Song[]>(initialMusicPlaylist)
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)
  const [importType, setImportType] = useState<'local' | 'link'>('local')
  const [linkUrl, setLinkUrl] = useState('')
  const [linkTitle, setLinkTitle] = useState('')
  const [linkArtist, setLinkArtist] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)

  const song = musicPlaylist[currentSong]

  const handlePrev = useCallback(() => {
    setCurrentSong((prev) => (prev - 1 + musicPlaylist.length) % musicPlaylist.length)
    setProgress(0)
  }, [musicPlaylist.length])

  const handleNext = useCallback(() => {
    setCurrentSong((prev) => (prev + 1) % musicPlaylist.length)
    setProgress(0)
  }, [musicPlaylist.length])

  // Simulate progress
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            handleNext()
            return 0
          }
          return prev + 0.5
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isPlaying, handleNext])

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current) return
    const rect = progressRef.current.getBoundingClientRect()
    const newProgress = ((e.clientX - rect.left) / rect.width) * 100
    setProgress(Math.max(0, Math.min(100, newProgress)))
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // 检查文件类型
    if (!file.type.startsWith('audio/') && !file.name.endsWith('.mp3')) {
      alert('请选择有效的音频文件（MP3格式）')
      return
    }

    // 创建本地URL
    const url = URL.createObjectURL(file)
    const newSong: Song = {
      id: `song-${Date.now()}`,
      title: file.name.replace(/\.[^/.]+$/, ''),
      artist: '本地音乐',
      album: '导入音乐',
      duration: '3:45',
      color: '#8b5cf6',
      url: url
    }

    setMusicPlaylist(prev => [...prev, newSong])
    setIsImportModalOpen(false)
    
    // 清空input
    e.target.value = ''
  }

  const handleImportFromLink = () => {
    if (!linkUrl.trim() || !linkTitle.trim()) {
      alert('请填写音乐链接和标题')
      return
    }

    const newSong: Song = {
      id: `song-${Date.now()}`,
      title: linkTitle,
      artist: linkArtist || '未知艺术家',
      album: '网络音乐',
      duration: '3:30',
      color: '#3b82f6',
      url: linkUrl
    }

    setMusicPlaylist(prev => [...prev, newSong])
    setIsImportModalOpen(false)
    setLinkUrl('')
    setLinkTitle('')
    setLinkArtist('')
  }

  const currentSeconds = (progress / 100) * 240
  const totalSeconds = 240

  return (
    <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
      {/* Main Player - Redesigned Vinyl Style */}
      <div className="glass-card p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-10">
          
          {/* Vinyl Record Component */}
          <div className="flex-shrink-0">
            <VinylRecord isPlaying={isPlaying} color={song.color} />
          </div>

          {/* Controls & Info */}
          <div className="flex-1 w-full min-w-0">
            {/* Song Info */}
            <motion.div 
              key={song.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center lg:text-left mb-4 sm:mb-6"
            >
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-text mb-1 sm:mb-2 truncate">{song.title}</h2>
              <p className="text-text-secondary text-base sm:text-lg">{song.artist}</p>
              <p className="text-xs sm:text-sm text-text-muted mt-0.5 sm:mt-1">{song.album}</p>
            </motion.div>

            {/* Audio Visualizer */}
            <div className="mb-4 sm:mb-6">
              <AudioVisualizer isPlaying={isPlaying} color={song.color} />
            </div>

            {/* Progress Bar */}
            <div className="mb-4 sm:mb-6">
              <div 
                ref={progressRef}
                className="relative w-full h-1.5 bg-surface rounded-full cursor-pointer group"
                onClick={handleProgressClick}
              >
                <motion.div
                  className="absolute left-0 top-0 h-full rounded-full"
                  style={{ background: song.color, width: `${progress}%` }}
                  layoutId="progress"
                />
                <motion.div
                  className="absolute top-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ left: `${progress}%`, transform: 'translate(-50%, -50%)' }}
                />
              </div>
              <div className="flex justify-between text-xs sm:text-sm text-text-muted mt-2">
                <span>{formatTime(currentSeconds)}</span>
                <span>{formatTime(totalSeconds)}</span>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-center gap-3 sm:gap-6">
              {/* Like button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsLiked(!isLiked)}
                className="p-2 rounded-full text-text-muted hover:text-rose transition-colors"
              >
                <Heart size={20} className={isLiked ? 'fill-rose text-rose' : ''} />
              </motion.button>

              {/* Previous */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePrev}
                className="p-2.5 sm:p-3 rounded-full text-text-secondary hover:text-text transition-all"
              >
                <SkipBack size={22} fill="currentColor" />
              </motion.button>
              
              {/* Play/Pause - Main button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-4 sm:p-5 rounded-full text-bg shadow-xl"
                style={{ background: song.color }}
              >
                {isPlaying ? (
                  <Pause size={24} fill="currentColor" />
                ) : (
                  <Play size={28} fill="currentColor" className="ml-1" />
                )}
              </motion.button>
              
              {/* Next */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNext}
                className="p-3 rounded-full text-text-secondary hover:text-text transition-all"
              >
                <SkipForward size={24} fill="currentColor" />
              </motion.button>

              {/* Playlist indicator */}
              <div className="p-2 rounded-full text-text-muted">
                <List size={22} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Playlist Panel */}
      <div className="glass-card overflow-hidden">
        <div className="p-3 sm:p-4 border-b border-border flex items-center justify-between">
          <h3 className="text-xs sm:text-sm font-semibold text-text-secondary">
            播放列表 · {musicPlaylist.length} 首
          </h3>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsImportModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors"
          >
            <Plus size={14} />
            <span>导入音乐</span>
          </motion.button>
        </div>
        <div className="divide-y divide-border max-h-[300px] sm:max-h-96 overflow-y-auto">
          {musicPlaylist.map((s, i) => (
            <motion.button
              key={s.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              onClick={() => { setCurrentSong(i); setIsPlaying(true) }}
              className={`w-full flex items-center gap-2 sm:gap-4 px-3 sm:px-4 py-2.5 sm:py-3 text-left transition-all hover:bg-surface/60 ${
                i === currentSong ? 'bg-primary/5' : ''
              }`}
            >
              <span className={`w-6 sm:w-8 text-center text-xs ${i === currentSong ? 'text-primary' : 'text-text-muted'}`}>
                {i === currentSong && isPlaying ? (
                  <div className="flex items-end justify-center gap-[1px] sm:gap-0.5 h-3 sm:h-4">
                    {[1, 2, 3].map((bar) => (
                      <motion.div
                        key={bar}
                        className="w-[2px] sm:w-0.5 rounded-full bg-primary"
                        animate={{ height: ['3px', '10px', '5px', '8px', '3px'] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: bar * 0.1 }}
                      />
                    ))}
                  </div>
                ) : (
                  i + 1
                )}
              </span>
              <div
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: `linear-gradient(135deg, ${s.color}44, ${s.color}11)` }}
              >
                <Music size={14} className="sm:size-4" style={{ color: s.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-xs sm:text-sm truncate ${i === currentSong ? 'text-primary font-medium' : 'text-text'}`}>
                  {s.title}
                </p>
                <p className="text-[10px] sm:text-xs text-text-muted truncate">{s.artist}</p>
              </div>
              <span className="text-[10px] sm:text-xs text-text-muted hidden sm:block">{s.duration}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Import Music Modal */}
      <AnimatePresence>
        {isImportModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setIsImportModalOpen(false)}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md glass-card"
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border/50">
                <h3 className="text-lg font-semibold text-text">导入音乐</h3>
                <button
                  onClick={() => setIsImportModalOpen(false)}
                  className="p-1.5 rounded-lg text-text-muted hover:text-text hover:bg-surface transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex p-4 pb-0 gap-2">
                <button
                  onClick={() => setImportType('local')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    importType === 'local' 
                      ? 'bg-primary text-white' 
                      : 'bg-surface text-text-secondary hover:text-text'
                  }`}
                >
                  <Upload size={16} />
                  本地上传
                </button>
                <button
                  onClick={() => setImportType('link')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    importType === 'link' 
                      ? 'bg-primary text-white' 
                      : 'bg-surface text-text-secondary hover:text-text'
                  }`}
                >
                  <LinkIcon size={16} />
                  链接导入
                </button>
              </div>

              {/* Content */}
              <div className="p-4">
                {importType === 'local' ? (
                  <div className="space-y-4">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="audio/mp3,audio/*"
                      className="hidden"
                      onChange={handleFileSelect}
                    />
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
                    >
                      <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-3">
                        <Upload size={24} className="text-primary" />
                      </div>
                      <p className="text-sm font-medium text-text mb-1">点击上传 MP3 文件</p>
                      <p className="text-xs text-text-muted">支持 MP3 格式的音频文件</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-text-muted mb-1.5">音乐链接</label>
                      <input
                        type="url"
                        value={linkUrl}
                        onChange={e => setLinkUrl(e.target.value)}
                        placeholder="https://music.163.com/... 或 https://y.qq.com/..."
                        className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-text text-sm placeholder:text-text-muted focus:outline-none focus:border-primary/50"
                      />
                      <p className="text-xs text-text-muted mt-1">支持网易云音乐、QQ音乐等平台链接</p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-text-muted mb-1.5">歌曲名称</label>
                      <input
                        type="text"
                        value={linkTitle}
                        onChange={e => setLinkTitle(e.target.value)}
                        placeholder="输入歌曲名称"
                        className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-text text-sm placeholder:text-text-muted focus:outline-none focus:border-primary/50"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-text-muted mb-1.5">艺术家</label>
                      <input
                        type="text"
                        value={linkArtist}
                        onChange={e => setLinkArtist(e.target.value)}
                        placeholder="输入艺术家名称（选填）"
                        className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-text text-sm placeholder:text-text-muted focus:outline-none focus:border-primary/50"
                      />
                    </div>
                    <button
                      onClick={handleImportFromLink}
                      disabled={!linkUrl.trim() || !linkTitle.trim()}
                      className="w-full py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      添加音乐
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ===== Movie Wall ===== */
function MovieWall() {
  const [movies, setMovies] = useState<Movie[]>(movieCollection)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [newMovieId, setNewMovieId] = useState<string>('')
  
  // Edit form states
  const [editForm, setEditForm] = useState<Partial<Movie>>({})
  
  // Filter movies based on search query
  const filteredMovies = movies.filter(movie => {
    if (!searchQuery.trim()) return true
    const query = searchQuery.toLowerCase()
    return (
      movie.title.toLowerCase().includes(query) ||
      movie.comment.toLowerCase().includes(query) ||
      movie.genre.toLowerCase().includes(query) ||
      movie.director.toLowerCase().includes(query) ||
      movie.description.toLowerCase().includes(query)
    )
  })

  const handleCardClick = (movie: Movie) => {
    setSelectedMovie(movie)
    setEditForm({ ...movie })
    setIsEditing(false)
    setIsAdding(false)
  }

  const handleAddNew = () => {
    const id = `movie-${Date.now()}`
    setNewMovieId(id)
    setIsAdding(true)
    setIsEditing(false)
    setSelectedMovie(null)
    setEditForm({
      id,
      title: '',
      year: new Date().getFullYear(),
      rating: 8.0,
      genre: '',
      comment: '',
      poster: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&q=80',
      description: '',
      director: ''
    })
  }

  const handleSave = () => {
    if (!editForm.title?.trim()) return
    
    if (isAdding) {
      // Add new movie
      const newMovie: Movie = {
        id: newMovieId || editForm.id || `movie-${crypto.randomUUID()}`,
        title: editForm.title.trim(),
        year: editForm.year || new Date().getFullYear(),
        rating: editForm.rating || 8.0,
        genre: editForm.genre || '其他',
        comment: editForm.comment || '',
        poster: editForm.poster || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&q=80',
        description: editForm.description || '',
        director: editForm.director || ''
      }
      setMovies(prev => [newMovie, ...prev])
    } else if (selectedMovie) {
      // Update existing movie
      setMovies(prev => prev.map(movie => 
        movie.id === selectedMovie.id 
          ? { 
              ...movie, 
              title: editForm.title?.trim() || movie.title,
              comment: editForm.comment?.trim() || '',
              poster: editForm.poster || movie.poster,
              year: editForm.year || movie.year,
              rating: editForm.rating || movie.rating,
              genre: editForm.genre || movie.genre,
              description: editForm.description || movie.description,
              director: editForm.director || movie.director
            }
          : movie
      ))
    }
    
    closeModal()
  }

  const handleDelete = () => {
    if (!selectedMovie) return
    
    if (confirm('确定要删除这部电影吗？')) {
      setMovies(prev => prev.filter(movie => movie.id !== selectedMovie.id))
      closeModal()
    }
  }

  const closeModal = () => {
    setSelectedMovie(null)
    setIsEditing(false)
    setIsAdding(false)
    setEditForm({})
  }

  return (
    <div>
      {/* Search and Add Bar */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="搜索电影（标题、导演、类型、描述...）"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-surface border border-border text-text placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-all"
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAddNew}
          className="px-5 py-3 rounded-xl bg-primary text-white font-medium flex items-center gap-2 hover:bg-primary-dim transition-colors whitespace-nowrap"
        >
          <Plus size={18} />
          <span className="hidden sm:inline">添加电影</span>
        </motion.button>
      </div>

      {/* Movies Grid */}
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {filteredMovies.map((movie, index) => (
            <motion.div
              key={movie.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.04 }}
              className="group cursor-pointer"
              onClick={() => handleCardClick(movie)}
            >
              <div className="glass-card overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
                {/* Poster */}
                <div className="relative h-52 sm:h-64 overflow-hidden">
                  <img 
                    src={movie.poster} 
                    alt={movie.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-60" />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  {/* Rating badge */}
                  <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-bg/80 backdrop-blur-sm text-xs font-semibold">
                    <Star size={10} className="text-accent fill-accent" />
                    <span className="text-accent">{movie.rating}</span>
                  </div>
                </div>
                {/* Info */}
                <div className="p-3">
                  <h3 className="font-semibold text-sm text-text mb-0.5 truncate group-hover:text-primary transition-colors">{movie.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-text-muted mb-2">
                    <span>{movie.year}</span>
                    <span>·</span>
                    <span>{movie.genre}</span>
                  </div>
                  <p className="text-xs text-text-dim line-clamp-2">{movie.comment}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredMovies.length === 0 && (
        <div className="text-center py-16">
          <Film size={48} className="mx-auto text-text-muted/30 mb-4" />
          <p className="text-text-muted">没有找到匹配的电影</p>
        </div>
      )}

      {/* Movie Detail/Edit Modal */}
      <AnimatePresence>
        {(selectedMovie || isAdding) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="glass-card w-full max-w-lg overflow-hidden max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image */}
              <div className="relative aspect-video">
                <img
                  src={editForm.poster || selectedMovie?.poster}
                  alt={editForm.title || selectedMovie?.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                
                {/* Close button */}
                <button 
                  onClick={closeModal}
                  className="absolute top-3 right-3 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
                >
                  <X size={18} />
                </button>

                {/* Rating badge (view mode only) */}
                {!isEditing && !isAdding && selectedMovie && (
                  <div className="absolute bottom-3 left-3 flex items-center gap-1 px-3 py-1.5 rounded-full bg-accent/90 text-white text-sm font-bold">
                    <Star size={14} className="fill-white" />
                    {selectedMovie.rating}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5">
                {isEditing || isAdding ? (
                  /* Edit/Add Form */
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-text mb-4">
                      {isAdding ? '添加新电影' : '编辑电影'}
                    </h3>
                    
                    <div>
                      <label className="block text-xs text-text-muted mb-1.5">标题 *</label>
                      <input
                        type="text"
                        value={editForm.title || ''}
                        onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="电影标题"
                        className="w-full px-3 py-2.5 rounded-lg bg-surface border border-border text-sm focus:outline-none focus:border-primary/50 transition-all"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-text-muted mb-1.5">年份</label>
                        <input
                          type="number"
                          value={editForm.year || ''}
                          onChange={(e) => setEditForm(prev => ({ ...prev, year: parseInt(e.target.value) || new Date().getFullYear() }))}
                          className="w-full px-3 py-2.5 rounded-lg bg-surface border border-border text-sm focus:outline-none focus:border-primary/50 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-text-muted mb-1.5">评分</label>
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="10"
                          value={editForm.rating || ''}
                          onChange={(e) => setEditForm(prev => ({ ...prev, rating: parseFloat(e.target.value) || 0 }))}
                          className="w-full px-3 py-2.5 rounded-lg bg-surface border border-border text-sm focus:outline-none focus:border-primary/50 transition-all"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-text-muted mb-1.5">类型</label>
                        <input
                          type="text"
                          value={editForm.genre || ''}
                          onChange={(e) => setEditForm(prev => ({ ...prev, genre: e.target.value }))}
                          placeholder="如：科幻、剧情"
                          className="w-full px-3 py-2.5 rounded-lg bg-surface border border-border text-sm focus:outline-none focus:border-primary/50 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-text-muted mb-1.5">导演</label>
                        <input
                          type="text"
                          value={editForm.director || ''}
                          onChange={(e) => setEditForm(prev => ({ ...prev, director: e.target.value }))}
                          placeholder="导演姓名"
                          className="w-full px-3 py-2.5 rounded-lg bg-surface border border-border text-sm focus:outline-none focus:border-primary/50 transition-all"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs text-text-muted mb-1.5">海报URL</label>
                      <input
                        type="text"
                        value={editForm.poster || ''}
                        onChange={(e) => setEditForm(prev => ({ ...prev, poster: e.target.value }))}
                        placeholder="https://..."
                        className="w-full px-3 py-2.5 rounded-lg bg-surface border border-border text-sm focus:outline-none focus:border-primary/50 transition-all"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs text-text-muted mb-1.5">简介</label>
                      <textarea
                        value={editForm.description || ''}
                        onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="电影简介..."
                        className="w-full px-3 py-2.5 rounded-lg bg-surface border border-border text-sm resize-none focus:outline-none focus:border-primary/50 transition-all"
                        rows={3}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs text-text-muted mb-1.5">短评</label>
                      <textarea
                        value={editForm.comment || ''}
                        onChange={(e) => setEditForm(prev => ({ ...prev, comment: e.target.value }))}
                        placeholder="你的观影感受..."
                        className="w-full px-3 py-2.5 rounded-lg bg-surface border border-border text-sm resize-none focus:outline-none focus:border-primary/50 transition-all"
                        rows={2}
                      />
                    </div>
                    
                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={handleSave}
                        disabled={!editForm.title?.trim()}
                        className="flex-1 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dim transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isAdding ? '添加' : '保存'}
                      </button>
                      <button
                        onClick={() => isAdding ? closeModal() : setIsEditing(false)}
                        className="flex-1 py-2.5 rounded-lg bg-surface text-text text-sm font-medium hover:bg-surface/80 transition-colors border border-border"
                      >
                        取消
                      </button>
                    </div>
                  </div>
                ) : (
                  /* View Mode */
                  <>
                    <div className="flex items-center gap-3 text-xs text-text-muted mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {selectedMovie?.year}
                      </span>
                      <span>·</span>
                      <span>{selectedMovie?.genre}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <User size={12} />
                        {selectedMovie?.director}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-text mb-3">{selectedMovie?.title}</h3>
                    <p className="text-sm text-text-secondary leading-relaxed mb-2">
                      {selectedMovie?.description}
                    </p>
                    <p className="text-sm text-text-muted italic mb-6">
                      "{selectedMovie?.comment}"
                    </p>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex-1 py-2.5 rounded-lg bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors flex items-center justify-center gap-2"
                      >
                        <Edit2 size={14} />
                        编辑
                      </button>
                      <button
                        onClick={handleDelete}
                        className="flex-1 py-2.5 rounded-lg bg-rose/10 text-rose text-sm font-medium hover:bg-rose/20 transition-colors flex items-center justify-center gap-2"
                      >
                        <Trash2 size={14} />
                        删除
                      </button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ===== Treasure Box (百宝箱) ===== */
function TreasureBox() {
  const [bookmarkList, setBookmarkList] = useState<Bookmark[]>(bookmarks)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedBookmark, setSelectedBookmark] = useState<Bookmark | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [editForm, setEditForm] = useState<Partial<Bookmark>>({})

  const categories = [...new Set(bookmarkList.map((b) => b.category))]

  const filtered = bookmarkList.filter((b) => {
    const matchesSearch = !searchQuery ||
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.url.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !selectedCategory || b.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleCardClick = (bookmark: Bookmark) => {
    setSelectedBookmark(bookmark)
    setEditForm({ ...bookmark })
    setIsEditing(false)
    setIsAdding(false)
  }

  const handleAddNew = () => {
    setIsAdding(true)
    setIsEditing(false)
    setSelectedBookmark(null)
    setEditForm({
      id: `bm-${crypto.randomUUID()}`,
      title: '',
      url: '',
      description: '',
      category: '',
      icon: '🔖'
    })
  }

  const handleSave = () => {
    if (!editForm.title?.trim() || !editForm.url?.trim()) return
    
    if (isAdding) {
      const newBookmark: Bookmark = {
        id: editForm.id || `bm-${crypto.randomUUID()}`,
        title: editForm.title.trim(),
        url: editForm.url.trim(),
        description: editForm.description || '',
        category: editForm.category || '未分类',
        icon: editForm.icon || '🔖'
      }
      setBookmarkList(prev => [newBookmark, ...prev])
    } else if (selectedBookmark) {
      setBookmarkList(prev => prev.map(b => 
        b.id === selectedBookmark.id 
          ? { 
              ...b, 
              title: editForm.title?.trim() || b.title,
              url: editForm.url?.trim() || b.url,
              description: editForm.description || b.description,
              category: editForm.category || b.category,
              icon: editForm.icon || b.icon
            }
          : b
      ))
    }
    closeModal()
  }

  const handleDelete = () => {
    if (!selectedBookmark) return
    
    if (confirm('确定要删除这个收藏吗？')) {
      setBookmarkList(prev => prev.filter(b => b.id !== selectedBookmark.id))
      closeModal()
    }
  }

  const closeModal = () => {
    setSelectedBookmark(null)
    setIsEditing(false)
    setIsAdding(false)
    setEditForm({})
  }

  const handleOpenUrl = (url: string) => {
    if (url && url !== '#') {
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <div>
      {/* Search and Add Bar */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="搜索收藏（标题、描述、URL...）"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-surface border border-border text-text placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-all"
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAddNew}
          className="px-5 py-3 rounded-xl bg-primary text-white font-medium flex items-center gap-2 hover:bg-primary-dim transition-colors whitespace-nowrap"
        >
          <Plus size={18} />
          <span className="hidden sm:inline">添加收藏</span>
        </motion.button>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            !selectedCategory
              ? 'bg-primary/10 text-primary border border-primary/20'
              : 'text-text-muted hover:text-text-secondary bg-surface border border-border'
          }`}
        >
          全部
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              selectedCategory === cat
                ? 'bg-primary/10 text-primary border border-primary/20'
                : 'text-text-muted hover:text-text-secondary bg-surface border border-border'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Bookmarks grid - 移动端2列布局 */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((bookmark, index) => (
            <motion.div
              key={bookmark.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.04 }}
              onClick={() => handleCardClick(bookmark)}
              className="glass-card p-3 sm:p-4 group cursor-pointer hover:border-primary/30 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3">
                <span className="text-xl sm:text-2xl">{bookmark.icon}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-xs sm:text-sm text-text group-hover:text-primary transition-colors mb-0.5 line-clamp-1">
                    {bookmark.title}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-text-muted line-clamp-1 sm:line-clamp-2">{bookmark.description}</p>
                  <span className="inline-block mt-1.5 sm:mt-2 text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full bg-surface border border-border text-text-dim">
                    {bookmark.category}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <BookmarkIcon size={48} className="mx-auto text-text-muted/30 mb-4" />
          <p className="text-text-muted">没有找到匹配的收藏</p>
        </div>
      )}

      {/* Bookmark Detail/Edit Modal */}
      <AnimatePresence>
        {(selectedBookmark || isAdding) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="glass-card w-full max-w-md overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-5 border-b border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{isEditing || isAdding ? (editForm.icon || '🔖') : selectedBookmark?.icon}</span>
                    <div>
                      <h3 className="text-lg font-bold text-text">
                        {isEditing ? '编辑收藏' : isAdding ? '添加收藏' : selectedBookmark?.title}
                      </h3>
                      {!isEditing && !isAdding && selectedBookmark && (
                        <span className="text-xs text-text-muted">{selectedBookmark.category}</span>
                      )}
                    </div>
                  </div>
                  <button 
                    onClick={closeModal}
                    className="p-2 rounded-full hover:bg-surface transition-colors"
                  >
                    <X size={18} className="text-text-muted" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                {isEditing || isAdding ? (
                  /* Edit/Add Form */
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs text-text-muted mb-1.5">标题 *</label>
                      <input
                        type="text"
                        value={editForm.title || ''}
                        onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="收藏名称"
                        className="w-full px-3 py-2.5 rounded-lg bg-surface border border-border text-sm focus:outline-none focus:border-primary/50 transition-all"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs text-text-muted mb-1.5">URL *</label>
                      <input
                        type="text"
                        value={editForm.url || ''}
                        onChange={(e) => setEditForm(prev => ({ ...prev, url: e.target.value }))}
                        placeholder="https://..."
                        className="w-full px-3 py-2.5 rounded-lg bg-surface border border-border text-sm focus:outline-none focus:border-primary/50 transition-all"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-text-muted mb-1.5">分类</label>
                        <input
                          type="text"
                          value={editForm.category || ''}
                          onChange={(e) => setEditForm(prev => ({ ...prev, category: e.target.value }))}
                          placeholder="如：开发工具"
                          className="w-full px-3 py-2.5 rounded-lg bg-surface border border-border text-sm focus:outline-none focus:border-primary/50 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-text-muted mb-1.5">图标</label>
                        <input
                          type="text"
                          value={editForm.icon || ''}
                          onChange={(e) => setEditForm(prev => ({ ...prev, icon: e.target.value }))}
                          placeholder="如：🔖"
                          className="w-full px-3 py-2.5 rounded-lg bg-surface border border-border text-sm focus:outline-none focus:border-primary/50 transition-all text-center"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs text-text-muted mb-1.5">描述</label>
                      <textarea
                        value={editForm.description || ''}
                        onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="收藏的简要描述..."
                        className="w-full px-3 py-2.5 rounded-lg bg-surface border border-border text-sm resize-none focus:outline-none focus:border-primary/50 transition-all"
                        rows={3}
                      />
                    </div>
                    
                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={handleSave}
                        disabled={!editForm.title?.trim() || !editForm.url?.trim()}
                        className="flex-1 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dim transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isAdding ? '添加' : '保存'}
                      </button>
                      <button
                        onClick={() => isAdding ? closeModal() : setIsEditing(false)}
                        className="flex-1 py-2.5 rounded-lg bg-surface text-text text-sm font-medium hover:bg-surface/80 transition-colors border border-border"
                      >
                        取消
                      </button>
                    </div>
                  </div>
                ) : (
                  /* View Mode */
                  <>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs text-text-muted mb-1">链接</label>
                        <div className="flex items-center gap-2 p-3 rounded-lg bg-surface border border-border">
                          <LinkIcon size={14} className="text-text-muted" />
                          <span className="text-sm text-primary truncate flex-1">{selectedBookmark?.url}</span>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-xs text-text-muted mb-1">描述</label>
                        <p className="text-sm text-text-secondary leading-relaxed">
                          {selectedBookmark?.description || '暂无描述'}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 mt-6">
                      <button
                        onClick={() => selectedBookmark && handleOpenUrl(selectedBookmark.url)}
                        disabled={!selectedBookmark?.url || selectedBookmark?.url === '#'}
                        className="flex-1 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dim transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ExternalLink size={14} />
                        访问链接
                      </button>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex-1 py-2.5 rounded-lg bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors flex items-center justify-center gap-2"
                      >
                        <Edit2 size={14} />
                        编辑
                      </button>
                      <button
                        onClick={handleDelete}
                        className="flex-1 py-2.5 rounded-lg bg-rose/10 text-rose text-sm font-medium hover:bg-rose/20 transition-colors flex items-center justify-center gap-2"
                      >
                        <Trash2 size={14} />
                        删除
                      </button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
