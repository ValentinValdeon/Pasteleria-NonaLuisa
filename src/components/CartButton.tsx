"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";

interface CartButtonProps {
  onClick: () => void;
}

export default function CartButton({ onClick }: CartButtonProps) {
  const { totalItems, addVersion } = useCart();
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (addVersion === 0) return;
    setPulse(true);
    const t = setTimeout(() => setPulse(false), 400);
    return () => clearTimeout(t);
  }, [addVersion]);

  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-40 bg-[var(--primary)] text-white w-14 h-14 rounded-full shadow-lg hover:bg-[var(--accent)] transition-colors flex items-center justify-center"
      aria-label="Abrir carrito"
    >
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
      </svg>
      {totalItems > 0 && (
        <span
          className={`absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center transition-transform duration-300 ${
            pulse ? "scale-125" : "scale-100"
          }`}
        >
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      )}
    </button>
  );
}
