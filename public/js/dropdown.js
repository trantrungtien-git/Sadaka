// --- LOGIC RENDER DROPDOWN JOB (ĐÃ FIX) ---

const contentfulClient = contentful.createClient({
  space: "b6nnba82anu8",
  accessToken: "dgLOPB6OvoYWhmg7TCc3FhWSULPnIeZTSiGvWGhWhuA",
});

document.addEventListener("DOMContentLoaded", async () => {
  const dropdownList = document.getElementById("jobDropdownList");

  if (!dropdownList) return;

  try {
    const response = await contentfulClient.getEntries({
      content_type: "jobPost",
      limit: 5,
      order: "-sys.createdAt",
    });

    dropdownList.innerHTML = "";

    if (response.items.length === 0) {
      dropdownList.innerHTML =
        '<li><a href="/pages/recruit.html">Xem tất cả việc làm</a></li>';
      return;
    }

    // ✅ FIX: Dùng absolute path thay vì relative path
    const html = response.items
      .map((item) => {
        const title = item.fields.title;
        const slug = item.fields.slug;

        return `
        <li>
          <a href="/pages/job_detail.html?slug=${slug}" title="${title}">
            ${title}
          </a>
        </li>
      `;
      })
      .join("");

    const viewAllLink = `
      <li style="background-color: #f9f9f9; font-weight: bold;">
        <a href="/pages/recruit.html" style="color: #d32f2f; text-align: center;">
          Xem tất cả công việc &rarr;
        </a>
      </li>
    `;

    dropdownList.innerHTML = html + viewAllLink;
  } catch (error) {
    console.error("Lỗi tải dropdown jobs:", error);
    dropdownList.innerHTML =
      '<li><a href="/pages/recruit.html">Tuyển dụng</a></li>';
  }
});
