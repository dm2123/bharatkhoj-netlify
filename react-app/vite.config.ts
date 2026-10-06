import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Netlify serves from repo root; react-app builds to its own dist.
  // Deploy target decided in migration plan (see README.md).
  base: "./",
});
