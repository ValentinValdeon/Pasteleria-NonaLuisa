import { getImageUrl } from "@/lib/utils";

const HERO_IMAGE = "https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=1200&q=80";

export default function Hero() {
  return (
    <section className="relative min-h-[60vh] md:min-h-[80vh] flex items-center justify-center overflow-hidden">
      <img
        src={HERO_IMAGE}
        alt="Pastelería artesanal"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative z-10 text-center px-4 max-w-2xl">
        <h1 className="text-4xl md:text-6xl font-bold font-[family-name:var(--font-playfair)] text-white mb-4">
          Delicias Artesanales
        </h1>
        <p className="text-lg md:text-xl text-white/90 mb-8">
          Productos horneados con amor, todos los días
        </p>
        <a
          href="#productos"
          className="inline-block bg-[var(--primary)] text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-[var(--accent)] transition-colors"
        >
          Ver Productos
        </a>
      </div>
    </section>
  );
}
