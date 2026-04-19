import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import type { User, LoginCredentials, RegisterCredentials, AuthContextType } from '../types/auth'
import { getSupabaseClient } from '../lib/supabase'
import { presetAvatars } from '../data/mock'
import { showToast } from '../lib/toast'
import { useNavigate } from 'react-router-dom'

const AUTH_STORAGE_KEY = 'opclaw_auth_data'

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

function mapProfileToUser(profile: any, email: string): User {
  return {
    id: profile.user_id,
    username: profile.username || email.split('@')[0],
    email,
    avatar: profile.avatar_url || presetAvatars[0]?.url || '',
    backgroundUrl: profile.background_url || '',
    bio: profile.bio || '',
    createdAt: profile.created_at || new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  async function fetchAndSetProfile() {
    try {
      const supabase = getSupabaseClient()
      const { data: userRes } = await supabase.auth.getUser()
      const authed = !!userRes?.user
      if (!authed) {
        setUser(null)
        setIsAuthenticated(false)
        setIsLoading(false)
        localStorage.removeItem(AUTH_STORAGE_KEY)
        return
      }
      const uid = userRes.user!.id
      const email = userRes.user!.email || ''
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', uid)
        .maybeSingle()
      let mapped: User
      if (!profile) {
        const username = email ? email.split('@')[0] : 'user'
        const avatar_url = presetAvatars[0]?.url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`
        await supabase.from('profiles').insert({
          user_id: uid,
          username,
          email,
          avatar_url,
          bio: '',
        })
        mapped = {
          id: uid,
          username,
          email,
          avatar: avatar_url,
          backgroundUrl: '',
          bio: '',
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
        }
      } else {
        mapped = mapProfileToUser(profile, email)
      }
      setUser(mapped)
      setIsAuthenticated(true)
      localStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify({ user: mapped })
      )
      setIsLoading(false)
    } catch {
      setUser(null)
      setIsAuthenticated(false)
      setIsLoading(false)
      localStorage.removeItem(AUTH_STORAGE_KEY)
    }
  }

  useEffect(() => {
    const supabase = getSupabaseClient()
    // 先用本地快照�?乐观预置"，避免页面首次渲染误判未登录而弹�?
    let hasLocalCache = false
    try {
      const cached = localStorage.getItem(AUTH_STORAGE_KEY)
      if (cached) {
        const parsed = JSON.parse(cached)
        if (parsed?.user) {
          setUser(parsed.user)
          setIsAuthenticated(true)
          hasLocalCache = true
          // 保持 isLoading �?true，待后续 fetchAndSetProfile 校验并最终定格状�?
        }
      }
    } catch {
      // ignore parse error
    }
      
    // 定义带缓存状态的 profile 获取函数
    const fetchAndSetProfileWithCache = async () => {
      try {
        const supabase = getSupabaseClient()
        const { data: userRes } = await supabase.auth.getUser()
        const authed = !!userRes?.user
        if (!authed) {
          setUser(null)
          setIsAuthenticated(false)
          setIsLoading(false)
          localStorage.removeItem(AUTH_STORAGE_KEY)
          return
        }
        const uid = userRes.user!.id
        const email = userRes.user!.email || ''
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', uid)
          .maybeSingle()
        let mapped: User
        if (!profile) {
          const username = email ? email.split('@')[0] : 'user'
          const avatar_url = presetAvatars[0]?.url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`
          await supabase.from('profiles').insert({
            user_id: uid,
            username,
            email,
            avatar_url,
            bio: '',
          })
          mapped = {
            id: uid,
            username,
            email,
            avatar: avatar_url,
            backgroundUrl: '',
            bio: '',
            createdAt: new Date().toISOString(),
            lastLoginAt: new Date().toISOString(),
          }
        } else {
          mapped = mapProfileToUser(profile, email)
        }
        setUser(mapped)
        setIsAuthenticated(true)
        localStorage.setItem(
          AUTH_STORAGE_KEY,
          JSON.stringify({ user: mapped })
        )
        setIsLoading(false)
      } catch {
        // 如果有本地缓存，保持登录状态，不退�?
        if (!hasLocalCache) {
          setUser(null)
          setIsAuthenticated(false)
          localStorage.removeItem(AUTH_STORAGE_KEY)
        }
        setIsLoading(false)
      }
    }
      
    fetchAndSetProfileWithCache()
    const { data: listener } = supabase.auth.onAuthStateChange((_event, _session) => {
      fetchAndSetProfile()
    })
    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  const saveAuthData = useCallback((userData: User) => {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ user: userData }))
  }, [])

  const login = useCallback(async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      const { emailOrPhone, password } = credentials
      if (!emailOrPhone || !password) return false
      const supabase = getSupabaseClient()
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      let emailToUse = emailOrPhone
      if (!emailRegex.test(emailOrPhone)) {
        let emailRes: string | null = null
        try {
          const { data: rpcData } = await supabase.rpc('get_email_by_username', { p_username: emailOrPhone })
          emailRes = (rpcData as any) || null
        } catch {}
        if (!emailRes) {
          const { data: prof } = await supabase.from('profiles').select('email').eq('username', emailOrPhone).maybeSingle()
          emailRes = (prof as any)?.email || null
        }
        emailToUse = emailRes || ''
        if (!emailToUse) return false
      }
      const { error } = await supabase.auth.signInWithPassword({
        email: emailToUse,
        password,
      })
      if (error) return false
      await fetchAndSetProfile()
      showToast('登录成功')
      navigate('/social')
      return true
    } catch (error) {
      return false
    }
  }, [saveAuthData, user, navigate])

  const register = useCallback(async (credentials: RegisterCredentials): Promise<boolean> => {
    try {
      const { username, email, password, confirmPassword } = credentials
      if (password !== confirmPassword) return false
      const supabase = getSupabaseClient()
      const { data: exists } = await supabase.from('profiles').select('username').eq('username', username).maybeSingle()
      if (exists) return false
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { username } },
      })
      if (error) return false
      if (data.user) {
        const uid = data.user.id
        await supabase.from('profiles').upsert({
          user_id: uid,
          username,
          email,
          avatar_url: presetAvatars[0]?.url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
          background_url: '',
          bio: '',
        })
      }
      await fetchAndSetProfile()
      showToast('注册成功，已登录')
      navigate('/social')
      return true
    } catch (error) {
      return false
    }
  }, [saveAuthData, user, navigate])

  const logout = useCallback(async () => {
    const supabase = getSupabaseClient()
    await supabase.auth.signOut()
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem(AUTH_STORAGE_KEY)
  }, [])

  const checkAuth = useCallback((): boolean => {
    return isAuthenticated && user !== null
  }, [isAuthenticated, user])

  const updateUser = useCallback(async (userData: Partial<User>) => {
    if (!user) return

    const updatedUser = { ...user, ...userData }
    setUser(updatedUser)
    const storedData = localStorage.getItem(AUTH_STORAGE_KEY)
    if (storedData) {
      const parsed = JSON.parse(storedData)
      localStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify({ ...parsed, user: updatedUser })
      )
    }
    const supabase = getSupabaseClient()
    await supabase.from('profiles').update({
      username: updatedUser.username,
      avatar_url: updatedUser.avatar,
      background_url: updatedUser.backgroundUrl,
      bio: updatedUser.bio,
      updated_at: new Date().toISOString(),
    }).eq('user_id', user.id)
  }, [user])

  // 游客一键登�?- 自动创建临时账号
  const guestLogin = useCallback(async (): Promise<boolean> => {
    try {
      const supabase = getSupabaseClient()
      const randomId = Math.floor(Math.random() * 100000)
      const guestEmail = `guest${randomId}@temp.local`
      const guestPassword = `Guest${randomId}!@#`
      const guestUsername = `游客${randomId}`
      
      // 1. 先尝试注册新账号
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: guestEmail,
        password: guestPassword,
        options: { data: { username: guestUsername } },
      })
      
      if (signUpError) {
        console.error('游客注册错误:', signUpError.message)
        showToast(`游客登录失败: ${signUpError.message}`)
        return false
      }
      
      if (signUpData.user) {
        // 2. 创建用户 profile - 使用预设的第一个头像作为默认头�?
        const avatar_url = presetAvatars[0]?.url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${guestUsername}`
        await supabase.from('profiles').upsert({
          user_id: signUpData.user.id,
          username: guestUsername,
          email: guestEmail,
          avatar_url,
          background_url: '',
          bio: '我是游客用户',
        })
        
        // 3. 自动登录
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: guestEmail,
          password: guestPassword,
        })
        
        if (signInError) {
          console.error('游客自动登录错误:', signInError.message)
          showToast(`游客登录失败: ${signInError.message}`)
          return false
        }
        
        await fetchAndSetProfile()
        showToast('游客登录成功')
        navigate('/social')
        return true
      }
      
      return false
    } catch (err: any) {
      console.error('游客登录异常:', err)
      showToast(`游客登录失败: ${err?.message || '未知错误'}`)
      return false
    }
  }, [navigate])

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    checkAuth,
    updateUser,
    guestLogin,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// 自定�?Hook
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
