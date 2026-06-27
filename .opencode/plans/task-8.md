# Task 8 - Admin: Configuración + WhatsApp

## Goal
Pantalla de configuración global (delivery_price, alias). Mejorar integración WhatsApp con mensajes dinámicos.

## Dependencias
Requiere Task 5-7 (admin completo con CRUD).

## Estado actual
- AdminLayout con sidebar link a Configuración (/admin/configuracion)
- Tabla settings con keys: delivery_price, alias
- En OrderCard ya se abren wa.me links con mensajes básicos
- Dashboard de órdenes funcionando

## DB Schema
```sql
settings (id UUID PK, key TEXT UNIQUE, value TEXT)
```
Valores actuales: `delivery_price`, `alias`. RLS: lectura pública, solo authenticated INSERT/UPDATE.

## Qué crear

### 1. `src/app/admin/configuracion/page.tsx`
Página de configuración:

**Precio de delivery:**
- Input number
- Valor actual desde settings
- Guardar en settings (key: delivery_price)

**Alias de pago:**
- Input text
- Valor actual
- Guardar (key: alias)

**Vista previa de mensajes WhatsApp:**
- Mostrar cómo quedan los mensajes según la configuración actual:
  - "✅ Pedido aprobado por $[total]. Pagá al alias: [alias]. Por delivery: decime tu dirección."
  - "❌ Pedido rechazado: [motivo]"
  - "⚠️ Disponible: [items]. Total $[total]. ¿Te sirve?"

### 2. Mejorar mensajes WhatsApp en OrderCard
Los mensajes wa.me deben incluir dinámicamente:
- `delivery_price` para calcular total con delivery
- `alias` para que el cliente sepa dónde pagar

Mensaje de aprobación completo:
```
✅ Hola [nombre]! Tu pedido por $[total] fue aprobado.
Pagá al alias: [alias]
[dirección de la pastelería]
Si elegiste delivery, decime tu dirección para coordinar el envío.
```

### 3. `src/components/admin/SettingsForm.tsx`
Componente formulario:
- Props: settings (delivery_price, alias), onSave
- Validación: delivery_price >= 0, alias no vacío
- Botón Guardar

### 4. Compartir delivery_price en el dashboard
- En el dashboard de órdenes, si la orden tiene delivery=true, mostrar "+ delivery" en el total
- En el catálogo público, CartDrawer ya suma delivery_price si delivery=true

## Estructura de archivos
```
src/
  app/
    admin/
      configuracion/
        page.tsx            (CREAR)
  components/
    admin/
      SettingsForm.tsx      (CREAR)
```

## Verificación
- Cambiar delivery_price → se refleja en carrito público
- Cambiar alias → se refleja en mensajes WhatsApp
- Vista previa muestra mensajes correctos
- Build sin errores
