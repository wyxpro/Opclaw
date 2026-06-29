# Live2D 数字人卡通形象与配置管理集成指南

本指南详细介绍了如何将 Live2D 卡通数字人模型、实时语音合成（TTS）口型唇形同步、鼠标视线联动、呼吸与眨眼混合、以及数字人参数配置面板（包含基础设置、语音识别、语音合成、AI 智能体等模块）深度集成进当前的 React + Vite 项目。

---

## 1. 资源与目录准备

我们已将所有必要的 Live2D 核心代码与静态资源移动到当前项目的目标路径：
- **Live2D 引擎核心与 Framework**: 已复制到 `src/lib/live2d/`，包含 `Core`、`Framework` 和 `live2dManager.ts`。
- **内置 Live2D 模型资源**: 已复制到 `public/sentio/` 目录下（含 `core/live2dcubismcore.min.js` 和 `characters/free/` 中的 12 个卡通模型数据）。
- **协议与常量接口**: `src/lib/protocol.ts` 与 `src/lib/constants.ts` 已经准备就绪。
- **状态存储**: `src/lib/sentioStore.ts` 已经就绪。

### 1.1 安装依赖项
我们需要安装 Zustand 状态管理库。请在命令行运行：
```bash
npm install zustand
```

---

## 2. 编译与构建配置 (Vite + TypeScript)

因为 Live2D Framework 原先使用的是 Next.js 的别名配置，我们需要在当前 Vite 项目中适配别名映射，以便在不修改 Live2D 核心库大量导入语句的前提下完成无缝编译。

### 2.1 修改 `tsconfig.app.json`
在 `compilerOptions` 节点中增加路径别名映射：

```json
{
  "compilerOptions": {
    // ... 原有配置保持不变
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@framework/*": ["src/lib/live2d/Framework/src/*"],
      "@live2dCore/*": ["src/lib/live2d/Core/*"]
    }
  }
}
```

### 2.2 修改 `vite.config.ts`
在 `vite.config.ts` 中配置 resolve alias，使其与 TypeScript 的别名保持一致：

```typescript
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path' // 导入 node.js path 模块

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@framework': path.resolve(__dirname, './src/lib/live2d/Framework/src'),
        '@live2dCore': path.resolve(__dirname, './src/lib/live2d/Core')
      }
    },
    // ... 原有配置保持不变
  }
})
```

### 2.3 在 `index.html` 引入 Live2D 核心运行时
在 `index.html` 的 `<head>` 标签中添加 `<script>`，加载 `live2dcubismcore` 运行时文件：

```html
<script src="/sentio/core/live2dcubismcore.min.js"></script>
```

---

## 3. 核心代码适配与适配器修复

### 3.1 修复 Web 端浏览器兼容的路径读取
在 `src/lib/live2d/src/lapplive2dmanager.ts` 中，原代码通过 `import * as path from 'path'` 引入了 Node.js 原生的 `path` 库，在浏览器端构建时会报错。我们应当使用浏览器原生安全的 URL 字符串分割法将其替换。

**代码修改目标** (`src/lib/live2d/src/lapplive2dmanager.ts`):
```typescript
// 1. 删除此行：
// import * as path from 'path';

// 2. 将 changeCharacter 方法中的：
// let dir = path.dirname(character.link) + "/";
// 替换为原生安全的辅助逻辑：
public changeCharacter(character: ResourceModel | null) {
  if (character == null) {
    this.releaseAllModel();
    return;
  }
  
  // 原生安全路径解析
  const getDirname = (link: string): string => {
    const parts = link.split('/');
    parts.pop();
    return parts.join('/') + '/';
  };
  
  let dir = getDirname(character.link);
  let modelJsonName: string = `${character.name}.model3.json`;
  
  if (LAppDefine.DebugLogEnable) {
    LAppPal.printMessage(`[APP]model json: ${modelJsonName}`);
  }

  this.releaseAllModel();
  const instance = new LAppModel();
  instance.setSubdelegate(this._subdelegate);
  instance.loadAssets(dir, modelJsonName);
  this._models.pushBack(instance);
  this._character = character;
}
```

