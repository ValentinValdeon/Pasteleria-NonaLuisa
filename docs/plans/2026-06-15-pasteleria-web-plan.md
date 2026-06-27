# Pastelería Web - Plan de Implementación

## Goal
Crear una web mobile-first de pastelería/panadería con catálogo público, carrito y envío de pedidos por WhatsApp, más panel admin con CRUD de productos/categorías/combos y gestión de órdenes.

Deploy: Vercel (free)

## Tasks

- [ ] **Task 1: Scaffold Next.js + Supabase**
  - `npx create-next-app@latest` con TypeScript, Tailwind, App Router
  - `npm install @supabase/supabase-js @supabase/ssr`
  - Configurar cliente Supabase (server y browser)
  - Configurar variables de entorno
  - Verificar: `npm run dev` abre la app

- [ ] **Task 2: Esquema de base de datos en Supabase**
  - SQL: categories, products, combos, combo_items, orders, order_items, settings
  - RLS: admin CRUD, public read products/categories/combos, public insert orders
  - Bucket público `product-images` en Storage
  - Verificar: SQL ejecutado, tablas creadas

- [ ] **Task 3: Página principal - Hero + Catálogo + Combos**
  - Componente `Hero` (imagen fondo, CTA)
  - Sección combos destacados (scroll horizontal)
  - `ProductCard` (imagen, nombre, precio, disponible, botón agregar)
  - `CategoryFilter` (pills para filtrar)
  - Grid responsivo (2 cols mobile, 3-4 cols desktop)
  - SSR con fetch desde Supabase
  - Verificar: ver productos/combos en navegador

- [ ] **Task 4: Carrito + Envío de pedido**
  - `CartContext` (React + localStorage)
  - `CartButton` flotante con badge
  - `CartDrawer` (items, total, formulario)
  - `OrderForm` (nombre, teléfono, delivery)
  - Submit: guardar order + items en Supabase
  - Verificar: hacer pedido, ver en Supabase

- [ ] **Task 5: Admin - Auth + Dashboard de órdenes**
  - `/admin/login` con Supabase Auth
  - `AdminLayout` con sidebar
  - Protección de rutas (middleware)
  - Dashboard: lista de órdenes con estado
  - Acciones: wa.me links (aprobar/rechazar/parcial)
  - Verificar: login, ver órdenes, links WhatsApp

- [ ] **Task 6: Admin - CRUD Productos + Categorías**
  - `ProductForm` (nombre, descripción, precio, categoría, disponible, imagen)
  - `CategoryForm` (nombre, descripción, imagen)
  - Listados con editar/eliminar
  - Verificar: crear/editar/eliminar

- [ ] **Task 7: Admin - CRUD Combos**
  - `ComboForm` (nombre, descripción, precio, imagen, disponible, productos + cantidad)
  - Listado con editar/eliminar
  - Verificar: crear combo, verlo en catálogo

- [ ] **Task 8: Admin - Configuración + WhatsApp**
  - `SettingsForm` (delivery_price, alias)
  - Mensajes wa.me dinámicos según acción
  - Verificar: cambiar settings, probar links

- [ ] **Task 9: Responsive + Polish**
  - Revisar mobile-first global
  - Animaciones suaves
  - Imágenes: `<img loading="lazy">` con Supabase transformations
  - Verificar: mobile/tablet/desktop

## Done When
- [ ] Catálogo público carga productos, combos y categorías desde Supabase
- [ ] Cliente puede agregar al carrito, llenar formulario y enviar pedido
- [ ] Admin puede loguearse, ver órdenes y cambiar estados
- [ ] Admin puede CRUD productos, categorías y combos (con imágenes)
- [ ] Admin puede editar delivery price y alias
- [ ] Cada acción sobre orden abre wa.me con mensaje apropiado
- [ ] Todo funciona correctamente en mobile
