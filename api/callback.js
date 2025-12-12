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

    const token = data.access_token;

    // HTML với script inline - tránh vấn đề escaping
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Authorizing...</title>
</head>
<body>
  <h2>Authorization Complete</h2>
  <p id="status">Sending data to CMS...</p>
  <script>
    (function() {
      var token = "${token}";
      var authData = {
        token: token,
        provider: "github"
      };
      
      var message = "authorization:github:success:" + JSON.stringify(authData);
      
      console.log("Popup: Preparing to send message");
      console.log("Popup: Message =", message);
      console.log("Popup: window.opener exists =", !!window.opener);
      
      function sendMessage() {
        if (window.opener && !window.opener.closed) {
          try {
            console.log("Popup: Sending message to origins:");
            console.log("  - https://sadakahr.vercel.app");
            console.log("  - " + window.location.origin);
            console.log("  - *");
            
            window.opener.postMessage(message, "https://sadakahr.vercel.app");
            window.opener.postMessage(message, window.location.origin);
            window.opener.postMessage(message, "*");
            
            console.log("Popup: Messages sent!");
            document.getElementById("status").textContent = "Success! Closing window...";
            
            setTimeout(function() {
              console.log("Popup: Closing window");
              window.close();
            }, 1500);
            
          } catch (error) {
            console.error("Popup: Error sending message:", error);
            document.getElementById("status").textContent = "Please close this window manually.";
          }
        } else {
          console.error("Popup: window.opener not available");
          document.getElementById("status").textContent = "Please close this window manually.";
        }
      }
      
      // Thử gửi nhiều lần để chắc chắn
      setTimeout(sendMessage, 100);
      setTimeout(sendMessage, 500);
      setTimeout(sendMessage, 1000);
      
    })();
  </script>
</body>
</html>`;

    res.setHeader("Content-Type", "text/html");
    return res.status(200).send(html);
  } catch (error) {
    console.error("Callback error:", error);
    return res.status(500).send(`Error: ${error.message}`);
  }
}