### 3.2 增加音频转码服务 (MP3 to WAV)
SiliconFlow 语音合成（TTS）接口输出格式为 MP3，而 Live2D 唇形口型驱动（`WavFileHandler`）需要分析 PCM 原始数据振幅（RMS）来算出开口度，必须输入含有 WAV Header 的 WAV 格式音频。

我们在项目中创建工具文件 `src/lib/audioUtils.ts` 用以执行高效的解码转码工作：

```typescript
/**
 * 将 MP3 ArrayBuffer 解码并重构成 WAV ArrayBuffer 以便 Live2D 音频振幅分析
 */
export const convertMp3ArrayBufferToWavArrayBuffer = async (mp3ArrayBuffer: ArrayBuffer): Promise<ArrayBuffer> => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const audioBuffer = await audioContext.decodeAudioData(mp3ArrayBuffer);

  const numberOfChannels = audioBuffer.numberOfChannels;
  const sampleRate = audioBuffer.sampleRate;
  const channelData: Int16Array[] = [];

  for (let i = 0; i < numberOfChannels; i++) {
    const data = audioBuffer.getChannelData(i);
    const int16Data = new Int16Array(data.length);
    for (let j = 0; j < data.length; j++) {
      // 限制振幅并转换为 16-bit PCM
      int16Data[j] = Math.round(Math.max(-1, Math.min(1, data[j])) * 32767);
    }
    channelData.push(int16Data);
  }

  // 构造 44 字节 WAV 文件头
  const wavHeader = new ArrayBuffer(44);
  const view = new DataView(wavHeader);

  // RIFF 头
  const writeString = (v: DataView, offset: number, str: string) => {
    for (let k = 0; k < str.length; k++) {
      v.setUint8(offset + k, str.charCodeAt(k));
    }
  };

  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + channelData[0].length * 2 * numberOfChannels, true);
  writeString(view, 8, 'WAVE');

  // fmt 子块
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM 格式
  view.setUint16(22, numberOfChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2 * numberOfChannels, true); // ByteRate
  view.setUint16(32, 2 * numberOfChannels, true); // BlockAlign
  view.setUint16(34, 16, true); // BitDepth

  // data 子块
  writeString(view, 36, 'data');
  view.setUint32(40, channelData[0].length * 2 * numberOfChannels, true);

  // 合并头与音频数据
  const wavData = new Uint8Array(wavHeader.byteLength + channelData[0].length * 2 * numberOfChannels);
  wavData.set(new Uint8Array(wavHeader), 0);

  let offset = wavHeader.byteLength;
  for (let i = 0; i < channelData[0].length; i++) {
    for (let j = 0; j < numberOfChannels; j++) {
      wavData[offset++] = channelData[j][i] & 0xFF;
      wavData[offset++] = (channelData[j][i] >> 8) & 0xFF;
    }
  }

  return wavData.buffer;
};
```

---

## 4. Live2D 渲染组件实现与对接

### 4.1 创建 `Live2DCanvas.tsx` 组件
我们在 `src/components/ai/` 目录下新建 `Live2DCanvas.tsx`，用于挂载 WebGL 画布并管理 `LAppDelegate` 单例周期：

