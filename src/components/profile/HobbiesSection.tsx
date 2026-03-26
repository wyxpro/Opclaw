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
              {/* 顶部渐变背景 */}
              <div className={`h-24 bg-gradient-to-r ${hobby.gradient} relative flex-shrink-0`}>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <X size={20} className="text-white" />
                </motion.button>
                
                {/* 图标 */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className="absolute -bottom-8 left-6 w-16 h-16 rounded-xl flex items-center justify-center shadow-xl"
                  style={{ background: themeConfig.colors.surface }}
                >
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ 
                      background: `linear-gradient(135deg, ${hobby.color}20, ${hobby.color}10)`,
                      color: hobby.color
                    }}
                  >
                    <Icon size={24} />
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

// 3D轮播卡片组件
function Carousel3DCard({ 
  hobby, 
  position,
  onClick,
  hobbyIndex
}: { 
  hobby: HobbyItem
  position: 'left' | 'center' | 'right' | 'hidden'
  onClick: () => void
  hobbyIndex: number
}) {
  const { themeConfig } = useTheme()
  const DecorIcon = decorIconMap[hobby.id === 'sports' ? 'Trophy' : hobby.id === 'travel' ? 'MapPin' : hobby.id === 'food' ? 'ChefHat' : 'Joystick'] || Trophy
  const imageUrl = hobbyImages[hobby.id]

  const get3DStyles = (isDesktop: boolean) => {
    if (isDesktop) {
      // 桌面端：显示3个卡片，左右部分可见
      switch (position) {
        case 'center':
          return {
            x: 0,
            scale: 1,
            zIndex: 30,
            opacity: 1,
            rotateY: 0,
            z: 0
          }
        case 'left':
          return {
            x: '-65%',
            scale: 0.9,
            zIndex: 20,
            opacity: 0.85,
            rotateY: 8,
            z: -40
          }
        case 'right':
          return {
            x: '65%',
            scale: 0.9,
            zIndex: 20,
            opacity: 0.85,
            rotateY: -8,
            z: -40
          }
        default:
          return {
            x: 0,
            scale: 0.7,
            zIndex: 10,
            opacity: 0,
            rotateY: 0,
            z: -200
          }
      }
    } else {
      // 移动端：只显示当前卡片
      switch (position) {
        case 'center':
          return {
            x: 0,
            scale: 1,
            zIndex: 30,
            opacity: 1,
            rotateY: 0,
            z: 0
          }
        case 'left':
          return {
            x: '-100%',
            scale: 0.9,
            zIndex: 20,
            opacity: 0,
            rotateY: 0,
            z: -50
          }
        case 'right':
          return {
            x: '100%',
            scale: 0.9,
            zIndex: 20,
            opacity: 0,
            rotateY: 0,
            z: -50
          }
        default:
          return {
            x: 0,
            scale: 0.7,
            zIndex: 10,
            opacity: 0,
            rotateY: 0,
            z: -200
          }
      }
    }
  }

  // 检测是否为桌面端
  const [isDesktop, setIsDesktop] = useState(false)
  
  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024)
    }
    checkDesktop()
    window.addEventListener('resize', checkDesktop)
    return () => window.removeEventListener('resize', checkDesktop)
  }, [])
  
  const styles = get3DStyles(isDesktop)
  const isCenter = position === 'center'
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      layout
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="absolute top-0 left-0 right-0 mx-auto w-[85%] sm:w-[70%] md:w-[55%] lg:w-[26%] max-w-[280px] cursor-pointer"
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d'
      }}
      initial={false}
      animate={{
        x: isDesktop 
          ? (position === 'center' ? '-50%' : position === 'left' ? '-50%' : position === 'right' ? '-50%' : '-50%')
          : (position === 'center' ? '-50%' : position === 'left' ? '-120%' : position === 'right' ? '20%' : '-50%'),
        scale: isHovered && isDesktop ? 1.08 : styles.scale,
        opacity: isHovered && isDesktop && !isCenter ? 1 : styles.opacity,
        rotateY: isHovered && isDesktop ? 0 : styles.rotateY,
        z: isHovered && isDesktop ? 100 : styles.z
      }}
      transition={{ 
        type: 'spring', 
        stiffness: 300, 
        damping: 30,
        duration: 0.5 
      }}
      whileTap={isCenter ? { scale: styles.scale * 0.98 } : {}}
    >
      <motion.div
        className="relative overflow-hidden h-[420px] lg:h-[480px]"
        animate={{
          boxShadow: isHovered && isDesktop
            ? `0 35px 100px ${hobby.color}60, 0 15px 40px rgba(0,0,0,0.3)`
            : isCenter 
              ? `0 25px 80px ${hobby.color}40, 0 10px 30px rgba(0,0,0,0.2)` 
              : `0 15px 50px rgba(0,0,0,0.1), 0 5px 15px rgba(0,0,0,0.08)`,
          borderColor: isHovered && isDesktop ? hobby.color : isCenter ? hobby.color : themeConfig.colors.border
        }}
        transition={{ duration: 0.3 }}
        style={{
          background: themeConfig.colors.surface,
          border: `2px solid`,
          borderRadius: '16px',
          transformStyle: 'preserve-3d'
        }}
      >
        {/* 全屏背景图片 */}
        <div className="absolute inset-0">
          <motion.img
            src={imageUrl}
            alt={hobby.title}
            className="w-full h-full object-cover"
            initial={{ scale: 1.2 }}
            animate={{ scale: isHovered && isDesktop ? 1.1 : isCenter ? 1 : 1.05 }}
            transition={{ duration: 0.6 }}
          />
          
          {/* 紫色渐变遮罩 - 参考图片风格 */}
          <div 
            className="absolute inset-0"
            style={{
              background: `linear-gradient(180deg, ${hobby.color}30 0%, ${hobby.color}80 50%, ${hobby.color} 100%)`
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
        <div className="absolute inset-0 flex flex-col justify-end p-6">
          {/* 编号 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-6xl lg:text-7xl font-bold mb-2"
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
            className="text-2xl lg:text-3xl font-bold text-white mb-3"
          >
            {hobby.title}
          </motion.h3>
          
          {/* 描述 - 悬停时显示 */}
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ 
              opacity: isHovered && isDesktop ? 1 : 0,
              height: isHovered && isDesktop ? 'auto' : 0
            }}
            transition={{ duration: 0.3 }}
            className="text-sm text-white/80 mb-4 overflow-hidden"
          >
            {hobby.description}
          </motion.p>
          
          {/* 统计数据 - 悬停时显示 */}
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ 
              opacity: isHovered && isDesktop ? 1 : 0,
              height: isHovered && isDesktop ? 'auto' : 0
            }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="flex gap-4 mb-4 overflow-hidden"
          >
            {hobby.stats.slice(0, 2).map((stat, idx) => (
              <div key={idx} className="text-white">
                <div className="text-xl font-bold">{stat.value}</div>
                <div className="text-xs text-white/70">{stat.label}</div>
              </div>
            ))}
          </motion.div>
          
          {/* 亮点标签 - 悬停时显示 */}
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ 
              opacity: isHovered && isDesktop ? 1 : 0,
              height: isHovered && isDesktop ? 'auto' : 0
            }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="flex flex-wrap gap-2 overflow-hidden"
          >
            {hobby.highlights.slice(0, 3).map((highlight) => (
              <span
                key={highlight}
                className="px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white backdrop-blur-sm"
              >
                {highlight}
              </span>
            ))}
          </motion.div>
          
          {/* 点击提示 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isCenter ? 1 : 0.6 }}
            className="mt-4 flex items-center gap-2 text-sm font-medium text-white/90"
          >
            <span>点击查看详情</span>
            <ArrowRight size={16} />
          </motion.div>
        </div>
        
        {/* 装饰图标 - 右上角 */}
        <motion.div
          animate={{ rotate: isCenter ? [0, 10, -10, 0] : 0 }}
          transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
          className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm"
          style={{ background: 'rgba(255, 255, 255, 0.2)' }}
        >
          <DecorIcon size={20} className="text-white" />
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export function HobbiesSection() {
  const { themeConfig } = useTheme()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [selectedHobby, setSelectedHobby] = useState<HobbyItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)
  
  const AUTO_PLAY_INTERVAL = 4000 // 4秒自动切换

  // 获取卡片位置
  const getCardPosition = (index: number): 'left' | 'center' | 'right' | 'hidden' => {
    const diff = index - currentIndex
    const len = hobbiesData.length
    
    // 处理循环
    let normalizedDiff = diff
    if (diff > len / 2) normalizedDiff = diff - len
    if (diff < -len / 2) normalizedDiff = diff + len
    
    if (normalizedDiff === 0) return 'center'
    if (normalizedDiff === -1 || normalizedDiff === len - 1) return 'left'
    if (normalizedDiff === 1 || normalizedDiff === -(len - 1)) return 'right'
    return 'hidden'
  }

  // 自动播放
  useEffect(() => {
    if (isPaused) return
    
    const interval = setInterval(() => {
      // 自动向左切换（索引减1）
      setCurrentIndex((prev) => (prev - 1 + hobbiesData.length) % hobbiesData.length)
    }, AUTO_PLAY_INTERVAL)

    return () => clearInterval(interval)
  }, [isPaused])

  // 切换到上一张
  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + hobbiesData.length) % hobbiesData.length)
  }, [])

  // 切换到下一张
  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % hobbiesData.length)
  }, [])

  // 跳转到指定索引
  const goToIndex = useCallback((index: number) => {
    setCurrentIndex(index)
  }, [])

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

  // 触摸事件处理
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX
  }

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        goToNext()
      } else {
        goToPrev()
      }
    }
  }

  const currentHobby = hobbiesData[currentIndex]

  return (
    <section 
      className="py-20 px-4 sm:px-6 lg:px-8" 
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

        {/* 3D轮播区域 */}
        <div 
          className="relative h-[420px] sm:h-[480px] lg:h-[520px]"
          style={{ perspective: '2000px' }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* 3D轮播容器 */}
          <div 
            className="relative w-full h-full max-w-6xl mx-auto"
            style={{ 
              transformStyle: 'preserve-3d',
              perspective: '2000px'
            }}
          >
            {hobbiesData.map((hobby, idx) => (
              <Carousel3DCard
                key={hobby.id}
                hobby={hobby}
                hobbyIndex={idx}
                position={getCardPosition(idx)}
                onClick={() => openModal(hobby)}
              />
            ))}
          </div>
        </div>

        {/* 页码指示器 */}
        <div className="flex justify-center gap-2 mt-8">
          {hobbiesData.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => goToIndex(index)}
              className="relative h-2 rounded-full transition-all duration-300"
              style={{
                width: index === currentIndex ? 32 : 8,
                background: index === currentIndex 
                  ? currentHobby.color 
                  : themeConfig.colors.border
              }}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              {index === currentIndex && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute inset-0 rounded-full"
                  style={{ background: currentHobby.color }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
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
