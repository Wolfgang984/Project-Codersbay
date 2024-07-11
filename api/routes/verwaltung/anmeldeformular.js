import express from "express";
import db from "../../db.js";

const router = express.Router();

router.get("/saisonVonKursen", async (req, res) =>{
    try{
        db.query(
            "SELECT DISTINCT saison.saison_id, saison.saison FROM saison JOIN kurs ON saison.saison_id = kurs.saison_id;",
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

router.get("/kurse/:season", async (req, res) => {
  const { season } = req.params; // Parameter aus der URL entnehmen
  if (!season) {
    return res.status(400).json({ message: "saison_id ist erforderlich" });
  }

  const currentDate = new Date().toISOString().split('T')[0];

  try {
    db.query(
      "SELECT kurs_name, kurs_start, kurs_id FROM kurs JOIN huschuvoecklabruck.kurs_name kn on kn.kurs_name_id = kurs.kurs_name_id WHERE saison_id = ? AND kurs.kurs_start >= ? AND kurs.aktivstatus = 'AKTIV';",
      [season, currentDate],
      (error, results) => {
        if (error) {
          console.error("Error executing query:", error);
          return res.status(500).json({ message: "Server Error" });
        }
        if (!results || results.length === 0) {
          console.log("No courses found for the given saison_id");
          return res.status(404).json({ message: "No courses found" });
        }
        res.json(results);
      }
    );
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.get('/userByEmail', async (req, res) => {
  const { email } = req.query;
  if (!email) {
    return res.status(400).json({ message: 'Email ist erforderlich' });
  }

  try {
    db.query(
      'SELECT vorname, nachname, email, person_id FROM person WHERE email = ?',
      [email],
      (error, results) => {
        if (error) {
          console.error('Error executing query:', error);
          return res.status(500).json({ message: 'Server Error' });
        }
        if (!results || results.length === 0) {
          return res.status(404).json({ message: 'No user found' });
        }
        res.json(results[0]);
      }
    );
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.get('/auswahlLaender', async (req, res) => {
  try {
    db.query('SELECT * FROM laender', (error, results, fields) => {
      if (error) {
        console.log("Fehler beim Ausgeben der Länder:", error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      res.json(results);
    });
  } catch (error) {
    console.log("Fehler beim Ausgeben der Länder:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get('/auswahlRassen', async (req, res) =>{
  try {
    db.query('SELECT * FROM rasse ORDER BY CASE WHEN rasse = "Mischling" THEN 0 ELSE 1 END, rasse ASC;', (error, results, fields) => {
      if (error) {
        console.log("Fehler beim Ausgeben der Rassen:", error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      res.json(results);
    });
  } catch (error) {
    console.log("Fehler beim Ausgeben der Rassen:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get('/hundeByEmail/:email', async (req, res) => {
  const email = req.params.email;

  try {
    db.query(
      'SELECT rufname, hundename, h.hund_id, hundefuehrer_id, h.person_id FROM hundedaten JOIN huschuvoecklabruck.hundefuehrer h on hundedaten.hund_id = h.hund_id JOIN huschuvoecklabruck.person p on p.person_id = h.person_id WHERE p.email = ?',
      [email],
      (error, results, fields) => {
        if (error) {
          console.log('Fehler beim Ausgeben der Hundedaten:', error);
          return res.status(500).json({ error: 'Internal Server Error' });
        }
        if (results.length === 0) {
          return res.status(404).json({ error: 'No dog found with this email' });
        }
        res.json(results); // Return all dogs associated with the email
      }
    );
  } catch (error) {
    console.log('Fehler beim Ausgeben der Hundedaten:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


export default router; 