```tsx
import { useEffect, useState } from 'react'
import { LAppDelegate } from '../../lib/live2d/src/lappdelegate'
import { Live2dManager } from '../../lib/live2d/live2dManager'
import type { AvatarModel } from './types'

interface Live2DCanvasProps {
  currentAvatar: AvatarModel
  isSpeaking: boolean
}

export function Live2DCanvas({ currentAvatar, isSpeaking }: Live2DCanvasProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // 1. 初始化 Live2D 代理
    const canvas = document.getElementById('live2dCanvas')
    if (!canvas) return

    const success = LAppDelegate.getInstance().initialize()
    if (success) {
      LAppDelegate.getInstance().run()
      setIsLoaded(true)
    }

    // 2. 监听窗口变化以重绘 Canvas
    const handleResize = () => {
      LAppDelegate.getInstance().onResize()
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      LAppDelegate.releaseInstance()
    }
  }, [])

  // 3. 当选中的分身发生变化时，载入对应模型
  useEffect(() => {
    if (!isLoaded) return

    if (currentAvatar && currentAvatar.type === 'live2d') {
      const resourceModel = {
        resource_id: currentAvatar.id,
        name: currentAvatar.modelName || 'Hiyori',
        type: 'character' as any,
        link: currentAvatar.modelPath || `/sentio/characters/free/${currentAvatar.modelName}/${currentAvatar.modelName}.model3.json`
      }
      Live2dManager.getInstance().changeCharacter(resourceModel)
    }
  }, [currentAvatar, isLoaded])

  // 4. 音频断流时清空唇形状态
  useEffect(() => {
    if (!isSpeaking) {
      Live2dManager.getInstance().clearAudioQueue()
    }
  }, [isSpeaking])

  return (
    <div className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-auto">
      <canvas
        id="live2dCanvas"
        className="w-full h-full bg-transparent"
        style={{ outline: 'none' }}
      />
      {!isLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 backdrop-blur-sm z-10 text-white font-bold gap-3">
          <div className="w-8 h-8 rounded-full border-4 border-indigo-400 border-t-transparent animate-spin" />
          <span className="text-sm">加载 Live2D 模型中...</span>
        </div>
      )}
    </div>
  )
}
```

### 4.2 在 `Character3D.tsx` 中挂载 `Live2DCanvas`
我们需要让 3D 渲染容器感知 Live2D 形象的选中，并展示 WebGL Canvas。

**文件修改点** (`src/components/ai/Character3D.tsx`):
```tsx
// 1. 引入组件
import { Live2DCanvas } from './Live2DCanvas'

// ...在 Character3DProps 中声明类型：
interface Character3DProps {
  style: CharacterStyle
  currentMessage?: Message
  background?: string
  onStyleChange?: (style: CharacterStyle) => void
  onBackgroundChange?: (background: string) => void
  isMobileVoiceUI?: boolean
  customAvatar?: { 
    type: 'image' | 'video' | 'custom' | 'live2d', // 增加 live2d 类型
    url: string, 
    style?: string,
    modelName?: string,
    modelPath?: string 
  } | null
  isSpeaking?: boolean
}

// 2. 在渲染结构 (JSX) 中，优先渲染 Live2DCanvas:
return (
  <div className="h-full w-full relative overflow-hidden" style={getBackgroundStyle()}>
    {/* ... 其他背景视频渲染逻辑 */}
    
    {customAvatar?.type === 'live2d' ? (
      <Live2DCanvas 
        currentAvatar={customAvatar as any} 
        isSpeaking={externalIsSpeaking || false} 
      />
    ) : (
      // ... 原有 Realistic & Cartoon 占位图形及自定义图片/视频渲染逻辑保持不变
    )}
  </div>
)
```

---

## 5. TTS 语音实时合成唇形同步对接

当 SiliconFlow TTS 生成语音后，我们需要拦截标准音频播放，将其转换并传入 Live2D 口型控制中心。

