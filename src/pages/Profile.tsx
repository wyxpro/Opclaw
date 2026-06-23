import PageTransition from '../components/ui/PageTransition'
import { ProfileTabContent } from '../components/profile/ProfileTabContent'

export default function Profile() {
  return (
    <PageTransition>
      <div className="w-full px-6 pb-6 sm:pb-8 pt-0">
        {/* 个人主页内容 */}
        <ProfileTabContent />
      </div>
    </PageTransition>
  )
}
