import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  server:{ 
    port: 5200, 
    strictPort: true,  
    proxy: {
    "/api": {
        target: "http://localhost:4500",
        changeOrigin: true,
        secure: false,
      },
}}});
