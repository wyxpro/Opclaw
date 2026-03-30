import { getSupabaseClient } from './supabase'

export async function invokeEcho(q: string) {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.functions.invoke('echo', {
    body: { q },
  })
  return { data, error }
}
