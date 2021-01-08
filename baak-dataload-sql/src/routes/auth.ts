import express from "express";
import Auth from "../controller/authentication";

const router = express.Router();

router.get("/user", Auth.user);
router.post("/login", Auth.githubLogin);

export default router;
