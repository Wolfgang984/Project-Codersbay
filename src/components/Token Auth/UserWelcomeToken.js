import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContextToken } from "./UserContextToken.js";

export default function UserWelcomeToken() {
  const { currentUserData } = useContext(UserContextToken);
  const navigate = useNavigate();

  async function handleLogout() {
    localStorage.removeItem("jwtToken");
    navigate("../login");
  }

  return (
    <div className="container">
      <h1>Hello From Token Authentication {currentUserData.username}</h1>
      <button style={{width:"250px"}} onClick={handleLogout}>logout</button>
    </div>
  );
}
