// vite.config.ts
import { defineConfig } from "file:///Users/nattapat/SCB10x/muddy/muddy-forest-x/node_modules/vite/dist/node/index.js";
import react from "file:///Users/nattapat/SCB10x/muddy/muddy-forest-x/node_modules/@vitejs/plugin-react/dist/index.mjs";
import svgr from "file:///Users/nattapat/SCB10x/muddy/muddy-forest-x/node_modules/vite-plugin-svgr/dist/index.mjs";
import { comlink } from "file:///Users/nattapat/SCB10x/muddy/muddy-forest-x/node_modules/vite-plugin-comlink/dist/index.js";
import wasm from "file:///Users/nattapat/SCB10x/muddy/muddy-forest-x/node_modules/vite-plugin-wasm/exports/import.mjs";
var vite_config_default = defineConfig({
  resolve: {
    alias: {
      process: "process/browser"
    }
  },
  build: {
    sourcemap: true,
    // TODO: change to false in production
    assetsInlineLimit: 0
  },
  plugins: [svgr(), react(), wasm(), comlink()],
  worker: {
    plugins: [comlink(), wasm()]
  },
  server: {
    port: 3e3,
    fs: {
      strict: false
    }
  },
  optimizeDeps: {
    esbuildOptions: {
      target: "es2020"
    },
    exclude: ["@latticexyz/network", "@latticexyz/noise"],
    include: [
      "proxy-deep",
      "ethers/lib/utils",
      "bn.js",
      "js-sha3",
      "hash.js",
      "bech32",
      "long",
      "protobufjs/minimal",
      "debug",
      "is-observable",
      "nice-grpc-web",
      "@improbable-eng/grpc-web"
    ]
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvbmF0dGFwYXQvU0NCMTB4L211ZGR5L211ZGR5LWZvcmVzdC14L3BhY2thZ2VzL2NsaWVudFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL25hdHRhcGF0L1NDQjEweC9tdWRkeS9tdWRkeS1mb3Jlc3QteC9wYWNrYWdlcy9jbGllbnQvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL25hdHRhcGF0L1NDQjEweC9tdWRkeS9tdWRkeS1mb3Jlc3QteC9wYWNrYWdlcy9jbGllbnQvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xuaW1wb3J0IHN2Z3IgZnJvbSAndml0ZS1wbHVnaW4tc3ZncidcbmltcG9ydCB7IGNvbWxpbmsgfSBmcm9tICd2aXRlLXBsdWdpbi1jb21saW5rJ1xuaW1wb3J0IHdhc20gZnJvbSAndml0ZS1wbHVnaW4td2FzbSdcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICBwcm9jZXNzOiAncHJvY2Vzcy9icm93c2VyJyxcbiAgICB9LFxuICB9LFxuICBidWlsZDoge1xuICAgIHNvdXJjZW1hcDogdHJ1ZSwgLy8gVE9ETzogY2hhbmdlIHRvIGZhbHNlIGluIHByb2R1Y3Rpb25cbiAgICBhc3NldHNJbmxpbmVMaW1pdDogMCxcbiAgfSxcbiAgcGx1Z2luczogW3N2Z3IoKSwgcmVhY3QoKSwgd2FzbSgpLCBjb21saW5rKCldLFxuICB3b3JrZXI6IHtcbiAgICBwbHVnaW5zOiBbY29tbGluaygpLCB3YXNtKCldLFxuICB9LFxuICBzZXJ2ZXI6IHtcbiAgICBwb3J0OiAzMDAwLFxuICAgIGZzOiB7XG4gICAgICBzdHJpY3Q6IGZhbHNlLFxuICAgIH0sXG4gIH0sXG4gIG9wdGltaXplRGVwczoge1xuICAgIGVzYnVpbGRPcHRpb25zOiB7XG4gICAgICB0YXJnZXQ6ICdlczIwMjAnLFxuICAgIH0sXG4gICAgZXhjbHVkZTogWydAbGF0dGljZXh5ei9uZXR3b3JrJywgJ0BsYXR0aWNleHl6L25vaXNlJ10sXG4gICAgaW5jbHVkZTogW1xuICAgICAgJ3Byb3h5LWRlZXAnLFxuICAgICAgJ2V0aGVycy9saWIvdXRpbHMnLFxuICAgICAgJ2JuLmpzJyxcbiAgICAgICdqcy1zaGEzJyxcbiAgICAgICdoYXNoLmpzJyxcbiAgICAgICdiZWNoMzInLFxuICAgICAgJ2xvbmcnLFxuICAgICAgJ3Byb3RvYnVmanMvbWluaW1hbCcsXG4gICAgICAnZGVidWcnLFxuICAgICAgJ2lzLW9ic2VydmFibGUnLFxuICAgICAgJ25pY2UtZ3JwYy13ZWInLFxuICAgICAgJ0BpbXByb2JhYmxlLWVuZy9ncnBjLXdlYicsXG4gICAgXSxcbiAgfSxcbn0pXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQW1XLFNBQVMsb0JBQW9CO0FBQ2hZLE9BQU8sV0FBVztBQUNsQixPQUFPLFVBQVU7QUFDakIsU0FBUyxlQUFlO0FBQ3hCLE9BQU8sVUFBVTtBQUVqQixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxTQUFTO0FBQUEsSUFDWDtBQUFBLEVBQ0Y7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNMLFdBQVc7QUFBQTtBQUFBLElBQ1gsbUJBQW1CO0FBQUEsRUFDckI7QUFBQSxFQUNBLFNBQVMsQ0FBQyxLQUFLLEdBQUcsTUFBTSxHQUFHLEtBQUssR0FBRyxRQUFRLENBQUM7QUFBQSxFQUM1QyxRQUFRO0FBQUEsSUFDTixTQUFTLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztBQUFBLEVBQzdCO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixJQUFJO0FBQUEsTUFDRixRQUFRO0FBQUEsSUFDVjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLGNBQWM7QUFBQSxJQUNaLGdCQUFnQjtBQUFBLE1BQ2QsUUFBUTtBQUFBLElBQ1Y7QUFBQSxJQUNBLFNBQVMsQ0FBQyx1QkFBdUIsbUJBQW1CO0FBQUEsSUFDcEQsU0FBUztBQUFBLE1BQ1A7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
