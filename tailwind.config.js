/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: [
    "./App.tsx",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        emerald: "#2E7D32",
        sand: "#F5F5DC",
        midnight: "#0D1B2A",
        gold: "#D4AF37",

        sapphire: "#1E3A8A",
        violet: "#8C3C64",
        coral: "#E97C62",
        peach: "#F6A88E",
        cream: "#F7E9DF",
        charcoal: "#3A3A3A",
      },
    },
  },
  plugins: [],
};
