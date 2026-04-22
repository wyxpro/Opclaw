import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Dumbbell, 
  Plane, 
  UtensilsCrossed, 
  Gamepad2,
  Trophy,
  MapPin,
  ChefHat,
  Joystick,
  ArrowRight,
  X,
  Clock,
  Target,
  Zap
} from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'
import { AnimatedSection } from './AnimatedSection'

// 兴趣爱好数据
interface HobbyItem {
  id: string
  title: string
  description: string
  icon: string
  color: string
  gradient: string
  stats: { label: string; value: string; icon?: string }[]
  highlights: string[]
  details: {
    fullDescription: string
    achievements: string[]
    goals: string[]
    favoriteItems: string[]
  }
}

// 兴趣爱好封面图片
const hobbyImages: Record<string, string> = {
  sports: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80',
  travel: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80',
  food: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80',
  gaming: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80'
}

const hobbiesData: HobbyItem[] = [
  {
    id: 'sports',
    title: '运动健身',
    description: '保持活力，挑战自我，享受运动带来的快乐与健康',
    icon: 'Dumbbell',
    color: '#10B981',
    gradient: 'from-emerald-500 to-teal-500',
    stats: [
      { label: '坚持天数', value: '365+', icon: 'Clock' },
      { label: '喜爱项目', value: '跑步、游泳', icon: 'Target' },
      { label: '消耗热量', value: '50万+', icon: 'Zap' }
    ],
    highlights: ['马拉松', '游泳', '健身', '瑜伽'],
    details: {
      fullDescription: '运动是我生活中不可或缺的一部分。通过坚持运动，我不仅保持了良好的身体状态，更培养了坚韧不拔的意志力。从最初的几百米到现在的马拉松，每一步都是对自己的挑战和超越。',
      achievements: ['完成人生第一个半程马拉松', '坚持晨跑365天不间断', '学会自由泳和蛙泳', '获得健身初级教练认证'],
      goals: ['完成全程马拉松', '学会冲浪', '挑战铁人三项', '攀登一座雪山'],
      favoriteItems: ['Nike Zoom Fly 跑鞋', 'Garmin 运动手表', 'AirPods Pro', 'Lululemon 运动服']
    }
  },
  {
    id: 'travel',
    title: '旅游探索',
    description: '用脚步丈量世界，用镜头记录美好，探索未知的风景',
    icon: 'Plane',
    color: '#3B82F6',
    gradient: 'from-blue-500 to-cyan-500',
    stats: [
      { label: '已访城市', value: '20+', icon: 'MapPin' },
      { label: '足迹遍布', value: '5个国家', icon: 'Target' },
      { label: '拍摄照片', value: '1万+', icon: 'Zap' }
    ],
    highlights: ['自然风光', '人文古迹', '美食之旅', '摄影'],
    details: {
      fullDescription: '旅行让我看到了世界的广阔和多样性。每一次出行都是一次心灵的洗礼，让我在陌生的环境中发现新的自己。用镜头记录下那些美好的瞬间，成为最珍贵的回忆。',
      achievements: ['独自完成西藏自驾游', '在冰岛看到极光', '登上富士山顶', '品尝过20+国家的特色美食'],
      goals: ['环游世界七大洲', '在撒哈拉沙漠露营', '探访南极', '学习潜水证'],
      favoriteItems: ['Sony A7M4 相机', 'DJI Mini 无人机', 'Osprey 背包', 'Kindle 电子书']
    }
  },
  {
    id: 'food',
    title: '美食烹饪',
    description: '品味人间烟火，探索味蕾的无限可能，享受美食时光',
    icon: 'UtensilsCrossed',
    color: '#F59E0B',
    gradient: 'from-amber-500 to-orange-500',
    stats: [
      { label: '拿手菜品', value: '30+', icon: 'ChefHat' },
      { label: '探索菜系', value: '8大菜系', icon: 'Target' },
      { label: '探店数量', value: '200+', icon: 'Zap' }
    ],
    highlights: ['中式料理', '烘焙甜点', '咖啡品鉴', '探店'],
    details: {
      fullDescription: '美食是生活中最美好的享受之一。从品尝到自己动手制作，每一道菜都承载着对食材的尊重和对味道的追求。无论是家常小炒还是精致甜点，都能带给我满满的成就感。',
      achievements: ['成功复刻米其林餐厅菜品', '学会拉花艺术', '举办家庭美食派对', '建立个人食谱博客'],
      goals: ['学习法式料理', '考取咖啡师证书', '出版个人食谱', '开一家小餐馆'],
      favoriteItems: ['Le Creuset 珐琅锅', 'KitchenAid 厨师机', 'Breville 咖啡机', '藤次郎菜刀']
    }
  },
  {
    id: 'gaming',
    title: '游戏娱乐',
    description: '在虚拟世界中冒险，体验精彩故事，放松身心',
    icon: 'Gamepad2',
    color: '#8B5CF6',
    gradient: 'from-violet-500 to-purple-500',
    stats: [
      { label: '游戏时长', value: '1000+', icon: 'Clock' },
      { label: '喜爱类型', value: 'RPG、策略', icon: 'Target' },
      { label: '通关游戏', value: '50+', icon: 'Zap' }
    ],
    highlights: ['单机大作', '独立游戏', '桌游', '电竞'],
    details: {
      fullDescription: '游戏是我放松和娱乐的重要方式。在虚拟世界中，我可以成为任何人，体验不同的故事和冒险。从3A大作到独立精品，每一款好游戏都是一件艺术品，值得细细品味。',
      achievements: ['全成就通关《塞尔达传说》', '组建自己的电竞战队', '参加桌游马拉松24小时', '直播游戏收获1万粉丝'],
      goals: ['开发自己的独立游戏', '参加国际电竞比赛', '收集100款经典游戏', '建立游戏主题房间'],
      favoriteItems: ['PS5 游戏主机', 'Nintendo Switch', 'Steam Deck', 'Secretlab 电竞椅']
    }
  }
]

