import { formatPrice, getImageUrl } from "@/lib/utils";

interface ComboCardProps {
  name: string;
  description: string;
  price: number;
  image_url: string | null;
}

function ComboPlaceholder() {
  return (
    <svg className="w-10 h-10 text-[var(--primary-light)]" fill="none" viewBox="0 0 40 40" stroke="currentColor" strokeWidth={1.2}>
      <rect x="8" y="12" width="24" height="16" rx="3" strokeLinecap="round" />
      <path d="M14 12V8h12v4" strokeLinecap="round" />
      <path d="M20 16v8" strokeLinecap="round" />
      <path d="M16 20h8" strokeLinecap="round" />
    </svg>
  );
}

export default function ComboCard({ name, description, price, image_url }: ComboCardProps) {
  const imgSrc = getImageUrl(image_url, 300, 60);

  return (
    <article className="w-64 shrink-0 snap-start bg-white rounded-xl shadow-md overflow-hidden border-2 border-[var(--primary)]/20 flex flex-col hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5">
      <div className="h-36 bg-gradient-to-br from-[var(--primary-light)]/40 to-[var(--primary)]/20 overflow-hidden relative">
        {imgSrc ? (
          <img src={imgSrc} alt={name} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ComboPlaceholder />
          </div>
        )}
        <span className="absolute top-2 right-2 bg-[var(--primary)] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
          Combo
        </span>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold font-[family-name:var(--font-playfair)] text-[var(--foreground)] text-lg leading-tight">
          {name}
        </h3>
        <p className="text-sm text-[var(--accent)] mt-1.5 line-clamp-2 leading-relaxed">
          {description}
        </p>
        <div className="mt-auto pt-3 flex items-center justify-between">
          <span className="font-bold text-lg text-[var(--primary)]">{formatPrice(price)}</span>
          <button className="bg-[var(--primary)] text-white text-sm px-4 py-2 rounded-full hover:bg-[var(--accent)] transition-colors font-medium">
            Agregar
          </button>
        </div>
      </div>
    </article>
  );
}
