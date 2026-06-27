import type { Product } from "@/lib/types";
import { formatPrice, getImageUrl } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

function PlaceholderIcon() {
  return (
    <svg className="w-12 h-12 text-[var(--primary-light)]" fill="none" viewBox="0 0 48 48" stroke="currentColor" strokeWidth={1}>
      <path d="M24 8c-4 0-8 3-8 8s4 8 8 8 8-3 8-8-4-8-8-8z" strokeLinecap="round" />
      <path d="M12 40c0-8 6-12 12-12s12 4 12 12" strokeLinecap="round" />
      <path d="M16 20c-3 1-6 4-6 8" strokeLinecap="round" strokeDasharray="2 2" />
      <path d="M32 20c3 1 6 4 6 8" strokeLinecap="round" strokeDasharray="2 2" />
    </svg>
  );
}

export default function ProductCard({ product }: ProductCardProps) {
  const imgSrc = getImageUrl(product.image_url, 300, 60);

  return (
    <article className="bg-white rounded-xl shadow-sm overflow-hidden border border-[var(--primary-light)]/20 flex flex-col hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
      <div className="aspect-[4/3] bg-[var(--primary-light)]/20 overflow-hidden relative">
        {imgSrc ? (
          <img src={imgSrc} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <PlaceholderIcon />
          </div>
        )}
        {!product.available && (
          <span className="absolute top-2 left-2 bg-red-500/90 text-white text-[11px] font-semibold px-2 py-0.5 rounded-full backdrop-blur-sm">
            No disponible
          </span>
        )}
      </div>
      <div className="p-3 flex flex-col flex-1 gap-2">
        <h3 className="font-semibold text-[var(--foreground)] text-sm leading-tight line-clamp-2">
          {product.name}
        </h3>
        <div className="flex items-center justify-between mt-auto">
          <span className="font-bold text-[var(--primary)] text-base">
            {formatPrice(product.price)}
          </span>
          <button
            className="bg-[var(--primary)] text-white text-xs px-3 py-1.5 rounded-full hover:bg-[var(--accent)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed font-medium"
            disabled={!product.available}
          >
            {product.available ? "Agregar" : "Agotado"}
          </button>
        </div>
      </div>
    </article>
  );
}
