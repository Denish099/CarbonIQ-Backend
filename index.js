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
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use("/auth", authRoute);

app.use("/predict", predictRoute);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
