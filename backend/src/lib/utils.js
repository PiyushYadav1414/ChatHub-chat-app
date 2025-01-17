import jwt from "jsonwebtoken";  // Importing jsonwebtoken for token creation

export const generateToken = (userId, res) => {
  // Generate the token using the userId and secret from the environment
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

  // Send the token in a cookie to the browser with certain security options
  res.cookie("jwt", token, { // THE NAME OF THE TOKEN IS JWT 
    maxAge: 7 * 24 * 60 * 60 * 1000, // Expiry time in milliseconds (7 days)
    httpOnly: true, // Prevents access to the cookie via JavaScript (helps prevent XSS)
    sameSite: "strict", // "strict" ensures the cookie is sent only for requests coming from the same site (domain). Prevents CSRF attacks (cross-site request forgery)
    secure: process.env.NODE_ENV !== "development", //Ensures the cookie is only sent over HTTPS (secure connection). Sets secure flag in production environment only
  });

  return token;  // Return the generated token (optional, for use elsewhere in the app)
};

// Authorization Header is typically used to send a token in the request header, often for APIs.
// Cookies are automatically sent with every request made to the same domain (no need to manually add them to headers).

// In short, res.cookie helps store the JWT in a cookie for automatic, secure transmission in requests, while 
// keeping the token safe from JavaScript attacks.

// secure: process.env.NODE_ENV !== "development",
// secure: true means the cookie will only be sent over HTTPS.
// secure: false means the cookie can be sent over both HTTP and HTTPS (not restricted to secure connections).
// We are in development mode so we have kept it false as we send http request in development mode 
// when we deploy our application and come in production mode then we will set it true so that only https request can be made
// This prevents the cookie from being sent over unencrypted HTTP, which could be intercepted by attackers. It’s set to false in development for ease, as development servers typically don’t use HTTPS.

// httpOnly: Prevents JavaScript from accessing the cookie, not related to whether it’s sent over HTTP or HTTPS.
// secure: Controls whether the cookie is sent over HTTP or HTTPS.

