import express from "express";
import { verifyToken } from "../../middleware/verifyToken.js";

const router = express.Router();

router.get("/privateareaToken", verifyToken, (req, res) => {
  const username = req.username;
  res.json({ message: "Token info", username: username });
});

export default router;
