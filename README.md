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

<img width="2529" height="1302" alt="image" src="https://github.com/user-attachments/assets/36ee8fe9-317e-430a-b53f-7da63134656c" />

**Opclaw** 是一款面向 **OPC 超级个体**（One Person Company）的现代化全栈 Web 应用，基于 **React 19 + TypeScript + Vite 7** 构建，完美适配 PC 与移动端。项目融合 **个人主页（简历）**、**学习空间（知识库/RAG 问答）**、**工作助手（电商/新媒体/百宝箱）**、**生活记录（朋友圈/旅行/恋爱记录等 7+ 功能）**、**AI 数字人分身** 于一体，支持 **5 种主题** 一键切换，致力于打造高颜值、可扩展的个人数字宇宙——实现 **个人 IP 展示 + 数字资产管理 + AI 数字人分身赋能** 的一站式解决方案。

### ✨ 核心亮点

| 特性                        | 描述                                                                             |
| --------------------------- | -------------------------------------------------------------------------------- |
| 🎨**5 套主题系统**    | 极简 / 赛博 / 艺术 / 童趣 / 复古，通过 CSS 变量 + React Context 实现全局实时切换 |
| 🤖**AI 分身系统**     | 声音克隆 → 形象复刻 → 3D 角色对话的三步引导式创建流程                          |
| 📱**响应式设计**      | 桌面端顶部导航 + 移动端底部 Tab 导航，完美适配双端体验                           |
| ✨**流畅动画**        | 基于 Framer Motion 实现页面过渡、微交互、布局动画                                |
| 🔐**Supabase 后端**   | 用户认证 + 数据持久化 + 文件存储 + RLS 行级安全                                  |
| ⚡**极速构建**        | Vite 7.3 HMR 热更新 + 多入口构建支持                                             |
| 🧠**RAG 智能引擎**    | 自研关键词检索 + 多模式回复生成（推荐/教程/百科/通用）                           |
| 🃏**数字名片生成**    | html2canvas 导出 + 微信分享 + 历史记录管理                                       |
| 🌟**星光鼠标特效**    | 跟随鼠标的粒子拖尾动画，可在设置中开关                                           |
| 🖨️**打印/PDF 导出** | 针对简历等页面优化了打印样式                                                     |

---

## 🛠️ 技术栈

### 🖥️ 前端核心

