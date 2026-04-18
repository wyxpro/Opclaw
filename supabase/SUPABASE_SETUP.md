opcshow 对接说明

一、环境变量
- 在 Supabase 控制台获取 opcshow 项目的 Project URL 与 anon key
- 将值分别填入以下文件：
  - .env：本地开发
  - .env.preview：预览环境
  - .env.production：生产环境
- 变量名：
  - VITE_SUPABASE_URL=
  - VITE_SUPABASE_ANON_KEY=

二、安装依赖
- npm i

三、数据库迁移
- 在 Supabase SQL Editor 依次执行：
  - supabase/migrations/0001_init.sql
- 如需回滚：
  - supabase/migrations/0001_down.sql

四、RLS 策略
- profiles/posts/comments 已开启 RLS 并配置策略：
  - posts/comments：任何登录用户可读，作者可写
  - profiles：任意可读，仅本人可改

五、Storage
- 已在迁移脚本中创建：
  - public-assets（公开读）
  - protected-assets（需签名 URL 或本人访问）

六、前端集成
- 单例客户端：src/lib/supabase.ts，使用 getSupabaseClient()
- 认证上下文：src/contexts/AuthContext.tsx
- 社区数据：src/components/community/useCommunity.ts
- 存储上传：src/lib/storage.ts（uploadPublicFile）
- 边缘函数示例：supabase/functions/echo/index.ts

七、运行验证
- npm run dev
- 登录/注册、发帖/评论、图片上传、实时新增验证

八、CI/CD
- 确保在部署平台注入 VITE_SUPABASE_URL 与 VITE_SUPABASE_ANON_KEY
- 不提交任何真实密钥到仓库
