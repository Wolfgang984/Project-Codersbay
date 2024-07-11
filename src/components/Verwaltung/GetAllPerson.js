import React, { useState, useEffect } from "react";
import { Button, Typography, Box, Container, Paper } from '@mui/material';
import { DataGrid, GridToolbarContainer, GridToolbarExport, GridToolbarQuickFilter } from '@mui/x-data-grid';
import LogoutButton from "../elements/handleLogoutButton.js";
import { useNavigate } from "react-router-dom";
import ZurueckButton from "../elements/ZurueckButton.js";
import { GrEdit } from "react-icons/gr";


function PersonList() {
  const [persons, setPersons] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPersons = async () => {
      try {
        const response = await fetch("http://localhost:5000/getAllPerson");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setPersons(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchPersons();
  }, []);

  const handleNavigateProfile = (person_id) => {
    console.log("Navigating to profile with person_id:", person_id);
    navigate(`/Profile/${person_id}`);
  };

  const columns = [
    { field: 'vorname', headerName: 'Vorname',flex:0.4, editable: true },
    { field: 'nachname', headerName: 'Nachname', flex:0.5, editable: true },
    {
      field: "Aktion",
      renderCell: (cellValues) => {
        return (
          <Button onClick={() => handleNavigateProfile(cellValues.row.id)}> <GrEdit /></Button>
        );
      },
      flex: 0.1,
      minWidth: 80,
    },
  ];

  const rows = persons.map((person) => ({
    id: person.person_id,
    vorname: person.vorname,
    nachname: person.nachname,
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
    <Container maxWidth="md">
      <Box display="flex" justifyContent="space-between" mb={3} mt={3}>
        <LogoutButton />
        <ZurueckButton />
      </Box>
      <Typography variant="h4" gutterBottom className="headerUnderline" align="center">
        Personenliste
      </Typography>
      <Paper elevation={3} sx={{ p: 3 }}>
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
          autoHeight
        />
      </Paper>
    </Container>
  );
}

export default PersonList;
