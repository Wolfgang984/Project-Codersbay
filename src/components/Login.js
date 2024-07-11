import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, TextField, Button, Typography, Box, Alert } from "@mui/material";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleTokenLogin = (event) => {
    event.preventDefault();
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
      navigate("/home");
    } catch (error) {
      setError("Login not successful");
    }
  }

  return (
    <Container maxWidth="sm">
      <Box
        component="form"
        onSubmit={handleTokenLogin}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mt: 8,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Login
        </Typography>
        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {error}
          </Alert>
        )}
        <TextField
          label="Name"
          variant="outlined"
          margin="normal"
          fullWidth
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          label="Passwort"
          type="password"
          variant="outlined"
          margin="normal"
          fullWidth
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 3, mb: 2 }}
        >
        Login
        </Button>
      </Box>
    </Container>
  );
}

export default Login;
