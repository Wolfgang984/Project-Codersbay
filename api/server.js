import express from "express";
import cors from "cors";
import loginTokenAuthRouter from "./routes/tokenAuth/loginTokenAuth.js";
import privateareaTokenRouter from "./routes/tokenAuth/privateareaToken.js";
import logoutTokenRouter from "./routes/tokenAuth/logoutToken.js";
import getAllPersonRouter from './routes/verwaltung/getAllPerson.js';
import profile from './routes/verwaltung/profiles.js';
import getLaender from './routes/verwaltung/getLaender.js';
import getVereinsrolle from './routes/verwaltung/getVereinsrolle.js';
import kursverwaltung from './routes/verwaltung/kursveraltung.js';
import anmeldeformular from './routes/verwaltung/anmeldeformular.js';
import anmeldeformularDaten from './routes/verwaltung/anmeldeformularDaten.js';
import hundefuehrer from "./routes/verwaltung/hundefuehrer.js";
import hundedaten from "./routes/verwaltung/hundeverwaltung.js"
import ProfilDog from "./routes/verwaltung/profileDog.js";
import Kurse from "./routes/verwaltung/kurse.js";
import emailtest from "./routes/verwaltung/emailtest.js"




const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());


app.use(loginTokenAuthRouter);
app.use(privateareaTokenRouter);
app.use(logoutTokenRouter);
app.use(getAllPersonRouter);
app.use(profile);
app.use(getLaender);
app.use(getVereinsrolle);
app.use(kursverwaltung);
app.use(anmeldeformular);
app.use(anmeldeformularDaten);
app.use(hundefuehrer);
app.use(hundedaten);
app.use(ProfilDog);
app.use(Kurse);
app.use(emailtest);


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
