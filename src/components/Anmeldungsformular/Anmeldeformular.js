import React, { useState } from "react";
import Step1 from './Steponeseason.js';
import Step2 from "./Steptwokurs.js";
import Step3 from "./Stepthreeperson.js";
import Step4 from "./Stepfourhund.js";
import Step5 from './Stepfivehundebesitzer.js';
import Step6 from "./Stepsixzustimmung.js";
import Step7 from "./Stepsevenabschluss.js";

function Anmeldeformular() {
  const [step, setStep] = useState(1);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [courseObject, setcourseObject] = useState(null);
  const [userData, setUserData] = useState(null);
  const [dogData, setDogData] = useState(null);
  const [ownerData, setOwnerData] = useState(null);
  const [consentData, setConsentData] = useState(null);

  const handleNextStep = (season) => {
    console.log('Selected season:', season);
    setSelectedSeason(season);
    setStep(2);
  };

  const handleCourseSelect = (course) => {
    console.log('Selected course:', course);
    setcourseObject(course);
    setStep(3);
  };

  const handleUserConfirm = (user) => {
    console.log('User confirmed:', user);
    setUserData(user);
    setStep(4);
  };

  const handleDogConfirm = (dog) => {
    console.log('Dog confirmed:', dog);
    setDogData(dog);
    if(dog.hunde_id){
      setStep(7);
    }else
    setStep(5);
  };

  const handleOwnerConfirm = (owner) => {
    console.log('Owner confirmed:', owner);
    setOwnerData(owner);
    if (userData.hasAttended) {
      setStep(7); 
    } else {
      setStep(6);
    }
  };

  const handleConsentConfirm = (consent) => {
    console.log('Consent confirmed:', consent);
    setConsentData(consent);
    setStep(7);
  };

  return (
    <div className="Anmeldeformular">
      {step === 1 && <Step1 onNext={handleNextStep} />}
      {step === 2 && <Step2 season={selectedSeason} onCourseSelect={handleCourseSelect} />}
      {step === 3 && <Step3 course={courseObject} onUserConfirm={handleUserConfirm} />}
      {step === 4 && <Step4 userData={userData} selectedSeason={selectedSeason} courseObject={courseObject} onDogConfirm={handleDogConfirm}/>}
      {step === 5 && <Step5 onOwnerConfirm={handleOwnerConfirm} />}
      {step === 6 && !userData.hasAttended && <Step6 userData={userData} dogData={dogData} ownerData={ownerData} onConsentConfirm={handleConsentConfirm} />}
      {step === 7 && <Step7 selectedSeason={selectedSeason} courseObject={courseObject} userData={userData} dogData={dogData} ownerData={ownerData} consentData={consentData} />}
    </div>
  );
}

export default Anmeldeformular;
