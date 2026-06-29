"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

const NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "#productos", label: "Productos" },
  { href: "/admin", label: "Admin" },
];

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

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [visible, setVisible] = useState(false);

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

  return (
    <>
      <header
        className={`fixed top-0 z-30 w-full bg-[var(--background)]/95 backdrop-blur-sm border-b border-[var(--primary-light)]/30 transition-transform duration-500 ${
          visible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
          <a
            href="/"
            className="flex items-center shrink-0"
          >
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
          <nav className="hidden md:flex items-center gap-6 text-sm text-[var(--accent)]">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="hover:text-[var(--primary)] transition-colors font-medium"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(true)}
            className="md:hidden p-2.5 text-[var(--foreground)]"
            aria-label="Abrir menú"
          >
            <HamburgerIcon />
          </button>
        </div>
      </header>

      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 md:hidden ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMenuOpen(false)}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-72 bg-[var(--background)] shadow-xl transition-transform duration-300 ease-in-out md:hidden ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 h-14 border-b border-[var(--primary-light)]/30">
          <span className="text-base font-bold font-[family-name:var(--font-playfair)] text-[var(--primary)]">
            Menú
          </span>
          <button
            onClick={() => setMenuOpen(false)}
            className="p-2 text-[var(--accent)] hover:text-[var(--foreground)] transition-colors"
            aria-label="Cerrar menú"
          >
            <CloseIcon />
          </button>
        </div>
        <nav className="px-4 py-6 flex flex-col">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-4 border-b border-[var(--primary-light)]/20 last:border-b-0 text-[var(--accent)] hover:bg-[var(--primary-light)]/20 hover:text-[var(--primary)] transition-colors font-medium text-lg"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </>
  );
}
