"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import ComboCard from "./ComboCard";

interface SwiperCoverflowProps {
  combos: Array<{
    id: string;
    name: string;
    description: string | null;
    price: number;
    image_url: string | null;
  }>;
}

export default function SwiperCoverflow({ combos }: SwiperCoverflowProps) {
  if (combos.length === 0) return null;

  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold font-[family-name:var(--font-playfair)] text-[var(--foreground)] mb-6">
          Combos (Swiper)
        </h2>
        <Swiper
          effect="coverflow"
          grabCursor
          slidesPerView="auto"
          spaceBetween={16}
          loop
          speed={600}
          loopAdditionalSlides={2}
          modules={[EffectCoverflow]}
          coverflowEffect={{
            rotate: 25,
            stretch: 0,
            depth: 100,
            modifier: 1.5,
            slideShadows: false,
          }}
          className="!pb-4"
        >
          {combos.map((combo, i) => (
            <SwiperSlide
              key={combo.id}
              className="!w-[75vw] sm:!w-[400px] h-[350px]"
            >
              <ComboCard
                id={combo.id}
                name={combo.name}
                description={combo.description ?? ""}
                price={Number(combo.price)}
                image_url={combo.image_url}
                comboNumber={i + 1}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
