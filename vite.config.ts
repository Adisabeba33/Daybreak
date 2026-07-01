/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// On GitHub Pages the app is served from https://<user>.github.io/Daybreak/,
// so production assets must be prefixed with the repo name. Local dev stays at "/".
export default defineConfig(({ command }) => ({
  base: command === "build" ? "/Daybreak/" : "/",
  plugins: [react()],
  test: {
    globals: true,
    environment: "node",
  },
}));
