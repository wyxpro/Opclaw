# 🌟 SuperUI — 个人数字空间平台

> 一个集**个人主页 · 知识管理 · 生活记录 · AI 分身 · 工作助手**于一体的全功能个人数字空间，支持 5 套动态主题切换，全端响应式布局。

---

## 📋 项目简介

**SuperUI** 是一个以个人为中心的综合性数字生活平台，旨在将个人信息展示、知识学习、生活记录、社交互动、AI 交互以及工作管理整合到同一个现代化 Web 应用中。

项目定位于高颜值、高可用的个人数字空间，具备：

- 🎨 **5 套主题风格**（极简 / 赛博 / 艺术 / 童趣 / 复古），全局实时切换
- 📱 **全端自适应**，桌面端与移动端双布局设计
- 🤖 **AI 分身系统**，集成 RAG 知识检索与对话
- 🗂️ **多模块协同**，9 大功能模块无缝导航
- 🔐 **Supabase 云端认证**，用户数据安全存储

---

## 🛠️ 技术栈

### 🎯 核心框架

| 技术 | 版本 | 用途 |
|---|---|---|
| **React** | ^19.2.0 | UI 渲染框架 |
| **TypeScript** | ~5.9.3 | 静态类型检查 |
| **Vite** | ^7.3.1 | 构建工具 & 开发服务器 |
| **React Router DOM** | ^7.13.0 | 客户端路由 |

### 🎨 UI & 动画

| 技术 | 版本 | 用途 |
|---|---|---|
| **Tailwind CSS** | ^4.1.18 | 原子化 CSS 样式 |
| **Framer Motion** | ^12.34.1 | 页面过渡 & 微动画 |
| **Lucide React** | ^0.574.0 | 图标库 |
| **class-variance-authority** | ^0.7.1 | 组件变体管理 |

### 🤖 AI & 3D

| 技术 | 版本 | 用途 |
|---|---|---|
| **Three.js** | ^0.183.1 | 3D 角色渲染 |
| **@react-three/fiber** | ^9.5.0 | React 的 Three.js 封装 |
| **@react-three/drei** | ^10.7.7 | Three.js 工具集合 |
| **RAG Engine**（自研） | — | 关键词检索 + 本地知识对话 |

### 📝 编辑器 & 图表

| 技术 | 版本 | 用途 |
|---|---|---|
| **Tiptap** | ^3.20.0 | 富文本知识文章编辑器 |
| **ECharts for React** | ^3.0.6 | 数据图表可视化 |
| **html2canvas** | ^1.4.1 | 数字名片图片生成 |

### ☁️ 后端 & 数据

| 技术 | 版本 | 用途 |
|---|---|---|
| **Supabase** | ^2.46.1 | 云端数据库 + 身份认证 |
| **LocalStorage** | — | 本地用户状态缓存 |

---

## 🏗️ 项目架构

```
SuperUI 整体架构
┌─────────────────────────────────────────────────────────────┐
│                        React 19 App                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                 Context 全局状态层                    │   │
│  │  ThemeContext │ AuthContext │ SettingsContext         │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │               React Router 路由层                     │   │
│  │  / │ /assets │ /learning │ /life │ /social │ /work   │   │
│  │  /ai-character │ /community │ /laboratory             │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                   功能页面层 (Pages)                   │   │
│  │  Home · Learning · Life · Social · Work · AI · Lab   │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                   组件复用层 (Components)              │   │
│  │  ai/ · auth/ · community/ · entertainment/ · layout/ │   │
│  │  learning/ · love/ · profile/ · ui/ · work/          │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                   工具库层 (lib/)                      │   │
│  │  supabase · ragEngine · themes · cardUtils · toast   │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
         │                              │
         ▼                              ▼
  ┌─────────────┐              ┌───────────────┐
  │  Supabase   │              │  LocalStorage │
  │  (云端认证+  │              │  (主题/用户   │
  │   数据库)    │              │   本地缓存)   │
  └─────────────┘              └───────────────┘
```

