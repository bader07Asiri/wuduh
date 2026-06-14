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
          DEFAULT: "#0F172A",
          950:     "#0F172A",
          900:     "#1E3A80",
          800:     "#1e40af",
        },
        brand: {
          royal:  "#1E3A80",
          blue:   "#2563EB",
          light:  "#38BDF8",
          cyan:   "#00D4FF",
        },
        silver: {
          DEFAULT: "#CBD5E1",
          light:   "#E2E8F0",
          mid:     "#94A3B8",
          dark:    "#64748B",
        },
        wuduh: {
          primary: "#2563EB",
          accent:  "#38BDF8",
          glow:    "#00D4FF",
          dark:    "#0F172A",
          muted:   "#64748B",
          border:  "#1E3A80",
          gold:    "#00D4FF",
          success: "#10B981",
        },
      },
      fontFamily: {
        arabic: ["Tajawal", "sans-serif"],
        brand:  ["Montserrat", "'Helvetica Neue'", "Arial", "sans-serif"],
        latin:  ["Montserrat", "Inter", "sans-serif"],
        sans:   ["Tajawal", "Montserrat", "Inter", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      boxShadow: {
        card:        "0 2px 16px 0 rgba(0,0,0,0.07)",
        modal:       "0 8px 40px 0 rgba(0,0,0,0.14)",
        glow:        "0 0 24px 0 rgba(37,99,235,0.35)",
        "glow-cyan": "0 0 32px 0 rgba(0,212,255,0.25)",
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #0F172A 0%, #1E3A80 60%, #2563EB 100%)",
        "wuduh-gradient": "linear-gradient(135deg, #0F172A 0%, #1E3A80 60%, #2563EB 100%)",
        "card-gradient":  "linear-gradient(160deg, #1E3A80 0%, #0F172A 100%)",
        "cyan-gradient":  "linear-gradient(135deg, #2563EB, #00D4FF)",
        "light-gradient": "linear-gradient(160deg, #f0f6ff 0%, #e8f2ff 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
