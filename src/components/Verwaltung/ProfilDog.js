import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Button,
  TextField,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Container,
  Grid,
  Paper,
} from "@mui/material";
import LogoutButton from "../elements/handleLogoutButton.js";
import ZurueckButton from "../elements/ZurueckButton.js";
import Kursbutton from "../elements/KurseButton.js";

export default function ProfilDog() {
  const { hund_id } = useParams();
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackSeverity, setFeedbackSeverity] = useState("success");
  const [zuechter, setZuechter] = useState([]);
  const [rasse, setRasse] = useState([]);
  const [profileDataDog, setProfileDataDog] = useState({
    rufname: "",
    hundename: "",
    geschlecht: "",
    chip_nr: "",
    wurfdatum: "",
    hundegröße_in_cm: "",
    schutzimpfung: "",
    tollwut: "",
    versicherung: "",
    zuchtbuch_nr: "",
    vater: "",
    zuchtbuch_nr_vater: "",
    mutter: "",
    zuchtbuch_nr_mutter: "",
    zuechter_id: "",
    rassen_id: "",
  });

  useEffect(() => {
    fetchrasse();
    fetchzuechter();
    fetchProfileDataDogs(hund_id);
  }, [hund_id]);

  const fetchrasse = async () => {
    try {
      const response = await fetch("http://localhost:5000/auswahlRassen");
      if (!response.ok) {
        throw new Error("Failed to fetch rasse data");
      }
      const rasse = await response.json();
      setRasse(rasse);
    } catch (error) {
      console.error("Error fetching rasse data:", error);
    }
  };

  const fetchzuechter = async () => {
    try {
      const response = await fetch("http://localhost:5000/profileDogZuechter");
      if (!response.ok) {
        throw new Error("Failed to fetch Zuechter data");
      }
      const zuechterdata = await response.json();
      setZuechter(zuechterdata);
    } catch (error) {
      console.error("Error fetching Zuechter data:", error);
    }
  };

  const fetchProfileDataDogs = async (hund_id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/profileDog/${hund_id}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch profile data");
      }
      const data = await response.json();

      // Formatierung der Datumsfelder
      if (data.wurfdatum) {
        data.wurfdatum = data.wurfdatum.split("T")[0];
      }
      if (data.schutzimpfung) {
        data.schutzimpfung = data.schutzimpfung.split("T")[0];
      }
      if (data.tollwut) {
        data.tollwut = data.tollwut.split("T")[0];
      }

      setProfileDataDog(data);
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileDataDog((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/setProfileDog/${hund_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(profileDataDog),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update profile data");
      }
      setFeedbackMessage("Die Daten wurden erfolgreich gespeichert!");
      setFeedbackSeverity("success");
    } catch (error) {
      console.error("Error updating profile data:", error);
      setFeedbackMessage("Fehler beim Speichern der Daten");
      setFeedbackSeverity("error");
    }
  };

  if (!profileDataDog) {
    return <div>Lade Profil...</div>;
  }

  return (
    <Container maxWidth="md">
      <Box display="flex" justifyContent="space-between" mb={3} mt={3}>
        <LogoutButton />
        <ZurueckButton />
        
      </Box>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Hunde Profil Informationen
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Rufname"
              name="rufname"
              value={profileDataDog.rufname}
              onChange={handleChange}
              fullWidth
              required
              error={!profileDataDog.rufname}
              helperText={!profileDataDog.rufname && "Pflichtfeld bitte befüllen"}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Hundename"
              name="hundename"
              value={profileDataDog.hundename}
              onChange={handleChange}
              fullWidth
              required
              error={!profileDataDog.hundename}
              helperText={!profileDataDog.hundename && "Pflichtfeld bitte befüllen"}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Geschlecht"
              name="geschlecht"
              value={profileDataDog.geschlecht}
              onChange={handleChange}
              fullWidth
              required
              error={!profileDataDog.geschlecht}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Chip-Nummer"
              name="chip_nr"
              value={profileDataDog.chip_nr}
              onChange={handleChange}
              fullWidth
              required
              error={!profileDataDog.chip_nr}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Wurfdatum"
              name="wurfdatum"
              type="date"
              value={profileDataDog.wurfdatum}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
              required
              error={!profileDataDog.wurfdatum}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Hundegröße in cm"
              name="hundegröße_in_cm"
              type="number"
              value={profileDataDog.hundegröße_in_cm}
              onChange={handleChange}
              fullWidth
              required
              error={!profileDataDog.hundegröße_in_cm}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Schutzimpfung"
              name="schutzimpfung"
              type="date"
              value={profileDataDog.schutzimpfung}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
              required
              error={!profileDataDog.schutzimpfung}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Tollwut"
              name="tollwut"
              type="date"
              value={profileDataDog.tollwut}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
              required
              error={!profileDataDog.tollwut}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Versicherung"
              name="versicherung"
              value={profileDataDog.versicherung}
              onChange={handleChange}
              fullWidth
              required
              error={!profileDataDog.versicherung}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Zuchtbuch-Nummer"
              name="zuchtbuch_nr"
              value={profileDataDog.zuchtbuch_nr}
              onChange={handleChange}
              fullWidth
              required
              error={!profileDataDog.zuchtbuch_nr}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Vater"
              name="vater"
              value={profileDataDog.vater}
              onChange={handleChange}
              fullWidth
              required
              error={!profileDataDog.vater}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Zuchtbuch-Nummer Vater"
              name="zuchtbuch_nr_vater"
              value={profileDataDog.zuchtbuch_nr_vater}
              onChange={handleChange}
              fullWidth
              required
              error={!profileDataDog.zuchtbuch_nr_vater}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Mutter"
              name="mutter"
              value={profileDataDog.mutter}
              onChange={handleChange}
              fullWidth
              required
              error={!profileDataDog.mutter}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Zuchtbuch-Nummer Mutter"
              name="zuchtbuch_nr_mutter"
              value={profileDataDog.zuchtbuch_nr_mutter}
              onChange={handleChange}
              fullWidth
              required
              error={!profileDataDog.zuchtbuch_nr_mutter}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>Züchter</InputLabel>
              <Select
                name="zuechter_id"
                value={profileDataDog.zuechter_id}
                onChange={handleChange}
                label="Züchter"
                error={!profileDataDog.zuechter_id}
              >
                {zuechter.map((z) => (
                  <MenuItem key={z.zuechter_id} value={z.zuechter_id}>
                    {z.vorname} {z.nachname}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>Rasse</InputLabel>
              <Select
                name="rassen_id"
                value={profileDataDog.rassen_id}
                onChange={handleChange}
                label="Rasse"
                error={!profileDataDog.rassen_id}
              >
                {rasse.map((r) => (
                  <MenuItem key={r.rassen_id} value={r.rassen_id}>
                    {r.rasse}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Box mt={3}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Daten Speichern
          </Button>
        </Box>
        {feedbackMessage && (
          <Box mt={3}>
            <Alert variant="outlined" severity={feedbackSeverity}>
              {feedbackMessage}
            </Alert>
          </Box>
        )}
      </Paper>
    </Container>
  );
}
