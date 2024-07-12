import React, { useState, useEffect } from 'react';
import imageHeader from '../../assets/Bilder/writingDog.png'

function Step4({ userData, selectedSeason, selectedCourse, onDogConfirm }) {
  const [dogs, setDogs] = useState([]);
  const [selectedDog, setSelectedDog] = useState(null);
  const [wantsToRegisterNewDog, setWantsToRegisterNewDog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newDog, setNewDog] = useState({
    rufname: '',
    hundename: '',
    geschlecht: '',
    wurfdatum: '',
    schutzimpfung: '',
    tollwut: '',
    versicherung: '',
    rassen_id: ''
  });
  const [rassen, setRassen] = useState([]);

  useEffect(() => {
    console.log('userData in useEffect:', userData);
    fetchRassenData();
    if (userData && userData.email) {
      console.log('Calling fetchDogData with email:', userData.email);
      fetchDogData(userData.email);
    }
  }, [userData]);

  const fetchRassenData = async () => {
    try {
      const response = await fetch(`http://localhost:5000/auswahlRassen`);
      if (!response.ok) {
        throw new Error("Failed to fetch breeds data");
      }
      const data = await response.json();
      console.log('Fetched breeds:', data);
      setRassen(data); // Stellen Sie sicher, dass die Antwort ein Array ist
    } catch (error) {
      console.error("Error fetching breeds data:", error);
    }
  };

  const fetchDogData = async (email) => {
    console.log('fetchDogData called with email:', email);
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:5000/hundeByEmail/${email}`);
      if (!response.ok) {
        console.log("Failed to fetch dog data");
      }
      const data = await response.json();
      console.log('Fetched dog data:', data);
      setDogs(data);
    } catch (error) {
      setError(error.message);
      console.error("Error fetching dog data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDogSelection = (dog) => {
    setSelectedDog(dog);
    setWantsToRegisterNewDog(false);
  };

  const handleNewDogDataChange = (e) => {
    const { name, value } = e.target;
    console.log(`New dog data change - ${name}: ${value}`);
    setNewDog((prevData) => ({
      ...prevData,
      [name]: value, // trim leading/trailing whitespace
    }));
  };

  const handleConfirm = () => {
    if (selectedDog) {
      console.log('Confirmed dog:', selectedDog);
      onDogConfirm({ hunde_id: selectedDog.hund_id, hundefuehrer_id:selectedDog.hundefuehrer_id,person_id:selectedDog.person_id, selectedSeason, selectedCourse });
    } else {
      console.log('New dog data to be confirmed:', newDog);
      onDogConfirm({ ...newDog, selectedSeason, selectedCourse });
    }
  };

  const handleRegisterNewDog = () => {
    setSelectedDog(null);
    setWantsToRegisterNewDog(true);
  };

  return (
    <div>
      <div className="header">
    <img src={imageHeader} alt="Header" />
  </div>
    <form id="profil">
      <h2>Anmeldung Hundeschule</h2>
      <div>
    
        <p>Mit welchem Hund möchten sie die hundeschule besuchen?</p>
      </div>
      {loading && <p>Suche läuft...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!wantsToRegisterNewDog && dogs.length > 0 ? (
        <div>
          <h2>Registrierte Hunde</h2>
          {dogs.map((dog) => (
            <div key={dog.hund_id}>
              <label>
                <input
                  type="radio"
                  name="selectedDog"
                  value={dog.hund_id}
                  checked={selectedDog && selectedDog.hund_id === dog.hund_id}
                  onChange={() => handleDogSelection(dog)}
                />
                {dog.rufname} ({dog.hundename})
              </label>
            </div>
          ))}
          <button onClick={handleConfirm}>Mit ausgewähltem Hund den Kurs besuchen</button>
          <button onClick={handleRegisterNewDog}>Mit neuem Hund anmelden?</button>
        </div>
      ) : (
        <div>
          <h2>Schritt 4: Hundedaten erfassen</h2>
          <label>
            Rufname:
            <input type="text" name="rufname" value={newDog.rufname} onChange={handleNewDogDataChange} required />
          </label>
          <label>
            Hundename:
            <input type="text" name="hundename" value={newDog.hundename} onChange={handleNewDogDataChange} required />
          </label>
          <label>
            Geschlecht:
            <select name="geschlecht" value={newDog.geschlecht} onChange={handleNewDogDataChange} required>
              <option value="">Bitte auswählen</option>
              <option value="männlich">Männlich</option>
              <option value="weiblich">Weiblich</option>
            </select>
          </label>
          <label>
            Wurfdatum:
            <input type="date" name="wurfdatum" value={newDog.wurfdatum} onChange={handleNewDogDataChange} required />
          </label>
          <label>
            Schutzimpfung Datum:
            <input type="date" name="schutzimpfung" value={newDog.schutzimpfung} onChange={handleNewDogDataChange} required />
          </label>
          <label>
            Tollwut Datum:
            <input type="date" name="tollwut" value={newDog.tollwut} onChange={handleNewDogDataChange} required />
          </label>
          <label>
            Versicherung:
            <input type="text" name="versicherung" value={newDog.versicherung} onChange={handleNewDogDataChange} required />
          </label>
          <label>
            Rasse:
            <select name="rassen_id" value={newDog.rassen_id} onChange={handleNewDogDataChange} required>
              <option value="">Bitte auswählen</option>
              {rassen.map((rasse) => (
                <option key={rasse.rassen_id} value={rasse.rassen_id}>
                  {rasse.rasse}
                </option>
              ))}
            </select>
          </label>
          <button onClick={handleConfirm}>Bestätigen</button>
        </div>
      )}
    </form>
    </div>
  );
}

export default Step4;
