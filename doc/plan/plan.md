# Opclaw 项目 React 转小程序迁移计划
## 一、技术架构分析
### 1.1 当前项目技术栈
| 技术/库 | 版本 | 用途 | 小程序兼容性 |
|--------|------|------|-------------|
| React 19 | ^19.0.0 | UI 框架 | 需使用多端框架转换，不支持直接运行 |
| TypeScript | ^5.0.0 | 类型系统 | 主流多端框架均完全支持 |
| Vite 7 | ^7.0.0 | 构建工具 | 小程序有独立构建体系，需替换为对应框架的构建工具 |
| Supabase | ^2.0.0 | 后端 BaaS 服务 | 提供小程序 SDK，可直接适配 |
| Three.js | ^0.160.0 | 3D 渲染 | 小程序需使用 WebGL 适配方案，部分 API 受限 |
| Tailwind CSS | ^3.4.0 | 样式系统 | 需转换为小程序支持的 wxss/acss 样式，存在选择器限制 |
| Framer Motion | ^10.0.0 | 动画库 | 小程序不支持 DOM 操作，需替换为小程序原生动画 API |
### 1.2 核心兼容性问题总结
- React 语法不能直接在小程序中运行，需要通过多端框架进行编译转换
- 浏览器 DOM/BOM API 完全不可用，相关依赖需要全部替换
- 样式选择器存在限制（不支持通配符、子选择器嵌套过深等）
- 动画和 3D 渲染方案需要完全重构
- 路由系统需要替换为小程序原生路由机制
## 二、小程序框架选择建议
### 2.1 框架对比
| 框架 | 支持语法 | 学习成本 | 生态完善度 | 性能表现 | 适用场景 |
|------|---------|----------|------------|----------|----------|
| **Taro 4.x** | React/Vue | 低（与 React 语法高度一致） | 高（支持多端统一、配套工具完善） | 优（编译期优化 + 运行时优化） | **最适合本项目** |
| uni-app | Vue | 中（需要切换到 Vue 语法） | 高 | 良 | 适合 Vue 技术栈项目 |
| 原生小程序 | 小程序原生语法 | 高（完全新的语法体系） | 低 | 优 | 适合小型项目或极致性能需求 |
### 2.2 推荐方案：Taro 4.x
**推荐理由：**
1. 完全支持 React 18+ 和 TypeScript，与现有技术栈匹配度最高，代码复用率可达 60%+
2. 支持多端编译，后续可同时发布微信、支付宝、抖音等多平台小程序，以及 H5、App 版本
3. 完善的工具链支持，内置 Vite 构建、类型检查、代码规范等能力
4. 生态丰富，支持 Tailwind CSS 转译、状态管理等常用能力
5. 字节跳动、京东等大厂大规模使用，稳定性有保障
## 三、项目重构步骤
### 3.1 项目结构重新组织方案
```
taro-project/
├── config/                 # Taro 配置文件
├── src/
│   ├── pages/              # 小程序页面（对应原有路由页面）
│   ├── components/         # 公共组件（可复用原有组件逻辑）
│   ├── hooks/              # 自定义 Hooks（大部分可直接复用）
│   ├── utils/              # 工具函数（纯逻辑部分可直接复用）
│   ├── services/           # API 接口层（大部分可直接复用）
│   ├── store/              # 状态管理（调整为 Taro 支持的方案）
│   ├── assets/             # 静态资源（图片、字体等）
│   ├── styles/             # 全局样式
│   └── app.tsx             # 小程序入口文件
├── project.config.json     # 小程序项目配置
└── package.json
```
### 3.2 React 组件转换为小程序组件方法
1. **语法转换规则：**
   - JSX 语法基本保留，需将 HTML 标签替换为小程序内置组件：
     - `<div>` → `<View>`
     - `<span>` → `<Text>`
     - `<img>` → `<Image>`
     - `<a>` → `<Navigator>`
     - `<input>` → `<Input>` 等
   - 事件绑定修改：`onClick` → `onTap`，`onChange` → `onInput` 等
   - 样式类名绑定保持不变，`className` 正常使用
