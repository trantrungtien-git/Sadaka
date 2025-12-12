export default async function handler(req, res) {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send("Error: No authorization code provided");
  }

  if (!process.env.OAUTH_CLIENT_ID || !process.env.OAUTH_CLIENT_SECRET) {
    return res.status(500).send("Error: OAuth credentials not configured");
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

    console.log("Token response:", data);

    if (data.error || !data.access_token) {
      return res
        .status(400)
        .send(`Error: ${data.error_description || data.error || "No token"}`);
    }

    // QUAN TRỌNG: Format đúng cho Decap CMS
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Authorizing...</title>
  <style>
    body { font-family: system-ui; text-align: center; padding: 50px; }
  </style>
</head>
<body>
  <h2>✓ Authorization Successful</h2>
  <p>Completing authentication...</p>
  <script>
    (function() {
      const data = {
        token: "${data.access_token}",
        provider: "github"
      };
      
      const message = "authorization:github:success:" + JSON.stringify(data);
      
      console.log("Sending message to opener:", message);
      
      if (window.opener) {
        // Gửi message về CMS
        window.opener.postMessage(message, "*");
        
        // Đóng cửa sổ sau 1 giây
        setTimeout(function() {
          window.close();
        }, 1000);
      } else {
        document.body.innerHTML = "<p>Please close this window manually.</p>";
      }
    })();
  </script>
</body>
</html>
    `;

    res.setHeader("Content-Type", "text/html");
    return res.status(200).send(html);
  } catch (error) {
    console.error("OAuth error:", error);
    return res.status(500).send(`Error: ${error.message}`);
  }
}
