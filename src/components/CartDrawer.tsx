"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import QuantitySelector from "./QuantitySelector";
import OrderForm from "./OrderForm";
import { formatPrice } from "@/lib/utils";

interface CartDrawerProps {
  deliveryPrice: number;
}

export default function CartDrawer({ deliveryPrice }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, totalPrice, clearCart, cartDrawerOpen, closeCartDrawer } = useCart();
  const [orderSent, setOrderSent] = useState(false);
  const router = useRouter();

  const handleCloseSuccess = () => {
    clearCart();
    setOrderSent(false);
    closeCartDrawer();
    router.push("/");
  };

  return (
    <>
      {cartDrawerOpen && <div className="fixed inset-0 z-50 bg-black/40" onClick={closeCartDrawer} />}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-md bg-[var(--background)] shadow-xl transform transition-transform duration-300 ease-in-out flex flex-col ${
          cartDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 h-14 md:h-16 border-b border-[var(--primary-light)]/30 shrink-0">
          <h2 className="text-lg font-bold font-[family-name:var(--font-playfair)] text-[var(--foreground)]">
            Tu Pedido
          </h2>
          <button
            onClick={closeCartDrawer}
            className="p-2 text-[var(--accent)] hover:text-[var(--foreground)] transition-colors"
            aria-label="Cerrar carrito"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-[var(--accent)]">
              <svg className="w-16 h-16 mb-4 text-[var(--primary-light)]" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
              </svg>
              <p className="font-medium">Tu carrito está vacío</p>
              <p className="text-sm mt-1">Agregá productos para empezar tu pedido</p>
            </div>
          ) : (
            <ul className="flex flex-col gap-3">
              {items.map((item) => (
                <li
                  key={`${item.type}-${item.id}`}
                  className="flex items-center gap-3 p-3 bg-white rounded-xl border border-[var(--primary-light)]/20"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--foreground)] truncate">{item.name}</p>
                    <p className="text-xs text-[var(--accent)] mt-0.5">{formatPrice(item.price)} c/u</p>
                    <p className="text-sm font-semibold text-[var(--primary)] mt-1">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <QuantitySelector
                      value={item.quantity}
                      onChange={(q) => updateQuantity(item.id, item.type, q)}
                    />
                    <button
                      onClick={() => removeItem(item.id, item.type)}
                      className="p-2.5 text-[var(--accent)] hover:text-red-500 transition-colors"
                      aria-label="Eliminar"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-[var(--primary-light)]/30 p-4 bg-white shrink-0">
            <div className="flex justify-between text-sm text-[var(--accent)] mb-1">
              <span>Subtotal</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <div className="flex justify-between font-bold text-[var(--foreground)] text-lg mb-2 pt-2 border-t border-[var(--primary-light)]/20">
              <span>Total</span>
              <span className="text-[var(--primary)]">{formatPrice(totalPrice)}</span>
            </div>
            <OrderForm onSuccess={closeCartDrawer} onOrderSent={() => setOrderSent(true)} deliveryPrice={deliveryPrice} />
          </div>
        )}
      </div>

      {orderSent && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 px-4">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl">
            <svg className="w-16 h-16 mx-auto mb-4 text-green-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            <p className="text-lg font-bold text-[var(--foreground)]">Pedido enviado con éxito</p>
            <p className="text-sm text-[var(--accent)] mt-2">Pronto recibirás una respuesta a tu número de teléfono</p>
            <button
              onClick={handleCloseSuccess}
              className="mt-6 w-full bg-[var(--primary)] text-white py-3 min-h-[44px] rounded-full font-semibold text-sm"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
