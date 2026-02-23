import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { TravelLocation } from '../data/mock'

// 中国省份路径数据（简化版，基于标准中国地图轮廓）
const provincePaths: Record<string, { path: string; name: string; center: [number, number] }> = {
  beijing: {
    name: '北京',
    center: [680, 220],
    path: 'M670,210 L690,210 L695,220 L690,235 L675,240 L665,230 L665,220 Z'
  },
  tianjin: {
    name: '天津',
    center: [695, 235],
    path: 'M690,225 L705,225 L710,235 L705,245 L695,245 L690,235 Z'
  },
  hebei: {
    name: '河北',
    center: [665, 250],
    path: 'M650,200 L680,200 L700,210 L710,240 L700,270 L680,290 L660,280 L650,260 L645,230 Z'
  },
  shanxi: {
    name: '山西',
    center: [620, 250],
    path: 'M600,210 L640,210 L650,240 L645,280 L620,290 L600,280 L595,250 L595,230 Z'
  },
  neimenggu: {
    name: '内蒙古',
    center: [500, 180],
    path: 'M350,100 L450,90 L550,95 L650,110 L720,130 L750,160 L740,200 L700,210 L650,200 L600,190 L550,185 L500,180 L450,175 L400,170 L350,165 L320,150 L330,120 Z'
  },
  liaoning: {
    name: '辽宁',
    center: [720, 200],
    path: 'M700,170 L740,165 L760,180 L765,210 L755,240 L735,250 L715,240 L705,220 L700,200 Z'
  },
  jilin: {
    name: '吉林',
    center: [760, 160],
    path: 'M740,120 L790,115 L810,130 L815,160 L805,190 L785,200 L765,190 L755,170 L745,150 Z'
  },
  heilongjiang: {
    name: '黑龙江',
    center: [750, 90],
    path: 'M680,40 L750,30 L820,35 L860,50 L870,80 L860,110 L840,130 L800,125 L760,120 L720,115 L690,100 L675,80 L670,60 Z'
  },
  shanghai: {
    name: '上海',
    center: [760, 330],
    path: 'M755,320 L775,320 L780,330 L775,340 L760,345 L752,335 Z'
  },
  jiangsu: {
    name: '江苏',
    center: [735, 310],
    path: 'M710,280 L760,275 L785,290 L790,320 L780,345 L755,355 L730,350 L715,335 L710,310 Z'
  },
  zhejiang: {
    name: '浙江',
    center: [755, 360],
    path: 'M730,340 L770,335 L790,350 L795,375 L785,395 L765,405 L745,400 L735,385 L730,365 Z'
  },
  anhui: {
    name: '安徽',
    center: [700, 340],
    path: 'M675,310 L710,305 L725,320 L730,350 L725,380 L705,395 L685,390 L675,370 L670,345 L670,325 Z'
  },
  fujian: {
    name: '福建',
    center: [735, 420],
    path: 'M710,380 L745,375 L760,390 L765,415 L760,440 L745,455 L725,450 L715,435 L710,415 Z'
  },
  jiangxi: {
    name: '江西',
    center: [690, 400],
    path: 'M665,370 L700,365 L720,380 L725,410 L720,435 L700,450 L680,445 L665,430 L660,405 L660,385 Z'
  },
  shandong: {
    name: '山东',
    center: [705, 280],
    path: 'M675,250 L720,245 L745,255 L755,280 L750,305 L730,320 L705,315 L685,305 L675,285 Z'
  },
  henan: {
    name: '河南',
    center: [640, 320],
    path: 'M610,290 L660,285 L685,295 L695,320 L690,345 L670,360 L645,355 L625,345 L615,325 L610,305 Z'
  },
  hubei: {
    name: '湖北',
    center: [640, 380],
    path: 'M615,350 L660,345 L680,360 L685,385 L680,405 L660,415 L640,410 L625,400 L618,385 L615,365 Z'
  },
  hunan: {
    name: '湖南',
    center: [635, 430],
    path: 'M610,400 L650,395 L670,410 L675,435 L670,455 L650,465 L630,460 L615,450 L610,430 L608,415 Z'
  },
  guangdong: {
    name: '广东',
    center: [650, 480],
    path: 'M620,450 L670,445 L695,460 L705,485 L700,510 L680,525 L655,520 L635,510 L625,490 L620,470 Z'
  },
  guangxi: {
    name: '广西',
    center: [590, 470],
    path: 'M560,440 L600,435 L620,450 L625,475 L620,495 L605,510 L585,505 L570,495 L565,480 L560,460 Z'
  },
  hainan: {
    name: '海南',
    center: [610, 540],
    path: 'M590,520 L630,515 L640,530 L635,550 L620,560 L600,555 L592,540 Z'
  },
  chongqing: {
    name: '重庆',
    center: [580, 380],
    path: 'M565,365 L595,360 L605,375 L605,390 L595,400 L580,405 L570,395 L565,385 Z'
  },
  sichuan: {
    name: '四川',
    center: [500, 380],
    path: 'M450,340 L520,330 L560,345 L575,370 L570,400 L550,420 L520,425 L490,420 L465,410 L455,390 L450,365 Z'
  },
  guizhou: {
    name: '贵州',
    center: [560, 430],
    path: 'M540,410 L580,405 L595,420 L600,440 L595,455 L580,465 L560,460 L545,450 L540,435 Z'
  },
  yunnan: {
    name: '云南',
    center: [500, 480],
    path: 'M460,440 L520,430 L550,445 L560,470 L555,495 L540,515 L515,520 L490,515 L470,505 L460,485 L458,465 Z'
  },
  xizang: {
    name: '西藏',
    center: [350, 400],
    path: 'M200,350 L300,340 L380,345 L420,360 L430,390 L425,420 L410,440 L380,450 L340,445 L300,440 L260,435 L230,425 L210,410 L200,390 L195,370 Z'
  },
  shaanxi: {
    name: '陕西',
    center: [580, 300],
    path: 'M550,270 L610,265 L625,280 L630,305 L625,325 L610,335 L590,340 L575,335 L565,325 L560,310 L555,290 Z'
  },
  gansu: {
    name: '甘肃',
    center: [480, 280],
    path: 'M420,240 L500,230 L540,240 L555,260 L550,285 L540,300 L520,310 L500,315 L480,310 L465,300 L450,290 L440,275 L435,260 L430,250 Z'
  },
  qinghai: {
    name: '青海',
    center: [420, 330],
    path: 'M380,300 L450,290 L470,305 L475,330 L470,350 L455,365 L435,370 L415,365 L400,355 L390,340 L385,325 Z'
  },
  ningxia: {
    name: '宁夏',
    center: [555, 270],
    path: 'M545,260 L565,258 L570,270 L568,280 L555,282 L548,275 Z'
  },
  xinjiang: {
    name: '新疆',
    center: [250, 220],
    path: 'M100,150 L200,140 L300,145 L380,160 L400,190 L395,220 L385,250 L370,270 L350,280 L320,285 L280,283 L240,280 L200,275 L160,270 L130,260 L110,245 L100,220 L95,190 L95,170 Z'
  },
  taiwan: {
    name: '台湾',
    center: [780, 460],
    path: 'M770,430 L790,428 L800,445 L802,465 L798,485 L790,495 L780,490 L775,480 L772,465 L770,450 Z'
  },
  xianggang: {
    name: '香港',
    center: [675, 505],
    path: 'M672,500 L682,498 L685,505 L682,510 L675,512 L670,508 Z'
  },
  aomen: {
    name: '澳门',
    center: [665, 508],
    path: 'M662,505 L670,503 L672,508 L670,512 L665,513 L660,510 Z'
  }
}

