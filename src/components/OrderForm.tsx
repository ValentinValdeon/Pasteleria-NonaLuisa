"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { createClient } from "@/lib/supabase/client";
import { formatPrice } from "@/lib/utils";

interface OrderFormProps {
  onSuccess: () => void;
  deliveryPrice: number;
}

export default function OrderForm({ onSuccess, deliveryPrice }: OrderFormProps) {
  const { items, totalPrice, clearCart } = useCart();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [delivery, setDelivery] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Ingresá tu nombre");
      return;
    }
    if (!phone.trim()) {
      setError("Ingresá tu teléfono");
      return;
    }

    setSending(true);
    const supabase = createClient();
    const total = totalPrice + (delivery ? deliveryPrice : 0);

    try {
      const { data: order, error: orderErr } = await supabase
        .from("orders")
        .insert({
          customer_name: name.trim(),
          customer_phone: phone.trim(),
          delivery,
          total,
        })
        .select("id")
        .single();

      if (orderErr || !order) throw orderErr ?? new Error("Error al crear pedido");

      const orderItems = items.map((item) => ({
        order_id: order.id,
        [item.type === "product" ? "product_id" : "combo_id"]: item.id,
        item_name: item.name,
        item_price: item.price,
        quantity: item.quantity,
      }));

      const { error: itemsErr } = await supabase.from("order_items").insert(orderItems);
      if (itemsErr) throw itemsErr;

      setSent(true);
      clearCart();

      const waMsg = encodeURIComponent(
        `¡Hola! Soy ${name.trim()}.\n\n${items.map((i) => `• ${i.name} x${i.quantity} — ${formatPrice(i.price * i.quantity)}`).join("\n")}\n\nTotal: ${formatPrice(total)}${delivery ? "\n📍 Envío a domicilio" : ""}\n\nTel: ${phone.trim()}`
      );
      window.open(`https://wa.me/549${phone.trim()}?text=${waMsg}`, "_blank");
    } catch (err) {
      console.error(err);
      setError("Error al enviar el pedido. Intentá de nuevo.");
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div className="text-center py-4">
        <svg className="w-12 h-12 mx-auto mb-2 text-green-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
        <p className="font-semibold text-[var(--foreground)]">Pedido enviado con éxito</p>
        <p className="text-sm text-[var(--accent)] mt-1">Te redirigimos a WhatsApp</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input
        type="text"
        placeholder="Tu nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full px-4 py-2.5 min-h-[44px] rounded-xl border border-[var(--primary-light)] bg-[var(--background)] text-sm text-[var(--foreground)] placeholder:text-[var(--accent)]/50 focus:outline-none focus:border-[var(--primary)] transition-colors"
        required
      />
      <input
        type="tel"
        placeholder="Tu WhatsApp"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="w-full px-4 py-2.5 min-h-[44px] rounded-xl border border-[var(--primary-light)] bg-[var(--background)] text-sm text-[var(--foreground)] placeholder:text-[var(--accent)]/50 focus:outline-none focus:border-[var(--primary)] transition-colors"
        required
      />
      <label className="flex items-center gap-3 cursor-pointer py-1">
        <div className="relative">
          <input
            type="checkbox"
            checked={delivery}
            onChange={(e) => setDelivery(e.target.checked)}
            className="sr-only"
          />
          <div
            className={`w-10 h-5 rounded-full transition-colors ${delivery ? "bg-[var(--primary)]" : "bg-[var(--primary-light)]"}`}
          />
          <div
            className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${delivery ? "translate-x-5" : ""}`}
          />
        </div>
        <span className="text-sm text-[var(--accent)]">Enviar a domicilio</span>
      </label>
      {error && <p className="text-xs text-red-500">{error}</p>}
      <button
        type="submit"
        disabled={sending}
        className="w-full bg-[var(--primary)] text-white py-3 min-h-[44px] rounded-full font-semibold text-sm hover:bg-[var(--accent)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {sending ? "Enviando..." : "Enviar Pedido"}
      </button>
    </form>
  );
}
