// vite.config.js
import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        recruit: resolve(__dirname, "pages/recruit.html"),
        about: resolve(__dirname, "pages/about.html"),
        contact: resolve(__dirname, "pages/contact.html"),
        // XÓA DÒNG NÀY ĐI: admin: resolve(__dirname, 'admin/index.html'),
      },
    },
  },
});
