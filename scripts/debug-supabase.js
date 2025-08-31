#!/usr/bin/env node

import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { existsSync } from "fs";
import { join } from "path";

// Intentar cargar desde múltiples ubicaciones
const possibleEnvPaths = [
  ".env.local", // Desde scripts
  "../.env.local", // Desde raíz
  "../../.env.local", // Por si acaso
];

let envLoaded = false;
console.log("🔍 Buscando archivo .env.local...\n");

for (const path of possibleEnvPaths) {
  if (existsSync(path)) {
    console.log(`✅ Encontrado .env.local en: ${path}`);
    config({ path });
    envLoaded = true;
    break;
  } else {
    console.log(`❌ No encontrado en: ${path}`);
  }
}

if (!envLoaded) {
  console.log("❌ No se pudo encontrar .env.local en ninguna ubicación");
  console.log(
    "💡 Asegúrate de que el archivo existe en el directorio raíz del proyecto",
  );
  process.exit(1);
}

console.log("\n🔍 Verificando configuración de Supabase...\n");

// Verificar variables de entorno
console.log("📋 Variables de entorno:");
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log(
  "NEXT_PUBLIC_SUPABASE_URL:",
  supabaseUrl ? "✅ Configurada" : "❌ No encontrada",
);
console.log(
  "NEXT_PUBLIC_SUPABASE_ANON_KEY:",
  supabaseAnonKey ? "✅ Configurada" : "❌ No encontrada",
);
console.log(
  "SUPABASE_SERVICE_ROLE_KEY:",
  supabaseServiceKey ? "✅ Configurada" : "❌ No encontrada",
);

// Mostrar primeros caracteres para debug (sin exponer claves completas)
if (supabaseUrl) {
  console.log("URL Preview:", supabaseUrl.substring(0, 40) + "...");
}
if (supabaseAnonKey) {
  console.log("Anon Key Preview:", supabaseAnonKey.substring(0, 20) + "...");
}
if (supabaseServiceKey) {
  console.log(
    "Service Key Preview:",
    supabaseServiceKey.substring(0, 20) + "...",
  );
}

// Solo continuar si las variables están configuradas
if (!supabaseUrl || !supabaseAnonKey) {
  console.log("\n❌ Variables de Supabase faltantes. Verifica tu .env.local");
  process.exit(1);
}

// Intentar inicializar cliente
console.log("\n🔧 Intentando inicializar cliente de Supabase...");
try {
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  console.log("✅ Cliente de Supabase inicializado correctamente");

  // Probar conexión de autenticación
  console.log("\n🌐 Probando conexión...");

  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.log("⚠️  Error en getSession:", error.message);
    } else {
      console.log("✅ Conexión de autenticación exitosa");
      console.log(
        "Session data:",
        data.session ? "Usuario autenticado" : "No hay sesión activa",
      );
    }
  } catch (authError) {
    console.log("❌ Error de autenticación:", authError.message);
  }

  // Test de base de datos
  console.log("\n🗄️ Probando acceso a base de datos...");

  try {
    const { data, error } = await supabase
      .from("events")
      .select("count")
      .limit(1);
    if (error) {
      console.log("⚠️  Error consultando tabla events:", error.message);
      console.log("    Código:", error.code);
      console.log("    Detalles:", error.details);
      if (error.hint) console.log("    Sugerencia:", error.hint);
    } else {
      console.log("✅ Conexión a base de datos exitosa");
      console.log("    Tabla events accesible");
    }
  } catch (dbError) {
    console.log("❌ Error de base de datos:", dbError.message);
  }

  // Verificar otras tablas
  const tables = ["guests", "templates", "confirmations"];
  console.log("\n📊 Verificando otras tablas:");

  for (const table of tables) {
    try {
      const { error } = await supabase.from(table).select("count").limit(1);
      if (error) {
        console.log(`❌ Tabla ${table}: ${error.message}`);
      } else {
        console.log(`✅ Tabla ${table}: Disponible`);
      }
    } catch (err) {
      console.log(`❌ Tabla ${table}: Error de conexión`);
    }
  }
} catch (error) {
  console.log("❌ Error inicializando cliente:", error.message);
}

// Verificar otras variables
console.log("\n🔍 Otras variables de entorno:");
console.log(
  "NEXTAUTH_SECRET:",
  process.env.NEXTAUTH_SECRET ? "✅ Configurada" : "❌ No encontrada",
);
console.log("NEXTAUTH_URL:", process.env.NEXTAUTH_URL || "❌ No encontrada");

console.log("\n" + "=".repeat(50));
console.log("🎯 DIAGNÓSTICO COMPLETO FINALIZADO");
console.log("=".repeat(50));
