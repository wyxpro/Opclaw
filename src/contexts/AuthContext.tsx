import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import type { User, LoginCredentials, RegisterCredentials, AuthContextType } from '../types/auth'
import { presetAvatars } from '../data/mock'

const AUTH_STORAGE_KEY = 'superui_auth_data'

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

// 生成唯一ID
function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

// 模拟用户数据库（实际项目中应该连接后端API）
const mockUserDatabase: Map<string, { user: User; password: string }> = new Map()

// 初始化管理员账户
const adminId = generateId()
const adminUser: User = {
  id: adminId,
  username: '晓叶有点酷',
  email: 'wyxcode@qq.com',
  avatar: presetAvatars[1]?.url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
  bio: '系统管理员',
  createdAt: new Date().toISOString(),
  lastLoginAt: new Date().toISOString(),
}
mockUserDatabase.set(adminId, { user: adminUser, password: '123456' })

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // 初始化：从 localStorage 恢复登录状态
  useEffect(() => {
    const initAuth = () => {
      try {
        const storedData = localStorage.getItem(AUTH_STORAGE_KEY)
        if (storedData) {
          const parsed = JSON.parse(storedData)
          // 检查是否过期
          if (parsed.expiresAt && parsed.expiresAt < Date.now()) {
            localStorage.removeItem(AUTH_STORAGE_KEY)
          } else {
            setUser(parsed.user)
            setIsAuthenticated(true)
          }
        }
      } catch (error) {
        console.error('Failed to parse auth data:', error)
        localStorage.removeItem(AUTH_STORAGE_KEY)
      }
      setIsLoading(false)
    }

    initAuth()
  }, [])

  // 保存认证数据到 localStorage
  const saveAuthData = useCallback((userData: User, rememberMe: boolean = false) => {
    const data = {
      user: userData,
      token: generateId(),
      expiresAt: rememberMe ? undefined : Date.now() + 7 * 24 * 60 * 60 * 1000, // 7天过期
    }
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data))
  }, [])

  // 登录功能
  const login = useCallback(async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 500))

      const { emailOrPhone, password, rememberMe } = credentials

      // 验证输入
      if (!emailOrPhone || !password) {
        return false
      }

      // 查找用户（模拟数据库查询）
      let foundUser: { user: User; password: string } | undefined
      
      // 先尝试通过用户名查找
      foundUser = Array.from(mockUserDatabase.values()).find(
        u => u.user.username === emailOrPhone
      )
      
      // 如果没找到，尝试通过邮箱查找
      if (!foundUser) {
        foundUser = Array.from(mockUserDatabase.values()).find(
          u => u.user.email === emailOrPhone
        )
      }

      // 验证密码
      if (!foundUser || foundUser.password !== password) {
        return false
      }

      // 更新最后登录时间
      const updatedUser = {
        ...foundUser.user,
        lastLoginAt: new Date().toISOString(),
      }

      // 更新数据库
      mockUserDatabase.set(foundUser.user.id, { user: updatedUser, password })

      // 设置状态
      setUser(updatedUser)
      setIsAuthenticated(true)

      // 保存到 localStorage
      saveAuthData(updatedUser, rememberMe)

      return true
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }, [saveAuthData])

  // 注册功能
  const register = useCallback(async (credentials: RegisterCredentials): Promise<boolean> => {
    try {
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 500))

      const { username, email, phone, password, confirmPassword } = credentials

      // 验证密码匹配
      if (password !== confirmPassword) {
        return false
      }

      // 检查邮箱是否已注册
      const emailExists = Array.from(mockUserDatabase.values()).some(
        u => u.user.email === email
      )
      if (emailExists) {
        return false
      }

      // 检查手机号是否已注册
      if (phone) {
        const phoneExists = Array.from(mockUserDatabase.values()).some(
          u => u.user.phone === phone
        )
        if (phoneExists) {
          return false
        }
      }

      // 创建新用户
      const newUser: User = {
        id: generateId(),
        username,
        email,
        phone,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
        bio: '',
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      }

      // 保存到模拟数据库
      mockUserDatabase.set(newUser.id, { user: newUser, password })

      // 自动登录
      setUser(newUser)
      setIsAuthenticated(true)
      saveAuthData(newUser, true)

      return true
    } catch (error) {
      console.error('Register error:', error)
      return false
    }
  }, [saveAuthData])

  // 登出功能
  const logout = useCallback(() => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem(AUTH_STORAGE_KEY)
  }, [])

  // 检查认证状态
  const checkAuth = useCallback((): boolean => {
    return isAuthenticated && user !== null
  }, [isAuthenticated, user])

  // 更新用户信息
  const updateUser = useCallback((userData: Partial<User>) => {
    if (!user) return

    const updatedUser = { ...user, ...userData }
    setUser(updatedUser)

    // 更新 localStorage
    const storedData = localStorage.getItem(AUTH_STORAGE_KEY)
    if (storedData) {
      const parsed = JSON.parse(storedData)
      localStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify({ ...parsed, user: updatedUser })
      )
    }

    // 更新模拟数据库
    const dbEntry = mockUserDatabase.get(user.id)
    if (dbEntry) {
      mockUserDatabase.set(user.id, { ...dbEntry, user: updatedUser })
    }
  }, [user])

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    checkAuth,
    updateUser,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// 自定义 Hook
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
