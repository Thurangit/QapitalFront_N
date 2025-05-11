/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  important: true, // Ceci permet à Tailwind de surcharger les styles MUI
  theme: {
    extend: {},
  },
  plugins: [],
}