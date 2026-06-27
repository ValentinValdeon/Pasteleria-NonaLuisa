"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const NAV_ITEMS = [
  { href: "/admin", label: "Órdenes" },
  { href: "/admin/productos", label: "Productos" },
  { href: "/admin/categorias", label: "Categorías" },
  { href: "/admin/combos", label: "Combos" },
  { href: "/admin/configuracion", label: "Configuración" },
];

const EXTRA_LINKS = [
  { href: "/", label: "Ver sitio →", external: true },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-black/40" onClick={() => setOpen(false)} />}

      <aside
        className={`fixed top-0 right-0 z-50 h-full w-64 bg-white border-l border-[var(--primary-light)]/30 transform transition-transform duration-200 flex flex-col ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 h-14 border-b border-[var(--primary-light)]/30 shrink-0">
          <Link href="/admin" className="font-bold font-[family-name:var(--font-playfair)] text-[var(--primary)]">
            Pastelería
          </Link>
          <button onClick={() => setOpen(false)} className="p-1 text-[var(--accent)]" aria-label="Cerrar menú">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`block px-3 py-2.5 rounded-lg text-base font-medium transition-colors ${
                  active
                    ? "bg-[var(--primary)]/10 text-[var(--primary)]"
                    : "text-[var(--accent)] hover:bg-[var(--primary-light)]/20 hover:text-[var(--foreground)]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <div className="pt-2 mt-2 border-t border-[var(--primary-light)]/20">
            {EXTRA_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-base font-medium text-[var(--primary)] hover:bg-[var(--primary-light)]/20 transition-colors"
                target={item.external ? "_blank" : undefined}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>

        <div className="p-3 border-t border-[var(--primary-light)]/30">
          <button
            onClick={handleLogout}
            className="w-full px-3 py-2.5 rounded-lg text-base font-medium text-red-600 hover:bg-red-50 transition-colors text-left"
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      <button
        onClick={() => setOpen(true)}
        className="fixed top-3 right-3 z-30 p-2.5 bg-white rounded-xl shadow-md border border-[var(--primary-light)]/20"
        aria-label="Abrir menú"
      >
        <svg className="w-5 h-5 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>
    </>
  );
}