### 🔄 数据流向

```
用户操作
   │
   ▼
React 组件 (useState / useEffect)
   │
   ├──► Context（ThemeContext / AuthContext）→ 全局状态
   │
   ├──► Supabase Client → profiles 表 / auth 模块（云端）
   │
   ├──► RAG Engine → 本地知识库检索 → AI 响应
   │
   └──► LocalStorage → 用户缓存 / 主题持久化
```

---

## 📁 目录结构

```
SuperUI/
├── 📄 index.html               # 主入口 HTML（含内联配置）
├── 📄 app.html                 # 备用入口
├── 📄 vite.config.ts           # Vite 构建配置
├── 📄 package.json             # 依赖清单
├── 📄 .env                     # 本地环境变量（Supabase 配置）
├── 📄 vercel.json              # Vercel 部署配置
│
├── 📁 src/                     # 源代码目录
│   ├── 📄 main.tsx             # 应用启动入口
│   ├── 📄 App.tsx              # 根组件 + 路由配置
│   ├── 📄 index.css            # 全局样式 & CSS 变量
│   │
│   ├── 📁 pages/               # 页面组件（9个主模块）
│   │   ├── 📄 Home.tsx         # 🏠 个人主页（技能/作品/联系）
│   │   ├── 📄 Assets.tsx       # 💰 数字资产管理
│   │   ├── 📄 Learning.tsx     # 📚 学习空间（知识库/技能树）
│   │   ├── 📄 Life.tsx         # 🌸 生活记录（朋友圈/旅行/恋爱）
│   │   ├── 📄 Social.tsx       # 👤 个人中心（名片/留言墙）
│   │   ├── 📄 AICharacter.tsx  # 🤖 AI 分身助手
│   │   ├── 📄 Community.tsx    # 🌐 社区广场
│   │   ├── 📄 Laboratory.tsx   # 🧪 实验室（历史/计划）
│   │   └── 📄 Work.tsx         # 💼 工作助手（新媒体/电商）
│   │
│   ├── 📁 components/          # 可复用组件库
│   │   ├── 📁 ai/              # AI 分身相关组件
│   │   │   ├── Character3D.tsx     # Three.js 3D 角色渲染
│   │   │   ├── AvatarClone.tsx     # 形象复刻组件
│   │   │   ├── VoiceClone.tsx      # 声音克隆组件
│   │   │   ├── CharacterChat.tsx   # 对话消息列表
│   │   │   ├── MultiModalInput.tsx # 多模态输入框
│   │   │   ├── BackgroundCustomizer.tsx # 背景自定义
│   │   │   ├── StepNavigator.tsx   # 步骤导航组件
│   │   │   └── types.ts            # AI 模块类型定义
│   │   │
│   │   ├── 📁 auth/            # 认证相关组件
│   │   │   └── AuthModal.tsx       # 登录/注册弹窗
│   │   │
│   │   ├── 📁 layout/          # 布局组件
│   │   │   └── Navbar.tsx          # 顶部导航栏（桌面端）
│   │   │
│   │   ├── 📁 profile/         # 个人主页组件
│   │   │   ├── HeroSection.tsx     # 首屏 Hero 区域
│   │   │   ├── SkillsSection.tsx   # 技能展示
│   │   │   ├── PortfolioSection.tsx# 项目作品集
│   │   │   ├── SocialMediaSection.tsx # 自媒体矩阵
│   │   │   ├── HobbiesSection.tsx  # 兴趣爱好
│   │   │   ├── ModulesSection.tsx  # 模块导航入口
│   │   │   └── ContactSection.tsx  # 联系方式
│   │   │
│   │   ├── 📁 learning/        # 学习模块组件
│   │   │   ├── ArticleEditor.tsx   # 富文本文章编辑器
│   │   │   ├── DocumentImport.tsx  # 文档导入组件
│   │   │   ├── AIAssistant.tsx     # 文章 AI 助手
│   │   │   └── resume/             # 在线简历组件
│   │   │
│   │   ├── 📁 love/            # 恋爱记录组件
│   │   │   ├── TimeAlbum.tsx       # 时光相册
│   │   │   ├── WishList.tsx        # 许愿清单
│   │   │   └── BlessingBoard.tsx   # 祝福留言板
│   │   │
│   │   ├── 📁 entertainment/   # 娱乐模块组件
│   │   │   └── EntertainmentModules.tsx # 音乐盒/电影墙/百宝箱
│   │   │
│   │   ├── 📁 ui/              # 通用 UI 组件
│   │   │   ├── StarCursor.tsx      # 星光鼠标特效
│   │   │   ├── PageTransition.tsx  # 页面切换动画
│   │   │   ├── SkillTreeView.tsx   # 技能树可视化
│   │   │   ├── ThemeSwitcher.tsx   # 主题切换面板
│   │   │   └── SettingsModal.tsx   # 系统设置弹窗
│   │   │
│   │   ├── 📄 ChinaMap.tsx     # 中国地图组件（旅行轨迹）
│   │   ├── 📄 TravelManager.tsx# 旅行地点管理
│   │   ├── 📄 TravelDetailModal.tsx # 旅行详情弹窗
│   │   ├── 📄 LoveDetailModal.tsx   # 恋爱事件详情弹窗
│   │   └── 📄 ProfileEditModal.tsx  # 个人资料编辑弹窗
│   │
│   ├── 📁 contexts/            # React Context 全局状态
│   │   ├── 📄 ThemeContext.tsx  # 主题管理（5套主题切换）
│   │   ├── 📄 AuthContext.tsx   # 用户认证状态管理
│   │   └── 📄 SettingsContext.tsx # 全局设置存储
│   │
│   ├── 📁 hooks/               # 自定义 React Hooks
│   │   ├── 📄 useTheme.ts      # 主题 Hook
│   │   └── 📄 useSettings.ts   # 设置 Hook
│   │
│   ├── 📁 lib/                 # 工具函数 & 服务层
│   │   ├── 📄 supabase.ts      # Supabase 客户端（含 Mock 回退）
│   │   ├── 📄 ragEngine.ts     # RAG 知识检索引擎
│   │   ├── 📄 themes.ts        # 5套主题配置定义
│   │   ├── 📄 cardUtils.ts     # 数字名片生成工具
│   │   ├── 📄 toast.ts         # 消息提示工具
│   │   ├── 📄 storage.ts       # 本地存储封装
│   │   ├── 📄 functions.ts     # 通用工具函数
│   │   └── 📄 utils.ts         # 样式合并工具
│   │
│   ├── 📁 data/                # 静态 & Mock 数据
│   │   ├── 📄 profile.ts       # 个人资料数据
│   │   └── 📄 mock.ts          # 各模块 Mock 数据
│   │
│   ├── 📁 types/               # TypeScript 类型定义
│   │   └── 📄 auth.ts          # 认证相关类型
│   │
│   └── 📁 assets/              # 静态资源
│
├── 📁 supabase/                # Supabase 后端配置
│   ├── 📁 migrations/          # 数据库迁移脚本
│   │   ├── 0001_init.sql       # 初始化 profiles 表
│   │   ├── 0002_profiles_background.sql  # 背景字段
│   │   ├── 0003_profiles_email.sql       # 邮箱字段
│   │   ├── 0004_rpc_get_email_by_username.sql # 用户名查邮箱 RPC
│   │   └── 0005_profiles_policies.sql   # Row Level Security 策略
│   └── 📁 functions/           # Edge Functions（自定义函数）
│
└── 📁 public/                  # 静态公共资源
```

