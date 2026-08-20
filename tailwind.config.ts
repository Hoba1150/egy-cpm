import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#07090e",
        foreground: "#f3f4f6",
        garage: {
          950: "#050608",
          900: "#090c12",
          850: "#0e121a",
          800: "#141a26",
          750: "#1b2333",
          700: "#242f44",
          600: "#33415c",
        },
        neon: {
          cyan: "#00f0ff",
          blue: "#3b82f6",
          purple: "#a855f7",
          pink: "#ec4899",
          green: "#10b981",
          emerald: "#00ff88",
          red: "#ef4444",
          amber: "#f59e0b",
        },
      },
      boxShadow: {
        "glow-cyan": "0 0 20px rgba(0, 240, 255, 0.35), 0 0 40px rgba(0, 240, 255, 0.15)",
        "glow-cyan-sm": "0 0 10px rgba(0, 240, 255, 0.3)",
        "glow-purple": "0 0 20px rgba(168, 85, 247, 0.35), 0 0 40px rgba(168, 85, 247, 0.15)",
        "glow-green": "0 0 20px rgba(16, 185, 129, 0.35), 0 0 40px rgba(16, 185, 129, 0.15)",
        "glow-red": "0 0 20px rgba(239, 68, 68, 0.35), 0 0 40px rgba(239, 68, 68, 0.15)",
        "glow-amber": "0 0 20px rgba(245, 158, 11, 0.35), 0 0 40px rgba(245, 158, 11, 0.15)",
        "hud-card": "0 8px 32px 0 rgba(0, 0, 0, 0.6), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)",
      },
      backgroundImage: {
        "cyber-grid": "linear-gradient(to right, rgba(0, 240, 255, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 240, 255, 0.05) 1px, transparent 1px)",
        "carbon-pattern": "radial-gradient(#141a26 15%, transparent 16%), radial-gradient(#141a26 15%, transparent 16%)",
        "garage-gradient": "linear-gradient(135deg, rgba(14, 18, 26, 0.95) 0%, rgba(9, 12, 18, 0.98) 100%)",
        "neon-glow-cyan": "radial-gradient(circle at 50% 50%, rgba(0, 240, 255, 0.12) 0%, transparent 70%)",
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { opacity: "1", filter: "drop-shadow(0 0 15px rgba(0, 240, 255, 0.6))" },
          "50%": { opacity: "0.7", filter: "drop-shadow(0 0 5px rgba(0, 240, 255, 0.2))" },
        },
        speedScan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
      },
      animation: {
        "pulse-glow": "pulseGlow 3s ease-in-out infinite",
        "speed-scan": "speedScan 4s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
