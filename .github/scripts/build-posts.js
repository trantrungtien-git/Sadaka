// .github/scripts/build-posts.js
// Safe build: convert content/posts/*.json -> news/<slug>.html and create content/posts/index.json
// Uses dynamic import for 'marked' (ESM) so it works inside CommonJS environment.

const fs = require("fs");
const path = require("path");
const slugify = require("slugify");

(async () => {
  // dynamic import for marked (ESM)
  const { marked } = await import("marked");

  const postsDir = path.join(process.cwd(), "content", "posts");
  const outDir = path.join(process.cwd(), "news");

  function escapeHtml(s = "") {
    return String(s).replace(
      /[&<>"']/g,
      (m) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        }[m])
    );
  }

  // Ensure output dir exists
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  // If postsDir missing -> create it and write empty index.json, then exit gracefully
  if (!fs.existsSync(postsDir)) {
    console.log("No posts directory found at", postsDir);
    const contentDir = path.join(process.cwd(), "content");
    if (!fs.existsSync(contentDir))
      fs.mkdirSync(contentDir, { recursive: true });
    if (!fs.existsSync(postsDir)) fs.mkdirSync(postsDir, { recursive: true });
    const indexPath = path.join(postsDir, "index.json");
    fs.writeFileSync(indexPath, JSON.stringify([], null, 2));
    console.log(
      "Created empty content/posts and wrote index.json (empty). Exiting."
    );
    process.exit(0);
  }

  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith(".json"));
  const indexMeta = [];

  if (files.length === 0) {
    // write empty index.json and exit normally
    const indexPath = path.join(postsDir, "index.json");
    fs.writeFileSync(indexPath, JSON.stringify([], null, 2));
    console.log("No post JSON files found. Wrote empty index.json. Exiting.");
    process.exit(0);
  }

  for (const fname of files) {
    try {
      const raw = fs.readFileSync(path.join(postsDir, fname), "utf8");
      const j = JSON.parse(raw);

      if (j.published === false) {
        console.log("Skipping unpublished:", fname);
        continue;
      }

      // slug resolution
      let slug = (j.slug && j.slug.trim()) || null;
      if (!slug) {
        if (j.title) slug = slugify(j.title, { lower: true, strict: true });
        else slug = fname.replace(/\.json$/, "");
      }

      const title = j.title || "";
      const dateISO = new Date(j.date || Date.now()).toISOString();
      const thumbnail = j.thumbnail || "";
      const summary = j.summary || "";
      const bodyMd = j.body || "";

      // convert markdown -> html using marked
      const htmlBody = marked.parse(bodyMd);

      // Basic HTML template - customize to match your site
      const outHtml = `<!doctype html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(summary)}">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>
  <nav><a href="/">Trang chủ</a> · <a href="/news.html">Tin tức</a></nav>
  <main class="container">
    <article class="post">
      <h1>${escapeHtml(title)}</h1>
      <time datetime="${dateISO}">${new Date(
        dateISO
      ).toLocaleDateString()}</time>
      ${
        thumbnail
          ? `<figure class="thumb"><img src="${thumbnail}" alt="${escapeHtml(
              title
            )}"></figure>`
          : ""
      }
      <section class="post-body">
        ${htmlBody}
      </section>
    </article>
  </main>
</body>
</html>`;

      const outPath = path.join(outDir, slug + ".html");
      fs.writeFileSync(outPath, outHtml, "utf8");

      indexMeta.push({
        file: fname,
        slug,
        title,
        date: dateISO,
        thumbnail,
        summary,
      });

      console.log("Built", outPath);
    } catch (err) {
      console.error("Error building", fname, err);
    }
  }

  // sort by date desc and write index.json (array of filenames)
  indexMeta.sort((a, b) => new Date(b.date) - new Date(a.date));
  const indexPath = path.join(postsDir, "index.json");
  fs.writeFileSync(
    indexPath,
    JSON.stringify(
      indexMeta.map((i) => i.file),
      null,
      2
    )
  );
  console.log("Wrote", indexPath);
})();
