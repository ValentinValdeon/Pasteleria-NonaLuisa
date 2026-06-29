export default function AdminLoading() {
  return (
    <div className="animate-pulse">
      <div className="w-48 h-7 bg-[var(--primary-light)]/30 rounded-full mb-6" />
      <div className="grid gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-[var(--primary-light)]/20 p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-2 flex-1">
                <div className="w-40 h-4 bg-[var(--primary-light)]/30 rounded-full" />
                <div className="w-28 h-3 bg-[var(--primary-light)]/20 rounded-full" />
                <div className="w-32 h-3 bg-[var(--primary-light)]/20 rounded-full" />
              </div>
              <div className="flex gap-2">
                <div className="w-20 h-8 bg-[var(--primary-light)]/20 rounded-full" />
                <div className="w-20 h-8 bg-[var(--primary-light)]/20 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
