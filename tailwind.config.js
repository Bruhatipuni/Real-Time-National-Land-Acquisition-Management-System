/** @type {import('tailwindcss').Config} */
export default {
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
          card: '#ffffff'
        }
      }
    },
  },
  plugins: [],
}
