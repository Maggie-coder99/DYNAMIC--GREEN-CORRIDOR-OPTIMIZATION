/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
        display: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: {
          950: '#070b12',
          900: '#0b1220',
          800: '#111b2e',
          700: '#18263f',
          600: '#243552',
        },
        pulse: {
          red: '#e11d2e',
          amber: '#f59e0b',
          green: '#16a34a',
          cyan: '#22d3ee',
        },
      },
      boxShadow: {
        panel: '0 18px 40px rgba(0,0,0,0.35)',
      },
    },
  },
  plugins: [],
};
