import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  base: "/vivek-ai-digital-studio/",
  build: {
    outDir: "dist",
    emptyOutDir: true
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src")
    }
  }
});
