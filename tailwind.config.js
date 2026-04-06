/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'space-dark': '#0f172a',
        'space-card': 'rgba(30, 41, 59, 0.7)',
        'neon-blue': '#38bdf8',
        'neon-purple': '#c084fc',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: 1, boxShadow: '0 0 15px rgba(56, 189, 248, 0.5)' },
          '50%': { opacity: .7, boxShadow: '0 0 25px rgba(56, 189, 248, 0.8)' },
        }
      }
    },
  },
  plugins: [],
}
