import express from "express";
import cors from "cors";
import loginTokenAuthRouter from "./routes/tokenAuth/loginTokenAuth.js";
import privateareaTokenRouter from "./routes/tokenAuth/privateareaToken.js";
import logoutTokenRouter from "./routes/tokenAuth/logoutToken.js";

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());


app.use(loginTokenAuthRouter);
app.use(privateareaTokenRouter);
app.use(logoutTokenRouter);


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
