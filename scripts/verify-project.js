#!/usr/bin/env node

import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

// Cargar variables de entorno
config({ path: ".env.local" });

console.log("🔍 VERIFICACIÓN COMPLETA DEL PROYECTO\n");
console.log("=".repeat(60));

let allChecks = [];

// Función para agregar resultado de verificación
function addCheck(category, name, status, message = "") {
  allChecks.push({ category, name, status, message });
  const icon = status ? "✅" : "❌";
  console.log(`${icon} ${name}${message ? `: ${message}` : ""}`);
}

// 1. VERIFICAR COMPILACIÓN
console.log("\n🔧 1. VERIFICACIÓN DE COMPILACIÓN:");
try {
  // Verificar que los archivos principales existen
  const criticalFiles = [
    "package.json",
    "next.config.js",
    "tailwind.config.js",
    "middleware.ts",
    "app/layout.tsx",
    "app/page.tsx"
  ];

  for (const file of criticalFiles) {
    const exists = existsSync(join(process.cwd(), "..", file));
    addCheck("compilation", `Archivo ${file}`, exists);
  }

  // Verificar estructura de carpetas
  const criticalDirs = [
    "app",
    "components",
    "lib",
    "types",
    "hooks",
    "scripts"
  ];

  for (const dir of criticalDirs) {
    const exists = existsSync(join(process.cwd(), "..", dir));
    addCheck("compilation", `Directorio ${dir}`, exists);
  }

} catch (error) {
  addCheck("compilation", "Verificación de archivos", false, error.message);
}

// 2. VERIFICAR VARIABLES DE ENTORNO
console.log("\n🔐 2. VARIABLES DE ENTORNO:");
const requiredEnvVars = {
  'NEXT_PUBLIC_SUPABASE_URL': 'Obligatoria para Supabase',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY': 'Obligatoria para Supabase',
  'SUPABASE_SERVICE_ROLE_KEY': 'Para operaciones administrativas'
};

const optionalEnvVars = {
  'GOOGLE_SHEETS_CLIENT_EMAIL': 'Para integración Google Sheets',
  'GOOGLE_SHEETS_PRIVATE_KEY': 'Para integración Google Sheets',
  'NEXTAUTH_URL': 'Para configuración de auth',
  'NEXTAUTH_SECRET': 'Para seguridad de sesiones'
};

for (const [key, description] of Object.entries(requiredEnvVars)) {
  const exists = !!process.env[key];
  addCheck("environment", key, exists, description);
}

for (const [key, description] of Object.entries(optionalEnvVars)) {
  const exists = !!process.env[key];
  addCheck("environment", `${key} (opcional)`, exists, description);
}

// 3. VERIFICAR CONEXIÓN SUPABASE
console.log("\n🗄️ 3. CONEXIÓN SUPABASE:");
try {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseKey) {
    const supabase = createClient(supabaseUrl, supabaseKey);
    addCheck("supabase", "Cliente inicializado", true);

    // Test de autenticación
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        addCheck("supabase", "Conexión de autenticación", false, error.message);
      } else {
        addCheck("supabase", "Conexión de autenticación", true);
      }
    } catch (authError) {
      addCheck("supabase", "Conexión de autenticación", false, authError.message);
    }

    // Test de base de datos
    try {
      const { error: dbError } = await supabase
        .from('events')
        .select('count')
        .limit(1);

      if (dbError) {
        addCheck("supabase", "Acceso a base de datos", false, dbError.message);
      } else {
        addCheck("supabase", "Acceso a base de datos", true);
      }
    } catch (dbError) {
      addCheck("supabase", "Acceso a base de datos", false, dbError.message);
    }

  } else {
    addCheck("supabase", "Variables configuradas", false, "Faltan variables de Supabase");
  }
} catch (error) {
  addCheck("supabase", "Inicialización", false, error.message);
}

// 4. VERIFICAR ESTRUCTURA DE ARCHIVOS CRÍTICOS
console.log("\n📁 4. ARCHIVOS CRÍTICOS:");
const criticalComponents = [
  "components/auth/improved-auth-form.tsx",
  "components/auth/auth-form-wrapper.tsx",
  "components/dashboard/header.tsx",
  "components/dashboard/sidebar.tsx",
  "lib/auth.ts",
  "lib/supabase.ts",
  "types/index.ts",
  "hooks/use-auth-navigation.ts"
];

for (const component of criticalComponents) {
  const exists = existsSync(join(process.cwd(), "..", component));
  addCheck("files", component, exists);
}

