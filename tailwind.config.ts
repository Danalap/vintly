import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warm, earthy palette for secondhand/vintage vibe
        cream: {
          50: "#FEFDFB",
          100: "#FDF9F3",
          200: "#FAF3E8",
          300: "#F5E6D3",
          400: "#E8D4BC",
        },
        terracotta: {
          400: "#D4847C",
          500: "#C76E64",
          600: "#B85A50",
        },
        sage: {
          300: "#B5C4B1",
          400: "#9DB396",
          500: "#7A9A6F",
          600: "#5C7A52",
        },
        charcoal: {
          700: "#3D3D3D",
          800: "#2A2A2A",
          900: "#1A1A1A",
        },
        sand: {
          100: "#F7F4EF",
          200: "#EDE7DD",
          300: "#DED5C8",
        },
      },
      fontFamily: {
        display: ["Playfair Display", "Georgia", "serif"],
        sans: ["DM Sans", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-up": "fadeUp 0.5s ease-out forwards",
        "fade-in": "fadeIn 0.3s ease-out forwards",
        "slide-in": "slideIn 0.4s ease-out forwards",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideIn: {
          "0%": { opacity: "0", transform: "translateX(-10px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
