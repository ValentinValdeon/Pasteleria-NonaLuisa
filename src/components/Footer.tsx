export default function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--primary-light)]/30 bg-white">
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-[var(--accent)]">
          © {new Date().getFullYear()} Pastelería - Todos los derechos reservados
        </p>
        <div className="flex items-center gap-4 text-sm text-[var(--accent)]">
          <a href="#" className="hover:text-[var(--primary)] transition-colors">Instagram</a>
          <a href="#" className="hover:text-[var(--primary)] transition-colors">WhatsApp</a>
        </div>
      </div>
    </footer>
  );
}
