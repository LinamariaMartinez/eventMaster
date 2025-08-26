#!/usr/bin/env node

import { config } from "dotenv";
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { createClient } from "@supabase/supabase-js";

// Cargar variables de entorno
config({ path: ".env.local" });

console.log("🚀 Configurando base de datos de Supabase...\n");

async function setupDatabase() {
  try {
    // Inicializar cliente de Supabase con service role key
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error("Variables de entorno de Supabase no configuradas");
    }

    // Usar service role key para operaciones de admin
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    console.log("✅ Cliente administrativo de Supabase inicializado");

    // Leer el archivo de schema
    const schemaPath = join(process.cwd(), "supabase", "schema.sql");

    if (!existsSync(schemaPath)) {
      throw new Error(`Archivo de schema no encontrado: ${schemaPath}`);
    }

    console.log("📄 Leyendo schema SQL...");
    const schemaSql = readFileSync(schemaPath, "utf8");

    // Dividir el SQL en statements individuales
    const statements = schemaSql
      .split(";")
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt.length > 0);

    console.log(`📊 Ejecutando ${statements.length} statements SQL...`);

    // Ejecutar cada statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        console.log(`Ejecutando statement ${i + 1}/${statements.length}...`);

        const { error } = await supabase.rpc("exec_sql", {
          sql: statement + ";",
        });

        if (error) {
          console.log(`⚠️  Error en statement ${i + 1}:`, error.message);
          // Continuar con el siguiente statement (algunos errores son esperables)
        } else {
          console.log(`✅ Statement ${i + 1} ejecutado correctamente`);
        }
      }
    }

    console.log("\n🎉 Configuración de base de datos completada!");

    // Verificar que las tablas se crearon correctamente
    console.log("\n🔍 Verificando tablas creadas...");

    const tables = ["events", "guests", "templates", "confirmations"];

    for (const table of tables) {
      const { error } = await supabase.from(table).select("count").limit(1);

      if (error) {
        console.log(`❌ Tabla ${table}: ${error.message}`);
      } else {
        console.log(`✅ Tabla ${table}: Disponible`);
      }
    }
  } catch (error) {
    console.error("❌ Error configurando base de datos:", error.message);
    process.exit(1);
  }
}

// Función alternativa usando la API REST de Supabase
async function setupDatabaseRest() {
  try {
    console.log("🔧 Método alternativo: Usando API REST...");

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    // Leer el archivo de schema
    const schemaPath = join(process.cwd(), "supabase", "schema.sql");
    const schemaSql = readFileSync(schemaPath, "utf8");

    // Usar fetch para ejecutar SQL raw
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${serviceRoleKey}`,
        apikey: serviceRoleKey,
      },
      body: JSON.stringify({
        sql: schemaSql,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log("❌ Error ejecutando SQL:", errorText);

      // Intentar método manual
      console.log("\n📋 INSTRUCCIONES MANUALES:");
      console.log("1. Ve a tu dashboard de Supabase:");
      console.log(
        `   ${supabaseUrl.replace(
          "supabase.co",
          "supabase.com",
        )}/project/owzbgrqwagombqvwyhyb`,
      );
      console.log("2. Ve a SQL Editor");
      console.log("3. Ejecuta el contenido del archivo supabase/schema.sql");
      console.log("4. Luego ejecuta este script nuevamente para verificar");
    } else {
      console.log("✅ Schema ejecutado correctamente via API REST");
    }
  } catch (error) {
    console.error("❌ Error con API REST:", error.message);

    console.log(
      "\n📋 INSTRUCCIONES MANUALES PARA CONFIGURAR LA BASE DE DATOS:",
    );
    console.log("1. Ve a tu dashboard de Supabase:");
    console.log(
      "   https://supabase.com/dashboard/project/owzbgrqwagombqvwyhyb",
    );
    console.log('2. Ve a "SQL Editor" en el menú lateral');
    console.log("3. Copia y pega el contenido del archivo supabase/schema.sql");
    console.log('4. Haz clic en "Run" para ejecutar el script');
    console.log("5. Luego ejecuta: node scripts/debug-supabase.js");
  }
}

// Ejecutar setup
setupDatabase().catch(() => {
  console.log("\n🔄 Intentando método alternativo...");
  setupDatabaseRest();
});
