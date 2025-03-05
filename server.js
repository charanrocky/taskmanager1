import express from "express";

import dotenv from "dotenv";
import cors from "cors";
import connect from "./src/db/connect.js";
import cookieParser from "cookie-parser";
import fs from "fs";
import errorHandler from "./src/helpers/errorhandler.js";
dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(errorHandler);

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));

const routeFiles = fs.readdirSync("./src/routes");

routeFiles.forEach((file) => {
  import(`./src/routes/${file}`)
    .then((route) => {
      app.use("/api/v1", route.default);
    })
    .catch((err) => {
      console.log("Failed to load route file", err);
    });
});

const server = async () => {
  try {
    await connect();
    app.listen(port, () => {
      console.log(`App is running on ${port}`);
    });
  } catch (e) {
    console.log(e.message);
    process.exit(1);
  }
};

server();
