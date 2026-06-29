-- ============================================
-- Pastelería Web - Esquema de Base de Datos
-- ============================================

-- Extensión para UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ====================
-- TABLAS
-- ====================

-- Categorías de productos
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Productos
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Combos
CREATE TABLE combos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Items que componen un combo
CREATE TABLE combo_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  combo_id UUID REFERENCES combos(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1
);

-- Órdenes de clientes
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  delivery BOOLEAN DEFAULT FALSE,
  status TEXT NOT NULL DEFAULT 'pendiente' CHECK (status IN ('pendiente', 'aprobado', 'rechazado', 'parcial')),
  total DECIMAL(10, 2) NOT NULL,
  admin_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Items de cada orden (snapshot de nombre y precio al momento de la compra)
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  combo_id UUID REFERENCES combos(id) ON DELETE SET NULL,
  item_name TEXT NOT NULL,
  item_price DECIMAL(10, 2) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1
);

-- Configuraciones globales (delivery_price, alias)
CREATE TABLE settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL
);

-- Insertar valores por defecto
INSERT INTO settings (key, value) VALUES ('delivery_price', '0');
INSERT INTO settings (key, value) VALUES ('alias', 'Ingresá tu alias');

-- ====================
-- ROW LEVEL SECURITY
-- ====================

-- Habilitar RLS en todas las tablas
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE combos ENABLE ROW LEVEL SECURITY;
ALTER TABLE combo_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Políticas para categories
CREATE POLICY "Cualquiera puede leer categorías"
  ON categories FOR SELECT USING (TRUE);

CREATE POLICY "Solo admin puede insertar categorías"
  ON categories FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Solo admin puede actualizar categorías"
  ON categories FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Solo admin puede eliminar categorías"
  ON categories FOR DELETE USING (auth.role() = 'authenticated');

-- Políticas para products
CREATE POLICY "Cualquiera puede leer productos"
  ON products FOR SELECT USING (TRUE);

CREATE POLICY "Solo admin puede insertar productos"
  ON products FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Solo admin puede actualizar productos"
  ON products FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Solo admin puede eliminar productos"
  ON products FOR DELETE USING (auth.role() = 'authenticated');

-- Políticas para combos
CREATE POLICY "Cualquiera puede leer combos"
  ON combos FOR SELECT USING (TRUE);

CREATE POLICY "Solo admin puede insertar combos"
  ON combos FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Solo admin puede actualizar combos"
  ON combos FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Solo admin puede eliminar combos"
  ON combos FOR DELETE USING (auth.role() = 'authenticated');

-- Políticas para combo_items
CREATE POLICY "Cualquiera puede leer combo_items"
  ON combo_items FOR SELECT USING (TRUE);

CREATE POLICY "Solo admin puede insertar combo_items"
  ON combo_items FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Solo admin puede actualizar combo_items"
  ON combo_items FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Solo admin puede eliminar combo_items"
  ON combo_items FOR DELETE USING (auth.role() = 'authenticated');

-- Políticas para orders
CREATE POLICY "Cualquiera puede insertar órdenes"
  ON orders FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Solo admin puede leer órdenes"
  ON orders FOR SELECT USING (auth.role() = 'authenticated' OR auth.role() IS NULL);

-- Necesitamos permitir que quien crea la orden vea su propia orden
-- Pero como los clientes no tienen auth, usamos una política más abierta para SELECT
-- En la práctica, solo el admin usará el dashboard
DROP POLICY IF EXISTS "Solo admin puede leer órdenes" ON orders;
CREATE POLICY "Admin puede leer órdenes"
  ON orders FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Solo admin puede actualizar órdenes"
  ON orders FOR UPDATE USING (auth.role() = 'authenticated');

-- Políticas para order_items
CREATE POLICY "Cualquiera puede insertar order_items"
  ON order_items FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Admin puede leer order_items"
  ON order_items FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Solo admin puede actualizar order_items"
  ON order_items FOR UPDATE USING (auth.role() = 'authenticated');

-- Políticas para settings
CREATE POLICY "Cualquiera puede leer settings"
  ON settings FOR SELECT USING (TRUE);

CREATE POLICY "Solo admin puede actualizar settings"
  ON settings FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Solo admin puede insertar settings"
  ON settings FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- ====================
-- STORAGE BUCKET
-- ====================

-- Crear bucket para imágenes de productos
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', TRUE)
ON CONFLICT (id) DO NOTHING;

-- Permitir lectura pública del bucket
CREATE POLICY "Lectura pública de imágenes"
  ON storage.objects FOR SELECT USING (bucket_id = 'product-images');

-- Permitir subida solo para admin autenticado
CREATE POLICY "Admin puede subir imágenes"
  ON storage.objects FOR INSERT WITH CHECK (
    bucket_id = 'product-images' AND auth.role() = 'authenticated'
  );

CREATE POLICY "Admin puede actualizar imágenes"
  ON storage.objects FOR UPDATE USING (
    bucket_id = 'product-images' AND auth.role() = 'authenticated'
  );

CREATE POLICY "Admin puede eliminar imágenes"
  ON storage.objects FOR DELETE USING (
    bucket_id = 'product-images' AND auth.role() = 'authenticated'
  );
