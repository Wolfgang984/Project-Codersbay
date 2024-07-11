import React, { useState, useEffect } from "react";
import { Button, Typography, Box, Container, Paper } from '@mui/material';
import { DataGrid, GridToolbarContainer, GridToolbarExport, GridToolbarQuickFilter } from '@mui/x-data-grid';
import LogoutButton from "../elements/handleLogoutButton.js";
import { useNavigate } from "react-router-dom";
import ZurueckButton from "../elements/ZurueckButton.js";
import { GrEdit } from "react-icons/gr";


function Hundeverwaltung() {
  const [dogs, setDogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchdog();
  }, []);

  const fetchdog = async () => {
    try {
      const response = await fetch("http://localhost:5000/getDogs");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setDogs(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleNavigateProfile = (hund_id) => {
    console.log("Navigating to profile with hund_id:", hund_id);
    navigate(`/ProfilDog/${hund_id}`);
  };

  const columns = [
    { field: 'rufname', headerName: 'Rufname', flex:0.4, editable: true },
    { field: 'hundename', headerName: 'Hundename', flex:0.5, editable: true },
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

  const rows = dogs.map((dog) => ({
    id: dog.hund_id,
    rufname: dog.rufname,
    hundename: dog.hundename,
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
        Hundeverwaltung
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

export default Hundeverwaltung;
