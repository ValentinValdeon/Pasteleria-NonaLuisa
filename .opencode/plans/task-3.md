# Task 3 - Página Principal: Hero + Catálogo + Combos

## Goal
Construir la landing page pública con Hero, sección de combos destacados, filtro por categorías y grid de productos. Mobile-first.

## Estado actual del proyecto
- Next.js 16.2.9 con App Router, TypeScript, Tailwind v4
- Supabase conectado (cliente browser + server)
- DB con datos de seed (productos, categorías, combos)
- Deploy en Vercel (variables de entorno configuradas)

## Archivos existentes relevantes

### `src/lib/types.ts`
Interfaces: `Category`, `Product`, `Combo`, `CartItem`

### `src/lib/supabase/server.ts`
```ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );
}
```

### `src/lib/supabase/client.ts`
```ts
import { createBrowserClient } from "@supabase/ssr";
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

### `next.config.ts`
```ts
import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "*.supabase.co" }],
  },
};
export default nextConfig;
```

### `globals.css`
Tema pastelero: `--background: #fdf8f6`, `--foreground: #3d2c2a`, `--primary: #c68642`, `--primary-light: #e8c49a`, `--accent: #8b5e3c`

### `layout.tsx`
Fuentes: Geist (sans) + Playfair Display (títulos). `lang="es"`. Clases: `h-full`, body `min-h-full flex flex-col`.

### `page.tsx` actual (placeholder, REEMPLAZAR)
```tsx
export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="p-4 flex items-center justify-between">
        <h1 className="text-xl font-bold font-[family-name:var(--font-playfair)] text-[var(--primary)]">Pastelería</h1>
      </header>
      <main className="flex-1">
        <section className="flex flex-col items-center justify-center px-4 py-20 text-center">
          ...
        </section>
      </main>
      <footer className="p-4 text-center text-sm text-[var(--accent)]">
        © 2026 Pastelería - Todos los derechos reservados
      </footer>
    </div>
  );
}
```

## DB Schema (lectura pública)

### `categories`
id UUID, name TEXT, description TEXT, image_url TEXT, created_at

### `products`
id UUID, name TEXT, description TEXT, price DECIMAL, image_url TEXT, category_id UUID FK, available BOOLEAN, created_at, updated_at

### `combos`
id UUID, name TEXT, description TEXT, price DECIMAL, image_url TEXT, available BOOLEAN, created_at

### `combo_items`
id UUID, combo_id UUID FK, product_id UUID FK, quantity INTEGER

## Qué crear

### 1. `src/app/page.tsx` (REEMPLAZAR)
Server Component. Fetch de: products (available=true) con category join, combos (available=true), categories, settings (delivery_price). SSR.

Estructura:
```
<Header> → Logo, nav links
<Hero /> → Imagen fondo, título, subtítulo, CTA #productos
<section id="combos"> → Título "Combos Destacados", scroll horizontal de <ComboCard />
<section id="categorias"> → <CategoryFilter /> pills
<section id="productos"> → Grid responsivo de <ProductCard />
<Footer>
```

### 2. `src/components/Hero.tsx`
- Imagen de fondo (placeholder o de Supabase según tengas)
- Overlay oscuro suave
- Título "Delicias Artesanales" (Playfair)
- Subtítulo "Productos horneados con amor, todos los días"
- Botón CTA "Ver Productos" → scroll a `#productos`
- Altura: `min-h-[60vh]` mobile, `min-h-[80vh]` desktop

### 3. `src/components/ComboCard.tsx`
Props: name, description, price, image_url
- Card destacada (borde o fondo distinto)
- Imagen (con transform Supabase: `?width=300&quality=60`)
- Nombre, precio
- Botón "Agregar al carrito" (solo UI x ahora, sin funcionalidad)
- Ancho fijo para scroll horizontal: `w-64 shrink-0`

### 4. `src/components/ProductCard.tsx`
Props: product (Product)
- Imagen con transform (`?width=300&quality=60`), fallback si no hay imagen
- Badge "No disponible" si `available=false`
- Nombre, precio formateado ($ X.XXX)
- Botón "Agregar" (solo UI por ahora)

### 5. `src/components/CategoryFilter.tsx`
Props: categories (Category[]), activeCategory (string|null), onSelect (id: string|null => void)
- Pills horizontales scrollables
- "Todas" + cada categoría
- Active: bg-[var(--primary)] text-white
- Inactive: bg-white border

### 6. `src/components/Header.tsx`
- Logo "Pastelería" (Playfair, color primary)
- Nav links: Inicio, Productos, (luego se agrega Carrito)

### 7. `src/components/Footer.tsx`
- Texto copyright
- Links: Instagram, WhatsApp (placeholder)

## Detalles técnicos

### Imágenes con Supabase Storage Transformations
URL base: `https://<project>.supabase.co/storage/v1/object/public/product-images/`
Siempre usar: `?width=400&quality=60` para cards, `?width=800&quality=80` para hero.
Usar `<img loading="lazy">` (NO next/image para evitar límite de Vercel free).

### Formateo de precios
Función `formatPrice(price: number): string` → "$ 3.200"

### Grid productos
- Mobile: 2 columnas
- Tablet: 3 columnas  
- Desktop: 4 columnas
- Gap: 4 (gap-4)

### Scroll horizontal combos
Contenedor con `overflow-x-auto snap-x snap-mandatory`, cada card `snap-start`

### Filtro por categoría
Estado local `activeCategory` en page.tsx (cliente component para el filtro, o usar useSearchParams). Si es server component, crear wrapper con "use client". Enfoque: page.tsx server + ProductGrid client component.

## Estructura de archivos a crear
```
src/
  components/
    Header.tsx
    Hero.tsx
    ComboCard.tsx
    ProductCard.tsx
    CategoryFilter.tsx
    Footer.tsx
    ProductGrid.tsx (opcional, si separamos lógica de filtro cliente)
```

## Verificación
- `npm run build` compila sin errores
- La landing page muestra Hero, combos, categorías y productos
- Los filtros de categoría funcionan
- Las cards tienen el diseño correcto en mobile y desktop
- Los datos vienen de Supabase (no mock)
