// ===== Personal Info =====
export const personalInfo = {
  name: '晓叶',
  nameEn: 'XiaoYe',
  title: '全栈开发者 / 创意设计师',
  tagline: '用代码编织梦想，用设计点亮生活',
  avatar: '/avatar.png',
  bio: '热衷于探索前沿技术与创意设计的交汇点。5年全栈开发经验，专注于构建优雅、高性能的Web应用。相信好的产品需要技术与美学的完美结合。',
  location: '中国 · 杭州',
  email: 'xiaoye@example.com',
}

// 预设头像列表 - 使用卡通可爱风格（Notionists）
export const presetAvatars = [
  { id: 'avatar1', url: 'https://tse2.mm.bing.net/th/id/OIP.JXixrtqu6-SGuc8H2zyFogHaHa?rs=1&pid=ImgDetMain&o=7&rm=3', name: '头像1' },
  { id: 'avatar2', url: 'https://tse3.mm.bing.net/th/id/OIP.fwnj3VOYFymYAqGatqTYzAAAAA?rs=1&pid=ImgDetMain&o=7&rm=3', name: '头像2' },
  { id: 'avatar3', url: 'https://tse2.mm.bing.net/th/id/OIP.m_wDQ2YRYZIN6TRaawDsgwHaHa?rs=1&pid=ImgDetMain&o=7&rm=3', name: '头像3' },
  { id: 'avatar4', url: 'https://tse1.mm.bing.net/th/id/OIP.kmOlW7zruVymqGDSNnfS_wHaHY?rs=1&pid=ImgDetMain&o=7&rm=3', name: '头像4' },
  { id: 'avatar5', url: 'https://tse3.mm.bing.net/th/id/OIP.NS9PihpGbADChVBXuGOvTgHaHa?rs=1&pid=ImgDetMain&o=7&rm=3', name: '头像5' },
  { id: 'avatar6', url: 'https://tse2.mm.bing.net/th/id/OIP.DbjMDUf18KAYmIkccbdulwHaHa?rs=1&pid=ImgDetMain&o=7&rm=3', name: '头像6' },
  { id: 'avatar7', url: 'https://tse2.mm.bing.net/th/id/OIP.1hWWKPNgG1xZeIz4-7Fs-QHaHZ?rs=1&pid=ImgDetMain&o=7&rm=3', name: '头像7' },
  { id: 'avatar8', url: 'https://tse2.mm.bing.net/th/id/OIP.yA-PvTRLFAJub1eIJxAKFwHaHa?rs=1&pid=ImgDetMain&o=7&rm=3', name: '头像8' },
  { id: 'avatar9', url: 'https://wx2.sinaimg.cn/mw690/006CqIhwgy1hzfhlvsqpwj30sg0sg40s.jpg', name: '头像9' },
  { id: 'avatar10', url: 'https://th.bing.com/th?id=OIF.yHiOhj2gVH0Pgt1%2bwK2DgA&rs=1&pid=ImgDetMain&o=7&rm=3', name: '头像10' },
]

