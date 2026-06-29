"use client";

import { useState, useCallback } from "react";
import { useCart } from "@/context/CartContext";
import { createClient } from "@/lib/supabase/client";

const STORE_ADDRESS = "Av. Corrientes 1234, CABA";

interface OrderFormProps {
  onSuccess: () => void;
  onOrderSent: () => void;
  deliveryPrice: number;
}

function validateName(value: string): string {
  if (!value.trim()) return "Ingresá tu nombre";
  if (value.trim().length < 2) return "El nombre debe tener al menos 2 caracteres";
  return "";
}

function validatePhone(value: string): string {
  if (!value.trim()) return "Ingresá tu teléfono";
  const digits = value.replace(/\D/g, "");
  if (digits.length < 7) return "Ingresá un teléfono válido";
  return "";
}

export default function OrderForm({ onSuccess, onOrderSent, deliveryPrice }: OrderFormProps) {
  const { items, totalPrice } = useCart();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [shippingOption, setShippingOption] = useState<"pickup" | "delivery">("pickup");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [touched, setTouched] = useState({ name: false, phone: false });

  const onNameChange = useCallback((value: string) => {
    setName(value);
    if (touched.name) setNameError(validateName(value));
  }, [touched.name]);

  const onPhoneChange = useCallback((value: string) => {
    setPhone(value);
    if (touched.phone) setPhoneError(validatePhone(value));
  }, [touched.phone]);

  const onNameBlur = useCallback(() => {
    setTouched((prev) => ({ ...prev, name: true }));
    setNameError(validateName(name));
  }, [name]);

  const onPhoneBlur = useCallback(() => {
    setTouched((prev) => ({ ...prev, phone: true }));
    setPhoneError(validatePhone(phone));
  }, [phone]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const nameErr = validateName(name);
    const phoneErr = validatePhone(phone);
    setNameError(nameErr);
    setPhoneError(phoneErr);
    setTouched({ name: true, phone: true });

    if (nameErr || phoneErr) return;

    setSending(true);
    const supabase = createClient();
    const total = totalPrice + (shippingOption === "delivery" ? deliveryPrice : 0);

    try {
      const { data: order, error: orderErr } = await supabase
        .from("orders")
        .insert({
          customer_name: name.trim(),
          customer_phone: phone.trim(),
          delivery: shippingOption === "delivery",
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
      <div>
        <input
          type="text"
          placeholder="Tu nombre"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          onBlur={onNameBlur}
          className={`w-full px-4 py-2.5 min-h-[44px] rounded-xl border bg-[var(--background)] text-sm text-[var(--foreground)] placeholder:text-[var(--accent)]/50 focus:outline-none transition-colors ${
            nameError ? "border-red-400 focus:border-red-500" : "border-[var(--primary-light)] focus:border-[var(--primary)]"
          }`}
          required
        />
        {nameError && <p className="text-xs text-red-500 mt-1">{nameError}</p>}
      </div>
      <div>
        <input
          type="tel"
          placeholder="Tu WhatsApp"
          value={phone}
          onChange={(e) => onPhoneChange(e.target.value)}
          onBlur={onPhoneBlur}
          className={`w-full px-4 py-2.5 min-h-[44px] rounded-xl border bg-[var(--background)] text-sm text-[var(--foreground)] placeholder:text-[var(--accent)]/50 focus:outline-none transition-colors ${
            phoneError ? "border-red-400 focus:border-red-500" : "border-[var(--primary-light)] focus:border-[var(--primary)]"
          }`}
          required
        />
        {phoneError && <p className="text-xs text-red-500 mt-1">{phoneError}</p>}
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setShippingOption("pickup")}
          className={`flex-1 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
            shippingOption === "pickup"
              ? "bg-[var(--primary)] text-white"
              : "bg-white border border-[var(--primary-light)] text-[var(--accent)] hover:border-[var(--primary)]"
          }`}
        >
          Retiro en local
        </button>
        <button
          type="button"
          onClick={() => setShippingOption("delivery")}
          className={`flex-1 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
            shippingOption === "delivery"
              ? "bg-[var(--primary)] text-white"
              : "bg-white border border-[var(--primary-light)] text-[var(--accent)] hover:border-[var(--primary)]"
          }`}
        >
          Envío a domicilio
        </button>
      </div>

      {shippingOption === "pickup" && (
        <p className="text-xs text-[var(--accent)] flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
          </svg>
          Retirá por {STORE_ADDRESS}
        </p>
      )}

      {shippingOption === "delivery" && (
        <div className="flex items-center justify-end gap-2">
          <span className="text-xs text-[var(--accent)]">Envío: {deliveryPrice > 0 ? `$${deliveryPrice.toLocaleString("es-AR")}` : "Gratis"}</span>
        </div>
      )}

      {error && <p className="text-xs text-red-500">{error}</p>}
      <button
        type="submit"
        disabled={sending}
        className="w-full bg-[var(--primary)] text-white py-3 min-h-[44px] rounded-full font-semibold text-sm hover:bg-[var(--accent)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        {sending ? "Enviando..." : "Enviar Pedido"}
      </button>
    </form>
  );
}
