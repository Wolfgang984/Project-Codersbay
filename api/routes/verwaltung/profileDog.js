import express from "express";
import db from "../../db.js";

const router = express.Router();

router.get("/profileDog/:hund_id", async (req, res) => {
    const { hund_id} = req.params;
    try {
      db.query(
        "SELECT * FROM hundedaten WHERE hund_id = ?;",
        [hund_id],
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
         /* if (profileData.geb_datum) {
            profileData.geb_datum = moment(profileData.geb_datum).format('YYYY-MM-DD');
          }*/
          res.json(profileData);
        }
      );
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: "Server Error" });
    }
  });

  router.get("/profileDogZuechter", async (req, res) =>{
    
    db.query("SELECT p.vorname, p.nachname , zuechter_id FROM zuechter LEFT JOIN huschuvoecklabruck.person p on zuechter.person_id = p.person_id;", 
      (error, results) => {
        if (error) {
          console.error("Error executing query:", error);
          return res.status(500).json({ message: "Server Error" });
        }
        if (!results || results.length === 0) {
          console.log("No data found");
          return res.status(404).json({ message: "No data found" });
        }
        
        res.json(results);
      }
    )
  })

  router.put("/setProfileDog/:hund_id", async (req, res) =>{
    const {hund_id} = req.params;
    const {
      rufname,
      hundename,
      geschlecht,
      chip_nr,
      wurfdatum,
      hundegröße_in_cm,
      schutzimpfung,
      tollwut,
      versicherung,
      zuchtbuch_nr,
      vater,
      zuchtbuch_nr_vater,
      mutter,
      zuchtbuch_nr_mutter,
      zuechter_id, // Setze den Default-Wert hier
      rassen_id
    } = req.body;

    console.log(req.body);

    try{
      db.query("UPDATE hundedaten SET rufname = ?, hundename = ?, geschlecht = ?, chip_nr =?, wurfdatum = ?, hundegröße_in_cm = ?, schutzimpfung = ?, tollwut = ?, versicherung = ?, zuchtbuch_nr = ?, vater = ?, zuchtbuch_nr_vater = ?, mutter = ?, zuchtbuch_nr_mutter = ?, zuechter_id = ?, rassen_id = ? WHERE hund_id = ?",
        [rufname, hundename, geschlecht, chip_nr, wurfdatum, hundegröße_in_cm, schutzimpfung, tollwut, versicherung, zuchtbuch_nr, vater, zuchtbuch_nr_vater, mutter, zuchtbuch_nr_mutter, zuechter_id,  rassen_id, hund_id],
        (error) => {
          if (error) {
            console.error("Error executing query:", error);
            return res.status(500).json({ message: "Server Error" });
          }
        }
      )
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: "Server Error" });
    }
  })
  

  export default router;