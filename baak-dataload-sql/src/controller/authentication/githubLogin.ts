import UserModel, { UserInterface } from "../../models/user";
import { getUser } from "../../utils/getUser";
import { getGithubAccessToken } from "../../utils/getGithubAccessToken";
import { generateJwtToken } from "../../utils/generateJwtToken";

interface githubLoginReq {
  body: {
    data: string;
  };
}

const githubLogin = async (req: githubLoginReq, res: any, _: any) => {
  const { data } = req.body;
  let _id = "";

  try {
    if (!data) {
      return res.status(401).json({ message: "Login with github has failed" });
    } else {
      const access_token = await getGithubAccessToken(data);
      if (access_token) {
        const userData = await getUser(access_token);

        const existedUser: UserInterface | null = await UserModel.findOne({
          provider: { type: "github", id: userData?.data.id.toString() },
        });

        const userObj = {
          username: userData?.data.login,
          profilePicture: userData?.data.avatar_url,
          provider: { type: "github", id: userData?.data.id },
          access_token: access_token,
        };

        if (!existedUser) {
          const newUser = new UserModel(userObj);
          await newUser.save();
          _id = newUser._id;
        } else {
          _id = existedUser._id;
          await UserModel.updateOne({ _id: existedUser._id }, userObj);
        }

        // jwt token
        const token = await generateJwtToken({
          username: userObj.username,
          access_token: userObj.access_token,
          _id,
        });

        return res.status(200).send({
          token,
          data: {
            username: userData?.data.login,
            profilePicture: userData?.data.avatar_url,
          },
        });
      } else res.status(401).json({ message: "Login with github has failed" });
    }
  } catch (err) {
    console.log(err);
    return res.status(401).json({ message: "Login with github has failed" });
  }
};

export default githubLogin;
