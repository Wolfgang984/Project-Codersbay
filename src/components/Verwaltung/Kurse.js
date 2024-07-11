import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  IconButton,
  TextField,
  Container,
  Paper
} from "@mui/material";
import { VscChromeClose } from "react-icons/vsc";
import { VscCheck } from "react-icons/vsc";
import DeleteIcon from "@mui/icons-material/Delete";
import { DataGrid, GridToolbarContainer, GridToolbarQuickFilter, GridToolbarExport } from '@mui/x-data-grid';
import { useNavigate } from "react-router-dom";
import LogoutButton from "../elements/handleLogoutButton.js";
import ZurueckButton from "../elements/ZurueckButton.js";

export default function Kurse() {
  const [kursteilnehmer, setKursteilnehmer] = useState([]);
  const [saison, setSaison] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState("");
  const [year, setYear] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchsaison();
    fetchyear();
  }, []);

  const fetchkursteilnehmer = async (saison_id, jahr) => {
    const params = new URLSearchParams({
      saison_id,
      jahr,
    }).toString();

    const url = `http://localhost:5000/submitSelection?${params}`;

    try {
      const response = await fetch(url, {
        method: "GET",
      });
      if (!response.ok) {
        throw new Error("Teilnehmer konnten nicht geladen werden");
      }
      const result = await response.json();
      // Füge die Überprüfung für fehlende Daten hinzu
      const updatedResult = result.map(teilnehmer => ({
        ...teilnehmer,
        missingData: checkMissingData(teilnehmer)
      }));
      setKursteilnehmer(updatedResult);
    } catch (error) {
      console.error("Fehler beim Laden der Teilnehmer:", error);
    }
  };

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

  const handleSeasonChange = (event) => {
    setSelectedSeason(event.target.value);
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchkursteilnehmer(selectedSeason, selectedYear);
  };

  const handleDelete = async (kb_id) => {
    try {
      const response = await fetch(`http://localhost:5000/deleteTeilnehmer/${kb_id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Teilnehmer konnte nicht gelöscht werden");
      }
      setKursteilnehmer((prev) => prev.filter((teilnehmer) => teilnehmer.kb_id !== kb_id));
    } catch (error) {
      console.error("Fehler beim Löschen des Teilnehmers:", error);
    }
  };

  const handleBezahltChange = (kb_id, value) => {
    const bezahltValue = parseFloat(value);

    setKursteilnehmer((prev) =>
      prev.map((teilnehmer) =>
        teilnehmer.kb_id === kb_id ? { ...teilnehmer, bezahlt: bezahltValue } : teilnehmer
      )
    );

    fetch(`http://localhost:5000/bezahltstatus/${kb_id}`, {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ bezahlt: bezahltValue }),
    }).then(response => {
      if (!response.ok) {
        throw new Error("Status konnte nicht aktualisiert werden");
      }
      return response.json();  // Parse the JSON response
    }).then(data => {
      console.log("Statusaktualisierungsantwort:", data);
    }).catch(error => {
      console.error("Fehler bei der Aktualisierung des bezahlt-Status:", error);
    });

  };

  const handleNameClick = (id) => {
    console.log("Navigating to profile with person_id:", id);
    navigate(`/Profile/${id}`);
  };
  
  const handleDogNameClick = (hund_id) => {
    console.log("Navigating to profile with hund_id:", hund_id);
    navigate(`/ProfilDog/${hund_id}`);
  };

  const checkMissingData = (teilnehmer) => {
    const dogFields = [
      'rufname', 'hundename', 'chip_nr',
      'hundegröße_in_cm', 'wurfdatum',
      'schutzimpfung', 'tollwut', 'versicherung', 'zuchtbuch_nr', 'vater',
      'zuchtbuch_nr_vater', 'mutter', 'zuchtbuch_nr_mutter', 'rassen_id'
    ];
  
    const personFields = [
      'vorname', 'nachname', 'geb_datum', 'telefon', 'email', 'adresse_id',
      'straße', 'plz', 'stadt', 'hausnummer', 'staat_id'
    ];
  
    const missingDogData = dogFields.some(field => teilnehmer[field] === null || teilnehmer[field] === '');
    const missingPersonData = personFields.some(field => teilnehmer[field] === null || teilnehmer[field] === '');
  
    return { missingDogData, missingPersonData };
  };
  
  const columns = [
    {
      field: 'kursHeader',
      headerName: 'Kurs',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        if (params.row.isGroup) {
          return (
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {params.value}
            </Typography>
          );
        }
        return null;
      }
    },
    {
      field: 'vorname',
      headerName: 'Vorname',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      cellClassName: (params) => (params.row.isGroup ? '' : (params.row.missingData?.missingPersonData ? 'red-border' : '')),
      renderCell: (params) => (
        <span
          onClick={() => handleNameClick(params.row.person_id)}
          style={{ cursor: 'pointer', color: params.row.missingData?.missingPersonData ? 'red' : 'inherit' }}
        >
          {params.value}
        </span>
      )
    },
    {
      field: 'nachname',
      headerName: 'Nachname',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      cellClassName: (params) => (params.row.isGroup ? '' : (params.row.missingData?.missingPersonData ? 'red-border' : '')),
      renderCell: (params) => (
        <span
          onClick={() => handleNameClick(params.row.person_id)}
          style={{ cursor: 'pointer', color: params.row.missingData?.missingPersonData ? 'red' : 'inherit' }}
        >
          {params.value}
        </span>
      )
    },
    {
      field: 'rufname',
      headerName: 'Rufname',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      cellClassName: (params) => (params.row.isGroup ? '' : (params.row.missingData?.missingDogData ? 'red-border' : '')),
      renderCell: (params) => (
        <span
          onClick={() => handleDogNameClick(params.row.hund_id)}
          style={{ cursor: 'pointer', color: params.row.missingData?.missingDogData ? 'red' : 'inherit' }}
        >
          {params.value}
        </span>
      )
    },
   
    {
      field: 'bezahlt',
      headerName: 'Hat bezahlt',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        if (params.row.isGroup) {
          return null;
        }
        return (
          <TextField style={{justifyContent:'center'}}
            value={params.value || ''}
            onChange={(e) => handleBezahltChange(params.row.kb_id, e.target.value)}
            placeholder="Nein"
            variant="outlined"
            size="small"
            error={params.value === null || params.value === undefined || isNaN(params.value)}
          />
        );
      }
    },
    {
      field: 'missingData',
      headerName: 'Fehlende Daten',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        if (params.value?.missingDogData || params.value?.missingPersonData) {
          return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <VscChromeClose style={{backgroundColor:"red", color:"white", padding:"5px", borderRadius: "100%"}}/>
            </div>
          );
        }
        return ( <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <VscCheck style={{backgroundColor:"green", color:"white", padding:"5px", borderRadius: "100%"}}/>
        </div>);
      }
    },
    {
      field: 'actions',
      headerName: 'Aktionen',
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        if (params.row.isGroup) {
          return null;
        }
        return (
          <IconButton edge="end" onClick={() => handleDelete(params.row.kb_id)}>
            <DeleteIcon />
          </IconButton>
        );
      }
    },
  ];
  

  const rows = [];
  kursteilnehmer.forEach((teilnehmer, index) => {
    // Add a header row for the course if it's the first participant of the course
    if (index === 0 || kursteilnehmer[index - 1].kurs_name !== teilnehmer.kurs_name) {
      rows.push({
        id: `header-${teilnehmer.kurs_name}`,
        kursHeader: teilnehmer.kurs_name,
        vorname: '',
        nachname: '',
        rufname: '',
        hundename: '',
        bezahlt: '',
        kb_id: '',
        isGroup: true
      });
    }
    // Add the participant row
    rows.push({
      id: teilnehmer.kb_id || `teilnehmer-${index}`,
      ...teilnehmer,
      isGroup: false
    });
  });

  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarQuickFilter placeholder='Suche' style={{ width: "60%", minWidth: "200px", paddingBottom: "10px", paddingTop: "15px", paddingLeft: "5px" }} />
        <GridToolbarExport style={{ position: "absolute", right: "10px" }} />
      </GridToolbarContainer>
    );
  }
  const getRowClassName = (params) => {
    if (params.row.isGroup) {
      return 'group-row';
    }
    return params.indexRelativeToCurrentPage % 2 === 0 ? 'row-even' : 'row-odd';
  };

  return (
    <Container maxWidth="md">
      <Box display="flex" justifyContent="space-between" mb={3} mt={3}>
        <LogoutButton />
        <ZurueckButton />
      </Box>
      <Typography variant="h4" gutterBottom className="headerUnderline" align="center">
        Kursteilnehmer
      </Typography>
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
      <Box sx={{ height: 600, width: '100%', mt: 4 }}>
      <DataGrid
  rows={rows} 
  columns={columns}
  pageSize={10}
  rowsPerPageOptions={[10, 20, 50]}
  disableSelectionOnClick
  components={{
    Toolbar: CustomToolbar
  }}
  getRowId={(row) => row.id}
  getRowClassName={(params) =>
    params.row.isGroup ? 'group-row' : (params.indexRelativeToCurrentPage % 2 === 0 ? 'row-even' : 'row-odd')
  }
/>

      </Box>
    </Container>
  );
}
