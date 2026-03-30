import { getSupabaseClient } from './supabase'

export async function uploadPublicFile(file: File, folder: string): Promise<{ url: string } | { error: string }> {
  const supabase = getSupabaseClient()
  const ext = file.name.split('.').pop() || 'bin'
  const filename = `${crypto.randomUUID()}.${ext}`
  const path = `${folder}/${filename}`
  const { error } = await supabase.storage.from('public-assets').upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  })
  if (error) {
    return { error: error.message }
  }
  const { data } = supabase.storage.from('public-assets').getPublicUrl(path)
  return { url: data.publicUrl }
}
