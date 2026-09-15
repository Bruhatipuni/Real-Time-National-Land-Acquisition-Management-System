/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bhu: {
          navy: '#0f172a',
          blue: '#1e3a8a',
          orange: '#ea580c',
          saffron: '#f97316',
          green: '#15803d',
          emerald: '#059669',
          gold: '#d97706',
          lightbg: '#f8fafc',
          card: '#ffffff',
          darkbg: '#090d16',
          darkcard: '#0f172a',
          darkborder: '#1e293b'
        },
        gov: {
          saffron: '#FF9933',
          white: '#FFFFFF',
          green: '#138808',
          ashoka: '#000080',
          darkBlue: '#0c1a32',
          surface: '#f8fafc',
          border: '#e2e8f0'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['Space Grotesk', 'monospace', 'Courier New']
      },
      boxShadow: {
        'gov-sm': '0 1px 3px 0 rgba(15, 23, 42, 0.05), 0 1px 2px 0 rgba(15, 23, 42, 0.03)',
        'gov-card': '0 4px 16px -2px rgba(15, 23, 42, 0.06), 0 2px 6px -1px rgba(15, 23, 42, 0.03)',
        'gov-hover': '0 12px 28px -4px rgba(15, 23, 42, 0.1), 0 4px 12px -2px rgba(15, 23, 42, 0.05)',
        'glow-saffron': '0 0 20px -3px rgba(249, 115, 22, 0.35)',
        'glow-emerald': '0 0 20px -3px rgba(16, 185, 129, 0.35)'
      }
    },
  },
  plugins: [],
}
