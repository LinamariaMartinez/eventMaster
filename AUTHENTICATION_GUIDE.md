# Guía del Sistema de Autenticación - Catalina Lezama Eventos

Este documento describe el sistema de autenticación implementado en el proyecto EventMaster para Catalina Lezama Eventos Distinguidos.

## 🔐 Características Implementadas

### 1. Página de Login Funcional
- **Ruta**: `/login`
- **Componente**: `AuthForm` con wrapper `AuthFormWrapper`
- **Funcionalidad**: Formulario completo con validación y diseño acorde a la marca
- **Redirección**: Automática al dashboard tras login exitoso

### 2. Integración con Landing Page
- **Botón "Acceso Equipo"**: Redirige correctamente a `/login`
- **Navegación fluida**: Mantiene el diseño elegante de la marca

### 3. Sistema de Credenciales Demo
Para facilitar las demostraciones, se han implementado credenciales hardcodeadas:

```javascript
// Credenciales disponibles:
admin@catalinalezama.com / demo123     // Administrador
equipo@catalinalezama.com / equipo123  // Equipo
demo@demo.com / demo123               // Demo general
```

### 4. Protección de Rutas
- **Middleware**: Protege todas las rutas del dashboard
- **Redirección automática**: Los usuarios no autenticados son enviados a `/login`
- **Persistencia**: Mantiene la ruta de destino para redirección post-login

### 5. Logout Funcional
- **Ubicación**: Menú dropdown del avatar en el header del dashboard
- **Funcionalidad**: 
  - Limpia sesión de Supabase
  - Limpia datos demo de localStorage y cookies
  - Redirige al login con mensaje de confirmación

### 6. Persistencia de Sesión
- **Dual Storage**: Utiliza tanto localStorage como cookies
- **Compatibilidad**: Funciona tanto en cliente como en middleware del servidor
- **Expiración**: Sesiones demo duran 24 horas

## 🛠️ Arquitectura Técnica

### Archivos Principales

1. **`lib/auth.ts`**: Lógica principal de autenticación
   - Manejo de Supabase Auth
   - Sistema demo con localStorage/cookies
   - Funciones de login, logout, obtener usuario

2. **`middleware.ts`**: Protección de rutas
   - Verificación de sesiones demo y Supabase
   - Redirecciones automáticas
   - Manejo de cookies

3. **`components/auth/`**: Componentes de UI
   - `auth-form.tsx`: Formulario principal
   - `auth-form-wrapper.tsx`: Wrapper con loading state
   - `auth-provider.tsx`: Context provider (existente)

4. **`components/dashboard/header.tsx`**: Header con logout
   - Información dinámica del usuario
   - Botón de logout funcional
   - Estados de carga

### Estados de Usuario
El sistema maneja información dinámica del usuario:
- **Nombre**: Mostrado en el header
- **Email**: Visible en el dropdown
- **Iniciales**: Generadas automáticamente para el avatar
- **Rol**: Almacenado en metadata (admin, team, demo)

## 📱 Experiencia de Usuario

### Flujo de Login
1. Usuario hace clic en "Acceso Equipo" desde la landing page
2. Es dirigido a `/login` con formulario elegante
3. Introduce credenciales (demo o Supabase)
4. Si es válido, redirección automática al dashboard
5. Si no, mensaje de error específico

### Flujo de Logout
1. Usuario hace clic en avatar en header
2. Selecciona "Cerrar sesión"
3. Confirmación con toast message
4. Redirección automática a login

### Protección de Rutas
- Acceso a `/dashboard/*` sin autenticación → Redirección a `/login`
- Acceso a `/login` ya autenticado → Redirección a `/dashboard`
- Mantenimiento de URL destino para UX fluida

## 🔧 Funcionalidades Adicionales Implementadas

### 1. Sistema de Persistencia de Datos
- **Archivo**: `lib/storage.ts`
- **Funcionalidad**: LocalStorage para eventos, invitados y templates
- **Características**:
  - Manejo seguro de errores
  - Datos por defecto para demo
  - Funciones CRUD completas
  - Export/import de datos

### 2. Páginas de Error Personalizadas
- **`app/not-found.tsx`**: 404 general con diseño de marca
- **`app/(dashboard)/not-found.tsx`**: 404 específico para dashboard
- **Navegación**: Enlaces útiles y diseño consistente

### 3. Mejoras en Navegación
- **Botón "+Nuevo Evento"**: Funcional con redirección correcta
- **Enlaces corregidos**: Todas las rutas actualizadas
- **Estados de carga**: Skeletons y mensajes informativos

## 🎨 Diseño y Marca

El sistema mantiene la identidad visual de Catalina Lezama ED:
- **Colores**: Burgundy (#8B1538), Cream (#F5F5DC), Beige
- **Tipografía**: Playfair Display para títulos, Inter para texto
- **Estilo**: Elegante, sofisticado, acorde a eventos distinguidos

## 🚀 Uso en Desarrollo/Demo

### Para Desarrolladores
```bash
npm run dev         # Servidor de desarrollo
npm run build       # Build para producción
npm run lint        # Verificar código
```

### Para Demos
1. Usar credenciales hardcodeadas listadas arriba
2. Los datos se persisten en localStorage durante la sesión
3. Funcionalidad completa disponible sin base de datos

## 📝 Próximos Pasos Sugeridos

1. **Integrar con base de datos real** cuando esté lista la producción
2. **Implementar roles y permisos** más granulares
3. **Agregar recuperación de contraseña**
4. **Implementar 2FA** para mayor seguridad
5. **Audit logging** para acciones de administración

---

*Este sistema proporciona una base sólida para la autenticación en EventMaster, balanceando funcionalidad demo con preparación para producción.*