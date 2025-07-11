import { defineConfig } from "vitest/config";

export default defineConfig({
  base: process.env.NODE_ENV === "production" ? "/front_6th_chapter1-1/" : "/",
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.js",
    exclude: ["**/e2e/**", "**/*.e2e.spec.js", "**/node_modules/**"],
    poolOptions: {
      threads: {
        singleThread: true,
      },
    },
  },
});
