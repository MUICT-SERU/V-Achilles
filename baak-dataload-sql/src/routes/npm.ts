import express from 'express';
import passport from '../utils/passport';
import Npm from '../controller/npm';

const router = express.Router();

router.get(
  '/latest-version',
  passport.authenticate('jwt', { session: false }),
  Npm.latestVersion
);

export default router;
