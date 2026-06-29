# Plan de Mejoras - Secciones Cliente

## Sección 1: Header (`src/components/Header.tsx`)
- [ ] 1.1 Agregar ícono de carrito con contador en el header (desktop + mobile drawer)
- [ ] 1.2 Resaltar enlace de sección activa según scroll
- [ ] 1.3 Mejorar contraste del menú mobile drawer

## Sección 2: Hero (`src/components/Hero.tsx`)
- [ ] 2.1 Agregar título + subtítulo + CTA ("Ver productos" / "Pedí ahora")
- [ ] 2.2 Pausar autoplay del slider al hacer hover
- [ ] 2.3 Respetar `prefers-reduced-motion` en animaciones (bounce)

## Sección 3: Combos Destacados (`SwiperCoverflow.tsx` + `ComboCard.tsx`)
- [ ] 3.1 Reemplazar efecto coverflow 3D por slider plano más limpio
- [ ] 3.2 Agregar notificación toast al agregar combo al carrito
- [ ] 3.3 Cambiar `loading="eager"` a `loading="lazy"`
- [ ] 3.4 Agregar roles semánticos y aria-labels al swiper

## Sección 4: Productos (`ProductGrid.tsx` + `ProductCard.tsx` + `CategoryFilter.tsx`)
- [ ] 4.1 Agregar campo de búsqueda por nombre de producto
- [ ] 4.2 Mostrar precio visible fuera del botón en la card
- [ ] 4.3 Agregar selector de cantidad directamente en la card
- [ ] 4.4 Mejorar scroll horizontal de categorías en mobile
- [ ] 4.5 Badge "No disponible" con ícono para accesibilidad

## Sección 5: Carrito (`CartButton.tsx` + `CartDrawer.tsx` + `OrderForm.tsx`)
- [ ] 5.1 Agregar toast de confirmación al agregar items al carrito
- [ ] 5.2 Persistir carrito en localStorage
- [ ] 5.3 Agregar validación en vivo en el formulario
- [ ] 5.4 Aumentar tamaño del thumb del toggle (20px mínimo)
- [ ] 5.5 Agregar opción "Retiro en local" con dirección visible

## Sección 6: Footer (`Footer.tsx`)
- [ ] 6.1 Agregar información de contacto (dirección, horarios, email)
- [ ] 6.2 Agregar mapa embebido o enlace a Google Maps
- [ ] 6.3 Agregar enlaces útiles (políticas, preguntas frecuentes)

## Sección 7: General / Estética
- [ ] 7.1 Agregar animaciones de transición entre secciones
- [ ] 7.2 Agregar soporte para modo oscuro
- [ ] 7.3 Usar utilidades `@theme` de Tailwind v4 (`text-primary` en vez de `text-[var(--primary)]`)
- [ ] 7.4 Unificar favicon (conflicto favicon.ico vs favicon.svg)
- [ ] 7.5 Respetar `prefers-reduced-motion` en todas las animaciones
- [ ] 7.6 Revisar contraste de color WCAG 4.5:1
