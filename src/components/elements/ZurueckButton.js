
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button } from '@mui/material';

const ZurueckButton = () => {
  const navigate = useNavigate();

  const handleGoHome = async () => {
    navigate("../home");
  };

  return (
    <Box margin={1}>
     <Button variant="contained" color="primary" onClick={handleGoHome}>
   Home
   </Button>
   </Box>
  );
};

export default ZurueckButton;
