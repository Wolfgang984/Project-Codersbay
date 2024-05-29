import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const UserContextToken = createContext({});

export const UserProviderToken = ({ children }) => {
  const navigate = useNavigate();
  const [currentUserData, setCurrentUserData] = useState({});

  useEffect(() => {
    getUserContext();
  }, []);

  async function getUserContext() {
    const token = localStorage.getItem("jwtToken");
    console.log(token)

    if (!token) {
      navigate("../login");
      return;
    }

    try {
      const response = await fetch("/privateareaToken", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setCurrentUserData(data);
    } catch (error) {
      navigate("../login");
      console.error("Error during login:", error);
    }
  }

  return (
    <UserContextToken.Provider
      value={{
        currentUserData,
      }}
    >
      {children}
    </UserContextToken.Provider>
  );
};