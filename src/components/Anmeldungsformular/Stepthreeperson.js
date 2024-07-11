import React, { useState, useEffect } from 'react';

function Step3({ onUserConfirm }) {
  const [hasAttended, setHasAttended] = useState('');
  const [email, setEmail] = useState('');
  const [user, setUser] = useState(null);
  const [staat, setStaat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newUser, setNewUser] = useState({
    titel: '',
    geschlecht: '',
    vorname: '',
    nachname: '',
    geb_datum: '',
    telefon: '',
    email: ''
  });
  const [adresse, setAdresse] = useState({
    straße: '',
    bundesland: '',
    hausnummer: '',
    plz: '',
    stadt: '',
    staat_id: ''
  });

  useEffect(() => {
    fetchLaenderData();
  }, []);

  const fetchLaenderData = async () => {
    try {
      const response = await fetch(`http://localhost:5000/auswahlLaender`);
      if (!response.ok) {
        console.log("Failed to fetch profile data");
      }
      const data = await response.json();
      console.log('Fetched states:', data);
      setStaat(data);
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:5000/userByEmail?email=${email}`);
      if (!response.ok) {
        throw new Error('No user found with this email');
      }
      const data = await response.json();
      console.log('Fetched user by email:', data);
      setUser(data);
    } catch (error) {
      setError(error.message);
      console.error('Error searching user by email:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleHasAttendedChange = (e) => {
    const attended = e.target.value === 'true';
    setHasAttended(attended);
    console.log('Has attended change:', attended);
    if (attended) {
      setEmail('');
      setUser(null);
      setNewUser({ ...newUser, email: '' });
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    console.log('Email change:', e.target.value);
    setNewUser((prevData) => ({
      ...prevData,
      email: e.target.value,
    }));
  };

  const handleNewUserChange = (e) => {
    const { name, value } = e.target;
    console.log(`New user change - ${name}: ${value}`);
    setNewUser((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAdresseChange = (e) => {
    const { name, value } = e.target;
    console.log(`Address change - ${name}: ${value}`);
    setAdresse((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const checkEmailExists = async (email) => {
    try {
      const response = await fetch(`http://localhost:5000/userByEmail?email=${email}`);
      if (response.ok) {
        const data = await response.json();
        return data;
      }
      return null;
    } catch (error) {
      console.error('Error checking email:', error);
      return null;
    }
  };

  const handleConfirm = async () => {
    if (user) {
      console.log('User confirmed:', user);
      onUserConfirm({ ...user, hasAttended });
    } else if (!hasAttended && newUser.vorname && newUser.nachname && newUser.email && adresse.staat_id) {
      const existingUser = await checkEmailExists(newUser.email);
      if (existingUser) {
        alert('Ein Benutzer mit dieser E-Mail-Adresse existiert bereits.');
      } else {
        console.log('New user confirmed:', { ...newUser, adresse, hasAttended });
        onUserConfirm({ ...newUser, adresse, hasAttended });
      }
    } else {
      alert('Bitte alle Felder ausfüllen');
    }
  };

  return (
    <div id="profil">
      <h2>Anmeldung Hundeschule</h2>
      <div id="formular">
        <label>
          Waren Sie schon einmal in der Hundeschule?
          <select value={hasAttended} onChange={handleHasAttendedChange}>
            <option value="">Bitte auswählen</option>
            <option value="true">Ja</option>
            <option value="false">Nein</option>
          </select>
        </label>
      </div>

      {hasAttended === true && (
        <div>
          <label>
            Bitte geben Sie Ihre E-Mail-Adresse ein:
            <input type="email" value={email} onChange={handleEmailChange} />
          </label>
          <button onClick={handleSearch}>Suchen</button>
        </div>
      )}

      {loading && <p>Suche läuft...</p>}
      
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {user && (
        <div>
          <p>Hallo {user.vorname}  schön das du wieder an einem Kurs teilnimmst</p>
          <button onClick={handleConfirm}>Weiter</button>
        </div>
      )}

      {hasAttended === false && (
        <div>
          <h3>Neuer Benutzer</h3>
          <label>
            Titel:
            <input
              type="text"
              name="titel"
              value={newUser.titel}
              onChange={handleNewUserChange}
              required
            />
          </label>
          <label>
            Geschlecht:
            <select
              name="geschlecht"
              value={newUser.geschlecht}
              onChange={handleNewUserChange}
              required
            >
              <option value="">Bitte auswählen</option>
              <option value="männlich">Mann</option>
              <option value="weiblich">Frau</option>
              <option value="divers">Divers</option>
            </select>
          </label>
          <label>
            Vorname:
            <input
              type="text"
              name="vorname"
              value={newUser.vorname}
              onChange={handleNewUserChange}
              required
            />
          </label>
          <label>
            Nachname:
            <input
              type="text"
              name="nachname"
              value={newUser.nachname}
              onChange={handleNewUserChange}
              required
            />
          </label>
          <label>
            Geburtsdatum:
            <input
              type="date"
              name="geb_datum"
              value={newUser.geb_datum}
              onChange={handleNewUserChange}
              required
            />
          </label>
          <label>
            Telefon:
            <input
              type="text"
              name="telefon"
              value={newUser.telefon}
              onChange={handleNewUserChange}
              required
            />
          </label>
          <label>
            E-Mail-Adresse:
            <input
              type="email"
              name="email"
              value={newUser.email}
              onChange={handleNewUserChange}
              required
            />
          </label>
          <h3>Adresse</h3>
          <label>
            Straße:
            <input
              type="text"
              name="straße"
              value={adresse.straße}
              onChange={handleAdresseChange}
              required
            />
          </label>
          <label>
            Hausnummer:
            <input
              type="text"
              name="hausnummer"
              value={adresse.hausnummer}
              onChange={handleAdresseChange}
              required
            />
          </label>
          <label>
            PLZ:
            <input
              type="text"
              name="plz"
              value={adresse.plz}
              onChange={handleAdresseChange}
              required
            />
          </label>
          <label>
            Stadt:
            <input
              type="text"
              name="stadt"
              value={adresse.stadt}
              onChange={handleAdresseChange}
              required
            />
          </label>
          <label>
            Staat:
            <select
              name="staat_id"
              value={adresse.staat_id}
              onChange={handleAdresseChange}
              required
            >
              <option value="">Bitte auswählen</option>
              {staat.map((land) => (
                <option key={land.staat_id} value={land.staat_id}>
                  {land.staat}
                </option>
              ))}
            </select>
          </label>
          <button onClick={handleConfirm}>Weiter</button>
        </div>
      )}
    </div>
  );
}

export default Step3;
