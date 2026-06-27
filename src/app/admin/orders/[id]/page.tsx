import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import OrderCard from "@/components/admin/OrderCard";
import { formatPrice } from "@/lib/utils";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: order }, { data: items }, { data: settings }] = await Promise.all([
    supabase.from("orders").select("*").eq("id", id).single(),
    supabase.from("order_items").select("*").eq("order_id", id),
    supabase.from("settings").select("*"),
  ]);

  if (!order) notFound();

  const alias = settings?.find((s) => s.key === "alias")?.value ?? "";

  const STATUS_LABELS: Record<string, string> = {
    pendiente: "Pendiente",
    aprobado: "Aprobado",
    rechazado: "Rechazado",
    parcial: "Parcial",
  };

  const STATUS_STYLES: Record<string, string> = {
    pendiente: "bg-amber-100 text-amber-800",
    aprobado: "bg-green-100 text-green-800",
    rechazado: "bg-red-100 text-red-800",
    parcial: "bg-blue-100 text-blue-800",
  };

  return (
    <>
      <a href="/admin" className="text-sm text-[var(--primary)] hover:underline mb-4 inline-block">
        ← Volver al dashboard
      </a>

      <div className="bg-white rounded-xl border border-[var(--primary-light)]/20 p-6 shadow-sm mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold font-[family-name:var(--font-playfair)] text-[var(--foreground)]">
              {order.customer_name}
            </h1>
            <a
              href={`https://wa.me/${order.customer_phone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[var(--primary)] hover:underline"
            >
              {order.customer_phone}
            </a>
            <p className="text-xs text-[var(--accent)] mt-0.5">
              {new Date(order.created_at).toLocaleDateString("es-AR", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {order.delivery && (
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700">
                Delivery
              </span>
            )}
            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${STATUS_STYLES[order.status]}`}>
              {STATUS_LABELS[order.status] ?? order.status}
            </span>
          </div>
        </div>

        <div className="border-t border-[var(--primary-light)]/20 pt-4">
          <h2 className="text-sm font-semibold text-[var(--accent)] mb-3 uppercase tracking-wide">
            Items del pedido
          </h2>
          <ul className="divide-y divide-[var(--primary-light)]/10">
            {(items ?? []).map((item) => (
              <li key={item.id} className="flex justify-between py-2 text-sm">
                <div>
                  <span className="text-[var(--foreground)]">{item.item_name}</span>
                  <span className="text-[var(--accent)] ml-1">x{item.quantity}</span>
                </div>
                <span className="font-medium text-[var(--foreground)]">
                  {formatPrice(item.item_price * item.quantity)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-[var(--primary-light)]/20 pt-4 mt-4 flex justify-between items-center">
          <span className="text-sm font-medium text-[var(--accent)]">Total</span>
          <span className="text-xl font-bold text-[var(--primary)]">{formatPrice(order.total)}</span>
        </div>

        {order.admin_message && (
          <div className="border-t border-[var(--primary-light)]/20 pt-4 mt-4">
            <p className="text-xs font-semibold text-[var(--accent)] uppercase tracking-wide mb-1">
              Mensaje del admin
            </p>
            <p className="text-sm text-[var(--accent)] bg-[var(--primary-light)]/10 p-3 rounded-lg">
              {order.admin_message}
            </p>
          </div>
        )}
      </div>

      {order.status === "pendiente" && (
        <div className="bg-white rounded-xl border border-[var(--primary-light)]/20 p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-[var(--accent)] mb-3 uppercase tracking-wide">
            Acciones
          </h2>
          <OrderCard order={order} alias={alias} />
        </div>
      )}
    </>
  );
}
