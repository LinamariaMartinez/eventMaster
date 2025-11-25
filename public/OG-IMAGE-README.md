# Open Graph Default Image

## Ubicación
`/public/og-default.jpg`

## Especificaciones
Para que las invitaciones se vean bien al compartirse en redes sociales, necesitas una imagen de fallback con estas características:

### Dimensiones Recomendadas
- **Tamaño**: 1200 x 630 píxeles (ratio 1.91:1)
- **Formato**: JPG o PNG
- **Peso**: Menor a 1MB para carga rápida

### Contenido Sugerido
- Logo de "Catalina Lezama Eventos"
- Texto: "Invitación a Evento Especial"
- Colores elegantes y profesionales
- Diseño limpio y legible

### Uso
Esta imagen se muestra cuando:
- Se comparte un link de invitación en redes sociales (Facebook, Twitter, WhatsApp, etc.)
- El evento no tiene una imagen de hero configurada

### Imagen Temporal
Actualmente se usa: `/elegant-classic-invitation-burgundy-cream.webp` como fallback.

### Herramientas para Crear
- Canva (templates de Open Graph)
- Figma (plantilla 1200x630px)
- Adobe Photoshop
- O usar @vercel/og para generación dinámica

### Ejemplo de Diseño
```
┌─────────────────────────────┐
│                             │
│  [LOGO]                     │
│                             │
│  Catalina Lezama Eventos    │
│  Invitación Especial        │
│                             │
│  [Gráfico decorativo]       │
│                             │
└─────────────────────────────┘
```

## Alternativa: Generación Dinámica
Si prefieres generar imágenes dinámicamente con el título del evento, considera usar `@vercel/og`:
https://vercel.com/docs/functions/edge-functions/og-image-generation
