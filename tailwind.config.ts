import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      colors: {
        brown: {
          light: "#B9B87A",
          DEFAULT: "#996439",
          dark: "#523C22",
        },
        beige: "#BEA867",
        olive: "#A2A14A",
        darkOlive: "#655C38",
        white: "#F9F8F4",
        black: "#51493D",
      },
      fontFamily: {
        header: ["Montserrat", "sans-serif"],
        body: ["Karla", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
