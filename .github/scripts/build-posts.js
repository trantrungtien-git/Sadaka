// Requires: npm i marked front-matter slugify
const fs = require("fs");
const path = require("path");
const marked = require("marked");
const slugify = require("slugify");

const postsDir = path.join(process.cwd(), "content", "posts");
const outDir = path.join(process.cwd(), "news");

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const files = fs.readdirSync(postsDir).filter((f) => f.endsWith(".json"));

const index = [];

files.forEach((fname) => {
  try {
    const raw = fs.readFileSync(path.join(postsDir, fname), "utf8");
    const j = JSON.parse(raw);
    if (j.published === false) return; // skip unpublished

    // slug: use slug field if present, else generated from title or filename
    let slug = j.slug && j.slug.trim() ? j.slug.trim() : null;
    if (!slug) {
      if (j.title) slug = slugify(j.title, { lower: true, strict: true });
      else slug = fname.replace(/\.json$/, "");
    }

    const htmlBody = marked.parse(j.body || "");
    const title = j.title || "";
    const dateISO = new Date(j.date || Date.now()).toISOString();
    const thumbnail = j.thumbnail || "";
    const summary = j.summary || "";

    const outHtml = `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <meta name="description" content="${summary}">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>
  <nav><a href="/">Trang chủ</a> · <a href="/news.html">Tin tức</a></nav>
  <article>
    <h1>${title}</h1>
    <time datetime="${dateISO}">${new Date(dateISO).toLocaleDateString()}</time>
    ${thumbnail ? `<img src="${thumbnail}" alt="${title}">` : ""}
    <div class="post-body">
      ${htmlBody}
    </div>
  </article>
</body>
</html>`;

    const outPath = path.join(outDir, slug + ".html");
    fs.writeFileSync(outPath, outHtml, "utf8");

    index.push({
      file: fname,
      slug,
      title,
      date: dateISO,
      thumbnail,
      summary,
    });

    console.log("Built", outPath);
  } catch (e) {
    console.error("Error building", fname, e);
  }
});

// sort index by date desc
index.sort((a, b) => new Date(b.date) - new Date(a.date));

// write index.json into content/posts/index.json so client can fetch
const indexPath = path.join(process.cwd(), "content", "posts", "index.json");
fs.writeFileSync(
  indexPath,
  JSON.stringify(
    index.map((i) => i.file),
    null,
    2
  )
);
console.log("Wrote index.json");