**文件修改点** (`src/services/ttsService.ts`):
```typescript
import { Live2dManager } from '../lib/live2d/live2dManager'
import { convertMp3ArrayBufferToWavArrayBuffer } from '../lib/audioUtils'

export class TTSService {
  private audio: HTMLAudioElement | null = null
  private isPlaying: boolean = false
  // 缓存音频元素上下文供外界监听
  private live2dAudioInterval: any = null

  async speak(
    text: string, 
    voiceModel?: VoiceModel | null, 
    onStart?: () => void, 
    onEnd?: () => void,
    isLive2dActive?: boolean // 新增是否为 Live2D 激活状态
  ): Promise<void> {
    const apiKey = import.meta.env.VITE_SILICON_FLOW_API_KEY
    if (!apiKey) {
      console.error('Silicon Flow API Key not found')
      return
    }

    this.stop()

    try {
      const cleanText = text.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '').trim()
      if (!cleanText) return

      const requestBody: any = {
        model: 'fnlp/MOSS-TTSD-v0.5',
        input: cleanText,
        response_format: 'mp3',
        stream: false,
        speed: 1.1
      }

      // ... 音色选择与克隆判断保持一致
      
      const response = await fetch('https://api.siliconflow.cn/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      })

      if (!response.ok) {
        throw new Error(`TTS request failed: ${response.status}`)
      }

      const audioBlob = await response.blob()

      if (isLive2dActive) {
        // =============== LIVE2D 口型同步核心适配 ===============
        const mp3ArrayBuffer = await audioBlob.arrayBuffer();
        // 1. 将 MP3 转为 WAV PCM 格式以进行振幅解析
        const wavArrayBuffer = await convertMp3ArrayBufferToWavArrayBuffer(mp3ArrayBuffer);
        
        // 2. 将音频载入 Live2D 口型队列
        Live2dManager.getInstance().pushAudioQueue(wavArrayBuffer);
        
        this.isPlaying = true;
        if (onStart) onStart();

        // 3. 定时检测 Live2D 播放器状态以模拟 onEnd 事件
        this.live2dAudioInterval = setInterval(() => {
          if (!Live2dManager.getInstance().isAudioPlaying()) {
            clearInterval(this.live2dAudioInterval);
            this.isPlaying = false;
            if (onEnd) onEnd();
          }
        }, 150);

      } else {
        // =============== 标准多媒体播放路径 ===============
        const audioUrl = URL.createObjectURL(audioBlob)
        this.audio = new Audio(audioUrl)
        this.isPlaying = true
        if (onStart) onStart()

        this.audio.onended = () => {
          this.isPlaying = false
          if (onEnd) onEnd()
          URL.revokeObjectURL(audioUrl)
        }
        
        this.audio.onerror = () => {
          this.isPlaying = false
          if (onEnd) onEnd()
        }
        await this.audio.play()
      }
    } catch (error) {
      console.error('TTS Error:', error)
      this.isPlaying = false
      if (onEnd) onEnd()
    }
  }

  stop(): void {
    // 停止 Live2D 音频播放
    Live2dManager.getInstance().stopAudio();
    if (this.live2dAudioInterval) {
      clearInterval(this.live2dAudioInterval);
      this.live2dAudioInterval = null;
    }

    if (this.audio) {
      this.audio.pause()
      this.audio.currentTime = 0
      this.audio = null
    }
    this.isPlaying = false
  }
}
```

在 `AICharacter.tsx` 调用 TTS 的地方，额外传入分身类型参数：
```typescript
ttsService.speak(
  fullContent, 
  voiceModel,
  () => setIsSpeaking(true), 
  () => setIsSpeaking(false),
  customAvatar?.type === 'live2d' // 传入 Live2D 活动状态
)
```

---

## 6. “选择分身形象”界面拓展 (新增 Live2D 卡通)

### 6.1 预设数据增加 Live2D 卡通列表
在 `src/components/ai/AvatarSelectionDialog.tsx` 中定义 12 个卡通形象配置：

