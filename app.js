import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import sessions from "express-session";
import WebAppAuthProvider from "msal-node-wrapper";

import { fileURLToPath } from "url";
import { dirname } from "path";
import models from "./models.js";

import router from "./routes/api.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

var app = express();

app.enable("trust proxy");

app.use(logger("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  req.models = models;
  next();
});

app.use("/api", router);

app.listen(3000, 'localhost', () => {
  console.log('App listening at http://localhost:3000')
})

export default app;
