/// <reference types="vitest/config" />
import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
      "dictionary-pt-files": path.resolve(
        import.meta.dirname,
        "./node_modules/dictionary-pt",
      ),
    },
  },
  worker: {
    format: "es",
  },
  server: {
    watch: {
      usePolling: process.env.DOCKER_DEV === "true",
    },
  },
  test: {
    environment: "jsdom",
    pool: "vmThreads",
    setupFiles: ["./__tests__/setup.ts"],
    globals: true,
    passWithNoTests: true,
  },
});
