/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0d0d0f",
        cream: "#f5f1ea",
        "accent-red": "#e8432f",
        "accent-blue": "#1e3ed8",
        "accent-yellow": "#f4c01f",
        "accent-pink": "#e85d9e",
        "accent-teal": "#0f7a6b",
        line: "#2e2e2e",
      },
      fontFamily: {
        serif: ["DM Serif Display", "Georgia", "serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
    },
  },
  plugins: [],
};