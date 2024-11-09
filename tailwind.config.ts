import type { Config } from "tailwindcss";

const colors = require("tailwindcss/colors");

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      zIndex: {
        "100": "100",
      },

      colors: {
        "main-color": "#F6FBF4",
        "main-button": "#0B9563",
        "sub-color": "#DDF7E5",
        "sub-button": "rgb(254 220 209)",
        "bottom-border-color": "#EEEEEE",
      },
    },
  },
  plugins: [],
};
