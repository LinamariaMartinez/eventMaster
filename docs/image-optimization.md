# Guía de Optimización de Imágenes

## 📊 Resumen de Optimización

### Resultados Obtenidos

**Imágenes Convertidas a WebP:**
- `elegant-classic-invitation-burgundy-cream.png` → `.webp`: **87.3% reducción** (1.7MB → 217KB)
- `romantic-vintage-invitation-floral-design.png` → `.webp`: **91.8% reducción** (1.4MB → 118KB)
- `festive-colorful-invitation-celebration.png` → `.webp`: **89.9% reducción** (1.4MB → 141KB)
- `diverse-user-avatars.png` → `.webp`: **93.1% reducción** (786KB → 54KB)
- `modern-minimalist-invitation-clean-design.png` → `.webp`: **96.9% reducción** (489KB → 15KB)

**Total ahorrado en imágenes de plantillas:** ~4.8MB → ~545KB (88% reducción)

**Imágenes JPG Optimizadas:**
- `decoracion.jpg`: 30% reducción (667KB → 467KB)
- Otras imágenes en `services/` y `hero/` ya estaban optimizadas

## 🛠️ Script de Optimización

El proyecto incluye un script automatizado para optimizar imágenes:

```bash
node scripts/optimize-images.cjs
```

### Qué hace el script:
1. Convierte PNGs grandes a formato WebP (mejor compresión)
2. Optimiza JPGs con calidad 85% y progressive loading
3. Mantiene los archivos originales intactos
4. Genera reportes de ahorro de espacio

## ✅ Mejores Prácticas Implementadas

### 1. Uso de Next.js Image Component

El proyecto usa correctamente el componente `Image` de Next.js en todos los componentes:

```tsx
import Image from "next/image";

// Ejemplo de uso correcto
<Image
  src="/imagen.webp"
  alt="Descripción"
  fill
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  quality={90}
  priority={esPrimeraImagen}
/>
```

**Beneficios:**
- Lazy loading automático
- Responsive images
- Optimización automática
- Prevención de Layout Shift

### 2. Formato WebP

Las imágenes de plantillas ahora usan WebP:
- Mejor compresión que PNG/JPG
- Soporte universal en navegadores modernos
- Reducción promedio del 90% en tamaño

### 3. Progressive JPEGs

Las imágenes JPG están optimizadas con:
- Calidad 85% (imperceptible visualmente)
- Progressive loading (carga incremental)

## 📁 Estructura de Imágenes

```
public/
├── hero/               # Imágenes de fondo (optimizadas JPG)
│   ├── hero-background.jpg
│   ├── hero-background2.jpg
│   ├── hero-background3.jpg
│   └── hero-background4.jpg
├── services/           # Fotos de servicios (optimizadas JPG)
│   ├── boda.jpg
│   ├── catering.jpg
│   ├── decoracion.jpg
│   └── ...
├── logo/              # Logos de la marca
│   └── catalina-logo.png
└── *.webp             # Plantillas de invitación (WebP)
```

## 🔄 Flujo de Trabajo para Nuevas Imágenes

### Al agregar nuevas imágenes:

1. **Coloca la imagen original en `public/`**

2. **Ejecuta el script de optimización:**
   ```bash
   node scripts/optimize-images.cjs
   ```

3. **Actualiza el código para usar WebP:**
   ```tsx
   // Antes
   thumbnail: "/nueva-imagen.png"

   // Después
   thumbnail: "/nueva-imagen.webp"
   ```

4. **Verifica el resultado:**
   - Las imágenes WebP deben estar junto a las originales
   - El código debe referenciar los archivos `.webp`

### Para imágenes grandes (>500KB):

1. Considera si la resolución es necesaria
2. Redimensiona antes de optimizar si es posible
3. Usa calidad 80-85% para balance tamaño/calidad

## 🚫 Archivos Ignorados en Git

El `.gitignore` está configurado para ignorar:

```gitignore
# image optimization
*.backup.png
*.backup.jpg
*.backup.jpeg
temp_*
*_original.*
public/**/*.bak
```

Esto previene que archivos temporales de optimización se suban al repositorio.

## 📈 Próximas Mejoras

### Recomendaciones futuras:

1. **CDN para Imágenes Grandes:**
   - Considerar Cloudinary o Supabase Storage
   - Para imágenes subidas por usuarios

2. **Responsive Image Sets:**
   - Generar múltiples tamaños (thumbnail, medium, large)
   - Mejor rendimiento en móviles

3. **AVIF Format:**
   - Formato más nuevo que WebP
   - Aún mejor compresión
   - Considerar cuando soporte sea más amplio

4. **Image CDN:**
   - Usar un CDN especializado para servir imágenes
   - Optimización y transformación on-the-fly

## 🎯 Métricas de Rendimiento

### Antes de la optimización:
- Carpeta `public/`: 8.1MB
- Plantillas PNG: ~5.4MB
- Tiempo de carga inicial: ~3-4s

### Después de la optimización:
- Carpeta `public/`: ~3.7MB (54% reducción)
- Plantillas WebP: ~545KB (90% reducción)
- Tiempo de carga estimado: ~1-1.5s

## 📚 Referencias

- [Next.js Image Optimization](https://nextjs.org/docs/basic-features/image-optimization)
- [WebP Format Guide](https://developers.google.com/speed/webp)
- [Sharp Documentation](https://sharp.pixelplumbing.com/)
- [Web Performance Best Practices](https://web.dev/fast/)

---

**Última actualización:** 2025-11-19
**Script:** `scripts/optimize-images.cjs`
