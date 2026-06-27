import type { Product } from "@/lib/types";
import { formatPrice, getImageUrl } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const imgSrc = getImageUrl(product.image_url, 300, 60);

  return (
    <article className="bg-white rounded-xl shadow-sm overflow-hidden border border-[var(--primary-light)]/20 flex flex-col hover:shadow-md transition-shadow">
      <div className="aspect-square bg-[var(--primary-light)]/20 overflow-hidden relative">
        {imgSrc ? (
          <img src={imgSrc} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[var(--primary-light)] text-5xl">
            🥐
          </div>
        )}
        {!product.available && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
            No disponible
          </span>
        )}
      </div>
      <div className="p-3 flex flex-col flex-1">
        <h3 className="font-semibold text-[var(--foreground)] text-sm leading-tight">
          {product.name}
        </h3>
        <span className="font-bold text-[var(--primary)] text-lg mt-1">
          {formatPrice(product.price)}
        </span>
        <button
          className="mt-3 w-full bg-[var(--primary)] text-white text-sm py-2 rounded-full hover:bg-[var(--accent)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!product.available}
        >
          {product.available ? "Agregar" : "No disponible"}
        </button>
      </div>
    </article>
  );
}
