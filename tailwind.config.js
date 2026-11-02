/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sage: {
          DEFAULT: '#55624F',
          dark: '#434F3E',
          light: '#687761',
        },
        olive: '#7F8F6B',
        terracotta: {
          DEFAULT: '#C76F42',
          hover: '#B35E33',
        },
        sand: '#F5EDE3',
        charcoal: '#2E2E2E',
        cream: '#FCFAF7',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        serif: ['"Playfair Display"', 'serif'],
      }
    },
  },
  plugins: [],
}
