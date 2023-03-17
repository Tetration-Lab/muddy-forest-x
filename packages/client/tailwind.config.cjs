/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['src/**/*.{vue,html,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 5s linear infinite',
      },
      colors: {
        custom: {
          DEFAULT: '#10B981',
          light: '#D1FAE5',
        },
      },
    },
  },
  plugins: [],
}
