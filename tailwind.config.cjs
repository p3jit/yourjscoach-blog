/** @type {import('tailwindcss').Config} */
// const colors = require('tailwindcss/colors');

module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            maxWidth: '100%', // add required value here
          }
        },
        zincLight: {
          css: {
            "--tw-prose-body": theme("colors.zinc.800"),
            "--tw-prose-headings": theme("colors.zinc.900"),
            "--tw-prose-links": theme("colors.zinc.700"),
            "--tw-prose-bold": theme("colors.zinc.900"),
            "--tw-prose-code": theme("colors.zinc.800"),
            "--tw-prose-pre-bg": theme("colors.zinc.100"),
            "--tw-prose-pre-code": theme("colors.zinc.900"),
            "--tw-prose-quote-borders": theme("colors.zinc.300"),
          },
        },
        zincDark: {
          css: {
            "--tw-prose-body": theme("colors.zinc.300"),
            "--tw-prose-headings": theme("colors.zinc.100"),
            "--tw-prose-links": theme("colors.zinc.200"),
            "--tw-prose-bold": theme("colors.zinc.100"),
            "--tw-prose-code": theme("colors.zinc.200"),
            "--tw-prose-pre-bg": theme("colors.zinc.800"),
            "--tw-prose-pre-code": theme("colors.zinc.100"),
            "--tw-prose-quote-borders": theme("colors.zinc.700"),
          },
        },
      }),
      // colors: {
      //   // For future use
      //   yjs: {
      //     // Main branding colors
      //     primary: colors.indigo[600],
      //     "primary-light": colors.indigo[400],
      //     "primary-dark": colors.indigo[800],
      //     secondary: colors.blue[500],
      //     "secondary-light": colors.blue[300],
      //     "secondary-dark": colors.blue[700],
      //     accent: colors.emerald[500],
      //     warning: colors.amber[500],
      //     danger: colors.rose[500],
      //     // Background and foreground
      //     background: colors.zinc[50], // very light background
      //     "background-secondary": colors.zinc[600], // secondary background
      //     "background-dark": colors.zinc[900], // dark background for dark mode
      //     foreground: colors.zinc[700], // main text color
      //     "foreground-light": colors.zinc[50], // text on dark backgrounds
      //   },
      // },
      boxShadow: {
        customShadowLight: "0px 0px 9px 7px #e2e8f0",
        customShadowDark: "0px 0px 9px 7px #334155",
      },
      animation: {
        "gradient-x": "gradient-x 3s ease infinite",
      },
      keyframes: {
        "gradient-x": {
          "0%, 100%": { "background-position": "0% 50%" },
          "50%": { "background-position": "100% 50%" },
        },
      },
    },
    fontFamily: {
      roboto: ["Roboto", "sans-serif"],
      sofia: ["Sofia Sans", "sans-serif"],
      montserrat: ["Montserrat", "sans-serif"],
    },
  },
  plugins: [
    require("tailwind-scrollbar")({
      nocompatible: true,
    }),
    require("@tailwindcss/typography"),
  ],
};
