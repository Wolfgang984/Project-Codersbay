import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css';
import Login from './components/Login.js';
import PrivateRoutesToken from './components/Token Auth/PrivateRoutesToken.js';
import UserWelcomeToken from './components/Token Auth/UserWelcomeToken.js';


function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="*" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route element={<PrivateRoutesToken />}>
          <Route path="/UserWelcomeToken" element={<UserWelcomeToken />} />
        </Route>
    </Routes>
  </BrowserRouter>
  );
}

export default App;