---

## ⚡ 核心功能模块和工作流程

### 🏠 1. 个人主页模块（`/`）

**功能列表：**
- 🧑 Hero 区域：头像、个人简介、在线简历切换
- 🛠️ 技能展示：分类技能条形图
- 🗂️ 项目作品集：项目卡片网格布局
- ❤️ 兴趣爱好：3D 卡片轮播
- 🔗 自媒体矩阵：各平台社交链接
- 📬 联系区域：邮件/社交媒体联系入口
- 🎨 移动端主题快速切换

**工作流程：**
```
页面加载 → 读取 ThemeContext → 渲染 Hero/Skills/Portfolio/Hobbies
         → 用户点击"查看简历" → 切换为 OnlineResume 视图
         → 用户点击主题按钮 → 弹出 ThemeModal → setTheme() → 全局色调切换
```

---

### 📚 2. 学习空间模块（`/learning`）

**功能列表：**
- 📖 知识库视图：三列布局（分类导航 / 文章列表 / 文章详情）
- 🌲 技能树视图：可视化技能成长路径
- ✏️ 文章编辑器：基于 Tiptap 的富文本编辑，支持图片、链接
- 📥 文档导入：支持本地文档解析并导入知识库
- 🤖 AI 阅读助手：基于 RAG 引擎的文章智能问答浮窗
- 📄 在线简历：结构化个人简历展示