```typescript
export interface Live2dPreset {
  id: string
  name: string
  url: string
  type: 'live2d'
  style: CharacterStyle
  modelName: string
  modelPath: string
}

const LIVE2D_PRESETS: Live2dPreset[] = [
  { id: 'l2d-hiyori', name: 'Hiyori (Live2D)', url: '/sentio/characters/free/Hiyori/Hiyori.png', type: 'live2d', style: 'cartoon', modelName: 'Hiyori', modelPath: '/sentio/characters/free/Hiyori/Hiyori.model3.json' },
  { id: 'l2d-harugreeter', name: 'Haru Greeter (Live2D)', url: '/sentio/characters/free/HaruGreeter/HaruGreeter.png', type: 'live2d', style: 'cartoon', modelName: 'HaruGreeter', modelPath: '/sentio/characters/free/HaruGreeter/HaruGreeter.model3.json' },
  { id: 'l2d-haru', name: 'Haru (Live2D)', url: '/sentio/characters/free/Haru/Haru.png', type: 'live2d', style: 'cartoon', modelName: 'Haru', modelPath: '/sentio/characters/free/Haru/Haru.model3.json' },
  { id: 'l2d-mao', name: 'Mao (Live2D)', url: '/sentio/characters/free/Mao/Mao.png', type: 'live2d', style: 'cartoon', modelName: 'Mao', modelPath: '/sentio/characters/free/Mao/Mao.model3.json' },
  { id: 'l2d-rice', name: 'Rice (Live2D)', url: '/sentio/characters/free/Rice/Rice.png', type: 'live2d', style: 'cartoon', modelName: 'Rice', modelPath: '/sentio/characters/free/Rice/Rice.model3.json' },
  { id: 'l2d-chitose', name: 'Chitose (Live2D)', url: '/sentio/characters/free/Chitose/Chitose.png', type: 'live2d', style: 'cartoon', modelName: 'Chitose', modelPath: '/sentio/characters/free/Chitose/Chitose.model3.json' },
  { id: 'l2d-epsilon', name: 'Epsilon (Live2D)', url: '/sentio/characters/free/Epsilon/Epsilon.png', type: 'live2d', style: 'cartoon', modelName: 'Epsilon', modelPath: '/sentio/characters/free/Epsilon/Epsilon.model3.json' },
  { id: 'l2d-hibiki', name: 'Hibiki (Live2D)', url: '/sentio/characters/free/Hibiki/Hibiki.png', type: 'live2d', style: 'cartoon', modelName: 'Hibiki', modelPath: '/sentio/characters/free/Hibiki/Hibiki.model3.json' },
  { id: 'l2d-izumi', name: 'Izumi (Live2D)', url: '/sentio/characters/free/Izumi/Izumi.png', type: 'live2d', style: 'cartoon', modelName: 'Izumi', modelPath: '/sentio/characters/free/Izumi/Izumi.model3.json' },
  { id: 'l2d-kei', name: 'Kei (Live2D)', url: '/sentio/characters/free/Kei/Kei.png', type: 'live2d', style: 'cartoon', modelName: 'Kei', modelPath: '/sentio/characters/free/Kei/Kei.model3.json' },
  { id: 'l2d-shizuku', name: 'Shizuku (Live2D)', url: '/sentio/characters/free/Shizuku/Shizuku.png', type: 'live2d', style: 'cartoon', modelName: 'Shizuku', modelPath: '/sentio/characters/free/Shizuku/Shizuku.model3.json' },
  { id: 'l2d-tsumiki', name: 'Tsumiki (Live2D)', url: '/sentio/characters/free/Tsumiki/Tsumiki.png', type: 'live2d', style: 'cartoon', modelName: 'Tsumiki', modelPath: '/sentio/characters/free/Tsumiki/Tsumiki.model3.json' }
]

// 2. 将默认形象 DEFAULT_AI_AVATAR 初始化为 "Hiyori (Live2D)"
export const DEFAULT_AI_AVATAR: AvatarModel = {
  id: 'l2d-hiyori',
  name: 'Hiyori (Live2D)',
  type: 'live2d',
  url: '/sentio/characters/free/Hiyori/Hiyori.png',
  style: 'cartoon',
  modelName: 'Hiyori',
  modelPath: '/sentio/characters/free/Hiyori/Hiyori.model3.json',
  createdAt: Date.now(),
  isCloned: false
}
```

### 6.2 调整分类页签渲染 (在“女生”前新增“Live2D卡通”)
修改过滤选项和渲染网格条件：

```tsx
// 1. 在状态声明中增加 'live2d' 类型支持
const [genderFilter, setGenderFilter] = useState<'all' | 'live2d' | 'female' | 'male'>('all')

// 2. 在渲染页签按钮处，在女生按钮前面加上 "Live2D卡通"：
<div className="flex gap-2 flex-wrap">
  {['all', 'live2d', 'female', 'male'].map((g) => (
    <button
      key={g}
      onClick={() => setGenderFilter(g as any)}
      className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${
        genderFilter === g ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-white border-gray-100 text-gray-400'
      }`}
    >
      {g === 'all' ? '全部' : g === 'live2d' ? 'Live2D卡通' : g === 'female' ? '女生' : '男生'}
    </button>
  ))}
</div>

