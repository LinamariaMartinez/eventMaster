import { NextResponse } from 'next/server'
import { validateEnvironment, config } from '@/lib/config'

export async function GET() {
  try {
    // Only allow in development or if explicitly enabled
    if (config.app.environment === 'production' && !process.env.ENABLE_DEBUG_ENDPOINTS) {
      return NextResponse.json({ 
        error: 'Debug endpoints are disabled in production' 
      }, { status: 403 })
    }

    const validation = validateEnvironment()
    
    const envStatus = {
      // Environment info
      NODE_ENV: process.env.NODE_ENV,
      VERCEL: process.env.VERCEL ? 'true' : 'false',
      VERCEL_ENV: process.env.VERCEL_ENV,
      
      // Supabase status
      SUPABASE_CONFIGURED: config.features.enableSupabaseAuth,
      SUPABASE_URL_STATUS: config.supabase.url ? 'SET' : 'MISSING',
      SUPABASE_ANON_KEY_STATUS: config.supabase.anonKey ? 'SET' : 'MISSING',
      
      // Values (only first/last few chars for security)
      SUPABASE_URL_PREVIEW: config.supabase.url 
        ? `${config.supabase.url.substring(0, 20)}...${config.supabase.url.slice(-15)}`
        : 'NOT_SET',
      SUPABASE_KEY_PREVIEW: config.supabase.anonKey
        ? `${config.supabase.anonKey.substring(0, 20)}...${config.supabase.anonKey.slice(-15)}`
        : 'NOT_SET',
      
      // Validation results
      ENVIRONMENT_VALID: validation.isValid,
      VALIDATION_ERRORS: validation.errors,
      
      // Feature flags
      FEATURES: config.features,
      
      // Runtime info
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json(envStatus)
  } catch (error) {
    return NextResponse.json({ 
      error: 'Failed to check environment variables',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}