| 技术                                           | 版本    | 用途                                       |
| ---------------------------------------------- | ------- | ------------------------------------------ |
| [React](https://react.dev/)                     | 19.2.0  | UI 框架（函数组件 + Hooks）                |
| [React Router](https://reactrouter.com/)        | 7.13.0  | Hash 路由管理 + 页面跳转                   |
| [TypeScript](https://www.typescriptlang.org/)   | 5.9.3   | 静态类型检查，提升代码可维护性             |
| [Tailwind CSS](https://tailwindcss.com/)        | 4.1.18  | 原子化 CSS 框架（v4 Vite 插件模式）        |
| [Framer Motion](https://www.framer.com/motion/) | 12.34.1 | 声明式动画引擎（页面过渡/微交互/布局动画） |
| [Lucide React](https://lucide.dev/)             | 0.574.0 | 图标库（1000+ SVG 图标）                   |
| [Vite](https://vitejs.dev/)                     | 7.3.1   | 下一代构建工具（ESM + HMR + Rollup）       |

### ☁️ 后端 & 部署

| 技术                             | 版本   | 用途                                       |
| -------------------------------- | ------ | ------------------------------------------ |
| [Supabase](https://supabase.com/) | 2.46.1 | BaaS（PostgreSQL + Auth + Storage + RPC）  |
| [Vercel](https://vercel.com/)     | —     | 免费静态站点部署 + CDN 加速                |
| ESLint                           | 9.39.1 | 代码规范检查（React Hooks 规则 + Refresh） |

### 🤖 AI & 3D

| 技术                                                        | 版本    | 用途                                      |
| ----------------------------------------------------------- | ------- | ----------------------------------------- |
| [Three.js](https://threejs.org/)                             | 0.183.1 | WebGL 3D 渲染引擎                         |
| [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber) | 9.5.0   | React 声明式 Three.js 渲染器              |
| [@react-three/drei](https://github.com/pmndrs/drei)          | 10.7.7  | Three.js 辅助工具集（OrbitControls 等）   |
| RAG Engine（自研）                                          | —      | 关键词提取 + TF-IDF 相似度匹配 + 模板回复 |

### 📊 数据可视化 & 编辑器

| 技术                                                            | 版本   | 用途                                 |
| --------------------------------------------------------------- | ------ | ------------------------------------ |
| [ECharts](https://echarts.apache.org/)                           | 6.0.0  | 图表引擎（折线/柱状/饼图/雷达图）    |
| [echarts-for-react](https://github.com/hustcc/echarts-for-react) | 3.0.6  | ECharts React 封装组件               |
| [Tiptap](https://tiptap.dev/)                                    | 3.20.0 | 富文本编辑器（图片/链接/占位符扩展） |
| [html2canvas](https://html2canvas.hertzen.com/)                  | 1.4.1  | DOM 截图，用于数字名片图片生成       |

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
│   ├── 📄 App.tsx                 # 根组件：三层 Provider 嵌套 + 12 条路由 + AnimatePresence
│   ├── 📄 index.css               # 全局样式：@theme 声明 + 6 个关键帧 + glass/gradient 工具类
│   │
│   ├── 📁 pages/                  # ====== 12 个页面组件 
│   │   ├── 📄 Home.tsx            # 🏠 首页入口：双端响应式自适应。移动端渲染 Bento 导航与特色看板，桌面端重定向至个人主页
│   │   ├── 📄 Profile.tsx         # 👤 个人主页：桌面端 IP 品牌展示区（Hero/技能表/作品集/3D爱好轮播/联系等六大板块）
│   │   ├── 📄 Learning.tsx        # 📚 学习空间：知识库 + 技能树 + 文章编辑器 + AI 助手
│   │   ├── 📄 Life.tsx            # 🌸 生活记录：7 个子标签页（朋友圈/旅拍/恋爱/相册/许愿/祝福/音乐/电影）
│   │   ├── 📄 Work.tsx            # 💼 工作助手：百宝箱 + 电商运营 + 新媒体运营
│   │   ├── 📄 Social.tsx          # 👤 个人中心：包含友情链接、留言墙、设置、个人名片与 Supabase 资料同步
│   │   ├── 📄 AICharacter.tsx     # 🤖 AI 分身：3 步引导 + 3D 角色场景 + StepAudio 2.5 实时发音对话
│   │   ├── 📄 Assets.tsx          # 💰 数字资产：多维资产网格看板与价值分析图表
│   │   ├── 📄 Community.tsx       # 🌐 社区广场：动态帖子流与 AI 虚拟化身聊天
│   │   ├── 📄 Laboratory.tsx      # 🧪 探索实验室：开发历程时间轴 + 未来计划 + StepAudio 语音能力验证沙盒
│   │   ├── 📄 ResumeTemplates.tsx # 🎨 简历模板工坊：四大经典简历模板（简约/商务/创意/校园）一键挑选
│   │   └── 📄 ResumeBuilder.tsx   # 📄 简历生成编辑器：A4单页排版 + 实时双向编辑 + AI(STAR法则)简历描述智能优化
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

### 🏠 模块一：个人主页 & 品牌展示（Home & Profile）

> **入口路由：** `/` (双端入口分发) 与 `/profile` (独立品牌主页)

**双端自适应展示架构：**

* **移动端 (MobileHome)**：极简轻奢的 Bento 网格风格，顶部展示迎宾问候与日历，包含：
  * **热点轮播横幅**：自动循环播放热门模块（AI分身、简历工坊、资产看板等）入口，带磨砂玻璃特效。
  * **创意 Bento 卡片推荐**：包含“恋爱记录”、“百宝箱快捷书签”、“沉浸氛围音乐墙”、“城市漫游相册”等高保真微卡片。
  * **网格快捷入口菜单**：提供 8 个功能子页面的快速平滑导航启动器。
* **桌面端 (Profile)**：高保真个人 IP 品牌展示区，采用纵向全宽滚动与 Framer Motion 视差效果：

**功能矩阵：**

| 区块          | 组件                       | 描述                                                                                  |
| ------------- | -------------------------- | ------------------------------------------------------------------------------------- |
| 🧑 Hero 区    | `HeroSection.tsx`        | 3D 悬浮视差大图 + 自我简介 + 实时主题与预览/编辑模式切换，支持撤销/重做与一键重置数据 |
| 🛠️ 技能展示 | `SkillsSection.tsx`      | 技能树三维分类可视化，多维度的条形图与星级能力评估分布                                |
| 🗂️ 作品集   | `PortfolioSection.tsx`   | 项目卡片网格展示，支持交互式卡片缩放及分类过滤动效                                    |
| ❤️ 兴趣爱好 | `HobbiesSection.tsx`     | 精美 3D 卡片轮播，鼠标拖拽/自动旋转呈现多维生活兴趣                                   |
| 🔗 自媒体矩阵 | `SocialMediaSection.tsx` | 各大自媒体平台账号（Bilibili、Github、Twitter等）卡片链接                             |
| 📬 联系方式   | `ContactSection.tsx`     | 邮箱 + 社交网络直达通道 + 快捷在线留言反馈                                            |
| 📱 NFC 配对   | `NfcConnectModule.tsx`   | Web NFC 硬件检测 + 3D 动画模拟，极速配对交换数字名片                                  |

**可编辑模式：** 登录后所有板块支持 `EditableWrapper` 实时编辑（通过 React Portal 模式完美规避 z-index 冲突），支持对基本资料、技能星级、项目清单、兴趣好恶的增删改，并一键同步存储至 Supabase 后端。

**工作流程：**

```
页面加载 → 监测窗口宽度：
         ├─ < 768px (移动端) → 渲染 MobileHome.tsx 极简 Bento 仪表盘
         └─ ≥ 768px (桌面端) → 渲染 Profile.tsx 个人 IP 品牌主页
                → 滚动监听触发 AnimatedSection 逐级淡入与滑动进入
                → 用户点击「查看简历」→ 切换至 OnlineResume 简历预览视图
                → 用户点击「分享」→ 唤起 DigitalCardModal 生成精美数字名片
                → 点击「NFC互动」→ 启动 Web NFC 设备探测或精美 3D 握手配对模拟
```

---

### 📚 模块二：学习空间（Learning）

> **入口路由：** `/learning` — 个人知识管理系统

**功能矩阵：**

| 子模块           | 描述                                                                                        |
| ---------------- | ------------------------------------------------------------------------------------------- |
| 📖 知识库        | 三列布局（分类导航 / 文章列表 / 文章详情），支持分类搜索与 CRUD 管理                        |
| 🌲 技能树        | 可视化技能成长路径（层级展开 + 进度指示）与 D3-like 原生 SVG 节点渲染                       |
| ✏️ 文章编辑器  | 基于 Tiptap 的富文本编辑（支持加粗/斜体/标题/块引用/列表/代码块/图片/链接等，附带气泡菜单） |
| 📥 文档导入      | 本地 Markdown / TXT 文档解析与自动提取摘要，一键导入个人知识库                              |
| 🤖 AI 阅读助手   | 基于 RAG 引擎的文章智能问答浮窗，支持选区划词智能润色/翻译/续写                             |
| 💬 AI 聊天侧边栏 | 可拖拽分栏布局的 AI 对话面板，支持与知识库的深度问答交互                                    |

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

| 标签                   | 功能描述     | 关键特性                          |
| ---------------------- | ------------ | --------------------------------- |
| 💬**朋友圈**     | 发布图文动态 | 点赞 / 评论 / @他人 / 图片上传    |
| 🗺️**旅拍相册** | 旅行足迹记录 | SVG 中国地图轨迹可视化 + 照片管理 |
| 💕**恋爱记录**   | 恋爱纪念日   | 实时秒级倒计时 + 时间轴事件管理   |
| 📸**时光相册**   | 时间轴相册   | 按日期排列的恋爱照片集            |
| 🌟**许愿清单**   | 双人心愿     | 心愿列表 + 完成状态标记           |
| 🎊**祝福墙**     | 好友祝福     | 留言墙 + 墙壁展示风格             |
| 🎵**音乐墙**     | 音乐收藏     | 音乐卡片墙 + 播放控制             |
| 🎬**收藏电影**   | 电影收藏     | 豆瓣风格电影卡片                  |

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

| 子标签      | 功能                                               |
| ----------- | -------------------------------------------------- |
| 📊 概览     | 今日销售额 / 订单数 / 访客数 / 转化率 四大核心指标 |
| 📦 商品管理 | 商品列表 + CRUD（新建/编辑/上下架/删除）           |
| 📋 订单管理 | 订单列表（已完成/待处理/已发货/已取消）            |
| 📈 经营分析 | ECharts 多维度图表（柱状/趋势/漏斗/类别分析）      |

#### 📱 新媒体运营（NewMediaModule）

| 子标签      | 功能                                                          |
| ----------- | ------------------------------------------------------------- |
| 📂 内容库   | 内容管理（文章/视频/图片）+ 搜索/筛选 + CRUD                  |
| 📅 发布管理 | 帖子列表（草稿/已发布/定时发布）+ 数据（阅读/点赞/评论/分享） |
| 📊 数据分析 | 4 种图表切换（折线/柱状/饼图/雷达图）+ 平台统计               |

**平台支持：** 微信 💬 / 微博 🔴 / 小红书 📕 / 抖音 🎵，每个平台独立数据、独立筛选

---

### 🎨 模块五：简历工坊（ResumeTemplates & ResumeBuilder）

> **入口路由：** `/resume-templates` (模板工坊) 与 `/resume-builder` (简历生成编辑器)

**功能架构：**

* **简历模板库 (ResumeTemplates)**：提供四大预设的经典专业设计模板，支持一键预览与选用：
  * **极简雅致 (Minimal)**：干净利落的衬线字体排版，注重核心文字表达，适合高管/学术/通用岗位。
  * **专业精英 (Business)**：沉稳大气的蓝灰双栏排版，重点突出项目与工作经历，适合金融/法务/运营。
  * **极客先锋 (Creative)**：暗色霓虹渐变背景，突出个人主页链接与技术栈标签，适合独立开发者/设计师。
  * **青春逐梦 (Campus)**：青绿活力配色的模块化单栏设计，强调社会实践与学术背景，适合应届生。
* **生成编辑器 (ResumeBuilder)**：支持响应式三栏/双栏布局，集成高效简历生成引擎：
  * **双向同步实时预览**：表单数据输入即时反映在 A4 单页简历画布上。
  * **AI (STAR法则) 优化器**：内置 AI 简历助手，将项目经历按照 *情境(Situation) -> 任务(Task) -> 行动(Action) -> 成果(Result)* 进行自动化重构与词汇润色。
  * **备份与导出**：支持完整的简历 JSON 数据备份导出与本地导入；利用 CSS 打印媒体查询（`@media print`）实现一键无损保存为 A4 格式 PDF；配合 `html2canvas` 导出高清图片。

---

---

### 🤖 模块六：AI 数字人分身

> **入口路由：** `/ai-character` (三步分身引导) 与 `/laboratory` (语音沙盒测试)

Opclaw 深度集成了 **阶跃星辰 (StepFun)** 公司的 **StepAudio 2.5** 多模态语音大模型服务与 **DeepSeek-V4-Pro** 智能代理代理层，支持两种对话入口：

#### 1. 引导式数字分身创建与实时 3D 渲染 (AICharacter)

通过精美的三步流程，帮助用户克隆自身：

```
┌─────────────────────────────────────────────────────────┐
│  Step 1: 🎙️ 声音克隆 (VoiceClone)                      │
│  ├─ 调用 Web MediaRecorder 录制 15秒语音样本并上传        │
│  ├─ Canvas 绘制实时麦克风音频输入波形动画                  │
│  └─ 生成个性化声音模型 → VoiceModel                       │
├─────────────────────────────────────────────────────────┤
│  Step 2: 🖼️ 形象复刻 (AvatarClone)                      │
│  ├─ ModelScope FLUX 异步画像克隆生成风格化形象卡片       │
│  ├─ 自定义场景环境（支持背景磨砂玻璃、3D 渐变自定义）       │
│  └─ 生成专属 3D 形象 → AvatarModel                      │
├─────────────────────────────────────────────────────────┤
│  Step 3: 💬 AI 对话与 3D 渲染互动 (CharacterChat)        │
│  ├─ Three.js / R3F 渲染高保真 3D 头像模型，支持鼠标交互    │
│  ├─ 实时打字机式流式消息流 (StreamingText)               │
│  ├─ 支持基于本地音频振幅映射驱动 Live2D/3D 模型口型变化     │
│  └─ 云端 TTS 情感语音流自然播报，支持 Web Speech 兜底     │
└─────────────────────────────────────────────────────────┘
```

#### 2. 阶跃星辰 StepAudio 语音实验室沙盒 (Laboratory)

我们在探索实验室的“语音实验室”标签页中，提供了 StepAudio 的核心能力直连验证工具：

* **📞 全双工实时通话 (WebSocket Realtime)**：基于 `wss` 连接，实现毫秒级超低延迟的“双向音频流传输”，支持服务端 VAD 智能断句检测，无需手动按键即可进行流畅的双向实时口头对话。
* **💬 多模态语音对话 (Chat)**：使用 `stepaudio-2.5-chat` 模型，实现极速的流式文本-语音混合式问答。
* **🔊 表现力语音合成 (TTS)**：直连 `stepaudio-2.5-tts` 合成接口，支持传入 instruction 语气指令（如“温柔、兴奋、悲伤”等）及括号细节（如 `[laughter]` 笑声），生成富有情感表达力的自然音频。
* **🎤 流式语音转文字 (ASR)**：直连 `stepaudio-2.5-asr` 接口，支持分块流式音频上传及极速秒级识别。

---

### 👤 模块七：个人中心（Social）

> **入口路由：** `/social` — 用户账户与社交管理

**子模块矩阵：**

| 🧪 实验室 | 整合开发历程时间轴、未来开发计划路线图，以及 🎛️ StepAudio 2.5 语音能力沙盒验证器（支持全双工实时通话/ASR/TTS/Chat） |

**特色功能：**

- 🃏 **数字名片与 Web NFC 互联** — 支持 6 种精美名片主题，html2canvas 高清像素导出与微信朋友圈分享；集成浏览器 Web NFC 硬件通信接口（带 3D 动画回退模拟），实现超级个体间的秒级接触式名片互换。
- 👑 **VIP 会员中心** — 会员特权与卡片效果展示层
- ✏️ **个人资料编辑** — 头像、背景图、昵称、个人简介及基础档案（电话/年龄/性别）实时与 Supabase PostgreSQL 保持多端同步。
- 🔐 **智能身份认证** — 提供支持用户名/邮箱/密码注册登录的统一弹窗（AuthModal），支持游客临时账号“一键闪登”（Guest Auto-Registration & Login）。
- 🎨 **全局主题控制台** — 提供桌面端悬浮面板与移动端选项页进行 5 大高颜值主题的一键热切换。

---

### 🎨 模块八：主题系统（全局）

5 套主题风格，通过 `ThemeContext` + CSS 变量实现零闪烁全局切换。

| 主题                      | 图标 | 描述       | 配色特点               | 字体                   |
| ------------------------- | ---- | ---------- | ---------------------- | ---------------------- |
| **极简** (minimal)  | ◐   | 清爽白色系 | 蓝色主色 + 简洁线条    | Inter                  |
| **赛博** (cyber)    | ◉   | 暗黑霓虹   | 青蓝 + 紫色 + 赛博朋克 | Inter + JetBrains Mono |
| **艺术** (artistic) | ❋   | 暖橙艺术感 | 珊瑚粉 + 橙色 + 手工感 | Playfair Display       |
| **童趣** (cartoon)  | ✿   | 明亮卡通系 | 粉色 + 明黄 + 圆润边角 | Nunito                 |
| **复古** (retro)    | ✤   | 暖棕复古感 | 深金 + 棕红 + 老式排版 | Merriweather           |

**快捷操作：** `Shift + Q` 全局循环切换主题

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

| 方法 | 接口                                   | 描述          | 参数                                       |
| ---- | -------------------------------------- | ------------- | ------------------------------------------ |
| POST | `supabase.auth.signInWithPassword()` | 邮箱+密码登录 | `{ email, password }`                    |
| POST | `supabase.auth.signUp()`             | 注册新用户    | `{ email, password, options: { data } }` |
| POST | `supabase.auth.signOut()`            | 退出登录      | —                                         |
| GET  | `supabase.auth.getUser()`            | 获取当前用户  | —                                         |
| SUB  | `supabase.auth.onAuthStateChange()`  | 监听认证状态  | callback                                   |

### 📊 数据库接口（Supabase PostgreSQL）

| 操作   | 接口                                                                       | 描述         |
| ------ | -------------------------------------------------------------------------- | ------------ |
| SELECT | `supabase.from('profiles').select('*').eq('user_id', uid).maybeSingle()` | 获取用户资料 |
| INSERT | `supabase.from('profiles').insert({ ... })`                              | 创建用户资料 |
| UPDATE | `supabase.from('profiles').update({ ... }).eq('user_id', uid)`           | 更新用户资料 |
| UPSERT | `supabase.from('profiles').upsert({ ... })`                              | 创建或更新   |
| RPC    | `supabase.rpc('get_email_by_username', { p_username })`                  | 用户名查邮箱 |

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

<div align="center">
