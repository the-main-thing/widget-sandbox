import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'

// https://vitejs.dev/config/
export default defineConfig(async ({ command, mode }) => {
  if (command === 'build') {
    return {
      mode: 'production',
      plugins: [preact()],
      envPrefix: 'PUBLIC_',
      build: {
        lib: {
          name: 'sdk',
          formats: ['iife' as const],
          entry: './src/index.ts',
          fileName: () => 'sdk.js',
        },
        outDir: './dist',
        emptyOutDir: true,
      },
    }
  }
  return {
    envPrefix: 'PUBLIC_',
    plugins: [preact()],
  }
})
