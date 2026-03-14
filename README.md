# 🌿 晓叶的个人空间 - SuperUI

> 一个现代化的全栈个人主页项目，融合技术博客、生活记录与社交互动的数字花园

---

## 📋 项目简介

这是一个基于 React + TypeScript + Tailwind CSS 构建的现代化个人主页应用。项目采用模块化设计，包含五大核心功能模块：首页展示、学习知识库、生活记录、娱乐空间和社交互动。支持 5 种主题风格一键切换，拥有流畅的页面动画和完善的响应式设计。

### ✨ 核心特性

- 🎨 **多主题系统** - 5 种精心设计的主题风格（极简/赛博/艺术/童趣/复古）
- 📱 **响应式设计** - 完美适配桌面端和移动端，移动端底部导航栏
- ✨ **流畅动画** - 基于 Framer Motion 的页面切换和交互动画
- 🌙 **深浅色模式** - 自动适配系统主题偏好
- ⚡ **高性能构建** - Vite 7.3 提供极速的开发和构建体验
- 🎯 **模块化架构** - 清晰的代码组织和可维护性
- 🔧 **可定制化** - 丰富的配置选项和扩展能力

---

## 🛠️ 技术栈

### 前端框架与库

| 技术 | 版本 | 用途 |
|------|------|------|
| React | 19.2.0 | UI 框架 |
| React Router | 7.13.0 | 路由管理 |
| TypeScript | 5.9.3 | 类型安全 |
| Tailwind CSS | 4.1.18 | 样式框架 |
| Vite | 7.3.1 | 构建工具 |

### UI 与交互

| 技术 | 版本 | 用途 |
|------|------|------|
| Framer Motion | 12.34.1 | 动画库 |
| Lucide React | 0.574.0 | 图标库 |
| class-variance-authority | 0.7.1 | 样式变体管理 |
| clsx | 2.1.1 | 类名工具 |
| tailwind-merge | 3.4.1 | Tailwind 类名合并 |


### 可视化与富文本

| 技术 | 版本 | 用途 |
|------|------|------|
| ECharts | 6.0.0 | 数据可视化 |
| echarts-for-react | 3.0.6 | ECharts React 封装 |
| Three.js | 0.183.1 | 3D 渲染 |
| @react-three/fiber | 9.5.0 | Three.js React 集成 |
| @react-three/drei | 10.7.7 | Three.js 辅助工具 |
| TipTap | 3.20.0 | 富文本编辑器 |
| html2canvas | 1.4.1 | 截图功能 |

### 开发工具

| 技术 | 版本 | 用途 |
|------|------|------|
| ESLint | 9.39.1 | 代码检查 |
| TypeScript ESLint | 8.48.0 | TS 代码检查 |

---

## 🏗️ 项目架构

### 整体架构图

```
┌─────────────────────────────────────────────────────────────┐
│                         App.tsx                             │
│         (ThemeProvider + SettingsProvider + Router)         │
└────────────────────────┬────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        ▼                ▼                ▼
   ┌─────────┐      ┌─────────┐     ┌──────────────┐
   │ Navbar  │      │  Pages  │     │ UI Components│
   │ (导航栏) │      │ (页面层) │     │  (UI组件层)  │
   └─────────┘      └────┬────┘     └──────────────┘
                         │
    ┌────────────────────┼────────────────────┐
    ▼         ▼          ▼          ▼         ▼
┌────────┐┌──────┐┌──────────┐┌────────┐┌────────┐
│  Home  ││Learn.││   Life   ││Entert. ││ Social │
│ (首页) ││(学习)││  (生活)  ││ (娱乐) ││ (社交) │
└────────┘└──────┘└──────────┘└────────┘└────────┘
                         │
              ┌──────────┴──────────┐
              ▼                     ▼
        ┌──────────┐          ┌──────────┐
        │ Contexts │          │   Data   │
        │ (状态层)  │          │ (数据层)  │
        └──────────┘          └──────────┘
```

### 技术架构分层

