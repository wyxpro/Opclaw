import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Music, Film, Bookmark, Play, Pause, SkipBack, SkipForward, Star, Search, List, Heart, X, Edit2, Trash2, Calendar, User } from 'lucide-react'
import PageTransition from '../components/ui/PageTransition'
import { musicPlaylist, movieCollection, bookmarks } from '../data/mock'
import type { Movie } from '../data/mock'

const tabs = [
  { id: 'music', label: '音乐盒', icon: Music },
  { id: 'movies', label: '收藏电影', icon: Film },
  { id: 'bookmarks', label: '百宝箱', icon: Bookmark },
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

        <AnimatePresence mode="wait">
          {activeTab === 'music' && (
            <motion.div key="music" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <MusicBox />
            </motion.div>
          )}
          {activeTab === 'movies' && (
            <motion.div key="movies" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <MovieWall />
            </motion.div>
          )}
          {activeTab === 'bookmarks' && (
            <motion.div key="bookmarks" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
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
      {/* 唱片外圈底座 */}
      <div className="relative w-48 h-48 sm:w-64 sm:h-64 md:w-72 md:h-72">
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
        
        {/* 播放状态指示器 */}
        <AnimatePresence>
          {isPlaying && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary/90 text-white text-xs font-medium shadow-lg"
            >
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                播放中
              </span>
            </motion.div>
          )}
        </AnimatePresence>
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
  const progressRef = useRef<HTMLDivElement>(null)

  const song = musicPlaylist[currentSong]

  const handlePrev = useCallback(() => {
    setCurrentSong((prev) => (prev - 1 + musicPlaylist.length) % musicPlaylist.length)
    setProgress(0)
  }, [])

  const handleNext = useCallback(() => {
    setCurrentSong((prev) => (prev + 1) % musicPlaylist.length)
    setProgress(0)
  }, [])

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
        <div className="p-3 sm:p-4 border-b border-border">
          <h3 className="text-xs sm:text-sm font-semibold text-text-secondary">
            播放列表 · {musicPlaylist.length} 首
          </h3>
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
    </div>
  )
}

/* ===== Movie Wall ===== */
function MovieWall() {
  const [movies, setMovies] = useState<Movie[]>(movieCollection)
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [editComment, setEditComment] = useState('')
  const [editPoster, setEditPoster] = useState('')

  const handleCardClick = (movie: Movie) => {
    setSelectedMovie(movie)
    setEditTitle(movie.title)
    setEditComment(movie.comment)
    setEditPoster(movie.poster)
    setIsEditing(false)
  }

  const handleEdit = () => {
    if (!selectedMovie || !editTitle.trim()) return
    
    setMovies(prev => prev.map(movie => 
      movie.id === selectedMovie.id 
        ? { ...movie, title: editTitle.trim(), comment: editComment.trim(), poster: editPoster }
        : movie
    ))
    setIsEditing(false)
    setSelectedMovie(null)
  }

  const handleDelete = () => {
    if (!selectedMovie) return
    
    if (confirm('确定要删除这部电影吗？')) {
      setMovies(prev => prev.filter(movie => movie.id !== selectedMovie.id))
      setSelectedMovie(null)
    }
  }

  const closeModal = () => {
    setSelectedMovie(null)
    setIsEditing(false)
  }

  return (
    <div>
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
        {movies.map((movie, index) => (
          <motion.div
            key={movie.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
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
      </div>

      {/* Movie Detail Modal */}
      <AnimatePresence>
        {selectedMovie && (
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
                  src={isEditing ? editPoster : selectedMovie.poster}
                  alt={selectedMovie.title}
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

                {/* Rating badge */}
                <div className="absolute bottom-3 left-3 flex items-center gap-1 px-3 py-1.5 rounded-full bg-accent/90 text-white text-sm font-bold">
                  <Star size={14} className="fill-white" />
                  {selectedMovie.rating}
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs text-text-muted mb-1">标题</label>
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-text-muted mb-1">短评</label>
                      <textarea
                        value={editComment}
                        onChange={(e) => setEditComment(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm resize-none"
                        rows={2}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-text-muted mb-1">海报URL</label>
                      <input
                        type="text"
                        value={editPoster}
                        onChange={(e) => setEditPoster(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm"
                      />
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={handleEdit}
                        className="flex-1 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dim transition-colors"
                      >
                        保存修改
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="flex-1 py-2.5 rounded-lg bg-surface text-text text-sm font-medium hover:bg-surface/80 transition-colors border border-border"
                      >
                        取消
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3 text-xs text-text-muted mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {selectedMovie.year}
                      </span>
                      <span>·</span>
                      <span>{selectedMovie.genre}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <User size={12} />
                        {selectedMovie.director}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-text mb-3">{selectedMovie.title}</h3>
                    <p className="text-sm text-text-secondary leading-relaxed mb-2">
                      {selectedMovie.description}
                    </p>
                    <p className="text-sm text-text-muted italic mb-6">
                      "{selectedMovie.comment}"
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
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const categories = [...new Set(bookmarks.map((b) => b.category))]

  const filtered = bookmarks.filter((b) => {
    const matchesSearch = !searchQuery ||
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !selectedCategory || b.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div>
      {/* Search */}
      <div className="relative mb-6">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          placeholder="搜索收藏..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-xl bg-surface border border-border text-text placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-all"
        />
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

      {/* Bookmarks grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((bookmark, index) => (
            <motion.a
              key={bookmark.id}
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.04 }}
              className="glass-card p-4 group block"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{bookmark.icon}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm text-text group-hover:text-primary transition-colors mb-0.5">
                    {bookmark.title}
                  </h3>
                  <p className="text-xs text-text-muted line-clamp-2">{bookmark.description}</p>
                  <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded-full bg-surface border border-border text-text-dim">
                    {bookmark.category}
                  </span>
                </div>
              </div>
            </motion.a>
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-text-muted">没有找到匹配的收藏</p>
        </div>
      )}
    </div>
  )
}
