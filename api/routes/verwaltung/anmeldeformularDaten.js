import express from "express";
import db from "../../db.js";
const router = express.Router();

router.post("/saveRegistration", async (req, res) => {
  const {
    userData,
    selectedSeason,
    courseObject,
    dogData,
    ownerData,
    consentData,
  } = req.body;

  console.log("Received data:", req.body);

  try {
    await db.beginTransaction();

    const userAddressResult = await new Promise((resolve, reject) => {
      db.query(
        "INSERT INTO adresse (straße, plz, stadt, hausnummer, staat_id) VALUES (?, ?, ?, ?, ?)",
        [
          userData.adresse.straße,
          userData.adresse.plz,
          userData.adresse.stadt,
          userData.adresse.hausnummer,
          userData.adresse.staat_id,
        ],
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });
    const adressId = userAddressResult.insertId;

    console.log(adressId);

    const userResult = await new Promise((resolve, reject) => {
      db.query(
        "INSERT INTO person (vorname, nachname, geb_datum, telefon, email, adress_id, titel, geschlecht) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [
          userData.vorname,
          userData.nachname,
          userData.geb_datum,
          userData.telefon,
          userData.email,
          adressId,
          userData.titel,
          userData.geschlecht,
        ],
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });
    const userId = userResult.insertId;

    const dogResult = await new Promise((resolve, reject) => {
      db.query(
        "INSERT INTO hundedaten (rufname, hundename, geschlecht, wurfdatum, schutzimpfung, tollwut, versicherung, rassen_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [
          dogData.rufname,
          dogData.hundename,
          dogData.geschlecht,
          dogData.wurfdatum,
          dogData.schutzimpfung,
          dogData.tollwut,
          dogData.versicherung,
          dogData.rassen_id,
        ],
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });
    const dogId = dogResult.insertId;

    let ownerId = null;
    if (ownerData) {
      const ownerAddressResult = await new Promise((resolve, reject) => {
        db.query(
          "INSERT INTO adresse (straße, plz, stadt, hausnummer, staat_id) VALUES (?, ?, ?, ?, ?)",
          [
            ownerData.straße,
            ownerData.plz,
            ownerData.stadt,
            ownerData.hausnummer,
            ownerData.staat_id,
          ],
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }
        );
      });
      const ownerAdressId = ownerAddressResult.insertId;

      const ownerResult = await new Promise((resolve, reject) => {
        db.query(
          "INSERT INTO person (vorname, nachname, geb_datum, telefon, email, adress_id, titel, geschlecht) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
          [
            ownerData.vorname,
            ownerData.nachname,
            ownerData.geb_datum,
            ownerData.telefon,
            ownerData.email,
            ownerAdressId,
            ownerData.titel,
            ownerData.geschlecht,
          ],
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }
        );
      });
      ownerId = ownerResult.insertId;
    }

    await new Promise((resolve, reject) => {
      db.query(
        "INSERT INTO zustimmungsoption (person_id, email, newsletter, whatsapp, foto, video, sms) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [
          userId,
          consentData.email,
          consentData.newsletter,
          consentData.whatsapp,
          consentData.foto,
          consentData.video,
          consentData.sms,
        ],
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });
    await new Promise((resolve, reject) => {
      db.query(
        "INSERT INTO hundebesitzer (person_id, hund_id) VALUES (?, ?)",
        [ownerId, dogId],
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });

    const dogHandlerResult = await new Promise((resolve, reject) => {
      db.query(
        "INSERT INTO hundefuehrer (person_id, hund_id) VALUES (?, ?)",
        [userId, dogId],
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });
    const dogHandlerid = dogHandlerResult.insertId;

    await new Promise((resolve, reject) => {
      db.query(
        "INSERT INTO kursbesuch (kurs_id, hundefuehrer_id) VALUES (?, ?)",
        [courseObject.kurs_id, dogHandlerid],
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });

    await db.commit();
    res.status(200).json({ message: "Registration saved successfully" });
  } catch (err) {
    await db.rollback();
    console.error("Error saving registration:", err.message);
    res.status(500).json({ error: err.message });
  }
});

/************************************************************************************************************************************************/

router.post("/saveAttendedData", async (req, res) => {
  const {
    userData,
    selectedSeason,
    courseObject,
    dogData,
    ownerData,
    consentData,
  } = req.body;

  console.log("Received data:", req.body);

  try {
    let dogId = dogData.hunde_id;
    let newDogId = dogId;

    if (!dogId) {
      const dogResult = await new Promise((resolve, reject) => {
        db.query(
          "INSERT INTO hundedaten (rufname, hundename, geschlecht, wurfdatum, schutzimpfung, tollwut, versicherung, rassen_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
          [
            dogData.rufname,
            dogData.hundename,
            dogData.geschlecht,
            dogData.wurfdatum,
            dogData.schutzimpfung,
            dogData.tollwut,
            dogData.versicherung,
            dogData.rassen_id,
          ],
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }
        );
      });
      newDogId = dogResult.insertId;
      console.log("New Dog ID:", newDogId);
    }

    let ownerId = null;
    if (ownerData) {
      const ownerAddressResult = await new Promise((resolve, reject) => {
        db.query(
          "INSERT INTO adresse (straße, plz, stadt, hausnummer, staat_id) VALUES (?, ?, ?, ?, ?)",
          [
            ownerData.straße,
            ownerData.plz,
            ownerData.stadt,
            ownerData.hausnummer,
            ownerData.staat_id,
          ],
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }
        );
      });
      const ownerAdressId = ownerAddressResult.insertId;

      const ownerResult = await new Promise((resolve, reject) => {
        db.query(
          "INSERT INTO person (vorname, nachname, geb_datum, telefon, email, adress_id, titel, geschlecht) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
          [
            ownerData.vorname,
            ownerData.nachname,
            ownerData.geb_datum,
            ownerData.telefon,
            ownerData.email,
            ownerAdressId,
            ownerData.titel,
            ownerData.geschlecht,
          ],
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }
        );
      });
      ownerId = ownerResult.insertId;
    }

    let dogHandlerResult;
    let personId;

   if(newDogId !== dogData.hunde_id)
      dogHandlerResult = await new Promise((resolve, reject) => {
        db.query(
          "INSERT INTO hundefuehrer (person_id, hund_id) VALUES (?, ?)",
          [userData.person_id, newDogId ],
          (error, result) => {
            if (error) {
              console.log("Fehler beim Speichern der Daten", error);
              reject(error);
            } else {
              resolve(result);
            }
          }
        );
      });
    

    if (dogHandlerResult) {
      personId = dogHandlerResult.insertId;
      console.log("Neue Hundeführer id: " , personId)
    }

    if (ownerId && newDogId) {
      const insertOwnerQuery =
        "INSERT INTO hundebesitzer (person_id, hund_id) VALUES (?, ?)";

      await new Promise((resolve, reject) => {
        db.query(insertOwnerQuery, [ownerId, newDogId], (error) => {
          if (error) {
            console.log("Fehler beim Speichern der Daten", error);
            reject(error);
          } else {
            resolve();
          }
        });
      });
    }

    if (personId) {
      await new Promise((resolve, reject) => {
        db.query(
          "INSERT INTO kursbesuch (kurs_id, hundefuehrer_id) VALUES (?, ?)",
          [courseObject.kurs_id, personId],
          (error, result) => {
            if (error) {
              console.log("Fehler beim Speichern der Daten", error);
              reject(error);
            } else {
              resolve(result);
            }
          }
        );
      });
    } else {
      await new Promise((resolve, reject) => {
        db.query(
          "INSERT INTO kursbesuch (kurs_id, hundefuehrer_id) VALUES (?, ?)",
          [courseObject.kurs_id, dogData.hundefuehrer_id],
          (error, result) => {
            if (error) {
              console.log("Fehler beim Speichern der Daten", error);
              reject(error);
            } else {
              resolve(result);
            }
          }
        );
      });
    }

    res.status(200).json({ message: "Daten erfolgreich gespeichert" });
  } catch (error) {
    console.log("Fehler beim Ausgeben der Hundedaten:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
