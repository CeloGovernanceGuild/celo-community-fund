import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      include: ['buffer', 'process'],
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
    }),
  ],
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.jsx?$/,
    exclude: []
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
  server: {
    host: true,
    port: process.env.PORT || 3000,
    open: process.env.NODE_ENV !== 'production',
    allowedHosts: true
  },
  preview: {
    host: true,
    port: process.env.PORT || 3000,
    allowedHosts: true
  },
  build: {
    outDir: 'build'
  }
})
