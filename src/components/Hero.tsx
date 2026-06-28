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
    <section className="relative h-[50vh] md:h-[70vh] overflow-hidden">
      <Swiper
        modules={[Autoplay, Pagination]}
        loop
        speed={800}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        pagination={{
          clickable: true,
          renderBullet: (_, className) =>
            `<span class="${className} !bg-white/40 !opacity-100 hover:!bg-white/70 [&.swiper-pagination-bullet-active]:!bg-white [&.swiper-pagination-bullet-active]:!scale-110"></span>`,
        }}
        className="absolute inset-0 w-full h-full [&_.swiper-wrapper]:!h-full [&_.swiper-slide]:!h-full"
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

      <div className="absolute inset-0 bg-black/60 z-10" />

      <div className="absolute inset-0 z-20 flex items-center justify-center">
        <div className="text-center px-4 max-w-2xl animate-fade-in">
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
      </div>
    </section>
  );
}
