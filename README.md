# Catalina Lezama - Plataforma de Gestión de Eventos

**Eventos que Nadie Olvida** - Sistema completo de gestión de invitaciones digitales para la empresa de eventos Catalina Lezama.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## 🌟 Características Principales

### 🎯 Landing Page Corporativa
- Diseño elegante que refleja la personalidad de la marca
- Sección "Eventos que Nadie Olvida" con portfolio visual
- Integración con Instagram feed
- Call-to-action optimizados para conversión
- Acceso directo al sistema de gestión para el equipo

### 📱 Dashboard Administrativo
- **Panel de Control Completo**: Estadísticas en tiempo real, eventos próximos, actividad reciente
- **Gestión de Eventos**: Crear, editar, eliminar eventos con vista de calendario
- **Editor de Invitaciones**: 3 plantillas personalizables (Boda, Cumpleaños, Corporativo)
- **Gestión de Invitados**: Importación masiva CSV, seguimiento de confirmaciones
- **Estadísticas Avanzadas**: Métricas de asistencia, análisis de respuestas

### 🎨 Editor de Plantillas
- **Vista Previa en Tiempo Real**: Edición simultánea con preview responsive
- **Personalización Completa**: Colores, textos, elementos visuales
- **Plantillas Profesionales**: Diseños optimizados para diferentes tipos de eventos
- **Responsive Design**: Vista previa para desktop, tablet y móvil

### 👥 Gestión de Invitados
- **Importación Masiva**: Subida CSV con validación automática
- **Estados de Confirmación**: Pendiente, Confirmado, Declinado
- **Información Detallada**: Contacto, acompañantes, restricciones dietarias
- **Filtros Avanzados**: Búsqueda por nombre, estado, fecha
- **Exportación**: Descarga de listas para planificación

### 🌐 Invitaciones Públicas
- **URLs Únicas**: Link personalizado para cada evento
- **Diseño Responsive**: Optimizado para móviles y desktop
- **Formulario Inteligente**: Validación en tiempo real
- **Confirmación Instantánea**: Proceso de RSVP fluido
- **Integración WhatsApp**: Contacto directo con organizadores

### 📊 Integración Google Sheets
- **Sincronización Automática**: Confirmaciones en tiempo real
- **Hojas Compartidas**: Acceso del equipo con permisos configurables
- **Formato Profesional**: Colores, filtros y organización automática
- **Backup Automático**: Respaldo de datos en la nube

## 🚀 Inicio Rápido

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local

# Ejecutar en desarrollo
npm run dev
```

Para configuración completa, consulta [SETUP.md](./SETUP.md)

## 🏗️ Estructura del Proyecto
```
├── app/
│   ├── (auth)/              # Autenticación
│   ├── (dashboard)/         # Dashboard administrativo
│   ├── api/                 # API Routes
│   └── invite/              # Páginas públicas
├── components/              # Componentes React
├── lib/                     # Lógica de negocio
├── types/                   # Tipos TypeScript
└── supabase/               # Esquemas de base de datos
```

## 🎨 Paleta de Colores

- **Primario**: `#8B4B6B` (Burgundy elegante)
- **Secundario**: `#F5F1E8` (Crema suave)
- **Acento**: `#D4A574` (Dorado sutil)

## 🔐 Seguridad

- Row Level Security (RLS) en Supabase
- Autenticación JWT con middleware de protección
- Validación de datos con Zod
- Rate limiting en endpoints públicos

## 📊 Funcionalidades

### Para Administradores
1. **Dashboard**: Estadísticas y métricas en tiempo real
2. **Eventos**: Gestión completa del ciclo de vida
3. **Editor**: Diseño visual de invitaciones
4. **Invitados**: Importación masiva y seguimiento
5. **Reportes**: Exportación y análisis de datos

### Para Invitados
1. **Invitación**: Diseño personalizado y responsive
2. **RSVP**: Confirmación rápida y sencilla
3. **Contacto**: Integración directa con WhatsApp
4. **Responsive**: Optimizado para todos los dispositivos

## 🌟 Tecnologías

- **Next.js 14** - Framework React moderno
- **TypeScript** - Tipado estático robusto
- **Supabase** - Backend escalable con PostgreSQL
- **Tailwind CSS** - Diseño utility-first
- **Google Sheets API** - Sincronización automática
- **Radix UI** - Componentes accesibles

¡Convierte cada evento en una experiencia inolvidable! ✨
