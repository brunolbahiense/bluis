import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

const sourceDirectory = fileURLToPath(new URL('./src', import.meta.url))

export default defineConfig({
  resolve: {
    alias: [
      {
        find: /^(lib|locales)(\/.*)?$/,
        replacement: `${sourceDirectory}/$1$2`
      },
      // server-only lança erro fora da condição `react-server` do Next;
      // nos testes (Node puro) ele resolve para um módulo vazio.
      { find: 'server-only', replacement: `${sourceDirectory}/test/empty.ts` }
    ]
  },
  test: {
    include: ['src/**/*.test.ts'],
    environment: 'node'
  }
})
