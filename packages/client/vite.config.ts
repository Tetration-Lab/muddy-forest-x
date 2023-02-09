import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

export default defineConfig({
  resolve: {
    alias: {
      process: 'process/browser',
    },
  },
  build: {
    sourcemap: true, // TODO: change to false in production
    assetsInlineLimit: 0,
  },
  plugins: [svgr(), react()],
  server: {
    port: 3000,
    fs: {
      strict: false,
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2020',
    },
    exclude: ['@latticexyz/network', '@latticexyz/noise'],
    include: [
      'proxy-deep',
      'ethers/lib/utils',
      'bn.js',
      'js-sha3',
      'hash.js',
      'bech32',
      'long',
      'protobufjs/minimal',
      'debug',
      'is-observable',
      'nice-grpc-web',
      '@improbable-eng/grpc-web',
    ],
  },
})
