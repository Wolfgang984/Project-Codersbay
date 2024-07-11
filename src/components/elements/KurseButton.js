
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Kursbutton = () => {
  const navigate = useNavigate();

  const handleGoKurse = async () => {
    navigate("../Kurse");
  };

  return (
    <button onClick={handleGoKurse}>
      Kurse
    </button>
  );
};

export default Kursbutton;
