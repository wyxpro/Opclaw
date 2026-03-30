import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let client: SupabaseClient | null = null

export function getSupabaseClient(): SupabaseClient {
  if (client) return client
  const url =
    ((import.meta as any)?.env?.VITE_SUPABASE_URL as string) ||
    ((globalThis as any).__APP_CONFIG__?.VITE_SUPABASE_URL as string) ||
    ''
  const anonKey =
    ((import.meta as any)?.env?.VITE_SUPABASE_ANON_KEY as string) ||
    ((globalThis as any).__APP_CONFIG__?.VITE_SUPABASE_ANON_KEY as string) ||
    ''
  
  // 如果缺少配置，创建一个模拟客户端避免应用崩溃
  if (!url || !anonKey) {
    console.warn('Supabase configuration missing, using mock client')
    // 创建一个最小化的模拟客户端
    const mockClient = {
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
        signInWithPassword: async () => ({ data: null, error: new Error('Supabase not configured') }),
        signUp: async () => ({ data: null, error: new Error('Supabase not configured') }),
        signOut: async () => Promise.resolve(),
        onAuthStateChange: () => ({ subscription: { unsubscribe: () => {} } }),
      },
      from: () => ({
        select: () => ({
          eq: () => ({ maybeSingle: async () => null }),
          maybeSingle: async () => null,
        }),
        insert: () => Promise.resolve({ data: null, error: null }),
        update: () => Promise.resolve({ data: null, error: null }),
        upsert: () => Promise.resolve({ data: null, error: null }),
      }),
      rpc: async () => ({ data: null, error: null }),
    }
    client = mockClient as unknown as SupabaseClient
    return client
  }
  
  client = createClient(url, anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  })
  return client
}
