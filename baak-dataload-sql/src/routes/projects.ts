import express from "express";
import Projects from "../controller/projects";

const router = express.Router();

router.get("/", Projects.getProjects);
router.get("/search", Projects.searchProjects);
router.get("/is-packge-json", Projects.isPackgeJson);
router.get("/package-json-content", Projects.packageJsonContent);

export default router;
