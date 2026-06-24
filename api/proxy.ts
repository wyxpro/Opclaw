export const config = {
  runtime: 'edge',
}

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  try {
    const body = await req.json()
    const apiKey = process.env.VITE_DEEPSEEK_PROXY_KEY || process.env.DEEPSEEK_PROXY_KEY

    if (!apiKey) {
      return new Response(
        JSON.stringify({
          error: {
            message: 'VITE_DEEPSEEK_PROXY_KEY is not configured on Vercel environment variables.',
            type: 'configuration_error'
          }
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    const response = await fetch('https://mangdream.com/api/innoreation/v1/proxy/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Proxy-Key': apiKey,
      },
      body: JSON.stringify({
        model: body.model || 'deepseek-v4-pro',
        messages: body.messages,
        stream: body.stream !== false,
        temperature: body.temperature ?? 0.7,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      let errorJson
      try {
        errorJson = JSON.parse(errorText)
      } catch (e) {
        errorJson = { message: errorText }
      }
      return new Response(JSON.stringify(errorJson), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Stream the response back to the client
    return new Response(response.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        error: {
          message: error.message || 'Internal Server Error',
          type: 'api_error'
        }
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
