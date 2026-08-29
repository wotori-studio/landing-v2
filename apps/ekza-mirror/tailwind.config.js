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
          void: "#07080A",
          deep: "#0C0F0C",
          surface: "#131813",
          chrome: "#EDF2E9",
          silver: "#9AA79A",
          /* one hue, three chroma levels — loudness is chroma, not hue */
          acid: "#B6FF1A",
          toxic: "#6EF244",
          bone: "#E7FFB0",
        },
      },
      backgroundImage: {
        prism: "linear-gradient(100deg, #6EF244 0%, #B6FF1A 55%, #E7FFB0 100%)",
      },
      boxShadow: {
        /* the greens run ~2.2x brighter than the old prism, so every glow
           alpha is roughly halved to keep the same apparent bloom */
        prism: "0 0 44px rgba(182, 255, 26, 0.14)",
        "prism-toxic": "0 0 40px rgba(110, 242, 68, 0.12)",
        "prism-bone": "0 0 40px rgba(231, 255, 176, 0.1)",
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
