import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const MODEL_SCOPE_API_KEY = Deno.env.get('MODEL_SCOPE_API_KEY')
const BASE_URL = 'https://api-inference.modelscope.cn/v1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { messages, stream = true } = await req.json()

    const response = await fetch(`${BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MODEL_SCOPE_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'MiniMax/MiniMax-M2.5',
        messages: messages,
        stream: stream,
      }),
    })

    if (stream) {
      // Proxy the stream
      return new Response(response.body, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/event-stream',
        },
      })
    } else {
      const data = await response.json()
      return new Response(JSON.stringify(data), {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      })
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    })
  }
})
