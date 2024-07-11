import React, { useState } from 'react';

const SignupForm = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        fetch('http://localhost:5000/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email })
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(errorData => { throw new Error(errorData.error); });
            }
            return response.json();
        })
        .then(data => {
            setMessage(data.message);
            setError('');
        })
        .catch(error => {
            setError(error.message || 'Es gab einen Fehler beim Senden der E-Mail!');
            console.error('Es gab einen Fehler beim Senden der E-Mail!', error);
        });
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <button type="submit">Anmelden</button>
            </form>
            {message && <p style={{ color: 'green' }}>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default SignupForm;


/*<div>
        <h2>Neuen Kurs anlegen</h2>
        <div>
          <select
            name="kurs_name_id"
            value={
              getAllCourseWithPrice.some(
                (kurs) => kurs.kurs_name_id === neuerKurs.kurs_name_id
              )
                ? neuerKurs.kurs_name_id
                : ""
            }
            onChange={handleKursChange}
          >
            <option value="">Kurs auswählen</option>
            {getAllCourseWithPrice
              .filter((kurs) => kurs.jahr >= new Date().getFullYear())
              .map((kurs) => (
                <option
                  key={`${kurs.kurs_name_id}-${kurs.jahr}`}
                  value={kurs.kurs_name_id}
                  data-value={JSON.stringify({
                    kurs_name_id: kurs.kurs_name_id,
                    preis_id: kurs.preis_id,
                  })}
                >
                  {kurs.kurs_name} {kurs.jahr}
                </option>
              ))}
          </select>

          <select
            name="saison_id"
            value={neuerKurs.saison_id}
            onChange={handleChangeNeuerKurs}
          >
            <option value="">Saison auswählen</option>
            {getSeason.map((season) => (
              <option key={season.saison_id} value={season.saison_id}>
                {season.saison}
              </option>
            ))}
          </select>

          <label htmlFor="kursStart">Kurs Start</label>
          <input
            type="date"
            id="kursStart"
            name="kurs_start"
            value={neuerKurs.kurs_start}
            onChange={handleChangeNeuerKurs}
          />
        </div>*/