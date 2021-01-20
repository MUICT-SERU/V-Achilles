import jwt from "jsonwebtoken";

interface UserObj {
  _id: string;
  username: string;
  access_token: string;
}

export const generateJwtToken = async (userObj: UserObj) =>
  jwt.sign(userObj, process.env.JWT_KEY || "baakJwt@TOKEN", {
    algorithm: "HS256",
    expiresIn: "1y",
    issuer: "baak-api-server",
    audience: "baak-client",
  });
