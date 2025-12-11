export default async function handler(req, res) {
  const { code } = req.query;

  console.log("Callback - Code received:", !!code);

  if (!code) {
    return res.status(400).send("No authorization code provided");
  }

  if (!process.env.OAUTH_CLIENT_ID || !process.env.OAUTH_CLIENT_SECRET) {
    console.error("Missing OAuth credentials");
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

    console.log("Token response received:", {
      hasAccessToken: !!data.access_token,
      hasError: !!data.error,
    });

    if (data.error) {
      console.error("GitHub OAuth error:", data.error);
      return res
        .status(400)
        .send(`GitHub error: ${data.error_description || data.error}`);
    }

    if (!data.access_token) {
      console.error("No access token in response");
      return res.status(400).send("No access token received");
    }

    // Script để gửi message về CMS
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Authorizing...</title>
</head>
<body>
  <p>Authorization successful! Closing window...</p>
  <script>
    (function() {
      const data = ${JSON.stringify(data)};
      
      // Post message to opener
      if (window.opener) {
        window.opener.postMessage(
          'authorization:github:success:' + JSON.stringify(data),
          window.location.origin
        );
        
        // Close window after a short delay
        setTimeout(function() {
          window.close();
        }, 1000);
      } else {
        document.body.innerHTML = '<p>Please close this window and return to the application.</p>';
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
    return res.status(500).send(`Server error: ${error.message}`);
  }
}
