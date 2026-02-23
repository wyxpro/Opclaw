import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Upload, ImageIcon, Trash2, User, Check, UserCircle, FileText, Phone, Mail, Calendar } from 'lucide-react'
import { presetAvatars, presetBackgrounds } from '../data/mock'

export interface ProfileData {
  avatar: string
  background: string | null
  name: string
  gender: 'male' | 'female' | 'secret'
  age: number | ''
  bio: string
  phone: string
  email: string
}

interface ProfileEditModalProps {
  isOpen: boolean
  onClose: () => void
  initialData: ProfileData
  onSave: (data: ProfileData) => void
}

export default function ProfileEditModal({ isOpen, onClose, initialData, onSave }: ProfileEditModalProps) {
  const [profileData, setProfileData] = useState<ProfileData>(initialData)
  const [activeTab, setActiveTab] = useState<'info' | 'avatar' | 'background'>('info')
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof ProfileData, string>>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadType, setUploadType] = useState<'avatar' | 'background'>('avatar')

  // 处理文件上传
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setUploadError('请上传图片文件')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('图片大小不能超过 5MB')
      return
    }

    setUploadError(null)
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      if (uploadType === 'avatar') {
        setProfileData(prev => ({ ...prev, avatar: result }))
      } else {
        setProfileData(prev => ({ ...prev, background: result }))
      }
    }
    reader.readAsDataURL(file)
    event.target.value = ''
  }, [uploadType])

  // 选择预设头像
  const handleSelectAvatar = (url: string) => {
    setProfileData(prev => ({ ...prev, avatar: url }))
  }

  // 选择预设背景
  const handleSelectBackground = (url: string) => {
    setProfileData(prev => ({ ...prev, background: url }))
  }

  // 删除背景图
  const handleRemoveBackground = () => {
    setProfileData(prev => ({ ...prev, background: null }))
  }

  // 表单验证
  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof ProfileData, string>> = {}

    if (!profileData.name.trim()) {
      errors.name = '请输入昵称'
    } else if (profileData.name.length > 20) {
      errors.name = '昵称不能超过20个字符'
    }

    if (profileData.age !== '' && (profileData.age < 1 || profileData.age > 150)) {
      errors.age = '请输入有效的年龄'
    }

    if (profileData.bio && profileData.bio.length > 200) {
      errors.bio = '个人简介不能超过200个字符'
    }

    if (profileData.phone && !/^1[3-9]\d{9}$/.test(profileData.phone)) {
      errors.phone = '请输入有效的手机号'
    }

    if (profileData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) {
      errors.email = '请输入有效的邮箱地址'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // 保存修改
  const handleSave = () => {
    if (!validateForm()) return
    onSave(profileData)
    onClose()
  }

  // 触发文件选择
  const triggerFileInput = (type: 'avatar' | 'background') => {
    setUploadType(type)
    setTimeout(() => {
      fileInputRef.current?.click()
    }, 0)
  }

  // 更新字段
  const updateField = <K extends keyof ProfileData>(field: K, value: ProfileData[K]) => {
    setProfileData(prev => ({ ...prev, [field]: value }))
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200]"
          />

          {/* Modal - 移动端高度自适应内容，桌面端固定高度 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 -translate-x-1/2 top-[5vh] md:top-1/2 md:-translate-y-1/2 w-[calc(100vw-48px)] sm:w-[calc(100vw-64px)] md:w-[480px] max-w-[480px] max-h-[90vh] md:max-h-[80vh] bg-surface rounded-xl z-[201] overflow-hidden shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface">
              <h2 className="text-base font-semibold text-text">编辑个人信息</h2>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-surface-alt transition-colors"
              >
                <X size={18} className="text-text-muted" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 px-3 py-2 border-b border-border bg-surface-alt/30">
              {[
                { id: 'info', label: '基本信息', icon: UserCircle },
                { id: 'avatar', label: '头像', icon: User },
                { id: 'background', label: '背景', icon: ImageIcon },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-primary/10 text-primary'
                      : 'text-text-muted hover:text-text hover:bg-surface-alt'
                  }`}
                >
                  <tab.icon size={14} />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content - 移动端高度自适应内容，桌面端可滚动 */}
            <div className="overflow-y-auto p-4" style={{ maxHeight: 'calc(90vh - 120px)' }}>
              {/* Info Tab */}
              {activeTab === 'info' && (
                <div className="space-y-4">
                  {/* 昵称 */}
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-medium text-text mb-1.5">
                      <UserCircle size={14} className="text-text-muted" />
                      昵称
                    </label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => updateField('name', e.target.value)}
                      placeholder="请输入昵称"
                      className={`w-full px-3 py-2 text-sm rounded-lg border bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
                        formErrors.name ? 'border-rose' : 'border-border hover:border-primary/50'
                      }`}
                    />
                    {formErrors.name && <p className="mt-1 text-xs text-rose">{formErrors.name}</p>}
                  </div>

                  {/* 性别和年龄 */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="flex items-center gap-1.5 text-xs font-medium text-text mb-1.5">
                        <User size={14} className="text-text-muted" />
                        性别
                      </label>
                      <div className="flex gap-2">
                        {[
                          { value: 'male', label: '男' },
                          { value: 'female', label: '女' },
                          { value: 'secret', label: '保密' },
                        ].map((option) => (
                          <button
                            key={option.value}
                            onClick={() => updateField('gender', option.value as ProfileData['gender'])}
                            className={`flex-1 py-2 text-xs font-medium rounded-lg border transition-all ${
                              profileData.gender === option.value
                                ? 'bg-primary/10 border-primary text-primary'
                                : 'border-border text-text-muted hover:border-primary/50'
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="flex items-center gap-1.5 text-xs font-medium text-text mb-1.5">
                        <Calendar size={14} className="text-text-muted" />
                        年龄
                      </label>
                      <input
                        type="number"
                        value={profileData.age}
                        onChange={(e) => updateField('age', e.target.value === '' ? '' : parseInt(e.target.value) || '')}
                        placeholder="年龄"
                        min={1}
                        max={150}
                        className={`w-full px-3 py-2 text-sm rounded-lg border bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
                          formErrors.age ? 'border-rose' : 'border-border hover:border-primary/50'
                        }`}
                      />
                      {formErrors.age && <p className="mt-1 text-xs text-rose">{formErrors.age}</p>}
                    </div>
                  </div>

                  {/* 个人简介 */}
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-medium text-text mb-1.5">
                      <FileText size={14} className="text-text-muted" />
                      个人简介
                    </label>
                    <textarea
                      value={profileData.bio}
                      onChange={(e) => updateField('bio', e.target.value)}
                      placeholder="介绍一下自己..."
                      rows={3}
                      className={`w-full px-3 py-2 text-sm rounded-lg border bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none ${
                        formErrors.bio ? 'border-rose' : 'border-border hover:border-primary/50'
                      }`}
                    />
                    <div className="flex justify-between mt-1">
                      {formErrors.bio && <p className="text-xs text-rose">{formErrors.bio}</p>}
                      <p className="text-xs text-text-muted ml-auto">{profileData.bio?.length || 0}/200</p>
                    </div>
                  </div>

                  {/* 联系方式 */}
                  <div className="pt-2 border-t border-border">
                    <p className="text-xs font-medium text-text-muted mb-3">联系方式</p>
                    <div className="space-y-3">
                      <div>
                        <label className="flex items-center gap-1.5 text-xs font-medium text-text mb-1.5">
                          <Phone size={14} className="text-text-muted" />
                          手机号
                        </label>
                        <input
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) => updateField('phone', e.target.value)}
                          placeholder="请输入手机号"
                          className={`w-full px-3 py-2 text-sm rounded-lg border bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
                            formErrors.phone ? 'border-rose' : 'border-border hover:border-primary/50'
                          }`}
                        />
                        {formErrors.phone && <p className="mt-1 text-xs text-rose">{formErrors.phone}</p>}
                      </div>
                      <div>
                        <label className="flex items-center gap-1.5 text-xs font-medium text-text mb-1.5">
                          <Mail size={14} className="text-text-muted" />
                          邮箱
                        </label>
                        <input
                          type="email"
                          value={profileData.email}
                          onChange={(e) => updateField('email', e.target.value)}
                          placeholder="请输入邮箱"
                          className={`w-full px-3 py-2 text-sm rounded-lg border bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
                            formErrors.email ? 'border-rose' : 'border-border hover:border-primary/50'
                          }`}
                        />
                        {formErrors.email && <p className="mt-1 text-xs text-rose">{formErrors.email}</p>}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Avatar Tab */}
              {activeTab === 'avatar' && (
                <div className="space-y-4">
                  <div className="flex flex-col items-center gap-3">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full overflow-hidden border-3 border-primary/20">
                        <img
                          src={profileData.avatar}
                          alt="Current avatar"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        onClick={() => triggerFileInput('avatar')}
                        className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-primary text-white shadow-lg hover:bg-primary-dim transition-colors"
                      >
                        <Upload size={14} />
                      </button>
                    </div>
                    <p className="text-xs text-text-muted">点击上传本地图片</p>
                  </div>

                  {uploadError && (
                    <div className="p-2 rounded-lg bg-rose/10 text-rose text-xs text-center">
                      {uploadError}
                    </div>
                  )}

                  <div>
                    <h3 className="text-xs font-medium text-text mb-2">预设头像</h3>
                    <div className="grid grid-cols-5 gap-2">
                      {presetAvatars.map((avatar) => (
                        <button
                          key={avatar.id}
                          onClick={() => handleSelectAvatar(avatar.url)}
                          className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                            profileData.avatar === avatar.url
                              ? 'border-primary ring-2 ring-primary/20'
                              : 'border-transparent hover:border-primary/50'
                          }`}
                        >
                          <img
                            src={avatar.url}
                            alt={avatar.name}
                            className="w-full h-full object-cover"
                          />
                          {profileData.avatar === avatar.url && (
                            <div className="absolute inset-0 flex items-center justify-center bg-primary/20">
                              <Check size={16} className="text-primary" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Background Tab */}
              {activeTab === 'background' && (
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="relative h-24 rounded-lg overflow-hidden">
                      {profileData.background ? (
                        <img
                          src={profileData.background}
                          alt="Current background"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary to-primary-dim flex items-center justify-center">
                          <span className="text-white/60 text-xs">默认背景</span>
                        </div>
                      )}
                      <button
                        onClick={() => triggerFileInput('background')}
                        className="absolute bottom-2 right-2 p-1.5 rounded-full bg-white/90 text-text shadow-lg hover:bg-white transition-colors"
                      >
                        <Upload size={14} />
                      </button>
                    </div>
                    
                    {profileData.background && (
                      <button
                        onClick={handleRemoveBackground}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-rose hover:bg-rose/10 transition-colors text-xs"
                      >
                        <Trash2 size={14} />
                        删除背景图
                      </button>
                    )}
                  </div>

                  {uploadError && (
                    <div className="p-2 rounded-lg bg-rose/10 text-rose text-xs text-center">
                      {uploadError}
                    </div>
                  )}

                  <div>
                    <h3 className="text-xs font-medium text-text mb-2">预设背景</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {presetBackgrounds.map((bg) => (
                        <button
                          key={bg.id}
                          onClick={() => handleSelectBackground(bg.url)}
                          className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                            profileData.background === bg.url
                              ? 'border-primary ring-2 ring-primary/20'
                              : 'border-transparent hover:border-primary/50'
                          }`}
                        >
                          <img
                            src={bg.url}
                            alt={bg.name}
                            className="w-full h-full object-cover"
                          />
                          {profileData.background === bg.url && (
                            <div className="absolute inset-0 flex items-center justify-center bg-primary/20">
                              <Check size={18} className="text-white" />
                            </div>
                          )}
                          <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/50 text-white text-[10px]">
                            {bg.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-border bg-surface-alt/50">
              <button
                onClick={onClose}
                className="px-4 py-1.5 rounded-lg text-xs font-medium text-text-secondary hover:text-text hover:bg-surface transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-1.5 rounded-lg text-xs font-medium bg-primary text-white hover:bg-primary-dim transition-colors"
              >
                保存修改
              </button>
            </div>

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileUpload}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
