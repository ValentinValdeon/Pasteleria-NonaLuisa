"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { OrderItem } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

interface OrderStatusModalProps {
  action: "rechazado" | "parcial";
  orderId?: string;
  customerPhone: string;
  alias: string;
  total: number;
  onConfirm: (message: string) => void;
  onClose: () => void;
}

export default function OrderStatusModal({
  action,
  orderId,
  customerPhone,
  alias,
  total,
  onConfirm,
  onClose,
}: OrderStatusModalProps) {
  const [items, setItems] = useState<OrderItem[]>([]);
  const [missingIds, setMissingIds] = useState<string[]>([]);
  const [message, setMessage] = useState(
    action === "rechazado"
      ? "Lo sentimos, no podemos procesar tu pedido en este momento."
      : ""
  );

  useEffect(() => {
    if (action !== "parcial" || !orderId) return;
    const supabase = createClient();
    supabase.from("order_items").select("*").eq("order_id", orderId).then(({ data }) => {
      if (data) setItems(data);
    });
  }, [action, orderId]);

  const toggleMissing = (id: string) => {
    setMissingIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    if (action !== "parcial" || items.length === 0) return;
    const missingItems = items.filter((i) => missingIds.includes(i.id));
    if (missingItems.length === 0) {
      setMessage(`Disponemos de todo tu pedido. El total sería ${formatPrice(total)}. Pagá al alias: ${alias}. ¿Te parece bien?`);
      return;
    }
    const availableTotal = items
      .filter((i) => !missingIds.includes(i.id))
      .reduce((sum, i) => sum + Number(i.item_price) * i.quantity, 0);
    const msg = `Falta${missingItems.length === 1 ? "" : "n"}: ${missingItems.map((i) => `${i.item_name} x${i.quantity}`).join(", ")}. Disponemos del resto por ${formatPrice(availableTotal)}. Pagá al alias: ${alias}. ¿Te parece bien?`;
    setMessage(msg);
  }, [missingIds, items, total, alias, action]);

  const label = action === "rechazado" ? "Motivo de rechazo" : "Mensaje para el cliente";

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/40" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
          <h3 className="text-lg font-bold text-[var(--foreground)] mb-3">
            {action === "rechazado" ? "Rechazar Pedido" : "Confirmar Parcial"}
          </h3>

          {action === "parcial" && items.length > 0 && (
            <div className="mb-4 pb-4 border-b border-[var(--primary-light)]/20">
              <p className="text-sm font-medium text-[var(--accent)] mb-2">Marcá los productos que faltan:</p>
              <ul className="space-y-1.5">
                {items.map((item) => (
                  <li key={item.id}>
                    <label className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-red-50 transition-colors">
                      <input
                        type="checkbox"
                        checked={missingIds.includes(item.id)}
                        onChange={() => toggleMissing(item.id)}
                        className="w-4 h-4 rounded border-gray-300 text-red-500 focus:ring-red-400"
                      />
                      <span className={`text-sm flex-1 ${missingIds.includes(item.id) ? "line-through text-red-500" : "text-[var(--foreground)]"}`}>
                        {item.item_name} x{item.quantity} — {formatPrice(Number(item.item_price) * item.quantity)}
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
              {missingIds.length > 0 && (
                <p className="text-xs text-red-500 mt-2">
                  {missingIds.length} producto{missingIds.length === 1 ? "" : "s"} marcado{missingIds.length === 1 ? "" : "s"} como faltante{missingIds.length === 1 ? "" : "s"}
                </p>
              )}
            </div>
          )}

          <label className="block text-base font-medium text-[var(--accent)] mb-1">{label}</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 rounded-lg border border-[var(--primary-light)] text-base text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] transition-colors resize-none"
          />
          <div className="flex gap-3 mt-4">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 min-h-[44px] rounded-full border border-[var(--primary-light)] text-base font-medium text-[var(--accent)] hover:bg-[var(--primary-light)]/20 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={() => onConfirm(message)}
              className="flex-1 py-2.5 min-h-[44px] rounded-full text-base font-medium text-white transition-colors bg-[var(--primary)] hover:bg-[var(--accent)]"
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
