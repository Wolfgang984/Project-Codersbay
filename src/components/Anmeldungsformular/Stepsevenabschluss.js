import React, { useState } from "react";
import imageHeader from '../../assets/Bilder/writingDog.png'


function Step7({
  userData,
  selectedSeason,
  courseObject,
  dogData,
  ownerData,
  consentData,
}) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSave = async () => {
    const dataToSave = {
      userData,
      selectedSeason,
      courseObject,
      dogData,
      ownerData,
      consentData,
    };
    console.log("Daten werden gespeichert...", dataToSave);

    setLoading(true);
    setError(null);

    try {
      const url = userData.hasAttended
        ? "http://localhost:5000/saveAttendedData"
        : "http://localhost:5000/saveRegistration";

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSave),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log("Erfolgreich gespeichert:", data);
      setSuccess(true);
    
    } catch (error) {
      console.error("Fehler beim Speichern der Daten:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }




    try {
    const url = userData.hasAttended
    ? "http://localhost:5000/send-email"
    : "http://localhost:5000/send-dataEmail";

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dataToSave),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Server error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  console.log("Erfolgreich gespeichert:", data);
  setSuccess(true);

} catch (error) {
  console.error("Fehler beim Speichern der Daten:", error);
  setError(error.message);
} finally {
  setLoading(false);
}

  };

  return (
    <div>
    <div className="header">
    <img src={imageHeader} alt="Header" />
  </div>
    <form id="profil">
      <h2>Anmeldung Hundeschule</h2>
      <div>
        <h3>
         
          Wir freuen uns sehr {userData?.vorname} für dein Interesse an dem Kurs {courseObject.kurs_name}.
        </h3>
        <h3>
        Bitte klicke auf "Registrierung abschließen" um die Anmeldung zu bestätigen. Im Anschluss erhältst du dann eine Bestätigungsmail. 
        <h3 style = {{color:"#e57373", backgroundColor:"#f9f9f9"}}>Sollten sie keine Bestätigungsmail erhalten bitte untersuchen sie den Spamordner oder Kontaktieren sie uns.</h3>
        </h3>

        {loading && <p>Speichern...</p>}

        <button onClick={handleSave} disabled={loading}>
          Registrierung abschließen
        </button>
        {success && <p>Daten erfolgreich gespeichert!</p>}
        {error && <p>Fehler beim Speichern der Daten: {error}</p>}
      </div>
    </form>

    </div>
  );
}

export default Step7;
