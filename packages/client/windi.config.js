/* eslint-disable no-undef */
import { defineConfig } from 'windicss/helpers'

export default defineConfig({
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
  plugins: [require('@windicss/plugin-scrollbar')],
  extract: {
    include: ['src/**/*.{html,vue,jsx,tsx,svelte}'],
    exclude: ['node_modules', '.git'],
  },

  /* ... */
})