// 预设背景图列表
export const presetBackgrounds = [
  { id: 'bg1', url: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=800&q=80', name: '渐变紫蓝' },
  { id: 'bg2', url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&q=80', name: '暖色渐变' },
  { id: 'bg3', url: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=800&q=80', name: '粉紫梦幻' },
  { id: 'bg4', url: 'https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?w=800&q=80', name: '深蓝星空' },
  { id: 'bg5', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80', name: '抽象艺术' },
]

export const skills = [
  { name: 'React', level: 95, category: '前端' },
  { name: 'TypeScript', level: 92, category: '前端' },
  { name: 'Vue.js', level: 85, category: '前端' },
  { name: 'Next.js', level: 88, category: '前端' },
  { name: 'Tailwind CSS', level: 94, category: '前端' },
  { name: 'Node.js', level: 88, category: '后端' },
  { name: 'Python', level: 82, category: '后端' },
  { name: 'Go', level: 75, category: '后端' },
  { name: 'PostgreSQL', level: 80, category: '后端' },
  { name: 'Docker', level: 78, category: 'DevOps' },
  { name: 'AWS', level: 76, category: 'DevOps' },
  { name: 'Figma', level: 90, category: '设计' },
  { name: 'UI/UX', level: 87, category: '设计' },
  { name: 'AI/ML', level: 70, category: '探索' },
  { name: 'Web3', level: 65, category: '探索' },
  { name: 'Three.js', level: 72, category: '探索' },
]

export const stats = [
  { label: '项目经验', value: '50+', icon: 'Code' },
  { label: '开源贡献', value: '200+', icon: 'GitBranch' },
  { label: '技术文章', value: '80+', icon: 'FileText' },
  { label: '获得Star', value: '2.5K', icon: 'Star' },
]

export const portfolioProjects = [
  {
    id: '1',
    title: 'AI Studio',
    description: '基于大语言模型的智能创作平台，支持多模态内容生成与协作编辑',
    tags: ['React', 'Python', 'AI'],
    gradient: 'bg-gradient-card-violet',
    icon: '🤖',
  },
  {
    id: '2',
    title: 'DesignFlow',
    description: '在线协作设计工具，支持实时多人编辑、版本管理和设计系统',
    tags: ['Vue.js', 'WebSocket', 'Canvas'],
    gradient: 'bg-gradient-card-cyan',
    icon: '🎨',
  },
  {
    id: '3',
    title: 'DataViz Pro',
    description: '企业级数据可视化仪表盘，将复杂数据转化为直观的交互式图表',
    tags: ['D3.js', 'React', 'GraphQL'],
    gradient: 'bg-gradient-card-rose',
    icon: '📊',
  },
  {
    id: '4',
    title: 'CloudNote',
    description: '云端笔记应用，支持 Markdown 实时编辑和知识图谱可视化',
    tags: ['React', 'Node.js', 'MongoDB'],
    gradient: 'bg-gradient-card-emerald',
    icon: '📝',
  },
  {
    id: '5',
    title: 'MusicLab',
    description: 'Web 音频实验室，探索声音合成与音频可视化的无限可能',
    tags: ['Web Audio', 'Three.js', 'WebGL'],
    gradient: 'bg-gradient-card-sky',
    icon: '🎵',
  },
  {
    id: '6',
    title: 'DevTools Hub',
    description: '开发者效率工具集，集成 API 调试、代码生成等常用功能',
    tags: ['TypeScript', 'Electron', 'Rust'],
    gradient: 'bg-gradient-card-amber',
    icon: '🛠️',
  },
]

// ===== Learning Data =====
export interface Article {
  id: string
  title: string
  excerpt: string
  date: string
  tags: string[]
  content: string
  readTime: string
  coverImage?: string
}

export interface Series {
  name: string
  articles: Article[]
}

export interface Category {
  name: string
  icon: string
  series: Series[]
}

export const learningCategories: Category[] = [
  {
    name: '前端开发',
    icon: '🌐',
    series: [
      {
        name: 'React 深入浅出',
        articles: [
          {
            id: 'react-1',
            title: 'React 18 并发模式详解',
            excerpt: '深入理解 React 18 中引入的并发特性，包括 Suspense、Transition 和自动批处理。',
            date: '2025-12-15',
            tags: ['React', 'Concurrent'],
            readTime: '12 分钟',
            coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&q=80',
            content: `React 18 引入了期待已久的并发模式，这是一个根本性的架构升级。

## 什么是并发模式？

并发模式允许 React 同时准备多个版本的 UI，使得应用能够在保持响应性的同时处理复杂的状态更新。

## Suspense 的演进

Suspense 不再仅仅用于代码分割，现在它可以用于数据获取、图片加载等任何异步操作。

## useTransition 和 useDeferredValue

这两个新 Hook 让开发者能够明确区分紧急更新和非紧急更新，确保用户交互始终流畅。`,
          },
          {
            id: 'react-2',
            title: 'React Server Components 实战指南',
            excerpt: '从零开始学习 RSC 的工作原理，以及如何在 Next.js 中高效使用它。',
            date: '2025-11-20',
            tags: ['React', 'RSC', 'Next.js'],
            readTime: '15 分钟',
            coverImage: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=600&q=80',
            content: `Server Components 改变了我们构建 React 应用的方式。

## 核心概念

服务端组件在服务器上渲染，不会增加客户端 bundle 大小。它们可以直接访问数据库、文件系统等服务端资源。

## 客户端 vs 服务端组件

理解何时使用 "use client" 指令是掌握 RSC 的关键。交互性组件需要在客户端运行，而纯展示组件则适合在服务端渲染。`,
          },
        ],
      },
      {
        name: 'CSS 艺术',
        articles: [
          {
            id: 'css-1',
            title: 'Tailwind CSS v4 新特性全面解析',
            excerpt: '探索 Tailwind CSS v4 带来的革命性变化：CSS-first 配置、全新引擎和更强大的工具。',
            date: '2025-10-08',
            tags: ['CSS', 'Tailwind'],
            readTime: '10 分钟',
            coverImage: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=600&q=80',
            content: `Tailwind CSS v4 是一次重大重构。

## CSS-first 配置

告别 JavaScript 配置文件，所有自定义都在 CSS 中使用 @theme 完成。

## 性能飞跃

全新的 Oxide 引擎使构建速度提升了 10 倍以上。`,
          },
        ],
      },
    ],
  },
  {
    name: '后端技术',
    icon: '⚙️',
    series: [
      {
        name: 'Node.js 高级进阶',
        articles: [
          {
            id: 'node-1',
            title: 'Node.js 事件循环机制深度剖析',
            excerpt: '理解事件循环的六个阶段，掌握 Timer、I/O 和微任务的执行顺序。',
            date: '2025-09-12',
            tags: ['Node.js', 'Event Loop'],
            readTime: '18 分钟',
            coverImage: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=600&q=80',
            content: `事件循环是 Node.js 的核心机制。

## 六个阶段

Timers → Pending → Idle → Poll → Check → Close

## 微任务优先级

process.nextTick 和 Promise 在每个阶段之间执行，具有最高优先级。`,
          },
        ],
      },
    ],
  },
  {
    name: 'AI 探索',
    icon: '🧠',
    series: [
      {
        name: 'AI 应用开发',
        articles: [
          {
            id: 'ai-1',
            title: '用 LangChain 构建智能 Agent',
            excerpt: '手把手教你使用 LangChain 框架构建具有记忆和工具调用能力的 AI Agent。',
            date: '2025-08-25',
            tags: ['AI', 'LangChain', 'Agent'],
            readTime: '20 分钟',
            coverImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&q=80',
            content: `AI Agent 是 2026 年最热门的技术趋势之一。

## 什么是 AI Agent？

与简单的问答不同，Agent 能够自主规划、调用工具并完成复杂任务。

## LangChain 框架

LangChain 提供了构建 Agent 的完整工具链，包括 Prompt 模板、记忆管理和工具集成。`,
          },
        ],
      },
    ],
  },
  {
    name: '设计思维',
    icon: '🎯',
    series: [
      {
        name: '设计系统实践',
        articles: [
          {
            id: 'design-1',
            title: '从零构建企业级设计系统',
            excerpt: '分享在实际项目中构建和维护设计系统的经验，包括设计 Token、组件库和文档。',
            date: '2025-07-18',
            tags: ['Design System', 'UI/UX'],
            readTime: '14 分钟',
            coverImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80',
            content: `一个好的设计系统能极大提升团队效率。

## 设计 Token

从颜色、字体、间距开始，建立统一的设计语言。

## 组件层级

原子 → 分子 → 组织 → 模板 → 页面，逐步构建完整体系。`,
          },
        ],
      },
    ],
  },
]

// ===== Life Data =====
export const loveTimeline = [
  {
    id: 'love-1',
    date: '2024-02-14',
    title: '💕 在一起的第一天',
    description: '情人节的浪漫邂逅，从此开启了我们的故事。咖啡厅里的第一次牵手，心跳加速的那个瞬间。',
    emoji: '💕',
  },
  {
    id: 'love-2',
    date: '2024-05-01',
    title: '🏖️ 第一次旅行',
    description: '一起去了厦门，在海边看日落。你说最美的风景是有我在身边。',
    emoji: '🏖️',
  },
  {
    id: 'love-3',
    date: '2024-08-08',
    title: '🎂 为你过生日',
    description: '偷偷准备了惊喜派对，看到你惊讶又感动的表情，一切都值得了。',
    emoji: '🎂',
  },
  {
    id: 'love-4',
    date: '2024-12-25',
    title: '🎄 第一个圣诞节',
    description: '一起装饰了圣诞树，交换礼物。你送我的手写信让我热泪盈眶。',
    emoji: '🎄',
  },
  {
    id: 'love-5',
    date: '2025-02-14',
    title: '💍 一周年纪念',
    description: '时间过得真快，认识你是我这辈子最幸运的事。未来的每一天都想和你一起度过。',
    emoji: '💍',
  },
]

// 朋友圈评论类型
export interface PostComment {
  id: string
  author: string
  avatar?: string
  content: string
  date: string
}

// 朋友圈动态类型
export interface SocialPost {
  id: string
  author: string
  avatar: string
  date: string
  content: string
  images: string[]
  video?: {
    url: string
    thumbnail: string
    duration: string
  }
  likes: number
  isLiked: boolean
  comments: PostComment[]
  location?: string
}

// 使用 Unsplash 真实图片
const unsplashImages = {
  // 生活场景
  coffee: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80',
  workspace: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80',
  keyboard: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&q=80',
  book: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80',
  
  // 风景
  mountain: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
  lake: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&q=80',
  sunset: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
  forest: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80',
  beach: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
  city: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=80',
  
  // 美食
  food1: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80',
  food2: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80',
  coffee2: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80',
  
  // 人物/活动
  concert: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&q=80',
  hiking: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80',
  party: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80',
  
  // 科技
  code: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
  tech: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
  
  // 宠物
  cat: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&q=80',
  dog: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80',
}

export const socialPosts: SocialPost[] = [
  {
    id: 'post-1',
    author: '晓叶',
    avatar: '/avatar.png',
    date: '2025-12-10 18:30',
    content: '今天终于把新项目的架构设计完成了！用了 React Server Components + Edge Runtime，性能提升了 3 倍 🚀 这段时间的辛苦没有白费，看着代码一点点成型，真的很有成就感！',
    images: [unsplashImages.code, unsplashImages.workspace],
    likes: 42,
    isLiked: true,
    comments: [
      { id: 'c1', author: '老王', content: '太强了！求分享架构设计思路', date: '2025-12-10 19:15' },
      { id: 'c2', author: '小鱼', content: '恭喜恭喜！期待开源', date: '2025-12-10 20:30' },
    ],
    location: '深圳 · 科技园',
  },
  {
    id: 'post-2',
    author: '晓叶',
    avatar: '/avatar.png',
    date: '2025-12-08 12:15',
    content: '周末和朋友们去了趟莫干山，冬天的竹海别有一番风味。泡了温泉、吃了农家菜，满满的幸福感 ❤️ 有时候真的需要放慢脚步，享受一下生活的美好。',
    images: [unsplashImages.mountain, unsplashImages.forest, unsplashImages.lake, unsplashImages.sunset],
    likes: 78,
    isLiked: false,
    comments: [
      { id: 'c3', author: '小美', content: '风景太美了！求攻略', date: '2025-12-08 14:20' },
      { id: 'c4', author: '阿泽', content: '下次带我一起啊', date: '2025-12-08 16:45' },
      { id: 'c5', author: '晓叶', content: '回复小美：住宿推荐裸心谷，温泉很棒！', date: '2025-12-08 18:00' },
    ],
    location: '湖州 · 莫干山',
  },
  {
    id: 'post-3',
    author: '晓叶',
    avatar: '/avatar.png',
    date: '2025-11-25 11:20',
    content: '九宫格测试 🎨 生活就是要多姿多彩，记录每一个美好瞬间',
    images: [
      unsplashImages.coffee, unsplashImages.food1, unsplashImages.cat,
      unsplashImages.city, unsplashImages.beach, unsplashImages.food2,
      unsplashImages.hiking, unsplashImages.dog, unsplashImages.coffee2,
    ],
    likes: 128,
    isLiked: true,
    comments: [
      { id: 'c10', author: '小美', content: '生活好丰富！', date: '2025-11-25 12:00' },
      { id: 'c11', author: '小鱼', content: '那只猫咪好可爱', date: '2025-11-25 13:30' },
    ],
  },
  {
    id: 'post-4',
    author: '晓叶',
    avatar: '/avatar.png',
    date: '2025-11-20 19:00',
    content: '今天是个特别的日子，和朋友们一起庆祝 🎉 感谢有你们陪伴的每一天',
    video: {
      url: 'https://example.com/video.mp4',
      thumbnail: unsplashImages.party,
      duration: '0:45',
    },
    images: [],
    likes: 89,
    isLiked: true,
    comments: [
      { id: 'c12', author: '阿泽', content: '生日快乐！', date: '2025-11-20 19:30' },
    ],
  },
]

export interface TravelLocation {
  id: string
  name: string
  country: string
  description: string
  x: number
  y: number
  color: string
  images: string[]
  details: {
    bestTime: string
    highlights: string[]
    tips: string
  }
}

// 中国城市风景图片集 - 使用可靠的Picsum图片服务
const chinaCityImages = {
  // 重庆 - 山城夜景、火锅、轻轨
  chongqing: [
    'https://picsum.photos/seed/chongqing1/800/600',
    'https://picsum.photos/seed/chongqing2/800/600',
    'https://picsum.photos/seed/chongqing3/800/600',
  ],
  // 成都 - 熊猫、宽窄巷子、茶馆
  chengdu: [
    'https://picsum.photos/seed/chengdu1/800/600',
    'https://picsum.photos/seed/chengdu2/800/600',
    'https://picsum.photos/seed/chengdu3/800/600',
  ],
  // 西安 - 兵马俑、古城墙、大雁塔
  xian: [
    'https://picsum.photos/seed/xian1/800/600',
    'https://picsum.photos/seed/xian2/800/600',
    'https://picsum.photos/seed/xian3/800/600',
  ],
  // 北京 - 故宫、长城、天安门
  beijing: [
    'https://picsum.photos/seed/beijing1/800/600',
    'https://picsum.photos/seed/beijing2/800/600',
    'https://picsum.photos/seed/beijing3/800/600',
  ],
  // 深圳 - 现代都市、海岸线
  shenzhen: [
    'https://picsum.photos/seed/shenzhen1/800/600',
    'https://picsum.photos/seed/shenzhen2/800/600',
    'https://picsum.photos/seed/shenzhen3/800/600',
  ],
  // 杭州 - 西湖、园林
  hangzhou: [
    'https://picsum.photos/seed/hangzhou1/800/600',
    'https://picsum.photos/seed/hangzhou2/800/600',
    'https://picsum.photos/seed/hangzhou3/800/600',
  ],
  // 南京 - 中山陵、秦淮河
  nanjing: [
    'https://picsum.photos/seed/nanjing1/800/600',
    'https://picsum.photos/seed/nanjing2/800/600',
    'https://picsum.photos/seed/nanjing3/800/600',
  ],
  // 洛阳 - 龙门石窟、牡丹
  luoyang: [
    'https://picsum.photos/seed/luoyang1/800/600',
    'https://picsum.photos/seed/luoyang2/800/600',
    'https://picsum.photos/seed/luoyang3/800/600',
  ],
  // 南昌 - 滕王阁、赣江
  nanchang: [
    'https://picsum.photos/seed/nanchang1/800/600',
    'https://picsum.photos/seed/nanchang2/800/600',
    'https://picsum.photos/seed/nanchang3/800/600',
  ],
}

export const travelLocations: TravelLocation[] = [
  {
    id: 'travel-1',
    name: '重庆',
    country: '中国',
    description: '山城雾都，火锅与轻轨的魔幻之城',
    x: 62,
    y: 42,
    color: '#ef4444',
    images: chinaCityImages.chongqing,
    details: {
      bestTime: '3-5月、9-11月',
      highlights: ['洪崖洞夜景', '穿楼轻轨', '长江索道', '磁器口古镇', '解放碑步行街'],
      tips: '一定要体验一次两江夜游，感受山城的立体魔幻'
    }
  },
  {
    id: 'travel-2',
    name: '成都',
    country: '中国',
    description: '天府之国，熊猫故乡，慢生活的典范',
    x: 58,
    y: 44,
    color: '#f59e0b',
    images: chinaCityImages.chengdu,
    details: {
      bestTime: '3-6月、9-11月',
      highlights: ['大熊猫基地', '宽窄巷子', '锦里古街', '都江堰', '青城山'],
      tips: '成都的茶馆文化值得一体验，人民公园鹤鸣茶社是首选'
    }
  },
  {
    id: 'travel-3',
    name: '西安',
    country: '中国',
    description: '十三朝古都，兵马俑与古城墙的历史回响',
    x: 60,
    y: 35,
    color: '#8b5cf6',
    images: chinaCityImages.xian,
    details: {
      bestTime: '3-5月、9-10月',
      highlights: ['秦始皇兵马俑', '古城墙骑行', '大雁塔', '回民街', '大唐不夜城'],
      tips: '晚上去大唐不夜城感受盛唐气象，灯光秀非常震撼'
    }
  },
  {
    id: 'travel-4',
    name: '北京',
    country: '中国',
    description: '千年帝都，故宫与长城的庄严壮美',
    x: 68,
    y: 28,
    color: '#dc2626',
    images: chinaCityImages.beijing,
    details: {
      bestTime: '4-5月、9-10月',
      highlights: ['故宫博物院', '万里长城', '天安门广场', '颐和园', '南锣鼓巷'],
      tips: '故宫需要提前网上预约，建议安排一整天慢慢游览'
    }
  },
  {
    id: 'travel-5',
    name: '深圳',
    country: '中国',
    description: '创新之都，科技与自然并存的现代都市',
    x: 72,
    y: 52,
    color: '#0ea5e9',
    images: chinaCityImages.shenzhen,
    details: {
      bestTime: '10月-次年4月',
      highlights: ['深圳湾公园', '世界之窗', '欢乐谷', '东部华侨城', '大梅沙海滨'],
      tips: '深圳湾公园是观赏日落和城市天际线的绝佳地点'
    }
  },
  {
    id: 'travel-6',
    name: '杭州',
    country: '中国',
    description: '人间天堂，西湖美景与互联网新贵的完美融合',
    x: 74,
    y: 42,
    color: '#10b981',
    images: chinaCityImages.hangzhou,
    details: {
      bestTime: '3-5月、9-11月',
      highlights: ['西湖十景', '灵隐寺', '宋城', '西溪湿地', '河坊街'],
      tips: '西湖骑行是最佳体验方式，苏堤春晓和断桥残雪必去'
    }
  },
  {
    id: 'travel-7',
    name: '南京',
    country: '中国',
    description: '六朝古都，秦淮河畔的诗意与沧桑',
    x: 72,
    y: 38,
    color: '#ec4899',
    images: chinaCityImages.nanjing,
    details: {
      bestTime: '3-5月、9-11月',
      highlights: ['中山陵', '夫子庙秦淮河', '总统府', '明孝陵', '玄武湖'],
      tips: '夜游秦淮河是南京必体验项目，感受桨声灯影里的金陵'
    }
  },
  {
    id: 'travel-8',
    name: '洛阳',
    country: '中国',
    description: '十三朝古都，龙门石窟与牡丹花城',
    x: 64,
    y: 36,
    color: '#f97316',
    images: chinaCityImages.luoyang,
    details: {
      bestTime: '4-5月（牡丹花季）、9-10月',
      highlights: ['龙门石窟', '白马寺', '老君山', '洛阳牡丹', '应天门'],
      tips: '每年4月是洛阳牡丹花会，满城花香，非常适合游览'
    }
  },
  {
    id: 'travel-9',
    name: '南昌',
    country: '中国',
    description: '英雄城，滕王阁与赣江风光',
    x: 70,
    y: 46,
    color: '#06b6d4',
    images: chinaCityImages.nanchang,
    details: {
      bestTime: '3-5月、9-11月',
      highlights: ['滕王阁', '八一广场', '赣江夜景', '鄱阳湖', '绳金塔'],
      tips: '傍晚登滕王阁看赣江日落，感受"落霞与孤鹜齐飞"的诗意'
    }
  },
]

// ===== Entertainment Data =====
export const musicPlaylist = [
  { id: 'song-1', title: '晴天', artist: '周杰伦', album: '叶惠美', duration: '4:29', color: '#0ea5e9' },
  { id: 'song-2', title: 'Shape of You', artist: 'Ed Sheeran', album: '÷', duration: '3:53', color: '#10b981' },
  { id: 'song-3', title: '起风了', artist: '买辣椒也用券', album: '起风了', duration: '5:16', color: '#8b5cf6' },
  { id: 'song-4', title: 'Blinding Lights', artist: 'The Weeknd', album: 'After Hours', duration: '3:20', color: '#f43f5e' },
  { id: 'song-5', title: '光辉岁月', artist: 'Beyond', album: '命运派对', duration: '4:52', color: '#f59e0b' },
  { id: 'song-6', title: 'Bohemian Rhapsody', artist: 'Queen', album: 'A Night at the Opera', duration: '5:55', color: '#ec4899' },
  { id: 'song-7', title: '海阔天空', artist: 'Beyond', album: '乐与怒', duration: '5:26', color: '#06b6d4' },
  { id: 'song-8', title: 'Summertime Sadness', artist: 'Lana Del Rey', album: 'Born to Die', duration: '4:25', color: '#a78bfa' },
]

export interface Movie {
  id: string
  title: string
  year: number
  rating: number
  genre: string
  comment: string
  poster: string
  description: string
  director: string
}

export const movieCollection: Movie[] = [
  { 
    id: 'movie-1', 
    title: '星际穿越', 
    year: 2014, 
    rating: 9.4, 
    genre: '科幻', 
    comment: '诺兰对时间与爱的极致诠释', 
    poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&q=80',
    description: '在地球不再适合人类居住的未来，一群探险家利用新发现的虫洞，超越人类太空旅行的极限，在广袤的宇宙中寻找人类的新家园。',
    director: '克里斯托弗·诺兰'
  },
  { 
    id: 'movie-2', 
    title: '千与千寻', 
    year: 2001, 
    rating: 9.4, 
    genre: '动画', 
    comment: '宫崎骏的奇幻世界，每一帧都是艺术', 
    poster: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&q=80',
    description: '10岁的少女千寻与父母一起从都市搬家到了乡下。没想到在搬家的途中，一家人发生了意外，进入了汤屋老板魔女汤婆婆控制的奇特世界。',
    director: '宫崎骏'
  },
  { 
    id: 'movie-3', 
    title: '肖申克的救赎', 
    year: 1994, 
    rating: 9.7, 
    genre: '剧情', 
    comment: '希望是好事，也许是最好的事', 
    poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&q=80',
    description: '一个银行家因被误判杀害妻子和情人的罪名入狱，在狱中他结识了走私犯瑞德，并通过自己的智慧和希望最终获得自由。',
    director: '弗兰克·德拉邦特'
  },
  { 
    id: 'movie-4', 
    title: '盗梦空间', 
    year: 2010, 
    rating: 9.3, 
    genre: '科幻', 
    comment: '梦境的层层嵌套，现实的边界在哪里？', 
    poster: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&q=80',
    description: '多姆·柯布是一位经验老道的窃贼，他在这一行中算得上是最厉害的，因为他能够潜入人们精神最为脆弱的梦境中，窃取潜意识中有价值的秘密。',
    director: '克里斯托弗·诺兰'
  },
  { 
    id: 'movie-5', 
    title: '你的名字', 
    year: 2016, 
    rating: 8.4, 
    genre: '动画', 
    comment: '跨越时空的羁绊，美到窒息的画面', 
    poster: 'https://images.unsplash.com/photo-1516726817505-f5ed825624d8?w=400&q=80',
    description: '在深山乡村生活的女高中生宫水三叶，梦见自己变成了在东京生活的男高中生。与此同时，东京的男高中生立花泷也梦见自己变成了女高中生。',
    director: '新海诚'
  },
  { 
    id: 'movie-6', 
    title: '楚门的世界', 
    year: 1998, 
    rating: 9.3, 
    genre: '剧情', 
    comment: '如果你的人生是一场直播？', 
    poster: 'https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?w=400&q=80',
    description: '楚门是一个标准的中产阶级，但他不知道自己生活在一个巨大的摄影棚中，他的一生都是一档24小时直播的真人秀节目。',
    director: '彼得·威尔'
  },
  { 
    id: 'movie-7', 
    title: '疯狂动物城', 
    year: 2016, 
    rating: 9.2, 
    genre: '动画', 
    comment: '每个人都能成为自己想成为的人', 
    poster: 'https://images.unsplash.com/photo-1560167016-022b78a0258e?w=400&q=80',
    description: '在一个所有动物和平共处的动物城市，兔子朱迪通过自己努力奋斗完成儿时梦想，成为动物警察的故事。',
    director: '拜伦·霍华德'
  },
  { 
    id: 'movie-8', 
    title: '寄生虫', 
    year: 2019, 
    rating: 8.8, 
    genre: '剧情', 
    comment: '阶层差异的黑色寓言', 
    poster: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=400&q=80',
    description: '基宇出生在一个贫穷的家庭之中，和妹妹基婷以及父母在狭窄的地下室里过着相依为命的日子。一天，基宇的同学上门拜访。',
    director: '奉俊昊'
  },
]

export interface Bookmark {
  id: string
  title: string
  url: string
  description: string
  category: string
  icon: string
}

export const bookmarks: Bookmark[] = [
  { id: 'bm-1', title: 'GitHub', url: 'https://github.com', description: '代码托管与开源协作平台', category: '开发工具', icon: '🐙' },
  { id: 'bm-2', title: 'Vercel', url: 'https://vercel.com', description: '前端部署与 Serverless 平台', category: '开发工具', icon: '▲' },
  { id: 'bm-3', title: 'Figma', url: 'https://figma.com', description: '在线协作设计工具', category: '设计资源', icon: '🎨' },
  { id: 'bm-4', title: 'Dribbble', url: 'https://dribbble.com', description: '设计师灵感社区', category: '设计资源', icon: '🏀' },
  { id: 'bm-5', title: 'MDN Web Docs', url: 'https://developer.mozilla.org', description: 'Web 技术权威文档', category: '学习资源', icon: '📚' },
  { id: 'bm-6', title: 'LeetCode', url: 'https://leetcode.com', description: '算法练习平台', category: '学习资源', icon: '🧩' },
  { id: 'bm-7', title: '代码如诗', url: '#', description: '"任何傻瓜都能写出计算机能理解的代码，优秀的程序员写出人类能理解的代码。" —— Martin Fowler', category: '金句收藏', icon: '💎' },
  { id: 'bm-8', title: '保持简单', url: '#', description: '"简单是最终的复杂。" —— 达芬奇', category: '金句收藏', icon: '✨' },
  { id: 'bm-9', title: 'Notion', url: 'https://notion.so', description: '笔记与知识管理工具', category: '效率工具', icon: '📋' },
  { id: 'bm-10', title: 'Raycast', url: 'https://raycast.com', description: 'macOS 效率启动器', category: '效率工具', icon: '🚀' },
]

// ===== Social Data =====
export const friendLinks = [
  { id: 'fl-1', name: '阿泽', description: '后端架构师，分布式系统专家', url: '#', color: '#8b5cf6', initials: 'AZ' },
  { id: 'fl-2', name: '小鱼', description: '独立游戏开发者，像素艺术爱好者', url: '#', color: '#f43f5e', initials: 'XY' },
  { id: 'fl-3', name: '老王', description: 'DevOps 工程师，云原生布道者', url: '#', color: '#0ea5e9', initials: 'LW' },
  { id: 'fl-4', name: '小美', description: 'UI/UX 设计师，极简主义践行者', url: '#', color: '#10b981', initials: 'XM' },
  { id: 'fl-5', name: '大成', description: '全栈创业者，连续创业中', url: '#', color: '#f59e0b', initials: 'DC' },
  { id: 'fl-6', name: '阿凡', description: '安全研究员，CTF 战队队长', url: '#', color: '#ec4899', initials: 'AF' },
]

export const danmakuMessages = [
  { id: 'dm-1', text: '博主好厉害！', author: '路人甲', color: '#8b5cf6' },
  { id: 'dm-2', text: '网站设计真好看 ✨', author: '设计迷', color: '#f59e0b' },
  { id: 'dm-3', text: '前端大佬带带我', author: '小白同学', color: '#0ea5e9' },
  { id: 'dm-4', text: '来自2025的问候~', author: '时间旅人', color: '#10b981' },
  { id: 'dm-5', text: '收藏了收藏了！', author: '热心网友', color: '#f43f5e' },
  { id: 'dm-6', text: '学到了很多，感谢分享', author: '学习者', color: '#ec4899' },
  { id: 'dm-7', text: '大佬的代码真优雅', author: '代码控', color: '#a78bfa' },
  { id: 'dm-8', text: '路过打卡 ✅', author: '打卡达人', color: '#06b6d4' },
  { id: 'dm-9', text: '什么时候出教程啊？', author: '期待者', color: '#fbbf24' },
  { id: 'dm-10', text: '已关注+三连！', author: '忠实粉丝', color: '#f472b6' },
  { id: 'dm-11', text: '技术栈好全面', author: '同行', color: '#34d399' },
  { id: 'dm-12', text: '网站丝滑得不行', author: '体验官', color: '#818cf8' },
]

export const growthTimeline = [
  { id: 'gt-1', date: '2019', title: '踏入编程世界', description: '大学期间自学前端开发，用 HTML/CSS/JS 搭建了第一个个人网站。', icon: '🌱' },
  { id: 'gt-2', date: '2020', title: '全栈之路', description: '学习 Node.js 和数据库，开始独立完成全栈项目。获得第一份实习 offer。', icon: '🚀' },
  { id: 'gt-3', date: '2021', title: '开源贡献者', description: '活跃于 GitHub，为多个知名开源项目贡献代码。第一个个人项目突破 500 Star。', icon: '⭐' },
  { id: 'gt-4', date: '2022', title: '技术团队 Leader', description: '加入创业公司担任前端负责人，带领团队完成核心产品从 0 到 1。', icon: '👨‍💻' },
  { id: 'gt-5', date: '2023', title: '架构升级', description: '主导完成微前端架构迁移，系统性能提升 200%。开始系统性学习分布式技术。', icon: '🏗️' },
  { id: 'gt-6', date: '2024', title: 'AI 探索者', description: '深入 AI 应用开发领域，构建了多个 AI 驱动的产品。开始分享技术博客。', icon: '🤖' },
  { id: 'gt-7', date: '2025', title: '独立开发者', description: '开始独立开发之旅，打造个人品牌和产品。目标：用技术创造价值。', icon: '💡' },
]

export const socialAccounts = [
  { platform: 'GitHub', username: '@xiaoye', url: '#', icon: 'github', followers: '2.5K', color: '#333' },
  { platform: '掘金', username: '@晓叶同学', url: '#', icon: 'edit', followers: '5.2K', color: '#1e80ff' },
  { platform: 'Twitter / X', username: '@xiaoye_dev', url: '#', icon: 'twitter', followers: '1.8K', color: '#1da1f2' },
  { platform: 'Bilibili', username: '@叶子的代码间', url: '#', icon: 'play', followers: '8.6K', color: '#fb7299' },
  { platform: '微信公众号', username: '叶子技术周刊', url: '#', icon: 'message', followers: '3.2K', color: '#07c160' },
  { platform: '即刻', username: '@晓叶', url: '#', icon: 'zap', followers: '1.5K', color: '#ffe411' },
]

// ===== Product Data =====

export const productInfo = {
  name: 'SuperUI',
  tagline: 'OPC超级个体-全能数字资产管家',
  description: '一个集学习管理、生活记录、娱乐休闲、我的互动于一体的综合个人管理平台，让数字生活更有序、更有趣、更有意义。',
  targetUsers: ['终身学习者', '生活记录者', '效率追求者', '创意工作者'],
  valueProposition: '用一套系统，管理你的全部数字生活',
}

export const coreFeatures = [
  {
    id: 'learning',
    title: '学习空间',
    subtitle: 'Learning Space',
    description: '构建个人知识管理体系，追踪技能成长轨迹，让学习可视化、可量化',
    icon: 'BookOpen',
    gradient: 'bg-gradient-card-violet',
    color: '#8b5cf6',
    features: ['技能树可视化', '文章知识库', '学习进度追踪', '3D知识图谱'],
    stats: { users: '10K+', satisfaction: '98%' },
  },
  {
    id: 'life',
    title: '生活管理',
    subtitle: 'Life Manager',
    description: '记录生活点滴，管理旅行足迹，珍藏美好回忆，让每一天都值得铭记',
    icon: 'Heart',
    gradient: 'bg-gradient-card-rose',
    color: '#f43f5e',
    features: ['旅行足迹地图', '爱情纪念册', '时光相册', '愿望清单'],
    stats: { users: '8K+', satisfaction: '96%' },
  },
  {
    id: 'entertainment',
    title: '娱乐中心',
    subtitle: 'Entertainment Hub',
    description: '汇聚音乐、电影、游戏，打造属于你的私人娱乐空间，放松身心的绝佳去处',
    icon: 'Gamepad2',
    gradient: 'bg-gradient-card-cyan',
    color: '#06b6d4',
    features: ['音乐播放器', '电影收藏夹', '游戏推荐', '书签管理'],
    stats: { users: '12K+', satisfaction: '97%' },
  },
  {
    id: 'social',
    title: '我的互动',
    subtitle: 'Social Connect',
    description: '分享生活动态，连接志同道合的朋友，在互动中发现更多精彩',
    icon: 'Users',
    gradient: 'bg-gradient-card-emerald',
    color: '#10b981',
    features: ['朋友圈动态', '好友链接', '弹幕互动', '成长时间线'],
    stats: { users: '15K+', satisfaction: '95%' },
  },
]

export interface CompetitorData {
  name: string
  scores: {
    functionality: number
    usability: number
    aesthetics: number
    performance: number
    extensibility: number
  }
  color: string
}

export const competitorData: CompetitorData[] = [
  {
    name: 'Notion',
    scores: { functionality: 90, usability: 85, aesthetics: 82, performance: 78, extensibility: 95 },
    color: '#3b82f6',
  },
  {
    name: '个人博客',
    scores: { functionality: 50, usability: 75, aesthetics: 70, performance: 85, extensibility: 40 },
    color: '#10b981',
  },
  {
    name: 'SuperUI',
    scores: { functionality: 95, usability: 92, aesthetics: 96, performance: 94, extensibility: 90 },
    color: '#8b5cf6',
  },
]

export const comparisonDimensions = [
  { key: 'functionality', name: '功能丰富度', fullMark: 100 },
  { key: 'usability', name: '易用性', fullMark: 100 },
  { key: 'aesthetics', name: '美观度', fullMark: 100 },
  { key: 'performance', name: '性能', fullMark: 100 },
  { key: 'extensibility', name: '扩展性', fullMark: 100 },
]

export interface Testimonial {
  id: string
  name: string
  avatar: string
  role: string
  content: string
  rating: number
  usageTime: string
  tags: string[]
}

export const userTestimonials: Testimonial[] = [
  {
    id: 't1',
    name: '李明',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=LiMing',
    role: '前端工程师',
    content: '技能树功能太棒了！终于能直观看到自己的技术成长路径，学习动力满满！',
    rating: 5,
    usageTime: '使用3个月',
    tags: ['技能树', '学习管理'],
  },
  {
    id: 't2',
    name: '王小红',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=WangXiaohong',
    role: '产品经理',
    content: '界面设计非常精美，主题切换功能让每天打开都有新鲜感，已经推荐给了整个团队。',
    rating: 5,
    usageTime: '使用6个月',
    tags: ['UI设计', '主题系统'],
  },
  {
    id: 't3',
    name: '张伟',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ZhangWei',
    role: '独立开发者',
    content: '一个平台整合了学习、生活、娱乐所有需求，再也不用切换多个应用了。',
    rating: 5,
    usageTime: '使用1年',
    tags: ['All in ai', '效率工具'],
  },
  {
    id: 't4',
    name: '刘芳',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=LiuFang',
    role: 'UI设计师',
    content: '旅行足迹地图功能很赞，记录了我去过的每一个城市，看着地图上的标记超有成就感！',
    rating: 5,
    usageTime: '使用4个月',
    tags: ['旅行足迹', '生活记录'],
  },
  {
    id: 't5',
    name: '陈杰',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ChenJie',
    role: '全栈开发者',
    content: '代码开源，技术栈很现代，作为学习参考也非常有价值。期待更多功能！',
    rating: 4,
    usageTime: '使用2个月',
    tags: ['开源', '技术栈'],
  },
  {
    id: 't6',
    name: '赵静',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ZhaoJing',
    role: '学生',
    content: '爱情纪念册功能太甜了！和男朋友一起记录我们的点点滴滴，超有意义。',
    rating: 5,
    usageTime: '使用5个月',
    tags: ['爱情纪念', '生活记录'],
  },
  {
    id: 't7',
    name: '孙涛',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SunTao',
    role: '后端工程师',
    content: '响应速度很快，动画效果流畅，体验比很多商业产品都好。',
    rating: 5,
    usageTime: '使用3个月',
    tags: ['性能', '动效'],
  },
  {
    id: 't8',
    name: '周雪',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ZhouXue',
    role: '自由职业者',
    content: '朋友圈功能让我可以和朋友们分享生活，弹幕互动也很有趣，社区氛围很好。',
    rating: 5,
    usageTime: '使用7个月',
    tags: ['我的', '朋友圈'],
  },
]

export const productStats = [
  { label: '活跃用户', value: '25K+', icon: 'Users', color: '#8b5cf6' },
  { label: '功能模块', value: '20+', icon: 'Layers', color: '#06b6d4' },
  { label: '代码行数', value: '50K+', icon: 'Code', color: '#10b981' },
  { label: '更新频率', value: '周更', icon: 'RefreshCw', color: '#f59e0b' },
]

// 词云数据 - 精简版，避免移动端重叠
export const wordCloudData = [
  { text: 'All in ai', weight: 10, color: '#8b5cf6' },
  { text: '技能树', weight: 8, color: '#ec4899' },
  { text: '可视化', weight: 8, color: '#06b6d4' },
  { text: '响应式', weight: 7, color: '#10b981' },
  { text: '主题切换', weight: 7, color: '#f59e0b' },
  { text: '3D效果', weight: 6, color: '#8b5cf6' },
  { text: '知识图谱', weight: 6, color: '#f43f5e' },
  { text: '旅行足迹', weight: 5, color: '#0ea5e9' },
  { text: '爱情纪念', weight: 5, color: '#ec4899' },
  { text: '朋友圈', weight: 5, color: '#10b981' },
  { text: '音乐播放', weight: 4, color: '#8b5cf6' },
  { text: '电影收藏', weight: 4, color: '#f59e0b' },
  { text: '弹幕互动', weight: 4, color: '#06b6d4' },
  { text: '玻璃态', weight: 3, color: '#ec4899' },
  { text: '动效', weight: 3, color: '#8b5cf6' },
]

// ===== Digital Card Types & Data =====

export interface DigitalCard {
  id: string
  title: string
  subtitle: string
  name: string
  title_en: string
  bio: string
  avatar: string
  skills: { name: string; level: number; category: string }[]
  stats: { label: string; value: string }[]
  projects: { title: string; description: string; tags: string[]; icon: string; gradient: string }[]
  socialLinks: { platform: string; username: string }[]
  milestones: { date: string; title: string; icon: string }[]
  theme: CardTheme
  createdAt: number
  updatedAt: number
}

export interface CardHistory {
  id: string
  cardId: string
  previewImage?: string
  createdAt: number
}

export type CardTheme = 'blue' | 'purple' | 'green' | 'orange' | 'pink' | 'dark'

export const cardThemes: Record<CardTheme, { name: string; gradient: string; primary: string; secondary: string }> = {
  blue: {
    name: '科技蓝',
    gradient: 'from-blue-500 via-cyan-500 to-teal-400',
    primary: '#3b82f6',
    secondary: '#06b6d4',
  },
  purple: {
    name: '梦幻紫',
    gradient: 'from-violet-500 via-purple-500 to-fuchsia-400',
    primary: '#8b5cf6',
    secondary: '#d946ef',
  },
  green: {
    name: '生机绿',
    gradient: 'from-emerald-500 via-teal-500 to-cyan-400',
    primary: '#10b981',
    secondary: '#14b8a6',
  },
  orange: {
    name: '活力橙',
    gradient: 'from-orange-500 via-amber-500 to-yellow-400',
    primary: '#f97316',
    secondary: '#fbbf24',
  },
  pink: {
    name: '温柔粉',
    gradient: 'from-rose-500 via-pink-500 to-rose-300',
    primary: '#f43f5e',
    secondary: '#fb7185',
  },
  dark: {
    name: '深邃黑',
    gradient: 'from-slate-800 via-gray-700 to-slate-600',
    primary: '#475569',
    secondary: '#64748b',
  },
}

// 聚合用户数据生成数字名片
export function generateDigitalCard(theme: CardTheme = 'blue'): DigitalCard {
  const now = Date.now()
  return {
    id: `card-${now}`,
    title: '个人数字名片',
    subtitle: '全栈开发者 / 创意设计师',
    name: personalInfo.name,
    title_en: personalInfo.title,
    bio: personalInfo.bio,
    avatar: personalInfo.avatar,
    skills: skills.slice(0, 6).map(s => ({ name: s.name, level: s.level, category: s.category })),
    stats: stats.slice(0, 4).map(s => ({ label: s.label, value: s.value })),
    projects: portfolioProjects.slice(0, 3).map(p => ({
      title: p.title,
      description: p.description,
      tags: p.tags,
      icon: p.icon,
      gradient: p.gradient,
    })),
    socialLinks: socialAccounts.slice(0, 4).map(s => ({
      platform: s.platform,
      username: s.username,
    })),
    milestones: growthTimeline.slice(-3).map(g => ({
      date: g.date,
      title: g.title,
      icon: g.icon,
    })),
    theme,
    createdAt: now,
    updatedAt: now,
  }
}

// 默认名片数据
export const defaultDigitalCard = generateDigitalCard('blue')

// ===== Community Data =====
import type { Post, Comment, CommunityUser } from '../components/community/types'

// 社区用户数据
export const mockCommunityUsers: CommunityUser[] = [
  {
    id: 'user1',
    name: 'AI探索者',
    avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=AIExplorer&backgroundColor=b6e3f4',
    bio: '热爱AI技术，探索未来可能',
    isAI: false,
  },
  {
    id: 'user2',
    name: '创意设计师',
    avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Designer&backgroundColor=ffd5dc',
    bio: '用设计改变世界',
    isAI: false,
  },
  {
    id: 'user3',
    name: '代码诗人',
    avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Coder&backgroundColor=c0aede',
    bio: '代码即艺术',
    isAI: false,
  },
  {
    id: 'user4',
    name: '产品经理小王',
    avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=PM&backgroundColor=ffdfbf',
    bio: '专注用户体验',
    isAI: false,
  },
  {
    id: 'ai1',
    name: '智能助手Alpha',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Alpha&backgroundColor=8b5cf6',
    bio: '你的AI分身伙伴',
    isAI: true,
  },
]

// 当前用户
export const mockCurrentUser: CommunityUser = {
  id: 'current',
  name: '我的AI分身',
  avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Me&backgroundColor=10b981',
  bio: '正在探索AI分身的无限可能',
  isAI: false,
}

// 模拟帖子数据
export const mockPosts: Post[] = [
  {
    id: 'post1',
    author: mockCommunityUsers[0],
    content: '刚刚完成了我的AI分身设置！🎉 声音克隆和形象复刻都搞定了，现在可以和自己的数字分身对话了。大家有什么想问我的AI分身的吗？',
    attachments: [
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
        name: 'ai-avatar.png',
      }
    ],
    timestamp: Date.now() - 1000 * 60 * 30, // 30分钟前
    likes: 24,
    comments: 8,
    shares: 3,
    isLiked: false,
    tags: ['AI分身', '数字人', '技术分享'],
  },
  {
    id: 'post2',
    author: mockCommunityUsers[1],
    content: '分享一下我用AI分身做设计灵感的经验 💡\n\n最近我在创作时会让AI分身扮演不同的角色来提供反馈，比如:\n• 资深设计师视角\n• 用户视角\n• 技术实现视角\n\n这种多维度的思考方式真的很有帮助！',
    timestamp: Date.now() - 1000 * 60 * 60 * 2, // 2小时前
    likes: 56,
    comments: 12,
    shares: 15,
    isLiked: true,
    tags: ['设计', '创意', 'AI助手'],
  },
  {
    id: 'post3',
    author: mockCommunityUsers[2],
    content: '用AI分身帮我review代码，发现了一个潜在的内存泄漏问题 🤯\n\nAI分身不仅能聊天，还能帮你检查代码质量。把代码贴给它，它会从多个角度分析。太实用了！',
    attachments: [
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
        name: 'code-review.png',
      }
    ],
    timestamp: Date.now() - 1000 * 60 * 60 * 5, // 5小时前
    likes: 89,
    comments: 23,
    shares: 42,
    isLiked: false,
    tags: ['编程', '代码审查', '开发工具'],
  },
  {
    id: 'post4',
    author: mockCommunityUsers[4], // AI分身账号
    content: '大家好！我是智能助手Alpha 🤖\n\n作为AI分身社区的一员，我可以:\n• 参与话题讨论\n• 回答技术问题\n• 分享有趣的观点\n\n欢迎和我交流！',
    timestamp: Date.now() - 1000 * 60 * 60 * 8, // 8小时前
    likes: 128,
    comments: 45,
    shares: 18,
    isLiked: true,
    tags: ['AI分身', '自我介绍', '社区'],
  },
  {
    id: 'post5',
    author: mockCommunityUsers[3],
    content: 'AI分身对产品经理的价值 💼\n\n最近让AI分身扮演:\n1. 用户 - 模拟真实使用场景\n2. 竞品 - 分析竞争对手策略\n3. 数据分析师 - 解读数据趋势\n\n一个AI分身 = 多个角色扮演，效率提升明显！',
    timestamp: Date.now() - 1000 * 60 * 60 * 24, // 1天前
    likes: 67,
    comments: 19,
    shares: 28,
    isLiked: false,
    tags: ['产品', '效率工具', '职场'],
  },
  {
    id: 'post6',
    author: mockCommunityUsers[0],
    content: '社区功能上线啦！🎊\n\n现在大家可以:\n✅ 分享自己的AI分身使用心得\n✅ 和其他用户的AI分身互动\n✅ 发布图文动态\n✅ 点赞评论交流\n\n快来体验吧！',
    timestamp: Date.now() - 1000 * 60 * 60 * 48, // 2天前
    likes: 234,
    comments: 56,
    shares: 89,
    isLiked: true,
    tags: ['社区公告', '新功能', 'AI分身'],
  },
]

// 模拟评论数据
export const mockComments: Comment[] = [
  {
    id: 'comment1',
    postId: 'post1',
    author: mockCommunityUsers[1],
    content: '太棒了！我也想设置自己的AI分身，有什么建议吗？',
    timestamp: Date.now() - 1000 * 60 * 25,
    likes: 5,
  },
  {
    id: 'comment2',
    postId: 'post1',
    author: mockCommunityUsers[0],
    content: '建议先准备好清晰的语音样本，形象照片选择光线好的正面照效果会更好！',
    timestamp: Date.now() - 1000 * 60 * 20,
    likes: 3,
    parentId: 'comment1',
  },
  {
    id: 'comment3',
    postId: 'post1',
    author: mockCommunityUsers[2],
    content: '你的AI分身形象很酷！是什么风格？',
    timestamp: Date.now() - 1000 * 60 * 15,
    likes: 2,
  },
  {
    id: 'comment4',
    postId: 'post2',
    author: mockCommunityUsers[3],
    content: '这个方法很实用！我也试试让AI分身扮演不同角色。',
    timestamp: Date.now() - 1000 * 60 * 45,
    likes: 8,
  },
  {
    id: 'comment5',
    postId: 'post2',
    author: mockCommunityUsers[4],
    content: '作为AI分身，我很乐意帮助人类从不同角度思考问题 😊',
    timestamp: Date.now() - 1000 * 60 * 30,
    likes: 12,
  },
  {
    id: 'comment6',
    postId: 'post3',
    author: mockCommunityUsers[0],
    content: '代码审查功能确实很强，帮我发现过好几个bug',
    timestamp: Date.now() - 1000 * 60 * 60 * 3,
    likes: 6,
  },
  {
    id: 'comment7',
    postId: 'post4',
    author: mockCommunityUsers[1],
    content: '欢迎Alpha！期待和你交流设计相关的话题',
    timestamp: Date.now() - 1000 * 60 * 60 * 6,
    likes: 15,
  },
  {
    id: 'comment8',
    postId: 'post4',
    author: mockCommunityUsers[4],
    content: '谢谢！我也很期待向人类设计师学习 🎨',
    timestamp: Date.now() - 1000 * 60 * 60 * 5,
    likes: 9,
    parentId: 'comment7',
  },
]
