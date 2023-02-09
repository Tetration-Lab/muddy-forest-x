// vite.config.ts
import { defineConfig } from "file:///Users/nattapat/SCB10x/muddy-forest-x/node_modules/vite/dist/node/index.js";
import react from "file:///Users/nattapat/SCB10x/muddy-forest-x/node_modules/@vitejs/plugin-react/dist/index.mjs";
import svgr from "file:///Users/nattapat/SCB10x/muddy-forest-x/node_modules/vite-plugin-svgr/dist/index.mjs";
var vite_config_default = defineConfig({
  build: {
    sourcemap: true,
    // TODO: change to false in production
    assetsInlineLimit: 0
  },
  plugins: [svgr(), react()],
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvbmF0dGFwYXQvU0NCMTB4L211ZGR5LWZvcmVzdC14L3BhY2thZ2VzL2NsaWVudFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL25hdHRhcGF0L1NDQjEweC9tdWRkeS1mb3Jlc3QteC9wYWNrYWdlcy9jbGllbnQvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL25hdHRhcGF0L1NDQjEweC9tdWRkeS1mb3Jlc3QteC9wYWNrYWdlcy9jbGllbnQvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xuaW1wb3J0IHN2Z3IgZnJvbSAndml0ZS1wbHVnaW4tc3ZncidcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgYnVpbGQ6IHtcbiAgICBzb3VyY2VtYXA6IHRydWUsIC8vIFRPRE86IGNoYW5nZSB0byBmYWxzZSBpbiBwcm9kdWN0aW9uXG4gICAgYXNzZXRzSW5saW5lTGltaXQ6IDAsXG4gIH0sXG4gIHBsdWdpbnM6IFtzdmdyKCksIHJlYWN0KCldLFxuICBzZXJ2ZXI6IHtcbiAgICBwb3J0OiAzMDAwLFxuICAgIGZzOiB7XG4gICAgICBzdHJpY3Q6IGZhbHNlLFxuICAgIH0sXG4gIH0sXG4gIG9wdGltaXplRGVwczoge1xuICAgIGVzYnVpbGRPcHRpb25zOiB7XG4gICAgICB0YXJnZXQ6ICdlczIwMjAnLFxuICAgIH0sXG4gICAgZXhjbHVkZTogWydAbGF0dGljZXh5ei9uZXR3b3JrJywgJ0BsYXR0aWNleHl6L25vaXNlJ10sXG4gICAgaW5jbHVkZTogW1xuICAgICAgJ3Byb3h5LWRlZXAnLFxuICAgICAgJ2V0aGVycy9saWIvdXRpbHMnLFxuICAgICAgJ2JuLmpzJyxcbiAgICAgICdqcy1zaGEzJyxcbiAgICAgICdoYXNoLmpzJyxcbiAgICAgICdiZWNoMzInLFxuICAgICAgJ2xvbmcnLFxuICAgICAgJ3Byb3RvYnVmanMvbWluaW1hbCcsXG4gICAgICAnZGVidWcnLFxuICAgICAgJ2lzLW9ic2VydmFibGUnLFxuICAgICAgJ25pY2UtZ3JwYy13ZWInLFxuICAgICAgJ0BpbXByb2JhYmxlLWVuZy9ncnBjLXdlYicsXG4gICAgXSxcbiAgfSxcbn0pXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQWlWLFNBQVMsb0JBQW9CO0FBQzlXLE9BQU8sV0FBVztBQUNsQixPQUFPLFVBQVU7QUFFakIsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsT0FBTztBQUFBLElBQ0wsV0FBVztBQUFBO0FBQUEsSUFDWCxtQkFBbUI7QUFBQSxFQUNyQjtBQUFBLEVBQ0EsU0FBUyxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUM7QUFBQSxFQUN6QixRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixJQUFJO0FBQUEsTUFDRixRQUFRO0FBQUEsSUFDVjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLGNBQWM7QUFBQSxJQUNaLGdCQUFnQjtBQUFBLE1BQ2QsUUFBUTtBQUFBLElBQ1Y7QUFBQSxJQUNBLFNBQVMsQ0FBQyx1QkFBdUIsbUJBQW1CO0FBQUEsSUFDcEQsU0FBUztBQUFBLE1BQ1A7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
