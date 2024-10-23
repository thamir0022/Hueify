import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      // Proxy requests starting with /api/colors to csscolorsapi.com
      "/api/colors": {
        target: "https://csscolorsapi.com",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api\/colors/, "/api/colors"), // Keep the color-specific paths
      },
      // Proxy other /api requests to localhost:3000
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
