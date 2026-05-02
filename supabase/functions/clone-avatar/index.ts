import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const MODEL_SCOPE_API_KEY = Deno.env.get('MODELSCOPE_API_KEY')
const BASE_URL = 'https://api-inference.modelscope.cn/v1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders, status: 200 })
  }

  try {
    const { imageUrl, style, prompt: userPrompt } = await req.json()

    let prompt = userPrompt || `A happy, smiling person in the style of ${style}. `
    if (!userPrompt) {
        if (style === 'cartoon') {
            prompt = `Cute 3D stylized character avatar, Pixar style animation, Disney-inspired digital art, large expressive eyes, friendly smile, smooth and clean skin texture, vibrant color palette, high-quality 3D render, Octane render style, keeping the recognizable facial features of the person in the image while transforming them into a cartoon.`

        } else if (style === 'realistic') {
            prompt = `Professional high-quality 8k realistic portrait, photorealistic, raw photography, natural lighting, highly detailed skin pores and hair, realistic eyes, lifelike expression, keeping the exact facial features of the person in the image.`
        } else if (style === 'hidden') {
            prompt = `A stylized, artistic hidden version of the person in the image, mysterious yet happy smiling expression, minimalist art style, abstract interpretation.`
        }
    }


    console.log(`Generating image for style: ${style}, prompt: ${prompt}`)

    // Step 1: Start task
    const response = await fetch(`${BASE_URL}/images/generations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MODEL_SCOPE_API_KEY}`,
        'X-ModelScope-Async-Mode': 'true'
      },
      body: JSON.stringify({
        model: 'black-forest-labs/FLUX.2-klein-9B',
        prompt: prompt,
        image_url: [imageUrl]
      }),
    })

    if (!response.ok) {
        const errorText = await response.text()
        console.error('ModelScope API Error (Post):', errorText)
        throw new Error(`ModelScope API Error: ${response.status}`)
    }

    const { task_id } = await response.json()
    if (!task_id) throw new Error('Failed to start image generation task')

    console.log(`Task started: ${task_id}`)

    // Step 2: Poll
    let resultData;
    let attempts = 0;
    while (attempts < 10) { // 50s total max to stay within 60s limit
      const result = await fetch(`${BASE_URL}/tasks/${task_id}`, {
        headers: {
          'Authorization': `Bearer ${MODEL_SCOPE_API_KEY}`,
          'X-ModelScope-Task-Type': 'image_generation'
        },
      })

      if (!result.ok) {
          console.error('ModelScope API Error (Get Task):', await result.text())
          throw new Error('Failed to get task status')
      }

      resultData = await result.json()
      console.log(`Task ${task_id} status: ${resultData.task_status}`)

      if (resultData.task_status === 'SUCCEED') {
        return new Response(JSON.stringify({ url: resultData.output_images[0] }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      } else if (resultData.task_status === 'FAILED') {
        console.error('Task failed:', resultData)
        throw new Error('Image generation failed')
      }

      await new Promise(r => setTimeout(r, 5000))
      attempts++
    }

    throw new Error('Task timed out after 50 seconds')

  } catch (error) {
    console.error('Clone Avatar Function Error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
