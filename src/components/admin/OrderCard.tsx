"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Order } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/context/ToastContext";
import OrderStatusModal from "./OrderStatusModal";

interface OrderCardProps {
  order: Order;
  alias: string;
}

const STATUS_STYLES: Record<string, string> = {
  pendiente: "bg-amber-100 text-amber-800",
  aprobado: "bg-green-100 text-green-800",
  rechazado: "bg-red-100 text-red-800",
  parcial: "bg-blue-100 text-blue-800",
};

const STATUS_LABELS: Record<string, string> = {
  pendiente: "Pendiente",
  aprobado: "Aprobado",
  rechazado: "Rechazado",
  parcial: "Parcial",
};

function WhatsAppIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
  );
}

export default function OrderCard({ order, alias }: OrderCardProps) {
  const router = useRouter();
  const { addToast } = useToast();
  const [modal, setModal] = useState<"rechazado" | "parcial" | null>(null);
  const [updating, setUpdating] = useState(false);
  const supabase = createClient();

  const updateStatus = async (status: string, message?: string) => {
    setUpdating(true);
    const payload: Partial<Order> = { status: status as Order["status"] };
    if (message) payload.admin_message = message;
    await supabase.from("orders").update(payload).eq("id", order.id);
    setUpdating(false);
    router.refresh();
  };

  const handleApprove = async () => {
    await updateStatus("aprobado");
    addToast("Pedido aprobado");
    const text = encodeURIComponent(
      `✅ Pedido aprobado por ${formatPrice(order.total)}. Pagá al alias: ${alias}.${order.delivery ? " Si elegiste delivery, decime tu dirección." : ""}`
    );
    window.open(`https://wa.me/${order.customer_phone}?text=${text}`, "_blank");
  };

  const handleReject = async (message: string) => {
    await updateStatus("rechazado", message);
    addToast("Pedido rechazado");
    const text = encodeURIComponent(`❌ Pedido rechazado: ${message}`);
    window.open(`https://wa.me/${order.customer_phone}?text=${text}`, "_blank");
    setModal(null);
  };

  const handlePartial = async (message: string) => {
    await updateStatus("parcial", message);
    addToast("Pedido marcado como parcial");
    const text = encodeURIComponent(`⚠️ ${message}`);
    window.open(`https://wa.me/${order.customer_phone}?text=${text}`, "_blank");
    setModal(null);
  };

  const statusClass = STATUS_STYLES[order.status] ?? "bg-gray-100 text-gray-800";

  return (
    <div className="bg-white rounded-xl border border-[var(--primary-light)]/20 p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="min-w-0">
          <p className="font-semibold text-[var(--foreground)] text-base truncate">{order.customer_name}</p>
          <a
            href={`https://wa.me/${order.customer_phone}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[var(--primary)] hover:underline inline-flex items-center gap-1"
          >
            <WhatsAppIcon />
            <span className="truncate">{order.customer_phone}</span>
          </a>
        </div>
        <div className="flex items-center gap-1.5 shrink-0 flex-wrap justify-end">
          {order.delivery && (
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-700 uppercase tracking-wide">
              D
            </span>
          )}
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${statusClass}`}>
            {STATUS_LABELS[order.status] ?? order.status}
          </span>
        </div>
      </div>

      <p className="text-xs text-[var(--accent)] mb-2">
        {new Date(order.created_at).toLocaleDateString("es-AR", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>

      <p className="text-xl font-bold text-[var(--primary)]">{formatPrice(order.total)}</p>

      {order.admin_message && (
        <p className="text-sm text-[var(--accent)] mt-2 italic bg-[var(--primary-light)]/10 p-2 rounded-lg">
          {order.admin_message}
        </p>
      )}

      {order.status === "pendiente" && (
        <div className="flex gap-2 mt-3">
          <button
            onClick={handleApprove}
            disabled={updating}
            className="flex-1 min-h-[44px] rounded-full bg-green-100 text-green-700 hover:bg-green-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5 text-sm font-semibold"
          >
            <CheckIcon />
            <span className="hidden sm:inline">Aprobar</span>
          </button>
          <button
            onClick={() => setModal("parcial")}
            disabled={updating}
            className="flex-1 min-h-[44px] rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5 text-sm font-semibold"
          >
            <AlertIcon />
            <span className="hidden sm:inline">Parcial</span>
          </button>
          <button
            onClick={() => setModal("rechazado")}
            disabled={updating}
            className="flex-1 min-h-[44px] rounded-full bg-red-100 text-red-700 hover:bg-red-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5 text-sm font-semibold"
          >
            <XIcon />
            <span className="hidden sm:inline">Rechazar</span>
          </button>
        </div>
      )}

      {modal && (
        <OrderStatusModal
          action={modal}
          orderId={order.id}
          customerPhone={order.customer_phone}
          alias={alias}
          total={order.total}
          onConfirm={modal === "rechazado" ? handleReject : handlePartial}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
