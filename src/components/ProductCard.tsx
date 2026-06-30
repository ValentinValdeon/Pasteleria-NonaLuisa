"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";
import { formatPrice, getImageUrl } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import QuantitySelector from "./QuantitySelector";

interface ProductCardProps {
  product: Product;
}

function PlaceholderIcon() {
  return (
    <svg className="w-12 h-12 text-[var(--primary-light)]" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
  );
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const imgSrc = getImageUrl(product.image_url, 300, 60);
  const [adding, setAdding] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleAdd = () => {
    if (adding || !product.available) return;
    addItem(
      { id: product.id, name: product.name, price: product.price, image_url: product.image_url, type: "product" },
      quantity
    );
    setAdding(true);
    setQuantity(1);
    setTimeout(() => setAdding(false), 600);
  };

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
          <span className="absolute top-2 left-2 bg-red-500/90 text-white text-[11px] font-semibold px-2 py-0.5 rounded-full backdrop-blur-sm flex items-center gap-1">
            <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
            No disponible
          </span>
        )}
      </div>
      <div className="p-3 flex flex-col flex-1 gap-2">
        <h3 className="font-semibold text-[var(--foreground)] text-sm leading-tight line-clamp-2">
          {product.name}
        </h3>
        <p className="text-sm font-semibold text-[var(--primary)]">{formatPrice(product.price)}</p>
        <div className="flex items-center justify-end mt-auto gap-2 flex-wrap">
          {product.available && (
            <QuantitySelector value={quantity} onChange={setQuantity} min={0} />
          )}
          <button
            onClick={handleAdd}
            disabled={!product.available || quantity === 0}
            className={`relative overflow-hidden h-[44px] border-2 border-dashed border-[var(--primary)] rounded-l-full rounded-r-md px-4 font-semibold text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0 ${
              adding
                ? "bg-[var(--primary)] text-white"
                : "bg-white text-[var(--primary)] hover:bg-[var(--primary-light)]/10 disabled:hover:bg-white"
            }`}
          >
            <div
              className="transition-transform duration-300"
              style={{ transform: adding ? "translateY(-50%)" : "translateY(0)" }}
            >
              {product.available ? (
                <>
                  <div className="flex items-center justify-center gap-1.5 h-[44px]">
                    <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    <span className="text-[15px]">Agregar</span>
                  </div>
                  <div className="flex items-center justify-center gap-1.5 h-[44px]">
                    <CheckIcon />
                    <span>Agregado</span>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center gap-1.5 h-[44px]">
                  <span className="text-xs">Agotado</span>
                </div>
              )}
            </div>
          </button>
        </div>
      </div>
    </article>
  );
}