1. **展示层 (Presentation Layer)**
   - Pages: 页面组件
   - Components: 可复用组件
   - UI: 基础 UI 组件

2. **业务逻辑层 (Business Logic Layer)**
   - Contexts: 全局状态管理（主题、设置）
   - Hooks: 自定义 React Hooks

3. **数据层 (Data Layer)**
   - mock.ts: 模拟数据
   - 未来可扩展为 API 调用

4. **工具层 (Utility Layer)**
   - lib/utils.ts: 通用工具函数
   - lib/themes.ts: 主题配置
   - lib/cardUtils.ts: 卡片工具

---

## 📁 目录结构

```
temp-project/
├── public/                      # 静态资源
│   ├── avatar.png              # 用户头像
│   └── vite.svg                # Vite 图标
├── src/
│   ├── components/             # 组件目录
│   │   ├── layout/            # 布局组件
│   │   │   └── Navbar.tsx     # 响应式导航栏
│   │   ├── learning/          # 学习模块组件
│   │   │   ├── ArticleEditor.tsx      # 文章编辑器
│   │   │   └── DocumentImport.tsx     # 文档导入
│   │   ├── love/              # 生活模块组件
│   │   │   ├── BlessingBoard.tsx      # 祝福墙
│   │   │   ├── TimeAlbum.tsx          # 时光相册
│   │   │   └── WishList.tsx           # 愿望清单
│   │   ├── ui/                # 基础 UI 组件
│   │   │   ├── PageTransition.tsx     # 页面切换动画
│   │   │   ├── ThemeSwitcher.tsx      # 主题切换器
│   │   │   ├── StarCursor.tsx         # 星星鼠标特效
│   │   │   ├── SkillTreeView.tsx      # 技能树视图
│   │   │   ├── SettingsModal.tsx      # 设置弹窗
│   │   │   └── CursorEffectToggle.tsx # 鼠标特效开关
│   │   ├── ChinaMap.tsx       # 中国地图组件
│   │   ├── TravelManager.tsx  # 旅行管理
│   │   ├── TravelDetailModal.tsx      # 旅行详情弹窗
│   │   ├── LoveDetailModal.tsx        # 恋爱详情弹窗
│   │   └── ProfileEditModal.tsx       # 个人资料编辑
│   ├── contexts/              # 全局状态管理
│   │   ├── ThemeContext.tsx   # 主题上下文
│   │   └── SettingsContext.tsx # 设置上下文
│   ├── data/                  # 数据层
│   │   ├── mock.ts            # 模拟数据（个人信息、文章、旅行等）
│   │   └── skillTree.ts       # 技能树数据
│   ├── hooks/                 # 自定义 Hooks
│   │   ├── useTheme.ts        # 主题 Hook
│   │   └── useSettings.ts     # 设置 Hook
│   ├── lib/                   # 工具库
│   │   ├── themes.ts          # 主题配置（5种主题）
│   │   ├── utils.ts           # 通用工具函数
│   │   └── cardUtils.ts       # 卡片工具函数
│   ├── pages/                 # 页面组件
│   │   ├── Home.tsx           # 首页
│   │   ├── Learning.tsx       # 学习页
│   │   ├── Life.tsx           # 生活页
│   │   ├── Entertainment.tsx  # 娱乐页
│   │   └── Social.tsx         # 社交页
│   ├── App.tsx                # 根组件
│   ├── main.tsx               # 应用入口
│   └── index.css              # 全局样式
├── .vercel/                   # Vercel 配置
├── dist/                      # 构建输出目录
├── node_modules/              # 依赖包
├── index.html                 # HTML 模板
├── package.json               # 项目配置
├── tsconfig.json              # TypeScript 配置
├── vite.config.ts             # Vite 配置
├── vercel.json                # Vercel 部署配置
├── eslint.config.js           # ESLint 配置
└── README.md                  # 项目说明
```

---

## ⚡ 核心功能模块

### 🏠 首页 (Home)

**功能概述**
- 个人简介与头像展示
- 技能标签云（按分类展示：前端、后端、DevOps、设计、探索）
- 精选作品卡片墙（6个项目展示）
- 数据统计展示（项目经验、开源贡献、技术文章、获得Star）

