#!/usr/bin/env node

import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";

// Cargar variables de entorno desde .env.local
config({ path: ".env.local" });

// Script para debuggear la configuración de Supabase
console.log("🔍 Verificando configuración de Supabase...\n");

// Verificar variables de entorno
console.log("📋 Variables de entorno:");
console.log(
  "NEXT_PUBLIC_SUPABASE_URL:",
  process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Configurada" : "❌ No encontrada",
);
console.log(
  "NEXT_PUBLIC_SUPABASE_ANON_KEY:",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ? "✅ Configurada"
    : "❌ No encontrada",
);
console.log(
  "SUPABASE_SERVICE_ROLE_KEY:",
  process.env.SUPABASE_SERVICE_ROLE_KEY ? "✅ Configurada" : "❌ No encontrada",
);

console.log("\n📊 Detalles de configuración:");
if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
  console.log(
    "URL:",
    process.env.NEXT_PUBLIC_SUPABASE_URL.substring(0, 30) + "...",
  );
}
if (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.log(
    "Anon Key:",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 30) + "...",
  );
}

// Intentar inicializar cliente
console.log("\n🔧 Intentando inicializar cliente de Supabase...");
try {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Variables de entorno de Supabase no configuradas");
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  console.log("✅ Cliente de Supabase inicializado correctamente");

  // Probar conexión
  console.log("\n🌐 Probando conexión a Supabase...");

  // Test de conexión básica
  supabase.auth
    .getSession()
    .then(({ data, error }) => {
      if (error) {
        console.log("⚠️  Error en getSession:", error.message);
      } else {
        console.log("✅ Conexión de autenticación exitosa");
        console.log(
          "Session data:",
          data.session ? "Usuario autenticado" : "No hay sesión activa",
        );
      }
    })
    .catch((err) => {
      console.log("❌ Error de conexión:", err.message);
    });

  // Test de base de datos (intentar obtener tablas)
  supabase
    .from("events")
    .select("count")
    .limit(1)
    .then(({ error }) => {
      if (error) {
        console.log("⚠️  Error consultando tabla events:", error.message);
        console.log("    Código:", error.code);
        console.log("    Detalles:", error.details);
        console.log("    Sugerencia:", error.hint);
      } else {
        console.log("✅ Conexión a base de datos exitosa");
        console.log("    Tabla events accesible");
      }
    })
    .catch((err) => {
      console.log("❌ Error de base de datos:", err.message);
    });
} catch (error) {
  console.log("❌ Error inicializando cliente:", error.message);
}

console.log("\n🔍 Verificando otras variables de entorno relacionadas:");
console.log(
  "NEXTAUTH_SECRET:",
  process.env.NEXTAUTH_SECRET ? "✅ Configurada" : "❌ No encontrada",
);
console.log("NEXTAUTH_URL:", process.env.NEXTAUTH_URL || "❌ No encontrada");

// Verificar Google Sheets API
console.log("\n📊 Variables de Google Sheets API:");
console.log(
  "GOOGLE_SHEETS_CLIENT_EMAIL:",
  process.env.GOOGLE_SHEETS_CLIENT_EMAIL
    ? "✅ Configurada"
    : "❌ No encontrada",
);
console.log(
  "GOOGLE_SHEETS_PRIVATE_KEY:",
  process.env.GOOGLE_SHEETS_PRIVATE_KEY ? "✅ Configurada" : "❌ No encontrada",
);

console.log(
  "\n✅ Debug completado. Revisa los mensajes arriba para identificar problemas.",
);
