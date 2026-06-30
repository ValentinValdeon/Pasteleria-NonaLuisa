"use client";

import type { Category } from "@/lib/types";

interface CategoryFilterProps {
  categories: Category[];
  activeCategory: string | null;
  onSelect: (id: string | null) => void;
}

export default function CategoryFilter({ categories, activeCategory, onSelect }: CategoryFilterProps) {
  return (
    <div className="overflow-x-auto md:overflow-x-visible scrollbar-none max-w-full">
      <div className="flex md:flex-wrap gap-2 pb-2 w-max md:w-auto">
        <button
          onClick={() => onSelect(null)}
          className={`shrink-0 px-4 py-2.5 min-h-[44px] rounded-full text-sm font-medium transition-colors ${
            activeCategory === null
              ? "bg-[var(--primary)] text-white"
              : "bg-white border border-[var(--primary-light)] text-[var(--accent)] hover:border-[var(--primary)]"
          }`}
        >
          Todas
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={`shrink-0 px-4 py-2.5 min-h-[44px] rounded-full text-sm font-medium transition-colors ${
              activeCategory === cat.id
                ? "bg-[var(--primary)] text-white"
                : "bg-white border border-[var(--primary-light)] text-[var(--accent)] hover:border-[var(--primary)]"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
}
