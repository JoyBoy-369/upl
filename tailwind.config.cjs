/** @type {import('tailwindcss').Config} */
import flowbite from "flowbite-react/tailwind";

const defaultTheme = require("tailwindcss/defaultTheme");
module.exports = {
  content: [
    "./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}",
    flowbite.content(),
  ],
  theme: {
    extend: {
      colors: {
        cobalt: {
          50: "#f0f6fe",
          100: "#deebfb",
          200: "#c4def9",
          300: "#9cc8f4",
          400: "#6daaed",
          500: "#4b8be6",
          600: "#356fdb",
          700: "#2d5ac8",
          800: "#274597",
          900: "#274181",
          950: "#1c2a4f",
        },
        "sea-green": {
          50: "#eefff5",
          100: "#d8ffea",
          200: "#b4fed6",
          300: "#7afbb6",
          400: "#38f08e",
          500: "#0fd86e",
          600: "#05b458",
          700: "#088845",
          800: "#0d6e3c",
          900: "#0d5a33",
          950: "#00331a",
        },
        "hint-of-red": {
          50: "#fcfafa",
          100: "#f4ecec",
          200: "#ecdcdc",
          300: "#ddc4c4",
          400: "#c8a1a1",
          500: "#b28181",
          600: "#9c6666",
          700: "#815454",
          800: "#6c4848",
          900: "#5c4040",
          950: "#301f1f",
        },
        "rangoon-green": {
          50: "#f7f7f6",
          100: "#e7e6e0",
          200: "#cecdc1",
          300: "#adad9b",
          400: "#8b8c75",
          500: "#70715b",
          600: "#575948",
          700: "#48493c",
          800: "#3c3d32",
          900: "#33342d",
          950: "#1d1e18",
        },
      },
      fontFamily: {
        sans: ["Inter Variable", "Inter", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), flowbite.plugin()],
};
