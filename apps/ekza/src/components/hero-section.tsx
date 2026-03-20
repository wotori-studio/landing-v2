import React from "react";

interface Button {
  text: string;
  link: string;
  variant?: "primary" | "secondary";
}

interface HeroSectionProps {
  imageUrl: string;
  imageAlt?: string;
  title?: string;
  subtitle?: string;
  description?: string;
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
  description = "Discovery doesn't always begin with knowing - it starts with questions. Context that guide understanding forward.\n\nLumen Atlas is your companion for deeper insight. A calm interface for asking better questions and drawing thoughtful. Less noise. More meaning.",
  footerLeft = "",
  footerCenter = "Ekza Space ©2025",
  buttons = [{ text: "Start Exploring", link: "#", variant: "primary" }],
  heroHeight = "h-screen",
}) => {
  const getButtonClasses = (variant: Button["variant"] = "primary") => {
    const baseClasses =
      "rounded-full px-8 py-3 text-base font-medium focus:outline-none border transition-all duration-200 transform hover:-translate-y-0.5";

    return variant === "primary"
      ? `${baseClasses} bg-white text-black border-white hover:bg-gray-100 hover:shadow-lg`
      : `${baseClasses} bg-white/10 text-white border-white/60 hover:bg-white/20 hover:shadow-md`;
  };

  return (
    <section
      id="hero"
      className={`relative w-full ${heroHeight} text-white overflow-hidden`}
    >
      {/* Background Image */}
      <img
        className="absolute inset-0 w-full h-full object-cover"
        src={imageUrl}
        alt={imageAlt}
        loading="eager"
        decoding="async"
      />

      {/* Gradient Overlay for better text contrast */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"
        aria-hidden="true"
      />

      {/* Content Container */}
      <div className="relative z-10 flex flex-col h-full p-6 sm:p-8 lg:p-10">
        {/* Main Content (grows to fill space) */}
        <main className="flex-grow grid md:grid-cols-12 items-end gap-10 md:gap-16 pb-12">
          {/* Left Side: Title and Subtitle */}
          <div className="md:col-span-5 flex flex-col">
            <h1 className="text-6xl lg:text-7xl font-light">{title}</h1>
            {subtitle && (
              <p className="mt-4 text-2xl lg:text-3xl font-light text-gray-200">
                {subtitle}
              </p>
            )}
          </div>

          {/* Right Side: Buttons and Description */}
          <div className="md:col-span-6 md:col-start-7 flex items-stretch">
            <div className="bg-black/45 backdrop-blur-lg rounded-3xl p-6 sm:p-8 w-full max-w-xl ml-auto border border-white/10 shadow-[0_18px_45px_rgba(0,0,0,0.45)]">
              <div className="flex flex-col sm:flex-row gap-4">
                {buttons.map((button, index) => (
                  <a
                    key={index}
                    href={button.link}
                    target={button.link.startsWith("http") ? "_blank" : undefined}
                    rel={button.link.startsWith("http") ? "noopener noreferrer" : undefined}
                    className={getButtonClasses(button.variant)}
                  >
                    {button.text}
                  </a>
                ))}
              </div>
              {description && (
                <p className="mt-8 text-base text-gray-200 leading-relaxed whitespace-pre-line">
                  {description}
                </p>
              )}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="w-full flex-shrink-0">
          <hr className="border-t border-white/20 mb-4" />
          <div className="flex justify-between items-center text-sm text-gray-400">
            <span>{footerLeft}</span>
            <span>{footerCenter}</span>
          </div>
        </footer>
      </div>
    </section>
  );
};
