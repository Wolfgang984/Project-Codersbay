import express from "express";
import db from '../../db.js';

const router = express.Router();

router.get("/getAllPerson", async (req, res) => {
    try {
        
        db.query('SELECT person_id, vorname, nachname FROM person', (error, results) => {
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
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: 'Server Error' });
    }
});

export default router;
