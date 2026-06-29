# Task 5 - Admin: Auth + Dashboard de Órdenes

## Goal
Panel admin protegido con Supabase Auth. Dashboard con lista de órdenes, cambio de estado y links a WhatsApp.

## Dependencias
Requiere Task 4 completa (carrito funcional, órdenes en DB).

## Estado actual
- Usuario admin creado en Supabase Auth (email/contraseña)
- Tabla `orders` con datos (si se hicieron pedidos de prueba)
- Componentes públicos funcionando

## Archivos existentes relevantes

### `src/lib/supabase/server.ts`
Server client con cookies (para proteger rutas admin).

### `src/lib/types.ts`
```ts
Order { id, customer_name, customer_phone, delivery, status, total, admin_message, created_at }
OrderItem { id, order_id, product_id, combo_id, item_name, item_price, quantity }
Setting { id, key, value }  // delivery_price, alias
```

### DB - orders RLS
Solo `authenticated` puede SELECT/UPDATE orders. INSERT público.

## Qué crear

### 1. `src/app/admin/login/page.tsx`
- Formulario email + contraseña
- Usar `createClient()` del browser
- `supabase.auth.signInWithPassword()`
- Redirigir a `/admin` en éxito
- Mostrar error si credenciales incorrectas
- Si ya hay sesión, redirigir a /admin

### 2. `src/app/admin/layout.tsx`
AdminLayout con:
- Verificar sesión al cargar (supabase.auth.getUser())
- Si no hay sesión, redirect a `/admin/login`
- Sidebar colapsable (mobile: hamburger menu):
  - 📊 Dashboard
  - 📦 Productos
  - 🏷️ Categorías
  - 🎯 Combos
  - ⚙️ Configuración
  - 🚪 Cerrar sesión
- Header con nombre del admin y botón cerrar sesión
- Main content area

### 3. `src/app/admin/page.tsx`
Dashboard de órdenes:
- Fetch de orders (ordenadas por created_at DESC)
- Fetch de settings (delivery_price, alias)
- Lista de órdenes con:
  - Nombre cliente, teléfono, total, estado (color-coded badge)
  - Badge "Delivery" si aplica
  - Fecha formateada
  - Botones: Ver detalle, Aprobar, Rechazar, Parcial

### 4. `src/app/admin/orders/[id]/page.tsx`
Detalle de orden:
- OrderItems de esa orden
- Resumen: nombre, teléfono, delivery, total
- Botones de acción (mismos que en dashboard)
- Historia de cambios

### 5. `src/components/admin/OrderCard.tsx`
Props: order (Order), settings (delivery_price, alias)
- Card con info resumida
- Badge de estado:
  - pendiente: yellow/amber
  - aprobado: green
  - rechazado: red
  - parcial: blue
- Botones de acción:
  - ✅ Aprobar → cambia status + wa.me link
  - ❌ Rechazar → modal con motivo → cambia status + wa.me
  - ⚠️ Parcial → modal con mensaje → cambia status + wa.me
- wa.me links pre-escritos según acción:
  - Aprobar: `wa.me/54[phone]?text=✅+Pedido+aprobado+por+$[total].+Pagá+al+alias:+[alias].+Si+elegiste+delivery,+decime+tu+dirección.`
  - Rechazar: `wa.me/54[phone]?text=❌+Pedido+rechazado:+[motivo]`
  - Parcial: `wa.me/54[phone]?text=⚠️+Disponemos+de+[items].+Total+$[total].+¿Te+sirve?`

### 6. `src/components/admin/OrderStatusModal.tsx`
Modal para:
- Rechazar: textarea para motivo
- Parcial: textarea para mensaje personalizado
- Botón confirmar → actualiza order.status en Supabase + abre wa.me

## Integración WhatsApp
Los links wa.me se abren en nueva pestaña. Formato:
```
wa.me/54[phone]?text=[mensaje-encoded]
```
- phone: del cliente (sin + ni espacios)
- mensaje: URL-encoded

## Middleware (opcional)
`src/middleware.ts` para proteger rutas /admin/*:
```ts
import { type NextRequest } from "next/server";
export async function middleware(req: NextRequest) {
  // Verificar session con supabase server client
  // Si no autenticado, redirect a /admin/login
}
export const config = { matcher: ["/admin/:path*"] };
```
O usar verificación directa en layout.tsx (más simple).

## Estructura de archivos
```
src/
  app/
    admin/
      layout.tsx              (CREAR)
      page.tsx                (CREAR - dashboard)
      login/
        page.tsx              (CREAR)
      orders/
        [id]/
          page.tsx            (CREAR)
  components/
    admin/
      OrderCard.tsx           (CREAR)
      OrderStatusModal.tsx    (CREAR)
```

## Verificación
- Login con credenciales de Supabase Auth funciona
- Sin sesión → redirect a /admin/login
- Dashboard lista órdenes con estados
- Click en Aprobar → cambia estado + abre wa.me
- Click en Rechazar → modal, escribe motivo, confirma → wa.me
- Click en Parcial → modal, escribe, confirma → wa.me
- Build sin errores
