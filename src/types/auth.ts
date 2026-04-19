// 用户认证相关类型定义

// 用户基础信息
export interface User {
  id: string
  username: string
  email: string
  phone?: string
  avatar?: string
  backgroundUrl?: string
  bio?: string
  createdAt: string
  lastLoginAt: string
}

// 登录凭证
export interface LoginCredentials {
  emailOrPhone: string
  password: string
  rememberMe?: boolean
}

// 注册凭证
export interface RegisterCredentials {
  username: string
  email: string
  phone?: string
  password: string
  confirmPassword: string
}

// 认证状态
export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

// 表单验证错误
export interface AuthFormErrors {
  emailOrPhone?: string
  username?: string
  email?: string
  phone?: string
  password?: string
  confirmPassword?: string
  general?: string
}

// 密码强度等级
export type PasswordStrength = 'weak' | 'medium' | 'strong' | 'very-strong'

// 认证上下文类型
export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<boolean>
  register: (credentials: RegisterCredentials) => Promise<boolean>
  logout: () => void
  checkAuth: () => boolean
  updateUser: (userData: Partial<User>) => void
  guestLogin: () => Promise<boolean>
}

// 本地存储的认证数据
export interface StoredAuthData {
  user: User
  token: string
  expiresAt?: number
}
