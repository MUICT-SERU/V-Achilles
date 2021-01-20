import "dotenv-safe/config";

import cors from "cors";
import path from "path";
import express from "express";
import mongoose from "mongoose";

import Auth from "./routes/auth";
import IndexRouter from "./routes/index";
import Projects from "./routes/projects";
import Report from "./routes/report";

mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost/baak-db", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", IndexRouter);
app.use("/api/v1/auth", Auth);
app.use("/api/v1/projects", Projects);
app.use("/api/v1/reports", Report);

const PORT = process.env.PORT || "4000";
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
