"use client";

import { useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import ComboCard from "./ComboCard";

interface ComboCarouselProps {
  combos: Array<{
    id: string;
    name: string;
    description: string | null;
    price: number;
    image_url: string | null;
  }>;
}

export default function ComboCarousel({ combos }: ComboCarouselProps) {
  const [showHint, setShowHint] = useState(true);
  const initialSlide = useRef(true);

  const handleSlideChange = () => {
    if (initialSlide.current) {
      initialSlide.current = false;
      return;
    }
    setShowHint(false);
  };

  return (
    <section className="py-12 bg-white relative">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold font-[family-name:var(--font-playfair)] text-[var(--foreground)] mb-6">
          Combos Destacados
        </h2>
        <div className="relative">
          <Swiper
            effect="coverflow"
            centeredSlides
            slidesPerView="auto"
            loop
            coverflowEffect={{
              rotate: 30,
              stretch: 0,
              depth: 80,
              modifier: 2,
              slideShadows: false,
            }}
            modules={[EffectCoverflow]}
            onSlideChange={handleSlideChange}
          >
            {combos.map((combo) => (
              <SwiperSlide key={combo.id} className="!w-[85vw] sm:!w-[320px] !h-auto pb-4">
                <ComboCard
                  id={combo.id}
                  name={combo.name}
                  description={combo.description ?? ""}
                  price={Number(combo.price)}
                  image_url={combo.image_url}
                />
              </SwiperSlide>
            ))}
          </Swiper>

          <div
            className={`absolute top-1/2 -translate-y-1/2 right-2 z-10 flex items-center gap-1 text-[var(--primary)] font-semibold text-sm bg-white/90 backdrop-blur px-3 py-2 rounded-full shadow-md transition-opacity duration-500 pointer-events-none ${
              showHint ? "opacity-100" : "opacity-0"
            }`}
          >
            <span>Desliza</span>
            <span className="inline-block animate-bounce">→</span>
          </div>
        </div>
      </div>
    </section>
  );
}
