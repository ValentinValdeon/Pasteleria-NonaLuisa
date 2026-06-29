"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";

const NAV_LINKS = [
  { href: "/", label: "Inicio", section: "hero" },
  { href: "#productos", label: "Productos", section: "productos" },
  { href: "/admin", label: "Admin", section: null },
];

function CartIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
    </svg>
  );
}

function HamburgerIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" d="M4 6h16" />
      <path strokeLinecap="round" d="M4 12h16" />
      <path strokeLinecap="round" d="M4 18h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" d="M6 6l12 12" />
      <path strokeLinecap="round" d="M18 6l-12 12" />
    </svg>
  );
}

function CartBadge({ count }: { count: number }) {
  if (count === 0) return null;
  return (
    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1 leading-none">
      {count > 99 ? "99+" : count}
    </span>
  );
}

export default function Header() {
  const { totalItems, openCartDrawer } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const hero = document.getElementById("hero");
    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0 }
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const sections = ["hero", "productos"];
    const observers: IntersectionObserver[] = [];

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { threshold: 0.3 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 z-30 w-full bg-[var(--background)]/95 backdrop-blur-sm border-b border-[var(--primary-light)]/30 transition-transform duration-500 ${
          visible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
          <a href="/" className="flex items-center shrink-0">
            <Image
              src="/logo-nombre-edit.png"
              alt="Pastelería la Nona Luisa"
              width={200}
              height={81}
              className="h-12 md:h-14 w-auto object-contain"
              priority
            />
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1 text-sm text-[var(--accent)]">
            {NAV_LINKS.map((link) => {
              const isActive = link.section === activeSection;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                    isActive
                      ? "text-[var(--primary)] bg-[var(--primary-light)]/25"
                      : "hover:text-[var(--primary)] hover:bg-[var(--primary-light)]/10"
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
            <button
              onClick={openCartDrawer}
              className="relative p-2.5 rounded-lg text-[var(--accent)] hover:text-[var(--primary)] hover:bg-[var(--primary-light)]/10 transition-colors cursor-pointer"
              aria-label="Abrir carrito"
            >
              <CartIcon />
              <CartBadge count={totalItems} />
            </button>
          </nav>

          {/* Mobile actions */}
          <div className="flex items-center gap-1 md:hidden">
            <button
              onClick={openCartDrawer}
              className="relative p-2.5 text-[var(--foreground)] cursor-pointer"
              aria-label="Abrir carrito"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
              </svg>
              <CartBadge count={totalItems} />
            </button>
            <button
              onClick={() => setMenuOpen(true)}
              className="p-2.5 text-[var(--foreground)] cursor-pointer"
              aria-label="Abrir menú"
            >
              <HamburgerIcon />
            </button>
          </div>
        </div>
      </header>

      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 md:hidden ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMenuOpen(false)}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-80 bg-[var(--background)] shadow-2xl transition-transform duration-300 ease-in-out md:hidden ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 h-14 border-b border-[var(--primary-light)]/30">
          <span className="text-base font-bold font-[family-name:var(--font-playfair)] text-[var(--primary)]">
            Menú
          </span>
          <button
            onClick={() => setMenuOpen(false)}
            className="p-2 text-[var(--accent)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
            aria-label="Cerrar menú"
          >
            <CloseIcon />
          </button>
        </div>
        <nav className="px-5 py-6 flex flex-col gap-1">
          {NAV_LINKS.map((link) => {
            const isActive = link.section === activeSection;
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`block px-4 py-3.5 rounded-xl font-medium text-[15px] transition-colors ${
                  isActive
                    ? "bg-[var(--primary-light)]/25 text-[var(--primary)]"
                    : "text-[var(--foreground)] hover:bg-[var(--primary-light)]/15 hover:text-[var(--primary)]"
                }`}
              >
                {link.label}
              </a>
            );
          })}
          <hr className="my-3 border-[var(--primary-light)]/20" />
          <button
            onClick={() => {
              setMenuOpen(false);
              openCartDrawer();
            }}
            className="flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium text-[15px] text-[var(--foreground)] hover:bg-[var(--primary-light)]/15 hover:text-[var(--primary)] transition-colors cursor-pointer w-full text-left"
          >
            <CartIcon />
            <span>Carrito</span>
            {totalItems > 0 && (
              <span className="ml-auto bg-[var(--primary)] text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                {totalItems}
              </span>
            )}
          </button>
        </nav>
      </div>
    </>
  );
}
