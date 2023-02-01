import { defineConfig } from 'windicss/helpers'

export default defineConfig({
  extract: {
    include: ['src/**/*.{html,vue,jsx,tsx,svelte}'],
    exclude: ['node_modules', '.git'],
  },
  /* ... */
})