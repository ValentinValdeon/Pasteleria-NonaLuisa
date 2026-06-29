# Task 7 - Admin: CRUD Combos

## Goal
Panel admin para crear, editar y eliminar combos. Cada combo tiene productos asociados con cantidades.

## Dependencias
Requiere Task 6 (CRUD productos + categorías funcionando).

## Estado actual
- CRUD productos funcionando
- Sidebar tiene link a Combos (/admin/combos)
- Tablas combos y combo_items en DB con seed data

## DB Schema
```sql
combos (id UUID PK, name TEXT, description TEXT, price DECIMAL, 
  image_url TEXT, available BOOLEAN, created_at)

combo_items (id UUID PK, combo_id UUID FK->combos ON DELETE CASCADE,
  product_id UUID FK->products ON DELETE CASCADE, quantity INTEGER)
```
RLS: solo authenticated puede INSERT/UPDATE/DELETE.

## Archivos existentes relevantes
- `src/lib/types.ts`: Combo, ComboItem, Product interfaces
- `src/components/admin/ImageUpload.tsx`: Reutilizable para subir imágenes
- AdminLayout con sidebar link a Combos

## Qué crear

### 1. `src/app/admin/combos/page.tsx`
Lista de combos:
- Tabla: Imagen thumbnail, Nombre, Precio, Cant. Productos, Disponible, Acciones
- Botón "Nuevo Combo"
- Editar / Eliminar con confirmación

### 2. `src/app/admin/combos/[id]/page.tsx` (o modal)
Formulario combo:

**Datos básicos:**
- Nombre (text, required)
- Descripción (textarea)
- Precio (number, required)
- Disponible (toggle)
- Imagen (ImageUpload component)

**Productos del combo:**
- Selector de productos (de la DB, solo available)
- Input cantidad (number, min 1)
- Botón "Agregar producto al combo"
- Lista de productos agregados con: nombre, cantidad, botón quitar
- Mostrar precio total del combo (suma de productos * cantidades, como referencia)

### 3. `src/components/admin/ComboForm.tsx`
Componente formulario reutilizable:
- Props: combo (opcional para editar), products, onSubmit, onCancel
- Manejo de lista de productos con cantidades
- Preview de imagen

**Guardar combo:**
- Si nuevo: INSERT combo → obtener id → INSERT combo_items (uno por producto)
- Si edición: UPDATE combo → DELETE combo_items viejos → INSERT nuevos combo_items
- Usar transacción o simplemente secuencial

## Estructura de archivos
```
src/
  app/
    admin/
      combos/
        page.tsx          (CREAR)
        [id]/
          page.tsx        (CREAR)
  components/
    admin/
      ComboForm.tsx       (CREAR)
```

## Verificación
- Crear combo con productos → aparece en sección "Combos Destacados" de la landing page
- Editar combo → cambios visibles
- Eliminar combo → desaparece del catálogo
- Build sin errores
