export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-[var(--background)]/95 backdrop-blur-sm border-b border-[var(--primary-light)]/30">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <a href="/" className="text-xl font-bold font-[family-name:var(--font-playfair)] text-[var(--primary)]">
          Pastelería
        </a>
        <nav className="flex items-center gap-6 text-sm text-[var(--accent)]">
          <a href="/" className="hover:text-[var(--primary)] transition-colors">Inicio</a>
          <a href="#productos" className="hover:text-[var(--primary)] transition-colors">Productos</a>
        </nav>
      </div>
    </header>
  );
}
