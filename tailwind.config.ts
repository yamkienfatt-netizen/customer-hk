import scrollbarHide from 'tailwind-scrollbar-hide';
import tailwindcssAnimate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    './@/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        lg: '992px',
        xl: '1280px',
        '1.5xl': '1440px',
        '2xl': '1536px',
      },
    },
    extend: {
      screens: {
        lg: '992px',
        xl: '1280px',
        '2xl': '1536px',
      },
      colors: {
        brand: '#F3F2F0',
        property: '#F8F4EF',
        'black-secondary': '#1D2021',
        'green-primary': '#828077',
        'green-secondary': '#A8ADA1',
        'brown-primary': '#837564',
        'brown-secondary': '#BAAD9B',
        'orange-primary': '#D99200',
        'royal-green': '#3C4F2F',
        border: '#00000029',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: '#1D2021',
        primary: {
          DEFAULT: '#1D2021',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: '#D99200',
          foreground: '#D99200',
        },
        muted: {
          DEFAULT: '#1D2021',
          foreground: '#1D20214D',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      fontSize: {
        h1: ['50px', '40px'],
        h2: ['40px', '50px'],
      },
      fontFamily: {
        Amiko: ['var(--font-amiko)'],
        Bellefair: ['var(--font-bellefair)'],
      },
    },
  },
  plugins: [tailwindcssAnimate, scrollbarHide],
};