// 3. 在网格列表展示中，按页签呈现对应卡片：
const displayAvatars = (() => {
  if (genderFilter === 'live2d') return LIVE2D_PRESETS
  if (genderFilter === 'female') return PRESET_AVATARS.filter(p => p.gender === 'female')
  if (genderFilter === 'male') return PRESET_AVATARS.filter(p => p.gender === 'male')
  return [...LIVE2D_PRESETS, ...PRESET_AVATARS]
})()

// 渲染 displayAvatars 数组：
<div className="grid grid-cols-3 gap-2">
  {displayAvatars.map((p) => (
    <button
      key={p.id}
      onClick={() => {
        onSelectAvatar({ 
          type: p.type, 
          url: p.url, 
          style: p.style,
          modelName: 'modelName' in p ? p.modelName : undefined,
          modelPath: 'modelPath' in p ? p.modelPath : undefined
        })
        onClose()
      }}
      className={`group relative flex flex-col p-1.5 rounded-xl border-2 transition-all ${
        currentAvatarUrl === p.url ? 'border-indigo-500 bg-indigo-50/30' : 'border-gray-50 hover:border-indigo-100'
      }`}
    >
      <div className="w-full aspect-square rounded-lg overflow-hidden mb-1.5 relative bg-gray-50">
        <img src={p.url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
        {currentAvatarUrl === p.url && (
          <div className="absolute inset-0 bg-indigo-600/20 flex items-center justify-center">
            <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow-lg">
              <Check size={14} />
            </div>
          </div>
        )}
      </div>
      <div className="px-1 text-left w-full">
        <div className={`font-bold text-[10px] truncate ${currentAvatarUrl === p.url ? 'text-indigo-600' : 'text-gray-800'}`}>{p.name}</div>
      </div>
    </button>
  ))}
</div>
```

---

## 7. 新增“数字人配置”管理面板

### 7.1 创建配置管理对话框组件 `CharacterConfigDialog.tsx`
我们在 `src/components/ai/` 下创建符合系统视觉的高级磨砂配置面板，利用 Tailwind CSS 及 Framer Motion 呈现多页签设置：

```tsx
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Settings, Sliders, Volume2, Mic, Bot, X, Check } from 'lucide-react'
import { useSentioBasicStore, useSentioAsrStore, useSentioTtsStore, useSentioAgentStore } from '../../lib/sentioStore'
import { Live2dManager } from '../../lib/live2d/live2dManager'

interface CharacterConfigDialogProps {
  isOpen: boolean
  onClose: () => void
}

type TabType = 'basic' | 'asr' | 'tts' | 'agent'