2. **生命周期适配：**
   - React 生命周期与小程序生命周期的映射关系：
     - `useEffect(() => {}, [])` → 对应 `onLoad` + `onShow`
     - 页面级生命周期使用 Taro 提供的 `useLoad`、`useShow`、`useReady` 等 Hooks
3. **DOM 操作相关代码完全移除，替换为小程序 API 实现**
### 3.3 CSS 样式系统适配方案
**Tailwind CSS 转换方案：**
1. 使用 `taro-plugin-tailwind` 插件，可直接支持 Tailwind CSS 语法
2. 配置需要兼容的小程序平台，自动转换为对应平台支持的样式
3. 需避免使用的 Tailwind 特性：
   - 通配符选择器 `*`
   - 子选择器深度超过 4 层
   - 复杂的伪类选择器（小程序仅支持 `:first-child`、`:last-child` 等有限伪类）
4. 自定义样式适配：
   - 原有 CSS 文件可保留，自动转换为 wxss 格式
   - CSS-in-JS 方案需替换为 Taro 支持的样式方案，或抽离为独立 CSS 文件
### 3.4 动画效果（Framer Motion）替代方案
1. **简单动画：** 使用 Taro 内置的 `useAnimate` Hook 或小程序原生 `createAnimation` API
2. **复杂动画：** 推荐使用 `@taroify/core` 组件库提供的动画组件，或使用 CSS 动画（小程序支持大部分 CSS 动画属性）
3. **过渡效果：** 替换为小程序原生的 `transition` 组件实现页面和组件的过渡效果
4. 原有 Framer Motion 相关代码需要完全重写，建议优先保留核心动画效果，非关键动画可适当简化
### 3.5 3D 渲染（Three.js）在小程序中的处理方案
**可选方案：**
1. **方案一（推荐）：** 使用小程序官方提供的 `threejs-miniprogram` 适配库
   - 支持大部分 Three.js API，渲染性能较好
   - 需要将 3D 场景渲染到 `<canvas>` 组件中
   - 注意：移动端性能限制，复杂 3D 场景需要简化面数和材质
2. **方案二：** 将 3D 功能替换为 2D 展示或静态资源，优先保障核心功能可用
3. **方案三：** 3D 功能通过 WebView 嵌套原有 H5 页面实现，但性能和体验较差
**迁移策略：** 优先迁移核心功能，3D 相关功能作为二期迭代内容
### 3.6 路由系统替换方案
1. 原有 React Router 完全替换为 Taro 路由系统：
   - 页面路由在 `app.config.ts` 中统一配置，对应小程序 `app.json` 配置
   - 页面跳转使用 Taro 提供的 API：`Taro.navigateTo`、`Taro.redirectTo`、`Taro.switchTab` 等
   - 路由参数通过 `useRouter` Hook 获取
2. 嵌套路由、动态路由等复杂路由需要调整为小程序扁平式路由结构
### 3.7 状态管理迁移方案
1. **原有 Redux/Zustand/Jotai 等状态管理库：**
   - Zustand/Jotai 等不依赖 DOM 的状态管理库可直接使用
   - Redux 可继续使用，但建议简化为轻量状态管理方案
2. **推荐方案：** 使用 Taro 官方推荐的 `@tarojs/redux` 或继续使用原有 Zustand，保持状态管理逻辑尽量不变
3. 全局状态需要适配小程序的 App 生命周期，初始化时机调整到 `app.tsx` 中
## 四、API 适配方案
### 4.1 Supabase 集成在小程序中的配置方法
1. 使用 Supabase 官方提供的小程序 SDK：`@supabase/supabase-js` 完全支持小程序环境
2. 配置步骤：
   - 在 Supabase 后台设置中添加小程序域名到白名单
   - 初始化 Supabase 客户端时，配置 `fetch` 为小程序原生 `wx.request` 或 Taro.request
   ```typescript
   import { createClient } from '@supabase/supabase-js'
   const supabase = createClient('SUPABASE_URL', 'SUPABASE_ANON_KEY', {
     fetch: Taro.request,
   })
   ```
