// public/js/blog_data.js

// 1. Cấu hình Client
const client = contentful.createClient({
  space: "b6nnba82anu8",
  accessToken: "dgLOPB6OvoYWhmg7TCc3FhWSULPnIeZTSiGvWGhWhuA",
});

// 2. Biến toàn cục
var blogData = [];

// 3. Hàm lấy dữ liệu
async function fetchBlogData() {
  try {
    const response = await client.getEntries({
      content_type: "blogPost",
      order: "-fields.date",
      include: 2, // Lấy sâu 2 cấp để lấy được URL ảnh nhúng
    });

    console.log("📦 Raw response từ Contentful:", response);
    console.log(
      "📝 Fields có sẵn:",
      response.items[0]
        ? Object.keys(response.items[0].fields)
        : "Không có item"
    );

    blogData = response.items.map((item) => {
      const fields = item.fields;
      const dateObj = new Date(fields.date);

      // Format ngày tháng
      const formattedDate = `${dateObj.getDate()} tháng ${
        dateObj.getMonth() + 1
      }, ${dateObj.getFullYear()}`;

      // ⚠️ QUAN TRỌNG: Kiểm tra tên field của Rich Text
      // Thử tất cả các tên có thể
      const contentField =
        fields.content || fields.noiDungBaiViet || fields.body;

      console.log(`📄 Blog: ${fields.title}`);
      console.log("   - content field:", contentField);
      console.log("   - content type:", contentField?.nodeType);

      return {
        id: item.sys.id,
        slug: fields.slug,
        title: fields.title,
        author: fields.author,
        date: fields.date,
        dateFormatted: formattedDate,
        thumbnail: fields.thumbnail?.fields?.file?.url || "",
        heroImage: fields.heroImage?.fields?.file?.url || "",
        shortDesc: fields.shortDesc,
        content: contentField, // Rich Text content
      };
    });

    console.log("✅ Dữ liệu đã xử lý:", blogData);

    // Render giao diện ngay khi có dữ liệu
    if (document.querySelector(".blog-list-section")) {
      renderBlogList();
    }
    if (document.querySelector(".blog-text")) {
      renderBlogDetail();
    }

    return blogData;
  } catch (error) {
    console.error("❌ Lỗi lấy dữ liệu:", error);
    return [];
  }
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("🚀 DOM loaded, bắt đầu fetch data...");
  fetchBlogData();
});
