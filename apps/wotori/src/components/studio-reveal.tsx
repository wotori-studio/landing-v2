"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

type RevealProps = {
  as?: ElementType;
  className?: string;
  delay?: number;
  children: ReactNode;
} & Record<string, unknown>;

// Scroll-triggered reveal. Adds `is-in` once the element enters the viewport.
export default function Reveal({
  as: Tag = "div",
  className = "",
  delay = 0,
  children,
  ...rest
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setSeen(true);
      return undefined;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`ws-reveal ${seen ? "is-in" : ""} ${className}`.trim()}
      style={{ transitionDelay: `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export function Marquee({
  items,
  separator = "✦",
}: {
  items: string[];
  separator?: string;
}) {
  const sequence = [...items, ...items];
  return (
    <div className="ws-marquee" aria-hidden="true">
      <div className="ws-marquee__track">
        {sequence.map((item, i) => (
          <span className="ws-marquee__item" key={i}>
            {item}
            <i className="ws-marquee__sep">{separator}</i>
          </span>
        ))}
      </div>
    </div>
  );
}
