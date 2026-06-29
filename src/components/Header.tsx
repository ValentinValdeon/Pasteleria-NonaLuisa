"use client";

import { useState } from "react";

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

  return (
    <>
      <header className="sticky top-0 z-30 bg-[var(--background)]/95 backdrop-blur-sm border-b border-[var(--primary-light)]/30">
        <div className="max-w-6xl mx-auto px-4 h-14 md:h-16 flex items-center justify-between">
          <a
            href="/"
            className="text-lg md:text-xl font-bold font-[family-name:var(--font-playfair)] text-[var(--primary)]"
          >
            Pastelería la Nona Luisa
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
          <span className="text-sm font-bold font-[family-name:var(--font-playfair)] text-[var(--primary)]">
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
        <nav className="px-4 py-4 flex flex-col gap-1">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block px-3 py-3 rounded-lg text-[var(--accent)] hover:bg-[var(--primary-light)]/20 hover:text-[var(--primary)] transition-colors font-medium text-sm"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </>
  );
}
