import express from "express";
import db from "../../db.js";

const router = express.Router();

router.get("/getVereinsrolle", async (req, res) => {
  try {
    db.query("SELECT * FROM vereinsrolle", (error, results) => {
      if (error) {
        console.log("Fehler beim abrufen der länder");
      }

      res.json(results);
      console.log("Query results", results);
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;