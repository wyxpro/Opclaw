import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import PageTransition from '../components/ui/PageTransition'

// ===== Main Component =====
export default function Home() {
  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-text mb-4">
            欢迎访问 SuperUI
          </h1>
          <p className="text-text-muted mb-8 max-w-md mx-auto">
            官网页面已迁移至独立页面，点击下方按钮访问官网宣传页面
          </p>
          <motion.a
            href="/index.html"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all"
          >
            <ArrowLeft size={18} />
            前往官网
          </motion.a>
        </motion.div>
      </div>
    </PageTransition>
  )
}