**技术实现**
- 使用 Framer Motion 实现卡片动画
- 响应式网格布局
- 渐变色卡片设计

**数据来源**: `src/data/mock.ts` - `personalInfo`, `skills`, `portfolioProjects`, `stats`

---

### 📚 学习 (Learning)

**功能概述**
- 树形目录导航（分类 → 系列 → 文章）
- 文章搜索与筛选功能
- 文章详情阅读（支持 Markdown）
- 目录索引与锚点跳转
- 文章编辑器（TipTap 富文本编辑）
- 文档导入功能

**技术实现**
- 三栏布局：目录树 + 文章列表 + 文章详情
- TipTap 富文本编辑器集成
- 文章分类系统：前端开发、后端技术、AI 探索、设计思维
- 阅读时间估算

**数据来源**: `src/data/mock.ts` - `learningCategories`

**核心组件**:
- `ArticleEditor.tsx` - 文章编辑器
- `DocumentImport.tsx` - 文档导入

---

### 💕 生活 (Life)

**功能概述**
- **恋爱时间线** - 实时倒计时，记录重要时刻
- **朋友圈动态** - 类似微信朋友圈的动态流
  - 支持图片（1-9张）和视频
  - 点赞和评论功能
  - 地理位置标记
- **旅拍足迹** - 中国地图标记旅行地点
  - 交互式地图
  - 旅行详情弹窗
  - 图片轮播展示
- **时光相册** - 照片管理
- **祝福墙** - 留言板功能
- **愿望清单** - 目标管理

**技术实现**
- 自定义中国地图组件（SVG）
- 图片九宫格布局算法
- 时间线组件
- 模态弹窗组件

**数据来源**: `src/data/mock.ts` - `loveTimeline`, `socialPosts`, `travelLocations`

**核心组件**:
- `ChinaMap.tsx` - 中国地图
- `TravelManager.tsx` - 旅行管理
- `BlessingBoard.tsx` - 祝福墙
- `TimeAlbum.tsx` - 时光相册
- `WishList.tsx` - 愿望清单

---

### 🎵 娱乐 (Entertainment)

**功能概述**
- **音乐播放器** - 黑胶唱片风格
  - 播放列表管理
  - 播放控制（播放/暂停/上一首/下一首）
  - 进度条控制
- **电影收藏墙** - 电影海报展示
  - 评分和评论
  - 电影详情弹窗
- **百宝箱** - 书签管理
  - 分类管理（开发工具、设计资源、学习资源、效率工具、金句收藏）
  - 快速访问

**技术实现**
- 音频播放 API
- 卡片网格布局
- 分类标签系统

**数据来源**: `src/data/mock.ts` - `musicPlaylist`, `movieCollection`, `bookmarks`

---

### 👥 社交 (Social)

**功能概述**
- **友情链接** - 好友展示
  - 头像和简介
  - 外链跳转
- **留言墙** - 弹幕风格留言
  - 实时滚动效果
  - 彩色弹幕
- **成长时间轴** - 个人成长历程
  - 时间线展示
  - 里程碑标记
- **自媒体矩阵** - 社交账号卡片
  - GitHub、掘金、Twitter、Bilibili 等
  - 粉丝数展示

**技术实现**
- 弹幕动画效果
- 时间线组件
- 社交卡片布局

**数据来源**: `src/data/mock.ts` - `friendLinks`, `danmakuMessages`, `growthTimeline`, `socialAccounts`

---

## 🎨 主题系统详解

项目内置 5 种精心设计的主题风格，每种主题都有独特的视觉风格和配色方案。

### 主题列表

