/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#F7F5FF',
          100: '#F0EBFF',
          200: '#E4DAFF',
          500: '#7B4DFF',
          600: '#6D47C4',
          700: '#5A36B3',
          800: '#4A2D96',
          900: '#17132D',
        },
        surface: {
          DEFAULT: '#F8F9FA',
          card: '#FFFFFF',
          muted: '#F1F3F5',
        },
      },
      fontFamily: {
        sans: [
          'Plus Jakarta Sans',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
      borderRadius: {
        card: '0.75rem',
        input: '0.5rem',
        button: '0.5rem',
      },
      boxShadow: {
        card: '0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.06)',
        elevated: '0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.05)',
      },
    },
  },
  plugins: [],
};
