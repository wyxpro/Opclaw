import { useState, useEffect } from 'react'
import PageTransition from '../components/ui/PageTransition'
import { useAuth } from '../contexts/AuthContext'
import { ProfileTabContent } from '../components/profile/ProfileTabContent'
import AuthModal from '../components/auth/AuthModal'

export default function Profile() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const { isAuthenticated, isLoading } = useAuth()

  // 未登录时自动显示登录弹窗
  useEffect(() => {
    if (isLoading) return
    if (!isAuthenticated && !showAuthModal) {
      const timer = setTimeout(() => {
        setShowAuthModal(true)
      }, 100)
      return () => clearTimeout(timer)
    }
    if (isAuthenticated && showAuthModal) {
      setShowAuthModal(false)
    }
  }, [isLoading, isAuthenticated, showAuthModal])

  return (
    <PageTransition>
      <div className="w-full px-6 pb-6 sm:pb-8 pt-0">
        {/* 个人主页内容 */}
        <ProfileTabContent />
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultMode="login"
      />
    </PageTransition>
  )
}
