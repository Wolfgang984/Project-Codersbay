import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";


function Step5({ onOwnerConfirm }) {

  const navigate = useNavigate();

  const [isOwner, setIsOwner] = useState(null);
  const [staat, setStaat] = useState([]);
  const [ownerData, setOwnerData] = useState({
    vorname: '',
    nachname: '',
    geb_datum: '',
    telefon: '',
    email: '',
    straße: '',
    hausnummer: '',
    plz: '',
    stadt: '',
    bundesland: '',
    staat_id: ''
  });

  useEffect(() => {
    fetchLaenderData();
  }, []);

  const fetchLaenderData = async () => {
    try {
      const response = await fetch(`http://localhost:5000/auswahlLaender`);
      if (!response.ok) {
        throw new Error("Failed to fetch profile data");
      }
      const data = await response.json();
      console.log('Fetched states:', data);
      setStaat(data);
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  const handleOwnerChange = (e) => {
    const { name, value } = e.target;
    console.log(`Owner data change - ${name}: ${value}`);
    setOwnerData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleConfirm = () => {
    if (isOwner === 'yes') {
      console.log('Owner confirmed: user is owner');
      onOwnerConfirm(null);
    } else if (isOwner === 'no' && ownerData.vorname && ownerData.nachname && ownerData.email) {
      console.log('Owner confirmed:', ownerData);
      onOwnerConfirm(ownerData);
      
    } else {
      alert('Bitte alle Felder ausfüllen');
    }
    
  };

  return (
    <div id="profil">
      <h2>Schritt 5: Besitzerinformation</h2>
      <p>Sind Sie der Besitzer des Hundes?</p>
      <label>
        <input type="radio" name="isOwner" value="yes" onChange={() => { setIsOwner('yes'); console.log('Is owner: yes'); }} />
        Ja
      </label>
      <label>
        <input type="radio" name="isOwner" value="no" onChange={() => { setIsOwner('no'); console.log('Is owner: no'); }} />
        Nein
      </label>

      {isOwner === 'no' && (
        <div>
          <h3>Besitzerdaten eingeben</h3>
          <label>
            Vorname:
            <input type="text" name="vorname" value={ownerData.vorname} onChange={handleOwnerChange} />
          </label>
          <label>
            Nachname:
            <input type="text" name="nachname" value={ownerData.nachname} onChange={handleOwnerChange} />
          </label>
          <label>
            Geburtsdatum:
            <input type="date" name="geb_datum" value={ownerData.geb_datum} onChange={handleOwnerChange} />
          </label>
          <label>
            Telefon:
            <input type="text" name="telefon" value={ownerData.telefon} onChange={handleOwnerChange} />
          </label>
          <label>
            E-Mail-Adresse:
            <input type="email" name="email" value={ownerData.email} onChange={handleOwnerChange} />
          </label>
          <label>
            Straße:
            <input type="text" name="straße" value={ownerData.straße} onChange={handleOwnerChange} />
          </label>
          <label>
            Hausnummer:
            <input type="text" name="hausnummer" value={ownerData.hausnummer} onChange={handleOwnerChange} />
          </label>
          <label>
            PLZ:
            <input type="text" name="plz" value={ownerData.plz} onChange={handleOwnerChange} />
          </label>
          <label>
            Stadt:
            <input type="text" name="stadt" value={ownerData.stadt} onChange={handleOwnerChange} />
          </label>
         
         
          <label>
            Staat:
            <select name="staat_id" value={ownerData.staat_id} onChange={handleOwnerChange}>
              <option value="">Bitte auswählen</option>
              {staat.map((land) => (
                <option key={land.staat_id} value={land.staat_id}>
                  {land.staat}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}
      <button onClick={handleConfirm}>Weiter</button>
    </div>
  );
}

export default Step5;