3. 注意：小程序不支持 Cookie，认证需使用 Token 存储在本地存储中
### 4.2 文件上传下载功能适配
1. 原有浏览器 `File` API 替换为小程序 `wx.chooseMedia`、`wx.uploadFile` API
2. Supabase 存储功能适配：
   - 文件上传使用 Taro.uploadFile 直接上传到 Supabase 存储，或通过小程序 API 上传后传递到后端
   - 下载文件使用 `Taro.downloadFile` API，下载后可保存到本地或临时使用
### 4.3 认证系统迁移方案
1. 原有邮箱/密码、OAuth 认证方式适配：
   - 邮箱/密码认证逻辑可完全复用，Token 存储到 Taro.getStorageSync/Taro.setStorageSync
   - 第三方 OAuth 认证需要替换为小程序原生的授权登录方式（微信授权、手机号授权等）
2. 认证状态持久化：使用小程序本地存储替代浏览器 LocalStorage/SessionStorage
## 五、项目配置详细步骤
### 5.1 开发环境搭建
1. 安装 Taro CLI：
   ```bash
   npm install -g @tarojs/cli@latest
   ```
2. 安装微信开发者工具，配置小程序 AppID
3. 配置开发环境域名白名单（在微信公众平台中配置 request、uploadFile、downloadFile 域名）
### 5.2 小程序项目初始化配置
1. 使用 Taro CLI 创建新项目：
   ```bash
   taro init opclaw-miniprogram
   ```
   选择 React + TypeScript 模板，选择微信小程序为目标平台
2. 将原有项目的业务代码按新的项目结构迁移到对应目录
### 5.3 构建工具链配置
1. `config/index.ts` 核心配置：
   ```typescript
   const config = {
     projectName: 'opclaw-miniprogram',
     date: '2026-4-29',
     designWidth: 750, // 设计稿宽度，适配 Tailwind 配置
     deviceRatio: {
       640: 2.34 / 2,
       750: 1,
       828: 1.81 / 2
     },
     sourceRoot: 'src',
     outputRoot: 'dist',
     plugins: ['taro-plugin-tailwind'], // 启用 Tailwind 插件
     defineConstants: {},
     copy: {
       patterns: [],
       options: {}
     },
     framework: 'react',
     compiler: 'vite', // 使用 Vite 构建，保持与原有项目一致
     mini: {
       postcss: {
         pxtransform: {
           enable: true,
           config: {}
         },
         cssModules: {
           enable: false,
           config: {
             namingPattern: 'module',
             generateScopedName: '[name]__[local]___[hash:base64:5]'
           }
         }
       }
     }
   }
   ```
2. Tailwind CSS 配置文件 `tailwind.config.js` 可复用原有配置，只需调整内容路径
### 5.4 依赖包调整和替换清单
| 原有依赖 | 替换方案 | 说明 |
|----------|---------|------|
| react-dom | 移除 | 小程序不需要 DOM 渲染 |
| react-router-dom | 移除 | 使用 Taro 路由系统 |
| framer-motion | 移除 | 替换为小程序动画 API |
| three | `threejs-miniprogram` | 小程序适配版 Three.js |
| @types/react | 保留 | Taro 兼容 React 类型 |
| @types/react-dom | 移除 | 不需要 |
| vite | 保留 | Taro 支持 Vite 作为构建器 |
| tailwindcss | 保留 | 需要配合 taro-plugin-tailwind 使用 |
| postcss | 保留 | Taro 内置 PostCSS |
| supabase/supabase-js | 保留 | 完全支持小程序环境 |
## 六、部署上线流程
### 6.1 小程序平台注册和认证流程
1. 注册微信小程序账号：访问 https://mp.weixin.qq.com/ 注册企业或个人主体小程序
2. 完成小程序认证（企业认证需 300 元认证费，每年年审）
3. 获取小程序 AppID 和 AppSecret，配置到项目中
4. 配置服务器域名白名单：在小程序后台开发设置中配置 request、uploadFile、downloadFile 合法域名
5. 配置类目和功能：根据项目功能选择对应的服务类目，开通需要的接口权限（如支付、分享等）
### 6.2 代码审核注意事项
1. **功能合规：**
   - 确保所有功能符合微信小程序平台规范，无违规内容
   - 涉及用户隐私的功能需要明确告知用户，获取用户授权
   - AI 相关功能需要提供内容安全审核机制