| 主题 | 标识 | 描述 | 主色调 | 适用场景 |
|------|------|------|--------|----------|
| ◐ 极简 | `minimal` | 白色米色调，简洁线条 | 白色/米色 | 专注阅读和工作 |
| ◉ 赛博 | `cyber` | 深蓝黑底，霓虹蓝紫 | 蓝色/紫色 | 科技感展示 |
| ❋ 艺术 | `artistic` | 柔和渐变，优雅字体 | 粉色/紫色 | 创意展示 |
| ✿ 童趣 | `playful` | 明亮活泼，圆润边角 | 多彩 | 轻松愉快氛围 |
| ✤ 复古 | `vintage` | 暖黄棕色，老式排版 | 黄色/棕色 | 怀旧风格 |

### 主题切换方式

1. **快捷键**: `Shift + Q` 循环切换主题
2. **UI 切换**: 点击页面右下角的主题切换浮窗
3. **自动保存**: 主题选择会自动保存到 localStorage

### 主题配置结构

每个主题包含以下配置项：

```typescript
interface ThemeConfig {
  name: string              // 主题名称
  colors: {                 // 颜色配置
    bg: string             // 背景色
    bgAlt: string          // 次要背景色
    surface: string        // 表面色
    card: string           // 卡片背景
    primary: string        // 主色
    accent: string         // 强调色
    text: string           // 文本色
    border: string         // 边框色
    // ... 更多颜色
  }
  fonts: {                  // 字体配置
    sans: string           // 无衬线字体
    mono: string           // 等宽字体
  }
  borderRadius: {           // 圆角配置
    sm: string
    md: string
    lg: string
    xl: string
  }
  shadows: {                // 阴影配置
    glow: string
    card: string
    cardHover: string
    float: string
  }
  glassEffect: {            // 玻璃态效果
    background: string
    border: string
    backdropBlur: string
  }
}
```

### 自定义主题

要添加新主题，编辑 `src/lib/themes.ts`:

```typescript
export const themes: Record<ThemeType, ThemeConfig> = {
  // ... 现有主题
  myTheme: {
    name: '我的主题',
    colors: {
      // 自定义颜色
    },
    // ... 其他配置
  }
}
```

---

## 🔧 核心工作流程

### 1. 应用启动流程

```
用户访问 → index.html 加载
    ↓
main.tsx 初始化
    ↓
App.tsx 渲染
    ↓
ThemeProvider 初始化（从 localStorage 读取主题）
    ↓
SettingsProvider 初始化（读取用户设置）
    ↓
Router 初始化（根据 URL 渲染对应页面）
    ↓
Navbar 渲染（导航栏）
    ↓
Page 组件渲染（首页/学习/生活/娱乐/社交）
```

### 2. 主题切换流程

```
用户触发切换（快捷键/UI点击）
    ↓
ThemeContext.setTheme() 调用
    ↓
设置过渡动画状态
    ↓
更新 currentTheme 状态
    ↓
保存到 localStorage
    ↓
useEffect 监听到变化
    ↓
应用 CSS 变量到 :root
    ↓
更新 body 样式
    ↓
结束过渡动画
```

### 3. 页面路由流程

```
用户点击导航
    ↓
React Router 拦截
    ↓
AnimatePresence 检测路由变化
    ↓
触发退出动画（当前页面）
    ↓
卸载当前页面组件
    ↓
加载新页面组件
    ↓
触发进入动画（新页面）
    ↓
渲染完成
```

### 4. 数据加载流程

```
页面组件挂载
    ↓
从 mock.ts 导入数据
    ↓
useState 初始化状态
    ↓
渲染数据到 UI
    ↓
用户交互（筛选/搜索/编辑）
    ↓
更新本地状态
    ↓
重新渲染
```

---

## ⚙️ 部署指南

### 本地开发

#### 环境要求

- Node.js >= 18.0.0
- npm >= 9.0.0 或 yarn >= 1.22.0

#### 安装依赖

```bash
# 使用 npm
npm install

# 或使用 yarn
yarn install
```

#### 启动开发服务器

```bash
# 使用 npm
npm run dev

# 或使用 yarn
yarn dev
```

开发服务器将在 `http://localhost:5173` 启动。

#### 构建生产版本

```bash
# 使用 npm
npm run build

# 或使用 yarn
yarn build
```

构建产物将输出到 `dist/` 目录。

#### 预览生产构建

