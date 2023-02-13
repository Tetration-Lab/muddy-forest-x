// vite.config.ts
import { defineConfig } from "file:///Users/nattapat/SCB10x/muddy/muddy-forest-x/node_modules/vite/dist/node/index.js";
import react from "file:///Users/nattapat/SCB10x/muddy/muddy-forest-x/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { comlink } from "file:///Users/nattapat/SCB10x/muddy/muddy-forest-x/node_modules/vite-plugin-comlink/dist/index.js";
import wasm from "file:///Users/nattapat/SCB10x/muddy/muddy-forest-x/node_modules/vite-plugin-wasm/exports/import.mjs";
var vite_config_default = defineConfig({
  build: {
    sourcemap: true,
    // TODO: change to false in production
    assetsInlineLimit: 0
  },
  plugins: [react(), wasm(), comlink()],
  // worker: {
  //   plugins: [comlink(), wasm()],
  // },
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvbmF0dGFwYXQvU0NCMTB4L211ZGR5L211ZGR5LWZvcmVzdC14L3BhY2thZ2VzL2NsaWVudFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL25hdHRhcGF0L1NDQjEweC9tdWRkeS9tdWRkeS1mb3Jlc3QteC9wYWNrYWdlcy9jbGllbnQvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL25hdHRhcGF0L1NDQjEweC9tdWRkeS9tdWRkeS1mb3Jlc3QteC9wYWNrYWdlcy9jbGllbnQvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xuaW1wb3J0IHN2Z3IgZnJvbSAndml0ZS1wbHVnaW4tc3ZncidcbmltcG9ydCB7IGNvbWxpbmsgfSBmcm9tICd2aXRlLXBsdWdpbi1jb21saW5rJ1xuaW1wb3J0IHdhc20gZnJvbSAndml0ZS1wbHVnaW4td2FzbSdcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgYnVpbGQ6IHtcbiAgICBzb3VyY2VtYXA6IHRydWUsIC8vIFRPRE86IGNoYW5nZSB0byBmYWxzZSBpbiBwcm9kdWN0aW9uXG4gICAgYXNzZXRzSW5saW5lTGltaXQ6IDAsXG4gIH0sXG4gIHBsdWdpbnM6IFtyZWFjdCgpLCB3YXNtKCksIGNvbWxpbmsoKV0sXG4gIC8vIHdvcmtlcjoge1xuICAvLyAgIHBsdWdpbnM6IFtjb21saW5rKCksIHdhc20oKV0sXG4gIC8vIH0sXG4gIHNlcnZlcjoge1xuICAgIHBvcnQ6IDMwMDAsXG4gICAgZnM6IHtcbiAgICAgIHN0cmljdDogZmFsc2UsXG4gICAgfSxcbiAgfSxcbiAgb3B0aW1pemVEZXBzOiB7XG4gICAgZXNidWlsZE9wdGlvbnM6IHtcbiAgICAgIHRhcmdldDogJ2VzMjAyMCcsXG4gICAgfSxcbiAgICBleGNsdWRlOiBbJ0BsYXR0aWNleHl6L25ldHdvcmsnLCAnQGxhdHRpY2V4eXovbm9pc2UnXSxcbiAgICBpbmNsdWRlOiBbXG4gICAgICAncHJveHktZGVlcCcsXG4gICAgICAnZXRoZXJzL2xpYi91dGlscycsXG4gICAgICAnYm4uanMnLFxuICAgICAgJ2pzLXNoYTMnLFxuICAgICAgJ2hhc2guanMnLFxuICAgICAgJ2JlY2gzMicsXG4gICAgICAnbG9uZycsXG4gICAgICAncHJvdG9idWZqcy9taW5pbWFsJyxcbiAgICAgICdkZWJ1ZycsXG4gICAgICAnaXMtb2JzZXJ2YWJsZScsXG4gICAgICAnbmljZS1ncnBjLXdlYicsXG4gICAgICAnQGltcHJvYmFibGUtZW5nL2dycGMtd2ViJyxcbiAgICBdLFxuICB9LFxufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBbVcsU0FBUyxvQkFBb0I7QUFDaFksT0FBTyxXQUFXO0FBRWxCLFNBQVMsZUFBZTtBQUN4QixPQUFPLFVBQVU7QUFFakIsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsT0FBTztBQUFBLElBQ0wsV0FBVztBQUFBO0FBQUEsSUFDWCxtQkFBbUI7QUFBQSxFQUNyQjtBQUFBLEVBQ0EsU0FBUyxDQUFDLE1BQU0sR0FBRyxLQUFLLEdBQUcsUUFBUSxDQUFDO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFJcEMsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sSUFBSTtBQUFBLE1BQ0YsUUFBUTtBQUFBLElBQ1Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxjQUFjO0FBQUEsSUFDWixnQkFBZ0I7QUFBQSxNQUNkLFFBQVE7QUFBQSxJQUNWO0FBQUEsSUFDQSxTQUFTLENBQUMsdUJBQXVCLG1CQUFtQjtBQUFBLElBQ3BELFNBQVM7QUFBQSxNQUNQO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
