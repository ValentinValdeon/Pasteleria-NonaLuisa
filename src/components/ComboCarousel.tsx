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

const GAP = 16;

export default function ComboCarousel({ combos }: ComboCarouselProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const activeRef = useRef(0);
  const translateXRef = useRef(0);
  const animRef = useRef(0);

  const TOTAL = combos.length;

  if (TOTAL === 0) return null;

  if (TOTAL === 1) {
    return (
      <section className="py-12 bg-white overflow-hidden">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold font-[family-name:var(--font-playfair)] text-[var(--foreground)] mb-6">
            Combos Destacados
          </h2>
          <div className="flex justify-center">
            <div className="w-[65vw] sm:w-[260px]">
              <ComboCard
                id={combos[0].id}
                name={combos[0].name}
                description={combos[0].description ?? ""}
                price={Number(combos[0].price)}
                image_url={combos[0].image_url}
              />
            </div>
          </div>
        </div>
      </section>
    );
  }

  const extended = combos.map((c, i) => ({ ...c, _key: `${c.id}-${i}` }));
  extended.unshift({ ...combos[TOTAL - 1], _key: `${combos[TOTAL - 1].id}-cp` });
  extended.push({ ...combos[0], _key: `${combos[0].id}-cn` });

  const getCardWidth = useCallback((): number => {
    if (!trackRef.current || trackRef.current.children.length === 0) return 260;
    return (trackRef.current.children[0] as HTMLElement).offsetWidth;
  }, []);

  const getTranslateX = useCallback(
    (index: number): number => {
      const vp = viewportRef.current;
      if (!vp) return 0;
      const cw = getCardWidth();
      return vp.clientWidth / 2 - cw / 2 - index * (cw + GAP);
    },
    [getCardWidth],
  );

  const moveTrack = useCallback((x: number, smooth: boolean) => {
    const track = trackRef.current;
    if (!track) return;
    track.style.transition = smooth
      ? "transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
      : "none";
    track.style.transform = `translateX(${x}px)`;
    translateXRef.current = x;
  }, []);

  const applyTransforms = useCallback(() => {
    const vp = viewportRef.current;
    const track = trackRef.current;
    if (!vp || !track) return;

    const viewCenter = -translateXRef.current + vp.clientWidth / 2;
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

  const centerAtIndex = useCallback(
    (index: number, smooth: boolean) => {
      const x = getTranslateX(index);
      moveTrack(x, smooth);
      activeRef.current = index;
      applyTransforms();
    },
    [getTranslateX, moveTrack, applyTransforms],
  );

  const snapToNearest = useCallback(() => {
    const vp = viewportRef.current;
    const track = trackRef.current;
    if (!vp || !track || track.children.length === 0) return;

    const cw = getCardWidth();
    const step = cw + GAP;
    const viewCenter = -translateXRef.current + vp.clientWidth / 2;

    let nearestIdx = activeRef.current;
    let nearestDist = Infinity;

    for (let i = 0; i < track.children.length; i++) {
      const cardCenter = (track.children[i] as HTMLElement).offsetLeft + cw / 2;
      const dist = Math.abs(cardCenter - viewCenter);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearestIdx = i;
      }
    }

    centerAtIndex(nearestIdx, true);

    const id = ++animRef.current;
    setTimeout(() => {
      if (animRef.current !== id) return;
      if (nearestIdx === 0) {
        centerAtIndex(TOTAL, false);
      } else if (nearestIdx === TOTAL + 1) {
        centerAtIndex(1, false);
      }
    }, 350);
  }, [TOTAL, getCardWidth, centerAtIndex]);

  useEffect(() => {
    const initial = 1 + Math.floor((TOTAL - 1) / 2);
    activeRef.current = initial;
    translateXRef.current = getTranslateX(initial);
    moveTrack(translateXRef.current, false);
    applyTransforms();
  }, [TOTAL, getTranslateX, moveTrack, applyTransforms]);

  useEffect(() => {
    const onResize = () => {
      centerAtIndex(activeRef.current, false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [centerAtIndex]);

  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return;

    let isDown = false;
    let startX = 0;
    let startTranslate = 0;

    const onDown = (e: PointerEvent) => {
      if (!e.isPrimary) return;
      isDown = true;
      isDragging.current = true;
      startX = e.clientX;
      startTranslate = translateXRef.current;
      animRef.current++;
      moveTrack(startTranslate, false);
      vp.setPointerCapture(e.pointerId);
    };

    const onMove = (e: PointerEvent) => {
      if (!isDown || !e.isPrimary) return;
      moveTrack(startTranslate + (e.clientX - startX), false);
      applyTransforms();
    };

    const onUp = () => {
      if (!isDown) return;
      isDown = false;
      isDragging.current = false;
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
  }, [moveTrack, applyTransforms, snapToNearest]);

  return (
    <section className="py-12 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold font-[family-name:var(--font-playfair)] text-[var(--foreground)] mb-6">
          Combos Destacados
        </h2>

        <div className="relative">
          <div
            ref={viewportRef}
            className="overflow-hidden cursor-grab select-none"
            style={{ touchAction: "pan-y" }}
          >
            <div
              ref={trackRef}
              className="flex gap-4 pb-4 will-change-transform"
            >
              {extended.map((combo) => (
                <div
                  key={combo._key}
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