```bash
# 使用 npm
npm run preview

# 或使用 yarn
yarn preview
```

#### 代码检查

```bash
# 使用 npm
npm run lint

# 或使用 yarn
yarn lint
```

---

### 部署到 Vercel

#### 方式一：通过 Vercel CLI

1. 安装 Vercel CLI

```bash
npm i -g vercel
```

2. 登录 Vercel

```bash
vercel login
```

3. 部署项目

```bash
# 部署到预览环境
vercel

# 部署到生产环境
vercel --prod
```

#### 方式二：通过 Git 集成

1. 将代码推送到 GitHub/GitLab/Bitbucket
2. 在 [Vercel Dashboard](https://vercel.com/dashboard) 导入项目
3. Vercel 会自动检测 Vite 项目并配置构建设置
4. 点击 Deploy 即可完成部署

#### Vercel 配置说明

项目已包含 `vercel.json` 配置文件：

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

此配置确保所有路由都指向 `index.html`，支持 React Router 的客户端路由。

---

### 部署到其他平台

#### Netlify

1. 在 Netlify Dashboard 导入项目
2. 构建命令: `npm run build`
3. 发布目录: `dist`
4. 添加 `_redirects` 文件到 `public/` 目录:

```
/*    /index.html   200
```

#### GitHub Pages

1. 修改 `vite.config.ts` 添加 base 路径:

```typescript
export default defineConfig({
  base: '/your-repo-name/',
  plugins: [react(), tailwindcss()],
})
```

2. 构建并部署:

```bash
npm run build
npx gh-pages -d dist
```

#### Docker 部署

创建 `Dockerfile`:

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

创建 `nginx.conf`:

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

构建和运行:

```bash
docker build -t my-personal-site .
docker run -p 80:80 my-personal-site
```

---

## 📦 数据结构与 API

### 数据模型

项目使用 TypeScript 接口定义数据结构，所有数据存储在 `src/data/mock.ts` 中。

#### 个人信息 (PersonalInfo)

```typescript
{
  name: string              // 姓名
  nameEn: string           // 英文名
  title: string            // 职位/头衔
  tagline: string          // 标语
  avatar: string           // 头像 URL
  bio: string              // 个人简介
  location: string         // 地理位置
  email: string            // 邮箱
}
```

#### 技能 (Skill)

```typescript
{
  name: string             // 技能名称
  level: number            // 熟练度 (0-100)
  category: string         // 分类（前端/后端/DevOps/设计/探索）
}
```

#### 文章 (Article)

```typescript
{
  id: string               // 唯一标识
  title: string            // 标题
  excerpt: string          // 摘要
  date: string             // 发布日期
  tags: string[]           // 标签
  content: string          // 正文内容（Markdown）
  readTime: string         // 阅读时间
  coverImage?: string      // 封面图（可选）
}
```

#### 朋友圈动态 (SocialPost)

```typescript
{
  id: string               // 唯一标识
  author: string           // 作者
  avatar: string           // 头像
  date: string             // 发布时间
  content: string          // 动态内容
  images: string[]         // 图片数组（0-9张）
  video?: {                // 视频（可选）
    url: string
    thumbnail: string
    duration: string
  }
  likes: number            // 点赞数
  isLiked: boolean         // 是否已点赞
  comments: PostComment[]  // 评论列表
  location?: string        // 地理位置（可选）
}
```

#### 旅行地点 (TravelLocation)

```typescript
{
  id: string               // 唯一标识
  name: string             // 地点名称
  country: string          // 国家
  description: string      // 描述
  x: number                // 地图 X 坐标 (%)
  y: number                // 地图 Y 坐标 (%)
  color: string            // 标记颜色
  images: string[]         // 图片数组
  details: {
    bestTime: string       // 最佳旅行时间
    highlights: string[]   // 亮点
    tips: string           // 旅行建议
  }
}
```

#### 电影 (Movie)

```typescript
{
  id: string               // 唯一标识
  title: string            // 电影名称
  year: number             // 上映年份
  rating: number           // 评分 (0-10)
  genre: string            // 类型
  comment: string          // 个人评价
  poster: string           // 海报 URL
  description: string      // 剧情简介
  director: string         // 导演
}
```

---

### 数据扩展指南

#### 添加新文章

编辑 `src/data/mock.ts`，在 `learningCategories` 中添加：

```typescript
{
  id: 'new-article-id',
  title: '新文章标题',
  excerpt: '文章摘要',
  date: '2025-12-25',
  tags: ['标签1', '标签2'],
  readTime: '10 分钟',
  coverImage: 'https://example.com/cover.jpg',
  content: `
## 标题

文章内容（支持 Markdown）
  `
}
```

#### 添加旅行地点

在 `travelLocations` 数组中添加：

```typescript
{
  id: 'travel-new',
  name: '新地点',
  country: '中国',
  description: '地点描述',
  x: 50,  // 地图横坐标百分比
  y: 50,  // 地图纵坐标百分比
  color: '#ff0000',
  images: ['图片URL1', '图片URL2'],
  details: {
    bestTime: '最佳时间',
    highlights: ['亮点1', '亮点2'],
    tips: '旅行建议'
  }
}
```

#### 修改个人信息

编辑 `personalInfo` 对象：

```typescript
export const personalInfo = {
  name: '你的名字',
  nameEn: 'YourName',
  title: '你的职位',
  tagline: '你的标语',
  avatar: '/your-avatar.png',
  bio: '你的简介',
  location: '你的位置',
  email: 'your@email.com',
}
```

---

### 未来 API 集成

项目当前使用静态数据，未来可以集成后端 API：

#### 推荐技术栈

- **后端框架**: Node.js + Express / Nest.js / Fastify
- **数据库**: PostgreSQL / MongoDB / Supabase
- **认证**: JWT / OAuth 2.0
- **文件存储**: AWS S3 / Cloudinary / 阿里云 OSS

#### API 设计示例

```typescript
// 获取文章列表
GET /api/articles?category=前端开发&page=1&limit=10

// 获取文章详情
GET /api/articles/:id

// 创建文章
POST /api/articles
Body: { title, content, tags, ... }

// 更新文章
PUT /api/articles/:id
Body: { title, content, ... }

// 删除文章
DELETE /api/articles/:id

// 获取旅行地点
GET /api/travels

// 获取朋友圈动态
GET /api/posts?page=1&limit=20

// 点赞动态
POST /api/posts/:id/like

// 评论动态
POST /api/posts/:id/comments
Body: { content }
```

---

## 💡 常见问题 (FAQ)

### 基础问题

#### Q1: 如何修改网站标题和描述？

编辑 `index.html` 文件：

```html
<title>你的网站标题</title>
<meta name="description" content="你的网站描述" />
```

#### Q2: 如何更换头像？

1. 将新头像放到 `public/` 目录
2. 编辑 `src/data/mock.ts` 中的 `personalInfo.avatar`
3. 或者使用在线图片 URL

```typescript
avatar: '/my-avatar.png'  // 本地图片
// 或
avatar: 'https://example.com/avatar.jpg'  // 在线图片
```

#### Q3: 如何添加新的导航页面？

1. 在 `src/pages/` 创建新页面组件
2. 在 `src/App.tsx` 添加路由
3. 在 `src/components/layout/Navbar.tsx` 添加导航链接

```typescript
// App.tsx
<Route path="/new-page" element={<NewPage />} />

// Navbar.tsx
<Link to="/new-page">新页面</Link>
```

---

### 主题相关

#### Q4: 如何自定义主题颜色？

编辑 `src/lib/themes.ts`，修改对应主题的 `colors` 配置：

```typescript
minimal: {
  name: '极简',
  colors: {
    primary: '#your-color',  // 修改主色
    // ... 其他颜色
  }
}
```

#### Q5: 如何禁用主题切换功能？

在 `src/App.tsx` 中移除 `ThemeSwitcher` 组件，或在 `ThemeContext.tsx` 中注释掉快捷键监听代码。

#### Q6: 主题保存在哪里？

主题选择保存在浏览器的 `localStorage` 中，键名为 `site-theme`。

---

### 功能相关

#### Q7: 如何禁用鼠标星星特效？

方式一：通过设置面板关闭（点击右下角设置图标）

方式二：编辑 `src/contexts/SettingsContext.tsx`，修改默认值：

```typescript
const [cursorEffectEnabled, setCursorEffectEnabled] = useState(false)
```

#### Q8: 如何修改文章内容？

编辑 `src/data/mock.ts` 中的 `learningCategories`，找到对应文章修改 `content` 字段。内容支持 Markdown 语法。

#### Q9: 朋友圈动态如何支持视频？

在 `socialPosts` 数组中添加 `video` 字段：

```typescript
{
  id: 'post-x',
  // ... 其他字段
  video: {
    url: 'https://example.com/video.mp4',
    thumbnail: 'https://example.com/thumbnail.jpg',
    duration: '1:30'
  }
}
```

#### Q10: 如何在地图上添加新的旅行地点？

1. 在 `src/data/mock.ts` 的 `travelLocations` 添加数据
2. 调整 `x` 和 `y` 坐标（百分比）来定位标记点
3. 可以在浏览器开发者工具中查看鼠标位置来确定坐标

---

### 部署相关

#### Q11: 部署后页面刷新 404 怎么办？

确保配置了路由重写规则：

- Vercel: 已包含 `vercel.json` 配置
- Netlify: 在 `public/` 添加 `_redirects` 文件
- Nginx: 配置 `try_files $uri $uri/ /index.html`

#### Q12: 如何配置自定义域名？

在 Vercel Dashboard 中：
1. 进入项目设置
2. 点击 Domains
3. 添加自定义域名
4. 按照提示配置 DNS 记录

#### Q13: 构建时内存不足怎么办？

增加 Node.js 内存限制：

```bash
NODE_OPTIONS=--max_old_space_size=4096 npm run build
```

或在 `package.json` 中修改构建脚本：

```json
"build": "NODE_OPTIONS=--max_old_space_size=4096 vite build"
```

---

### 性能优化

#### Q14: 如何优化首屏加载速度？

1. 使用图片 CDN 和压缩
2. 启用代码分割（已默认启用）
3. 使用懒加载组件：

```typescript
const LazyComponent = lazy(() => import('./Component'))
```

4. 优化图片格式（使用 WebP）
5. 启用 Gzip/Brotli 压缩

#### Q15: 如何减小打包体积？

1. 分析打包体积：

```bash
npm run build -- --mode analyze
```

2. 按需导入库：

```typescript
// 不好
import _ from 'lodash'

// 好
import debounce from 'lodash/debounce'
```

3. 移除未使用的依赖

---

### 开发相关

#### Q16: 如何添加新的 UI 组件？

1. 在 `src/components/ui/` 创建组件文件
2. 使用 Tailwind CSS 和 Framer Motion
3. 导出组件供其他地方使用

#### Q17: 如何集成后端 API？

1. 安装 axios 或使用 fetch
2. 创建 `src/services/api.ts`
3. 替换 mock 数据为 API 调用

```typescript
// src/services/api.ts
export const fetchArticles = async () => {
  const response = await fetch('/api/articles')
  return response.json()
}

// 在组件中使用
useEffect(() => {
  fetchArticles().then(setArticles)
}, [])
```

#### Q18: 如何添加用户认证？

推荐使用：
- Supabase Auth
- Firebase Auth
- Auth0
- NextAuth.js (如果迁移到 Next.js)

#### Q19: TypeScript 报错怎么办？

1. 检查类型定义是否正确
2. 运行 `npm run build` 查看详细错误
3. 安装缺失的类型包：

```bash
npm install --save-dev @types/package-name
```

#### Q20: 如何贡献代码？

1. Fork 项目
2. 创建功能分支：`git checkout -b feature/new-feature`
3. 提交更改：`git commit -m 'Add new feature'`
4. 推送分支：`git push origin feature/new-feature`
5. 创建 Pull Request

---

## 🚀 性能优化建议

### 已实现的优化

- ✅ Vite 快速构建和 HMR
- ✅ React 19 自动批处理
- ✅ 代码分割（路由级别）
- ✅ Tree Shaking
- ✅ CSS 按需加载（Tailwind CSS）
- ✅ 图片懒加载
- ✅ 动画性能优化（Framer Motion）

### 可进一步优化的方向

#### 1. 图片优化

```typescript
// 使用现代图片格式
<img src="image.webp" alt="..." />

// 响应式图片
<img 
  srcSet="image-320w.jpg 320w, image-640w.jpg 640w"
  sizes="(max-width: 640px) 100vw, 640px"
  src="image-640w.jpg"
  alt="..."
/>

// 使用图片 CDN
const imageUrl = `https://cdn.example.com/image.jpg?w=800&q=80&format=webp`
```

#### 2. 组件懒加载

```typescript
import { lazy, Suspense } from 'react'

const HeavyComponent = lazy(() => import('./HeavyComponent'))

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <HeavyComponent />
    </Suspense>
  )
}
```

#### 3. 虚拟滚动

对于长列表（如文章列表、朋友圈），使用虚拟滚动：

```bash
npm install react-window
```

```typescript
import { FixedSizeList } from 'react-window'

