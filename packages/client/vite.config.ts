import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import { comlink } from 'vite-plugin-comlink'
import wasm from 'vite-plugin-wasm'

export default defineConfig({
  build: {
    sourcemap: process.env.NODE_ENV === 'dev',
    assetsInlineLimit: 0,
  },
  plugins: [react(), wasm(), comlink()],
  // worker: {
  //   plugins: [comlink(), wasm()],
  // },
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
