/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Google dark-mode palette (matches current public/index.html)
        gbg: "#202124",
        gcard: "#303134",
        gtext: "#e8eaed",
        gsub: "#9aa0a6",
        glink: "#8ab4f8",
        gvisited: "#c58af9",
      },
    },
  },
  plugins: [],
};
