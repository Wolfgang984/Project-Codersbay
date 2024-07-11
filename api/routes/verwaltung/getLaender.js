import express from "express";
import db from "../../db.js";

const router = express.Router();

router.get("/getLaender", async (req, res) => {
  try {
    db.query("SELECT * FROM laender", (error, results) => {
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