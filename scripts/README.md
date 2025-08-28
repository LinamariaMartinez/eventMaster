# 📋 Scripts de Configuración y Diagnóstico

Este directorio contiene scripts de utilidad para configurar y diagnosticar el proyecto de Catalina Lezama Eventos.

## 🚀 Scripts Disponibles

### 1. `debug-supabase.js`
**Propósito**: Diagnosticar la configuración de Supabase y verificar conectividad.

```bash
cd scripts
node debug-supabase.js
```

**Qué hace:**
- ✅ Verifica variables de entorno de Supabase
- ✅ Prueba inicialización del cliente
- ✅ Verifica conexión de autenticación
- ✅ Prueba acceso a base de datos
- ✅ Valida configuración de Google Sheets API

**Salida esperada:**
```
🔍 Verificando configuración de Supabase...
✅ Cliente de Supabase inicializado correctamente
✅ Conexión de autenticación exitosa
✅ Conexión a base de datos exitosa
```

### 2. `setup-database.js`
**Propósito**: Configurar el schema de base de datos en Supabase.

```bash
cd scripts
node setup-database.js
```

**Qué hace:**
- 📄 Lee el archivo `supabase/schema.sql`
- 🔧 Ejecuta SQL statements usando service role key
- 📊 Verifica que las tablas se crearon correctamente
- 🔄 Fallback a instrucciones manuales si falla

**Requisitos:**
- Variables `NEXT_PUBLIC_SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY` configuradas
- Archivo `supabase/schema.sql` debe existir

### 3. `final-status.js`
**Propósito**: Mostrar reporte final del estado de configuración del proyecto.

```bash
cd scripts
node final-status.js
```

**Qué hace:**
- 📋 Estado de compilación del proyecto
- 🔐 Verificación de variables de entorno
- 🗄️ Estado de conexión Supabase
- 📋 Próximos pasos sugeridos
- 🔗 Enlaces importantes

## 🛠️ Configuración Técnica

### ES Modules
Los scripts utilizan ES modules (import/export) en lugar de CommonJS (require).

**Configuración**: `scripts/package.json`
```json
{
  "type": "module"
}
```

### Variables de Entorno Requeridas

#### Supabase (Obligatorias)
```bash
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
```

#### Google Sheets API (Opcionales)
```bash
GOOGLE_SHEETS_CLIENT_EMAIL=tu-email@tu-proyecto.iam.gserviceaccount.com
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
GOOGLE_SHEETS_PRIVATE_KEY_ID=key-id
GOOGLE_SHEETS_CLIENT_ID=client-id
```

#### Otros
```bash
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=tu-secret-key
```

## 🔧 Troubleshooting

### Error: Variables no configuradas
```bash
❌ Error inicializando cliente: Variables de entorno de Supabase no configuradas
```
**Solución**: Verificar que `.env.local` existe y contiene las variables requeridas.

### Error: Archivo schema no encontrado
```bash
❌ Archivo de schema no encontrado: /path/to/supabase/schema.sql
```
**Solución**: Crear el archivo `supabase/schema.sql` con el schema de base de datos.

### Error: Permisos de service role
```bash
❌ Error ejecutando SQL: insufficient_privilege
```
**Solución**: Verificar que `SUPABASE_SERVICE_ROLE_KEY` tiene permisos de administrador.

### Error: Conexión de red
```bash
❌ Error de conexión: fetch failed
```
**Solución**: Verificar conexión a internet y URL de Supabase.

## 📈 Flujo Recomendado

1. **Configurar variables de entorno**:
   ```bash
   cp .env.example .env.local
   # Editar .env.local con valores reales
   ```

2. **Verificar configuración**:
   ```bash
   cd scripts
   node debug-supabase.js
   ```

3. **Configurar base de datos**:
   ```bash
   node setup-database.js
   ```

4. **Verificar estado final**:
   ```bash
   node final-status.js
   ```

5. **Iniciar aplicación**:
   ```bash
   cd ..
   npm run dev
   ```

## 📚 Referencias

- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [Supabase Database Management](https://supabase.com/docs/guides/database)
- [Google Sheets API](https://developers.google.com/sheets/api)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)

## 🆘 Soporte

Si tienes problemas con los scripts:

1. Ejecuta `debug-supabase.js` para identificar el problema
2. Revisa los logs de error detallados
3. Verifica que todas las dependencias están instaladas: `npm install`
4. Consulta la documentación de Supabase para tu proyecto específico

---

**Última actualización**: Diciembre 2025
**Autor**: Sistema de configuración automatizada
