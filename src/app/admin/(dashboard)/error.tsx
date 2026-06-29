"use client";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <svg className="w-16 h-16 mb-4 text-red-400" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
      </svg>
      <h2 className="text-lg font-bold text-[var(--foreground)] mb-1">Error al cargar</h2>
      <p className="text-sm text-[var(--accent)] mb-4">No se pudo cargar esta sección.</p>
      <button
        onClick={reset}
        className="bg-[var(--primary)] text-white px-5 py-2 min-h-[44px] rounded-full font-semibold text-sm"
      >
        Reintentar
      </button>
    </div>
  );
}
