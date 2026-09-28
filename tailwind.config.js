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
        isro: {
          blue900: '#0B2A5B',
          blue700: '#123F8C',
          blue500: '#1D5BBF',
          blue100: '#DDE7F7',
          blue50:  '#EEF3FA',
          orange:  '#F26B21',
          saffron: '#FF9933',
          green:   '#138808',
          bg:      '#F5F7FA',
          surface: '#FFFFFF',
          border:  '#D5DCE6',
          text:    '#1B2430',
          muted:   '#5B6675',
          
          // Status colors
          nominal:  '#138808',
          warning:  '#D98200',
          critical: '#C62828',
          info:     '#123F8C',
        },
        darknavy: {
          bg: '#06101E',
          surface: '#0A1A33',
          border: '#1E293B',
          card: '#0F2342',
        }
      },
      fontFamily: {
        sans: ['Noto Sans', 'Segoe UI', 'Roboto', 'Noto Sans Devanagari', 'system-ui', 'sans-serif'],
        mono: ['Courier New', 'Consolas', 'JetBrains Mono', 'monospace'],
      }
    },
  },
  plugins: [],
}
