import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig(({ mode }) => {
  const isGH = mode === "gh";

  return {
    base: isGH ? "/SADAKA_Landing_Page/" : "/", // Vercel dùng "/"
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, "index.html"),
          about: resolve(__dirname, "pages/about.html"),
          blog: resolve(__dirname, "pages/blog.html"),
          blog_detail: resolve(__dirname, "pages/blog_detail.html"),
          contact: resolve(__dirname, "pages/contact.html"),
          recruit: resolve(__dirname, "pages/recruit.html"),
          training: resolve(__dirname, "pages/training.html"),
          job_detail: resolve(__dirname, "pages/job_detail.html"),
        },
      },
    },
  };
});
