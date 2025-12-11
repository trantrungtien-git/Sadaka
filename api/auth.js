export default function handler(req, res) {
  const { host } = req.headers;
  const clientId = process.env.OAUTH_CLIENT_ID;
  const redirectUri = `https://${host}/api/callback`;

  console.log("Auth endpoint called");
  console.log("Client ID:", clientId);
  console.log("Redirect URI:", redirectUri);

  if (!clientId) {
    return res.status(500).send("Error: OAUTH_CLIENT_ID not configured");
  }

  const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=repo,user&redirect_uri=${redirectUri}`;

  res.redirect(authUrl);
}
