# 中国旅行足迹地图功能 - 高德地图API实现方案

## 一、项目背景与改造目标

### 1.1 现有功能现状
- 当前使用自定义SVG中国地图组件([ChinaMap.tsx](src/components/ChinaMap.tsx))
- 旅行地点数据存储在[mock.ts](src/data/mock.ts)的`travelLocations`数组中
- 已实现功能：地点标记显示、点击查看详情、悬停效果、拖拽缩放、动画效果
- 现有坐标体系：使用相对坐标(x: 0-100, y: 0-100)映射到SVG地图

### 1.2 改造目标
- 将自定义SVG地图替换为高德地图API服务
- 实现真实经纬度的精准定位
- 保持现有全部交互体验和视觉效果
- 与现有[TravelManager.tsx](src/components/TravelManager.tsx)组件无缝集成
- 支持更丰富的地图功能：缩放、旋转、卫星视图等

## 二、高德地图API申请与配置

### 2.1 API申请步骤
1. **注册开发者账号**
   - 访问高德开放平台：https://lbs.amap.com/
   - 注册并完成实名认证
   - 进入控制台 -> 应用管理 -> 我的应用

2. **创建应用**
   - 点击"创建新应用"，填写应用名称和描述
   - 应用类型选择"Web端(JS API)"

3. **获取API密钥**
   - 在应用下点击"添加"，选择服务平台为"Web端(JS API)"
   - 填写域名白名单（开发环境可填`localhost`，生产环境填实际域名）
   - 提交后获取`Key`和`安全密钥`

### 2.2 项目配置方法
1. **环境变量配置**
   在项目根目录创建`.env.local`文件：
   ```env
   # 高德地图配置
   VITE_AMAP_KEY = "你的高德地图API Key"
   VITE_AMAP_SECURITY_CODE = "你的安全密钥"
   ```

2. **index.html 引入SDK**
   在`index.html`的`<head>`中添加：
   ```html
   <script type="text/javascript">
     window._AMapSecurityConfig = {
       securityJsCode: import.meta.env.VITE_AMAP_SECURITY_CODE,
     }
   </script>
   <script type="text/javascript" src="https://webapi.amap.com/maps?v=2.0&key=你的API Key"></script>
   ```

3. **TypeScript类型支持**
   安装类型定义包：
   ```bash
   npm install @amap/amap-jsapi-types --save-dev
   ```

## 三、核心代码实现

