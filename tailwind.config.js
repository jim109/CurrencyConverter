/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        'regal-blue': '#1751D0',
        'blue-text': '#4FACFE',
        'gray-text': '#4F4D55',
        'gray-line': '#E6E6E6',
        'gray-text-int': '#7F7D83',
        'gray-box': '#F8F8F8',
        'gray-text-conv': '#88939D',
        'black-text-min': '#4F4D55',
        'black-text-title': '#0A090B',
      },
    },
  },
  plugins: [],
}
