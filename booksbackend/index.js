import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import BookRoute from "./routes/BookRoute.js";
import AuthorRoute from "./routes/AuthorRoute.js";
import PublisherRoute from "./routes/PublisherRoute.js";
import AuthRoute from "./routes/AuthRoute.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// routes
app.use("/auth", AuthRoute);
app.use("/books", BookRoute);
app.use("/authors", AuthorRoute);
app.use("/publishers", PublisherRoute);

app.listen(process.env.APP_PORT, () => {
  console.log(`Server running on port ${process.env.APP_PORT}`);
});
