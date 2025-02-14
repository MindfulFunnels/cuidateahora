/** @type {import('tailwindcss').Config} */
import animations from "@midudev/tailwind-animations";
import clientData from "./src/data/config";
import typography from "@tailwindcss/typography";

const { colors } = clientData;
export default {
  content: [
    "./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}",
    "./node_modules/flowbite/**/*.js",
  ],
  theme: {
    extend: {
      colors: colors,
      animation: {
        "spin-clockwise-infinite": "spin-clockwise 1s linear infinite",
      },
    },
  },
  plugins: [animations, require("flowbite/plugin"), typography],
};
