"use client";

import { useMemo } from "react";

/**
 * Lightweight CSS-only sparks (no canvas) for hero atmosphere.
 */
export function ParticleSparks({ count = 48 }: { count?: number }) {
  const sparks = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 4}s`,
      duration: `${2.5 + Math.random() * 2}s`,
    }));
  }, [count]);

  return (
    <div className="omoba-particles" aria-hidden>
      {sparks.map((s) => (
        <span
          key={s.id}
          style={{
            left: s.left,
            top: s.top,
            animationDelay: s.delay,
            animationDuration: s.duration,
          }}
        />
      ))}
    </div>
  );
}
