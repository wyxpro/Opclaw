import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'

serve(async (req: Request) => {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q') || ''
  return new Response(JSON.stringify({ echo: q }), {
    headers: { 'content-type': 'application/json' },
    status: 200,
  })
})