export function CharacterConfigDialog({ isOpen, onClose }: CharacterConfigDialogProps) {
  const [activeTab, setActiveTab] = useState<TabType>('basic')

  // Zustand stores
  const { sound, lipFactor, showThink, setSound, setLipFactor, setShowThink } = useSentioBasicStore()
  const asrStore = useSentioAsrStore()
  const ttsStore = useSentioTtsStore()
  const agentStore = useSentioAgentStore()

  const tabs = [
    { id: 'basic', name: '基础设置', icon: Sliders },
    { id: 'asr', name: '语音识别 (ASR)', icon: Mic },
    { id: 'tts', name: '语音合成 (TTS)', icon: Volume2 },
    { id: 'agent', name: 'AI 智能体', icon: Bot },
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative w-full max-w-2xl bg-slate-900/90 border border-slate-700/50 rounded-3xl overflow-hidden flex flex-col h-[550px] shadow-[0_24px_50px_rgba(0,0,0,0.5)] text-slate-100"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings className="text-indigo-400 animate-spin-slow" size={20} />
                <h3 className="text-lg font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">数字人多模态配置中心</h3>
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 transition-colors flex items-center justify-center text-slate-400 hover:text-white">
                <X size={16} />
              </button>
            </div>

            {/* Main Layout */}
            <div className="flex-1 flex overflow-hidden">
              {/* Sidebar Tabs */}
              <div className="w-48 bg-slate-950/40 border-r border-slate-800/80 p-3 flex flex-col gap-1 shrink-0">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as TabType)}
                      className={`w-full px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all text-left ${
                        activeTab === tab.id
                          ? 'bg-indigo-600 text-white shadow-[0_4px_12px_rgba(99,102,241,0.3)]'
                          : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                      }`}
                    >
                      <Icon size={16} />
                      <span>{tab.name}</span>
                    </button>
                  )
                })}
              </div>

              {/* Panel Content */}
              <div className="flex-1 p-6 overflow-y-auto bg-slate-900/50">
                {activeTab === 'basic' && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-bold text-slate-300 mb-4">基本交互表现</h4>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center bg-slate-950/20 border border-slate-800/50 p-4 rounded-2xl">
                          <div>
                            <p className="text-xs font-bold text-slate-200">合成语音输出</p>
                            <p className="text-[10px] text-slate-500 mt-0.5">是否在收到回复时自动朗读文本</p>
                          </div>
                          <button
                            onClick={() => setSound(!sound)}
                            className={`w-11 h-6 rounded-full transition-all relative ${sound ? 'bg-indigo-600' : 'bg-slate-700'}`}
                          >
                            <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${sound ? 'left-6' : 'left-1'}`} />
                          </button>
                        </div>

                        <div className="flex justify-between items-center bg-slate-950/20 border border-slate-800/50 p-4 rounded-2xl">
                          <div>
                            <p className="text-xs font-bold text-slate-200">显示思考过程 (R1模型)</p>
                            <p className="text-[10px] text-slate-500 mt-0.5">是否展示 AI 的推理思考气泡</p>
                          </div>
                          <button
                            onClick={() => setShowThink(!showThink)}
                            className={`w-11 h-6 rounded-full transition-all relative ${showThink ? 'bg-indigo-600' : 'bg-slate-700'}`}
                          >
                            <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${showThink ? 'left-6' : 'left-1'}`} />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-950/20 border border-slate-800/50 p-4 rounded-2xl">
                      <div className="flex justify-between mb-2">
                        <span className="text-xs font-bold text-slate-200">口型振幅倍率 (Lip Sync Factor)</span>
                        <span className="text-xs font-bold text-indigo-400">{lipFactor.toFixed(1)}x</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        step="0.5"
                        value={lipFactor}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value)
                          setLipFactor(val)
                          Live2dManager.getInstance().setLipFactor(val)
                        }}
                        className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                      />
                      <div className="flex justify-between text-[9px] text-slate-600 mt-1">
                        <span>微小 (1.0)</span>
                        <span>标准 (5.0)</span>
                        <span>夸张 (10.0)</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'asr' && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-slate-300 mb-2">语音识别引擎选择</h4>
                    <div className="space-y-3">
                      <div className="p-4 rounded-2xl bg-slate-950/20 border border-slate-800/50 flex flex-col gap-2">
                        <label className="text-[11px] text-slate-400 font-bold">默认识别引擎</label>
                        <select className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none">
                          <option value="SenseVoiceSmall">FunAudioLLM / SenseVoiceSmall (端侧超快速)</option>
                          <option value="whisper-1">OpenAI / Whisper-1 (长音频精准)</option>
                        </select>
                      </div>
                      <div className="p-4 rounded-2xl bg-slate-950/20 border border-slate-800/50 flex flex-col gap-2">
                        <label className="text-[11px] text-slate-400 font-bold">静音检测门限 (VAD Threshold)</label>
                        <input type="range" min="0.1" max="1" step="0.1" defaultValue="0.5" className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer" />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'tts' && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-slate-300 mb-2">语音合成引擎选择</h4>
                    <div className="space-y-3">
                      <div className="p-4 rounded-2xl bg-slate-950/20 border border-slate-800/50 flex flex-col gap-2">
                        <label className="text-[11px] text-slate-400 font-bold">模型音色库 (Preset Voice)</label>
                        <select className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none">
                          <option value="anna">fnlp/MOSS-TTSD-v0.5:anna (温柔女生)</option>
                          <option value="brian">fnlp/MOSS-TTSD-v0.5:brian (磁性男生)</option>
                          <option value="cloned">我的克隆声音 (零样本 Zero-shot)</option>
                        </select>
                      </div>
                      <div className="p-4 rounded-2xl bg-slate-950/20 border border-slate-800/50 flex flex-col gap-2">
                        <label className="text-[11px] text-slate-400 font-bold">语速控制 (Speech Rate)</label>
                        <input type="range" min="0.8" max="1.5" step="0.1" defaultValue="1.1" className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer" />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'agent' && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-slate-300 mb-2">AI 模型大脑配置</h4>
                    <div className="space-y-3">
                      <div className="p-4 rounded-2xl bg-slate-950/20 border border-slate-800/50 flex flex-col gap-2">
                        <label className="text-[11px] text-slate-400 font-bold">推理大模型模型 (LLM Model)</label>
                        <select className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none">
                          <option value="deepseek-r1">DeepSeek-R1 (深度思维链推理)</option>
                          <option value="deepseek-v3">DeepSeek-V3 (极速大语言模型)</option>
                          <option value="qwen-2.5-72b">Qwen-2.5-72B-Instruct (阿里千问)</option>
                        </select>
                      </div>
                      <div className="p-4 rounded-2xl bg-slate-950/20 border border-slate-800/50 flex flex-col gap-2">
                        <label className="text-[11px] text-slate-400 font-bold">发散度 (Temperature)</label>
                        <input type="range" min="0" max="1.5" step="0.1" defaultValue="0.7" className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/60 flex justify-end">
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 transition-colors text-white shadow-md shadow-indigo-500/20"
              >
                保存并应用配置
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
```

### 7.2 在 `AICharacter.tsx` 对话页面新增配置按钮与弹窗挂载
我们为桌面版和移动版视图分别提供“数字人配置”的挂载入口，位于“分享分身”按钮的右侧。

**文件修改点** (`src/pages/AICharacter.tsx`):
```tsx
// 1. 导入配置管理弹窗组件
import { CharacterConfigDialog } from '../components/ai/CharacterConfigDialog'

