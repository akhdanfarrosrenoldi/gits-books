import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import BookRoute from "./routes/BookRoute.js";
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/books", BookRoute);

app.listen(process.env.APP_PORT, () => {
  console.log(`Server running on port ${process.env.APP_PORT}`);
});
