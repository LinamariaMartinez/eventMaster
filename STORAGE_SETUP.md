# Configuración de Supabase Storage

## Crear el bucket de imágenes

Para habilitar la funcionalidad de galería de fotos e imágenes de fondo en los heroes, necesitas crear un bucket en Supabase Storage.

### Opción 1: Usando la migración SQL (Recomendado)

Ejecuta el siguiente SQL en tu proyecto de Supabase:

```bash
# Desde la raíz del proyecto
supabase db push
```

O manualmente en el SQL Editor de Supabase:

```sql
-- El archivo está en: supabase/migrations/create_event_images_bucket.sql
```

### Opción 2: Manualmente desde la UI de Supabase

1. Ve a tu proyecto en Supabase Dashboard
2. Navega a **Storage** en el menú lateral
3. Haz clic en **New bucket**
4. Configura el bucket:
   - **Name**: `event-images`
   - **Public bucket**: ✅ Activado
   - **File size limit**: 5 MB
   - **Allowed MIME types**: image/jpeg, image/jpg, image/png, image/webp, image/gif

5. Ve a **Policies** y crea las siguientes políticas:

#### Política 1: Upload (INSERT)
- **Name**: "Users can upload images to their events"
- **Allowed operation**: INSERT
- **Target roles**: authenticated
- **Policy definition**:
```sql
bucket_id = 'event-images' AND
(storage.foldername(name))[1] IN (
  SELECT id::text FROM events WHERE user_id = auth.uid()
)
```

#### Política 2: Update
- **Name**: "Users can update their event images"
- **Allowed operation**: UPDATE
- **Target roles**: authenticated
- **Policy definition**:
```sql
bucket_id = 'event-images' AND
(storage.foldername(name))[1] IN (
  SELECT id::text FROM events WHERE user_id = auth.uid()
)
```

#### Política 3: Delete
- **Name**: "Users can delete their event images"
- **Allowed operation**: DELETE
- **Target roles**: authenticated
- **Policy definition**:
```sql
bucket_id = 'event-images' AND
(storage.foldername(name))[1] IN (
  SELECT id::text FROM events WHERE user_id = auth.uid()
)
```

#### Política 4: Select (público)
- **Name**: "Anyone can view event images"
- **Allowed operation**: SELECT
- **Target roles**: public
- **Policy definition**:
```sql
bucket_id = 'event-images'
```

## Verificación

Una vez configurado, las imágenes se organizarán así:

```
event-images/
├── {event-id-1}/
│   ├── 1234567890.jpg
│   └── 1234567891.png
├── {event-id-2}/
│   └── 1234567892.webp
```

Esto garantiza que:
- Cada evento tiene su propia carpeta
- Los usuarios solo pueden subir imágenes a eventos que crearon
- Las imágenes son públicamente visibles para las invitaciones
- Límite de 5MB por imagen
