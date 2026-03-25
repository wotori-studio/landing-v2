import React from "react";

interface Button {
  text: string;
  link?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary";
}

interface HeroSectionProps {
  imageUrl: string;
  imageAlt?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  quoteEyebrow?: string;
  quote?: string;
  footerLeft?: string;
  footerCenter?: string;
  buttons?: Button[];
  heroHeight?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  imageUrl,
  imageAlt = "A person standing in a field of glowing flowers, looking at a celestial swirl in the sky.",
  title = "Ekza Space",
  subtitle = "Where creativity runs free",
  description = "",
  quoteEyebrow,
  quote,
  footerLeft = "",
  footerCenter = "Ekza Space ©2025",
  buttons = [{ text: "Start Exploring", link: "#", variant: "primary" }],
  heroHeight = "min-h-screen",
}) => {
  const getButtonClasses = (variant: Button["variant"] = "primary") => {
    const base =
      "rounded-full px-7 py-3.5 text-sm font-semibold tracking-wide transition focus:outline-none focus-visible:ring-2 focus-visible:ring-ekza-primary focus-visible:ring-offset-2 focus-visible:ring-offset-ekza-bg dark:focus-visible:ring-offset-black";

    if (variant === "primary") {
      return `${base} bg-ekza-primary text-ekza-on-primary shadow-lg shadow-ekza-primary/25 hover:-translate-y-0.5 hover:shadow-ekza-glow dark:bg-gradient-to-r dark:from-[#00d1ff] dark:to-[#7701d0] dark:text-[#003543] dark:shadow-[0_0_24px_rgba(0,209,255,0.35)]`;
    }

    return `${base} border border-ekza-border/60 bg-ekza-elevated/90 text-ekza-on hover:bg-ekza-muted dark:border-white/15 dark:bg-white/10 dark:text-white dark:backdrop-blur-md dark:hover:bg-white/15`;
  };

  return (
    <section
      id="hero"
      className={`relative w-full ${heroHeight} overflow-hidden text-ekza-on dark:text-white`}
    >
      {/* Dark: ambient orbs + full-bleed image */}
      <div className="pointer-events-none absolute inset-0 hidden dark:block">
        <div
          className="ekza-glow-orb bg-cyan-400 -left-48 -top-48 h-[500px] w-[500px]"
          aria-hidden
        />
        <div
          className="ekza-glow-orb bg-purple-600 right-[-16rem] top-1/3 h-[600px] w-[600px]"
          aria-hidden
        />
        <div
          className="ekza-glow-orb bg-fuchsia-400 bottom-0 left-1/4 h-[400px] w-[400px] opacity-[0.1]"
          aria-hidden
        />
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src={imageUrl}
          alt={imageAlt}
          loading="eager"
          decoding="async"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/45"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/30"
          aria-hidden
        />
      </div>

      {/* Light: mesh + no full-bleed photo */}
      <div className="absolute inset-0 ekza-mesh-light dark:hidden" aria-hidden />

      <div className="relative z-10 flex min-h-[inherit] flex-col px-6 pb-10 pt-28 sm:px-8 lg:px-10">
        <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center gap-12 lg:gap-16">
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="space-y-6 lg:col-span-6">
              {quoteEyebrow && (
                <p className="font-headline text-xs font-medium uppercase tracking-[0.35em] text-ekza-primary dark:text-cyan-300/90">
                  {quoteEyebrow}
                </p>
              )}
              <h1 className="font-headline text-4xl font-bold leading-[1.05] tracking-tight text-ekza-on dark:text-white sm:text-5xl md:text-6xl lg:text-7xl">
                {title}
              </h1>
              {subtitle && (
                <p className="max-w-xl text-lg font-light leading-relaxed text-ekza-on-muted dark:text-white/85 md:text-xl">
                  {subtitle}
                </p>
              )}
              {quote && (
                <blockquote className="relative max-w-xl border-l-2 border-ekza-primary/50 py-1 pl-5 text-base italic leading-relaxed text-ekza-on-muted dark:border-cyan-400/50 dark:text-white/80 md:text-lg">
                  {quote}
                </blockquote>
              )}
            </div>

            <div className="lg:col-span-6">
              {/* Light: image in card */}
              <div className="relative mx-auto hidden max-w-xl dark:hidden lg:block">
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-ekza-primary/20 to-ekza-accent/30 opacity-60 blur-2xl" />
                <div className="relative overflow-hidden rounded-2xl border border-ekza-border/20 bg-ekza-card shadow-ekza-card">
                  <img
                    src={imageUrl}
                    alt={imageAlt}
                    className="aspect-[4/3] w-full object-cover"
                    loading="eager"
                    decoding="async"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-ekza-bg/40 via-transparent to-transparent"
                    aria-hidden
                  />
                </div>
              </div>

              {/* Glass panel: actions + description */}
              <div className="rounded-3xl border border-ekza-border/30 bg-ekza-card/90 p-6 shadow-ekza-card backdrop-blur-md dark:border-white/10 dark:bg-black/45 dark:shadow-ekza-card-dark sm:p-8 lg:dark:max-w-xl lg:dark:ml-auto">
                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  {buttons.map((button, index) => {
                    if (button.onClick) {
                      return (
                        <button
                          key={index}
                          onClick={button.onClick}
                          className={getButtonClasses(button.variant)}
                        >
                          {button.text}
                        </button>
                      );
                    }
                    return (
                      <a
                        key={index}
                        href={button.link}
                        target={
                          button.link?.startsWith("http") ? "_blank" : undefined
                        }
                        rel={
                          button.link?.startsWith("http")
                            ? "noopener noreferrer"
                            : undefined
                        }
                        className={getButtonClasses(button.variant)}
                      >
                        {button.text}
                      </a>
                    );
                  })}
                </div>
                {description && (
                  <p className="mt-6 text-sm leading-relaxed text-ekza-on-muted dark:text-white/80 md:text-base whitespace-pre-line">
                    {description}
                  </p>
                )}
              </div>

              {/* Light: mobile image below panel */}
              <div className="relative mt-8 lg:hidden dark:hidden">
                <div className="overflow-hidden rounded-2xl border border-ekza-border/20 shadow-ekza-card">
                  <img
                    src={imageUrl}
                    alt={imageAlt}
                    className="aspect-video w-full object-cover"
                    loading="eager"
                    decoding="async"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <footer className="mx-auto mt-auto w-full max-w-7xl flex-shrink-0 border-t border-ekza-border/25 pt-4 dark:border-white/15">
          <div className="flex flex-col justify-between gap-2 text-sm text-ekza-on-muted dark:text-white/55 sm:flex-row sm:items-center">
            <span>{footerLeft}</span>
            <span className="font-medium tracking-wide">
              {footerCenter}
            </span>
          </div>
        </footer>
      </div>
    </section>
  );
};