**工作流程：**
```
文章管理流程：
新建/导入文章 → ArticleEditor/DocumentImport → 保存入 customArticles 列表
             → 文章卡片列表展示 → 点击文章 → 三列详情视图
             → RAG 引擎 + AI 助手浮窗 → 智能问答回复
```

---

### 🌸 3. 生活记录模块（`/life`）

包含 7 个子标签页：

| 标签 | 功能描述 |
|---|---|
| **朋友圈** | 发布图文动态，支持点赞、评论、@他人 |
| **旅拍相册** | 中国地图轨迹可视化，旅行照片管理 |
| **恋爱记录** | 恋爱倒计时、时间轴事件管理 |
| **时光相册** | 按时间轴整理的恋爱相册 |
| **许愿清单** | 双人心愿列表，支持完成标记 |
| **祝福板** | 好友祝福留言展示 |
| **音乐盒** | 音乐收藏墙 |
| **收藏电影** | 电影收藏墙（豆瓣风格） |

**恋爱记录工作流程：**
```
进入恋爱记录 → 显示倒计时（秒级实时更新）
           → 时间轴事件列表（左右交替布局）
           → 点击事件 → LoveDetailModal 弹窗
           → 查看/编辑/删除事件
           → 新增帖子按钮 → 填写表单 + 上传图片 → 追加到时间轴
```

---

### 👤 4. 个人中心模块（`/social`）

包含 3 个子标签页：

| 标签 | 功能描述 |
|---|---|
| **自媒体矩阵** | 友情链接管理（增删改查） + 社交账号展示 |
| **留言墙** | 便利贴风格留言墙，支持三行自动滚动弹幕 |
| **实验室** | 项目开发时间轴 + 未来计划路线图 |

**特色功能：**
- 🃏 数字名片生成器：多主题模板，基于 html2canvas 导出图片
- 👑 VIP 会员入口（UI 展示）
- ✏️ 个人资料编辑（头像/背景/简介同步 Supabase）
- 🔐 登录/注册弹窗（首次访问自动触发）
- 🎨 主题选择面板（桌面端完整切换面板）

---

### 🤖 5. AI 分身模块（`/ai-character`）

**三步引导流程：**

```
Step 1: 声音克隆（VoiceClone）
  └─ 录制/上传音频样本 → 生成声音模型（VoiceModel）

Step 2: 形象复刻（AvatarClone）
  └─ 选择/上传头像 → 配置角色风格（cartoon/realistic）
  └─ 生成数字形象（AvatarModel）

Step 3: AI 对话（CharacterChat）
  └─ Three.js 3D 角色渲染 + 背景场景选择
  └─ MultiModalInput 多模态输入（文字/图片/语音）
  └─ RAG 引擎处理用户消息 → 生成智能回复
  └─ 若已克隆声音 → Web Speech API 语音朗读回复
```

