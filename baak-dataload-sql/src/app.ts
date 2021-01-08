import "dotenv-safe/config";

import cors from "cors";
import path from "path";
import express from "express";

import Auth from "./routes/auth";
import Projects from "./routes/projects";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/v1/auth", Auth);
app.use("/api/v1/projects", Projects);

const PORT = process.env.PORT || "4000";
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