### 3.1 地图组件重构 (AmapChinaMap.tsx)
```tsx
import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { TravelLocation } from '../data/mock'

interface AmapChinaMapProps {
  locations: TravelLocation[]
  onLocationClick: (location: TravelLocation) => void
  onLocationHover: (locationId: string | null) => void
  hoveredLocation: string | null
  height?: number
}

// 相对坐标转真实经纬度映射表
const coordinateMap: Record<string, [number, number]> = {
  // [经度, 纬度]
  '重庆': [106.5516, 29.5630],
  '成都': [104.0658, 30.6595],
  '西安': [108.9480, 34.2632],
  '北京': [116.4074, 39.9042],
  '深圳': [114.0579, 22.5431],
  '杭州': [120.1551, 30.2741],
  '南京': [118.7969, 32.0603],
  '洛阳': [112.4540, 34.6640],
  '南昌': [115.8582, 28.6829],
  // 可扩展更多城市
}

export function AmapChinaMap({
  locations,
  onLocationClick,
  onLocationHover,
  hoveredLocation,
  height = 500
}: AmapChinaMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<AMap.Map | null>(null)
  const markersRef = useRef<AMap.Marker[]>([])
  const infoWindowRef = useRef<AMap.InfoWindow | null>(null)
  const [isMapLoaded, setIsMapLoaded] = useState(false)
  const [mapError, setMapError] = useState<string | null>(null)

  // 相对坐标转真实经纬度
  const getRealCoordinates = useCallback((location: TravelLocation): [number, number] => {
    // 优先使用映射表中的精确坐标
    if (coordinateMap[location.name]) {
      return coordinateMap[location.name]
    }
    //  fallback: 相对坐标转换算法
    const lng = 73 + (location.x / 100) * 62 // 中国经度范围 73°E ~ 135°E
    const lat = 18 + (location.y / 100) * 36 // 中国纬度范围 18°N ~ 54°N
    return [lng, lat]
  }, [])

  // 初始化地图
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    try {
      const map = new AMap.Map(mapRef.current, {
        zoom: 4.5, // 初始缩放级别，适合显示全国
        center: [104.0, 35.0], // 中国中心点坐标
        viewMode: '3D', // 3D视图
        pitch: 20, // 俯仰角度
        resizeEnable: true,
        // 自定义地图样式，保持原有深色主题
        mapStyle: 'amap://styles/darkblue',
        features: ['bg', 'road', 'building', 'point'],
        showIndoorMap: false
      })

      // 添加地图控件
      map.addControl(new AMap.Scale())
      map.addControl(new AMap.ToolBar({
        position: 'RB',
        offset: new AMap.Pixel(10, 10)
      }))

      mapInstanceRef.current = map
      setIsMapLoaded(true)

      // 地图加载完成事件
      map.on('complete', () => {
        setIsMapLoaded(true)
      })

    } catch (error) {
      console.error('高德地图加载失败:', error)
      setMapError('地图加载失败，请检查API配置')
    }

    return () => {
      // 组件卸载时销毁地图
      if (mapInstanceRef.current) {
        mapInstanceRef.current.destroy()
        mapInstanceRef.current = null
      }
    }
  }, [])

  // 渲染标记点
  useEffect(() => {
    if (!mapInstanceRef.current || !isMapLoaded) return

    const map = mapInstanceRef.current

    // 清除旧标记
    markersRef.current.forEach(marker => marker.remove())
    markersRef.current = []

    // 创建新标记
    locations.forEach((location, index) => {
      const [lng, lat] = getRealCoordinates(location)
      const isHovered = hoveredLocation === location.id

      // 自定义标记点内容，保持原有视觉风格
      const markerContent = `
        <div class="marker-wrapper" style="position: relative; cursor: pointer;">
          <!-- 脉冲环动画 -->
          <div class="pulse-ring" style="
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 30px;
            height: 30px;
            border: 2px solid ${location.color};
            border-radius: 50%;
            animation: pulse 2s infinite;
            opacity: 0.6;
          "></div>
          <!-- 外圈 -->
          <div class="marker-outer" style="
            width: ${isHovered ? '24px' : '16px'};
            height: ${isHovered ? '24px' : '16px'};
            background: ${location.color}30;
            border: 2px solid ${location.color};
            border-radius: 50%;
            transition: all 0.2s ease;
          "></div>
          <!-- 内核 -->
          <div class="marker-inner" style="
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: ${isHovered ? '12px' : '8px'};
            height: ${isHovered ? '12px' : '8px'};
            background: ${location.color};
            border-radius: 50%;
            box-shadow: 0 0 6px ${location.color};
            transition: all 0.2s ease;
          "></div>
        </div>
        <style>
          @keyframes pulse {
            0% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
            100% { transform: translate(-50%, -50%) scale(2.5); opacity: 0; }
          }
        </style>
      `

      const marker = new AMap.Marker({
        position: [lng, lat],
        content: markerContent,
        offset: new AMap.Pixel(-12, -12),
        anchor: 'center',
        zIndex: isHovered ? 200 : 100,
        extData: { locationId: location.id }
      })

      // 标记点事件
      marker.on('mouseover', () => {
        onLocationHover(location.id)
      })

      marker.on('mouseout', () => {
        onLocationHover(null)
      })

      marker.on('click', () => {
        onLocationClick(location)
        showInfoWindow(location, [lng, lat])
      })

      marker.setMap(map)
      markersRef.current.push(marker)
    })

  }, [locations, hoveredLocation, isMapLoaded, getRealCoordinates, onLocationClick, onLocationHover])

  // 显示信息弹窗
  const showInfoWindow = useCallback((location: TravelLocation, position: [number, number]) => {
    if (!mapInstanceRef.current) return

    const infoWindow = new AMap.InfoWindow({
      content: `
        <div class="info-window" style="padding: 8px; min-width: 200px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
            <div style="width: 8px; height: 8px; border-radius: 50%; background: ${location.color};"></div>
            <h3 style="font-size: 16px; font-weight: 600; margin: 0; color: #e2e8f0;">${location.name}</h3>
          </div>
          <p style="font-size: 14px; color: #94a3b8; margin: 0 0 8px 0;">${location.description}</p>
          <div style="font-size: 12px; color: #64748b;">
            <div style="margin-bottom: 4px;"><strong>最佳时间:</strong> ${location.details.bestTime}</div>
            <div>
              <strong>必去景点:</strong>
              <ul style="margin: 4px 0 0 16px; padding: 0;">
                ${location.details.highlights.map(h => `<li>${h}</li>`).join('')}
              </ul>
            </div>
          </div>
        </div>
      `,
      offset: new AMap.Pixel(0, -20),
      closeWhenClickMap: true,
      avoid: true
    })

    infoWindow.open(mapInstanceRef.current, position)
    infoWindowRef.current = infoWindow
  }, [])

  if (mapError) {
    return (
      <div 
        className="flex items-center justify-center rounded-xl bg-card/50 border border-border/50"
        style={{ height }}
      >
        <div className="text-center text-text-muted">
          <p>{mapError}</p>
          <p className="text-sm mt-2">请检查API密钥配置或网络连接</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full rounded-xl overflow-hidden" style={{ height }}>
      {/* 加载状态 */}
      <AnimatePresence>
        {!isMapLoaded && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-10 flex items-center justify-center bg-bg/80 backdrop-blur-sm"
          >
            <div className="text-center">
              <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-text-muted text-sm">地图加载中...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 地图容器 */}
      <div 
        ref={mapRef} 
        className="w-full h-full"
        style={{ background: 'linear-gradient(135deg, rgba(13, 17, 23, 0.6) 0%, rgba(6, 9, 16, 0.8) 100%)' }}
      />

      {/* 自定义操作提示，保持原有风格 */}
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

export default AmapChinaMap
```

