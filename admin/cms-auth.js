// Lắng nghe message từ OAuth popup
window.addEventListener(
  "message",
  function (e) {
    console.log("Received message:", e.data);

    // Kiểm tra message từ GitHub OAuth
    if (
      typeof e.data === "string" &&
      e.data.indexOf("authorization:github:success:") === 0
    ) {
      try {
        const dataStr = e.data.replace("authorization:github:success:", "");
        const authData = JSON.parse(dataStr);

        console.log("Auth data:", authData);

        // Lưu token vào localStorage theo format Decap CMS
        if (authData.token) {
          const user = {
            token: authData.token,
            backendName: "github",
            login: "github-user",
          };

          localStorage.setItem("netlify-cms-user", JSON.stringify(user));
          console.log("Token saved, reloading...");

          // Reload trang để CMS nhận token
          window.location.reload();
        }
      } catch (error) {
        console.error("Error processing auth:", error);
      }
    }
  },
  false
);

console.log("Auth listener initialized");
