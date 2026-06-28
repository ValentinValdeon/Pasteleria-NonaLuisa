"use client";

import { useState, useEffect, useCallback } from "react";

const HERO_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=1200&q=80",
    alt: "Pastelería artesanal - tortas decoradas",
  },
  {
    src: "https://images.unsplash.com/photo-1568254183919-78a4f43a2877?w=1200&q=80",
    alt: "Panes artesanales en estantería",
  },
  {
    src: "https://images.unsplash.com/photo-1587241321921-91a834d6d191?w=1200&q=80",
    alt: "Pastelero frente a estante de madera",
  },
];

const INTERVAL = 6000;

export default function Hero() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % HERO_IMAGES.length);
  }, []);

  useEffect(() => {
    const id = setInterval(next, INTERVAL);
    return () => clearInterval(id);
  }, [next]);

  return (
    <section
      className="relative min-h-[50vh] md:min-h-[70vh] flex items-center justify-center overflow-hidden"
      role="region"
      aria-roledescription="carousel"
      aria-label="Galería destacada"
    >
      {/* Slides */}
      <div
        className="absolute inset-0 flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {HERO_IMAGES.map((img, i) => (
          <div
            key={i}
            className="min-w-full min-h-full flex-shrink-0"
            role="group"
            aria-roledescription="slide"
            aria-label={`Imagen ${i + 1} de ${HERO_IMAGES.length}`}
          >
            <img
              src={img.src}
              alt={img.alt}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/45" />

      {/* Content */}
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

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {HERO_IMAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              i === current
                ? "bg-white scale-110"
                : "bg-white/40 hover:bg-white/70"
            }`}
            aria-label={`Ir a imagen ${i + 1}`}
            aria-current={i === current ? "true" : undefined}
          />
        ))}
      </div>
    </section>
  );
}
