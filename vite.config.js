import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    VITE_API_URI: JSON.stringify(import.meta.env.VITE_API_URI),
    global: "globalThis",
  },
});
