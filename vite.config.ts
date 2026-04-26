import path from "path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { componentTagger } from "lovable-tagger";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
// Файл public/404.html отдаёт SPA-fallback по схеме Rafrex,
// а декодер в index.html восстанавливает оригинальный URL.
export default defineConfig(({ mode }) => ({
  // GitHub Pages serves project sites from /<repo-name>/
  base: "/holistic-well-being/",
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
}));
