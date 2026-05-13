import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        cream: "#fffaf2",
        mint: "#8BC7A3",
        peach: "#FFD8B5",
        ink: "#2f3e46"
      }
    }
  },
  plugins: []
};

export default config;
