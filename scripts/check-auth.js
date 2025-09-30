#!/usr/bin/env node

/**
 * Script de diagnóstico de autenticación
 *
 * Este script verifica:
 * 1. Variables de entorno de Supabase
 * 2. Conexión a Supabase
 * 3. Estado de la sesión actual
 *
 * Uso: node scripts/check-auth.js
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function checkAuth() {
  console.log("🔍 DIAGNÓSTICO DE AUTENTICACIÓN\n");
  console.log("=".repeat(60));

  // 1. Verificar variables de entorno
  console.log("\n1️⃣  VARIABLES DE ENTORNO");
  console.log("-".repeat(60));

  const envPath = path.join(__dirname, "..", ".env.local");
  let envContent = "";

  try {
    envContent = fs.readFileSync(envPath, "utf8");

    const supabaseUrl = envContent
      .match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/)?.[1]
      ?.trim();
    const supabaseAnonKey = envContent
      .match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.+)/)?.[1]
      ?.trim();

    console.log("✅ Archivo .env.local encontrado");
    console.log(
      `   NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl ? "✓ Configurado" : "✗ Falta"}`,
    );
    console.log(
      `   NEXT_PUBLIC_SUPABASE_ANON_KEY: ${supabaseAnonKey ? "✓ Configurado" : "✗ Falta"}`,
    );

    if (supabaseUrl) {
      console.log(`   URL: ${supabaseUrl}`);
    }

    if (!supabaseUrl || !supabaseAnonKey) {
      console.log("\n❌ ERROR: Faltan variables de entorno necesarias");
      process.exit(1);
    }
  } catch (error) {
    console.log("❌ No se pudo leer .env.local:", error.message);
    process.exit(1);
  }

  // 2. Verificar conexión a Supabase (requiere @supabase/supabase-js)
  console.log("\n2️⃣  VERIFICACIÓN DE CONEXIÓN A SUPABASE");
  console.log("-".repeat(60));

  try {
    // Cargar variables de entorno manualmente
    const lines = envContent.split("\n");
    lines.forEach((line) => {
      const match = line.match(/^([^=]+)=(.+)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim();
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    });

    const { createClient } = await import("@supabase/supabase-js");

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    console.log("✅ Cliente de Supabase creado correctamente");

    // Intentar obtener sesión
    const { data, error } = await supabase.auth.getSession();

    console.log("\n3️⃣  ESTADO DE LA SESIÓN");
    console.log("-".repeat(60));

    if (error) {
      console.log("❌ Error al obtener sesión:", error.message);
    } else if (data.session) {
      console.log("✅ Sesión activa encontrada");
      console.log(`   User ID: ${data.session.user.id}`);
      console.log(`   Email: ${data.session.user.email}`);

      // Validar UUID
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (uuidRegex.test(data.session.user.id)) {
        console.log("   ✅ UUID válido");
      } else {
        console.log("   ❌ UUID INVÁLIDO - Este es el problema!");
        console.log(
          `   El ID "${data.session.user.id}" no es un UUID real de Supabase`,
        );
      }
    } else {
      console.log("⚠️  NO HAY SESIÓN ACTIVA");
      console.log("   Esto significa que no has iniciado sesión.");
      console.log("\n📝 SOLUCIÓN:");
      console.log("   1. Inicia el servidor: npm run dev");
      console.log("   2. Ve a: http://localhost:3000/login");
      console.log("   3. Inicia sesión con credenciales REALES de Supabase");
      console.log("   4. Si no tienes cuenta, regístrate primero en /register");
    }

    console.log("\n" + "=".repeat(60));
    console.log("DIAGNÓSTICO COMPLETADO\n");
  } catch (error) {
    console.log("❌ Error al crear cliente de Supabase:", error.message);
    console.log(
      "\n💡 SUGERENCIA: Asegúrate de que las dependencias estén instaladas:",
    );
    console.log("   npm install");
  }
}

// Ejecutar la función principal
checkAuth().catch((error) => {
  console.error("❌ Error durante el diagnóstico:", error);
  process.exit(1);
});
