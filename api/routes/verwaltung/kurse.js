import express from "express";
import db from "../../db.js";

const router = express.Router();

router.get("/yearFromKurse", async (req, res) =>{
    try{
        db.query(
            "SELECT DISTINCT YEAR(kurs_start) AS Jahr FROM kurs;",
            (error, results) => {
              if (error) {
                console.error("Error executing query:", error);
                return res.status(500).json({ message: "Server Error" });
              }
             
      
              res.json(results);
            }
          );
        } catch (error) {
          console.error("Error:", error);
          res.status(500).json({ message: "Server Error" });
        }
});

router.get("/submitSelection", async (req, res) => {
    const { saison_id, jahr } = req.query;
    try {
        db.query(
            "SELECT * FROM kurs LEFT JOIN huschuvoecklabruck.kursbesuch k on kurs.kurs_id = k.kurs_id LEFT JOIN huschuvoecklabruck.hundefuehrer h on h.hundefuehrer_id = k.hundefuehrer_id LEFT JOIN huschuvoecklabruck.kurs_name kn on kurs.kurs_name_id = kn.kurs_name_id LEFT JOIN huschuvoecklabruck.person p on h.person_id = p.person_id Left JOIN huschuvoecklabruck.adresse a on a.adresse_id = p.adress_id LEFT OUTER JOIN huschuvoecklabruck.hundedaten h2 on h2.hund_id = h.hund_id WHERE saison_id = ? AND YEAR(kurs_start) = ?;",
            [saison_id, jahr],
            (error, results) => {
                if (error) {
                    console.error("Error executing query:", error);
                    return res.status(500).json({ message: "Server Error" });
                }
                res.json(results);
                
            }
        );
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

router.delete('/deleteTeilnehmer/:kb_id', (req, res) => {
  const { kb_id } = req.params;

  db.query('DELETE FROM kursbesuch WHERE kb_id = ?', [kb_id], (error, results) => {
    if (error) {
      console.error('Fehler beim Löschen des Teilnehmers:', error);
      return res.status(500).json({ message: 'Interner Serverfehler' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Teilnehmer nicht gefunden' });
    }

    res.status(200).json({ message: 'Teilnehmer erfolgreich gelöscht' });
  });
});

router.put('/bezahltstatus/:kb_id', (req, res) => {
  const { kb_id } = req.params;
  const { bezahlt } = req.body;

  // Validierung des bezahlt-Werts
  if (isNaN(bezahlt)) {
    return res.status(400).json({ error: 'Der bezahlt-Wert muss eine Zahl sein.' });
  }

  const query = 'UPDATE kursbesuch SET bezahlt = ? WHERE kb_id = ?';
  const values = [bezahlt, kb_id];

  db.query(query, values, (err, results) => {
    if (err) {
      console.error('Fehler beim Aktualisieren des bezahlt-Status:', err);
      return res.status(500).json({ error: 'Interner Serverfehler' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Datensatz nicht gefunden' });
    }

    res.status(200).json({ message: 'Status erfolgreich aktualisiert' });
  });
});

export default router;