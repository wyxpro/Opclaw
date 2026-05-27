# 🚀 Opclaw — 全能数字资产与AI分身助手：小程序迁移技术方案 (plan1.md)

本方案旨在将现有的 **React 19 + TypeScript + Vite 7** Web 项目（Opclaw）平滑迁移至小程序平台（以微信小程序为主，兼顾多端）。基于项目高度依赖现代前端特性的现状，我们选择 **Taro 4.x** 作为核心开发框架。

---

## 1. 技术架构分析：Web vs. 小程序

### 1.1 核心技术栈兼容性评估

| 技术/库 | 当前版本 | 小程序适配建议 | 兼容性级别 |
| :--- | :--- | :--- | :---: |
| **React** | 19.2.0 | **Taro 4.x** 完美支持 React 18+ 语法及 Hooks。 | 🟢 高 |
| **TypeScript** | 5.9.3 | 完全支持，可复用现有类型定义。 | 🟢 高 |
| **Tailwind CSS** | 4.1.18 | **v4 版** 需配合 `taro-plugin-tailwind` 并适配小程序单位（rpx）。 | 🟡 中 |
| **Supabase** | 2.46.1 | 支持，但需配置 `fetch` 适配器（`Taro.request`）。 | 🟢 高 |
| **Three.js** | 0.183.1 | 需使用 `three-platformize` 或微信官方适配库，Canvas 上下文不同。 | 🔴 难 |
| **Framer Motion** | 12.34.1 | **不支持**。需替换为 Taro 动画 API 或 CSS 帧动画。 | 🔴 冲突 |
| **React Router** | 7.13.0 | **不支持**。需替换为 Taro 声明式导航与小程序路由系统。 | 🔴 冲突 |
| **Lucide React** | 0.574.0 | 建议转换为 SVG 组件或使用 IconFont，直接引用 React 组件在小程序中性能较差。 | 🟡 中 |

### 1.2 环境差异识别
*   **DOM/BOM 缺失**：无法直接使用 `window`, `document`, `localStorage`。需替换为 `Taro.getSystemInfo`, `Taro.setStorage` 等。
*   **通信限制**：小程序请求需配置合法域名白名单，不支持直接跨域。
*   **包体积**：小程序主包限制 2MB，需严格控制依赖和资源分包。

---

## 2. 小程序框架选择建议

### 推荐框架：**Taro 4.x (React 技术栈)**

**理由：**
1.  **原生 React 体验**：对 React 19 的 Hooks 和并发特性支持度最高，代码迁移成本最低。
2.  **Vite 7 驱动**：Taro 4 支持使用 Vite 编译，与原项目构建工具链契合，HMR 体验接近 Web。
3.  **多端编译**：一份代码可编译至微信、支付宝、抖音及 H5。
4.  **生态成熟**：针对 Tailwind CSS、ECharts 等常用库均有成熟的小程序适配方案。

---

## 3. 项目重构步骤

### 3.1 项目结构组织 (Taro 架构)
```text
Opclaw-Mini/
├── config/                # Taro 构建配置 (Vite 模式)
├── src/
│   ├── pages/             # 页面组件 (对应原 pages/)
│   ├── components/        # 公共组件 (需要 WXML/JSX 转换)
│   ├── components/ui/     # 基础 UI (适配 View, Text 标签)
│   ├── lib/               # 核心逻辑 (Supabase, RAG 引擎等)
│   ├── hooks/             # 自定义 Hooks (大部分可复用)
│   ├── app.tsx            # 入口文件
│   ├── app.config.ts      # 全局路由与权限配置
│   └── index.css          # Tailwind 样式入口
├── tailwind.config.js     # 适配小程序的 Tailwind 配置
└── project.config.json    # 微信开发者工具配置
```

### 3.2 组件转换方法
*   **标签替换**：
    *   `div`, `section`, `header` → `View`
    *   `span`, `p` → `Text`
    *   `img` → `Image` (注意需显式指定宽高或 `mode`)
    *   `button` → `Button`
*   **属性适配**：
    *   `onClick` → `onTap`
    *   `onMouseEnter/Leave` → 移除 (小程序无鼠标悬浮)
*   **生命周期**：
    *   `useEffect` 仍然可用。
    *   页面特有逻辑 (如分享、下拉刷新) 使用 `useShareAppMessage`, `usePullDownRefresh`。

### 3.3 CSS 样式适配方案 (Tailwind v4)
1.  **单位转换**：配置 `postcss-pxtransform` 将 `px` 自动转换为 `rpx`。
2.  **Tailwind 适配**：使用 `taro-plugin-tailwind` 插件。
3.  **选择器优化**：小程序不支持通配符 `*`。Tailwind v4 的基础 reset 需手动调整，避免生成小程序不支持的选择器。
4.  **深色模式**：利用 Taro 的全局配置和 CSS 变量实现主题切换，替代原本的 `ThemeContext` 动态类名方案。

