import { app } from '@azure/functions'

function getCorsHeaders(request) {
  const origin = request.headers.get('origin') || ''
  const allowedOrigins = (
    process.env.ALLOWED_ORIGINS || 'http://localhost:5173'
  ).split(',')
  const isAllowed =
    allowedOrigins.includes(origin) || allowedOrigins.includes('*')

  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : allowedOrigins[0],
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
}

// Simple in-memory rate limiting (resets on function cold start)
const rateLimitMap = new Map()
const RATE_LIMIT_WINDOW = 60000 // 1 minute
const RATE_LIMIT_MAX = 100 // max 100 logs per minute per IP

function isRateLimited(clientIp) {
  const now = Date.now()
  const clientData = rateLimitMap.get(clientIp)

  if (!clientData) {
    rateLimitMap.set(clientIp, { count: 1, resetAt: now + RATE_LIMIT_WINDOW })
    return false
  }

  if (now > clientData.resetAt) {
    rateLimitMap.set(clientIp, { count: 1, resetAt: now + RATE_LIMIT_WINDOW })
    return false
  }

  if (clientData.count >= RATE_LIMIT_MAX) {
    return true
  }

  clientData.count++
  return false
}

export async function logHandler(request, context) {
  const corsHeaders = getCorsHeaders(request)

  if (request.method === 'OPTIONS') {
    return { status: 204, headers: corsHeaders }
  }

  try {
    // Basic rate limiting
    const clientIp =
      request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown'
    if (isRateLimited(clientIp)) {
      context.warn('Rate limit exceeded for client:', clientIp)
      return {
        status: 429,
        headers: corsHeaders,
      }
    }

    const body = await request.json()
    const { category, message, metadata } = body

    if (!category || !message) {
      return {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: 'Missing required fields: category, message',
        }),
      }
    }

    // Log structured error data to Vercel logs
    // This will be picked up by log drains (Axiom, Better Stack, etc.)
    context.log(
      JSON.stringify({
        level: 'error',
        category,
        message,
        metadata,
        timestamp: new Date().toISOString(),
        source: 'client',
      }),
    )

    return {
      status: 204,
      headers: corsHeaders,
    }
  } catch (error) {
    context.error('Log endpoint error:', error)
    return {
      status: 500,
      headers: corsHeaders,
    }
  }
}

app.http('log', {
  methods: ['POST', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'log',
  handler: logHandler,
})
