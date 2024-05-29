import express from "express";

const router = express.Router();

router.post("/logoutToken", (req, res) => {
  // Invalidate token by setting a short expiration time
  const token = req.headers["authorization"];
  if (token) {
    jwt.verify(token, jwtSecret, { ignoreExpiration: true }, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: "Invalid token" });
      } else {
        res.status(200).json({ message: "Token invalidated" });
      }
    });
  } else {
    res.status(400).json({ error: "No token provided" });
  }
});

export default router;
