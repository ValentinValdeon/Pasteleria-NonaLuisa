# Pastelería Web - Responsive Design Standards

## Filosofía
Mobile-first. Todo componente se diseña primero para mobile (320px+), luego se mejora para tablet y desktop.

## Breakpoints (Tailwind)
| Alias | px | Dispositivo |
|-------|-----|-------------|
| `sm` | 640px | Tablets pequeñas |
| `md` | 768px | Tablets |
| `lg` | 1024px | Laptops |
| `xl` | 1280px | Desktop |
| `2xl` | 1536px | Desktop grande |

**Regla:** Nunca usar breakpoints arbitrarios. Si necesitás uno distinto, documentarlo aquí con justificación.

## Viewport
```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
```
Ya configurado por Next.js.

## Layout Grid

### Productos (ProductGrid)
```tsx
grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5
```

### Combos (ComboCard)
```tsx
flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4
```
Ancho de cards: fluido. NO usar `w-64` fijo. Usar `w-[55vw] sm:w-64 max-w-[280px]`.

## Overflow

### Regla de oro
**NO** poner `overflow-x: hidden` en `<html>` ni `<body>`. Hace que scroll containers internos dejen de funcionar en algunos navegadores.

### Control de overflow por componente
- Scroll horizontal: solo en contenedores con `overflow-x-auto`
- Cada contenedor scrollable debe tener `max-w-full` para no exceder su padre
- Si aparece una franja blanca horizontal, buscar el elemento culpable con DevTools (inspeccionar, hover sobre elementos hasta encontrar el que excede 100vw)

### Causas comunes de overflow
- `w-64` (o cualquier fixed width) dentro de contenedor estrecho
- Padding + gap mal calculados
- `-mx-4` sin contenedor que lo limite
- `flex-wrap: nowrap` sin `overflow-x: auto`
- SVG o imagen con width intrínseco mayor al contenedor

## Tipografía
| Elemento | Mobile | Desktop | Font |
|----------|--------|---------|------|
| Hero h1 | `text-3xl` (30px) | `md:text-6xl` (60px) | Playfair |
| Hero p | `text-base` (16px) | `md:text-xl` (20px) | Geist |
| Section h2 | `text-2xl` (24px) | `md:text-3xl` (30px) | Playfair |
| Producto nombre | `text-sm` (14px) | - | Geist |
| Precio | `text-base` (16px) | - | Geist bold |
| Botón card | `text-xs` (12px) | - | Geist |

- Body mínimo: 16px (1rem)
- Texto pequeño mínimo: 14px (0.875rem)
- Line height body: 1.5, headings: 1.2
- No usar clamp todavía (Next.js + SSR tiene soporte inconsistente)

## Touch Targets
Todos los elementos interactivos deben tener mínimo **44x44px** de área táctil:

```tsx
// ✅ Correcto - padding extra para alcanzar 44px
<button className="... px-4 py-2.5 min-h-[44px]">

// ❌ Incorrecto - muy pequeño
<button className="... px-2 py-1">
```

### Touch targets actuales
| Componente | Estado | Fix |
|------------|--------|-----|
| ProductCard btn | ~32px alto | + `min-h-[44px]` |
| ComboCard btn | ~36px alto | + `min-h-[44px]` |
| CategoryFilter pills | ~36px alto | `py-2.5` |
| Header hamburguesa | 24x24 SVG + p-1 | + `p-2.5` |
| Header nav links | ~texto | + `py-2` |
| Hero CTA | ~48px alto | ✅ ok |
| Footer social links | ~texto | + `py-2` |

## Unidades
- **Spacing**: usar `rem` (vía Tailwind utilities: `p-4` = 1rem = 16px)
- **Font sizes**: `rem` (Tailwind: `text-sm` = 0.875rem)
- **Widths**: `%`, `fr`, `minmax()` — evitar fixed `w-64` etc.
- **Max-widths**: `max-w-6xl` (1152px) para contenido, `max-w-2xl` para texto
- **Border radius**: Tailwind utilities (`rounded-xl` etc.)
- **Shadows**: Tailwind utilities (`shadow-sm` etc.)
- **Borders**: `px` está bien (`border`, `border-2`)

## Imágenes
- No usar `next/image` (evitar límite Vercel free)
- Usar `<img loading="lazy">`
- Supabase Storage transformations: `?width=400&quality=60` (cards), `?width=800&quality=80` (hero/combos)
- Placeholder: SVG de imagen de archivo (no emojis)
- Aspect ratio: `aspect-[4/3]` para productos

## Espaciado entre secciones
```tsx
<section className="py-10 md:py-16">  // mobile menos padding vertical
```

## Navegación
- Mobile: menú hamburguesa con SVG toggle
- Desktop: horizontal nav
- El header es `sticky top-0 z-40`

## Verificación pre-commit
- [ ] Sin overflow horizontal en 375px, 768px, 1024px, 1440px
- [ ] Touch targets >= 44px
- [ ] Body text >= 16px
- [ ] Scroll horizontal funciona en combos y categorías
- [ ] Header sticky no tapa contenido (hero tiene padding suficiente)
- [ ] Footer pegado al fondo en páginas con poco contenido
- [ ] Formularios y botones funcionales en touch
- [ ] `overflow-x: hidden` NO está en html/body

## Debugging overflow
Cuando aparezca franja blanca horizontal:
```css
/* Temporal - agregar en globals.css para debug */
* { outline: 1px solid rgba(255,0,0,0.3); }
```
El elemento que excede 100vw es el culpable. Alternativa: DevTools > Elements > hover sobre elementos hasta encontrar el que se sale.

## Colores
```css
--background: #fdf8f6;
--foreground: #3d2c2a;
--primary: #c68642;
--primary-light: #e8c49a;
--accent: #8b5e3c;
```
No hay tema dark por ahora.
