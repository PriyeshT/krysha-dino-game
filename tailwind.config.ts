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
        background: "var(--background)",
        foreground: "var(--foreground)",
        dino: {
          green: "#16A34A",
          red: "#DC2626",
          purple: "#7C3AED",
          gold: "#F59E0B",
        },
      },
      fontFamily: {
        magic: ['"Fredoka One"', "cursive"],
        body: ['"Nunito"', "sans-serif"],
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        bounce_magic: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.15)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-6deg)" },
          "50%": { transform: "rotate(6deg)" },
        },
        sparkle: {
          "0%": { opacity: "0", transform: "scale(0)" },
          "50%": { opacity: "1", transform: "scale(1.2)" },
          "100%": { opacity: "0", transform: "scale(0)" },
        },
      },
      animation: {
        fadeInUp: "fadeInUp 0.35s ease-out both",
        float: "float 3s ease-in-out infinite",
        bounce_magic: "bounce_magic 0.8s ease-in-out infinite",
        wiggle: "wiggle 0.5s ease-in-out infinite",
        sparkle: "sparkle 1.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
