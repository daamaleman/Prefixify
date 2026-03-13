/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        appbg: '#0A0F1C',
        cardbg: 'rgba(15, 23, 42, 0.72)',
        neon: '#22D3EE'
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(34, 211, 238, 0.15), 0 12px 32px rgba(15, 23, 42, 0.55)'
      },
      animation: {
        'soft-pulse': 'softPulse 1.2s ease-in-out infinite',
        'card-in': 'cardIn 0.6s ease-out'
      },
      keyframes: {
        softPulse: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(0.98)', opacity: '0.9' }
        },
        cardIn: {
          '0%': { opacity: '0', transform: 'translateY(12px) scale(0.985)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' }
        }
      }
    }
  },
  plugins: []
}
