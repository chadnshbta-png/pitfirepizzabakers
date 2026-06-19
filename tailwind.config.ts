import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Official Pizza Hut red — used as an accent, not everywhere.
        primary: '#C8102E',
        primaryDark: '#8A0A20',
        ember: '#E23744',
        background: '#000000',
      },
      fontFamily: {
        cormorant: ['var(--font-cormorant)', 'Georgia', 'serif'],
        josefin: ['var(--font-josefin)', 'sans-serif'],
      },
      keyframes: {
        scrollLine: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(300%)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        floaty: {
          '0%,100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-18px) rotate(3deg)' },
        },
        spinSlow: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        steam: {
          '0%': { transform: 'translateY(0) scaleX(1)', opacity: '0' },
          '15%': { opacity: '0.5' },
          '100%': { transform: 'translateY(-120px) scaleX(2.2)', opacity: '0' },
        },
      },
      animation: {
        'scroll-line': 'scrollLine 2s ease-in-out infinite',
        'fade-up': 'fadeUp 0.8s ease forwards',
        shimmer: 'shimmer 3s linear infinite',
        floaty: 'floaty 7s ease-in-out infinite',
        'spin-slow': 'spinSlow 60s linear infinite',
        steam: 'steam 5s ease-out infinite',
      },
    },
  },
  plugins: [],
}

export default config