// 省份基础色调
const provinceColors: Record<string, string> = {
  beijing: '#ef4444',
  tianjin: '#f97316',
  hebei: '#f59e0b',
  shanxi: '#eab308',
  neimenggu: '#84cc16',
  liaoning: '#22c55e',
  jilin: '#10b981',
  heilongjiang: '#14b8a6',
  shanghai: '#06b6d4',
  jiangsu: '#0ea5e9',
  zhejiang: '#3b82f6',
  anhui: '#6366f1',
  fujian: '#8b5cf6',
  jiangxi: '#a855f7',
  shandong: '#d946ef',
  henan: '#ec4899',
  hubei: '#f43f5e',
  hunan: '#fb7185',
  guangdong: '#fca5a5',
  guangxi: '#fdba74',
  hainan: '#fcd34d',
  chongqing: '#bef264',
  sichuan: '#86efac',
  guizhou: '#6ee7b7',
  yunnan: '#5eead4',
  xizang: '#7dd3fc',
  shaanxi: '#93c5fd',
  gansu: '#a5b4fc',
  qinghai: '#c4b5fd',
  ningxia: '#d8b4fe',
  xinjiang: '#f0abfc',
  taiwan: '#fda4af',
  xianggang: '#cbd5e1',
  aomen: '#94a3b8'
}