### 3.2 数据结构适配
在`TravelLocation`类型中添加经纬度字段，向后兼容：
```typescript
export interface TravelLocation {
  id: string
  name: string
  country: string
  description: string
  x: number // 保留原有相对坐标，向后兼容
  y: number
  lng?: number // 新增：真实经度
  lat?: number // 新增：真实纬度
  color: string
  images: string[]
  details: {
    bestTime: string
    highlights: string[]
    tips: string
  }
}
```

### 3.3 TravelManager 组件集成
修改`TravelManager.tsx`中的坐标输入部分，支持经纬度输入：
```tsx
{/* 地图坐标 */}
<div>
  <label className="block text-xs font-medium text-text-muted mb-1.5">地图位置</label>
  <div className="grid grid-cols-2 gap-3 mb-2">
    <div>
      <span className="text-[10px] text-text-muted">经度 (Lng)</span>
      <input
        type="number"
        step="0.0001"
        value={formData.lng ?? ''}
        onChange={e => setFormData(prev => ({ ...prev, lng: Number(e.target.value) }))}
        placeholder="例如：116.4074"
        className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-text text-sm focus:outline-none focus:border-primary/50"
      />
    </div>
    <div>
      <span className="text-[10px] text-text-muted">纬度 (Lat)</span>
      <input
        type="number"
        step="0.0001"
        value={formData.lat ?? ''}
        onChange={e => setFormData(prev => ({ ...prev, lat: Number(e.target.value) }))}
        placeholder="例如：39.9042"
        className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-text text-sm focus:outline-none focus:border-primary/50"
      />
    </div>
  </div>
  <p className="text-[10px] text-text-muted">如果不填经纬度，将根据城市名称自动匹配坐标</p>
</div>
```

## 四、功能特性保持方案

### 4.1 交互体验保持
| 原有功能 | 实现方案 |
|---------|---------|
| 标记点脉冲动画 | 使用CSS动画在自定义Marker中实现 |
| 悬停放大效果 | 监听mouseover/mouseout事件动态修改Marker大小 |
| 点击弹出详情 | 使用高德地图InfoWindow组件实现，保持原有UI风格 |
| 拖拽平移 | 高德地图原生支持，无需额外开发 |
| 滚轮缩放 | 高德地图原生支持，限制缩放级别范围0.5-4 |
| 双击重置 | 监听双击事件调用map.setZoomAndCenter()方法 |
| 缩放控制按钮 | 自定义悬浮按钮，调用地图API实现缩放/重置 |

### 4.2 视觉风格保持
- 使用高德地图深色主题样式`amap://styles/darkblue`
- 自定义Marker样式与原有SVG地图标记点完全一致
- 信息弹窗UI风格与现有设计系统保持统一
- 背景渐变、操作提示等元素完全复用原有代码