// 图标映射
const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Dumbbell,
  Plane,
  UtensilsCrossed,
  Gamepad2
}

// 装饰图标映射
const decorIconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Trophy,
  MapPin,
  ChefHat,
  Joystick
}

// 统计图标映射
const statIconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Clock,
  Target,
  Zap,
  MapPin,
  ChefHat
}

// 详情模态框组件
function HobbyDetailModal({ 
  hobby, 
  isOpen, 
  onClose 
}: { 
  hobby: HobbyItem | null
  isOpen: boolean
  onClose: () => void 
}) {
  const { themeConfig } = useTheme()
  
  // ESC键关闭
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      window.addEventListener('keydown', handleEsc)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      window.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!hobby) return null

  const Icon = iconMap[hobby.icon] || Dumbbell
  const DecorIcon = decorIconMap[hobby.id === 'sports' ? 'Trophy' : hobby.id === 'travel' ? 'MapPin' : hobby.id === 'food' ? 'ChefHat' : 'Joystick'] || Trophy

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 遮罩层 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
            onClick={onClose}
          />
          
          {/* 模态框 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 overflow-auto w-[90%] sm:w-[80%] md:w-[600px] max-w-[600px]"
            style={{
              maxHeight: '80vh'
            }}
          >
            <div 
              className="relative rounded-2xl flex flex-col"
              style={{
                background: themeConfig.colors.surface,
                border: `1px solid ${themeConfig.colors.border}`
              }}
            >
              {/* 顶部图片背景 */}
              <div className="h-32 relative flex-shrink-0 overflow-hidden rounded-t-2xl">
                <img 
                  src={hobbyImages[hobby.id]} 
                  alt={hobby.title}
                  className="w-full h-full object-cover"
                />
                {/* 叠加遮罩，增强层次感并确保关闭按钮清晰 */}
                <div 
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 60%, ${themeConfig.colors.surface} 100%)`
                  }}
                />
                
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-colors z-10"
                  style={{
                    background: 'rgba(0, 0, 0, 0.2)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <X size={20} className="text-white" />
                </motion.button>
                
                {/* 图标容器 */}
                <motion.div
                  initial={{ scale: 0, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className="absolute -bottom-6 left-6 w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl z-20"
                  style={{ 
                    background: themeConfig.colors.surface,
                    border: `1px solid ${themeConfig.colors.border}`
                  }}
                >
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ 
                      background: `linear-gradient(135deg, ${hobby.color}20, ${hobby.color}10)`,
                      color: hobby.color
                    }}
                  >
                    <Icon size={28} />
                  </div>
                </motion.div>
              </div>

              {/* 内容区域 */}
              <div className="p-5 pt-10">
                {/* 标题 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <h2 
                      className="text-xl sm:text-2xl font-bold"
                      style={{ color: themeConfig.colors.text }}
                    >
                      {hobby.title}
                    </h2>
                    <span style={{ color: hobby.color }}><DecorIcon size={20} /></span>
                  </div>
                  <p 
                    className="text-base mb-6"
                    style={{ color: themeConfig.colors.textMuted }}
                  >
                    {hobby.description}
                  </p>
                </motion.div>

                {/* 统计数据 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="grid grid-cols-3 gap-3 mb-5"
                >
                  {hobby.stats.map((stat, idx) => {
                    const StatIcon = stat.icon ? (statIconMap[stat.icon] || Zap) : Zap
                    return (
                      <div 
                        key={idx}
                        className="p-3 rounded-lg text-center"
                        style={{ 
                          background: `${hobby.color}10`,
                          border: `1px solid ${hobby.color}20`
                        }}
                      >
                        <StatIcon size={18} style={{ color: hobby.color }} className="mx-auto mb-1" />
                        <div 
                          className="text-lg font-bold"
                          style={{ color: hobby.color }}
                        >
                          {stat.value}
                        </div>
                        <div 
                          className="text-xs"
                          style={{ color: themeConfig.colors.textMuted }}
                        >
                          {stat.label}
                        </div>
                      </div>
                    )
                  })}
                </motion.div>

                {/* 详细描述 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mb-5"
                >
                  <h3 
                    className="text-base font-semibold mb-2 flex items-center gap-2"
                    style={{ color: themeConfig.colors.text }}
                  >
                    <span 
                      className="w-1 h-4 rounded-full"
                      style={{ background: hobby.color }}
                    />
                    关于这个爱好
                  </h3>
                  <p 
                    className="text-sm leading-relaxed"
                    style={{ color: themeConfig.colors.textSecondary }}
                  >
                    {hobby.details.fullDescription}
                  </p>
                </motion.div>

                {/* 成就 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="mb-5"
                >
                  <h3 
                    className="text-base font-semibold mb-2 flex items-center gap-2"
                    style={{ color: themeConfig.colors.text }}
                  >
                    <Trophy size={16} style={{ color: hobby.color }} />
                    已达成成就
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {hobby.details.achievements.map((achievement, idx) => (
                      <motion.span
                        key={idx}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6 + idx * 0.1 }}
                        className="px-2.5 py-1 rounded-md text-xs"
                        style={{
                          background: `${themeConfig.colors.primary}10`,
                          color: themeConfig.colors.primary,
                          border: `1px solid ${themeConfig.colors.primary}20`
                        }}
                      >
                        {achievement}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>

                {/* 目标 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="mb-5"
                >
                  <h3 
                    className="text-base font-semibold mb-2 flex items-center gap-2"
                    style={{ color: themeConfig.colors.text }}
                  >
                    <Target size={16} style={{ color: hobby.color }} />
                    未来目标
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {hobby.details.goals.map((goal, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 + idx * 0.1 }}
                        className="flex items-center gap-2 p-2.5 rounded-lg"
                        style={{
                          background: themeConfig.colors.bg,
                          border: `1px solid ${themeConfig.colors.border}`
                        }}
                      >
                        <div 
                          className="w-2 h-2 rounded-full"
                          style={{ background: hobby.color }}
                        />
                        <span 
                          className="text-xs"
                          style={{ color: themeConfig.colors.textSecondary }}
                        >
                          {goal}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* 喜爱装备 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <h3 
                    className="text-base font-semibold mb-2 flex items-center gap-2"
                    style={{ color: themeConfig.colors.text }}
                  >
                    <Zap size={16} style={{ color: hobby.color }} />
                    推荐装备/好物
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {hobby.details.favoriteItems.map((item, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 + idx * 0.1 }}
                        className="p-2.5 rounded-lg text-xs"
                        style={{
                          background: `${hobby.color}08`,
                          border: `1px solid ${hobby.color}15`,
                          color: themeConfig.colors.text
                        }}
                      >
                        {item}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// 移动端横向滑动卡片组件
function MobileHobbyCarousel({
  hobbies,
  onCardClick
}: {
  hobbies: HobbyItem[]
  onCardClick: (hobby: HobbyItem) => void
}) {
  const { themeConfig } = useTheme()
  const [currentPage, setCurrentPage] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const totalPages = Math.ceil(hobbies.length / 2)

  // 处理滑动
  const handleScroll = useCallback(() => {
    if (containerRef.current) {
      const scrollLeft = containerRef.current.scrollLeft
      const itemWidth = containerRef.current.offsetWidth / 2
      const newPage = Math.round(scrollLeft / itemWidth / 2)
      setCurrentPage(Math.min(newPage, totalPages - 1))
    }
  }, [totalPages])

  // 自动播放
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPage((prev) => {
        const nextPage = (prev + 1) % totalPages
        if (containerRef.current) {
          const scrollWidth = containerRef.current.offsetWidth
          containerRef.current.scrollTo({
            left: nextPage * scrollWidth,
            behavior: 'smooth'
          })
        }
        return nextPage
      })
    }, 4000)

    return () => clearInterval(interval)
  }, [totalPages])

  return (
    <div className="w-full">
      {/* 横向滑动容器 */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        {hobbies.map((hobby, idx) => (
          <MobileHobbyCard
            key={hobby.id}
            hobby={hobby}
            hobbyIndex={idx}
            onClick={() => onCardClick(hobby)}
          />
        ))}
      </div>

      {/* 页码指示器 */}
      <div className="flex justify-center gap-2 mt-6">
        {Array.from({ length: totalPages }).map((_, index) => (
          <motion.button
            key={index}
            onClick={() => {
              setCurrentPage(index)
              if (containerRef.current) {
                containerRef.current.scrollTo({
                  left: index * containerRef.current.offsetWidth,
                  behavior: 'smooth'
                })
              }
            }}
            className="relative h-2 rounded-full transition-all duration-300"
            style={{
              width: index === currentPage ? 32 : 8,
              background: index === currentPage
                ? hobbies[currentPage * 2]?.color || hobbies[0].color
                : themeConfig.colors.border
            }}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </div>
    </div>
  )
}

// 移动端卡片组件
function MobileHobbyCard({
  hobby,
  hobbyIndex,
  onClick
}: {
  hobby: HobbyItem
  hobbyIndex: number
  onClick: () => void
}) {
  const DecorIcon = decorIconMap[hobby.id === 'sports' ? 'Trophy' : hobby.id === 'travel' ? 'MapPin' : hobby.id === 'food' ? 'ChefHat' : 'Joystick'] || Trophy
  const imageUrl = hobbyImages[hobby.id]

  return (
    <motion.div
      onClick={onClick}
      className="flex-shrink-0 w-1/2 snap-start px-2"
      whileTap={{ scale: 0.98 }}
    >
      <div className="relative overflow-hidden h-[320px] sm:h-[380px] rounded-2xl cursor-pointer"
        style={{
          boxShadow: `0 10px 30px ${hobby.color}30, 0 4px 10px rgba(0,0,0,0.1)`,
          border: `2px solid ${hobby.color}60`
        }}
      >
        {/* 全屏背景图片 */}
        <div className="absolute inset-0">
          <img
            src={imageUrl}
            alt={hobby.title}
            className="w-full h-full object-cover"
          />

          {/* 渐变遮罩 */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(180deg, ${hobby.color}30 0%, ${hobby.color}70 50%, ${hobby.color} 100%)`
            }}
          />

          {/* 底部深色渐变 */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(0deg, ${hobby.color} 0%, transparent 60%)`
            }}
          />
        </div>

        {/* 内容区域 - 底部对齐 */}
        <div className="absolute inset-0 flex flex-col justify-end p-4">
          {/* 编号 */}
          <div
            className="text-4xl font-bold mb-1"
            style={{
              color: 'rgba(255,255,255,0.3)',
              fontFamily: 'serif'
            }}
          >
            {String(hobbyIndex + 1).padStart(2, '0')}
          </div>

          {/* 标题 */}
          <h3 className="text-lg font-bold text-white mb-1">
            {hobby.title}
          </h3>

          {/* 点击提示 */}
          <div className="mt-2 flex items-center gap-1 text-xs font-medium text-white/90">
            <span>点击查看详情</span>
            <ArrowRight size={14} />
          </div>
        </div>

        {/* 装饰图标 - 右上角 */}
        <div
          className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-sm"
          style={{ background: 'rgba(255, 255, 255, 0.2)' }}
        >
          <DecorIcon size={16} className="text-white" />
        </div>
      </div>
    </motion.div>
  )
}

// 桌面端网格卡片组件
function HobbyCard({ 
  hobby, 
  onClick,
  hobbyIndex
}: { 
  hobby: HobbyItem
  onClick: () => void
  hobbyIndex: number
}) {
  const { themeConfig } = useTheme()
  const DecorIcon = decorIconMap[hobby.id === 'sports' ? 'Trophy' : hobby.id === 'travel' ? 'MapPin' : hobby.id === 'food' ? 'ChefHat' : 'Joystick'] || Trophy
  const imageUrl = hobbyImages[hobby.id]
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="cursor-pointer h-[420px] xl:h-[480px]"
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <motion.div
        className="relative overflow-hidden h-full rounded-2xl"
        animate={{
          boxShadow: isHovered
            ? `0 25px 60px ${hobby.color}50, 0 10px 30px rgba(0,0,0,0.25)`
            : `0 15px 40px ${hobby.color}30, 0 5px 15px rgba(0,0,0,0.1)`,
          borderColor: isHovered ? hobby.color : `${hobby.color}60`
        }}
        transition={{ duration: 0.3 }}
        style={{
          background: themeConfig.colors.surface,
          border: `2px solid`,
        }}
      >
        {/* 全屏背景图片 */}
        <div className="absolute inset-0">
          <motion.img
            src={imageUrl}
            alt={hobby.title}
            className="w-full h-full object-cover"
            animate={{ scale: isHovered ? 1.08 : 1 }}
            transition={{ duration: 0.5 }}
          />
          
          {/* 渐变遮罩 */}
          <div 
            className="absolute inset-0"
            style={{
              background: `linear-gradient(180deg, ${hobby.color}30 0%, ${hobby.color}70 50%, ${hobby.color} 100%)`
            }}
          />
          
          {/* 底部深色渐变 */}
          <div 
            className="absolute inset-0"
            style={{
              background: `linear-gradient(0deg, ${hobby.color} 0%, transparent 60%)`
            }}
          />
        </div>

        {/* 内容区域 - 底部对齐 */}
        <div className="absolute inset-0 flex flex-col justify-end p-5">
          {/* 编号 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl xl:text-6xl font-bold mb-2"
            style={{ 
              color: 'rgba(255,255,255,0.3)',
              fontFamily: 'serif'
            }}
          >
            {String(hobbyIndex + 1).padStart(2, '0')}
          </motion.div>
          
          {/* 标题 */}
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl xl:text-2xl font-bold text-white mb-2"
          >
            {hobby.title}
          </motion.h3>
          
          {/* 描述 - 悬停时显示 */}
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ 
              opacity: isHovered ? 1 : 0,
              height: isHovered ? 'auto' : 0
            }}
            transition={{ duration: 0.3 }}
            className="text-sm text-white/80 mb-3 overflow-hidden"
          >
            {hobby.description}
          </motion.p>
          
          {/* 统计数据 - 悬停时显示 */}
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ 
              opacity: isHovered ? 1 : 0,
              height: isHovered ? 'auto' : 0
            }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="flex gap-3 mb-3 overflow-hidden"
          >
            {hobby.stats.slice(0, 2).map((stat, idx) => (
              <div key={idx} className="text-white">
                <div className="text-lg font-bold">{stat.value}</div>
                <div className="text-xs text-white/70">{stat.label}</div>
              </div>
            ))}
          </motion.div>
          
          {/* 亮点标签 - 悬停时显示 */}
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ 
              opacity: isHovered ? 1 : 0,
              height: isHovered ? 'auto' : 0
            }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="flex flex-wrap gap-1.5 overflow-hidden"
          >
            {hobby.highlights.slice(0, 2).map((highlight) => (
              <span
                key={highlight}
                className="px-2 py-0.5 rounded-full text-xs font-medium bg-white/20 text-white backdrop-blur-sm"
              >
                {highlight}
              </span>
            ))}
          </motion.div>
          
          {/* 点击提示 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-3 flex items-center gap-2 text-sm font-medium text-white/90"
          >
            <span>点击查看详情</span>
            <ArrowRight size={16} />
          </motion.div>
        </div>
        
        {/* 装饰图标 - 右上角 */}
        <motion.div
          animate={{ rotate: isHovered ? [0, 10, -10, 0] : 0 }}
          transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm"
          style={{ background: 'rgba(255, 255, 255, 0.2)' }}
        >
          <DecorIcon size={18} className="text-white" />
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export function HobbiesSection() {
  const { themeConfig } = useTheme()
  const [selectedHobby, setSelectedHobby] = useState<HobbyItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // 打开详情模态框
  const openModal = useCallback((hobby: HobbyItem) => {
    setSelectedHobby(hobby)
    setIsModalOpen(true)
  }, [])

  // 关闭详情模态框
  const closeModal = useCallback(() => {
    setIsModalOpen(false)
    setTimeout(() => setSelectedHobby(null), 300)
  }, [])

  return (
    <section 
      className="py-12 px-4 sm:px-6 lg:px-8" 
      style={{ background: themeConfig.colors.bg }}
    >
      <div className="max-w-6xl mx-auto">
        {/* 标题区域 */}
        <AnimatedSection className="text-center mb-12">
          <h2
            className="text-3xl sm:text-4xl font-bold mb-4"
            style={{ color: themeConfig.colors.text }}
          >
            兴趣爱好
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto"
            style={{ color: themeConfig.colors.textMuted }}
          >
            热爱生活，享受每一个精彩瞬间，探索无限可能
          </p>
        </AnimatedSection>

        {/* 桌面端：4个卡片并排显示 / 移动端：轮播 */}
        <div className="hidden lg:block">
          {/* 桌面端4卡片网格布局 */}
          <div className="grid grid-cols-4 gap-4 xl:gap-6">
            {hobbiesData.map((hobby, idx) => (
              <HobbyCard
                key={hobby.id}
                hobby={hobby}
                hobbyIndex={idx}
                onClick={() => openModal(hobby)}
              />
            ))}
          </div>
        </div>

        <div className="lg:hidden">
          {/* 移动端：横向滑动，一行显示两个卡片 */}
          <MobileHobbyCarousel 
            hobbies={hobbiesData}
            onCardClick={openModal}
          />
        </div>

        {/* 底部装饰线 */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 h-px mx-auto max-w-md"
          style={{
            background: `linear-gradient(90deg, transparent, ${themeConfig.colors.border}, transparent)`
          }}
        />
      </div>

      {/* 详情模态框 */}
      <HobbyDetailModal
        hobby={selectedHobby}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </section>
  )
}
