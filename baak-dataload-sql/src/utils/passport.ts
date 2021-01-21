import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";

import UserModel, { UserInterface } from "../models/user";

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID || "b7405c07510d6efce3b5",
      clientSecret:
        process.env.GITHUB_CLIENT_SECRET ||
        "1af05a6571755bb62fc48921369cbbb64ab6e2db",
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