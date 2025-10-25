/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: 'class',
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./try.jsx"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
