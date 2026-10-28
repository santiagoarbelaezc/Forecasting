/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        obsidian: {
          950: '#000000',
          900: '#0A0A0A',
          850: '#121212',
          800: '#171717',
          700: '#262626',
        },
        crimson: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          accent: '#2563EB',
          glow: '#3B82F6',
        },
        mono: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
          950: '#030712',
        }
      },
      fontFamily: {
        headline: ['"Inter Tight"', 'sans-serif'],
        editorial: ['"Inter Tight"', 'sans-serif'],
        sans: ['"Inter Tight"', 'sans-serif'],
      },
      animation: {
        'draw-svg': 'draw 2s ease-out forwards',
        'fade-up': 'fadeUp 0.8s ease-out both',
        'marquee': 'marquee 25s linear infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      }
    },
  },
  plugins: [],
}
