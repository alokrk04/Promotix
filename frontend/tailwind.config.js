/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        violet: { DEFAULT: '#7C3AED', light: '#9F7AEA' },
        magenta: '#EC4899',
        cyan: { DEFAULT: '#06B6D4', light: '#22D3EE' },
        green: '#4ADE80',
        frost: '#1E293B',
        slate: { DEFAULT: '#64748B', dark: '#94A3B8' },
      },
      fontFamily: {
        jakarta: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
