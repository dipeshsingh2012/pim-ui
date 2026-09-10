/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@dipesh.singh/commerce-ui/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@dipesh.singh/proton/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        coffee: {
          50: '#fbf9f6',
          100: '#f5f0ea',
          200: '#ebd9c7',
          300: '#debfa2',
          400: '#cf9f74',
          500: '#bc804c',
          600: '#9e6236',
          700: '#7f4b2a',
          800: '#643922',
          900: '#4a2817',
          950: '#2b160a',
        },
      },
    },
  },
  plugins: [],
};
