"use client";

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
}

export default function QuantitySelector({ value, onChange, min = 1 }: QuantitySelectorProps) {
  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        className="w-11 h-11 flex items-center justify-center rounded-full border border-[var(--primary-light)] text-[var(--accent)] hover:bg-[var(--primary-light)]/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="Disminuir cantidad"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" d="M5 12h14" />
        </svg>
      </button>
      <span className="w-10 text-center text-sm font-medium text-[var(--foreground)]">{value}</span>
      <button
        onClick={() => onChange(value + 1)}
        className="w-11 h-11 flex items-center justify-center rounded-full border border-[var(--primary-light)] text-[var(--accent)] hover:bg-[var(--primary-light)]/20 transition-colors"
        aria-label="Aumentar cantidad"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" d="M12 5v14M5 12h14" />
        </svg>
      </button>
    </div>
  );
}
