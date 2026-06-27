# Diseño Web - Pastelería/Panadería

## Tech Stack
- **Frontend/Backend:** Next.js 14 (App Router) + TypeScript
- **Estilos:** Tailwind CSS
- **Backend/Database:** Supabase (PostgreSQL, Auth, Storage)
- **Deploy:** Vercel (free tier)
- **Notificaciones:** WhatsApp via wa.me links
- **Imágenes:** Supabase Storage Transformations (`<img loading="lazy">` con `?width=&quality=` params)

## Modelo de Datos

### categories
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | uuid PK | |
| name | text | Nombre |
| description | text | Descripción opcional |
| image_url | text | Imagen opcional |
| created_at | timestamptz | |

### products
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | uuid PK | |
| name | text | Nombre |
| description | text | Descripción |
| price | decimal | Precio |
| image_url | text | Imagen opcional (Supabase Storage) |
| category_id | uuid FK→categories | Categoría |
| available | boolean | Disponible sí/no |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### combos
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | uuid PK | |
| name | text | Nombre |
| description | text | Descripción |
| price | decimal | Precio |
| image_url | text | Imagen opcional |
| available | boolean | Disponible sí/no |
| created_at | timestamptz | |

### combo_items
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | uuid PK | |
| combo_id | uuid FK→combos | Combo |
| product_id | uuid FK→products | Producto incluido |
| quantity | integer | Cantidad |

### orders
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | uuid PK | |
| customer_name | text | Nombre del cliente |
| customer_phone | text | Teléfono del cliente |
| delivery | boolean | ¿Solicitó delivery? |
| status | text | pendiente / aprobado / rechazado / parcial |
| total | decimal | Total del pedido |
| admin_message | text nullable | Mensaje del admin (motivo rechazo/parcial) |
| created_at | timestamptz | |

### order_items
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | uuid PK | |
| order_id | uuid FK→orders | Orden |
| product_id | uuid FK→products nullable | Producto |
| combo_id | uuid FK→combos nullable | Combo |
| item_name | text | Nombre al momento de la compra (snapshot) |
| item_price | decimal | Precio al momento de la compra (snapshot) |
| quantity | integer | Cantidad |

### settings
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | uuid PK | |
| key | text unique | Clave (delivery_price, alias) |
| value | text | Valor |

## Rutas

### Públicas
- `/` — Hero + Catálogo + Combos + Carrito flotante

### Admin (protegidas con Supabase Auth)
- `/admin/login` — Login
- `/admin` — Dashboard de órdenes
- `/admin/productos` — CRUD productos
- `/admin/categorias` — CRUD categorías
- `/admin/combos` — CRUD combos
- `/admin/configuracion` — Delivery price + Alias

## Componentes Principales

### Públicos
- `PublicLayout` — Header con nav, footer
- `Hero` — Imagen de fondo, título, CTA
- `ProductCard` — Imagen, nombre, precio, badge disponible, botón agregar
- `ComboCard` — Similar a ProductCard pero destacada
- `CategoryFilter` — Pills/tabs para filtrar por categoría
- `CartDrawer` — Drawer lateral con items del carrito
- `CartButton` — Botón flotante con contador
- `OrderForm` — Formulario: nombre, teléfono, toggle delivery

### Admin
- `AdminLayout` — Sidebar + header
- `ProductForm` — Crear/editar producto (con subida de imagen)
- `CategoryForm` — Crear/editar categoría
- `ComboForm` — Crear/editar combo (selector de productos)
- `OrderCard` — Resumen de orden con acciones (aprobar/rechazar/parcial)
- `OrderDetailModal` — Detalle completo de la orden
- `SettingsForm` — Editar delivery price + alias

## Flujo de la App

1. Cliente navega el catálogo → agrega productos al carrito (estado React + localStorage)
2. Cliente abre carrito → completa formulario (nombre, teléfono, delivery) → envía
3. Pedido se guarda en Supabase como `pendiente`
4. Admin ve pedido en Dashboard → puede:
   - **Aprobar** → wa.me link: "✅ Pedido aprobado por $[total]. Pagá al alias: [alias]. Por delivery: decime tu dirección."
   - **Rechazar** → wa.me link: "❌ Pedido rechazado: [motivo]"
   - **Parcial** → wa.me link: "⚠️ Disponible: [items]. Total: $[total]. ¿Te sirve?"
5. Conversación continúa manualmente por WhatsApp.

## Decisiones Técnicas
- Carrito en localStorage para persistencia
- Imágenes en Supabase Storage con transformaciones (?width=&quality=)
- Admin protegido con Supabase Auth (email/contraseña)
- SSR en página principal para SEO (catálogo)
- Mobile-first con Tailwind CSS
- Sin autenticación de clientes (solo nombre + teléfono)
- Deploy en Vercel (serverless functions, edge-ready)
