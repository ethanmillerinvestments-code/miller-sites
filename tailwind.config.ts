import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#06091e",
          light: "#0c1230",
          lighter: "#131d42",
        },
        electric: {
          DEFAULT: "#7c6fff",
          dark: "#5c52d5",
          light: "#a89fff",
        },
        cyan: {
          brand: "#00e5ff",
        },
        gold: {
          DEFAULT: "#fbbf24",
          light: "#fcd34d",
        },
        violet: {
          brand: "#c165ff",
        },
      },
      fontFamily: {
        sans: ["Bricolage Grotesque", "system-ui", "sans-serif"],
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "float-delayed": "float 6s ease-in-out 3s infinite",
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
        "spin-slow": "spin 20s linear infinite",
        "shimmer": "shimmer 3s ease-in-out infinite",
        "gradient-shift": "gradient-shift 8s ease infinite",
        "breathe": "breathe 4s ease-in-out infinite",
        "shine-sweep": "shine-sweep 3s ease-in-out infinite",
        "border-glow": "border-glow 3s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.3" },
          "50%": { opacity: "0.7" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        breathe: {
          "0%, 100%": { transform: "scale(1)", opacity: "0.6" },
          "50%": { transform: "scale(1.05)", opacity: "1" },
        },
        "shine-sweep": {
          "0%": { left: "-100%" },
          "50%, 100%": { left: "100%" },
        },
        "border-glow": {
          "0%, 100%": { borderColor: "rgba(124,111,255,0.3)" },
          "50%": { borderColor: "rgba(193,101,255,0.6)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
