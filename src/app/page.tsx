export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="p-4 flex items-center justify-between">
        <h1 className="text-xl font-bold font-[family-name:var(--font-playfair)] text-[var(--primary)]">
          Pastelería
        </h1>
      </header>

      <main className="flex-1">
        <section className="flex flex-col items-center justify-center px-4 py-20 text-center">
          <h2 className="text-4xl md:text-5xl font-bold font-[family-name:var(--font-playfair)] text-[var(--foreground)] mb-4">
            Delicias Artesanales
          </h2>
          <p className="text-lg text-[var(--accent)] mb-8 max-w-md">
            Productos horneados con amor, todos los días
          </p>
          <a
            href="#productos"
            className="bg-[var(--primary)] text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-[var(--accent)] transition-colors"
          >
            Ver Productos
          </a>
        </section>
      </main>

      <footer className="p-4 text-center text-sm text-[var(--accent)]">
        © 2026 Pastelería - Todos los derechos reservados
      </footer>
    </div>
  );
}
