"use client";

import {
  useEffect,
  useRef,
  useState,
  type ElementType,
  type ReactNode,
} from "react";

/**
 * Enables scroll-reveal only once JS runs, so copy is never stuck hidden
 * during slow hydration. Adds `mir-anim-ready` to <html>.
 */
export function AnimReady() {
  useEffect(() => {
    document.documentElement.classList.add("mir-anim-ready");
  }, []);
  return null;
}

type RevealProps = {
  as?: ElementType;
  className?: string;
  delay?: number;
  children: ReactNode;
} & Record<string, unknown>;

export function Reveal({
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
      { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`mir-reveal ${seen ? "is-in" : ""} ${className}`.trim()}
      style={{ transitionDelay: `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export function Marquee({
  items,
  separator = "◆",
}: {
  items: string[];
  separator?: string;
}) {
  const sequence = [...items, ...items];
  return (
    <div className="mir-marquee" aria-hidden="true">
      <div className="mir-marquee__track">
        {sequence.map((item, i) => (
          <span className="mir-marquee__item" key={`${item}-${i}`}>
            {item}
            <i className="mir-marquee__sep">{separator}</i>
          </span>
        ))}
      </div>
    </div>
  );
}