<FixedSizeList
  height={600}
  itemCount={items.length}
  itemSize={100}
  width="100%"
>
  {({ index, style }) => (
    <div style={style}>{items[index]}</div>
  )}
</FixedSizeList>
```

#### 4. 缓存策略

```typescript
// 使用 SWR 或 React Query
import useSWR from 'swr'

function Articles() {
  const { data, error } = useSWR('/api/articles', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000, // 1分钟内不重复请求
  })
}
```

#### 5. Service Worker

添加 PWA 支持，实现离线访问：

```bash
npm install vite-plugin-pwa -D
```

```typescript
// vite.config.ts
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: '晓叶的个人空间',
        short_name: 'SuperUI',
        theme_color: '#8b5cf6',
      }
    })
  ]
})
```

---

## 🔒 安全建议

### 1. 环境变量管理

创建 `.env` 文件存储敏感信息：

```bash
VITE_API_URL=https://api.example.com
VITE_API_KEY=your-api-key
```

在代码中使用：

```typescript
const apiUrl = import.meta.env.VITE_API_URL
```

### 2. XSS 防护

- React 默认转义输出，防止 XSS
- 使用 `dangerouslySetInnerHTML` 时要谨慎
- 对用户输入进行验证和清理

### 3. HTTPS

生产环境必须使用 HTTPS：
- Vercel 自动提供 HTTPS
- 自托管需配置 SSL 证书（Let's Encrypt）

### 4. CSP (Content Security Policy)

在 `index.html` 添加 CSP 头：

```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline'; 
               style-src 'self' 'unsafe-inline';">
```


---

## 🙏 致谢

### 开源项目

- [React](https://react.dev/) - UI 框架
- [Vite](https://vitejs.dev/) - 构建工具
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架
- [Framer Motion](https://www.framer.com/motion/) - 动画库
- [Lucide](https://lucide.dev/) - 图标库
- [ECharts](https://echarts.apache.org/) - 图表库
- [Three.js](https://threejs.org/) - 3D 库
- [TipTap](https://tiptap.dev/) - 富文本编辑器

### 设计灵感

- [Dribbble](https://dribbble.com/)
- [Behance](https://www.behance.net/)
- [Awwwards](https://www.awwwards.com/)

### 图片资源

- [Unsplash](https://unsplash.com/) - 免费高质量图片
- [Picsum](https://picsum.photos/) - 占位图服务

---

## 📞 联系方式

- 作者: 晓叶
- 邮箱: xiaoye@example.com
- GitHub: [@xiaoye](https://github.com/xiaoye)
- 个人网站: [https://xiaoye.dev](https://xiaoye.dev)



<div align="center">

**⭐ 如果这个项目对你有帮助，请给一个 Star！⭐**

Made with ❤️ by 晓叶

</div>
