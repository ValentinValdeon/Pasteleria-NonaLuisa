"use client";

import { useRef, useCallback, useEffect } from "react";
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

  const snapToNearest = useCallback(() => {
    const vp = viewportRef.current;
    const track = trackRef.current;
    if (!vp || !track || track.children.length === 0) return;

    const viewCenter = vp.scrollLeft + vp.clientWidth / 2;
    let nearest = track.children[0] as HTMLElement;
    let nearestDist = Infinity;

    for (let i = 0; i < track.children.length; i++) {
      const card = track.children[i] as HTMLElement;
      const dist = Math.abs(card.offsetLeft + card.offsetWidth / 2 - viewCenter);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearest = card;
      }
    }

    const target = nearest.offsetLeft + nearest.offsetWidth / 2 - vp.clientWidth / 2;
    if (Math.abs(vp.scrollLeft - target) > 2) {
      vp.scrollTo({ left: target, behavior: "smooth" });
    }
  }, []);

  const applyTransforms = useCallback(() => {
    const vp = viewportRef.current;
    const track = trackRef.current;
    if (!vp || !track) return;

    const viewCenter = vp.scrollLeft + vp.clientWidth / 2;
    const maxDist = vp.clientWidth * 0.55;

    for (let i = 0; i < track.children.length; i++) {
      const card = track.children[i] as HTMLElement;
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const dist = cardCenter - viewCenter;
      const absDist = Math.abs(dist);
      const p = Math.min(absDist / maxDist, 1);
      const dir = dist > 0 ? 1 : dist < 0 ? -1 : 0;

      card.style.transform = `perspective(800px) rotateY(${dir * p * 15}deg) translateZ(${-p * 60}px) scale(${1 - p * 0.08})`;
      card.style.zIndex = Math.round((1 - p) * 10).toString();
    }
  }, []);

  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return;

    let t: NodeJS.Timeout;
    const onScroll = () => {
      applyTransforms();
      clearTimeout(t);
      t = setTimeout(snapToNearest, 100);
    };

    vp.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      vp.removeEventListener("scroll", onScroll);
      clearTimeout(t);
    };
  }, [applyTransforms, snapToNearest]);

  useEffect(() => {
    applyTransforms();

    const vp = viewportRef.current;
    const track = trackRef.current;
    if (vp && track && track.children.length > 0) {
      const first = track.children[0] as HTMLElement;
      const target = first.offsetLeft + first.offsetWidth / 2 - vp.clientWidth / 2;
      if (Math.abs(vp.scrollLeft - target) > 2) {
        vp.scrollLeft = target;
      }
    }
  }, [applyTransforms]);

  useEffect(() => {
    const onResize = () => applyTransforms();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [applyTransforms]);

  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return;

    let isDown = false;
    let startX = 0;
    let scrollStart = 0;

    const onDown = (e: PointerEvent) => {
      if (!e.isPrimary || e.pointerType !== "mouse") return;
      isDown = true;
      startX = e.clientX;
      scrollStart = vp.scrollLeft;
      vp.setPointerCapture(e.pointerId);
    };

    const onMove = (e: PointerEvent) => {
      if (!isDown || !e.isPrimary) return;
      vp.scrollLeft = scrollStart + (startX - e.clientX);
    };

    const onUp = () => {
      if (!isDown) return;
      isDown = false;
      snapToNearest();
    };

    vp.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);

    return () => {
      vp.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [snapToNearest]);

  if (combos.length === 0) return null;

  return (
    <section className="py-12 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold font-[family-name:var(--font-playfair)] text-[var(--foreground)] mb-6">
          Combos Destacados
        </h2>

        <div className="relative">
          <div
            ref={viewportRef}
            className="overflow-x-auto overflow-y-hidden cursor-grab select-none scrollbar-none"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            <div ref={trackRef} className="flex gap-4 pb-4">
              {combos.map((combo) => (
                <div
                  key={combo.id}
                  className="flex-shrink-0 w-[65vw] sm:w-[260px]"
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
      </div>
    </section>
  );
}
