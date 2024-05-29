import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

       function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();



  const handleTokenLogin = (event) => {
    event.preventDefault()
    loginJWTToken(username, password);
  };


  async function loginJWTToken(username, password) {
    try {
      const response = await fetch("/loginTokenAuth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const token = data.token;

      localStorage.setItem("jwtToken", token);
      navigate("/userWelcomeToken");
    } catch (error) {
      setError("Login not successful");
    }
  }


  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleTokenLogin}>
        <div>
          <label htmlFor="username">Benutzername:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Passwort:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        
        <button onClick={handleTokenLogin}>Token Login</button>
      </form>
    </div>
  );
};

export default Login;