import { coverageConfigDefaults, defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./vitest.setup.ts",
    coverage: {
      all: true,
      exclude: ["next.config.mjs", "app/layout.tsx", ...coverageConfigDefaults.exclude],
      reporter: ["text", "json-summary", "json", "html"],
    },
  },
});
