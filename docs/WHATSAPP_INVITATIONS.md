# 📱 Sistema de Invitaciones Personalizadas por WhatsApp

## Descripción General

Este sistema te permite enviar invitaciones personalizadas por WhatsApp a todos tus invitados de manera eficiente, con importación masiva desde CSV y mensajes completamente personalizables.

## 🚀 Características

- ✅ **Importación masiva desde CSV** - Carga todos tus invitados de una vez
- ✅ **Mensajes personalizados** - Usa variables dinámicas para cada invitado
- ✅ **Envío individual o masivo** - Decide cómo quieres enviar las invitaciones
- ✅ **Tracking de envíos** - Rastrea qué invitaciones ya fueron enviadas
- ✅ **Vista previa en tiempo real** - Ve cómo se verá el mensaje antes de enviar
- ✅ **Exportación a CSV** - Descarga todos los enlaces generados
- ✅ **Normalización automática de teléfonos** - Detecta y corrige formatos de números

## 📋 Guía de Uso

### Paso 1: Preparar tu archivo CSV

Crea un archivo CSV con las siguientes columnas (puedes descargar la plantilla desde la interfaz):

```csv
nombre,telefono,email,invitados,mensaje,restricciones
Juan Pérez,+573001234567,juan@example.com,2,Confirmo asistencia,Vegetariano
María García,3002345678,maria@example.com,1,,Sin gluten
Pedro López,+573003456789,,,
```

#### Columnas aceptadas:

| Columna | Alternativas | Requerido | Descripción |
|---------|-------------|-----------|-------------|
| `nombre` | `name` | ✅ Sí | Nombre completo del invitado |
| `telefono` | `phone`, `whatsapp` | ✅ Sí | Número de WhatsApp (con o sin +57) |
| `email` | `correo` | ❌ No | Correo electrónico |
| `invitados` | `guest_count`, `guests` | ❌ No | Número de personas (default: 1) |
| `mensaje` | `message` | ❌ No | Mensaje adicional del invitado |
| `restricciones` | `dietary_restrictions` | ❌ No | Restricciones alimentarias |

**Notas importantes:**
- Los teléfonos pueden estar con o sin código de país (+57)
- Si el número tiene 10 dígitos sin código, se agrega automáticamente +57
- Se limpian automáticamente espacios, guiones y paréntesis

### Paso 2: Importar Invitados

1. Ve a tu evento
2. Haz clic en "WhatsApp" en el menú del evento
3. En la pestaña "Importar", haz clic en "Importar CSV"
4. Arrastra tu archivo CSV o haz clic para seleccionarlo
5. Revisa la vista previa de los invitados
6. Haz clic en "Importar X Invitados"

El sistema te mostrará:
- ✅ Invitados válidos (con nombre y teléfono)
- ❌ Invitados con errores (falta nombre o teléfono)

Solo se importarán los invitados válidos.

### Paso 3: Personalizar el Mensaje

En la pestaña "Plantilla":

1. **Usa las variables disponibles:**
   - `{nombre}` - Nombre del invitado
   - `{evento}` - Nombre del evento
   - `{fecha}` - Fecha del evento
   - `{hora}` - Hora del evento
   - `{ubicacion}` - Lugar del evento
   - `{anfitrion}` - Nombre del anfitrión
   - `{url}` - URL única de la invitación

2. **Ejemplo de plantilla:**
   ```
   ¡Hola {nombre}! 👋

   Te invitamos a nuestro evento:

   🎉 *{evento}*
   📅 Fecha: {fecha}
   🕒 Hora: {hora}
   📍 Lugar: {ubicacion}

   Para ver todos los detalles y confirmar tu asistencia, visita:
   {url}

   ¡Esperamos verte allí!

   Saludos,
   {anfitrion}
   ```

3. **Vista previa en tiempo real** - Ve cómo se verá el mensaje con datos de ejemplo

4. **Copia el mensaje** para probarlo antes de enviar

### Paso 4: Enviar Invitaciones

En la pestaña "Enviar":

#### Opción A: Envío Individual

1. Busca el invitado en la lista
2. Haz clic en "Enviar" junto a su nombre
3. Se abrirá WhatsApp Web/App con el mensaje prellenado
4. Verifica el mensaje y presiona enviar en WhatsApp

#### Opción B: Envío Masivo

1. Haz clic en cada invitado uno por uno para enviar
2. El sistema marca automáticamente los mensajes enviados
3. Puedes filtrar por "Pendientes" para ver quién falta

#### Opción C: Exportar Enlaces

1. Haz clic en "Copiar Enlaces" para copiar todos los enlaces
2. O "Exportar CSV" para descargar un archivo con todos los datos
3. Comparte los enlaces por otros medios si lo prefieres

## 📊 Estadísticas y Tracking

El sistema rastrea automáticamente:

- ✅ **Total de invitados**
- ✅ **Enviados** - Invitaciones ya enviadas por WhatsApp
- ✅ **Pendientes** - Invitaciones que faltan por enviar
- ✅ **Con teléfono** - Invitados que tienen número registrado
- ✅ **Sin teléfono** - Invitados sin número (no se pueden enviar)

