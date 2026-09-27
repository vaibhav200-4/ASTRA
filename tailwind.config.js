/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        darkbg: '#0a0e1a',
        navy: {
          950: '#040914',
          900: '#080e1e',
          850: '#0d1527',
          800: '#111c35',
          700: '#1a294b',
          600: '#243763',
          500: '#344c84',
        },
        saffron: {
          600: '#d96200',
          500: '#f58220',
          400: '#ff9933',
          300: '#ffb870',
          100: '#ffebd6',
        },
        cyan: {
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
        },
        emerald: {
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
        },
        amber: {
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        },
        red: {
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Space Grotesk', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Space Mono', 'monospace'],
        display: ['Space Grotesk', 'Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
