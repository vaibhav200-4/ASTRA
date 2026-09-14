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
          950: '#041021',
          900: '#071B33',
          800: '#0B2545',
          700: '#133663',
          600: '#174EA6',
          500: '#2878C8',
          400: '#4895E4',
        },
        saffron: {
          600: '#E06D0F',
          500: '#F58220',
          400: '#FF9933',
          100: '#FEF3E7',
        },
        space: {
          bg: '#F4F7FA',
          panel: '#FFFFFF',
          text: '#152238',
          muted: '#667085',
          border: '#D0D7DE',
          darkbg: '#051325',
          darkpanel: '#0A1E38',
          darkborder: '#1E3A5F',
        },
        status: {
          success: '#159447',
          warning: '#F4A100',
          critical: '#D32F2F',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'Fira Code', 'Monaco', 'monospace'],
      }
    },
  },
  plugins: [],
}
