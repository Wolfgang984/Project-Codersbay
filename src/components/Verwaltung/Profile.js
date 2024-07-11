import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Alert,
  Paper,
} from "@mui/material";
import LogoutButton from "../elements/handleLogoutButton.js";
import ZurueckButton from "../elements/ZurueckButton.js";
import { useParams } from "react-router-dom";

export default function Profil() {
  const { person_id } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackSeverity, setFeedbackSeverity] = useState("success");
  const [getLander, setGetLander] = useState([]);
  const [getverinsrolle, setGetvereinsrolle] = useState([]);

  useEffect(() => {
    fetchVereinsrolle();
  }, []);

  useEffect(() => {
    fetchProfileData(person_id);
  }, [person_id]);

  useEffect(() => {
    fetchLaenderData();
  }, []);

  const fetchVereinsrolle = async () => {
    try {
      const response = await fetch(`http://localhost:5000/getVereinsrolle`);
      if (!response.ok) {
        throw new Error("Failed to fetch profile data");
      }
      const data = await response.json();
      setGetvereinsrolle(data);
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  const fetchLaenderData = async () => {
    try {
      const response = await fetch(`http://localhost:5000/getLaender`);
      if (!response.ok) {
        throw new Error("Failed to fetch profile data");
      }
      const data = await response.json();
      setGetLander(data);
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  const fetchProfileData = async (person_id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/profile/${person_id}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch profile data");
      }
      const data = await response.json();
      if (data.geb_datum) {
        data.geb_datum = data.geb_datum.split("T")[0];
      }
      setProfileData(data);
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/profile/${person_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(profileData),
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

  if (!profileData) {
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
          Profilseite
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Personen-ID: {person_id}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Vorname"
              name="vorname"
              value={profileData.vorname}
              onChange={handleChange}
              error={!profileData.vorname}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Nachname"
              name="nachname"
              value={profileData.nachname}
              onChange={handleChange}
              error={!profileData.nachname}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Geburtsdatum"
              name="geb_datum"
              type="date"
              value={profileData.geb_datum}
              onChange={handleChange}
              error={!profileData.geb_datum}
              fullWidth
              required
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Telefon"
              name="telefon"
              value={profileData.telefon}
              onChange={handleChange}
              error={!profileData.telefon}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Emailadresse"
              name="email"
              value={profileData.email}
              onChange={handleChange}
              error={!profileData.email}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Straße"
              name="straße"
              value={profileData.straße}
              onChange={handleChange}
              fullWidth
              error={!profileData.straße}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Hausnummer"
              name="hausnummer"
              value={profileData.hausnummer}
              onChange={handleChange}
              error={!profileData.hausnummer}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Postleitzahl"
              name="plz"
              value={profileData.plz}
              onChange={handleChange}
              error={!profileData.plz}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Stadt"
              name="bundesland"
              value={profileData.stadt}
              onChange={handleChange}
              error={!profileData.stadt}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Land auswählen</InputLabel>
              <Select
                name="staat_id"
                value={profileData.staat_id}
                onChange={handleChange}
                error={!profileData.staat_id}
                fullWidth
                required
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {getLander.map((staat) => (
                  <MenuItem key={staat.staat_id} value={staat.staat_id}>
                    {staat.staat}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Rolle auswählen</InputLabel>
              <Select
                name="rollen_id"
                value={profileData.rollen}
                onChange={handleChange}
                fullWidth
                required
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {getverinsrolle.map((rolle) => (
                  <MenuItem key={rolle.rollen_id} value={rolle.rollen_id}>
                    {rolle.rolle}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Box mt={3}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
          >
            Speichern
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
