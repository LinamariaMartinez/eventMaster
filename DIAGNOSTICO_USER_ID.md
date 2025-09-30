# 🔍 Diagnóstico: Error user_id = '2'

## El Problema Identificado

Estás intentando crear un evento pero el sistema está recibiendo `user_id = '2'` en lugar de un UUID válido.

Un UUID válido se ve así: `a1b2c3d4-e5f6-7890-abcd-ef1234567890`
Lo que estás enviando: `'2'`

---

## 🎯 Código Revisado

### 1. **`hooks/use-supabase-events.ts` - Función `addEvent` (líneas 146-178)**

```typescript
const addEvent = useCallback(async (eventData: Omit<EventInsert, 'user_id' | 'public_url'>) => {
  try {
    console.log('[use-supabase-events] Starting addEvent...', { eventTitle: eventData.title });
    console.log('[use-supabase-events] Auth context:', {
      isAuthenticated,
      hasUser: !!user,
      userId: user?.id,          // ← ESTE ES EL PROBLEMA
      userEmail: user?.email,
      userObject: user
    });

    // Validación estricta de UUID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!user.id || typeof user.id !== 'string' || !uuidRegex.test(user.id)) {
      throw new Error(`Invalid user ID: "${user.id}". Expected UUID.`);
    }

    // Construye el objeto insertData
    const insertData: EventInsert = {
      id: eventId,
      user_id: user.id,  // ← AQUÍ SE INSERTA EL USER ID
      // ... resto de campos
    };
  }
});
```

**El código usa**: `user.id` que viene del hook `useAuth()`

### 2. **`hooks/use-auth.ts` - De dónde viene el user**

```typescript
export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);

  const refresh = useCallback(async () => {
    const currentUser = await getCurrentUser();  // ← Obtiene user de Supabase
    setUser(currentUser);
  }, []);

  return {
    user,  // ← Este es el user que se usa
    isAuthenticated: !!user
  };
}
```

### 3. **`lib/auth.ts` - getCurrentUser()**

```typescript
export const getCurrentUser = async (): Promise<AuthUser | null> => {
  const supabase = createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  // Valida que sea un UUID real
  if (user && !user.id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
    console.warn('[auth] Invalid user ID format, rejecting user:', user.id);
    clearDemoData();
    return null;
  }

  return user;
};
```

---

## 🚨 Causas Posibles

### **Causa #1: No estás realmente autenticado (MÁS PROBABLE)**
Si ves `user_id = '2'`, probablemente:
- No has hecho login real en Supabase
- Estás usando credenciales incorrectas
- Las variables de entorno están mal

### **Causa #2: Datos demo/fake residuales**
Puede haber datos de prueba en `localStorage` que están interfiriendo.

### **Causa #3: Problema con las variables de entorno**
Si `NEXT_PUBLIC_SUPABASE_URL` o `NEXT_PUBLIC_SUPABASE_ANON_KEY` están mal, Supabase no funciona.

---

## ✅ SOLUCIÓN PASO A PASO

### **Paso 0: Ejecuta el script de diagnóstico (NUEVO)**

Primero, ejecuta este script para verificar el estado de la autenticación:

```bash
node scripts/check-auth.js
```

Este script te dirá:
- ✅ Si las variables de entorno están configuradas
- ✅ Si Supabase está conectado
- ✅ Si tienes una sesión activa
- ✅ Si el user_id es un UUID válido

**Si el script dice "NO HAY SESIÓN ACTIVA"**, entonces el problema es que no estás autenticado.

**Si el script dice "UUID INVÁLIDO"**, entonces hay datos corruptos en la sesión.

---

### **Paso 1: Limpia el navegador completamente**

1. Abre las **DevTools** (F12)
2. Ve a la pestaña **"Application"** (o "Almacenamiento")
3. En el menú lateral:
   - Click derecho en **"Local Storage"** → **"Clear"**
   - Click derecho en **"Session Storage"** → **"Clear"**
   - Click derecho en **"Cookies"** → **"Clear"**
4. Cierra todas las pestañas de `localhost:3000`
5. **Reinicia el navegador completamente**

### **Paso 2: Verifica las variables de entorno**

Abre `.env.local` y asegúrate que tenga:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://owzbgrqwagombqvwyhyb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Si falta alguna → El problema es este.**

### **Paso 3: Reinicia el servidor**

```bash
# Mata el servidor actual
Ctrl+C

# Inicia de nuevo
npm run dev
```

### **Paso 4: Haz login REAL**

1. Ve a `http://localhost:3000/login`
2. **Usa un email/password REAL que hayas registrado en Supabase**
3. Si no tienes cuenta, regístrate primero en `/register`

### **Paso 5: Verifica la autenticación**

Abre la consola del navegador (F12) y busca estos logs:

```
[use-auth] Auth state changed: { event: "SIGNED_IN", hasSession: true, userId: "..." }
[use-supabase-events] Auth context: { userId: "...", userEmail: "..." }
```

**Si ves `userId: "2"` o `userId: null`** → No estás autenticado correctamente.

**Si ves un UUID largo** (como `"a1b2c3d4-e5f6-..."``) → Está bien ✓

### **Paso 6: Intenta crear el evento**

Después de hacer login real:
1. Ve a `/events/new`
2. Llena el formulario
3. Click "Crear Evento"

---

## 🔍 **Logs Mejorados**

Ahora el código imprimirá en la consola:

```javascript
[use-supabase-events] Auth context: {
  isAuthenticated: true/false,
  hasUser: true/false,
  userId: "...",  // ← VERIFICA ESTE VALOR
  userEmail: "...",
  userObject: { ... }  // ← TODO EL OBJETO USER
}
```

**Busca estos logs y cópiame el output completo** si el problema persiste.

---

## 🎯 **Si después de todo esto sigue fallando**

Ejecuta esto en la consola del navegador (F12 → Console):

```javascript
// Verifica el localStorage
console.log('LocalStorage:', localStorage);

// Verifica las cookies de Supabase
console.log('Cookies:', document.cookie);

// Verifica si Supabase está configurado
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
```

Cópiame TODO el output de esos comandos.

---

## 📊 **Checklist de Verificación**

- [ ] Limpiaste localStorage/cookies/sessionStorage
- [ ] Reiniciaste el navegador
- [ ] Verificaste las variables en `.env.local`
- [ ] Reiniciaste el servidor de desarrollo (`npm run dev`)
- [ ] Hiciste login con credenciales REALES de Supabase
- [ ] Verificaste los logs en la consola del navegador
- [ ] El `userId` en los logs es un UUID válido (no "2" ni null)
- [ ] Intentaste crear un evento después de login real

---

## 🔧 **Siguiente Paso**

Después de hacer todo esto, **cópiame los logs completos de la consola** que empiecen con:
- `[use-auth]`
- `[use-supabase-events]`
- `[auth]`

Especialmente necesito ver el log:
```
[use-supabase-events] Auth context: { ... }
```

Eso me dirá exactamente qué está pasando.
