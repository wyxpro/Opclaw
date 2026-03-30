import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), tailwindcss()],
    define: {
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(env.VITE_SUPABASE_URL || ''),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(env.VITE_SUPABASE_ANON_KEY || ''),
      __SB_URL__: JSON.stringify(env.VITE_SUPABASE_URL || ''),
      __SB_ANON__: JSON.stringify(env.VITE_SUPABASE_ANON_KEY || ''),
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
