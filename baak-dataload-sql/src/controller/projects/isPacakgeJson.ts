import axios from "axios";
import { UserInterface } from "../../models/user";

interface isPackageJsonReq {
  user: UserInterface;
  query: {
    repoName: string;
    user: string;
  };
}

const isPackgeJson = async (req: isPackageJsonReq, res: any, _: any) => {
  const { user, repoName } = req.query;

  try {
    const response = await axios.get(
      `https://api.github.com/search/code?q=user:${user}+dependencies+repo:${user}/${repoName}+filename:package.json`,
      {
        headers: {
          Authorization: `token ${req.user.access_token}`,
        },
      }
    );

    if (response.data.total_count <= 0) {
      res.status(200).json({ isPackgeJson: false });
    } else {
      let paths: string[] = [];
      response.data.items.forEach((item: { path: string }) => {
        paths.push(item.path);
      });

      const packgeJsonUrls = {
        contentUrl: response.data.items[0].repository.contents_url.split(
          "{+path}"
        )[0],
        paths,
      };

      res.status(200).json({ isPackgeJson: true, packgeJsonUrls });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Oops! Something went wrong!" });
  }
};

export default isPackgeJson;