// 5. VERIFICAR CONFIGURACIÓN DE TIPOS
console.log("\n📋 5. CONFIGURACIÓN TYPESCRIPT:");
try {
  const tsConfigExists = existsSync(join(process.cwd(), "..", "tsconfig.json"));
  addCheck("typescript", "tsconfig.json", tsConfigExists);

  if (tsConfigExists) {
    const tsConfig = JSON.parse(readFileSync(join(process.cwd(), "..", "tsconfig.json"), "utf8"));
    addCheck("typescript", "Configuración App Router", !!tsConfig.compilerOptions);
  }

  // Verificar tipos de database
  const dbTypesExist = existsSync(join(process.cwd(), "..", "types/database.types.ts"));
  addCheck("typescript", "Tipos de base de datos", dbTypesExist);

} catch (error) {
  addCheck("typescript", "Configuración TypeScript", false, error.message);
}

// 6. VERIFICAR SCRIPTS
console.log("\n🛠️ 6. SCRIPTS DE UTILIDAD:");
const scripts = [
  "debug-supabase.js",
  "setup-database.js",
  "final-status.js",
  "verify-project.js"
];

for (const script of scripts) {
  const exists = existsSync(join(process.cwd(), script));
  addCheck("scripts", script, exists);
}

// Verificar configuración ES modules
const scriptPackageExists = existsSync(join(process.cwd(), "package.json"));
addCheck("scripts", "Configuración ES modules", scriptPackageExists);

// 7. VERIFICAR MIDDLEWARE Y RUTAS
console.log("\n🛡️ 7. MIDDLEWARE Y PROTECCIÓN:");
const middlewareExists = existsSync(join(process.cwd(), "..", "middleware.ts"));
addCheck("security", "Middleware configurado", middlewareExists);

const authLayoutExists = existsSync(join(process.cwd(), "..", "app/(auth)/layout.tsx"));
addCheck("security", "Layout de autenticación", authLayoutExists);

const dashboardLayoutExists = existsSync(join(process.cwd(), "..", "app/(dashboard)/layout.tsx"));
addCheck("security", "Layout de dashboard protegido", dashboardLayoutExists);

// RESUMEN FINAL
console.log("\n" + "=".repeat(60));
console.log("📊 RESUMEN DE VERIFICACIÓN");
console.log("=".repeat(60));

const categories = [...new Set(allChecks.map(c => c.category))];
let totalPassed = 0;
let totalChecks = 0;

for (const category of categories) {
  const categoryChecks = allChecks.filter(c => c.category === category);
  const passed = categoryChecks.filter(c => c.status).length;
  const total = categoryChecks.length;

  totalPassed += passed;
  totalChecks += total;

  const percentage = Math.round((passed / total) * 100);
  const status = percentage === 100 ? "✅" : percentage >= 80 ? "⚠️" : "❌";

  console.log(`${status} ${category.toUpperCase()}: ${passed}/${total} (${percentage}%)`);
}

const overallPercentage = Math.round((totalPassed / totalChecks) * 100);
console.log("\n" + "=".repeat(60));
console.log(`🎯 ESTADO GENERAL: ${totalPassed}/${totalChecks} (${overallPercentage}%)`);

if (overallPercentage === 100) {
  console.log("🎉 ¡PROYECTO COMPLETAMENTE FUNCIONAL!");
} else if (overallPercentage >= 90) {
  console.log("✅ Proyecto casi completo - Solo faltan detalles menores");
} else if (overallPercentage >= 70) {
  console.log("⚠️ Proyecto funcional - Requiere algunas correcciones");
} else {
  console.log("❌ Proyecto requiere atención - Varios problemas detectados");
}

// RECOMENDACIONES
console.log("\n📋 PRÓXIMOS PASOS RECOMENDADOS:");
const failedChecks = allChecks.filter(c => !c.status);

if (failedChecks.length === 0) {
  console.log("✅ ¡No hay problemas detectados!");
  console.log("🚀 Puedes ejecutar 'npm run dev' para iniciar la aplicación");
} else {
  console.log("\n❌ PROBLEMAS DETECTADOS:");
  failedChecks.forEach((check, index) => {
    console.log(`${index + 1}. ${check.category}/${check.name}`);
    if (check.message) {
      console.log(`   💡 ${check.message}`);
    }
  });

  console.log("\n🔧 ACCIONES SUGERIDAS:");
  if (failedChecks.some(c => c.category === 'environment')) {
    console.log("1. Configura las variables de entorno en .env.local");
  }
  if (failedChecks.some(c => c.category === 'supabase')) {
    console.log("2. Ejecuta 'node setup-database.js' para configurar la base de datos");
  }
  if (failedChecks.some(c => c.category === 'files')) {
    console.log("3. Revisa que todos los archivos críticos existan");
  }
}

console.log("\n" + "=".repeat(60));
console.log(`🕐 Verificación completada: ${new Date().toLocaleString()}`);
console.log("=".repeat(60));

// Exit code basado en el resultado
process.exit(overallPercentage >= 90 ? 0 : 1);
