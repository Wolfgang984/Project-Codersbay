import express from "express";
import db from "../../db.js";
import moment from "moment";

const router = express.Router();

// GET-Route zum Abrufen von Profildaten basierend auf der Person-ID
router.get("/profile/:person_id", async (req, res) => {
  const { person_id } = req.params;
  try {
   
    db.query(
      "SELECT person.*, a.*, l.staat, GROUP_CONCAT(vr.rolle SEPARATOR ', ') AS rollen FROM person LEFT JOIN huschuvoecklabruck.adresse a ON a.adresse_id = person.adress_id LEFT JOIN huschuvoecklabruck.laender l ON a.staat_id = l.staat_id LEFT JOIN huschuvoecklabruck.hat_rolle hr ON hr.person_id = person.person_id LEFT JOIN huschuvoecklabruck.vereinsrolle vr ON vr.rollen_id = hr.rollen_id WHERE person.person_id = ?;",
      [person_id],
      (error, results) => {
        if (error) {
          console.error("Error executing query:", error);
          return res.status(500).json({ message: "Server Error" });
        }
        if (!results || results.length === 0) {
          console.log("No data found for the person ID:", person_id);
          return res.status(404).json({ message: "No data found" });
        }
        const profileData = results[0];
        if (profileData.geb_datum) {
          profileData.geb_datum = moment(profileData.geb_datum).format('YYYY-MM-DD');
        }
        res.json(profileData);
      }
    );
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// PUT-Route zum Aktualisieren von Profildaten
router.put("/profile/:person_id", async (req, res) => {
  const { person_id } = req.params;
  const {
    vorname,
    nachname,
    geb_datum,
    telefon,
    email,
    straße,
    plz,
    stadt,
    hausnummer,
    staat_id,
    rollen_id,
  } = req.body;

  console.log(req.body)

  try {
    // Überprüfen, ob die Adresse bereits vorhanden ist
    let addressId;

    db.query(
      "SELECT adress_id FROM person WHERE person_id = ?",
      [person_id],
      async (error, results) => {
        if (error) {
          console.error("Error executing query:", error);
          return res.status(500).json({ message: "Server Error" });
        }

        if (results.length === 0) {
          // Wenn die Person nicht gefunden wurde, Fehlermeldung zurückgeben
          return res.status(404).json({ message: "Person not found" });
        }

        addressId = results[0].adress_id;

        // Wenn keine Adresse vorhanden ist, eine neue erstellen
        if (!addressId) {
          db.query(
            "INSERT INTO adresse (straße, plz, stadt, hausnummer, staat_id) VALUES (?, ?, ?, ?, ?)",
            [straße, plz, stadt, hausnummer, staat_id],
            async (error, results) => {
              if (error) {
                console.error("Error executing query:", error);
                return res.status(500).json({ message: "Server Error" });
              }
              addressId = results.insertId;

              // Adresse-ID in der Personentabelle aktualisieren
              db.query(
                "UPDATE person SET adress_id = ? WHERE person_id = ?",
                [addressId, person_id],
                (error, results) => {
                  if (error) {
                    console.error("Error executing query:", error);
                    return res.status(500).json({ message: "Server Error" });
                  }

                  // Rollen hinzufügen, nachdem die Adresse aktualisiert wurde
                  db.query(
                    "INSERT INTO hat_rolle (person_id, rollen_id) VALUES (?, ?)",
                    [person_id, rollen_id],
                    (error, results) => {
                      if (error) {
                        console.error("Error executing query:", error);
                        return res.status(500).json({ message: "Server Error" });
                      }
                      res.json({ message: "Profile data and role added successfully" });
                    }
                  );
                }
              );
            }
          );
        } else {
          // Wenn eine Adresse vorhanden ist, aktualisiere die Profildaten
          db.query(
            "UPDATE adresse SET straße = ?, plz = ?, stadt = ?, hausnummer = ?, staat_id = ? WHERE adresse_id = ?",
            [straße, plz, stadt,  hausnummer, staat_id, addressId],
            (error, results) => {
              if (error) {
                console.error("Error executing query:", error);
                return res.status(500).json({ message: "Server Error" });
              }

              db.query(
                "UPDATE person SET vorname = ?, nachname = ?, geb_datum = ?, telefon = ?, email = ? WHERE person_id = ?",
                [vorname, nachname, geb_datum, telefon, email, person_id],
                (error, results) => {
                  if (error) {
                    console.error("Error executing query:", error);
                    return res.status(500).json({ message: "Server Error" });
                  }

              // Rollen hinzufügen, nachdem die Adresse aktualisiert wurde
              db.query(
                "INSERT INTO hat_rolle (person_id, rollen_id) VALUES (?, ?)",
                [person_id, rollen_id],
                (error, results) => {
                  if (error) {
                    console.error("Error executing query:", error);
                    return res.status(500).json({ message: "Server Error" });
                  }
                  res.json({ message: "Profile data and role added successfully" });
                }
              );
            }
          );
        }
      );
    }
  }
);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});


export default router;
