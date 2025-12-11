export default function handler(req, res) {
  const { host } = req.headers;
  const clientId = process.env.OAUTH_CLIENT_ID || 'Ov23liy1zBSA7PImLpeQ';
  const redirectUri = `https://${host}/api/callback`;
  
  const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=repo,user&redirect_uri=${redirectUri}`;
  
  res.redirect(authUrl);
}