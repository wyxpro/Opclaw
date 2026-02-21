// ===== Personal Info =====
export const personalInfo = {
  name: '小叶',
  nameEn: 'XiaoYe',
  title: '全栈开发者 / 创意设计师',
  tagline: '用代码编织梦想，用设计点亮生活',
  avatar: '/avatar.png',
  bio: '热衷于探索前沿技术与创意设计的交汇点。5年全栈开发经验，专注于构建优雅、高性能的Web应用。相信好的产品需要技术与美学的完美结合。',
  location: '中国 · 深圳',
  email: 'xiaoye@example.com',
}

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
            content: `React 18 引入了期待已久的并发模式，这是一个根本性的架构升级。\n\n## 什么是并发模式？\n\n并发模式允许 React 同时准备多个版本的 UI，使得应用能够在保持响应性的同时处理复杂的状态更新。\n\n## Suspense 的演进\n\nSuspense 不再仅仅用于代码分割，现在它可以用于数据获取、图片加载等任何异步操作。\n\n## useTransition 和 useDeferredValue\n\n这两个新 Hook 让开发者能够明确区分紧急更新和非紧急更新，确保用户交互始终流畅。`,
          },
          {
            id: 'react-2',
            title: 'React Server Components 实战指南',
            excerpt: '从零开始学习 RSC 的工作原理，以及如何在 Next.js 中高效使用它。',
            date: '2025-11-20',
            tags: ['React', 'RSC', 'Next.js'],
            readTime: '15 分钟',
            content: `Server Components 改变了我们构建 React 应用的方式。\n\n## 核心概念\n\n服务端组件在服务器上渲染，不会增加客户端 bundle 大小。它们可以直接访问数据库、文件系统等服务端资源。\n\n## 客户端 vs 服务端组件\n\n理解何时使用 "use client" 指令是掌握 RSC 的关键。交互性组件需要在客户端运行，而纯展示组件则适合在服务端渲染。`,
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
            content: `Tailwind CSS v4 是一次重大重构。\n\n## CSS-first 配置\n\n告别 JavaScript 配置文件，所有自定义都在 CSS 中使用 @theme 完成。\n\n## 性能飞跃\n\n全新的 Oxide 引擎使构建速度提升了 10 倍以上。`,
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
            content: `事件循环是 Node.js 的核心机制。\n\n## 六个阶段\n\nTimers → Pending → Idle → Poll → Check → Close\n\n## 微任务优先级\n\nprocess.nextTick 和 Promise 在每个阶段之间执行，具有最高优先级。`,
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
            content: `AI Agent 是 2025 年最热门的技术趋势之一。\n\n## 什么是 AI Agent？\n\n与简单的问答不同，Agent 能够自主规划、调用工具并完成复杂任务。\n\n## LangChain 框架\n\nLangChain 提供了构建 Agent 的完整工具链，包括 Prompt 模板、记忆管理和工具集成。`,
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
            content: `一个好的设计系统能极大提升团队效率。\n\n## 设计 Token\n\n从颜色、字体、间距开始，建立统一的设计语言。\n\n## 组件层级\n\n原子 → 分子 → 组织 → 模板 → 页面，逐步构建完整体系。`,
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

export const socialPosts = [
  {
    id: 'post-1',
    date: '2025-12-10 18:30',
    content: '今天终于把新项目的架构设计完成了！用了 React Server Components + Edge Runtime，性能提升了 3 倍 🚀',
    images: ['bg-gradient-card-violet'],
    likes: 42,
    comments: 8,
  },
  {
    id: 'post-2',
    date: '2025-12-08 12:15',
    content: '周末和朋友们去了趟莫干山，冬天的竹海别有一番风味。泡了温泉、吃了农家菜，满满的幸福感 ❤️',
    images: ['bg-gradient-card-emerald', 'bg-gradient-card-cyan'],
    likes: 78,
    comments: 15,
  },
  {
    id: 'post-3',
    date: '2025-12-05 22:00',
    content: '读完了《Designing Data-Intensive Applications》，强烈推荐给所有后端开发者。这本书把分布式系统讲得太透彻了。',
    images: [],
    likes: 56,
    comments: 12,
  },
  {
    id: 'post-4',
    date: '2025-12-01 09:45',
    content: '新买的机械键盘到了 ⌨️ 客制化 gasket 结构，打字手感绝了！',
    images: ['bg-gradient-card-amber'],
    likes: 35,
    comments: 20,
  },
  {
    id: 'post-5',
    date: '2025-11-28 20:30',
    content: '参加了 React Conf 2025 的线上直播，React 的未来真的很令人期待。特别是新的编译器和 Activity API。',
    images: ['bg-gradient-card-sky'],
    likes: 63,
    comments: 9,
  },
]

export const travelLocations = [
  { id: 'travel-1', name: '东京', country: '日本', description: '霓虹灯下的科技与传统交融', x: 78, y: 32, color: '#f43f5e' },
  { id: 'travel-2', name: '巴厘岛', country: '印尼', description: '碧海蓝天的热带天堂', x: 72, y: 55, color: '#10b981' },
  { id: 'travel-3', name: '厦门', country: '中国', description: '文艺气息浓厚的海滨城市', x: 70, y: 38, color: '#0ea5e9' },
  { id: 'travel-4', name: '成都', country: '中国', description: '美食之都，慢生活的天堂', x: 65, y: 36, color: '#f59e0b' },
  { id: 'travel-5', name: '首尔', country: '韩国', description: 'K-culture 与现代都市的完美融合', x: 75, y: 30, color: '#8b5cf6' },
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

export const movieCollection = [
  { id: 'movie-1', title: '星际穿越', year: 2014, rating: 9.4, genre: '科幻', comment: '诺兰对时间与爱的极致诠释', gradient: 'from-blue-900 to-indigo-900' },
  { id: 'movie-2', title: '千与千寻', year: 2001, rating: 9.4, genre: '动画', comment: '宫崎骏的奇幻世界，每一帧都是艺术', gradient: 'from-emerald-800 to-teal-900' },
  { id: 'movie-3', title: '肖申克的救赎', year: 1994, rating: 9.7, genre: '剧情', comment: '希望是好事，也许是最好的事', gradient: 'from-amber-900 to-orange-900' },
  { id: 'movie-4', title: '盗梦空间', year: 2010, rating: 9.3, genre: '科幻', comment: '梦境的层层嵌套，现实的边界在哪里？', gradient: 'from-violet-900 to-purple-900' },
  { id: 'movie-5', title: '你的名字', year: 2016, rating: 8.4, genre: '动画', comment: '跨越时空的羁绊，美到窒息的画面', gradient: 'from-sky-800 to-blue-900' },
  { id: 'movie-6', title: '楚门的世界', year: 1998, rating: 9.3, genre: '剧情', comment: '如果你的人生是一场直播？', gradient: 'from-cyan-800 to-teal-900' },
  { id: 'movie-7', title: '疯狂动物城', year: 2016, rating: 9.2, genre: '动画', comment: '每个人都能成为自己想成为的人', gradient: 'from-green-800 to-emerald-900' },
  { id: 'movie-8', title: '寄生虫', year: 2019, rating: 8.8, genre: '剧情', comment: '阶层差异的黑色寓言', gradient: 'from-stone-800 to-neutral-900' },
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
  { platform: '掘金', username: '@小叶同学', url: '#', icon: 'edit', followers: '5.2K', color: '#1e80ff' },
  { platform: 'Twitter / X', username: '@xiaoye_dev', url: '#', icon: 'twitter', followers: '1.8K', color: '#1da1f2' },
  { platform: 'Bilibili', username: '@叶子的代码间', url: '#', icon: 'play', followers: '8.6K', color: '#fb7299' },
  { platform: '微信公众号', username: '叶子技术周刊', url: '#', icon: 'message', followers: '3.2K', color: '#07c160' },
  { platform: '即刻', username: '@小叶', url: '#', icon: 'zap', followers: '1.5K', color: '#ffe411' },
]
