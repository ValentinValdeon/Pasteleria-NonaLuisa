"use client";

import { useState } from "react";

const NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "#productos", label: "Productos" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[var(--background)]/95 backdrop-blur-sm border-b border-[var(--primary-light)]/30">
      <div className="max-w-6xl mx-auto px-4 h-14 md:h-16 flex items-center justify-between">
        <a
          href="/"
          className="text-lg md:text-xl font-bold font-[family-name:var(--font-playfair)] text-[var(--primary)]"
        >
          Pastelería
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
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2"
          aria-label="Menú"
        >
          <span className={`block w-6 h-[2px] bg-[var(--foreground)] transition-transform ${menuOpen ? "rotate-45 translate-y-[3.5px]" : ""}`} />
          <span className={`block w-6 h-[2px] bg-[var(--foreground)] transition-opacity ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block w-6 h-[2px] bg-[var(--foreground)] transition-transform ${menuOpen ? "-rotate-45 -translate-y-[3.5px]" : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav className="md:hidden border-t border-[var(--primary-light)]/30 bg-[var(--background)]/98 backdrop-blur-sm animate-slide-up">
          <div className="px-4 py-3 flex flex-col gap-2">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-[var(--accent)] hover:bg-[var(--primary-light)]/20 hover:text-[var(--primary)] transition-colors font-medium"
              >
                {link.label}
              </a>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