2. **提交审核前检查：**
   - 测试所有功能在真机上正常运行
   - 没有多余的调试代码和控制台输出
   - 所有图片和资源都已替换为线上地址
   - 用户协议和隐私政策齐全并正确展示
3. **常见审核不通过原因：**
   - 功能描述与实际不符
   - 缺少必要的用户授权提示
   - 涉及未开放的功能类目
   - 存在虚拟支付等违规功能
### 6.3 发布流程详解
1. **本地打包：**
   ```bash
   npm run build:weapp
   ```
   生成 `dist` 目录下的微信小程序代码
2. **上传代码：**
   在微信开发者工具中打开 `dist` 目录，点击上传，填写版本号和更新说明
3. **提交审核：**
   在微信公众平台版本管理中，将上传的版本提交审核
4. **发布上线：**
   审核通过后，在版本管理中点击发布，全量上线或灰度发布
### 6.4 后续维护更新策略
1. **版本迭代：** 采用敏捷开发模式，小版本快速迭代，大版本按计划发布
2. **热更新：** 集成小程序热更新能力，支持紧急 Bug 修复不经过审核快速更新
3. **性能监控：** 接入小程序性能监控 SDK，实时监控用户体验和错误情况
4. **用户反馈：** 建立用户反馈渠道，快速响应用户问题和需求
## 七、风险评估与解决方案
### 7.1 技术难点识别
| 难点 | 影响程度 | 解决方案 |
|------|----------|----------|
| React 组件大规模转换 | 中 | 开发自动化转换脚本处理基础语法转换，剩余手动调整 |
| 3D 渲染性能问题 | 高 | 简化 3D 场景，优先使用 2D 替代，作为二期功能迭代 |
| 动画效果重构工作量大 | 中 | 优先保留核心动画，非关键动画适当简化 |
| 样式兼容性问题 | 中 | 建立样式规范，使用统一的 Tailwind 配置和全局样式 |
### 7.2 性能优化建议
1. **包体积优化：**
   - 代码分割，按需引入组件和依赖
   - 图片资源压缩，使用 WebP 格式，合理使用分包加载
   - 移除未使用的代码和资源，主包体积控制在 2MB 以内
2. **渲染性能优化：**
   - 使用 Taro 提供的 `memo`、`useMemo` 等优化渲染性能
   - 避免在 `onPageScroll` 等高频事件中执行复杂逻辑
   - 长列表使用虚拟列表组件实现
3. **启动性能优化：**
   - 减少首屏加载依赖，优化初始化逻辑
   - 首屏资源预加载，非关键资源延迟加载
### 7.3 兼容性问题处理
1. **多平台兼容性：**
   - 使用 Taro 提供的 API 替代平台原生 API，自动适配不同平台
   - 针对不同平台的差异使用条件编译处理
2. **机型兼容性：**
   - 适配不同屏幕尺寸，使用 rpx 单位和响应式布局
   - 低版本微信客户端兼容性处理，使用特性检测优雅降级
3. **API 兼容性：**
   - 对于小程序新版本 API，提供降级方案，兼容低版本基础库
## 八、迁移时间规划（参考）
| 阶段 | 内容 | 时间 | 人员 |
|------|------|------|------|
| 第一阶段 | 环境搭建、框架配置、基础依赖适配 | 3 天 | 前端开发 |
| 第二阶段 | 页面结构迁移、组件转换、路由配置 | 7 天 | 前端开发 |
| 第三阶段 | 样式系统适配、动画效果重构 | 5 天 | 前端开发/UI |
| 第四阶段 | API 适配、状态管理迁移、业务逻辑调试 | 7 天 | 前端开发/后端 |
| 第五阶段 | 3D 功能适配、性能优化 | 5 天 | 前端开发 |
| 第六阶段 | 测试、Bug 修复、审核发布准备 | 3 天 | 测试/产品 |
| **总计** | | **30 天** | |
