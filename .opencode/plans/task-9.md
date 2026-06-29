# Task 9 - Responsive + Polish

## Goal
Revisión final mobile-first, animaciones, carga de imágenes optimizada, y detalles de UX.

## Dependencias
Requiere Tasks 3-8 completas.

## Estado actual
Funcionalidad completa implementada. Falta pulir detalles visuales y de rendimiento.

## Qué revisar/mejorar

### 1. Responsive Mobile-First
Revisar cada pantalla en viewports:
- **Mobile:** 320px-480px (iPhone SE, Galaxy)
- **Tablet:** 768px-1024px (iPad)
- **Desktop:** 1280px+

Checklist:
- [ ] Hero ocupa menos espacio en mobile (padding reducido)
- [ ] Grid productos: 2 cols mobile, 3 tablet, 4 desktop
- [ ] Combos: scroll horizontal en mobile, grid en desktop
- [ ] Sidebar admin: drawer hamburger en mobile
- [ ] Tablas admin: responsive stack (cards en mobile)
- [ ] CartDrawer: ancho completo en mobile, 400px en desktop
- [ ] Botones: touch targets >= 44px
- [ ] Font sizes legibles (min 16px en mobile)

### 2. Animaciones y Transiciones
Agregar animaciones suaves con Tailwind:
- [ ] Hero: fade-in del título al cargar
- [ ] Cards: hover scale sutil (transform hover:scale-105)
- [ ] CartDrawer: slide desde la derecha con transition
- [ ] CartButton: bounce al agregar item (keyframe animation)
- [ ] Badge de estado en admin: transition suave
- [ ] Filtro categorías: active tab transition
- [ ] Modal/Overlay: fade-in

### 3. Optimización de Imágenes
- [ ] Todas las imágenes usan `<img loading="lazy">`
- [ ] Supabase transformations: `?width=400&quality=60` para cards, `?width=800&quality=75` para hero/combos
- [ ] Placeholder/fallback si image_url es null (imagen por defecto)
- [ ] No usar next/image para evitar límite de Vercel free

### 4. UX Details
- [ ] Loading states (skeleton mientras carga SSR)
- [ ] Toast/notificaciones para acciones (item agregado, orden enviada, etc.)
- [ ] Confirmación antes de eliminar (ya implementado en Tasks anteriores, verificar)
- [ ] Error states (si falla fetch de Supabase, mostrar mensaje amigable)
- [ ] Empty states (sin productos, sin órdenes)
- [ ] Focus visible en inputs para accesibilidad
- [ ] Input sanitization (teléfono solo números, etc.)

### 5. Performance
- [ ] SSR en página principal (ya implementado)
- [ ] Imágenes optimizadas con transformations
- [ ] Sin bundle grande (verificar con next build)

### 6. Admin UI
- [ ] Tablas responsivas con overflow-x-auto
- [ ] Formularios con validación inline
- [ ] Botón "Volver" en páginas de detalle
- [ ] Estado actual guardado al editar (draft)

### 7. Archivos a crear/modificar
```
src/
  app/
    globals.css              (MODIFICAR - animaciones keyframes si es necesario)
  components/
    Toast.tsx                (CREAR - notificaciones)
  context/
    ToastContext.tsx          (CREAR - gestión de toasts)
```

## Detalles de animaciones (Tailwind v4)
En Tailwind v4 las animaciones custom se agregan en CSS:
```css
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
@theme inline {
  --animate-fade-in: fade-in 0.6s ease-out;
}
```

## Toast component
Notificaciones temporales (auto-dismiss 3s):
- Success: verde, icono check
- Error: rojo, icono X
- Info: azul, icono i
- Posición: top-right en desktop, top-center en mobile

## Verificación
- Probar en Chrome DevTools: 375px, 768px, 1280px
- Todas las interacciones tienen feedback visual
- Build sin errores ni warnings
- Lighthouse mobile score aceptable
