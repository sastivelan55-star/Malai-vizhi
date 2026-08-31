/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#071A2B',
          800: '#0B2D42',
          700: '#0B3948',
        },
        teal: {
          700: '#0F766E',
          500: '#14B8A6',
          400: '#2DD4BF',
        },
        slate: {
          text: '#102A43',
          bg: '#F5F7F8',
        },
        risk: {
          low: '#16A34A',
          moderate: '#F59E0B',
          high: '#DC2626',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
