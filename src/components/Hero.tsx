"use client";

import Image from "next/image";
import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";

const HERO_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1572978577765-462b91a7f9e1?w=1200&q=95",
    alt: "Pastelería artesanal - tortas decoradas",
  },
  {
    src: "https://images.unsplash.com/photo-1568254183919-78a4f43a2877?w=1200&q=95",
    alt: "Panes artesanales en estantería",
  },
  {
    src: "https://images.unsplash.com/photo-1587241321921-91a834d6d191?w=1200&q=95",
    alt: "Pastelero frente a estante de madera",
  },
];

export default function Hero() {
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <section id="hero" className="relative h-[50vh] md:h-[70vh] overflow-hidden">
      <Swiper
        onSwiper={(swiper) => { swiperRef.current = swiper; }}
        modules={[Autoplay]}
        loop
        speed={800}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        className="absolute inset-0 w-full h-full [&_.swiper-wrapper]:!h-full [&_.swiper-slide]:!h-full [&_.swiper-slide]:!relative"
        onMouseEnter={() => swiperRef.current?.autoplay?.stop()}
        onMouseLeave={() => swiperRef.current?.autoplay?.start()}
      >
        {HERO_IMAGES.map((img, i) => (
          <SwiperSlide key={i}>
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes="100vw"
              className="object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/70 z-10" />

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 animate-wave">
        <svg className="w-6 h-6 text-white/70" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 5.25 7.5 7.5 7.5-7.5m-15 6 7.5 7.5 7.5-7.5" />
        </svg>
      </div>

      <div className="absolute inset-0 z-20 p-4 pb-14 animate-logo-in">
        <div className="relative h-full w-full max-w-2xl mx-auto">
          <Image
            src="/logo-white2-recort.png"
            alt="Pastelería"
            fill
            className="object-contain drop-shadow-[0_0_35px_rgba(255,255,255,0.3)] object-[52%_60%]"
            priority
          />
        </div>
      </div>
    </section>
  );
}
