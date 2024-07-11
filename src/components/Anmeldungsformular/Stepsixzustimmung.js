import React, { useState } from 'react';

function Step6({ onConsentConfirm }) {
  const [consentData, setConsentData] = useState({
    email: '',
    newsletter: '',
    sms: '',
    whatsapp: '',
    foto: '',
    video:''
  });

  const handleConsentChange = (e) => {
    const { name, value } = e.target;
    console.log(`Consent change - ${name}: ${value}`);
    setConsentData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleConfirm = () => {
    if (
      consentData.email &&
      consentData.newsletter &&
      consentData.sms &&
      consentData.whatsapp &&
      consentData.foto &&
      consentData.video
    ) {
      console.log('Consent data to be confirmed:', consentData);
      onConsentConfirm(consentData);
    } else {
      alert('Bitte alle Felder ausfüllen');
    }
  };

  return (
    <div>
      <h2>Schritt 6: Zustimmungserklärung</h2>
      <div>
        <p>Zusendung von Vereinsinformationen per E-Mail</p>
        <label>
          <input
            type="radio"
            name="email"
            value="ja"
            onChange={handleConsentChange}
          />{' '}
          Ich stimme zu
        </label>
        <label>
          <input
            type="radio"
            name="email"
            value="nein"
            onChange={handleConsentChange}
          />{' '}
          Ich stimme nicht zu
        </label>
      </div>

      <div>
        <p>Zusendung von Newslettern des Vereins</p>
        <label>
          <input
            type="radio"
            name="newsletter"
            value="ja"
            onChange={handleConsentChange}
          />{' '}
          Ich stimme zu
        </label>
        <label>
          <input
            type="radio"
            name="newsletter"
            value="nein"
            onChange={handleConsentChange}
          />{' '}
          Ich stimme nicht zu
        </label>
      </div>

      <div>
        <p>Zusendung von Vereinsinformationen per SMS oder WhatsApp</p>
        <label>
          <input
            type="radio"
            name="sms"
            value="ja"
            onChange={handleConsentChange}
          />{' '}
          Ich stimme zu
        </label>
        <label>
          <input
            type="radio"
            name="sms"
            value="nein"
            onChange={handleConsentChange}
          />{' '}
          Ich stimme nicht zu
        </label>
      </div>

      <div>
        <p>WhatsApp-Gruppenmitglied im jeweiligen Kurs</p>
        <label>
          <input
            type="radio"
            name="whatsapp"
            value="ja"
            onChange={handleConsentChange}
          />{' '}
          Ich stimme zu
        </label>
        <label>
          <input
            type="radio"
            name="whatsapp"
            value="nein"
            onChange={handleConsentChange}
          />{' '}
          Ich stimme nicht zu
        </label>
      </div>

      <div>
        <p>
          Veröffentlichung von Daten und Fotos zu meiner Person im Zusammenhang
          mit kynologischen Veranstaltungen und dem Vereinsgeschehen in
          Vereinszeitschriften, Zeitungen und im Internet
        </p>
        <label>
          <input
            type="radio"
            name="foto"
            value="ja"
            onChange={handleConsentChange}
          />{' '}
          Ich stimme zu
        </label>
        <label>
          <input
            type="radio"
            name="foto"
            value="nein"
            onChange={handleConsentChange}
          />{' '}
          Ich stimme nicht zu
        </label>
      </div>
      <div>
        <p>
        Veröffentlichung von Videos zu meiner Person im Zusammenhang mit kynologischen Veranstaltungen und dem Vereinsgeschehen in Vereinszeitschriften, Zeitungen und im Internet.
        </p>
        <label>
          <input
            type="radio"
            name="video"
            value="ja"
            onChange={handleConsentChange}
          />{' '}
          Ich stimme zu
        </label>
        <label>
          <input
            type="radio"
            name="video"
            value="nein"
            onChange={handleConsentChange}
          />{' '}
          Ich stimme nicht zu
        </label>
      </div>

      <div className="section">
        <h2>Mit dem Absenden des Formular nehme ich zur Kenntnis, dass:</h2>
        <ul>
          <li>
            mir die betroffenen Rechte auf Auskunft, Berichtigung, Löschung,
            Einschränkung der Verarbeitung und Widerspruchsrecht gegen eine
            Verarbeitung bekannt sind. Datenschutzerklärung siehe Aushang.
          </li>
          <li>
            mir die betroffenen Rechte auf Auskunft, Berichtigung, Löschung,
            Einschränkung der Verarbeitung und Widerspruchsrecht gegen eine
            Verarbeitung bekannt sind. Datenschutzerklärung siehe Aushang.
          </li>
          <li>
            die von mir bekannt gegebenen Daten vom Verein
            automationsunterstützt erfasst und verarbeitet werden. Der Verein
            verwendet die von mir bekannt gegebenen personenbezogenen Daten
            ausschließlich zur ordnungsgemäßen Durchführung der
            Vereinsgeschäfte, zur Weitergabe an den Dachverband (ÖHU) und zur
            Durchführung von Veranstaltungen.
          </li>
          <li>
            aufgrund der Einwilligung der betroffenen Person nach Art. 6 Abs. 1
            lit. a DSGVO bzw. der Erfüllung einer vertraglichen bzw. rechtlichen
            Verpflichtung des Verantwortlichen nach Art. 6 Abs. 1 lit. b und c
            bzw. f DSGVO die personenbezogenen Daten der betroffenen Person,
            soweit diese für die Leistungs-/Ergebniserfassung bzw.
            Ergebnismanagement im Zusammenhang mit der Anmeldung oder Teilnahme
            an (sportlichen) Veranstaltungen oder Wettkämpfen erforderlich sind,
            gespeichert und auch nach Art. 17 Abs. 3 in Verbindung mit Art. 89
            DSGVO für im öffentlichen Interesse liegende Archivzwecke und
            berechtigte Interessen des Verantwortlichen gespeichert und zT
            öffentlich zugänglich gemacht werden (Information über
            Sportergebnismanagement).
          </li>
        </ul>
      </div>
      <div className="section">
        <ol>
          <li>
            Den Anweisungen der Trainingsleitung ist Folge zu leisten, um
            während des gesamten Trainingsablaufes größtmögliche Sicherheit zu
            gewährleisten.
          </li>
          <li>
            Für die Teilnahme an unseren Kursen ist eine Haftpflichtversicherung
            des Hundes Voraussetzung.
          </li>
          <li>
            Verpflichtende Impfpassvorlage: Zur eigenen Sicherheit und der
            Sicherheit UNSER ALLER Hunde und Mitglieder, dürfen sich
            ausschließlich geimpfte Hunde auf unserem Vereinsgelände (auch im
            Auslaufgelände) aufhalten (ausreichend und aktueller Impfschutz).
            Eine Impfpassvorlage ist daher bei der ersten Kursstunde oder bei
            Aufforderung sofort vorzuweisen.
          </li>
          <li>Bei ansteckenden Erkrankungen ist die Teilnahme ausgeschlossen.</li>
          <li>
            Eventuelle Notdurften des Hundes ist vom Besitzer mittels Kotsackerl
            zu entfernen.
          </li>
          <li>
            Die Hunde müssen zu Beginn des Trainings unbedingt an der Leine
            geführt werden.
          </li>
          <li>
            Die Mitgliedschaft erlischt nur mit schriftlicher Kündigung, 3
            Monate vor Jahresende.
          </li>
          <li>
            Haftung: Für Schäden, die der Hund verursacht, haftet der Besitzer.
            Die Hundesportschule Vöcklabruck haftet nur für Schäden, die von ihr
            vorsätzlich oder grob fahrlässig herbeigeführt werden.
          </li>
        </ol>
      </div>

      <button onClick={handleConfirm}>Weiter</button>
    </div>
  );
}

export default Step6;
