// Production-safe environment configuration

export const config = {
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  },
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME || 'Catalina Lezama ED',
    url: process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL || 'http://localhost:3000',
    environment: process.env.NODE_ENV || 'development',
  },
  features: {
    // Feature flags for production deployment
    enableSupabaseAuth: !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    enableDemoMode: false, // Demo mode disabled - use real Supabase only
    enableDebugEndpoints: process.env.NODE_ENV !== 'production',
  }
};

export const isProduction = () => config.app.environment === 'production';
export const isDevelopment = () => config.app.environment === 'development';

// Safe Supabase config getter
export const getSupabaseConfig = () => {
  if (!config.features.enableSupabaseAuth) {
    throw new Error('Supabase is not properly configured');
  }
  
  return {
    url: config.supabase.url!,
    anonKey: config.supabase.anonKey!,
  };
};

// Environment validation for production
export const validateEnvironment = () => {
  const errors: string[] = [];
  
  if (isProduction()) {
    if (!config.supabase.url) {
      errors.push('NEXT_PUBLIC_SUPABASE_URL is required in production');
    }
    if (!config.supabase.anonKey) {
      errors.push('NEXT_PUBLIC_SUPABASE_ANON_KEY is required in production');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    config: config
  };
};