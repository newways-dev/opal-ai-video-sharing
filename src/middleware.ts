import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const allowedOrigins = ['http://localhost:3000', 'http://localhost:5173']

const corsOptions = {
  'Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS,POST,PUT',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
}

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/api/payment',
  '/payment(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  const origin = req.headers.get('Origin') ?? ''
  const isAllowedOrigin = allowedOrigins.includes(origin)

  if (req.method === 'OPTIONS') {
    const preflightHeaders = {
      ...(isAllowedOrigin && { 'Access-Control-Allow-Origin': origin }),
      ...corsOptions,
    }
    return NextResponse.json({}, { headers: preflightHeaders })
  }

  if (isProtectedRoute(req)) await auth.protect()

  const response = NextResponse.next()

  if (isAllowedOrigin) {
    response.headers.set('Access-Control-Allow-Origin', origin)
  }

  Object.entries(corsOptions).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  return response
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
