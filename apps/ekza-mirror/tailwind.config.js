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
        display: ["var(--font-mirror-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-mirror-sans)", "system-ui", "sans-serif"],
      },
      colors: {
        mirror: {
          void: "#07070C",
          deep: "#0D0D16",
          surface: "#14141F",
          chrome: "#E9ECF5",
          silver: "#A8B0C4",
          violet: "#7C5CFF",
          rose: "#FF5FA2",
          aqua: "#35E8FF",
        },
      },
      backgroundImage: {
        prism: "linear-gradient(100deg, #7C5CFF 0%, #FF5FA2 52%, #35E8FF 100%)",
      },
      boxShadow: {
        prism: "0 0 44px rgba(124, 92, 255, 0.28)",
        "prism-rose": "0 0 40px rgba(255, 95, 162, 0.22)",
        "prism-aqua": "0 0 40px rgba(53, 232, 255, 0.2)",
        glass: "0 24px 60px rgba(0, 0, 0, 0.5)",
      },
      animation: {
        float: "mir-float 9s ease-in-out infinite",
        pulseSlow: "mir-pulse 4.5s ease-in-out infinite",
        sweep: "mir-sweep 6s ease-in-out infinite",
        drift: "mir-drift 24s linear infinite",
      },
      keyframes: {
        "mir-float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "mir-pulse": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.9" },
        },
        "mir-sweep": {
          "0%, 100%": { transform: "translateX(-120%)" },
          "50%": { transform: "translateX(120%)" },
        },
        "mir-drift": {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "100% 50%" },
        },
      },
    },
  },
  plugins: [],
};
