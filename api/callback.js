export default async function handler(req, res) {
  const { code } = req.query;
  const { host } = req.headers;

  try {
    const response = await fetch(
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
          code,
          redirect_uri: `https://${host}/api/callback`,
        }),
      }
    );

    const data = await response.json();

    if (data.error) {
      return res.status(400).send(`Error: ${data.error_description}`);
    }

    const script = `
      <!DOCTYPE html>
      <html>
      <head><title>Authenticating...</title></head>
      <body>
        <script>
          (function() {
            function receiveMessage(e) {
              console.log("Received message:", e);
              window.opener.postMessage(
                'authorization:github:success:${JSON.stringify(data)}',
                e.origin
              );
              window.removeEventListener("message", receiveMessage, false);
            }
            window.addEventListener("message", receiveMessage, false);
            
            console.log("Posting message:", ${JSON.stringify(data)});
            window.opener.postMessage(
              "authorizing:github",
              "*"
            );
          })();
        </script>
      </body>
      </html>
    `;

    res.setHeader("Content-Type", "text/html");
    res.send(script);
  } catch (error) {
    console.error("OAuth callback error:", error);
    res.status(500).send("Authentication failed");
  }
}
