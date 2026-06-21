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
        // Brand palette (Branding.json): vivid orange accent + coral secondary.
        primary: '#FF4C00',
        primaryDark: '#D63F00',
        secondary: '#E56565',
        ember: '#FF6A33',      // warm orange tint used for glows/gradients
        ink: '#262626',        // textPrimary
        surface: '#FFFFFF',
        background: '#F9F9F9',
      },
      fontFamily: {
        // Brand is a single grotesque family; legacy names re-point to it so
        // existing font-cormorant / font-josefin utilities all resolve to Suisse-like Hanken.
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        cormorant: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        josefin: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
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
