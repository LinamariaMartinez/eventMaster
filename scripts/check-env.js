#!/usr/bin/env node

/**
 * Script para verificar que todas las variables de entorno necesarias estén configuradas
 */

const requiredEnvVars = {
  // Variables críticas de Supabase
  'NEXT_PUBLIC_SUPABASE_URL': {
    required: true,
    description: 'URL de tu proyecto de Supabase'
  },
  'NEXT_PUBLIC_SUPABASE_ANON_KEY': {
    required: true,
    description: 'Clave anónima de Supabase'
  },
  'SUPABASE_SERVICE_ROLE_KEY': {
    required: true,
    description: 'Clave de servicio de Supabase (para APIs)'
  },
  
  // Variables de autenticación
  'NEXTAUTH_SECRET': {
    required: true,
    description: 'Secreto para NextAuth.js'
  },
  'NEXTAUTH_URL': {
    required: true,
    description: 'URL de la aplicación (debe coincidir con el dominio)'
  },
  
  // Variables opcionales pero recomendadas
  'GOOGLE_CLIENT_EMAIL': {
    required: false,
    description: 'Email del service account de Google'
  },
  'GOOGLE_PRIVATE_KEY': {
    required: false,
    description: 'Clave privada de Google Sheets'
  },
};

console.log('🔍 Verificando variables de entorno...\n');

let allValid = true;
let missingRequired = [];

Object.entries(requiredEnvVars).forEach(([varName, config]) => {
  const value = process.env[varName];
  const isSet = Boolean(value && value.length > 0);
  
  if (config.required && !isSet) {
    console.log(`❌ ${varName} - FALTANTE (REQUERIDA)`);
    console.log(`   ${config.description}`);
    missingRequired.push(varName);
    allValid = false;
  } else if (config.required && isSet) {
    console.log(`✅ ${varName} - OK`);
  } else if (!config.required && isSet) {
    console.log(`✅ ${varName} - OK (opcional)`);
  } else {
    console.log(`⚠️  ${varName} - No configurada (opcional)`);
    console.log(`   ${config.description}`);
  }
  
  console.log('');
});

console.log('\n' + '='.repeat(50));

if (allValid) {
  console.log('🎉 ¡Todas las variables requeridas están configuradas!');
  console.log('\nPuedes proceder con el deployment.');
} else {
  console.log('❌ Faltan variables de entorno requeridas:');
  missingRequired.forEach(varName => {
    console.log(`   - ${varName}`);
  });
  
  console.log('\n📋 Para configurar en Vercel:');
  console.log('1. Ve a Settings → Environment Variables en tu proyecto de Vercel');
  console.log('2. Agrega las variables faltantes');
  console.log('3. Redeploya la aplicación');
  console.log('\n📖 Consulta DEPLOYMENT.md para más detalles');
  
  // Only exit with error in production builds
  if (process.env.NODE_ENV === 'production' || process.env.VERCEL === '1') {
    process.exit(1);
  } else {
    console.log('\n⚠️  Continuando en modo desarrollo sin todas las variables...');
  }
}

// Verificaciones adicionales
console.log('\n🔍 Verificaciones adicionales:');

if (process.env.NEXTAUTH_URL) {
  if (process.env.NEXTAUTH_URL.includes('localhost')) {
    console.log('⚠️  NEXTAUTH_URL apunta a localhost - asegúrate de usar tu dominio de producción');
  } else {
    console.log('✅ NEXTAUTH_URL configurada para producción');
  }
}

if (process.env.NODE_ENV === 'production') {
  console.log('✅ Ejecutándose en modo producción');
} else {
  console.log('ℹ️  Ejecutándose en modo desarrollo');
}