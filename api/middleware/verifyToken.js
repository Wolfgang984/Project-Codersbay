import jwt from "jsonwebtoken";
const jwtSecret = "your_jwt_secret_key";

export function verifyToken(req, res, next) {
  const token = req.headers["authorization"];
  if (token) {
    jwt.verify(token, jwtSecret, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: "Invalid token" });
      } else {
        req.username = decoded.username;
        next();
      }
    });
  } else {
    return res.status(401).json({ error: "No token provided" });
  }
}
