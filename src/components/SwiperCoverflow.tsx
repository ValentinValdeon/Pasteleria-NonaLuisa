"use client";

import { useRef, useEffect, useState } from "react";
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

const GAP = 16;

export default function SwiperCoverflow({ combos }: SwiperCoverflowProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [fitAll, setFitAll] = useState(false);
  const TOTAL = combos.length;

  useEffect(() => {
    const check = () => {
      const cw = window.innerWidth < 640 ? window.innerWidth * 0.75 : 300;
      const totalW = TOTAL * (cw + GAP) - GAP;
      setFitAll(totalW <= (containerRef.current?.clientWidth ?? window.innerWidth));
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [TOTAL]);

  if (TOTAL === 0) return null;

  if (fitAll) {
    return (
      <section className="py-16 bg-white overflow-hidden">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold font-[family-name:var(--font-playfair)] text-[var(--foreground)] mb-6">
            Combos Destacados
          </h2>
          <div className="flex justify-center gap-4 pt-4">
            {combos.map((combo, i) => (
              <div
                key={combo.id}
                className="flex-shrink-0 w-[75vw] sm:w-[300px] h-[400px]"
              >
                <ComboCard
                  id={combo.id}
                  name={combo.name}
                  description={combo.description ?? ""}
                  price={Number(combo.price)}
                  image_url={combo.image_url}
                  comboNumber={i + 1}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white overflow-hidden">
      <div ref={containerRef} className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold font-[family-name:var(--font-playfair)] text-[var(--foreground)] mb-6">
          Combos Destacados
        </h2>
        <Swiper
          effect="coverflow"
          grabCursor
          slidesPerView="auto"
          spaceBetween={GAP}
          loop
          speed={600}
          threshold={3}
          touchRatio={1.5}
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
              className="!w-[75vw] sm:!w-[300px] h-[400px]"
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
