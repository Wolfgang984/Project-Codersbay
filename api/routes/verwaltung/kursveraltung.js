import express from "express";
import db from "../../db.js";

const router = express.Router();

const queryAsync = (query, params) => {
  return new Promise((resolve, reject) => {
    db.query(query, params, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};

router.get("/alleKurseNamenMitPreis", async (req, res) => {
  try {
    db.query(
      "SELECT * FROM kurs_name JOIN huschuvoecklabruck.kurs_preis kp on kurs_name.kurs_name_id = kp.kurs_name_id ORDER BY jahr;",
      (error, results) => {
        if (error) {
          console.error("Error executing query:", error);
          return res.status(500).json({ message: "Server Error" });
        }
        if (!results || results.length === 0) {
          console.log("No data found ");

          return res.status(404).json({ message: "No data found" });
        }

        res.json(results);
      }
    );
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/alleKurs_namen", async (req, res) => {
  try {
    db.query("SELECT * FROM kurs_name;", (error, results) => {
      if (error) {
        console.error("Error executing query:", error);
        return res.status(500).json({ message: "Server Error" });
      }
      if (!results || results.length === 0) {
        console.log("No data found ");

        return res.status(404).json({ message: "No data found" });
      }

      res.json(results);
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/getSeason", async (req, res) => {
  try {
    db.query("SELECT * FROM saison;", (error, results) => {
      if (error) {
        console.error("Error executing query:", error);
        return res.status(500).json({ message: "Server Error" });
      }
      if (!results || results.length === 0) {
        console.log("No data found ");

        return res.status(404).json({ message: "No data found" });
      }

      res.json(results);
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/angelegteKurse", async (req, res) => {
  try {
    db.query(
      "SELECT * FROM kurs join kurs_name kn on kn.kurs_name_id = kurs.kurs_name_id join saison s on kurs.saison_id = s.saison_id LEFT join kurs_preis kp on kurs.preis_id = kp.preis_id;",
      (error, results) => {
        if (error) {
          console.error("Error executing query:", error);
          return res.status(500).json({ message: "Server Error" });
        }
        if (!results || results.length === 0) {
          console.log("No data found ");

          return res.status(404).json({ message: "No data found" });
        }

        res.json(results);
      }
    );
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.post("/neuerKursname", async (req, res) => {
  const { kurs_name } = req.body;

  if (!kurs_name) {
    return res.status(400).json({ error: "Kursname ist erforderlich" });
  }
  const query = "INSERT INTO kurs_name (kurs_name) VALUE (?)";

  db.query(query, [kurs_name], (err, result) => {
    if (err) {
      console.error("Fehler beim Einfügen des Kursnamens: " + err.stack);
      return res
        .status(500)
        .json({ error: "Fehler beim Einfügen des Kursnamens" });
    }
    res.status(201).json({
      message: "Kursname erfolgreich hinzugefügt",
    });
  });
});

router.post("/neueKursPreise", async (req, res) => {
  const { kurs_name_id, preis_in_euro, jahr } = req.body;

  const query =
    "INSERT INTO kurs_preis (kurs_name_id, preis_in_euro, jahr) VALUE (?,?,?)";

  db.query(query, [kurs_name_id, preis_in_euro, jahr], (err, result) => {
    if (err) {
      console.error("Fehler beim Einfügen des Kursnamens: " + err.stack);
      return res
        .status(500)
        .json({ error: "Fehler beim Einfügen des Kursnamens" });
    }
    res.status(201).json({
      message: "Kurspreis erfolgreich hinzugefügt",
    });
  });
});

router.post("/neuerKurs", async (req, res) => {
  const { kurs_name_id, saison_id, kurs_start, kurs_ende, preis_id } = req.body;

  const query =
    "INSERT INTO kurs (kurs_name_id, saison_id, kurs_start, kurs_ende, preis_id) VALUE (?,?,?,?,?)";

  db.query(
    query,
    [kurs_name_id, saison_id, kurs_start,kurs_ende, preis_id],
    (err, result) => {
      if (err) {
        console.error("Fehler beim Einfügen des Kurses: " + err.stack);
        return res
          .status(500)
          .json({ error: "Fehler beim Einfügen des Kurses" });
      }
      res.status(201).json({
        message: "Kurs erfolgreich hinzugefügt",
      });
    }
  );
});

router.delete("/deleteCourse", async (req, res) => {
  const { preis_id } = req.body;
  if (!preis_id) {
    return res.status(400).json({ error: "kurs_name_id is required" });
  }
  try {
    const deleteQuery = "DELETE FROM kurs_preis WHERE preis_id = ?";
    db.query(deleteQuery, [preis_id]);

    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("Error deleting course:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the course" });
  }
});


router.delete("/deleteAngelegteKurse", async (req, res) => {
  const { kurs_id } = req.body;
  if (!kurs_id) {
    return res.status(400).json({ error: "kurs_id is required" });
  }
  try {
    const rows = await queryAsync('SELECT COUNT(*) as count FROM kursbesuch WHERE kurs_id = ?', [kurs_id]);

    if (rows[0].count > 0) {
      return res.status(200).json({ message: 'Der Kurs hat bereits Teilnehmer und kann nicht gelöscht werden.', hasParticipants: true });
    }

    const deleteQuery = "DELETE FROM kurs WHERE kurs_id = ?";
    await queryAsync(deleteQuery, [kurs_id]);

    res.status(200).json({ message: "Course deleted successfully", hasParticipants: false });
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({ error: "An error occurred while deleting the course" });
  }
});


// Route to check if a course has participants



router.put("/updateAktiv", async (req, res) => {
  const { kurs_id, newStatus } = req.body;

  if (!kurs_id || !newStatus) {
    return res
      .status(400)
      .json({ error: "kurs_id and newStatus are required" });
  }

  try {
    const updateQuery = "UPDATE kurs SET aktivstatus = ? WHERE kurs_id = ?";
    db.query(updateQuery, [newStatus, kurs_id], (error, results) => {
      if (error) {
        console.error("Error updating course status:", error);
        return res
          .status(500)
          .json({
            error: "An error occurred while updating the course status",
          });
      }

      res.status(200).json({ message: "Course status updated successfully" });
    });
  } catch (error) {
    console.error("Error updating course status:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the course status" });
  }
});

export default router;
