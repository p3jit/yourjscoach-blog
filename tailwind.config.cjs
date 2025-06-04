/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        customShadowLight: "0px 0px 9px 7px #e2e8f0",
        customShadowDark: "0px 0px 9px 7px #334155"
      },
      animation: {
        'gradient-x': 'gradient-x 3s ease infinite',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        },
      }
    },
    fontFamily: {
      roboto: ['Roboto' , 'sans-serif'],
      sofia: ['Sofia Sans' , 'sans-serif'],
      montserrat: ['Montserrat', 'sans-serif']
    }
  },
  plugins: [require('tailwind-scrollbar')({ nocompatible: true })],
}
