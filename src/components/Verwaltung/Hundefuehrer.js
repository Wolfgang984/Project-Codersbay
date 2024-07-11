import React, { useState, useEffect } from "react";
import {
  Button, Box, FormControl, InputLabel, Select, MenuItem, Paper
} from "@mui/material";
import { DataGrid, GridToolbarContainer, GridToolbarQuickFilter, GridToolbarExport } from '@mui/x-data-grid';
import { useNavigate } from "react-router-dom";
import LogoutButton from "../elements/handleLogoutButton.js";
import ZurueckButton from "../elements/ZurueckButton.js";

function Hundefuehrer() {
  const [dogHandler, setDogHandler] = useState([]);
  const [saison, setSaison] = useState([]);
  const [year, setYear] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchsaison();
    fetchyear();
  }, []);

  const fetchsaison = async () => {
    try {
      const response = await fetch("http://localhost:5000/saisonVonKursen");
      if (!response.ok) {
        throw new Error("Saisons konnten nicht geladen werden");
      }
      const saisonVonKursen = await response.json();
      setSaison(saisonVonKursen);
    } catch (error) {
      console.error("Fehler beim Laden der Saisons:", error);
    }
  };

  const fetchyear = async () => {
    try {
      const response = await fetch("http://localhost:5000/yearFromKurse");
      if (!response.ok) {
        throw new Error("Jahre konnten nicht geladen werden");
      }
      const yearData = await response.json();
      setYear(yearData);
    } catch (error) {
      console.error("Fehler beim Laden der Jahre:", error);
    }
  };

  const fetchDoghandler = async (season, year) => {
    try {
      const response = await fetch(`http://localhost:5000/AlldogHandler?saison=${season}&year=${year}`);
      if (!response.ok) {
        throw new Error("Failed to fetch dog handlers");
      }
      const data = await response.json();
      const formattedData = data.map((row) => ({
        ...row,
        geb_datum: row.geb_datum ? new Date(row.geb_datum).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '',
        tollwut: row.tollwut ? new Date(row.geb_datum).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '',
        schutzimpfung: row.schutzimpfung ? new Date(row.geb_datum).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '',
        wurfdatum: row.wurfdatum ? new Date(row.geb_datum).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '',
      }));
      setDogHandler(formattedData);
      console.log(formattedData); // Log the formatted data
    } catch (error) {
      console.error("Error fetching dog handlers:", error);
    }
  };

  const handleNavigateProfile = (personId) => {
    console.log(`Navigating to profile of person with ID: ${personId}`);
    navigate(`/profile/${personId}`);
  };

  const handleSeasonChange = (event) => {
    setSelectedSeason(event.target.value);
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchDoghandler(selectedSeason, selectedYear);
  };

  const columns = [
    { field: 'kurs_id', headerName: 'Kurs ID', width: 100, hide: true },
    { field: 'kurs_name', headerName: 'Kurs Name', width: 150 },
    { field: 'nachname', headerName: 'Nachname', width: 150 },
    { field: 'vorname', headerName: 'Vorname', width: 150 },
    { field: 'straße', headerName: 'Straße', width: 150 },
    { field: 'hausnummer', headerName: 'Hausnummer', width: 100 },
    { field: 'plz', headerName: 'PLZ', width: 100 },
    { field: 'stadt', headerName: 'Stadt', width: 150 },
    { field: 'geb_datum', headerName: 'Geburtsdatum', width: 150 },
    { field: 'telefon', headerName: 'Telefon', width: 150 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'rufname', headerName: 'Rufname des Hundes', width: 150 },
    { field: 'hundename', headerName: 'Hundename', width: 150 },
    { field: 'rasse', headerName: 'Rasse', width: 200 },
    { field: 'geschlecht', headerName: 'Geschlecht', width: 100 },
    { field: 'chip_nr', headerName: 'chipnummer', width: 200},
    { field: 'wurfdatum', headerName: 'Wurfdatum', width: 100 },
    { field: 'hundegröße_in_cm', headerName: 'Hundegröße', width: 100 },
    { field: 'schutzimpfung', headerName: 'Schutzimpfung', width: 200 },
    { field: 'tollwut', headerName: 'Tollwut', width: 200 },
    { field: 'versicherung', headerName: 'Versicherung', width: 150 },
    { field: 'zuchtbuch_nr', headerName: 'Zuchtbuchnummer ', width: 150 },
    { field: 'vater', headerName: 'Hundevater', width: 150 },
    { field: 'zuchtbuch_nr_vater', headerName: 'Zb.Nr. Vater', width: 150 },
    { field: 'mutter', headerName: 'Mutter', width: 150 },
    { field: 'newsletter', headerName: 'Newsletter', width: 100 },
    { field: 'whatsapp', headerName: 'Whatsapp', width: 100 },
    { field: 'foto', headerName: 'Foto', width: 100 },
    { field: 'video', headerName: 'Video', width: 100 },
    { field: 'sms', headerName: 'SMS', width: 100 },
    
 
  ];

  const rows = dogHandler.map((row, index) => ({
    id: index,
    kurs_id: row.kurs_id,
    kurs_name: row.kurs_name,
    nachname: row.nachname,
    vorname: row.vorname,
    straße: row.straße,
    hausnummer: row.hausnummer,
    plz: row.plz,
    stadt: row.stadt,
    geb_datum: row.geb_datum,
    telefon: row.telefon,
    email: row.email,
    rufname: row.rufname,
    hundename: row.hundename,
    rasse:row.rasse,
    geschlecht: row.geschlecht,
    chip_nr:row.chip_nr,
    wurfdatum:row.wurfdatum,
    hundegröße_in_cm:row.hundegröße_in_cm,
    schutzimpfung:row.schutzimpfung,
    tollwut:row.tollwut,
    versicherung:row.versicherung,
    zuchtbuch_nr:row.zuchtbuch_nr,
    vater:row.vater,
    zuchtbuch_nr_vater:row.zuchtbuch_nr_vater,
    mutter:row.mutter,
    newsletter:row.newsletter,
    whatsapp:row.whatsapp,
    foto:row.foto,
    video:row.video,
    sms:row.sms







    

    




   
  }));

  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarQuickFilter placeholder='Suche' style={{ width: "60%", minWidth: "200px", paddingBottom: "10px", paddingTop: "15px", paddingLeft: "5px" }} />
        <GridToolbarExport style={{ position: "absolute", right: "10px" }} />
      </GridToolbarContainer>
    );
  }

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <LogoutButton />
        <ZurueckButton />
      </Box>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <FormControl fullWidth margin="normal">
            <InputLabel id="season-select-label">Wähle Saison</InputLabel>
            <Select
              labelId="season-select-label"
              id="season-select"
              value={selectedSeason}
              label="Wähle Saison"
              onChange={handleSeasonChange}
            >
              <MenuItem value="">
                <em>Saison auswählen</em>
              </MenuItem>
              {saison.map((season) => (
                <MenuItem key={season.saison_id} value={season.saison_id}>
                  {season.saison}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel id="year-select-label">Wähle das Jahr aus</InputLabel>
            <Select
              labelId="year-select-label"
              id="year-select"
              value={selectedYear}
              label="Wähle das Jahr aus"
              onChange={handleYearChange}
            >
              <MenuItem value="">
                <em>Jahr auswählen</em>
              </MenuItem>
              {year.map((j) => (
                <MenuItem key={j.jahr} value={j.Jahr}>
                  {j.Jahr}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
            Suchen
          </Button>
        </Box>
      </Paper>
      <DataGrid
        rows={rows}
        columns={columns}
        slots={{
          toolbar: CustomToolbar
        }}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 20,
            },
          },
        }}
        pageSizeOptions={[20]}
        disableRowSelectionOnClick
      />
    </Box>
  );
}

export default Hundefuehrer;
