import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, Mail, Lock, User, Eye, EyeOff,
  ArrowRight, ShieldCheck, Loader2, Zap
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../hooks/useTheme'
import type { AuthFormErrors, PasswordStrength } from '../../types/auth'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  defaultMode?: 'login' | 'register'
}

// 密码强度检测
function checkPasswordStrength(password: string): PasswordStrength {
  if (password.length < 6) return 'weak'
  
  let score = 0
  if (password.length >= 8) score++
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++
  if (/\d/.test(password)) score++
  if (/[^a-zA-Z0-9]/.test(password)) score++
  
  if (score <= 1) return 'weak'
  if (score === 2) return 'medium'
  if (score === 3) return 'strong'
  return 'very-strong'
}

// 获取密码强度颜色和文本
function getPasswordStrengthInfo(strength: PasswordStrength): { color: string; text: string; width: string } {
  switch (strength) {
    case 'weak':
      return { color: '#f43f5e', text: '弱', width: '25%' }
    case 'medium':
      return { color: '#f59e0b', text: '中等', width: '50%' }
    case 'strong':
      return { color: '#10b981', text: '强', width: '75%' }
    case 'very-strong':
      return { color: '#8b5cf6', text: '非常强', width: '100%' }
  }
}

export default function AuthModal({ isOpen, onClose, defaultMode = 'login' }: AuthModalProps) {
  const navigate = useNavigate()
  const [mode, setMode] = useState<'login' | 'register'>(defaultMode)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<AuthFormErrors>({})
  
  // 表单数据
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    emailOrPhone: '',
    password: '',
    confirmPassword: '',
    rememberMe: false,
    agreeTerms: false,
  })
  
  const { login, register, guestLogin } = useAuth()
  const { themeConfig } = useTheme()
  
  // 密码强度
  const passwordStrength = checkPasswordStrength(formData.password)
  const strengthInfo = getPasswordStrengthInfo(passwordStrength)
  
  // 更新表单字段
  const updateField = useCallback((field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // 清除对应字段的错误
    if (errors[field as keyof AuthFormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }, [errors])
  
  // 验证邮箱格式
  const isValidEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }
  
  // 验证手机号格式
  const isValidPhone = (phone: string): boolean => {
    return /^1[3-9]\d{9}$/.test(phone)
  }
  
  // 验证登录表单
  const validateLoginForm = (): boolean => {
    const newErrors: AuthFormErrors = {}
    
    if (!formData.emailOrPhone.trim()) {
      newErrors.emailOrPhone = '请输入用户名或邮箱'
    }
    
    if (!formData.password) {
      newErrors.password = '请输入密码'
    } else if (formData.password.length < 6) {
      newErrors.password = '密码长度不能少于6位'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  // 验证注册表单
  const validateRegisterForm = (): boolean => {
    const newErrors: AuthFormErrors = {}
    
    if (!formData.username.trim()) {
      newErrors.username = '请输入用户名'
    } else if (formData.username.length < 2 || formData.username.length > 20) {
      newErrors.username = '用户名长度应在2-20个字符之间'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = '请输入邮箱'
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = '请输入有效的邮箱地址'
    }
    
    if (formData.phone && !isValidPhone(formData.phone)) {
      newErrors.phone = '请输入有效的手机号'
    }
    
    if (!formData.password) {
      newErrors.password = '请输入密码'
    } else if (formData.password.length < 6) {
      newErrors.password = '密码长度不能少于6位'
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '两次输入的密码不一致'
    }
    
    if (!formData.agreeTerms) {
      newErrors.general = '请同意服务条款和隐私政策'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  // 处理登录
  const handleLogin = async () => {
    if (!validateLoginForm()) return
    
    setIsLoading(true)
    try {
      const success = await login({
        emailOrPhone: formData.emailOrPhone,
        password: formData.password,
        rememberMe: formData.rememberMe,
      })
      
      if (success) {
        // Toast 提示已在 AuthContext 中显示
        onClose()
        navigate('/social')
        // 重置表单
        setFormData({
          username: '',
          email: '',
          phone: '',
          emailOrPhone: '',
          password: '',
          confirmPassword: '',
          rememberMe: false,
          agreeTerms: false,
        })
      } else {
        setErrors({ general: '用户名/邮箱或密码错误' })
      }
    } finally {
      setIsLoading(false)
    }
  }
  
  // 处理注册
  const handleRegister = async () => {
    if (!validateRegisterForm()) return
    
    setIsLoading(true)
    try {
      const success = await register({
        username: formData.username,
        email: formData.email,
        phone: formData.phone || undefined,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      })
      
      if (success) {
        // Toast 提示已在 AuthContext 中显示
        onClose()
        navigate('/social')
        // 重置表单
        setFormData({
          username: '',
          email: '',
          phone: '',
          emailOrPhone: '',
          password: '',
          confirmPassword: '',
          rememberMe: false,
          agreeTerms: false,
        })
      } else {
        setErrors({ general: '注册失败，邮箱或手机号可能已被注册' })
      }
    } finally {
      setIsLoading(false)
    }
  }
  
  // 处理游客一键登录
  const handleGuestLogin = async () => {
    setIsLoading(true)
    try {
      const success = await guestLogin()
      if (success) {
        onClose()
        // 重置表单
        setFormData({
          username: '',
          email: '',
          phone: '',
          emailOrPhone: '',
          password: '',
          confirmPassword: '',
          rememberMe: false,
          agreeTerms: false,
        })
      }
    } finally {
      setIsLoading(false)
    }
  }
  
  // 切换模式时重置错误
  const switchMode = (newMode: 'login' | 'register') => {
    setMode(newMode)
    setErrors({})
    setFormData({
      username: '',
      email: '',
      phone: '',
      emailOrPhone: '',
      password: '',
      confirmPassword: '',
      rememberMe: false,
      agreeTerms: false,
    })
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]"
          />
          
          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[201] flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl pointer-events-auto"
              style={{
                background: themeConfig.glassEffect.background,
                border: themeConfig.glassEffect.border,
                backdropFilter: themeConfig.glassEffect.backdropBlur,
                WebkitBackdropFilter: themeConfig.glassEffect.backdropBlur,
                boxShadow: themeConfig.shadows.float,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="relative p-4 sm:p-6 pb-0">
                <button
                  onClick={onClose}
                  className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 rounded-full transition-colors hover:opacity-70"
                  style={{ color: themeConfig.colors.textMuted }}
                >
                  <X size={20} />
                </button>
                
                <div className="text-center mb-4 sm:mb-6">
                  {/* 动态图标 - 注册显示盾牌，登录显示星星 */}
                  <motion.div
                    key={mode}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl mx-auto mb-3 sm:mb-4 flex items-center justify-center shadow-lg"
                    style={{
                      background: mode === 'register'
                        ? 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 50%, #8b5cf6 100%)'
                        : 'linear-gradient(135deg, #10b981 0%, #14b8a6 50%, #06b6d4 100%)',
                      boxShadow: mode === 'register'
                        ? '0 10px 40px -10px rgba(6, 182, 212, 0.5)'
                        : '0 10px 40px -10px rgba(16, 185, 129, 0.5)',
                    }}
                  >
                    {mode === 'register' ? (
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white sm:w-9 sm:h-9">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        <path d="m9 12 2 2 4-4" />
                      </svg>
                    ) : (
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white sm:w-9 sm:h-9">
                        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                        <path d="M12 8v4" />
                        <path d="M12 16h.01" />
                      </svg>
                    )}
                  </motion.div>
                  <h2
                    className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2"
                    style={{ color: themeConfig.colors.text }}
                  >
                    {mode === 'login' ? '欢迎回来' : '创建账号'}
                  </h2>
                  <p className="text-sm sm:text-base" style={{ color: themeConfig.colors.textMuted }}>
                    {mode === 'login'
                      ? '登录您的 Opclaw 账号'
                      : '加入 Opclaw，开启您的数字之旅'}
                  </p>
                </div>
                
                {/* Mode Switcher - 彩色标签 */}
                <div
                  className="flex p-1 sm:p-1.5 rounded-2xl mb-4 sm:mb-6"
                  style={{ 
                    background: themeConfig.colors.surface,
                    border: `1px solid ${themeConfig.colors.border}`,
                  }}
                >
                  <button
                    onClick={() => switchMode('login')}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                      mode === 'login'
                        ? 'shadow-md'
                        : 'hover:opacity-70'
                    }`}
                    style={{
                      background: mode === 'login' 
                        ? 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)' 
                        : 'transparent',
                      color: mode === 'login' ? '#fff' : themeConfig.colors.textMuted,
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                      <polyline points="10 17 15 12 10 7" />
                      <line x1="15" x2="3" y1="12" y2="12" />
                    </svg>
                    登录
                  </button>
                  <button
                    onClick={() => switchMode('register')}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                      mode === 'register'
                        ? 'shadow-md'
                        : 'hover:opacity-70'
                    }`}
                    style={{
                      background: mode === 'register' 
                        ? 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)' 
                        : 'transparent',
                      color: mode === 'register' ? '#fff' : themeConfig.colors.textMuted,
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="8.5" cy="7" r="4" />
                      <line x1="20" x2="20" y1="8" y2="14" />
                      <line x1="23" x2="17" y1="11" y2="11" />
                    </svg>
                    注册
                  </button>
                </div>
              </div>
              
              {/* Form Content */}
              <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                {/* General Error */}
                {errors.general && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 p-3 rounded-lg text-sm flex items-center gap-2"
                    style={{
                      background: `${themeConfig.colors.rose}15`,
                      color: themeConfig.colors.rose,
                    }}
                  >
                    <ShieldCheck size={16} />
                    {errors.general}
                  </motion.div>
                )}
                
                {mode === 'login' ? (
                  // 登录表单
                  <div className="space-y-4">
                    {/* 用户名/邮箱输入 */}
                    <div>
                      <label
                        className="block text-sm font-medium mb-1.5"
                        style={{ color: themeConfig.colors.textSecondary }}
                      >
                        用户名或邮箱
                      </label>
                      <div className="relative">
                        <User
                          size={18}
                          className="absolute left-3 top-1/2 -translate-y-1/2"
                          style={{ color: themeConfig.colors.textMuted }}
                        />
                        <input
                          type="text"
                          value={formData.emailOrPhone}
                          onChange={(e) => updateField('emailOrPhone', e.target.value)}
                          placeholder="请输入用户名或邮箱"
                          className="w-full pl-10 pr-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2"
                          style={{
                            background: themeConfig.colors.surface,
                            borderColor: errors.emailOrPhone
                              ? themeConfig.colors.rose
                              : themeConfig.colors.border,
                            color: themeConfig.colors.text,
                          }}
                          onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                        />
                      </div>
                      {errors.emailOrPhone && (
                        <p className="mt-1 text-xs" style={{ color: themeConfig.colors.rose }}>
                          {errors.emailOrPhone}
                        </p>
                      )}
                    </div>
                    
                    {/* 密码输入 */}
                    <div>
                      <label
                        className="block text-sm font-medium mb-1.5"
                        style={{ color: themeConfig.colors.textSecondary }}
                      >
                        密码
                      </label>
                      <div className="relative">
                        <Lock
                          size={18}
                          className="absolute left-3 top-1/2 -translate-y-1/2"
                          style={{ color: themeConfig.colors.textMuted }}
                        />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={formData.password}
                          onChange={(e) => updateField('password', e.target.value)}
                          placeholder="请输入密码"
                          className="w-full pl-10 pr-12 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2"
                          style={{
                            background: themeConfig.colors.surface,
                            borderColor: errors.password
                              ? themeConfig.colors.rose
                              : themeConfig.colors.border,
                            color: themeConfig.colors.text,
                          }}
                          onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded transition-colors hover:opacity-70"
                          style={{ color: themeConfig.colors.textMuted }}
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="mt-1 text-xs" style={{ color: themeConfig.colors.rose }}>
                          {errors.password}
                        </p>
                      )}
                    </div>
                    
                    {/* 记住我和忘记密码 */}
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.rememberMe}
                          onChange={(e) => updateField('rememberMe', e.target.checked)}
                          className="w-4 h-4 rounded border cursor-pointer"
                          style={{
                            accentColor: themeConfig.colors.primary,
                          }}
                        />
                        <span
                          className="text-sm"
                          style={{ color: themeConfig.colors.textMuted }}
                        >
                          记住我
                        </span>
                      </label>
                      <button
                        type="button"
                        className="text-sm font-semibold hover:underline transition-colors"
                        style={{ color: '#10b981' }}
                        onClick={() => alert('请联系管理员重置密码')}
                      >
                        忘记密码？
                      </button>
                    </div>
                    
                    {/* 登录按钮 - 绿青渐变 */}
                    <button
                      onClick={handleLogin}
                      disabled={isLoading}
                      className="w-full py-3.5 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
                      style={{
                        background: 'linear-gradient(135deg, #10b981 0%, #14b8a6 50%, #06b6d4 100%)',
                        boxShadow: '0 4px 20px -5px rgba(16, 185, 129, 0.4)',
                      }}
                    >
                      {isLoading ? (
                        <Loader2 size={20} className="animate-spin" />
                      ) : (
                        <>
                          登录
                          <ArrowRight size={18} />
                        </>
                      )}
                    </button>
                    
                    {/* 游客一键登录按钮 */}
                    <button
                      onClick={handleGuestLogin}
                      disabled={isLoading}
                      className="w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
                      style={{
                        background: themeConfig.colors.surface,
                        border: `1px solid ${themeConfig.colors.border}`,
                        color: themeConfig.colors.textSecondary,
                      }}
                    >
                      {isLoading ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <>
                          <Zap size={18} style={{ color: '#f59e0b' }} />
                          <span>游客一键登录</span>
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  // 注册表单
                  <div className="space-y-3 sm:space-y-4">
                    {/* 用户名 */}
                    <div>
                      <label
                        className="block text-xs sm:text-sm font-medium mb-1 sm:mb-1.5"
                        style={{ color: themeConfig.colors.textSecondary }}
                      >
                        用户名
                      </label>
                      <div className="relative">
                        <User
                          size={16}
                          className="absolute left-3 top-1/2 -translate-y-1/2 sm:w-[18px] sm:h-[18px]"
                          style={{ color: themeConfig.colors.textMuted }}
                        />
                        <input
                          type="text"
                          value={formData.username}
                          onChange={(e) => updateField('username', e.target.value)}
                          placeholder="请输入用户名（2-20个字符）"
                          className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2"
                          style={{
                            background: themeConfig.colors.surface,
                            borderColor: errors.username
                              ? themeConfig.colors.rose
                              : themeConfig.colors.border,
                            color: themeConfig.colors.text,
                          }}
                        />
                      </div>
                      {errors.username && (
                        <p className="mt-1 text-xs" style={{ color: themeConfig.colors.rose }}>
                          {errors.username}
                        </p>
                      )}
                    </div>
                    
                    {/* 邮箱 */}
                    <div>
                      <label
                        className="block text-xs sm:text-sm font-medium mb-1 sm:mb-1.5"
                        style={{ color: themeConfig.colors.textSecondary }}
                      >
                        邮箱
                      </label>
                      <div className="relative">
                        <Mail
                          size={16}
                          className="absolute left-3 top-1/2 -translate-y-1/2 sm:w-[18px] sm:h-[18px]"
                          style={{ color: themeConfig.colors.textMuted }}
                        />
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => updateField('email', e.target.value)}
                          placeholder="请输入邮箱地址"
                          className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2"
                          style={{
                            background: themeConfig.colors.surface,
                            borderColor: errors.email
                              ? themeConfig.colors.rose
                              : themeConfig.colors.border,
                            color: themeConfig.colors.text,
                          }}
                        />
                      </div>
                      {errors.email && (
                        <p className="mt-1 text-xs" style={{ color: themeConfig.colors.rose }}>
                          {errors.email}
                        </p>
                      )}
                    </div>
                    
                    {/* 密码 */}
                    <div>
                      <label
                        className="block text-xs sm:text-sm font-medium mb-1 sm:mb-1.5"
                        style={{ color: themeConfig.colors.textSecondary }}
                      >
                        密码
                      </label>
                      <div className="relative">
                        <Lock
                          size={16}
                          className="absolute left-3 top-1/2 -translate-y-1/2 sm:w-[18px] sm:h-[18px]"
                          style={{ color: themeConfig.colors.textMuted }}
                        />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={formData.password}
                          onChange={(e) => updateField('password', e.target.value)}
                          placeholder="请设置密码（至少6位）"
                          className="w-full pl-9 sm:pl-10 pr-12 py-2.5 sm:py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2"
                          style={{
                            background: themeConfig.colors.surface,
                            borderColor: errors.password
                              ? themeConfig.colors.rose
                              : themeConfig.colors.border,
                            color: themeConfig.colors.text,
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded transition-colors hover:opacity-70"
                          style={{ color: themeConfig.colors.textMuted }}
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="mt-1 text-xs" style={{ color: themeConfig.colors.rose }}>
                          {errors.password}
                        </p>
                      )}
                      
                      {/* 密码强度指示器 */}
                      {formData.password && (
                        <div className="mt-2">
                          <div className="flex items-center gap-2 mb-1">
                            <div
                              className="flex-1 h-1.5 rounded-full overflow-hidden"
                              style={{ background: themeConfig.colors.border }}
                            >
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: strengthInfo.width }}
                                transition={{ duration: 0.3 }}
                                className="h-full rounded-full"
                                style={{ background: strengthInfo.color }}
                              />
                            </div>
                            <span
                              className="text-xs font-medium"
                              style={{ color: strengthInfo.color }}
                            >
                              {strengthInfo.text}
                            </span>
                          </div>
                          <p
                            className="text-xs"
                            style={{ color: themeConfig.colors.textMuted }}
                          >
                            建议使用8位以上，包含大小写字母、数字和特殊字符
                          </p>
                        </div>
                      )}
                    </div>
                    
                    {/* 确认密码 */}
                    <div>
                      <label
                        className="block text-xs sm:text-sm font-medium mb-1 sm:mb-1.5"
                        style={{ color: themeConfig.colors.textSecondary }}
                      >
                        确认密码
                      </label>
                      <div className="relative">
                        <Lock
                          size={16}
                          className="absolute left-3 top-1/2 -translate-y-1/2 sm:w-[18px] sm:h-[18px]"
                          style={{ color: themeConfig.colors.textMuted }}
                        />
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={formData.confirmPassword}
                          onChange={(e) => updateField('confirmPassword', e.target.value)}
                          placeholder="请再次输入密码"
                          className="w-full pl-9 sm:pl-10 pr-12 py-2.5 sm:py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2"
                          style={{
                            background: themeConfig.colors.surface,
                            borderColor: errors.confirmPassword
                              ? themeConfig.colors.rose
                              : themeConfig.colors.border,
                            color: themeConfig.colors.text,
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded transition-colors hover:opacity-70"
                          style={{ color: themeConfig.colors.textMuted }}
                        >
                          {showConfirmPassword ? <EyeOff size={16} className="sm:w-[18px] sm:h-[18px]" /> : <Eye size={16} className="sm:w-[18px] sm:h-[18px]" />}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <p className="mt-1 text-xs" style={{ color: themeConfig.colors.rose }}>
                          {errors.confirmPassword}
                        </p>
                      )}
                    </div>
                    
                    {/* 同意条款 */}
                    <label className="flex items-start gap-1.5 sm:gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.agreeTerms}
                        onChange={(e) => updateField('agreeTerms', e.target.checked)}
                        className="w-3.5 h-3.5 sm:w-4 sm:h-4 mt-0.5 rounded border cursor-pointer"
                        style={{ accentColor: themeConfig.colors.primary }}
                      />
                      <span
                        className="text-xs sm:text-sm"
                        style={{ color: themeConfig.colors.textMuted }}
                      >
                        我已阅读并同意
                        <button
                          type="button"
                          className="font-semibold hover:underline mx-0.5 transition-colors"
                          style={{ color: '#06b6d4' }}
                          onClick={() => alert('服务条款内容')}
                        >
                          服务条款
                        </button>
                        和
                        <button
                          type="button"
                          className="font-semibold hover:underline mx-0.5 transition-colors"
                          style={{ color: '#06b6d4' }}
                          onClick={() => alert('隐私政策内容')}
                        >
                          隐私政策
                        </button>
                      </span>
                    </label>
                    
                    {/* 注册按钮 - 蓝青紫渐变 */}
                    <button
                      onClick={handleRegister}
                      disabled={isLoading}
                      className="w-full py-3 sm:py-3.5 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
                      style={{
                        background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 50%, #8b5cf6 100%)',
                        boxShadow: '0 4px 20px -5px rgba(59, 130, 246, 0.4)',
                      }}
                    >
                      {isLoading ? (
                        <Loader2 size={18} className="animate-spin sm:w-5 sm:h-5" />
                      ) : (
                        <>
                          创建账号
                          <ArrowRight size={16} className="sm:w-[18px] sm:h-[18px]" />
                        </>
                      )}
                    </button>
                  </div>
                )}
                
                {/* Footer */}
                <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 text-center" style={{ borderTop: `1px solid ${themeConfig.colors.border}` }}>
                  <p className="text-sm" style={{ color: themeConfig.colors.textMuted }}>
                    {mode === 'login' ? '还没有账号？' : '已有账号？'}
                    <button
                      type="button"
                      onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
                      className="font-semibold ml-1 hover:underline transition-colors"
                      style={{ 
                        color: mode === 'login' ? '#06b6d4' : '#10b981',
                      }}
                    >
                      {mode === 'login' ? '立即注册' : '立即登录'}
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