interface ChinaMapProps {
  locations: TravelLocation[]
  onLocationClick: (location: TravelLocation) => void
  onLocationHover: (locationId: string | null) => void
  hoveredLocation: string | null
  height?: number
}

export function ChinaMap({
  locations,
  onLocationClick,
  onLocationHover,
  hoveredLocation,
  height = 500
}: ChinaMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [hoveredProvince, setHoveredProvince] = useState<string | null>(null)

  // 将地点坐标映射到地图坐标系
  const getMapPosition = (x: number, y: number): [number, number] => {
    // x: 0-100 (经度 73°E-135°E), y: 0-100 (纬度 18°N-54°N)
    // 地图范围：x: 50-850, y: 50-550
    const mapX = 50 + (x / 100) * 800
    const mapY = 50 + ((100 - y) / 100) * 500
    return [mapX, mapY]
  }

  // 查找地点所属的省份
  const getLocationProvince = (location: TravelLocation): string | null => {
    const [mapX, mapY] = getMapPosition(location.x, location.y)
    
    // 简单的距离检测，找到最近的省份中心
    let closestProvince: string | null = null
    let minDistance = Infinity
    
    Object.entries(provincePaths).forEach(([key, province]) => {
      const [px, py] = province.center
      const distance = Math.sqrt(Math.pow(mapX - px, 2) + Math.pow(mapY - py, 2))
      if (distance < minDistance && distance < 80) {
        minDistance = distance
        closestProvince = key
      }
    })
    
    return closestProvince
  }

  // 鼠标拖拽处理
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.target === containerRef.current || (e.target as HTMLElement).tagName === 'svg') {
      setIsDragging(true)
      setDragStart({ x: e.clientX - transform.x, y: e.clientY - transform.y })
    }
  }, [transform.x, transform.y])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging) {
      setTransform(prev => ({
        ...prev,
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      }))
    }
  }, [isDragging, dragStart])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  // 滚轮缩放
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? 0.9 : 1.1
    const newScale = Math.min(Math.max(transform.scale * delta, 0.5), 4)
    setTransform(prev => ({ ...prev, scale: newScale }))
  }, [transform.scale])

  // 触摸支持
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true)
      setDragStart({
        x: e.touches[0].clientX - transform.x,
        y: e.touches[0].clientY - transform.y
      })
    }
  }, [transform.x, transform.y])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (isDragging && e.touches.length === 1) {
      setTransform(prev => ({
        ...prev,
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y
      }))
    }
  }, [isDragging, dragStart])

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false)
  }, [])

  // 双击重置
  const handleDoubleClick = useCallback(() => {
    setTransform({ x: 0, y: 0, scale: 1 })
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden rounded-xl cursor-grab active:cursor-grabbing"
      style={{ 
        height,
        background: 'linear-gradient(135deg, rgba(13, 17, 23, 0.6) 0%, rgba(6, 9, 16, 0.8) 100%)'
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onDoubleClick={handleDoubleClick}
    >
      {/* 背景网格 */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(139, 92, 246, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139, 92, 246, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />

      {/* 地图容器 */}
      <svg
        viewBox="0 0 900 600"
        className="w-full h-full"
        style={{
          transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
          transformOrigin: 'center center',
          transition: isDragging ? 'none' : 'transform 0.1s ease-out'
        }}
      >
        <defs>
          {/* 发光滤镜 */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          
          {/* 省份渐变 */}
          {Object.entries(provinceColors).map(([key, color]) => (
            <linearGradient key={key} id={`grad-${key}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="0.15" />
              <stop offset="100%" stopColor={color} stopOpacity="0.05" />
            </linearGradient>
          ))}
        </defs>

        {/* 省份 */}
        {Object.entries(provincePaths).map(([key, province]) => {
          const hasLocation = locations.some(loc => getLocationProvince(loc) === key)
          const isHovered = hoveredProvince === key
          
          return (
            <motion.path
              key={key}
              d={province.path}
              fill={`url(#grad-${key})`}
              stroke={isHovered ? provinceColors[key] : 'rgba(139, 92, 246, 0.3)'}
              strokeWidth={isHovered ? 2 : 1}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                fillOpacity: hasLocation ? 0.8 : 0.4
              }}
              transition={{ duration: 0.3, delay: Math.random() * 0.3 }}
              onMouseEnter={() => setHoveredProvince(key)}
              onMouseLeave={() => setHoveredProvince(null)}
              style={{
                cursor: 'pointer',
                filter: isHovered ? 'brightness(1.2)' : 'none'
              }}
            />
          )
        })}

        {/* 地点标记 */}
        {locations.map((location, index) => {
          const [x, y] = getMapPosition(location.x, location.y)
          const isHovered = hoveredLocation === location.id
          
          return (
            <g key={location.id}>
              {/* 脉冲环动画 */}
              <motion.circle
                cx={x}
                cy={y}
                r={15}
                fill="none"
                stroke={location.color}
                strokeWidth={2}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ 
                  opacity: [0.6, 0],
                  scale: [1, 2.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: index * 0.2
                }}
              />
              
              {/* 外圈 */}
              <motion.circle
                cx={x}
                cy={y}
                r={isHovered ? 12 : 8}
                fill={`${location.color}30`}
                stroke={location.color}
                strokeWidth={2}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.5 + index * 0.1 }}
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => onLocationHover(location.id)}
                onMouseLeave={() => onLocationHover(null)}
                onClick={(e) => {
                  e.stopPropagation()
                  onLocationClick(location)
                }}
              />
              
              {/* 内核 */}
              <motion.circle
                cx={x}
                cy={y}
                r={isHovered ? 6 : 4}
                fill={location.color}
                filter="url(#glow)"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.6 + index * 0.1 }}
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => onLocationHover(location.id)}
                onMouseLeave={() => onLocationHover(null)}
                onClick={(e) => {
                  e.stopPropagation()
                  onLocationClick(location)
                }}
              />
            </g>
          )
        })}
      </svg>

      {/* 悬停提示 */}
      <AnimatePresence>
        {hoveredProvince && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-4 left-4 px-3 py-2 rounded-lg text-sm font-medium pointer-events-none"
            style={{
              background: 'rgba(19, 25, 34, 0.9)',
              backdropFilter: 'blur(8px)',
              border: `1px solid ${provinceColors[hoveredProvince]}40`,
              color: '#e2e8f0'
            }}
          >
            {provincePaths[hoveredProvince].name}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 缩放控制 */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
        <button
          onClick={() => setTransform(prev => ({ ...prev, scale: Math.min(prev.scale * 1.2, 4) }))}
          className="w-8 h-8 rounded-lg bg-card/80 backdrop-blur-sm border border-border/50 flex items-center justify-center text-text hover:bg-card hover:border-primary/50 transition-all"
        >
          +
        </button>
        <button
          onClick={() => setTransform(prev => ({ ...prev, scale: Math.max(prev.scale * 0.8, 0.5) }))}
          className="w-8 h-8 rounded-lg bg-card/80 backdrop-blur-sm border border-border/50 flex items-center justify-center text-text hover:bg-card hover:border-primary/50 transition-all"
        >
          −
        </button>
        <button
          onClick={() => setTransform({ x: 0, y: 0, scale: 1 })}
          className="w-8 h-8 rounded-lg bg-card/80 backdrop-blur-sm border border-border/50 flex items-center justify-center text-text hover:bg-card hover:border-primary/50 transition-all"
          title="重置视图"
        >
          ⌖
        </button>
      </div>

      {/* 操作提示 - 移动端和电脑端都显示完整文字 */}
      <div className="absolute bottom-3 left-3 flex items-center gap-1.5 sm:gap-2 text-[9px] sm:text-[10px] text-gray-500 bg-white/80 backdrop-blur-sm px-2 py-1.5 sm:px-2.5 rounded-lg border border-gray-200 shadow-sm">
        <span className="flex items-center gap-0.5 sm:gap-1">
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary/70">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          <span>滚轮缩放</span>
        </span>
        <span className="w-px h-2 bg-gray-300" />
        <span className="flex items-center gap-0.5 sm:gap-1">
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent/70">
            <path d="M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
          </svg>
          <span>拖拽平移</span>
        </span>
        <span className="w-px h-2 bg-gray-300" />
        <span className="flex items-center gap-0.5 sm:gap-1">
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-rose/70">
            <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
          </svg>
          <span>双击重置</span>
        </span>
      </div>
    </div>
  )
}

export default ChinaMap
