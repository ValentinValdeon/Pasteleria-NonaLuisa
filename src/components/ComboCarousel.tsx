"use client";

import { useState, useEffect } from "react";
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

  useEffect(() => {
    if (combos.length === 0) return;
    const id = setTimeout(() => setShowHint(false), 8000);
    return () => clearTimeout(id);
  }, [combos.length]);

  return (
    <section className="py-12 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-3xl font-bold font-[family-name:var(--font-playfair)] text-[var(--foreground)]">
            Combos Destacados
          </h2>
          <span
            className={`text-xs font-semibold text-[var(--primary)] bg-[var(--primary)]/10 px-2.5 py-1 rounded-full transition-opacity duration-500 ${
              showHint ? "opacity-100" : "opacity-0"
            }`}
          >
            Desliza →
          </span>
        </div>
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
        </div>
      </div>
    </section>
  );
}
