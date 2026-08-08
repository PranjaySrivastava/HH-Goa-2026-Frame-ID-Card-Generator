/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        sea: {
          deep: "#081A20",
          mid: "#0F2E38",
          line: "#1B4550"
        },
        hh: {
          green: "#0E6B3A",
          pink: "#FF2EA6"
        },
        coral: {
          DEFAULT: "#FF6B4A",
          dim: "#c9502f",
          light: "#FF9C82"
        },
        gold: {
          DEFAULT: "#FFC857",
          light: "#FFDD94"
        },
        foam: "#4ECDC4",
        sand: {
          DEFAULT: "#F5F1E6",
          dim: "#C9C3B3"
        },
        ink: "#06141A"
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"]
      },
      boxShadow: {
        hard: "0 18px 40px -12px rgba(0,0,0,0.55)"
      },
      borderRadius: {
        xl2: "22px"
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        }
      },
      animation: {
        fadeUp: "fadeUp 0.6s ease both"
      }
    }
  },
  plugins: []
};
