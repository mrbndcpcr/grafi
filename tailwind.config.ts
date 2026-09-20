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
        cream: {
          DEFAULT: "#f7f1e8",
          2: "#efe6d8",
        },
        ink: {
          DEFAULT: "#1a1714",
          soft: "#3d3832",
        },
        accent: "#c45c26",
      },
    },
  },
  plugins: [],
};
export default config;
