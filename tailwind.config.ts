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
        "bg-primary": "#080C14",
        "bg-secondary": "#0D1423",
        "accent-primary": "#6366F1",
        "accent-amber": "#F59E0B",
        "text-primary": "#F8FAFC",
        "text-muted": "#64748B",
        success: "#10B981",
        danger: "#EF4444",
      },
      fontFamily: {
        playfair: ["var(--font-playfair)", "serif"],
        dm: ["var(--font-dm-sans)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
