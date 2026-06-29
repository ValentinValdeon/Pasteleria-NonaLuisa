# Task 6 - Admin: CRUD Productos + Categorías

## Goal
Panel admin para crear, editar y eliminar productos y categorías. Subida de imágenes a Supabase Storage.

## Dependencias
Requiere Task 5 (admin auth + layout funcionando).

## Estado actual
- AdminLayout con sidebar funciona
- Sidebar tiene links a Productos (/admin/productos) y Categorías (/admin/categorias)
- Tablas products y categories en Supabase con seed data

## Archivos existentes relevantes

### DB Schema
```sql
products (id UUID, name TEXT, description TEXT, price DECIMAL, image_url TEXT, 
  category_id UUID FK, available BOOLEAN, created_at, updated_at)
categories (id UUID, name TEXT, description TEXT, image_url TEXT, created_at)
```

### `src/lib/supabase/client.ts`
Browser client (para subir imágenes).

### `src/lib/types.ts`
Product, Category interfaces.

## Qué crear

### 1. `src/app/admin/productos/page.tsx`
Lista de productos con:
- Tabla responsiva
- Columnas: Imagen (thumbnail), Nombre, Precio, Categoría, Disponible (sí/no badge), Acciones
- Botón "Nuevo Producto" → abre modal/formulario
- Botón Editar → abre mismo formulario precargado
- Botón Eliminar → confirmación y delete
- Búsqueda/filtro por nombre (opcional)

### 2. `src/app/admin/productos/[id]/page.tsx` (o modal)
Página o modal para crear/editar producto:

**Formulario:**
- Nombre (text, required)
- Descripción (textarea)
- Precio (number, required)
- Categoría (select desde categories DB, required)
- Disponible (toggle sí/no)
- Imagen:
  - Si ya tiene: mostrar preview
  - Input file para subir nueva
  - Al seleccionar archivo, subir a Supabase Storage → obtener URL pública
  - Botón "Quitar imagen"

**Subida de imagen:**
```ts
const { data, error } = await supabase.storage
  .from('product-images')
  .upload(`products/${file.name}-${Date.now()}`, file);
const imageUrl = supabase.storage.from('product-images').getPublicUrl(data.path).data.publicUrl;
```

**Guardar:**
- Si es nuevo: INSERT en products
- Si es edición: UPDATE products
- Actualizar `updated_at`

### 3. `src/app/admin/categorias/page.tsx`
Lista de categorías:
- Tabla: Nombre, Descripción, Acciones
- Botón "Nueva Categoría"
- Editar / Eliminar

### 4. `src/app/admin/categorias/[id]/page.tsx` (o modal)
Formulario de categoría:
- Nombre (text, required)
- Descripción (textarea)
- Imagen (opcional, misma lógica que productos)
- Guardar: INSERT o UPDATE

### 5. `src/components/admin/ProductForm.tsx`
Componente formulario reutilizable (crear/editar):
- Props: product (opcional para editar), categories, onSubmit, onCancel
- Manejo de estado interno
- Preview de imagen antes de subir

### 6. `src/components/admin/CategoryForm.tsx`
Similar a ProductForm pero para categorías.

### 7. `src/components/admin/ImageUpload.tsx`
Componente reutilizable de subida de imagen:
- Drop zone o input file
- Preview
- Upload a Supabase Storage
- Props: bucket (string), path (string), existingUrl, onUpload (url => void)
- Mostrar progreso/estado
- Soporte para: jpg, png, webp, max 5MB

## Estructura de archivos
```
src/
  app/
    admin/
      productos/
        page.tsx                    (CREAR)
        [id]/
          page.tsx                  (CREAR)
      categorias/
        page.tsx                    (CREAR)
        [id]/
          page.tsx                  (CREAR)
  components/
    admin/
      ProductForm.tsx               (CREAR)
      CategoryForm.tsx              (CREAR)
      ImageUpload.tsx               (CREAR)
```

## Consideraciones
- Los nombres de archivo deben incluir timestamp para evitar colisiones
- Al eliminar producto, la imagen en Storage NO se borra (para mantener referencias)
- RLS permite INSERT/UPDATE/DELETE solo a authenticated
- Precios: tipo number, se almacenan como DECIMAL en DB

## Verificación
- Crear producto con imagen → aparece en catálogo público
- Editar producto → cambios visibles
- Eliminar producto → desaparece
- Crear/editar/eliminar categoría
- Build sin errores
