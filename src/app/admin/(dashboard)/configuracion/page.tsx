"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Setting } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { useToast } from "@/context/ToastContext";

const SETTING_META: Record<string, { label: string; description: string; type: "text" | "number" }> = {
  alias: { label: "Alias de Mercado Pago", description: "Mostrado al cliente al hacer un pedido", type: "text" },
  delivery_price: { label: "Precio de envío", description: "Costo adicional por delivery", type: "number" },
};

function SaveIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
  );
}

export default function ConfiguracionPage() {
  const supabase = createClient();
  const { addToast } = useToast();
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  const fetchData = async () => {
    const { data } = await supabase.from("settings").select("*");
    if (data) setSettings(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getValue = (key: string) => settings.find((s) => s.key === key)?.value ?? "";

  const setValue = (key: string, value: string) => {
    setSettings((prev) => {
      const existing = prev.find((s) => s.key === key);
      if (existing) {
        return prev.map((s) => (s.key === key ? { ...s, value } : s));
      }
      return [...prev, { id: "", key, value } as Setting];
    });
    setDirty(true);
  };

  const handleSave = async () => {
    setSaving(true);
    for (const setting of settings) {
      if (setting.id) {
        await supabase.from("settings").update({ value: setting.value }).eq("id", setting.id);
      } else {
        await supabase.from("settings").insert({ key: setting.key, value: setting.value });
      }
    }
    setDirty(false);
    setSaving(false);
    addToast("Configuración guardada");
    fetchData();
  };

  const knownKeys = Object.keys(SETTING_META);

  if (loading) {
    return (
      <>
        <h1 className="text-2xl font-bold font-[family-name:var(--font-playfair)] text-[var(--foreground)] mb-6">
          Configuración
        </h1>
        <div className="bg-white rounded-xl border border-[var(--primary-light)]/20 shadow-sm">
          {[1, 2].map((i) => (
            <div key={i} className="p-4 space-y-2">
              <div className="h-4 bg-[var(--primary-light)]/20 animate-pulse rounded w-1/4" />
              <div className="h-10 bg-[var(--primary-light)]/20 animate-pulse rounded w-full" />
              {i < 2 && <div className="border-b border-[var(--primary-light)]/10" />}
            </div>
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold font-[family-name:var(--font-playfair)] text-[var(--foreground)]">
          Configuración
        </h1>
        <button
          onClick={handleSave}
          disabled={saving || !dirty}
          className="p-2 min-h-[44px] min-w-[44px] rounded-full bg-[var(--primary)] text-white hover:bg-[var(--accent)] transition-colors flex items-center justify-center disabled:opacity-40"
          title="Guardar cambios"
        >
          <SaveIcon />
        </button>
      </div>

      <div className="bg-white rounded-xl border border-[var(--primary-light)]/20 shadow-sm divide-y divide-[var(--primary-light)]/10">
        {knownKeys.map((key) => {
          const meta = SETTING_META[key];
          const value = getValue(key);
          return (
            <div key={key} className="p-4 sm:p-6">
              <label className="block text-base font-semibold text-[var(--foreground)] mb-1">
                {meta.label}
              </label>
              <p className="text-sm text-[var(--accent)] mb-3">{meta.description}</p>
              {meta.type === "number" ? (
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={value}
                    onChange={(e) => setValue(key, e.target.value)}
                    className="flex-1 max-w-[200px] px-3 py-2.5 rounded-lg border border-[var(--primary-light)] text-base text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] transition-colors"
                  />
                  <span className="text-sm text-[var(--accent)] font-medium">{formatPrice(parseFloat(value || "0"))}</span>
                </div>
              ) : (
                <input
                  type="text"
                  value={value}
                  onChange={(e) => setValue(key, e.target.value)}
                  className="w-full max-w-md px-3 py-2.5 rounded-lg border border-[var(--primary-light)] text-base text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] transition-colors"
                  placeholder={key === "alias" ? "Ingresá tu alias" : ""}
                />
              )}
            </div>
          );
        })}
      </div>

      {dirty && (
        <p className="text-sm text-[var(--accent)] mt-3 text-center">
          Hay cambios sin guardar
        </p>
      )}
    </>
  );
}
