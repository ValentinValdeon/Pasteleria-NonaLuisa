"use client";

import { useState } from "react";
import type { Product, Category } from "@/lib/types";
import ProductCard from "./ProductCard";
import CategoryFilter from "./CategoryFilter";

interface ProductGridProps {
  products: Product[];
  categories: Category[];
}

export default function ProductGrid({ products, categories }: ProductGridProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = activeCategory
    ? products.filter((p) => p.category_id === activeCategory)
    : products;

  return (
    <section id="productos" className="max-w-6xl mx-auto px-4 py-10 md:py-16 animate-slide-up">
      <h2 className="text-2xl md:text-3xl font-bold font-[family-name:var(--font-playfair)] text-[var(--foreground)] mb-5 md:mb-6">
        Nuestros Productos
      </h2>
      <CategoryFilter
        categories={categories}
        activeCategory={activeCategory}
        onSelect={setActiveCategory}
      />
      <div className="mt-5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="text-center text-[var(--accent)] py-12">
          No hay productos en esta categoría
        </p>
      )}
    </section>
  );
}
