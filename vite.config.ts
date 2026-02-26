import vinext from "vinext";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [vinext()],
  optimizeDeps: {
    include: ["react/jsx-runtime", "react/jsx-dev-runtime"],
  },
});
