/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['src/**/*.{vue,html,jsx,tsx}'],
  theme: {
    extend: {
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