---

### 💼 6. 工作助手模块（`/work`）

包含 3 个子标签页：

| 标签 | 核心功能 |
|---|---|
| **新媒体运营** | 内容库管理（文章/视频）· 发布管理（草稿/定时/已发布状态）· 平台数据统计（微信/微博/小红书/抖音） |
| **电商运营** | 商品管理（上下架/定价/库存）· 订单管理 · 销售数据概览 |
| **百宝箱** | 常用工具/资源收藏管理 |

---

### 🧪 7. 实验室模块（`/laboratory`）

- **历史时间轴**：记录 SuperUI 项目功能迭代历程（AI 分身 → 主题系统 → 3D 轮播等）
- **未来计划**：以卡片形式展示待开发功能（进度条 + 优先级 + 季度规划）

---

### 🎨 8. 主题系统（全局）

5 套主题风格，通过 `ThemeContext` + CSS 变量实现全局切换：

| 主题 | 描述 | 配色特点 |
|---|---|---|
| **极简（minimal）** | `☀️` 清爽白色系 | 蓝色主色，简洁线条 |
| **赛博（cyber）** | `🌙` 暗黑霓虹 | 青蓝+紫色，赛博朋克 |
| **艺术（artistic）** | `🎨` 暖橙艺术系 | 珊瑚红+橙色，手工艺感 |
| **童趣（cartoon）** | `🌈` 明亮卡通系 | 粉色+明黄，圆润边角 |
| **复古（retro）** | `📜` 暖棕复古系 | 深金+棕红，老式排版 |

每套主题包含完整的颜色、字体、圆角、阴影、玻璃拟态效果配置。

---

### 🔐 9. 认证系统工作流程

```
用户访问 Social 页面
    │
    ▼
AuthContext 初始化
    ├─ 读取 LocalStorage 快照 → 乐观预渲染（避免登录闪烁）
    ├─ 调用 supabase.auth.getUser() 验证令牌
    │       ├─ 已登录 → 拉取 profiles 表同步用户资料
    │       └─ 未登录 → 100ms 后自动弹出 AuthModal
    │
用户登录（email 或 username）
    ├─ username 模式 → RPC get_email_by_username 查询邮箱
    ├─ supabase.auth.signInWithPassword
    ├─ 成功 → fetchAndSetProfile → setUser → navigate('/social')
    └─ 失败 → 返回 false → 前端显示错误提示

用户注册
    ├─ 检查用户名是否已存在
    ├─ supabase.auth.signUp
    ├─ 创建 profiles 记录（upsert）
    └─ 成功 → 自动登录跳转
```

---

## ⚙️ 部署指南

### 🚀 本地开发

**环境要求：**
- Node.js >= 18
- npm >= 9

**步骤：**

```bash
# 1. 克隆仓库
git clone <repo-url>
cd Superui

# 2. 安装依赖
npm install

# 3. 配置环境变量
cp .env.example .env
# 编辑 .env，填入 Supabase 配置（见下方说明）

# 4. 启动开发服务器
npm run dev

# 访问 http://localhost:5173
```

**环境变量说明（`.env`）：**

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

> ⚠️ 若未配置 Supabase 环境变量，系统将自动启用 **Mock 客户端**，认证功能降级为本地模拟模式，其余功能正常使用。

---

### 🗄️ Supabase 数据库初始化

在 Supabase 项目 SQL 编辑器中按顺序执行以下迁移文件：

```bash
supabase/migrations/0001_init.sql           # 创建 profiles 表
supabase/migrations/0002_profiles_background.sql  # 添加 background_url 字段
supabase/migrations/0003_profiles_email.sql       # 添加 email 字段
supabase/migrations/0004_rpc_get_email_by_username.sql  # 创建 RPC 函数
supabase/migrations/0005_profiles_policies.sql    # 配置 RLS 行级安全策略
```