### 3.4 动画效果替代方案
*   **Framer Motion** → **Taro.createAnimation**：对于交互式位移、缩放，使用原生动画 API。
*   **简单微交互** → **CSS Transitions / Keyframes**：小程序对 CSS 动画支持良好。
*   **复杂布局动画** → 考虑使用 `Animate` 组件库或简化动画逻辑，确保低端机流畅度。

### 3.5 3D 渲染 (Three.js) 处理方案
1.  **渲染容器**：使用 `<Canvas type="webgl" />`。
2.  **适配库**：引入 `three-platformize`。它重写了 Three.js 的浏览器依赖（如 `Image`, `RequestAnimationFrame`）。
3.  **模型优化**：小程序端显存有限，GLB 模型面数需控制在 10w 以内，贴图限制在 1024px。

### 3.6 路由与状态管理
*   **路由**：从 `react-router-dom` 切换至 `app.config.ts` 定义的声明式路由。跳转使用 `Taro.navigateTo`。
*   **状态管理**：保留现有 `Context` 或 `Zustand` 方案。小程序生命周期内全局变量持久，逻辑层复用度极高。

---

## 4. API 适配方案

### 4.1 Supabase 集成
*   **适配器配置**：
    ```typescript
    import { createClient } from '@supabase/supabase-js'
    import Taro from '@tarojs/taro'

    const supabase = createClient(URL, KEY, {
      auth: {
        storage: {
          getItem: (key) => Taro.getStorageSync(key),
          setItem: (key, value) => Taro.setStorageSync(key, value),
          removeItem: (key) => Taro.removeStorageSync(key),
        },
      },
      global: {
        fetch: (url, options) => {
          // 自定义适配器，将 fetch 转换为 Taro.request
          return new Promise((resolve, reject) => {
            Taro.request({
              url: url as string,
              method: options?.method as any,
              data: options?.body,
              header: options?.headers as any,
              success: (res) => resolve({
                json: () => Promise.resolve(res.data),
                status: res.statusCode,
                ok: res.statusCode >= 200 && res.statusCode < 300,
              } as any),
              fail: reject
            })
          })
        }
      }
    })
    ```

### 4.2 文件处理
*   **上传**：使用 `Taro.chooseImage` 获取本地路径，通过 `supabase.storage.upload` (需适配 binary 处理) 或 `Taro.uploadFile` 直接上传。
*   **下载**：使用 `Taro.downloadFile` 保存到本地缓存。

---

## 5. 项目配置详细步骤

### 5.1 环境搭建
1.  安装 Taro CLI: `npm install -g @tarojs/cli`
2.  创建项目: `taro init opclaw-mini` (选择 React, TypeScript, Vite)

### 5.2 依赖包调整
*   **移除**：`react-dom`, `react-router-dom`, `framer-motion`, `html2canvas` (替换为 `wxml2canvas`)。
*   **新增**：`@tarojs/components`, `@tarojs/taro`, `taro-plugin-tailwind`, `three-platformize`。

### 5.3 构建配置 (`config/index.ts`)
*   开启 `pxtransform`。
*   配置 `terser` 进行代码压缩。
*   开启 `subPackages` (分包)，将 3D 模型、复杂图表等放入分包。

---

## 6. 部署上线流程

1.  **注册认证**：在微信公众平台注册，完成实名认证。
2.  **域名报备**：在后台配置 `https://xxx.supabase.co` 为合法 Request 域名。
3.  **代码审核**：
    *   注意 AI 内容安全，需接入微信内容安全 API。
    *   检查隐私政策，特别是涉及地理位置或头像上传时。
4.  **发布**：开发者工具上传代码 → 提交审核 → 全量发布。

---

## 7. 风险评估与解决方案

| 风险点 | 影响 | 解决方案 |
| :--- | :--- | :--- |
| **3D 性能** | 导致卡顿或崩溃 | 采用分包预加载模型，低端机降级为 2D 图片。 |
| **包体积超标** | 无法发布 | 资源全部上 CDN，使用分包加载，精简 Lucide 图标。 |
| **RAG 引擎算力** | 本地搜索过慢 | 将关键词匹配逻辑移至 Supabase Edge Functions。 |
| **动画断层** | 体验下降 | 使用 CSS 变量实现全局顺滑过渡，保留核心 UI 动效。 |

---

> [!TIP]
> **迁移建议**：建议先进行核心数据链路 (Auth + Supabase) 的迁移，确保业务逻辑走通，再分批次重构 UI 组件。3D 角色功能可作为“分包插件”独立开发。
