import { UserInterface } from "../../models/user";

interface UserData {
  user: UserInterface;
}

const user = async (req: UserData, res: any, _: any) => {
  try {
    res.status(200).json({
      username: req.user.username,
      profilePicture: req.user.profilePicture,
      access_token: req.user.access_token,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Oops! Something went wrong!" });
  }
};

export default user;
