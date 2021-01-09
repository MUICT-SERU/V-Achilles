import axios from "axios";
import { getAccessToken } from "../../utils/getAccessToken";

interface githubLoginReq {
  body: {
    data: string;
  };
}

const githubLogin = async (req: githubLoginReq, res: any, _: any) => {
  const { data } = req.body;

  try {
    if (!data) {
      return res.status(401).json({ message: "Login with github has failed" });
    } else {
      const access_token = await getAccessToken(data);
      if (access_token) {
        const userData = await axios.get("https://api.github.com/user", {
          headers: { Authorization: `token ${access_token}` },
        });

        return res
          .status(200)
          .send({ token: access_token, data: userData.data });
      } else res.status(401).json({ message: "Login with github has failed" });
    }
  } catch (err) {
    console.log(err);
    return res.status(401).json({ message: "Login with github has failed" });
  }
};

export default githubLogin;
