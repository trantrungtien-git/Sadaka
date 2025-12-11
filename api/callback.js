export default async function handler(req, res) {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send("No authorization code provided");
  }

  if (!process.env.OAUTH_CLIENT_ID || !process.env.OAUTH_CLIENT_SECRET) {
    return res.status(500).send("OAuth credentials not configured");
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

    if (data.error) {
      return res
        .status(400)
        .send(`GitHub error: ${data.error_description || data.error}`);
    }

    if (!data.access_token) {
      return res.status(400).send("No access token received");
    }

    // HTML với script để gửi message về CMS
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
    .message {
      text-align: center;
      padding: 2rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
  </style>
</head>
<body>
  <div class="message">
    <h2>✓ Authorization successful!</h2>
    <p>Redirecting back to CMS...</p>
  </div>
  <script>
    (function() {
      try {
        const data = ${JSON.stringify(data)};
        const token = data.access_token;
        
        console.log('Token received:', !!token);
        
        // Gửi message về parent window
        const message = {
          token: token,
          provider: "github"
        };
        
        // Thử gửi bằng postMessage
        if (window.opener) {
          console.log('Sending message to opener...');
          window.opener.postMessage(
            'authorization:github:success:' + JSON.stringify(data),
            '*'
          );
          
          // Đợi 1 giây rồi đóng cửa sổ
          setTimeout(function() {
            console.log('Closing window...');
            window.close();
          }, 1000);
        } else {
          console.error('No window.opener found');
          document.querySelector('.message').innerHTML = 
            '<h2>⚠ Please close this window</h2><p>And return to the CMS to continue.</p>';
        }
      } catch (error) {
        console.error('Error in callback script:', error);
        document.querySelector('.message').innerHTML = 
          '<h2>⚠ Error</h2><p>' + error.message + '</p>';
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
