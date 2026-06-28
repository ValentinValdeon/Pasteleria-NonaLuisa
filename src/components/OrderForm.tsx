"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { createClient } from "@/lib/supabase/client";

interface OrderFormProps {
  onSuccess: () => void;
  onOrderSent: () => void;
  deliveryPrice: number;
}

export default function OrderForm({ onSuccess, onOrderSent, deliveryPrice }: OrderFormProps) {
  const { items, totalPrice } = useCart();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [delivery, setDelivery] = useState(false);
  const [sending, setSending] = useState(false);
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

      onOrderSent();
    } catch (err) {
      console.error(err);
      setError("Error al enviar el pedido. Intentá de nuevo.");
    } finally {
      setSending(false);
    }
  };

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