profiles 表结构：

```sql
profiles (
  user_id     UUID PRIMARY KEY,   -- Supabase Auth 用户 ID
  username    TEXT UNIQUE,        -- 用户名（支持用户名登录）
  email       TEXT,               -- 邮箱地址
  avatar_url  TEXT,               -- 头像 URL
  background_url TEXT,            -- 背景图 URL
  bio         TEXT,               -- 个人简介
  created_at  TIMESTAMP,
  updated_at  TIMESTAMP
)
```

---

### ☁️ Vercel 部署

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录并部署
vercel

# 在 Vercel 控制台配置环境变量：
# VITE_SUPABASE_URL
# VITE_SUPABASE_ANON_KEY
```

或直接通过 Vercel 控制台连接 GitHub 仓库实现自动部署。

`vercel.json` 已配置 SPA 重定向规则，无需额外配置路由。

---

### 🔨 生产构建

```bash
# 类型检查 + 构建
npm run build

# 本地预览构建结果
npm run preview
```

构建产物输出至 `dist/` 目录，包含 `index.html` 和 `app.html` 两个入口。

---

### 📋 可用脚本

| 命令 | 说明 |
|---|---|
| `npm run dev` | 启动本地开发服务器（HMR） |
| `npm run build` | TypeScript 类型检查 + Vite 生产构建 |
| `npm run preview` | 本地预览生产构建结果 |
| `npm run lint` | ESLint 代码规范检查 |

---

## 📦 API 接口

### 🔐 认证接口（Supabase Auth）

| 接口 | 方法 | 描述 |
|---|---|---|
| `supabase.auth.signInWithPassword` | POST | 邮箱 + 密码登录 |
| `supabase.auth.signUp` | POST | 邮箱注册 |
| `supabase.auth.signOut` | POST | 退出登录 |
| `supabase.auth.getUser` | GET | 获取当前登录用户 |
| `supabase.auth.onAuthStateChange` | 订阅 | 监听认证状态变化 |

### 👤 用户资料接口（profiles 表）

| 操作 | 接口 | 描述 |
|---|---|---|
| 查询 | `from('profiles').select('*').eq('user_id', uid)` | 获取用户资料 |
| 创建 | `from('profiles').insert({...})` | 首次注册创建资料 |
| 更新 | `from('profiles').update({...}).eq('user_id', uid)` | 更新用户信息 |
| 同步 | `from('profiles').upsert({...})` | 注册时合并插入 |

### 🔍 自定义 RPC 函数

| 函数 | 描述 | 参数 |
|---|---|---|
| `get_email_by_username` | 根据用户名查询邮箱（支持用户名登录） | `p_username: string` |

### 🤖 RAG 引擎 API（本地）

```typescript
import { ragEngine } from '@/lib/ragEngine'

// 检索相关内容
const context = ragEngine.search(query: string, topK?: number)
// 返回: { relevantContent: string[], sourceModules: string[], confidence: number }

// 生成智能回复
const response = ragEngine.generateResponse(query: string)
// 返回: string（自然语言回复，含推荐/方法/介绍等多种回复模式）
```

### 🃏 数字名片工具 API

```typescript
import { generateCardImage, downloadImage, saveToHistory } from '@/lib/cardUtils'

// 生成名片图片（基于 html2canvas）
await generateCardImage(element: HTMLElement, options?)

// 下载图片到本地
downloadImage(dataUrl: string, filename: string)

// 保存到历史记录（LocalStorage）
saveToHistory(cardData: DigitalCard)

// 获取历史列表
getHistoryList(): DigitalCard[]

