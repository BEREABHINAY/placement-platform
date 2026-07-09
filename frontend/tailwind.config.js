/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        void: "#080B14",
        panel: "#121828",
        panelLight: "#1A2238",
        amber: "#F2B84B",
        cyan: "#4FC3F7",
        okgreen: "#4ADE80",
        mist: "#EDEFF5",
        dim: "#8A93AC",
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      boxShadow: {
        glow: "0 0 40px rgba(255,180,71,0.15)",
        cyanGlow: "0 0 40px rgba(79,216,232,0.15)",
      },
    },
  },
  plugins: [],
};
