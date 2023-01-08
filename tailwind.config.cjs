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
      }
    },
    fontFamily: {
      roboto: ['Roboto' , 'sans-serif']
    }
  },
  plugins: [],
}
