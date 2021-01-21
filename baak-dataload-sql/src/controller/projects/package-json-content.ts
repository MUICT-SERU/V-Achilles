import axios from "axios";
import { UserInterface } from "../../models/user";

interface packageJsonContentReq {
  user: UserInterface;
  query: {
    packageJsonUrl: string;
  };
}

const packageJsonContent = async (
  req: packageJsonContentReq,
  res: any,
  _: any
) => {
  try {
    const { packageJsonUrl } = req.query;

    await axios
      .get(packageJsonUrl, {
        headers: {
          Authorization: `token ${req.user.access_token}`,
          Accept: "application/vnd.github.VERSION.raw",
        },
      })
      .then((response) => {
        const packageJson = response.data;

        res.status(200).json({ packageJson });
      })
      .catch((error) => {
        res.status(404).json({ message: "Get package json content failed" });
        console.log(error);
      });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Oops! Something went wrong!" });
  }
};

export default packageJsonContent;
