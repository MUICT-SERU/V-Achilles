import express from "express";
import passport from "passport";

const router = express.Router();

/* GET home page. */
router.get("/", (_req, res) => {
  res.status(404).json({ message: "Error 404 not found!" });
});

/* Github register and login */
router.get("/auth/github", passport.authenticate("github"));

export default router;
