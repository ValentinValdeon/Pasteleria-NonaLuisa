const HERO_IMAGE =
  "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=1200&q=80";

export default function Hero() {
  return (
    <section className="relative min-h-[50vh] md:min-h-[70vh] flex items-center justify-center overflow-hidden">
      <img
        src={HERO_IMAGE}
        alt="Pastelería artesanal"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/45" />
      <div className="relative z-10 text-center px-4 max-w-2xl animate-fade-in">
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold font-[family-name:var(--font-playfair)] text-white mb-3 md:mb-4">
          Delicias Artesanales
        </h1>
        <p className="text-base md:text-xl text-white/90 mb-6 md:mb-8 max-w-md mx-auto">
          Productos horneados con amor, todos los días
        </p>
        <a
          href="#productos"
          className="inline-block bg-[var(--primary)] text-white px-8 py-3 rounded-full font-semibold hover:bg-[var(--accent)] transition-colors text-base md:text-lg"
        >
          Ver Productos
        </a>
      </div>
    </section>
  );
}
