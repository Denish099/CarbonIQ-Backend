import express from "express";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import authRoute from "./routes/authRoute.js";
import predictRoute from "./routes/predictRoute.js";
import cors from "cors";
config();

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: "https://carbon-frontend-3zs4.vercel.app/",
    credentials: true,
  })
);
app.use("/auth", authRoute);

app.use("/predict", predictRoute);

module.exports = app;
