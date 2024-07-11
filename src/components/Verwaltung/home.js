import React, { useContext } from "react";
import { UserContextToken } from "../Token Auth/UserContextToken.js";
import { useNavigate } from "react-router-dom";
import { Box, Button } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { CardActionArea, CardMedia } from "@mui/material";
import personalfoto from "../../assets/Bilder/personal.webp";
import hundefoto from "../../assets/Bilder/hundeverw.webp";
import Hundefuehrer from "../../assets/Bilder/hundefuehrer.webp";
import Kursverwaltung from "../../assets/Bilder/kursverw.webp";
import Anmeldung from "../../assets/Bilder/anmeldung.webp";
import Kurs from "../../assets/Bilder/kurs.webp";


export default function Home() {
  const { currentUserData } = useContext(UserContextToken);

  const navigate = useNavigate();

  async function handleLogout() {
    localStorage.removeItem("jwtToken");
    navigate("../login");
  }

  async function handleNavigateToAllMemberData() {
    console.log("Wird aufgerufen");
    navigate("/GetAllPerson");
  }
  async function handleNavigateToKursveraltung() {
    console.log("Wird aufgerufen");
    navigate("/Kursverwaltung");
  }
  async function handleNavigateToHundefuehrerVerwaltung() {
    console.log("Wird aufgerufen");
    navigate("/Hundefuehrer");
  }
  async function handleNavigateToAnmeldung() {
    console.log("Wird aufgerufen");
    navigate("/Anmeldeformular");
  }
  async function handleNavigateToHundeverwaltung() {
    console.log("Wird aufgerufen");
    navigate("/Hundeverwaltung");
  }
  async function handleNavigateToKurse() {
    console.log("Wird aufgerufen");
    navigate("/Kurse");
  }



  return (
    <Box className="container">
      <Button
        sx={{ width: 200, margin: 5 }}
        variant="contained"
        color="primary"
        onClick={handleLogout}
      >
        Logout
      </Button>
      <h1 gutterBottom variant="h1" component="div">
        Hallo {currentUserData.username}! Was möchtest du tun?
      </h1>

      <Box display={"flex"} flexWrap={"wrap"}>
        <Card className="card" sx={{ maxWidth: 345, margin: 2 }}>
          <CardActionArea onClick={handleNavigateToAllMemberData}>
              <CardMedia
                component="img"
                height="140"
                image={personalfoto}
                alt="pineapple"
              />
            <CardContent>
              <Typography
                gutterBottom
                variant="h5"
                component="div"
                className="typography"
              >
                Personenverwaltung
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>

        <Card sx={{ maxWidth: 345, margin: 2 }}>
          <CardActionArea onClick={handleNavigateToHundeverwaltung}>
            <CardMedia
              component="img"
              height="140"
              image={hundefoto}
              alt="pineapple"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Hundeverwaltung
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>

        <Card sx={{ maxWidth: 345, margin: 2 }}>
          <CardActionArea onClick={handleNavigateToHundefuehrerVerwaltung}>
            <CardMedia
              component="img"
              height="140"
              image={Hundefuehrer}
              alt="pineapple"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Hundefuehrerverwaltung
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>

        <Card sx={{ maxWidth: 345, margin: 2 }}>
          <CardActionArea onClick={handleNavigateToKursveraltung}>
            <CardMedia
              component="img"
              height="140"
              image={Kursverwaltung}
              alt="Kursverwaltung"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Kursverwaltung
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>

        <Card sx={{ maxWidth: 345, margin: 2 }}>
          <CardActionArea onClick={handleNavigateToAnmeldung}>
            <CardMedia
              component="img"
              height="140"
              image={Anmeldung}
              alt="Anmeldung"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Neue Anmeldung
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>

        <Card sx={{ maxWidth: 345, margin: 2 }}>
          <CardActionArea onClick={handleNavigateToKurse}>
            <CardMedia component="img" height="140" image={Kurs} alt="Kurs" />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Kurse
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>

       
      </Box>
    </Box>
  );
}