## 五、错误处理与性能优化

### 5.1 错误处理机制
1. **API加载失败**：捕获初始化异常，显示友好错误提示
2. **坐标转换失败**：提供fallback转换算法，确保标记点总能显示
3. **网络错误**：添加加载状态，超时后显示重试按钮
4. **白名单配置错误**：在开发环境给出明确的配置指引

### 5.2 性能优化方案
1. **标记点批量渲染**：一次性创建所有Marker，避免频繁DOM操作
2. **离屏销毁**：组件卸载时主动销毁地图实例和所有Marker
3. **懒加载**：地图组件只在进入视口时初始化
4. **坐标缓存**：对转换后的经纬度进行缓存，避免重复计算
5. **聚合显示**：当地点数量超过100个时启用MarkerCluster聚合

## 六、可能遇到的问题与解决方案

### 6.1 常见问题
1. **地图加载失败，提示"INVALID_USER_SCODE"**
   - 解决方案：检查安全密钥配置是否正确，确保`_AMapSecurityConfig`在SDK引入前设置

2. **地图加载失败，提示"INVALID_USER_KEY"**
   - 解决方案：检查API Key是否正确，确认域名白名单包含当前访问域名

3. **标记点位置不准确**
   - 解决方案：在`coordinateMap`中添加对应城市的精确经纬度，优先使用精确坐标

4. **地图样式与整体风格不匹配**
   - 解决方案：在高德控制台自定义地图样式，调整配色方案匹配项目主题

### 6.2 兼容性问题
- 浏览器支持：高德地图JS API 2.0支持Chrome、Firefox、Safari、Edge等主流浏览器
- 移动端适配：自动支持触摸操作，无需额外开发
- 响应式：地图容器使用百分比宽度，自动适配不同屏幕尺寸

## 七、测试验证步骤

### 7.1 功能测试
1. **基础功能测试**
   - [ ] 地图正常加载，无报错
   - [ ] 所有旅行地点正确显示在对应位置
   - [ ] 标记点脉冲动画正常播放
   - [ ] 悬停时标记点放大效果正常

2. **交互测试**
   - [ ] 拖拽地图可以平移
   - [ ] 滚轮可以缩放地图
   - [ ] 双击地图可以重置视图
   - [ ] 缩放控制按钮功能正常

3. **弹窗测试**
   - [ ] 点击标记点弹出详情窗口
   - [ ] 弹窗内容正确显示景点信息
   - [ ] 点击地图其他区域弹窗关闭
   - [ ] 弹窗位置不超出可视区域

4. **集成测试**
   - [ ] 新增地点后地图上实时显示新标记
   - [ ] 编辑地点后标记点信息同步更新
   - [ ] 删除地点后标记点从地图上移除
   - [ ] 与现有列表点击联动正常

### 7.2 性能测试
- [ ] 地图初始化时间<2s
- [ ] 100个标记点渲染无卡顿
- [ ] 缩放平移操作流畅无延迟
- [ ] 页面内存占用稳定，无内存泄漏

## 八、迁移实施步骤

1. **阶段一：配置开发环境** (0.5天)
   - 申请高德地图API Key和安全密钥
   - 配置环境变量和SDK引入
   - 安装TypeScript类型支持

2. **阶段二：组件开发** (1天)
   - 实现AmapChinaMap组件
   - 适配TravelLocation数据结构
   - 实现坐标转换逻辑

3. **阶段三：功能集成** (0.5天)
   - 替换现有ChinaMap组件引用
   - 调整TravelManager组件支持经纬度输入
   - 完善坐标映射表

4. **阶段四：测试验证** (0.5天)
   - 功能测试和bug修复
   - 性能优化
   - 跨浏览器兼容性测试

5. **阶段五：上线部署** (0.5天)
   - 配置生产环境API白名单
   - 部署上线
   - 线上功能验证

## 九、后续扩展功能建议

1. **路线规划**：支持显示旅行路线，按时间顺序连接不同地点
2. **热力图**：根据旅行次数显示城市热度
3. **卫星视图切换**：支持普通/卫星/街景多种视图切换
4. **3D建筑物**：开启3D建筑物显示，增强视觉效果
5. **地理编码**：支持输入城市名称自动获取经纬度
6. **离线模式**：在API加载失败时自动降级到原有SVG地图