// 2. 声明配置弹窗开启状态
const [isConfigOpen, setIsConfigOpen] = useState(false)

// 3. 在返回的 JSX 中挂载 Dialog：
<CharacterConfigDialog 
  isOpen={isConfigOpen} 
  onClose={() => setIsConfigOpen(false)} 
/>

// 4. 【PC端布局中】在分享分身按钮右侧添加“数字人配置”按钮：
// 在 JSX 的 <motion.button onClick={() => setIsShareOpen(true)} ...>分享分身</motion.button> 右边紧接着放置：
<motion.button
  onClick={() => setIsConfigOpen(true)}
  whileTap={{ scale: 0.95 }}
  className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-bold bg-slate-800/60 hover:bg-slate-800/80 border border-slate-700/50 backdrop-blur-md transition-all text-slate-200"
>
  <Bot size={16} className="text-slate-400" />
  <span>数字人配置</span>
</motion.button>

// 5. 【移动端布局中】在分享分身按钮右边放置：
<button 
  onClick={() => setIsConfigOpen(true)}
  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full backdrop-blur-md border border-slate-700 bg-slate-800/60 text-[11px] font-semibold text-slate-200 transition-all active:scale-95"
>
  <Bot size={12} className="text-slate-400" />
  <span>数字人配置</span>
</button>
```

---

## 8. 集成后验证与调试建议

为了确保 Live2D 交互工作能全部顺利运行，开发时可按照以下流程测试：
1. **别名检测**：运行 `npm run dev` 确保没有 `@/` 等路径 alias 解析报错。
2. **初始化模型加载**：进入分身对话界面后，确认 Canvas 正常创建，并成功发出 `/sentio/characters/free/Hiyori/Hiyori.model3.json` 相关的本地资源请求。
3. **音频转码监控**：发出一段对话测试合成，观察控制台是否有 WAV 转码输出日志，口型参数（`ParamMouthOpenY`）是否在播放期间有浮动数据变化。
4. **视线互动**：在 Canvas 上滑动或移动鼠标，确认 Hiyori 的眼睛和头部位置会随鼠标指针方向缓慢旋转转动。
