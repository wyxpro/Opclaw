import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Music, Film, Bookmark, Play, Pause, SkipBack, SkipForward, Volume2, Star, Search } from 'lucide-react'
import PageTransition from '../components/ui/PageTransition'
import { musicPlaylist, movieCollection, bookmarks } from '../data/mock'

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

/* ===== Music Box ===== */
function MusicBox() {
  const [currentSong, setCurrentSong] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress] = useState(35)
  const progressRef = useRef<HTMLDivElement>(null)

  const song = musicPlaylist[currentSong]

  const handlePrev = () => setCurrentSong((prev) => (prev - 1 + musicPlaylist.length) % musicPlaylist.length)
  const handleNext = () => setCurrentSong((prev) => (prev + 1) % musicPlaylist.length)

  return (
    <div className="max-w-3xl mx-auto">
      {/* Now Playing */}
      <div className="glass-card p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Album Art */}
          <motion.div
            key={currentSong}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-40 h-40 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: `linear-gradient(135deg, ${song.color}66, ${song.color}22)` }}
          >
            <Music size={48} style={{ color: song.color }} />
          </motion.div>

          {/* Song Info & Controls */}
          <div className="flex-1 text-center sm:text-left w-full">
            <motion.div key={song.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="text-2xl font-bold text-text mb-1">{song.title}</h2>
              <p className="text-text-secondary mb-1">{song.artist}</p>
              <p className="text-xs text-text-muted mb-6">{song.album}</p>
            </motion.div>

            {/* Progress Bar */}
            <div ref={progressRef} className="relative w-full h-1 bg-border rounded-full mb-3 cursor-pointer group">
              <div
                className="absolute left-0 top-0 h-full rounded-full transition-all"
                style={{ width: `${progress}%`, background: song.color }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ left: `${progress}%`, background: song.color, boxShadow: `0 0 10px ${song.color}88` }}
              />
            </div>
            <div className="flex justify-between text-xs text-text-muted mb-4">
              <span>1:32</span>
              <span>{song.duration}</span>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center sm:justify-start gap-4">
              <button
                onClick={handlePrev}
                className="p-2 rounded-full text-text-secondary hover:text-text hover:bg-surface transition-all"
              >
                <SkipBack size={20} />
              </button>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-4 rounded-full text-bg transition-all"
                style={{ background: song.color }}
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </button>
              <button
                onClick={handleNext}
                className="p-2 rounded-full text-text-secondary hover:text-text hover:bg-surface transition-all"
              >
                <SkipForward size={20} />
              </button>
              <button className="p-2 rounded-full text-text-muted hover:text-text-secondary transition-colors ml-2">
                <Volume2 size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Playlist */}
      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-border">
          <h3 className="text-sm font-semibold text-text-secondary">播放列表 · {musicPlaylist.length} 首</h3>
        </div>
        <div className="divide-y divide-border">
          {musicPlaylist.map((s, i) => (
            <button
              key={s.id}
              onClick={() => { setCurrentSong(i); setIsPlaying(true) }}
              className={`w-full flex items-center gap-4 px-4 py-3 text-left transition-all hover:bg-surface/60 ${
                i === currentSong ? 'bg-primary/5' : ''
              }`}
            >
              <span className="w-8 text-center text-xs text-text-muted">{i + 1}</span>
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: `linear-gradient(135deg, ${s.color}44, ${s.color}11)` }}
              >
                {i === currentSong && isPlaying ? (
                  <div className="flex items-end gap-0.5 h-4">
                    {[1, 2, 3].map((bar) => (
                      <motion.div
                        key={bar}
                        className="w-1 rounded-full"
                        style={{ background: s.color }}
                        animate={{ height: ['4px', '16px', '8px', '14px', '4px'] }}
                        transition={{ duration: 1.2, repeat: Infinity, delay: bar * 0.15 }}
                      />
                    ))}
                  </div>
                ) : (
                  <Music size={16} style={{ color: s.color }} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm truncate ${i === currentSong ? 'text-primary font-medium' : 'text-text'}`}>
                  {s.title}
                </p>
                <p className="text-xs text-text-muted truncate">{s.artist}</p>
              </div>
              <span className="text-xs text-text-muted">{s.duration}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ===== Movie Wall ===== */
function MovieWall() {
  return (
    <div>
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
        {movieCollection.map((movie, index) => (
          <motion.div
            key={movie.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
            className="group"
          >
            <div className="glass-card overflow-hidden">
              {/* Poster */}
              <div className={`relative h-52 sm:h-64 bg-gradient-to-br ${movie.gradient} flex items-center justify-center overflow-hidden`}>
                <Film size={40} className="text-white/20" />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                {/* Rating badge */}
                <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-bg/80 backdrop-blur-sm text-xs font-semibold">
                  <Star size={10} className="text-accent fill-accent" />
                  <span className="text-accent">{movie.rating}</span>
                </div>
              </div>
              {/* Info */}
              <div className="p-3">
                <h3 className="font-semibold text-sm text-text mb-0.5 truncate">{movie.title}</h3>
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
