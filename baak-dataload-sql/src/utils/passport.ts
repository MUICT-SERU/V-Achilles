import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";

import UserModel, { UserInterface } from "../models/user";

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID || "e3998d7f6251dd7d36fd",
      clientSecret:
        process.env.GITHUB_CLIENT_SECRET ||
        "bb1aef36bfa28ab99361f3af624dbce621eb58ec",
      callbackURL: "http://localhost:3000/login",
    },
    (_accessToken: any, _refreshToken: any, profile: any, cb: any) =>
      cb(null, profile)
  )
);

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_KEY || "baakJwt@TOKEN",
      issuer: "baak-api-server",
      audience: "baak-client",
    },
    (jwtPayload, done) => {
      UserModel.findOne(
        { _id: jwtPayload._id },
        (err: any, user: UserInterface) => {
          if (err) return done(err, false);
          if (user) return done(null, user);
          return done(null, false);
        }
      );
    }
  )
);

export default passport;