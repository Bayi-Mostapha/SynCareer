/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#005EFF',
        label: '#7B7F8E',
        lgray: '#D7E0ED'
      },
      fontFamily: {
        poppins: ['"Poppins"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}