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
      },
    },
  },
  plugins: [],
};
export default config;
