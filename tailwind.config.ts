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
      colors: {
        "main-color": "#f6fbf4",
        "main-button": "#0B9563",
        "sub-color": "#DDF7E5",
        "sub-button": "#FFDCD1",
        "bottom-border-color": "#EEEEEE",
      },
    },
  },
  plugins: [],
};
