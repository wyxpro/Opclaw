import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { TravelLocation } from '../data/mock'

interface ChinaMapProps {
  locations: TravelLocation[]
  onLocationClick: (location: TravelLocation) => void
  onLocationHover: (locationId: string | null) => void
  hoveredLocation: string | null
  height?: number
  mapStyle?: string
}

// 辅助函数：将百分比坐标转换为经纬度
// 这里的转换基于原有的 SVG 地图逻辑，为了保持数据兼容性
// 原逻辑: x: 0-100 -> 经度 73°E-135°E, y: 0-100 -> 纬度 18°N-54°N
const getLngLat = (location: TravelLocation): [number, number] => {
  if (location.lng !== undefined && location.lat !== undefined) {
    return [location.lng, location.lat]
  }
  // 兼容旧数据：x -> 经度，y -> 纬度 (翻转 y 以符合地图坐标系)
  const lng = 73 + (location.x / 100) * (135 - 73)
  const lat = 54 - (location.y / 100) * (54 - 18)
  return [lng, lat]
}

export function ChinaMap({
  locations,
  onLocationClick,
  onLocationHover,
  hoveredLocation,
  height = 500,
  mapStyle = 'amap://styles/darkblue'
}: ChinaMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const markersRef = useRef<Record<string, any>>({})
  const [isMapLoaded, setIsMapLoaded] = useState(false)

  // 初始化地图
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return

    const initMap = () => {
      if (typeof window.AMap === 'undefined') {
        setTimeout(initMap, 100)
        return
      }

      const map = new window.AMap.Map(mapContainerRef.current, {
        zoom: 4,
        center: [105, 34],
        viewMode: '2D',
        mapStyle: mapStyle,
        resizeEnable: true,
      })

      map.on('complete', () => {
        setIsMapLoaded(true)
      })

      mapRef.current = map
    }

    initMap()

    return () => {
      if (mapRef.current) {
        mapRef.current.destroy()
        mapRef.current = null
      }
    }
  }, [])

  // 监听地图主题切换
  useEffect(() => {
    if (mapRef.current && isMapLoaded) {
      mapRef.current.setMapStyle(mapStyle)
    }
  }, [mapStyle, isMapLoaded])

  // 处理标记点
  useEffect(() => {
    if (!isMapLoaded || !mapRef.current) return

    const map = mapRef.current

    // 清理旧标记（如果需要）
    // 这里我们只更新变化的标记以提高性能
    const currentLocationIds = new Set(locations.map(loc => loc.id))
    Object.keys(markersRef.current).forEach(id => {
      if (!currentLocationIds.has(id)) {
        markersRef.current[id].setMap(null)
        delete markersRef.current[id]
      }
    })

    locations.forEach((location, index) => {
      const position = getLngLat(location)
      
      if (!markersRef.current[location.id]) {
        // 创建新的标记
        const markerContent = document.createElement('div')
        markerContent.className = 'relative flex items-center justify-center'
        markerContent.style.width = '30px'
        markerContent.style.height = '30px'
        
        // 使用与原版一致的动画效果
        markerContent.innerHTML = `
          <div class="absolute inset-0 rounded-full animate-ping opacity-60" style="background-color: ${location.color}; animation-duration: 2s; animation-delay: ${index * 0.2}s"></div>
          <div class="relative w-3 h-3 rounded-full shadow-lg transition-transform duration-300" style="background-color: ${location.color}; border: 2px solid white; box-shadow: 0 0 10px ${location.color}"></div>
        `

        const marker = new window.AMap.Marker({
          position: position,
          content: markerContent,
          offset: new window.AMap.Pixel(-15, -15),
          extData: location
        })

        marker.on('click', () => {
          onLocationClick(location)
        })

        marker.on('mouseover', () => {
          onLocationHover(location.id)
          const dot = markerContent.querySelector('.relative') as HTMLElement
          if (dot) dot.style.transform = 'scale(1.5)'
        })

        marker.on('mouseout', () => {
          onLocationHover(null)
          const dot = markerContent.querySelector('.relative') as HTMLElement
          if (dot) dot.style.transform = 'scale(1)'
        })

        marker.setMap(map)
        markersRef.current[location.id] = marker
      }
    })
  }, [isMapLoaded, locations, onLocationClick, onLocationHover])

  // 处理悬停状态同步
  useEffect(() => {
    if (!isMapLoaded) return

    Object.entries(markersRef.current).forEach(([id, marker]) => {
      const content = marker.getContent()
      const dot = content.querySelector('.relative') as HTMLElement
      if (dot) {
        if (id === hoveredLocation) {
          dot.style.transform = 'scale(1.5)'
          dot.style.zIndex = '10'
        } else {
          dot.style.transform = 'scale(1)'
          dot.style.zIndex = '1'
        }
      }
    })
  }, [hoveredLocation, isMapLoaded])

  // 地图控制函数
  const zoomIn = () => mapRef.current?.zoomIn()
  const zoomOut = () => mapRef.current?.zoomOut()
  const resetView = () => mapRef.current?.setZoomAndCenter(4, [105, 34])

  return (
    <div
      className="relative w-full overflow-hidden rounded-xl bg-[#0d1117]"
      style={{ height }}
    >
      {/* 地图容器 */}
      <div 
        ref={mapContainerRef} 
        className="w-full h-full"
        onDoubleClick={resetView}
      />

      {/* 覆盖层 - 保持 UI 一致性 */}
      <div className="absolute inset-0 pointer-events-none border border-white/5 rounded-xl shadow-inner" />

      {/* 缩放控制 */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-10">
        <button
          onClick={zoomIn}
          className="w-8 h-8 rounded-lg bg-card/80 backdrop-blur-sm border border-border/50 flex items-center justify-center text-text hover:bg-card hover:border-primary/50 transition-all pointer-events-auto"
        >
          +
        </button>
        <button
          onClick={zoomOut}
          className="w-8 h-8 rounded-lg bg-card/80 backdrop-blur-sm border border-border/50 flex items-center justify-center text-text hover:bg-card hover:border-primary/50 transition-all pointer-events-auto"
        >
          −
        </button>
        <button
          onClick={resetView}
          className="w-8 h-8 rounded-lg bg-card/80 backdrop-blur-sm border border-border/50 flex items-center justify-center text-text hover:bg-card hover:border-primary/50 transition-all pointer-events-auto"
          title="重置视图"
        >
          ⌖
        </button>
      </div>

      {/* 操作提示 */}
      <div className="absolute bottom-3 left-3 flex items-center gap-1.5 sm:gap-2 text-[9px] sm:text-[10px] text-gray-500 bg-white/80 backdrop-blur-sm px-2 py-1.5 sm:px-2.5 rounded-lg border border-gray-200 shadow-sm z-10">
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

      {/* AMap 样式注入 */}
      <style>{`
        .amap-logo, .amap-copyright {
          display: none !important;
        }
        .amap-container {
          background-color: #0d1117 !important;
        }
      `}</style>
    </div>
  )
}

export default ChinaMap