// 微信分享
wechatShare(title: string, imageUrl: string)
```

---

## 💡 常见问题

### ❓ Q1：启动后界面正常但登录报错？

**A：** 检查 `.env` 文件中 Supabase 配置是否正确：
```bash
# 验证方式：在浏览器控制台执行
console.log(import.meta.env.VITE_SUPABASE_URL)
```
若为空字符串，说明环境变量未正确加载。确保 `.env` 文件在项目根目录且重启开发服务器。

---

### ❓ Q2：不配置 Supabase 能使用吗？

**A：** 可以。项目内置 Mock 客户端降级策略：
- 未配置时自动启用 Mock 模式
- **认证功能** 不可用（无法登录/注册）
- **其余 8 个模块**（学习、生活、AI 分身等）功能完全正常
- 控制台会打印警告：`Supabase configuration missing, using mock client`

---

### ❓ Q3：如何添加新的学习文章？

**A：** 进入 `/learning`（学习空间）页面：
1. 点击 **"新建文章"** 按钮 → 打开富文本编辑器
2. 填写标题、正文、摘要、标签 → 点击保存
3. 或点击 **"导入文档"** 按钮，支持批量导入本地文档

---

### ❓ Q4：如何切换主题？

**A：** 有两种方式：
- **桌面端**：点击顶部导航栏右侧的主题切换面板（`Social` 页面 → 标签栏右侧 ThemeSelector）
- **移动端**：在首页（`/`）右上角点击 🎨 调色盘图标，弹出主题选择框

---

### ❓ Q5：AI 分身的回复是真实 AI 吗？

**A：** 当前版本使用**本地 RAG 引擎**（关键词匹配 + 规则化回复生成），无需外部 AI API：
- 基于本地 Mock 知识库进行关键词检索
- 根据查询意图（推荐/方法/介绍）生成对应模板化回复
- 如需接入真实大模型，可在 `src/pages/AICharacter.tsx` 的 `handleSendMessage` 函数中替换 `ragEngine.generateResponse` 调用

---

### ❓ Q6：数字名片生成图片失败？

**A：** html2canvas 生成时需注意：
- 页面中的**跨域图片资源**可能导致生成失败，建议使用同域或 Base64 图片
- 若头像图片跨域，可在 img 元素加上 `crossOrigin="anonymous"` 属性
- 确保名片容器已完整渲染后再调用生成函数

---

### ❓ Q7：生产部署后路由 404？

**A：** 需配置服务器 SPA 重定向，Vercel 已通过 `vercel.json` 自动处理。  
其他平台示例：
```nginx
# Nginx 配置
location / {
  try_files $uri $uri/ /index.html;
}
```

---

### ❓ Q8：如何自定义个人资料数据？

**A：** 编辑 `src/data/profile.ts` 文件，修改以下导出对象：
```typescript
export const personalProfile    // 基本信息（姓名/头像/简介/社交链接）
export const skillCategories    // 技能分类列表
export const portfolioItems     // 项目作品集
export const moduleEntries      // 模块导航卡片
```

---

## 🗺️ 版本路线图

| 版本 | 状态 | 功能 |
|---|---|---|
| v1.0 | ✅ 已完成 | 基础框架 + 个人主页 + 5套主题 |
| v1.1 | ✅ 已完成 | 学习空间 + 技能树 + 文章编辑器 |
| v1.2 | ✅ 已完成 | 生活记录 + 恋爱时间轴 + 旅行地图 |
| v1.3 | ✅ 已完成 | AI 分身 + 3D 角色 + RAG 引擎 |
| v1.4 | ✅ 已完成 | 个人中心 + 数字名片 + 留言墙 |
| v1.5 | ✅ 已完成 | Supabase 认证 + 用户资料同步 |
| v2.0 | 🚧 规划中 | AI 简历优化器 + 实时协作编辑器 |
| v2.1 | 📋 规划中 | 数据可视化大屏 + 语音交互系统 |
| v3.0 | 🔬 研究中 | PWA 离线支持 + WebGL 3D 空间 |

---

## 📄 许可证

本项目采用 **MIT License** 开源协议。

---

<div align="center">

Made with ❤️ by **SuperUI Team**

*一个人的数字宇宙，从这里开始。*

</div>
