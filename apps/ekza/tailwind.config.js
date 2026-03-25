/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        audiowide: ["regular", "sans-serif"],
        ekza: ["var(--font-ekza-body)", "system-ui", "sans-serif"],
        headline: ["var(--font-ekza-headline)", "var(--font-ekza-body)", "sans-serif"],
      },
      colors: {
        ekza: {
          bg: "rgb(var(--ekza-bg) / <alpha-value>)",
          surface: "rgb(var(--ekza-surface) / <alpha-value>)",
          elevated: "rgb(var(--ekza-surface-elevated) / <alpha-value>)",
          muted: "rgb(var(--ekza-surface-muted) / <alpha-value>)",
          card: "rgb(var(--ekza-surface-card) / <alpha-value>)",
          on: "rgb(var(--ekza-on-surface) / <alpha-value>)",
          "on-muted": "rgb(var(--ekza-on-surface-muted) / <alpha-value>)",
          primary: "rgb(var(--ekza-primary) / <alpha-value>)",
          "primary-muted": "rgb(var(--ekza-primary-muted) / <alpha-value>)",
          "on-primary": "rgb(var(--ekza-on-primary) / <alpha-value>)",
          accent: "rgb(var(--ekza-accent) / <alpha-value>)",
          border: "rgb(var(--ekza-border) / <alpha-value>)",
          glass: "rgb(var(--ekza-glass) / <alpha-value>)",
          philosophy: "rgb(var(--ekza-philosophy-bg) / <alpha-value>)",
        },
      },
      boxShadow: {
        "ekza-card": "0 24px 40px -12px rgb(0 0 0 / 0.08)",
        "ekza-card-dark": "0 24px 40px -12px rgb(0 0 0 / 0.45)",
        "ekza-glow": "0 0 32px rgb(var(--ekza-glow) / 0.25)",
      },
    },
  },
  plugins: [],
};
