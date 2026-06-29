process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

export default async function handler(req: any, res: any) {
  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Proxy-Key',
    })
    res.end()
    return
  }

  if (req.method !== 'POST') {
    res.writeHead(405, { 'Content-Type': 'text/plain' })
    res.end('Method Not Allowed')
    return
  }

  // Set CORS headers for all responses
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Proxy-Key')

  try {
    // Vercel Node.js helper automatically parses JSON body to req.body
    let body = req.body
    if (typeof body === 'string') {
      body = JSON.parse(body)
    }

    let apiKey = process.env.VITE_DEEPSEEK_PROXY_KEY || process.env.DEEPSEEK_PROXY_KEY

    // Fallback to client headers
    if (!apiKey || apiKey === 'undefined' || apiKey === 'null') {
      apiKey = req.headers['x-proxy-key'] || req.headers['X-Proxy-Key'] || ''
    }

    if (!apiKey) {
      res.writeHead(500, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({
        error: {
          message: 'API Key (X-Proxy-Key) is not configured on Vercel environment variables and not provided in headers.',
          type: 'configuration_error'
        }
      }))
      return
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
      res.writeHead(response.status, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify(errorJson))
      return
    }

    // Set streaming headers
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    })

    if (response.body) {
      const reader = response.body.getReader()
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        res.write(value)
      }
    }
    res.end()
  } catch (error: any) {
    res.writeHead(500, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({
      error: {
        message: error.message || 'Internal Server Error',
        type: 'api_error',
        name: error.name || 'UnknownError',
        stack: error.stack || ''
      }
    }))
  }
}
