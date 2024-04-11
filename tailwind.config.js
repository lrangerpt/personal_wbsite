/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        titillium: ["Titillium Web", "sans-serif"],
        ubuntu: ["Ubuntu", "sans-serif"],
      },
      colors: {
        'inputBg': 'rgba(30,30,30,0.85)'
      },
    },
  },
  plugins: [],
};
