import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

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
    define: {
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(env.VITE_SUPABASE_URL || ''),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(env.VITE_SUPABASE_ANON_KEY || ''),
      'import.meta.env.VITE_SILICONFLOW_API_KEY': JSON.stringify(env.VITE_SILICONFLOW_API_KEY || ''),
      'import.meta.env.VITE_DEEPSEEK_PROXY_KEY': JSON.stringify(env.VITE_DEEPSEEK_PROXY_KEY || ''),
      'import.meta.env.VITE_DEEPSEEK_PROXY_URL': JSON.stringify(env.VITE_DEEPSEEK_PROXY_URL || ''),
      __SB_URL__: JSON.stringify(env.VITE_SUPABASE_URL || ''),
      __SB_ANON__: JSON.stringify(env.VITE_SUPABASE_ANON_KEY || ''),
    },
    server: {
      port: 5177,
      proxy: {
        '/api/innoreation/v1/proxy': {
          target: 'https://mangdream.com',
          changeOrigin: true,
          secure: false,
        },
        '/api/stepfun': {
          target: 'https://api.stepfun.com',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api\/stepfun/, '')
        }
      }
    },
    build: {
      rollupOptions: {
        input: {
          main: './index.html',
          app: './app.html',
        },
      },
    },
  }
})
