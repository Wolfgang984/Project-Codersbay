import React, { useEffect, useState } from "react";
import { Button, TextField, Typography, Box, Container, Paper, Grid, Select, MenuItem, InputLabel, FormControl, IconButton, RadioGroup, FormControlLabel, Radio, FormLabel } from "@mui/material";
import LogoutButton from "../elements/handleLogoutButton.js";
import ZurueckButton from "../elements/ZurueckButton.js";
import DeleteIcon from '@mui/icons-material/Delete';
import {List, ListItem, ListItemText} from "@mui/material"

export default function Kursverwaltung() {
  const [neuerKursName, setNeuerKursName] = useState({});
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackClass, setFeedbackClass] = useState("");
  const [getAllCourseWithPrice, setGetAllCourseWithPrice] = useState([]);
  const [getAllCourse, setGetAllCourse] = useState([]);
  const [neueKursPreise, setNeueKursPreise] = useState({});
  const [getSeason, setGetSeason] = useState([]);
  const [filterOptionPreise, setFilterOptionPreise] = useState("all");
  const [filterOptionKurse, setFilterOptionKurse] = useState("all");
  const [angelegteKurse, setAngelegteKurse] = useState([]);
  const [courses, setCourses] = useState([]);
  const [neuerKurs, setNeuerKurs] = useState({
    kurs_name_id: "",
    preis_id: "",
    saison_id: "",
    kurs_start: "",
    kurs_ende:""
  });

  useEffect(() => {
    fetchGetSeason();
    fetchGetAllCourseWithPrice();
    fetchGetAllCourse();
    fetchangelegteKurse();
  }, []);

  const fetchangelegteKurse = async () => {
    try {
      const response = await fetch("http://localhost:5000/angelegteKurse");
      if (!response.ok) {
        throw new Error("Failed to fetch angelegte Kurse");
      }
      const data = await response.json();
      setAngelegteKurse(data);
    } catch (error) {
      console.error("Error fetching angelegte Kurse:", error);
    }
  };

  const fetchGetAllCourseWithPrice = async () => {
    try {
      const response = await fetch("http://localhost:5000/alleKurseNamenMitPreis");
      if (!response.ok) {
        throw new Error("Failed to fetch all courses with price");
      }
      const data = await response.json();
      setGetAllCourseWithPrice(data);
    } catch (error) {
      console.error("Error fetching all courses with price:", error);
    }
  };

  const fetchGetAllCourse = async () => {
    try {
      const response = await fetch("http://localhost:5000/alleKurs_namen");
      if (!response.ok) {
        throw new Error("Failed to fetch all courses");
      }
      const data = await response.json();
      setGetAllCourse(data);
    } catch (error) {
      console.error("Error fetching all courses:", error);
    }
  };

  const fetchGetSeason = async () => {
    try {
      const response = await fetch("http://localhost:5000/getSeason");
      if (!response.ok) {
        throw new Error("Failed to fetch seasons");
      }
      const data = await response.json();
      setGetSeason(data);
    } catch (error) {
      console.error("Error fetching seasons:", error);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`http://localhost:5000/neuerKursname`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(neuerKursName),
      });
      if (!response.ok) {
        throw new Error("Failed to update course data");
      }
      setFeedbackMessage("Die Daten wurden erfolgreich gespeichert!");
      fetchGetAllCourseWithPrice();
      fetchGetAllCourse();
    } catch (error) {
      console.error("Error updating course data:", error);
      setFeedbackMessage("Fehler beim Speichern der Daten");
    }
  };

  const handleSubmitNeuePreise = async () => {
    try {
      const response = await fetch(`http://localhost:5000/neueKursPreise`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(neueKursPreise),
      });
      if (!response.ok) {
        throw new Error("Failed to update course prices");
      }
      setFeedbackMessage("Die Daten wurden erfolgreich gespeichert!");
      fetchGetAllCourseWithPrice();
      fetchGetAllCourse();
    } catch (error) {
      console.error("Error updating course prices:", error);
      setFeedbackMessage("Fehler beim Speichern der Daten");
    }
  };

  const handleDelete = async (preis_id) => {
    let kursExists = angelegteKurse.some((kurs) => kurs.preis_id === preis_id);

    if (kursExists) {
      console.log("Es Existiert bereits ein kurs, bitte erst kurs löschen");
      setFeedbackMessage("Es Existiert bereits ein kurs, bitte erst kurs löschen");
      setFeedbackClass(""); 
      setTimeout(() => setFeedbackClass("fade-out"), 2000); 
      return; // 
    }
    try {
      const response = await fetch(`http://localhost:5000/deleteCourse`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ preis_id }),
      });
      if (!response.ok) {
        throw new Error("Failed to delete course");
      }
      setFeedbackMessage("Der Kurs wurde erfolgreich gelöscht!");
      fetchGetAllCourseWithPrice();
      fetchangelegteKurse();
    } catch (error) {
      console.error("Error deleting course:", error);
      setFeedbackMessage("Fehler beim Löschen des Kurses");
    }
  };



  
  const handleDeleteAngelegteKurse = async (kurs_id) => {
  try {
    const response = await fetch(`http://localhost:5000/deleteAngelegteKurse`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ kurs_id }),
    });
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Failed to delete course");
    }

    if (result.hasParticipants) {
      setFeedbackMessage("Der Kurs hat bereits Teilnehmer und kann nicht gelöscht werden.");
    } else {
      setFeedbackMessage("Der Kurs wurde erfolgreich gelöscht!");
      fetchGetAllCourseWithPrice();
      fetchangelegteKurse();
    }
  } catch (error) {
    console.error("Error deleting course:", error);
    setFeedbackMessage("Fehler beim Löschen des Kurses");
  }
};
  

  const handleStatusChange = async (e, kurs_id) => {
    const newStatus = e.target.value;
    updateCourseStatus(kurs_id, newStatus);

    try {
      const response = await fetch("http://localhost:5000/updateAktiv", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ kurs_id, newStatus }), // Include newStatus in the body
      });
      if (!response.ok) {
        throw new Error("Failed to update status");
      }
      setFeedbackMessage("Der Status des Kurses wurde erfolgreich aktualisiert!");
      fetchGetAllCourseWithPrice();
      fetchangelegteKurse();
    } catch (error) {
      console.error("Error updating course status:", error);
      setFeedbackMessage("Fehler beim Aktualisieren des Kursstatus");
    }
  };

  const handleSaveNeuerKurs = async () => {
    let kursExists = angelegteKurse.some(
      (kurs) => 
        kurs.kurs_name_id === neuerKurs.kurs_name_id && kurs.saison_id == neuerKurs.saison_id && 
        new Date(kurs.kurs_start).getFullYear() === new Date(neuerKurs.kurs_start).getFullYear()
    );

    if (kursExists) {
      console.log("Dieser Kurs existiert bereits");
      setFeedbackMessage("Dieser Kurs existiert bereits");
      setFeedbackClass(""); // Rücksetzen der Klasse
      setTimeout(() => setFeedbackClass("fade-out"), 2000); // Fade-Out nach 2 Sekunden
      return; // Die Funktion hier beenden, da der Kurs bereits existiert
    }

    try {
      const response = await fetch(`http://localhost:5000/neuerKurs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(neuerKurs),
      });

      if (!response.ok) {
        throw new Error("Failed to create new course");
      }

      setFeedbackMessage("Der neue Kurs wurde erfolgreich angelegt!");
      setFeedbackClass(""); // Rücksetzen der Klasse
      setTimeout(() => setFeedbackClass("fade-out"), 4000); // Fade-Out nach 2 Sekunden

      fetchangelegteKurse();
    } catch (error) {
      console.error("Error creating new course:", error);
      setFeedbackMessage("Fehler beim Anlegen des neuen Kurses");
      setFeedbackClass(""); 
      setTimeout(() => setFeedbackClass("fade-out"), 4000); // Fade-Out nach 2 Sekunden
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNeuerKursName((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleChangeNeuePreise = (e) => {
    const { name, value } = e.target;
    setNeueKursPreise((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleChangeNeuerKurs = (e) => {
    const { name, value } = e.target;
    setNeuerKurs((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleKursChange = (e) => {
    const selectedValue = e.target.value;
    const selectedOption = getAllCourseWithPrice.find(kurs => kurs.kurs_name_id === selectedValue);
    if (selectedOption) {
      setNeuerKurs((prevData) => ({
        ...prevData,
        kurs_name_id: selectedOption.kurs_name_id,
        preis_id: selectedOption.preis_id,
      }));
    }
  };
  

  const updateCourseStatus = (kurs_id, newStatus) => {
    setCourses((prevCourses) =>
      prevCourses.map((course) =>
        course.kurs_id === kurs_id ? { ...course, status: newStatus } : course
      )
    );
  };

  const handleFilterChangePreise = (e) => {
    setFilterOptionPreise(e.target.value);
  };
  
  const handleFilterChangeKurse = (e) => {
    setFilterOptionKurse(e.target.value);
  };
  
  const filteredCourses = getAllCourseWithPrice.filter((course) => {
    const currentYear = new Date().getFullYear();
    const courseDate = new Date(course.kurs_start); 
    if (filterOptionPreise === "all") {
      return true;
    } else if (filterOptionPreise === "current") {
      return courseDate.getFullYear() === currentYear && courseDate >= new Date();
    } else if (filterOptionPreise === "future") {
      return courseDate.getFullYear() === currentYear + 1;
    } else if (filterOptionPreise === "past") {
      return courseDate < new Date() && courseDate.getFullYear() < currentYear;
    }
  });
  
  const angelegteFilteredCourses = angelegteKurse.filter((course) => {
    const currentYear = new Date().getFullYear();
    const courseDate = new Date(course.kurs_start);
    if (filterOptionKurse === "all") {
      return true;
    } else if (filterOptionKurse === "current") {
      return courseDate.getFullYear() === currentYear && courseDate >= new Date();
    } else if (filterOptionKurse === "future") {
      return courseDate.getFullYear() === currentYear + 1;
    } else if (filterOptionKurse === "past") {
      return courseDate < new Date() && courseDate.getFullYear() < currentYear;
    }
  });
  
  
  
  return (
    <Container maxWidth="md">
      <Box display="flex" justifyContent="space-between" mb={3} mt={3}>
        <LogoutButton />
        <ZurueckButton />
      </Box>
      <Typography variant="h4" gutterBottom className="headerUnderline" align="center">
        Kursverwaltung
      </Typography>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Füge neuen Kurs hinzu!
        </Typography>
        <Box component="form" noValidate autoComplete="off" mb={3}>
          <TextField
            label="Kursname"
            name="kurs_name"
            value={neuerKursName.kurs_name || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Speichern
          </Button>
        </Box>
        {feedbackMessage && <div className="feedback">{feedbackMessage}</div>}
      </Paper>
      <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
        <Typography variant="h5" gutterBottom>
          Preise
        </Typography>
        <FormControl fullWidth margin="normal">
          <InputLabel id="filter-preise-label">Filter</InputLabel>
          <Select
            labelId="filter-preise-label"
            value={filterOptionPreise}
            onChange={handleFilterChangePreise}
          >
            <MenuItem value="all">Alle Kurse</MenuItem>
            <MenuItem value="current">Aktuelles Jahr</MenuItem>
            <MenuItem value="future">Nächstes Jahr</MenuItem>
            <MenuItem value="past">Vergangene Kurse</MenuItem>
          </Select>
        </FormControl>
        <List>
          {filteredCourses.map((course, index) => (
            <ListItem key={index} divider>
              <Grid container alignItems="center">
                <Grid item xs={8}>
                  <ListItemText
                    primary={`Kursname: ${course.kurs_name}`}
                    secondary={`Preis: ${course.preis_in_euro}€, Jahr: ${course.jahr}`}
                  />
                </Grid>
                <Grid item xs={4} container justifyContent="flex-end">
                  {course.jahr >= new Date().getFullYear() || course.jahr === null ? (
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDelete(course.preis_id)}
                      disabled={course.hasParticipants} // Deaktivieren des Buttons, wenn Teilnehmer vorhanden sind
                    >
                      <DeleteIcon />
                    </IconButton>
                  ) : null}
                </Grid>
              </Grid>
            </ListItem>
          ))}
        </List>
      </Paper>
      <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
        <Typography variant="h5" gutterBottom>
          Neue Preise festlegen
        </Typography>
        <Box component="form" noValidate autoComplete="off" mb={3}>
          <FormControl fullWidth margin="normal">
            <InputLabel id="kurs-name-label">Kurs auswählen</InputLabel>
            <Select
              labelId="kurs-name-label"
              name="kurs_name_id"
              value={neueKursPreise.kurs_name_id || ""}
              onChange={handleChangeNeuePreise}
            >
              <MenuItem value="">
                <em>Kurs auswählen</em>
              </MenuItem>
              {getAllCourse.map((kurs) => (
                <MenuItem key={kurs.kurs_name_id} value={kurs.kurs_name_id}>
                  {kurs.kurs_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Jahr"
            name="jahr"
            type="number"
            value={neueKursPreise.jahr || ""}
            onChange={handleChangeNeuePreise}
            fullWidth
            margin="normal"
            inputProps={{ min: 2022, max: 2100 }}
          />
          <TextField
            label="Preis in Euro"
            name="preis_in_euro"
            type="number"
            value={neueKursPreise.preis_in_euro || ""}
            onChange={handleChangeNeuePreise}
            fullWidth
            margin="normal"
            inputProps={{ min: 10, max: 1000 }}
          />
          <Button variant="contained" color="primary" onClick={handleSubmitNeuePreise}>
            Speichern
          </Button>
        </Box>
      </Paper>
      <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
        <Typography variant="h5" gutterBottom>
          Angelegte Kurse
        </Typography>
        <FormControl fullWidth margin="normal">
          <InputLabel id="filter-kurse-label">Filter</InputLabel>
          <Select
            labelId="filter-kurse-label"
            value={filterOptionKurse}
            onChange={handleFilterChangeKurse}
          >
            <MenuItem value="all">Alle Kurse</MenuItem>
            <MenuItem value="current">Aktuelle Kurse</MenuItem>
            <MenuItem value="future">Nächstes Jahr</MenuItem>
            <MenuItem value="past">Vergangene Kurse</MenuItem>
          </Select>
        </FormControl>
        <List>
          {angelegteFilteredCourses.map((course) => (
            <ListItem key={course.kurs_id} divider>
              <Grid container alignItems="center">
                <Grid item xs={8}>
                  <ListItemText
                    primary={`Kursname: ${course.kurs_name}, Saison: ${course.saison}`}
                    secondary={`Preis: ${course.preis_in_euro}€, Status: ${course.aktivstatus}, Kursstart: ${new Date(course.kurs_start).toLocaleDateString()}`}
                  />
                </Grid>
                <Grid item xs={4} container justifyContent="flex-end">
                  {new Date(course.kurs_start) >= new Date() && (
                    <>
                      <FormControl component="fieldset">
                        <FormLabel component="legend">Status</FormLabel>
                        <RadioGroup
                          row
                          name={`status-${course.kurs_id}`}
                          value={course.status}
                          onChange={(e) => handleStatusChange(e, course.kurs_id)}
                        >
                          <FormControlLabel value="AKTIV" control={<Radio />} label="AKTIV" />
                          <FormControlLabel value="INAKTIV" control={<Radio />} label="INAKTIV" />
                        </RadioGroup>
                      </FormControl>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleDeleteAngelegteKurse(course.kurs_id)}
                        disabled={course.hasParticipants} // Deaktivieren des Buttons, wenn Teilnehmer vorhanden sind
                      >
                        <DeleteIcon />
                      </IconButton>
                    </>
                  )}
                </Grid>
              </Grid>
            </ListItem>
          ))}
        </List>
      </Paper>
      <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
        <Typography variant="h5" gutterBottom>
          Neuen Kurs anlegen
        </Typography>
        <Box component="form" noValidate autoComplete="off" mb={3}>
        <FormControl fullWidth margin="normal">
  <InputLabel id="neuer-kurs-name-label">Kurs auswählen</InputLabel>
  <Select
    labelId="neuer-kurs-name-label"
    name="kurs_name_id"
    value={
      getAllCourseWithPrice.some(
        (kurs) => kurs.kurs_name_id === neuerKurs.kurs_name_id
      )
        ? neuerKurs.kurs_name_id
        : ""
    }
    onChange={handleKursChange}
  >
    <MenuItem value="">
      <em>Kurs auswählen</em>
    </MenuItem>
    {getAllCourseWithPrice
      .filter((kurs) => kurs.jahr >= new Date().getFullYear())
      .map((kurs) => (
        <MenuItem
          key={`${kurs.kurs_name_id}-${kurs.jahr}`}
          value={kurs.kurs_name_id}
          data-value={JSON.stringify({
            kurs_name_id: kurs.kurs_name_id,
            preis_id: kurs.preis_id,
          })}
        >
          {kurs.kurs_name} {kurs.jahr}
        </MenuItem>
      ))}
  </Select>
</FormControl>
<FormControl fullWidth margin="normal">
  <InputLabel id="saison-label">Saison auswählen</InputLabel>
  <Select
    labelId="saison-label"
    name="saison_id"
    value={neuerKurs.saison_id}
    onChange={handleChangeNeuerKurs}
  >
    <MenuItem value="">
      <em>Saison auswählen</em>
    </MenuItem>
    {getSeason.map((season) => (
      <MenuItem key={season.saison_id} value={season.saison_id}>
        {season.saison}
      </MenuItem>
    ))}
  </Select>
</FormControl>
<TextField
  label="Kurs Start"
  name="kurs_start"
  type="date"
  value={neuerKurs.kurs_start}
  onChange={handleChangeNeuerKurs}
  fullWidth
  margin="normal"
  InputLabelProps={{ shrink: true }}
/>
<TextField
  label="Kurs Ende"
  name="kurs_ende"
  type="date"
  value={neuerKurs.kurs_ende}
  onChange={handleChangeNeuerKurs}
  fullWidth
  margin="normal"
  InputLabelProps={{ shrink: true }}
/>
          <Button variant="contained" color="primary" onClick={handleSaveNeuerKurs}>
            Speichern
          </Button>
        </Box>
      </Paper>
      <div className={`feedback ${feedbackClass}`}>{feedbackMessage}</div>
    </Container>
  );
}
