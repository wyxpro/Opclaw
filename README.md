<div align="center">

# 🌈 Opclaw — 全能数字资产与AI数字人分身助手

[![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.3.1-646CFF?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4.1.18-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-2.46.1-3ECF8E?logo=supabase)](https://supabase.com/)
[![License](https://img.shields.io/badge/License-Private-red)](#)

</div>

---

## 📋 项目简介

**Opclaw** 是一款面向 **OPC 超级个体**（One Person Company）的现代化全栈 Web 应用，基于 **React 19 + TypeScript + Vite 7** 构建，完美适配 PC 与移动端。项目融合 **个人主页（简历）**、**学习空间（知识库/RAG 问答）**、**工作助手（电商/新媒体/百宝箱）**、**生活记录（朋友圈/旅行/恋爱记录等 7+ 功能）**、**AI 数字人分身** 于一体，支持 **5 种主题** 一键切换，致力于打造高颜值、可扩展的个人数字宇宙——实现 **个人 IP 展示 + 数字资产管理 + AI 数字人分身赋能** 的一站式解决方案。

### ✨ 核心亮点

| 特性 | 描述 |
|---|---|
| 🎨 **5 套主题系统** | 极简 / 赛博 / 艺术 / 童趣 / 复古，通过 CSS 变量 + React Context 实现全局实时切换 |
| 🤖 **AI 分身系统** | 声音克隆 → 形象复刻 → 3D 角色对话的三步引导式创建流程 |
| 📱 **响应式设计** | 桌面端顶部导航 + 移动端底部 Tab 导航，完美适配双端体验 |
| ✨ **流畅动画** | 基于 Framer Motion 实现页面过渡、微交互、布局动画 |
| 🔐 **Supabase 后端** | 用户认证 + 数据持久化 + 文件存储 + RLS 行级安全 |
| ⚡ **极速构建** | Vite 7.3 HMR 热更新 + 多入口构建支持 |
| 🧠 **RAG 智能引擎** | 自研关键词检索 + 多模式回复生成（推荐/教程/百科/通用） |
| 🃏 **数字名片生成** | html2canvas 导出 + 微信分享 + 历史记录管理 |
| 🌟 **星光鼠标特效** | 跟随鼠标的粒子拖尾动画，可在设置中开关 |
| 🖨️ **打印/PDF 导出** | 针对简历等页面优化了打印样式 |

---

## 🛠️ 技术栈

### 🖥️ 前端核心

| 技术 | 版本 | 用途 |
|---|---|---|
| [React](https://react.dev/) | 19.2.0 | UI 框架（函数组件 + Hooks） |
| [React Router](https://reactrouter.com/) | 7.13.0 | Hash 路由管理 + 页面跳转 |
| [TypeScript](https://www.typescriptlang.org/) | 5.9.3 | 静态类型检查，提升代码可维护性 |
| [Tailwind CSS](https://tailwindcss.com/) | 4.1.18 | 原子化 CSS 框架（v4 Vite 插件模式） |
| [Framer Motion](https://www.framer.com/motion/) | 12.34.1 | 声明式动画引擎（页面过渡/微交互/布局动画） |
| [Lucide React](https://lucide.dev/) | 0.574.0 | 图标库（1000+ SVG 图标） |
| [Vite](https://vitejs.dev/) | 7.3.1 | 下一代构建工具（ESM + HMR + Rollup） |

### ☁️ 后端 & 部署

| 技术 | 版本 | 用途 |
|---|---|---|
| [Supabase](https://supabase.com/) | 2.46.1 | BaaS（PostgreSQL + Auth + Storage + RPC） |
| [Vercel](https://vercel.com/) | — | 免费静态站点部署 + CDN 加速 |
| ESLint | 9.39.1 | 代码规范检查（React Hooks 规则 + Refresh） |


### 🤖 AI & 3D

| 技术 | 版本 | 用途 |
|---|---|---|
| [Three.js](https://threejs.org/) | 0.183.1 | WebGL 3D 渲染引擎 |
| [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber) | 9.5.0 | React 声明式 Three.js 渲染器 |
| [@react-three/drei](https://github.com/pmndrs/drei) | 10.7.7 | Three.js 辅助工具集（OrbitControls 等） |
| RAG Engine（自研） | — | 关键词提取 + TF-IDF 相似度匹配 + 模板回复 |

### 📊 数据可视化 & 编辑器

| 技术 | 版本 | 用途 |
|---|---|---|
| [ECharts](https://echarts.apache.org/) | 6.0.0 | 图表引擎（折线/柱状/饼图/雷达图） |
| [echarts-for-react](https://github.com/hustcc/echarts-for-react) | 3.0.6 | ECharts React 封装组件 |
| [Tiptap](https://tiptap.dev/) | 3.20.0 | 富文本编辑器（图片/链接/占位符扩展） |
| [html2canvas](https://html2canvas.hertzen.com/) | 1.4.1 | DOM 截图，用于数字名片图片生成 |

---

## 📁 目录结构

```
Opclaw/
├── 📄 index.html                  # 主入口 HTML（含初始加载动画 + 内联配置）
├── 📄 app.html                    # 备用入口（多入口构建）
├── 📄 vite.config.ts              # Vite 构建配置（React + Tailwind 插件 + 环境变量注入）
├── 📄 tsconfig.json               # TypeScript 项目引用配置
├── 📄 tsconfig.app.json           # 应用 TS 配置
├── 📄 tsconfig.node.json          # Node 端 TS 配置
├── 📄 eslint.config.js            # ESLint 9 Flat Config
├── 📄 package.json                # 依赖清单（25+ 直接依赖）
├── 📄 .env / .env.preview / .env.production  # 环境变量（Supabase 配置）
├── 📄 vercel.json                 # Vercel SPA 重写规则
├── 📄 .vercelignore               # Vercel 忽略规则
│
├── 📁 src/                        # ======= 源代码 ========================
│   ├── 📄 main.tsx                # 应用启动入口（StrictMode + HashRouter + 加载遮罩移除）
│   ├── 📄 App.tsx                 # 根组件：三层 Provider 嵌套 + 9 条路由 + AnimatePresence
│   ├── 📄 index.css               # 全局样式：@theme 声明 + 6 个关键帧 + glass/gradient 工具类
│   │
│   ├── 📁 pages/                  # ====== 9 个页面组件 
│   │   ├── 📄 Home.tsx            # 🏠 首页：Hero/技能/作品/爱好/社媒/联系 六大板块
│   │   ├── 📄 Learning.tsx        # 📚 学习空间：知识库 + 技能树 + 文章编辑器 + AI 助手
│   │   ├── 📄 Life.tsx            # 🌸 生活记录：7 个子标签页（朋友圈/旅拍/恋爱/相册/许愿/祝福/音乐/电影）
│   │   ├── 📄 Work.tsx            # 💼 工作助手：百宝箱 + 电商运营 + 新媒体运营
│   │   ├── 📄 Social.tsx          # 👤 个人中心：名片/留言墙/VIP/设置/资料编辑
│   │   ├── 📄 AICharacter.tsx     # 🤖 AI 分身：3 步引导 + 3D 角色 + 语音交互
│   │   ├── 📄 Assets.tsx          # 💰 数字资产：资产卡片网格展示
│   │   ├── 📄 Community.tsx       # 🌐 社区广场：帖子动态流
│   │   └── 📄 Laboratory.tsx      # 🧪 实验室：开发时间轴 + 路线图
│   │
│   ├── 📁 components/             # ===== 可复用组件库 
│   │   ├── 📁 ai/                 # 🤖 AI 分身模块（13 个文件）
│   │   │   ├── Character3D.tsx        # Three.js 3D 角色场景渲染
│   │   │   ├── VoiceClone.tsx         # 声音克隆：录制/上传/试听
│   │   │   ├── AvatarClone.tsx        # 形象复刻：头像选择/风格配置
│   │   │   ├── AvatarSelectionDialog.tsx # 头像选择对话框
│   │   │   ├── CharacterChat.tsx      # 对话消息列表组件
│   │   │   ├── CharacterVoiceUI.tsx   # 语音交互 UI
│   │   │   ├── MultiModalInput.tsx    # 多模态输入框（文字/图片/语音）
│   │   │   ├── BackgroundCustomizer.tsx # 背景场景自定义
│   │   │   ├── StepNavigator.tsx      # 步骤导航组件
│   │   │   ├── StreamingText.tsx      # 打字机效果文本组件
│   │   │   ├── HistoryDialog.tsx      # 历史记录对话框
│   │   │   ├── VoiceWaveAnimation.tsx # 语音波形动画
│   │   │   └── types.ts              # AI 模块类型定义（RAGContext 等）
│   │   │
│   │   ├── 📁 profile/           # 🏠 首页模块（8 个组件）
│   │   │   ├── HeroSection.tsx        # 首屏 Hero 区域（头像/简介/简历切换）
│   │   │   ├── SkillsSection.tsx      # 技能展示（分类条形图）
│   │   │   ├── PortfolioSection.tsx   # 项目作品集网格
│   │   │   ├── HobbiesSection.tsx     # 兴趣爱好 3D 卡片轮播
│   │   │   ├── SocialMediaSection.tsx # 自媒体矩阵链接
│   │   │   ├── ContactSection.tsx     # 联系方式区域
│   │   │   ├── ModulesSection.tsx     # 模块导航入口卡片
│   │   │   └── AnimatedSection.tsx    # 滚动触发动画容器
│   │   │
│   │   ├── 📁 learning/          # 📚 学习模块（9 个文件）
│   │   │   ├── ArticleEditor.tsx      # Tiptap 富文本编辑器
│   │   │   ├── DocumentImport.tsx     # 本地文档导入解析
│   │   │   ├── AIAssistant.tsx        # 文章 AI 问答助手浮窗
│   │   │   ├── AIChatSidebar.tsx      # AI 聊天侧边栏
│   │   │   ├── ChatInput.tsx          # 聊天输入组件
│   │   │   ├── ChatMessageList.tsx    # 聊天消息列表
│   │   │   ├── ResizableDivider.tsx   # 可拖拽分栏分割线
│   │   │   ├── types.ts              # 学习模块类型定义
│   │   │   └── 📁 resume/            # 在线简历子模块
│   │   │       ├── OnlineResume.tsx       # 简历展示页面
│   │   │       ├── ResumeEditor.tsx       # 简历编辑器
│   │   │       ├── ResumePreview.tsx      # 简历预览组件
│   │   │       ├── useResume.ts           # 简历数据 Hook
│   │   │       ├── types.ts              # 简历类型定义
│   │   │       └── index.ts              # 统一导出
│   │   │
│   │   ├── 📁 love/              # 💕 恋爱记录模块（3 个组件）
│   │   │   ├── TimeAlbum.tsx          # 时光相册（时间轴照片）
│   │   │   ├── WishList.tsx           # 双人许愿清单
│   │   │   └── BlessingBoard.tsx      # 好友祝福留言墙
│   │   │
│   │   ├── 📁 entertainment/     # 🎮 娱乐模块（1 个文件 56KB）
│   │   │   └── EntertainmentModules.tsx # 百宝箱 + 音乐墙 + 电影收藏
│   │   │
│   │   ├── 📁 community/         # 🌐 社区模块（7 个文件）
│   │   │   ├── PostCard.tsx           # 帖子卡片
│   │   │   ├── PostCreator.tsx        # 发帖组件
│   │   │   ├── PostList.tsx           # 帖子列表
│   │   │   ├── CommentSection.tsx     # 评论区
│   │   │   ├── AvatarChat.tsx         # 头像聊天组件
│   │   │   ├── useCommunity.ts        # 社区数据 Hook
│   │   │   └── types.ts              # 社区类型定义
│   │   │
│   │   ├── 📁 work/              # 💼 工作模块
│   │   │   └── WorkAssistant.tsx      # 工作助手综合组件
│   │   │
│   │   ├── 📁 auth/              # 🔐 认证模块
│   │   │   └── AuthModal.tsx          # 登录/注册/游客 弹窗
│   │   │
│   │   ├── 📁 layout/            # 📐 布局组件
│   │   │   └── Navbar.tsx             # 响应式导航栏（桌面顶部/移动底部）
│   │   │
│   │   ├── 📁 ui/                # 🎨 通用 UI 组件（7 个文件）
│   │   │   ├── StarCursor.tsx         # 星光鼠标跟随特效
│   │   │   ├── PageTransition.tsx     # 页面切换过渡动画封装
│   │   │   ├── SkillTreeView.tsx      # 技能树可视化组件
│   │   │   ├── ThemeSwitcher.tsx      # 主题切换选择面板
│   │   │   ├── SettingsModal.tsx      # 系统设置弹窗
│   │   │   ├── EditableWrapper.tsx    # 可编辑区域包装器（React Portal）
│   │   │   └── CursorEffectToggle.tsx # 鼠标特效开关按钮
│   │   │
│   │   ├── 📄 ChinaMap.tsx        # 中国地图组件（SVG 旅行轨迹可视化）
│   │   ├── 📄 TravelManager.tsx   # 旅行地点 CRUD 管理
│   │   ├── 📄 TravelDetailModal.tsx # 旅行详情弹窗
│   │   ├── 📄 LoveDetailModal.tsx   # 恋爱事件详情弹窗
│   │   └── 📄 ProfileEditModal.tsx  # 个人资料编辑弹窗
│   │
│   ├── 📁 contexts/              # ============== 全局状态管理 ==============
│   │   ├── 📄 ThemeContext.tsx    # 5 套主题切换（CSS 变量注入 + 键盘快捷键 Shift+Q）
│   │   ├── 📄 AuthContext.tsx     # 认证状态（登录/注册/游客/资料同步/乐观预渲染）
│   │   └── 📄 SettingsContext.tsx # 全局偏好设置（鼠标特效/隐私/通知/音效/自动播放）
│   │
│   ├── 📁 hooks/                 # ============== 自定义 Hooks ==============
│   │   ├── 📄 useTheme.ts        # 主题 Hook（ThemeContext 快捷访问）
│   │   ├── 📄 useSettings.ts     # 设置 Hook（SettingsContext 快捷访问）
│   │   └── 📄 useHomeEditor.ts   # 首页编辑模式 Hook
│   │
│   ├── 📁 lib/                   # ============== 工具函数 & 服务层 ==============
│   │   ├── 📄 supabase.ts        # Supabase 客户端（含 Mock 回退机制）
│   │   ├── 📄 ragEngine.ts       # RAG 知识检索引擎（单例模式）
│   │   ├── 📄 themes.ts          # 5 套主题完整配置定义（颜色/字体/圆角/阴影/玻璃效果）
│   │   ├── 📄 cardUtils.ts       # 数字名片工具（生成/下载/分享/历史）
│   │   ├── 📄 toast.ts           # 轻量级消息提示（纯 DOM 实现）
│   │   ├── 📄 storage.ts         # Supabase Storage 文件上传封装
│   │   ├── 📄 functions.ts       # 通用工具函数
│   │   └── 📄 utils.ts           # 样式合并工具（clsx + tailwind-merge）
│   │
│   ├── 📁 data/                  # ============== 数据层 ==============
│   │   ├── 📄 mock.ts            # 全局 Mock 数据（53KB，所有模块模拟数据）
│   │   ├── 📄 profile.ts         # 个人资料配置数据（技能/项目/经历）
│   │   └── 📄 skillTree.ts       # 技能树结构数据
│   │
│   ├── 📁 types/                 # ============== 类型定义 ==============
│   │   ├── 📄 auth.ts            # 认证相关类型（User/Credentials/AuthState）
│   │   └── 📄 profile.ts         # 个人资料相关类型
│   │
│   └── 📁 assets/                # 静态资源
│
├── 📁 supabase/                   # ============== 后端配置 ==============
│   ├── 📄 SUPABASE_SETUP.md       # Supabase 初始化指南
│   ├── 📁 migrations/            # 数据库迁移脚本（7 个文件）
│   │   ├── 0001_init.sql              # 初始化 profiles 表 + 触发器
│   │   ├── 0001_down.sql              # 回滚脚本
│   │   ├── 0002_profiles_background.sql # 添加 background_url 字段
│   │   ├── 0003_profiles_email.sql      # 添加 email 字段
│   │   ├── 0004_rpc_get_email_by_username.sql # 创建用户名查邮箱 RPC
│   │   ├── 0005_profiles_policies.sql   # Row Level Security 策略
│   │   └── 0006_profiles_add_fields.sql # 添加扩展字段（phone/gender/age）
│   └── 📁 functions/             # Edge Functions
│
├── 📁 public/                     # 静态公共资源（favicon 等）
└── 📁 dist/                       # 构建产物
```

---

## ⚡ 核心功能模块和工作流程

### 🏠 模块一：个人主页（Home）

> **入口路由：** `/` — 首页展示个人品牌形象

**功能矩阵：**

| 区块 | 组件 | 描述 |
|---|---|---|
| 🧑 Hero 区 | `HeroSection.tsx` | 个人头像 + 一句话简介 + 在线简历切换按钮 |
| 🛠️ 技能展示 | `SkillsSection.tsx` | 多分类技能条形图进度条动画 |
| 🗂️ 作品集 | `PortfolioSection.tsx` | 项目卡片网格 + 悬浮动效 |
| ❤️ 兴趣爱好 | `HobbiesSection.tsx` | 3D 卡片轮播 + 互动动画 |
| 🔗 自媒体矩阵 | `SocialMediaSection.tsx` | 各平台社交媒体链接集合 |
| 📬 联系方式 | `ContactSection.tsx` | 邮件 + 社交媒体联系入口 |
| 🎯 模块导航 | `ModulesSection.tsx` | 各功能模块快捷入口卡片 |

**可编辑模式：** 登录后所有板块支持 `EditableWrapper` 实时编辑（React Portal 模式避免 z-index 冲突），编辑结果持久化到 profile 数据。

**工作流程：**
```
页面加载 → ThemeContext 初始化 CSS 变量
        → 渲染 Hero → Skills → Portfolio → Hobbies → SocialMedia → Contact
        → 用户点击「查看简历」→ 切换为 OnlineResume 视图
        → 用户点击主题按钮 → 弹出 ThemeSwitcher → setTheme() → 全局色调平滑过渡
        → （登录后）悬浮板块 → 显示编辑按钮 → 点击编辑 → Portal 弹出编辑 UI
```

---

### 📚 模块二：学习空间（Learning）

> **入口路由：** `/learning` — 个人知识管理系统

**功能矩阵：**

| 子模块 | 描述 |
|---|---|
| 📖 知识库 | 三列布局（分类导航 / 文章列表 / 文章详情），支持分类筛选 |
| 🌲 技能树 | 可视化技能成长路径（层级展开 + 进度指示） |
| ✏️ 文章编辑器 | 基于 Tiptap 的富文本编辑（图片插入 / 链接 / 占位符） |
| 📥 文档导入 | 本地文件解析导入知识库 |
| 🤖 AI 阅读助手 | 基于 RAG 引擎的文章智能问答浮窗 |
| 💬 AI 聊天侧边栏 | 可拖拽分栏布局的 AI 对话面板 |
| 📄 在线简历 | 结构化简历展示 + 编辑器 + 预览（支持打印/PDF 导出） |

**RAG 引擎工作流程：**
```
用户输入查询 → extractKeywords() 提取关键词（过滤停用词）
            → search() 遍历索引计算 TF-IDF 相似度
            → 返回 Top-K 结果（内容 + 来源模块 + 置信度）
            → generateResponse() 根据查询意图选择回复模板：
               ├─ 包含「推荐/建议」→ 推荐模式
               ├─ 包含「怎么/如何」→ 教程模式
               ├─ 包含「什么/介绍」→ 百科模式
               └─ 其他             → 通用模式
            → 组装上下文回复 + 来源标注 + 置信度提示
```

---

### 🌸 模块三：生活记录（Life）

> **入口路由：** `/life` — 个人生活全方位记录

**7+ 子标签页：**

| 标签 | 功能描述 | 关键特性 |
|---|---|---|
| 💬 **朋友圈** | 发布图文动态 | 点赞 / 评论 / @他人 / 图片上传 |
| 🗺️ **旅拍相册** | 旅行足迹记录 | SVG 中国地图轨迹可视化 + 照片管理 |
| 💕 **恋爱记录** | 恋爱纪念日 | 实时秒级倒计时 + 时间轴事件管理 |
| 📸 **时光相册** | 时间轴相册 | 按日期排列的恋爱照片集 |
| 🌟 **许愿清单** | 双人心愿 | 心愿列表 + 完成状态标记 |
| 🎊 **祝福墙** | 好友祝福 | 留言墙 + 墙壁展示风格 |
| 🎵 **音乐墙** | 音乐收藏 | 音乐卡片墙 + 播放控制 |
| 🎬 **收藏电影** | 电影收藏 | 豆瓣风格电影卡片 |

**恋爱记录工作流程：**
```
进入恋爱记录 → 实时倒计时（setInterval 每秒更新，显示 X天X时X分X秒）
            → 时间轴事件（左右交替 timeline 布局）
            → 点击事件 → LoveDetailModal 详情弹窗（支持编辑/删除）
            → 新增帖子 → 填写标题/描述 + 上传图片 → 追加到时间轴
```

---

### 💼 模块四：工作助手（Work）

> **入口路由：** `/work` — 工作效率工具集

**3 个子模块：**

#### 📌 百宝箱（TreasureBox）
常用工具 / 网站 / 资源收藏管理，来源于 `EntertainmentModules.tsx` 共享组件

#### 🛒 电商运营（EcommerceModule）

| 子标签 | 功能 |
|---|---|
| 📊 概览 | 今日销售额 / 订单数 / 访客数 / 转化率 四大核心指标 |
| 📦 商品管理 | 商品列表 + CRUD（新建/编辑/上下架/删除） |
| 📋 订单管理 | 订单列表（已完成/待处理/已发货/已取消） |
| 📈 经营分析 | ECharts 多维度图表（柱状/趋势/漏斗/类别分析） |

#### 📱 新媒体运营（NewMediaModule）

| 子标签 | 功能 |
|---|---|
| 📂 内容库 | 内容管理（文章/视频/图片）+ 搜索/筛选 + CRUD |
| 📅 发布管理 | 帖子列表（草稿/已发布/定时发布）+ 数据（阅读/点赞/评论/分享） |
| 📊 数据分析 | 4 种图表切换（折线/柱状/饼图/雷达图）+ 平台统计 |

**平台支持：** 微信 💬 / 微博 🔴 / 小红书 📕 / 抖音 🎵，每个平台独立数据、独立筛选

---

### 🤖 模块五：AI 数字分身（AICharacter）

> **入口路由：** `/ai-character` — 个人 AI 数字分身创建

**三步引导式创建流程：**

```
┌─────────────────────────────────────────────────────────┐
│  Step 1: 🎙️ 声音克隆 (VoiceClone)                      │
│  ├─ 录制音频样本 / 上传本地音频                           │
│  ├─ 波形可视化 (VoiceWaveAnimation)                      │
│  └─ 生成声音模型 → VoiceModel                           │
├─────────────────────────────────────────────────────────┤
│  Step 2: 🖼️ 形象复刻 (AvatarClone)                      │
│  ├─ 预设头像选择 / 自定义上传                             │
│  ├─ 角色风格配置（Cartoon / Realistic）                   │
│  ├─ 背景场景自定义 (BackgroundCustomizer)                │
│  └─ 生成数字形象 → AvatarModel                          │
├─────────────────────────────────────────────────────────┤
│  Step 3: 💬 AI 对话 (CharacterChat)                      │
│  ├─ Three.js 3D 角色实时渲染 (Character3D)               │
│  ├─ 多模态输入 (MultiModalInput: 文字/图片/语音)         │
│  ├─ RAG 引擎处理用户消息 → 智能回复                      │
│  ├─ 打字机效果输出 (StreamingText)                       │
│  └─ 若已克隆声音 → Web Speech API 语音朗读回复           │
└─────────────────────────────────────────────────────────┘
```

---

### 👤 模块六：个人中心（Social）

> **入口路由：** `/social` — 用户账户与社交管理

**子模块矩阵：**

| 子标签 | 功能描述 |
|---|---|
| 🔗 自媒体矩阵 | 友情链接管理（CRUD）+ 社交账号展示 |
| 📝 留言墙 | 便利贴风格 + 三行自动滚动弹幕效果 |
| 🧪 实验室 | 项目开发时间轴 + 未来计划路线图 |

**特色功能：**
- 🃏 **数字名片生成器** — 6 种主题模板，html2canvas 导出图片 + 微信分享
- 👑 **VIP 会员入口** — UI 展示层
- ✏️ **个人资料编辑** — 头像/背景/用户名/简介 实时同步 Supabase
- 🔐 **登录/注册弹窗** — 未登录时自动弹出（100ms 延迟），支持游客一键登录
- 🎨 **主题选择面板** — 桌面端完整 5 主题预览切换

---

### 🎨 模块七：主题系统（全局）

5 套主题风格，通过 `ThemeContext` + CSS 变量实现零闪烁全局切换。

| 主题 | 图标 | 描述 | 配色特点 | 字体 |
|---|---|---|---|---|
| **极简** (minimal) | ◐ | 清爽白色系 | 蓝色主色 + 简洁线条 | Inter |
| **赛博** (cyber) | ◉ | 暗黑霓虹 | 青蓝 + 紫色 + 赛博朋克 | Inter + JetBrains Mono |
| **艺术** (artistic) | ❋ | 暖橙艺术感 | 珊瑚粉 + 橙色 + 手工感 | Playfair Display |
| **童趣** (cartoon) | ✿ | 明亮卡通系 | 粉色 + 明黄 + 圆润边角 | Nunito |
| **复古** (retro) | ✤ | 暖棕复古感 | 深金 + 棕红 + 老式排版 | Merriweather |

**快捷操作：** `Shift + Q` 全局循环切换主题

---

### 🔐 模块八：认证系统

```
用户访问 Social 页面
    → AuthContext 初始化
    ├─ 读取 LocalStorage 快照 → 乐观预渲染（避免登录闪烁）
    ├─ supabase.auth.getUser() 验证令牌有效性
    │   ├─ 已登录 → 拉取 profiles 表 → mapProfileToUser → setUser
    │   └─ 未登录 → 100ms 后自动弹出 AuthModal
    │
    → 邮箱登录
    ├─ emailRegex 判断 → 直接邮箱登录
    │
    → 用户名登录
    ├─ RPC get_email_by_username 查询 → 获取邮箱 → signInWithPassword
    │
    → 游客一键登录
    ├─ 自动生成临时 guest{randomId}@temp.local
    ├─ signUp → 创建 profile → signIn → fetchAndSetProfile
    │
    → 用户注册
    ├─ 检查用户名唯一性
    ├─ signUp + profiles.upsert → 自动登录 → navigate('/social')
    │
    → 登出
    └─ signOut → 清除 state + localStorage
```

**安全机制：**
- Row Level Security (RLS)：用户只能读写自己的 profile
- Token 自动刷新：`autoRefreshToken: true`
- Session 持久化：`persistSession: true`

---

## ⚙️ 部署指南

### 🚀 本地开发

**环境要求：**
- Node.js ≥ 18
- npm ≥ 9

**步骤：**

```bash
# 1. 克隆仓库
git clone <repo-url>
cd Opclaw

# 2. 安装依赖
npm install

# 3. 配置环境变量
cp .env.example .env
# 编辑 .env，填写以下 Supabase 配置：
```

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

```bash
# 4. 启动开发服务器
npm run dev
# 访问 http://localhost:5173
```

> [!TIP]
> 即使不配置 Supabase，项目也能正常启动——`supabase.ts` 内置了 **Mock Client 回退机制**，所有 API 调用会返回空数据而不会崩溃。

### 🗄️ Supabase 数据库初始化

在 Supabase 项目 SQL 编辑器中按顺序执行迁移：

```bash
supabase/migrations/0001_init.sql                    # 创建 profiles 表 + updated_at 触发器
supabase/migrations/0002_profiles_background.sql     # 添加 background_url 字段
supabase/migrations/0003_profiles_email.sql          # 添加 email 字段
supabase/migrations/0004_rpc_get_email_by_username.sql  # 创建用户名查邮箱 RPC
supabase/migrations/0005_profiles_policies.sql       # 配置 RLS 行级安全策略
supabase/migrations/0006_profiles_add_fields.sql     # 添加 phone/gender/age 扩展字段
```

**profiles 表最终结构：**

```sql
CREATE TABLE profiles (
  user_id        UUID PRIMARY KEY REFERENCES auth.users(id),
  username       TEXT UNIQUE,          -- 用户名（支持用户名登录）
  email          TEXT,                 -- 邮箱地址
  phone          TEXT,                 -- 手机号
  gender         TEXT,                 -- 性别（male/female/secret）
  age            INTEGER,              -- 年龄
  avatar_url     TEXT,                 -- 头像 URL
  background_url TEXT,                 -- 背景图 URL
  bio            TEXT,                 -- 个人简介
  created_at     TIMESTAMPTZ DEFAULT now(),
  updated_at     TIMESTAMPTZ DEFAULT now()
);
```

### ☁️ Vercel 部署

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录 & 部署
vercel

# 在 Vercel Dashboard 配置环境变量：
# → VITE_SUPABASE_URL
# → VITE_SUPABASE_ANON_KEY
```

> [!IMPORTANT]
> `vercel.json` 已配置 SPA 重写规则 `"rewrites": [{"source": "/(.*)", "destination": "/index.html"}]`，确保客户端路由正常工作。

### 🔨 生产构建

```bash
# TypeScript 类型检查 + 生产构建
npm run build

# 本地预览构建结果
npm run preview

# 代码规范检查
npm run lint
```

---

## 📦 API 接口

### 🔐 认证接口（Supabase Auth）

| 方法 | 接口 | 描述 | 参数 |
|---|---|---|---|
| POST | `supabase.auth.signInWithPassword()` | 邮箱+密码登录 | `{ email, password }` |
| POST | `supabase.auth.signUp()` | 注册新用户 | `{ email, password, options: { data } }` |
| POST | `supabase.auth.signOut()` | 退出登录 | — |
| GET | `supabase.auth.getUser()` | 获取当前用户 | — |
| SUB | `supabase.auth.onAuthStateChange()` | 监听认证状态 | callback |

### 📊 数据库接口（Supabase PostgreSQL）

| 操作 | 接口 | 描述 |
|---|---|---|
| SELECT | `supabase.from('profiles').select('*').eq('user_id', uid).maybeSingle()` | 获取用户资料 |
| INSERT | `supabase.from('profiles').insert({ ... })` | 创建用户资料 |
| UPDATE | `supabase.from('profiles').update({ ... }).eq('user_id', uid)` | 更新用户资料 |
| UPSERT | `supabase.from('profiles').upsert({ ... })` | 创建或更新 |
| RPC | `supabase.rpc('get_email_by_username', { p_username })` | 用户名查邮箱 |

### 📁 文件存储接口（Supabase Storage）

```typescript
import { uploadPublicFile } from '@/lib/storage'

// 上传文件到 public-assets 存储桶
const result = await uploadPublicFile(file: File, folder: string)
// 成功返回: { url: string }
// 失败返回: { error: string }
```

### 🤖 RAG 引擎 API（本地）

```typescript
import { ragEngine } from '@/lib/ragEngine'

// 1. 检索相关内容
const context = ragEngine.search(query: string, topK?: number)
// 返回: RAGContext {
//   relevantContent: string[]   // 匹配内容列表
//   sourceModules: string[]     // 来源模块名
//   confidence: number          // 最高相似度 (0-1)
// }

// 2. 生成智能回复（自动选择回复模板）
const response = ragEngine.generateResponse(query: string)
// 返回: string（自然语言回复）
```

### 🃏 数字名片工具 API

```typescript
import { generateCardImage, downloadImage, saveToHistory, getHistoryList, wechatShare } from '@/lib/cardUtils'

// 生成名片图片（html2canvas 截图，2x 高清）
const dataUrl = await generateCardImage(element: HTMLElement, theme?: string)

// 下载图片到本地
downloadImage(dataUrl: string, filename?: string)

// 保存到历史（localStorage，最多 20 条）
saveToHistory(card: DigitalCard, previewImage?: string)

// 获取历史列表
const list = getHistoryList()

// 微信分享（检测微信环境 / 降级复制剪贴板）
await wechatShare(card: DigitalCard, imageUrl?: string)
```

### 🔔 Toast 消息提示

```typescript
import { showToast } from '@/lib/toast'

// 显示中央浮动消息（2.5s 自动消失，弹性动画）
showToast('操作成功')
```

---

## 💡 常见问题

### ❓ Q1：启动后界面正常但登录报错？

**A：** 检查 `.env` 文件中 Supabase 配置是否正确填写：

```bash
# 在浏览器控制台验证
console.log(import.meta.env.VITE_SUPABASE_URL)
# 应输出 "https://xxx.supabase.co"，不应为空字符串
```

如果 `.env` 未配置，项目会自动使用 Mock Client，此时认证功能不可用但页面不会崩溃。

---

### ❓ Q2：如何添加新的学习文章？

**A：** 进入 `/learning`（学习空间）页面：

1. 点击 **「新建文章」** → 打开 Tiptap 富文本编辑器
2. 填写标题、正文（支持图片/链接插入）、摘要、标签
3. 点击保存 → 文章存入 `customArticles` 列表
4. 或点击 **「导入文档」** → 选择本地文件批量导入

### ❓ Q3：Supabase 数据库如何初始化？

**A：** 

1. 在 [supabase.com](https://supabase.com) 创建新项目
2. 进入 SQL Editor
3. 按顺序执行 `supabase/migrations/` 目录下的 6 个迁移文件
4. 将项目 URL 和 Anon Key 填入 `.env` 文件
5. 重启开发服务器

---

## 📊 项目统计

| 指标 | 数值 |
|---|---|
| 📄 页面数量 | 9 个独立路由页面 |
| 🧩 组件数量 | 60+ 可复用组件 |
| 📁 源码文件 | 80+ TypeScript/TSX 文件 |
| 📦 直接依赖 | 25 个 npm 包 |
| 🗄️ 数据迁移 | 7 个 SQL 迁移脚本 |
| 🎨 主题数量 | 5 套完整主题方案 |
| 🔑 CSS 变量 | 30+ 动态 CSS 自定义属性 |

---

<div align="center">

**一个人的数字宇宙，从这里开始！**

Made with ❤️ by 晓叶

</div>
