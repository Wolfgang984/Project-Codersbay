import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { lazy } from "react";
import Login from "./components/Login.js";
import PrivateRoutesToken from "./components/Token Auth/PrivateRoutesToken.js";
import UserWelcomeToken from "./components/Token Auth/UserWelcomeToken.js";
import Home from "./components/Verwaltung/home.js";
import SignupForm from "./components/emailtest.js";

const GetAllPerson = lazy(() =>
  import("./components/Verwaltung/GetAllPerson.js")
);
const Profile = lazy(() => import("./components/Verwaltung/Profile.js"));
const Kursverwaltung = lazy(() =>
  import("./components/Verwaltung/Kursverwaltung.js")
);
const Hundefuehrer = lazy(() =>
  import("./components/Verwaltung/Hundefuehrer.js")
);
const Anmeldeformular = lazy(() =>
  import('./components/Anmeldungsformular/Anmeldeformular.js')
);

const Hundeverwaltung = lazy(() =>
  import('./components/Verwaltung/Hundeverwaltung.js')
);
const ProfilDog = lazy(() =>
  import('./components/Verwaltung/ProfilDog.js')
);

const Kurse = lazy(() =>
  import('./components/Verwaltung/Kurse.js')
);



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route element={<PrivateRoutesToken />}>
          <Route path="/UserWelcomeToken" element={<UserWelcomeToken />} />
          <Route path="/home" element={<Home />} />
          <Route path="/GetAllPerson" element={<GetAllPerson />} />
          <Route path="/Profile/:person_id" element={<Profile />} />
          <Route path="/Kursverwaltung" element={<Kursverwaltung />} />
          <Route path="/Hundefuehrer" element={<Hundefuehrer />} />
          <Route path="/Anmeldeformular" element={<Anmeldeformular />} />
          <Route path="/Hundeverwaltung" element = {<Hundeverwaltung />}/>
          <Route path="/ProfilDog/:hund_id" element = {<ProfilDog />}/>
          <Route path="/Kurse" element = {<Kurse />}/>
          <Route path="/emailtest" element={<SignupForm/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
