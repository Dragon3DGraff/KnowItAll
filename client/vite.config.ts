import { VitePWA } from 'vite-plugin-pwa'
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { vitePWAConf } from './vitePWAConf';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA(vitePWAConf),
  ],
  server: {
    open: true,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});
