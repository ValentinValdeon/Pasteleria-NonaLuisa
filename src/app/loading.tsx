export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="h-14 md:h-16 bg-[var(--background)]/95 border-b border-[var(--primary-light)]/30" />
      <section className="min-h-[50vh] md:min-h-[70vh] bg-[var(--primary-light)]/10 animate-pulse flex items-center justify-center">
        <div className="text-center">
          <div className="w-64 h-8 bg-[var(--primary-light)]/30 rounded-full mx-auto mb-4" />
          <div className="w-48 h-4 bg-[var(--primary-light)]/20 rounded-full mx-auto" />
        </div>
      </section>
      <div className="max-w-6xl mx-auto px-4 py-10 w-full">
        <div className="w-48 h-6 bg-[var(--primary-light)]/30 rounded-full mb-6" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl overflow-hidden border border-[var(--primary-light)]/20">
              <div className="aspect-[4/3] bg-[var(--primary-light)]/20 animate-pulse" />
              <div className="p-3 space-y-2">
                <div className="w-3/4 h-3 bg-[var(--primary-light)]/30 rounded-full" />
                <div className="w-1/3 h-4 bg-[var(--primary-light)]/30 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
