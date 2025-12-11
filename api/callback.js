export default async function handler(req, res) {
  const { code } = req.query;
  const { host } = req.headers;

  // Log để debug
  console.log("Callback received, code:", code);
  console.log("Client ID:", process.env.OAUTH_CLIENT_ID);
  console.log("Client Secret exists:", !!process.env.OAUTH_CLIENT_SECRET);

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
          redirect_uri: `https://${host}/api/callback`,
        }),
      }
    );

    const data = await tokenResponse.json();

    console.log("Token response:", data);

    if (data.error) {
      return res
        .status(400)
        .send(`Error: ${data.error_description || data.error}`);
    }

    if (!data.access_token) {
      return res.status(400).send("Error: No access token received");
    }

    // Trả về HTML để gửi token về CMS
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Authenticating...</title>
      </head>
      <body>
        <p>Authenticating... Please wait.</p>
        <script>
          (function() {
            function receiveMessage(event) {
              window.opener.postMessage(
                'authorization:github:success:' + JSON.stringify(${JSON.stringify(
                  data
                )}),
                event.origin
              );
              window.removeEventListener("message", receiveMessage, false);
            }
            
            window.addEventListener("message", receiveMessage, false);
            
            // Notify opener that we're ready
            window.opener.postMessage("authorizing:github", "*");
          })();
        </script>
      </body>
      </html>
    `;

    res.setHeader("Content-Type", "text/html");
    res.status(200).send(html);
  } catch (error) {
    console.error("OAuth error:", error);
    return res.status(500).send(`Error: ${error.message}`);
  }
}
