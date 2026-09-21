/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        lincoln: {
          50:  '#FEF2F2',
          100: '#FDE8E9',
          200: '#FBCFD1',
          300: '#F7A8AB',
          400: '#EF6E73',
          500: '#E01E26',
          600: '#C8191F',
          700: '#A61418',
          800: '#821013',
          900: '#5C0B0D',
          950: '#350607',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};