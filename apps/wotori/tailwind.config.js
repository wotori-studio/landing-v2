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
        wotori: ["var(--font-wotori-body)", "system-ui", "sans-serif"],
        headline: [
          "var(--font-wotori-headline)",
          "var(--font-wotori-body)",
          "sans-serif",
        ],
      },
      colors: {
        wotori: {
          accent: "#00e4af",
          glow: "#16aef0",
        },
      },
      boxShadow: {
        "wotori-glow": "0 0 40px rgba(0, 228, 175, 0.22)",
        "wotori-card": "0 20px 50px -12px rgba(15, 23, 42, 0.12)",
        "wotori-card-hover":
          "0 28px 60px -12px rgba(22, 174, 240, 0.18)",
      },
    },
  },
  plugins: [],
};
