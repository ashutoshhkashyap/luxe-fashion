/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body:    ['"DM Sans"', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        gold:    { DEFAULT: '#C9A84C', light: '#E2C97E', dark: '#A8843A' },
        obsidian:{ DEFAULT: '#0D0D0D', 50: '#1A1A1A', 100: '#262626' },
        ivory:   { DEFAULT: '#F5F0E8', dark: '#E8E0D0' },
        blush:   '#F2E8E0',
      },
      backgroundImage: {
        'gold-gradient':  'linear-gradient(135deg, #C9A84C 0%, #E2C97E 50%, #A8843A 100%)',
        'dark-gradient':  'linear-gradient(135deg, #0D0D0D 0%, #1A1A1A 100%)',
        'hero-gradient':  'linear-gradient(160deg, #0D0D0D 0%, #1A1208 40%, #261A00 100%)',
      },
      animation: {
        'fade-in':    'fadeIn 0.5s ease-out',
        'slide-up':   'slideUp 0.6s ease-out',
        'slide-right':'slideRight 0.5s ease-out',
        'shimmer':    'shimmer 1.5s infinite',
        'float':      'float 3s ease-in-out infinite',
        'spin-slow':  'spin 8s linear infinite',
      },
      keyframes: {
        fadeIn:    { from: { opacity: 0 },                  to: { opacity: 1 } },
        slideUp:   { from: { opacity: 0, transform: 'translateY(30px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        slideRight:{ from: { opacity: 0, transform: 'translateX(-30px)' }, to: { opacity: 1, transform: 'translateX(0)' } },
        shimmer:   { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        float:     { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
      },
      boxShadow: {
        'gold': '0 4px 24px rgba(201,168,76,0.3)',
        'card': '0 8px 40px rgba(0,0,0,0.12)',
        'card-hover': '0 20px 60px rgba(0,0,0,0.2)',
      },
    },
  },
  plugins: [],
};
