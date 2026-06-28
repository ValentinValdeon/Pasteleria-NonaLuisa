"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

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

export default function Hero() {
  return (
    <section className="relative min-h-[50vh] md:min-h-[70vh] flex items-center justify-center overflow-hidden">
      <Swiper
        modules={[Autoplay, Pagination]}
        loop
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        pagination={{
          clickable: true,
          renderBullet: (_, className) =>
            `<button class="${className} w-3 h-3 rounded-full bg-white/40 transition-all duration-300 hover:bg-white/70 [&.swiper-pagination-bullet-active]:bg-white [&.swiper-pagination-bullet-active]:scale-110"></button>`,
        }}
        className="absolute inset-0 w-full h-full [&_.swiper-slide]:!h-full"
      >
        {HERO_IMAGES.map((img, i) => (
          <SwiperSlide key={i}>
            <img
              src={img.src}
              alt={img.alt}
              className="w-full h-full object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/45 z-10" />

      {/* Content */}
      <div className="relative z-20 text-center px-4 max-w-2xl animate-fade-in">
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
