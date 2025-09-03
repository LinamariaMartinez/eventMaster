import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/database.types'

export const createClient = () => {
  console.log('[supabase-client] Creating Supabase client...');
  
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  console.log('[supabase-client] Environment check:', {
    hasUrl: !!url,
    hasAnonKey: !!anonKey,
    urlLength: url?.length || 0,
    anonKeyLength: anonKey?.length || 0
  });

  if (!url || !anonKey) {
    const error = 'Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are required';
    console.error('[supabase-client] Environment error:', error);
    throw new Error(error);
  }

  try {
    const client = createBrowserClient<Database>(url, anonKey, {
      auth: {
        persistSession: true,
        detectSessionInUrl: true,
        flowType: 'pkce'
      },
      global: {
        headers: {
          'X-Client-Info': 'catalina-lezama-eventos'
        }
      }
    });
    
    console.log('[supabase-client] Supabase client created successfully');
    return client;
  } catch (error) {
    console.error('[supabase-client] Failed to create Supabase client:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      fullError: error
    });
    throw error;
  }
}

// Health check function to validate Supabase connection
export const validateSupabaseConnection = async () => {
  console.log('[supabase-client] Validating Supabase connection...');
  
  try {
    const client = createClient();
    
    // Try a simple query to test the connection
    const { data, error } = await client.auth.getSession();
    
    console.log('[supabase-client] Connection validation result:', {
      success: !error,
      hasData: !!data,
      hasSession: !!data?.session,
      errorMessage: error?.message
    });
    
    return {
      isConnected: !error,
      error: error?.message || null,
      session: data?.session || null
    };
  } catch (error) {
    console.error('[supabase-client] Connection validation failed:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      fullError: error
    });
    
    return {
      isConnected: false,
      error: error instanceof Error ? error.message : String(error),
      session: null
    };
  }
}