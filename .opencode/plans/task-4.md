# Task 4 - Carrito + Envío de Pedido

## Goal
Implementar carrito funcional con persistencia en localStorage, drawer flotante con resumen del pedido, y formulario de envío de orden. Al enviar, guardar en Supabase order + order_items.

## Dependencias
Requiere Task 3 completa (componentes Hero, ComboCard, ProductCard, CategoryFilter, Header, Footer ya creados).

## Estado actual
- ProductCard y ComboCard tienen botón "Agregar" (placeholder sin funcionalidad)
- Page principal con SSR de productos, combos, categorías
- CartItem type ya existe en `src/lib/types.ts`

## Archivos existentes relevantes

### `src/lib/types.ts`
```ts
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image_url: string | null;
  type: "product" | "combo";
}
```

### `src/lib/supabase/client.ts`
Browser Supabase client (para insertar órdenes desde el cliente).

### DB Schema - orders
```sql
orders (
  id UUID PK, customer_name TEXT, customer_phone TEXT,
  delivery BOOLEAN, status TEXT DEFAULT 'pendiente',
  total DECIMAL, admin_message TEXT nullable, created_at TIMESTAMPTZ
)
order_items (
  id UUID PK, order_id UUID FK, product_id UUID FK nullable,
  combo_id UUID FK nullable, item_name TEXT, item_price DECIMAL, quantity INTEGER
)
```
RLS: INSERT público permitido en ambas tablas.

## Qué crear

### 1. `src/context/CartContext.tsx`
Provider con estado de carrito:

```ts
interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string, type: "product" | "combo") => void;
  updateQuantity: (id: string, type: "product" | "combo", quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}
```

- Persistencia en localStorage
- Si item ya existe, incrementar quantity
- addItem: recibe producto o combo y lo agrega (o suma 1 si ya existe)
- removeItem: elimina por id+type
- updateQuantity: si quantity<=0, removeItem

### 2. `src/components/CartButton.tsx`
Botón flotante fijo abajo-derecha:
- Círculo con bg-[var(--primary)], texto blanco
- Icono de carrito (SVG inline)
- Badge con totalItems (rojo si hay items)
- `onClick` abre CartDrawer
- `z-50`, `fixed bottom-6 right-6`

### 3. `src/components/CartDrawer.tsx`
Drawer lateral que se desliza desde la derecha:
- Overlay oscuro (click cierra)
- Header: "Tu Pedido" + botón cerrar (X)
- Lista de items: nombre, precio, selector cantidad (+/-), botón eliminar
- Subtotal por item y total general
- Si delivery: mostrar precio delivery desde settings y sumar al total
- Separador visual

### 4. `src/components/OrderForm.tsx`
Formulario dentro del CartDrawer (o debajo de la lista):
- Campo: Nombre (required)
- Campo: Teléfono (required, input type tel)
- Toggle: "¿Enviar a domicilio?" (switch)
- Botón grande: "Enviar Pedido por WhatsApp"
- Al submit:
  1. Validar campos
  2. Insertar en Supabase: `orders` + `order_items`
  3. Mostrar mensaje de éxito
  4. Abrir wa.me con mensaje de confirmación al cliente (opcional)
  5. Vaciar carrito

### 5. Integrar en `src/app/page.tsx`
- Envolver con CartProvider
- Agregar CartButton + CartDrawer
- En ProductCard y ComboCard, conectar botón "Agregar" a `addItem` del contexto
- Hacer fetch de settings (delivery_price) desde page.tsx server y pasarlo al CartDrawer

### 6. `src/components/QuantitySelector.tsx`
Componente reutilizable +/-:
- Botón "-", número, botón "+"
- Mínimo 1
- Props: value, onChange

## Flujo de envío

```
Usuario hace click en "Enviar Pedido"
→ Validar nombre y teléfono
→ Insert en orders (status: pendiente, total: calculado)
→ Insert en order_items (cada item con snapshot de nombre y precio)
→ Mostrar toast "Pedido enviado con éxito"
→ Vaciar carrito
→ Abrir wa.me (opcional, solo notificación al cliente)
```

## Estructura de archivos a crear/modificar
```
src/
  context/
    CartContext.tsx  (CREAR)
  components/
    CartButton.tsx   (CREAR)
    CartDrawer.tsx   (CREAR)
    OrderForm.tsx    (CREAR)
    QuantitySelector.tsx (CREAR)
    ProductCard.tsx  (MODIFICAR - conectar botón)
    ComboCard.tsx    (MODIFICAR - conectar botón)
  app/
    page.tsx         (MODIFICAR - integrar providers y drawer)
```

## Notas
- No usar next/image, siempre `<img loading="lazy">` con Supabase transformations
- Precios: formatear con `formatPrice(n)` = `$ n.toLocaleString('es-AR')`
- Para el toggle delivery, guardar estado en el OrderForm
- El delivery_price se pasa como prop desde page.tsx (server component)

## Verificación
- Agregar productos al carrito desde las cards
- Ver badge actualizarse en CartButton
- Abrir drawer, ver items, modificar cantidades
- Enviar pedido (requiere Supabase configurado)
- Ver la orden creada en Supabase (tabla orders)
- Build sin errores
