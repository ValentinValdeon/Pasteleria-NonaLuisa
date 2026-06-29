"use client";

import { useState } from "react";
import { formatPrice, getImageUrl } from "@/lib/utils";
import { useCart } from "@/context/CartContext";

interface ComboCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string | null;
  comboNumber?: number;
}

function ComboPlaceholder() {
  return (
    <svg className="w-10 h-10 text-[var(--primary-light)]" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
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

export default function ComboCard({ id, name, description, price, image_url, comboNumber }: ComboCardProps) {
  const { addItem } = useCart();
  const imgSrc = getImageUrl(image_url, 300, 60);
  const [adding, setAdding] = useState(false);

  const handleAdd = () => {
    if (adding) return;
    addItem({ id, name, price, image_url, type: "combo" });
    setAdding(true);
    setTimeout(() => setAdding(false), 600);
  };

  return (
    <article className="bg-white rounded-xl shadow-md overflow-hidden border-2 border-[var(--primary)]/20 flex flex-col hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 max-w-full h-full">
      <div className="h-44 bg-gradient-to-br from-[var(--primary-light)]/40 to-[var(--primary)]/20 overflow-hidden relative">
        {imgSrc ? (
          <img src={imgSrc} alt={name} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ComboPlaceholder />
          </div>
        )}
        <span className="absolute top-2 right-2 bg-[var(--primary)] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
          {comboNumber ? `Combo ${comboNumber}` : "Combo"}
        </span>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold font-[family-name:var(--font-playfair)] text-[var(--foreground)] text-lg leading-tight">
          {name}
        </h3>
        <p className="text-sm text-[var(--accent)] mt-1.5 line-clamp-2 leading-relaxed">
          {description}
        </p>
        <div className="mt-auto pt-3 flex justify-end">
          <button
            onClick={handleAdd}
            className={`relative overflow-hidden h-[44px] border-2 border-dashed border-[var(--primary)] rounded-l-full rounded-r-md px-5 font-semibold text-sm transition-colors ${
              adding
                ? "bg-[var(--primary)] text-white"
                : "bg-white text-[var(--primary)] hover:bg-[var(--primary-light)]/10"
            }`}
          >
            <div
              className="transition-transform duration-300"
              style={{ transform: adding ? "translateY(-50%)" : "translateY(0)" }}
            >
              <div className="flex items-center justify-center gap-1.5 h-[44px]">
                <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                <span className="text-[15px]">{formatPrice(price)}</span>
              </div>
              <div className="flex items-center justify-center gap-1.5 h-[44px]">
                <CheckIcon />
                <span>Agregado</span>
              </div>
            </div>
          </button>
        </div>
      </div>
    </article>
  );
}
