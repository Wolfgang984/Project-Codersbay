import express from "express";
import jwt from "jsonwebtoken";
import db from'../../db.js';

const router = express.Router();
const jwtSecret = "your_jwt_secret_key";

router.post("/loginTokenAuth", (req, res) => {
  const { username, password } = req.body;

  const sql = "SELECT * FROM login WHERE username = ? AND password = ?";
  db.query(sql, [username, password], async (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }

    if (results.length > 0) {
      const user = results[0];

      try {
          const token = jwt.sign({ username: username }, jwtSecret, { expiresIn: '2h' });
          res.json({ message: "Token generated", token: token });

      } catch (err) {
        console.error("Error comparing passwords:", err);
        res.status(500).json({ error: "Internal server error" });
      }
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });
});

export default router;
