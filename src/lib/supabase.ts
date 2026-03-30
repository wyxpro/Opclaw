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
  if (!url || !anonKey) {
    throw new Error('Missing Supabase configuration')
  }
  client = createClient(url, anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  })
  return client
}
