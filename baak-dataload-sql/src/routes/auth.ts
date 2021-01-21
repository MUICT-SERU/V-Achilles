import express from "express";
import passport from "../utils/passport";
import Auth from "../controller/authentication";

const router = express.Router();

router.get(
  "/user",
  passport.authenticate("jwt", { session: false }),
  Auth.user
);
router.post("/login", Auth.githubLogin);

export default router;
