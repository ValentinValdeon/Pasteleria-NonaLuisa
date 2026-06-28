"use client";

import { useRef, useState, useEffect, useCallback } from "react";
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
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [hasOverflow, setHasOverflow] = useState(false);

  const applyTransforms = useCallback(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;

    const viewCenter = viewport.scrollLeft + viewport.clientWidth / 2;
    const maxDist = viewport.clientWidth * 0.55;

    for (let i = 0; i < track.children.length; i++) {
      const card = track.children[i] as HTMLElement;
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const dist = cardCenter - viewCenter;
      const absDist = Math.abs(dist);
      const p = Math.min(absDist / maxDist, 1);
      const dir = dist > 0 ? 1 : dist < 0 ? -1 : 0;

      const rotateY = dir * p * 15;
      const translateZ = -p * 60;
      const scale = 1 - p * 0.08;

      card.style.transform = `perspective(800px) rotateY(${rotateY}deg) translateZ(${translateZ}px) scale(${scale})`;
      card.style.zIndex = Math.round((1 - p) * 10).toString();
    }
  }, []);

  const updateIndicators = useCallback(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track || track.children.length === 0) return;

    const first = track.children[0] as HTMLElement;
    const step = first.offsetWidth + 16;
    const firstLeft = first.offsetLeft;
    const idx = Math.round((viewport.scrollLeft + viewport.clientWidth / 2 - firstLeft) / step);
    setActiveIndex(Math.max(0, Math.min(idx, combos.length - 1)));

    const maxScroll = viewport.scrollWidth - viewport.clientWidth;
    setHasOverflow(maxScroll > 0);
    setProgress(maxScroll > 0 ? (viewport.scrollLeft / maxScroll) * 100 : 0);
  }, [combos.length]);

  const onScroll = useCallback(() => {
    applyTransforms();
    updateIndicators();
  }, [applyTransforms, updateIndicators]);

  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return;
    vp.addEventListener("scroll", onScroll, { passive: true });
    return () => vp.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  useEffect(() => {
    applyTransforms();
    updateIndicators();
  }, [applyTransforms, updateIndicators]);

  useEffect(() => {
    const onResize = () => {
      applyTransforms();
      updateIndicators();
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [applyTransforms, updateIndicators]);

  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return;

    let isDown = false;
    let startX = 0;
    let scrollStart = 0;

    const onDown = (e: PointerEvent) => {
      if (!e.isPrimary || e.pointerType !== "mouse") return;
      isDown = true;
      isDragging.current = true;
      startX = e.clientX;
      scrollStart = vp.scrollLeft;
      vp.setPointerCapture(e.pointerId);
    };

    const onMove = (e: PointerEvent) => {
      if (!isDown || !e.isPrimary) return;
      vp.scrollLeft = scrollStart + (startX - e.clientX);
    };

    const onUp = () => {
      isDown = false;
      isDragging.current = false;
    };

    vp.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);

    return () => {
      vp.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  if (combos.length === 0) return null;

  return (
    <section className="py-12 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold font-[family-name:var(--font-playfair)] text-[var(--foreground)] mb-6">
          Combos Destacados
        </h2>

        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-12 sm:w-16 z-20 bg-gradient-to-r from-white to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-12 sm:w-16 z-20 bg-gradient-to-l from-white to-transparent" />

          <div
            ref={viewportRef}
            className="overflow-x-auto overflow-y-hidden cursor-grab select-none scrollbar-none"
            style={{
              scrollSnapType: "x mandatory",
              WebkitOverflowScrolling: "touch",
            }}
          >
            <div ref={trackRef} className="flex gap-4 pb-4">
              {combos.map((combo) => (
                <div
                  key={combo.id}
                  className="flex-shrink-0 w-[65vw] sm:w-[260px]"
                  style={{ scrollSnapAlign: "center" }}
                >
                  <ComboCard
                    id={combo.id}
                    name={combo.name}
                    description={combo.description ?? ""}
                    price={Number(combo.price)}
                    image_url={combo.image_url}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {hasOverflow && (
          <div className="mt-6 h-1.5 bg-[var(--primary-light)]/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-[var(--primary)] rounded-full transition-[width] duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
    </section>
  );
}
