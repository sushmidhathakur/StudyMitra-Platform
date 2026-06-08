/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        navy: {
          950: '#03070f',
          900: '#05070f',
          800: '#0a1628',
          700: '#0f2040',
          600: '#162b52',
          500: '#1e3a6e',
        },
        accent: {
          blue: '#4f8ef7',
          green: '#22c55e',
          purple: '#a855f7',
          gold: '#f59e0b',
          cyan: '#06b6d4',
        }
      },
      backgroundImage: {
        'glass': 'linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))',
        'glow-blue': 'radial-gradient(circle at center, rgba(79,142,247,0.15) 0%, transparent 70%)',
        'glow-green': 'radial-gradient(circle at center, rgba(34,197,94,0.12) 0%, transparent 70%)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.4s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(79,142,247,0.3)' },
          '100%': { boxShadow: '0 0 20px rgba(79,142,247,0.6), 0 0 40px rgba(79,142,247,0.3)' },
        },
      },
    },
  },
  plugins: [],
}
