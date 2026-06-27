import { formatPrice, getImageUrl } from "@/lib/utils";

interface ComboCardProps {
  name: string;
  description: string;
  price: number;
  image_url: string | null;
}

export default function ComboCard({ name, description, price, image_url }: ComboCardProps) {
  const imgSrc = getImageUrl(image_url, 300, 60);

  return (
    <article className="w-64 shrink-0 snap-start bg-white rounded-xl shadow-md overflow-hidden border border-[var(--primary-light)]/40 flex flex-col">
      <div className="h-36 bg-[var(--primary-light)]/30 overflow-hidden">
        {imgSrc ? (
          <img src={imgSrc} alt={name} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[var(--primary-light)] text-4xl">
            🎂
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold font-[family-name:var(--font-playfair)] text-[var(--foreground)] text-lg">
          {name}
        </h3>
        <p className="text-sm text-[var(--accent)] mt-1 line-clamp-2">{description}</p>
        <div className="mt-auto pt-3 flex items-center justify-between">
          <span className="font-bold text-[var(--primary)]">{formatPrice(price)}</span>
          <button className="bg-[var(--primary)] text-white text-sm px-4 py-2 rounded-full hover:bg-[var(--accent)] transition-colors">
            Agregar
          </button>
        </div>
      </div>
    </article>
  );
}
