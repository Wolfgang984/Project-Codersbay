import React, { useState, useEffect } from 'react';


function Step1({ onNext }) {
  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState('');

  useEffect(() => {
    fetchSeasons();
  }, []);

  const fetchSeasons = async () => {
    try {
      const response = await fetch("http://localhost:5000/saisonVonKursen");
      if (!response.ok) {
        throw new Error("Failed to fetch seasons");
      }
      const data = await response.json();
      console.log('Fetched seasons:', data);
      setSeasons(data);
    } catch (error) {
      console.error("Error fetching seasons:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedSeason) {
      console.log('Selected season:', selectedSeason);
      onNext({saison_id:selectedSeason});
    } else {
      alert("Bitte eine Saison auswählen.");
    }
  };

  return (

    
    <form id="profil" onSubmit={handleSubmit}>
      <h2>Anmeldung Hundeschule</h2>
      <div>
        <label>Saison auswählen</label>
        <select
          name="saison_id"
          value={selectedSeason}
          onChange={(e) => {
            console.log('Season changed:', e.target.value);
            setSelectedSeason(e.target.value);
          }}
        >
          <option value="">Saison auswählen</option>
          {seasons.map((season) => (
            <option key={season.saison_id} value={season.saison_id}>
              {season.saison}
            </option>
          ))}
        </select>
      </div>
      <button type="submit">Weiter</button>
    </form>
  );
}

export default Step1;
