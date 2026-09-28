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
        // Semantic Token Palette
        'text-on-dark': '#F1F5F9',
        'text-on-dark-muted': '#B8C4D6',
        'accent-on-dark': '#FFA366',
        'link-on-dark': '#7DD3FC',
        'text-on-light': '#1B2430',
        'text-on-light-muted': '#4A5568',

        // Status Colors (Dark / Light)
        status: {
          nominalDark: '#4ADE80',
          warningDark: '#FBBF24',
          criticalDark: '#FF6B6B',
          infoDark: '#7DD3FC',
          nominalLight: '#0F6B06',
          warningLight: '#8A5300',
          criticalLight: '#B71C1C',
          infoLight: '#123F8C',
        },

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
          muted:   '#4A5568',
        },
        darknavy: {
          bg: '#06101E',
          surface: '#0A1A33',
          border: '#1E293B',
          card: '#0F2342',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans', 'Segoe UI', 'Roboto', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'Courier New', 'monospace'],
      }
    },
  },
  plugins: [],
}
