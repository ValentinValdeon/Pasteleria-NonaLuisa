-- ============================================
-- Datos de prueba para desarrollo
-- ============================================

-- Categorías
INSERT INTO categories (name, description) VALUES
  ('Panadería', 'Pan artesanal horneado diariamente'),
  ('Pastelería', 'Tortas, tartas y postres'),
  ('Facturas', 'Medialunas, vigilantes y más'),
  ('Salado', 'Pizzas, empanadas y tartas saladas');

-- Productos
INSERT INTO products (name, description, price, category_id, available) VALUES
  ('Pan de Masa Madre', 'Pan artesanal de masa madre, fermentación lenta', 3200.00, (SELECT id FROM categories WHERE name = 'Panadería'), TRUE),
  ('Baguette Clásica', 'Baguette francesa de corteza crujiente', 1800.00, (SELECT id FROM categories WHERE name = 'Panadería'), TRUE),
  ('Pan de Molde Integral', 'Pan de molde con harina integral orgánica', 2800.00, (SELECT id FROM categories WHERE name = 'Panadería'), TRUE),
  ('Torta de Chocolate', 'Torta de chocolate semi-amargo con frosting', 4500.00, (SELECT id FROM categories WHERE name = 'Pastelería'), TRUE),
  ('Cheesecake', 'Cheesecake neoyorquino con frutos rojos', 4200.00, (SELECT id FROM categories WHERE name = 'Pastelería'), TRUE),
  ('Lemon Pie', 'Tarta de limón con merengue italiano', 3800.00, (SELECT id FROM categories WHERE name = 'Pastelería'), TRUE),
  ('Medialuna de Manteca', 'Medialuna artesanal de manteca', 800.00, (SELECT id FROM categories WHERE name = 'Facturas'), TRUE),
  ('Medialuna de Grasa', 'Medialuna artesanal de grasa', 700.00, (SELECT id FROM categories WHERE name = 'Facturas'), TRUE),
  ('Vigilante', 'Factura de vigilante con dulce de membrillo', 900.00, (SELECT id FROM categories WHERE name = 'Facturas'), TRUE),
  ('Pizza de Muzzarella', 'Pizza artesanal con muzzarella y aceitunas', 3500.00, (SELECT id FROM categories WHERE name = 'Salado'), TRUE),
  ('Empanada de Carne', 'Empanada de carne cortada a cuchillo', 1200.00, (SELECT id FROM categories WHERE name = 'Salado'), TRUE),
  ('Tarta de Verduras', 'Tarta de verduras grilladas con queso', 2800.00, (SELECT id FROM categories WHERE name = 'Salado'), TRUE);

-- Combos
INSERT INTO combos (name, description, price, available) VALUES
  ('Combo Desayuno', '2 medialunas de manteca + 1 café + 1 jugo', 3500.00, TRUE),
  ('Combo Merienda', '1 porción de torta + 1 té + 1 alfajor', 4200.00, TRUE),
  ('Combo Familiar', '1 pizza + 6 empanadas + 1 gaseosa 1.5L', 8500.00, TRUE);

-- Items de combos
INSERT INTO combo_items (combo_id, product_id, quantity) VALUES
  ((SELECT id FROM combos WHERE name = 'Combo Desayuno'), (SELECT id FROM products WHERE name = 'Medialuna de Manteca'), 2),
  ((SELECT id FROM combos WHERE name = 'Combo Merienda'), (SELECT id FROM products WHERE name = 'Torta de Chocolate'), 1),
  ((SELECT id FROM combos WHERE name = 'Combo Familiar'), (SELECT id FROM products WHERE name = 'Pizza de Muzzarella'), 1),
  ((SELECT id FROM combos WHERE name = 'Combo Familiar'), (SELECT id FROM products WHERE name = 'Empanada de Carne'), 6);

-- Settings
INSERT INTO settings (key, value) VALUES
  ('delivery_price', '1500'),
  ('alias', 'pasteleria.mp')
ON CONFLICT (key) DO NOTHING;
