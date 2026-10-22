import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

const sourceDirectory = fileURLToPath(new URL('./src', import.meta.url))

export default defineConfig({
  resolve: {
    alias: [
      { find: /^(lib|locales)(\/.*)?$/, replacement: `${sourceDirectory}/$1$2` }
    ]
  },
  test: {
    include: ['src/**/*.test.ts'],
    environment: 'node'
  }
})
