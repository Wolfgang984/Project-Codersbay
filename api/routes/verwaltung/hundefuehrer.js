import express from "express";
import db from "../../db.js";

const router = express.Router();


router.get("/AlldogHandler", async (req, res) => {
    const { saison, year } = req.query;

    if (!saison || !year) {
        return res.status(400).json({ message: 'Saison and year are required' });
    }

    const query = `
        SELECT 
            * 
        FROM 
            kurs 
        LEFT JOIN 
            huschuvoecklabruck.kursbesuch k ON kurs.kurs_id = k.kurs_id 
        LEFT JOIN 
            huschuvoecklabruck.hundefuehrer h ON h.hundefuehrer_id = k.hundefuehrer_id 
        LEFT JOIN 
            huschuvoecklabruck.kurs_name kn ON kurs.kurs_name_id = kn.kurs_name_id 
        LEFT JOIN 
            huschuvoecklabruck.person p ON h.person_id = p.person_id 
        LEFT JOIN 
            huschuvoecklabruck.adresse a ON a.adresse_id = p.adress_id 
        LEFT OUTER JOIN 
            huschuvoecklabruck.hundedaten h2 ON h2.hund_id = h.hund_id 
        LEFT JOIN 
            huschuvoecklabruck.rasse r on r.rassen_id = h2.rassen_id
        LEFT JOIN
            huschuvoecklabruck.zustimmungsoption zo ON p.person_id = zo.person_id
        WHERE 
            saison_id = ? 
        AND 
            YEAR(kurs_start) = ?;
    `;

    db.query(query, [saison, year], (error, results) => {
        if (error) {
            console.error("Error executing query:", error);
            return res.status(500).json({ message: 'Server Error' });
        }

        // Log the result to diagnose potential issues
        console.log("Query result:", results);

        if (!results || results.length === 0) {
            console.log("No data found in the table.");
            return res.status(404).json({ message: 'No data found' });
        }

        res.json(results);
        console.log("Data sent to client:", results);
    });
});

export default router;