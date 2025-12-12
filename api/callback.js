export default async function handler(req, res) {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send("No authorization code");
  }

  if (!process.env.OAUTH_CLIENT_ID || !process.env.OAUTH_CLIENT_SECRET) {
    return res.status(500).send("OAuth not configured");
  }

  try {
    const tokenResponse = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          client_id: process.env.OAUTH_CLIENT_ID,
          client_secret: process.env.OAUTH_CLIENT_SECRET,
          code: code,
        }),
      }
    );

    const data = await tokenResponse.json();

    if (data.error || !data.access_token) {
      return res.status(400).send(`Error: ${data.error || "No token"}`);
    }

    // HTML với script để gửi message và đóng cửa sổ
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Authorizing...</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
      margin: 0;
      background: #f5f5f5;
    }
    .box {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="box">
    <h2>✓ Authorization Complete</h2>
    <p id="status">Redirecting back to CMS...</p>
  </div>
  <script>
    (function() {
      const data = {
        token: "${data.access_token}",
        provider: "github"
      };
      
      const message = "authorization:github:success:" + JSON.stringify(data);
      
      console.log("Message to send:", message);
      console.log("window.opener exists:", !!window.opener);
      
      // Hàm gửi message
      function sendMessage() {
        if (window.opener && !window.opener.closed) {
          try {
            // Gửi message về parent window
            window.opener.postMessage(message, window.location.origin);
            window.opener.postMessage(message, "*"); // Fallback với wildcard
            
            console.log("Message sent successfully");
            document.getElementById("status").textContent = "Success! You can close this window.";
            
            // Tự động đóng sau 2 giây
            setTimeout(function() {
              window.close();
            }, 2000);
            
          } catch (error) {
            console.error("Error sending message:", error);
            document.getElementById("status").innerHTML = 
              "Authentication complete.<br>Please close this window and return to the CMS.";
          }
        } else {
          console.error("window.opener not available");
          document.getElementById("status").innerHTML = 
            "Authentication complete.<br><strong>Please close this window manually.</strong>";
        }
      }
      
      // Đợi DOM load xong rồi gửi
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", sendMessage);
      } else {
        sendMessage();
      }
      
    })();
  </script>
</body>
</html>
    `;

    res.setHeader("Content-Type", "text/html");
    return res.status(200).send(html);
  } catch (error) {
    console.error("Callback error:", error);
    return res.status(500).send(`Error: ${error.message}`);
  }
}
