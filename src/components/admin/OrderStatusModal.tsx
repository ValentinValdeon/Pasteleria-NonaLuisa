"use client";

import { useState } from "react";

interface OrderStatusModalProps {
  action: "rechazado" | "parcial";
  customerPhone: string;
  alias: string;
  total: number;
  onConfirm: (message: string) => void;
  onClose: () => void;
}

export default function OrderStatusModal({
  action,
  customerPhone,
  alias,
  total,
  onConfirm,
  onClose,
}: OrderStatusModalProps) {
  const [message, setMessage] = useState(
    action === "rechazado"
      ? "Lo sentimos, no podemos procesar tu pedido en este momento."
      : `Disponemos de parte de tu pedido. El total sería $${total.toLocaleString("es-AR")}. ¿Te sirve?`
  );

  const label = action === "rechazado" ? "Motivo de rechazo" : "Mensaje para el cliente";

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/40" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
          <h3 className="text-lg font-bold text-[var(--foreground)] mb-3">
            {action === "rechazado" ? "Rechazar Pedido" : "Confirmar Parcial"}
          </h3>
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
