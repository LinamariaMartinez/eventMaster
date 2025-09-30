# 🔧 Arreglar Row Level Security (RLS) en Supabase

## El Problema

Si ves errores vacíos `{}` al intentar crear eventos, es muy probable que **Row Level Security (RLS)** esté bloqueando los inserts.

## ✅ Solución: Ejecuta estos comandos SQL en Supabase

### Paso 1: Ve al SQL Editor en Supabase

1. Abre tu proyecto: https://supabase.com/dashboard/project/owzbgrqwagombqvwyhyb
2. En el menú lateral, click en **"SQL Editor"**
3. Click en **"New query"**
4. Pega el siguiente SQL y click **"Run"**

---

## 📝 SQL para Arreglar RLS

```sql
-- ============================================
-- POLÍTICAS RLS PARA EVENTOS
-- ============================================

-- 1. Eliminar políticas existentes (si las hay)
DROP POLICY IF EXISTS "Users can view their own events" ON events;
DROP POLICY IF EXISTS "Users can create their own events" ON events;
DROP POLICY IF EXISTS "Users can update their own events" ON events;
DROP POLICY IF EXISTS "Users can delete their own events" ON events;

-- 2. Habilitar RLS en la tabla events (si no está habilitado)
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- 3. Crear políticas correctas

-- Política para SELECT (ver eventos)
CREATE POLICY "Users can view their own events"
ON events
FOR SELECT
USING (auth.uid() = user_id);

-- Política para INSERT (crear eventos)
CREATE POLICY "Users can create their own events"
ON events
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Política para UPDATE (actualizar eventos)
CREATE POLICY "Users can update their own events"
ON events
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Política para DELETE (eliminar eventos)
CREATE POLICY "Users can delete their own events"
ON events
FOR DELETE
USING (auth.uid() = user_id);

-- ============================================
-- POLÍTICAS RLS PARA INVITADOS (GUESTS)
-- ============================================

DROP POLICY IF EXISTS "Users can view guests from their events" ON guests;
DROP POLICY IF EXISTS "Users can create guests for their events" ON guests;
DROP POLICY IF EXISTS "Users can update guests from their events" ON guests;
DROP POLICY IF EXISTS "Users can delete guests from their events" ON guests;

ALTER TABLE guests ENABLE ROW LEVEL SECURITY;

-- Ver invitados de sus propios eventos
CREATE POLICY "Users can view guests from their events"
ON guests
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM events
    WHERE events.id = guests.event_id
    AND events.user_id = auth.uid()
  )
);

-- Crear invitados en sus propios eventos
CREATE POLICY "Users can create guests for their events"
ON guests
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM events
    WHERE events.id = guests.event_id
    AND events.user_id = auth.uid()
  )
);

-- Actualizar invitados de sus propios eventos
CREATE POLICY "Users can update guests from their events"
ON guests
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM events
    WHERE events.id = guests.event_id
    AND events.user_id = auth.uid()
  )
);

-- Eliminar invitados de sus propios eventos
CREATE POLICY "Users can delete guests from their events"
ON guests
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM events
    WHERE events.id = guests.event_id
    AND events.user_id = auth.uid()
  )
);

-- ============================================
-- POLÍTICAS PÚBLICAS PARA INVITACIONES
-- ============================================

-- Política para que CUALQUIERA pueda ver eventos por su ID (para invitaciones públicas)
CREATE POLICY "Anyone can view event details for invitations"
ON events
FOR SELECT
USING (true);

-- Política para que CUALQUIERA pueda crear confirmaciones
DROP POLICY IF EXISTS "Anyone can create confirmations" ON confirmations;
CREATE POLICY "Anyone can create confirmations"
ON confirmations
FOR INSERT
WITH CHECK (true);

-- ============================================
-- VERIFICAR QUE FUNCIONÓ
-- ============================================

-- Ejecuta esto para ver las políticas activas:
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

---

## ⚠️ IMPORTANTE: Después de ejecutar el SQL

1. **Cierra sesión** en la aplicación
2. **Vuelve a iniciar sesión**
3. **Intenta crear un evento** nuevamente

---

## 🔍 Cómo verificar que funcionó

Después de ejecutar el SQL, deberías ver en el resultado de la query de verificación algo como:

```
tablename | policyname
----------|------------------------------------------
events    | Users can view their own events
events    | Users can create their own events
events    | Users can update their own events
events    | Users can delete their own events
events    | Anyone can view event details for invitations
guests    | Users can view guests from their events
...
```

---

## 🎯 Si aún no funciona

Después de ejecutar esto, abre la consola del navegador (F12) y busca estos logs:

```
[use-supabase-events] Insert error details: { ... }
[use-supabase-events] Failed insert data was: { ... }
```

Copia TODO el output y me lo envías para ayudarte más.
