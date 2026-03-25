/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-omoba-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-omoba-sans)", "system-ui", "sans-serif"],
      },
      colors: {
        omoba: {
          void: "#030308",
          abyss: "#0a0818",
          depth: "#120f2a",
          surface: "#1a1535",
          accent: "#22d3ee",
          "accent-dim": "#0891b2",
          gold: "#f0c14b",
          magenta: "#c084fc",
          ember: "#fb7185",
        },
      },
      boxShadow: {
        glow: "0 0 40px rgba(34, 211, 238, 0.25)",
        "glow-gold": "0 0 36px rgba(240, 193, 75, 0.2)",
        glass: "0 8px 32px rgba(0, 0, 0, 0.45)",
      },
      animation: {
        float: "omoba-float 8s ease-in-out infinite",
        pulseSlow: "omoba-pulse 4s ease-in-out infinite",
        shimmer: "omoba-shimmer 3s ease-in-out infinite",
        drift: "omoba-drift 20s linear infinite",
      },
      keyframes: {
        "omoba-float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "omoba-pulse": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.85" },
        },
        "omoba-shimmer": {
          "0%, 100%": { opacity: "0.3", filter: "brightness(1)" },
          "50%": { opacity: "0.7", filter: "brightness(1.2)" },
        },
        "omoba-drift": {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "100% 50%" },
        },
      },
    },
  },
  plugins: [],
};
