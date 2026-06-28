"use client";

import { useRef, useCallback, useEffect, useState } from "react";
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
  const activeRef = useRef(0);
  const translateXRef = useRef(0);
  const animRef = useRef(0);
  const [fitAll, setFitAll] = useState(false);

  const TOTAL = combos.length;

  useEffect(() => {
    const check = () => {
      const cw = window.innerWidth < 640 ? window.innerWidth * 0.65 : 260;
      const totalW = TOTAL * (cw + GAP) - GAP;
      setFitAll(totalW <= (viewportRef.current?.clientWidth ?? window.innerWidth));
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [TOTAL]);

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
      ? "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)"
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
      const scale = 1.04 - p * 0.11;

      card.style.transform = `perspective(800px) rotateY(${dir * p * 15}deg) translateZ(${-p * 60}px) scale(${scale})`;
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

  useEffect(() => {
    if (fitAll || TOTAL <= 1) return;
    const initial = 1 + Math.floor((TOTAL - 1) / 2);
    activeRef.current = initial;
    translateXRef.current = getTranslateX(initial);
    moveTrack(translateXRef.current, false);
    applyTransforms();
  }, [TOTAL, getTranslateX, moveTrack, applyTransforms, fitAll]);

  useEffect(() => {
    if (fitAll) return;
    const onResize = () => centerAtIndex(activeRef.current, false);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [centerAtIndex, fitAll]);

  useEffect(() => {
    if (fitAll || TOTAL <= 1) return;

    const vp = viewportRef.current;
    if (!vp) return;

    let isDown = false;
    let startX = 0;
    let startTranslate = 0;

    const onDown = (e: PointerEvent) => {
      if (!e.isPrimary) return;
      isDown = true;
      startX = e.clientX;
      startTranslate = translateXRef.current;
      animRef.current++;
      moveTrack(startTranslate, false);
      vp.setPointerCapture(e.pointerId);
    };

    const onMove = (e: PointerEvent) => {
      if (!isDown || !e.isPrimary) return;
      moveTrack(startTranslate + (e.clientX - startX) * 1.75, false);
      applyTransforms();
    };

    const onUp = (e: PointerEvent) => {
      if (!isDown) return;
      isDown = false;

      const dx = e.clientX - startX;
      let targetIdx = activeRef.current;

      if (Math.abs(dx) > 15) {
        targetIdx = dx > 0
          ? Math.max(0, activeRef.current - 1)
          : Math.min(TOTAL + 1, activeRef.current + 1);
      }

      centerAtIndex(targetIdx, true);

      const id = ++animRef.current;
      setTimeout(() => {
        if (animRef.current !== id) return;
        if (targetIdx === 0) {
          centerAtIndex(TOTAL, false);
        } else if (targetIdx === TOTAL + 1) {
          centerAtIndex(1, false);
        }
      }, 350);
    };

    vp.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);

    return () => {
      vp.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [TOTAL, moveTrack, applyTransforms, centerAtIndex, fitAll]);

  if (TOTAL === 0) return null;

  if (fitAll) {
    return (
      <section className="py-12 bg-white overflow-hidden">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold font-[family-name:var(--font-playfair)] text-[var(--foreground)] mb-6">
            Combos Destacados
          </h2>
          <div className="flex justify-center gap-4">
            {combos.map((combo) => (
              <div
                key={combo.id}
                className="flex-shrink-0 w-[65vw] sm:w-[260px] h-[300px]"
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
      </section>
    );
  }

  if (TOTAL === 1) {
    return (
      <section className="py-12 bg-white overflow-hidden">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold font-[family-name:var(--font-playfair)] text-[var(--foreground)] mb-6">
            Combos Destacados
          </h2>
          <div className="flex justify-center">
            <div className="w-[65vw] sm:w-[260px] h-[300px]">
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
                  className="flex-shrink-0 w-[65vw] sm:w-[260px] h-[300px]"
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
