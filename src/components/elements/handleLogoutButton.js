
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Box } from '@mui/material';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    localStorage.removeItem("jwtToken");
    navigate("../login");
  };

  return (
   <Box margin={1}>
     <Button variant="contained" color="primary" onClick={handleLogout} >
   Logout
   </Button>
   </Box>
  );
};

export default LogoutButton;