### Estados de Invitación

Cada invitado tiene un estado visual:
- 🟢 **Verde con ✓** - Invitación enviada
- 🟡 **Amarillo con ⏳** - Pendiente de enviar
- 🔴 **Rojo** - Sin número de teléfono

## 🔧 Componentes Técnicos

### 1. CSVImportDialog

Componente para importar invitados desde CSV.

```tsx
import { CSVImportDialog } from "@/components/dashboard/guests/csv-import-dialog";

<CSVImportDialog
  eventId={eventId}
  onImport={async (guests) => {
    // Manejar importación
  }}
/>
```

### 2. MessageTemplateEditor

Editor de plantillas de mensajes con variables dinámicas.

```tsx
import { MessageTemplateEditor } from "@/components/dashboard/whatsapp/message-template-editor";

<MessageTemplateEditor
  eventTitle="Mi Evento"
  eventDate="15 de diciembre de 2024"
  eventTime="19:00"
  eventLocation="Salón Principal"
  hostName="Catalina Lezama"
  onTemplateChange={(template) => setTemplate(template)}
/>
```

### 3. BulkWhatsAppSender

Componente para envío masivo de invitaciones.

```tsx
import { BulkWhatsAppSender } from "@/components/dashboard/whatsapp/bulk-whatsapp-sender";

<BulkWhatsAppSender
  guests={guests}
  eventTitle="Mi Evento"
  eventDate="15 de diciembre"
  eventTime="19:00"
  eventLocation="Salón"
  hostName="Catalina"
  invitationBaseUrl="https://invitacion.com/abc123"
  messageTemplate={template}
  onMarkAsSent={async (guestId) => {
    // Actualizar estado en BD
  }}
/>
```

### 4. GuestList (Mejorada)

Lista de invitados con botones de WhatsApp integrados.

```tsx
import { GuestList } from "@/components/dashboard/guests/guest-list";

<GuestList
  guests={guests}
  selectedGuests={selected}
  onSelectionChange={setSelected}
  onEdit={handleEdit}
  onDelete={handleDelete}
  onSendWhatsApp={handleSendWhatsApp}
  eventData={{
    title: "Mi Evento",
    date: "2024-12-15",
    time: "19:00",
    location: "Salón",
    hostName: "Catalina",
    invitationUrl: "https://invitacion.com/abc123"
  }}
  whatsappTemplate={template}
/>
```

## 🗄️ Estructura de Base de Datos

### Campos agregados a `guests`:

```sql
ALTER TABLE guests
ADD COLUMN whatsapp_sent BOOLEAN DEFAULT false,
ADD COLUMN whatsapp_sent_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN invitation_opened BOOLEAN DEFAULT false,
ADD COLUMN invitation_opened_at TIMESTAMP WITH TIME ZONE;
```

### Índices creados:

```sql
CREATE INDEX idx_guests_whatsapp_sent ON guests(whatsapp_sent);
CREATE INDEX idx_guests_invitation_opened ON guests(invitation_opened);
```

## 📈 Mejoras Futuras (Opcionales)

### Opción 2: Integración con WhatsApp Business API

Si en el futuro quieres envíos automáticos:

1. **WhatsApp Business API** - Envío programado automático
2. **Recordatorios automáticos** - Enviar recordatorio 1 día antes
3. **Seguimiento de lecturas** - Ver cuándo abren el mensaje
4. **Respuestas automatizadas** - Bot para confirmar asistencia
5. **Métricas avanzadas** - Tasa de apertura, respuesta, etc.

**Costos estimados:**
- ~$0.005-0.01 USD por mensaje enviado
- Requiere cuenta de WhatsApp Business verificada
- Requiere servidor para webhook de respuestas

## 🛠️ Solución de Problemas

### El mensaje no se abre en WhatsApp

- Verifica que el número tenga el formato correcto (+57XXXXXXXXXX)
- Asegúrate de tener WhatsApp instalado o usar WhatsApp Web
- Revisa que tu navegador permita abrir enlaces wa.me

### No se importan todos los invitados

- Revisa que todos tengan nombre y teléfono
- Verifica el formato del CSV (debe ser UTF-8)
- Descarga la plantilla y compara con tu archivo

### Los caracteres especiales se ven mal

- Asegúrate de guardar el CSV en formato UTF-8
- Usa comillas dobles para textos con comas: `"López, Juan"`

### El teléfono no tiene el formato correcto

El sistema normaliza automáticamente:
- `3001234567` → `+573001234567`
- `+57 300 123 4567` → `+573001234567`
- `(300) 123-4567` → `+573001234567`

## 📞 Soporte

Si tienes problemas o preguntas:
1. Revisa esta documentación
2. Verifica los logs de la consola del navegador
3. Contacta al equipo de desarrollo

---

**Desarrollado con ❤️ para Catalina Lezama Eventos**
