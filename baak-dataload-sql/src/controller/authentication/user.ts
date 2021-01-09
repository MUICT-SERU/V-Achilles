import { getUser } from "../../utils/getUser";

interface userReq {
  query: {
    data: string;
  };
}

interface Response {
  username: string;
  userProfile: string;
}

const user = async (req: userReq, res: any, _: any) => {
  const { data } = req.query;

  try {
    const userData = await getUser(data);

    if (userData) {
      const response: Response = {
        username: userData.data.login,
        userProfile: userData.data.avatar_url,
      };
      return res.status(200).send({ data: response });
    } else return res.status(401).send({ message: "User login is expired" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Oops! Something went wrong!" });
  }
};

export default user;
