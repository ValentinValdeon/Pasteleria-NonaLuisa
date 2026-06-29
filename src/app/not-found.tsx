import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <p className="text-7xl font-bold font-[family-name:var(--font-playfair)] text-[var(--primary-light)] mb-4">
        404
      </p>
      <h1 className="text-xl font-bold text-[var(--foreground)] mb-2">Página no encontrada</h1>
      <p className="text-sm text-[var(--accent)] mb-6">
        La página que buscás no existe o fue movida.
      </p>
      <Link
        href="/"
        className="bg-[var(--primary)] text-white px-6 py-2.5 min-h-[44px] rounded-full font-semibold text-sm inline-flex items-center"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
