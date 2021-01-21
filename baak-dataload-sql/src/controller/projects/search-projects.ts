import axios from "axios";
import { UserInterface } from "../../models/user";

interface searchProjectReq {
  user: UserInterface;
  query: {
    repoName: string;
  };
}

interface Project {
  ownerName: string;
  projectName: string;
  cloneUrl: string;
  privateProject: boolean;
}

const searchProjects = async (req: searchProjectReq, res: any, _: any) => {
  const { repoName } = req.query;

  try {
    // authenticated username
    const username = req.user.username;

    await axios
      .get(
        `https://api.github.com/search/repositories?q=user:${username}+${repoName} in:name`,
        {
          headers: {
            Authorization: `token ${req.user.access_token}`,
          },
        }
      )
      .then((response) => {
        const repositories = response.data.items;

        let userProjects: Project[] = [];

        repositories.forEach((repo: any) => {
          userProjects.push({
            ownerName: repo.owner.login,
            projectName: repo.name,
            cloneUrl: repo.clone_url,
            privateProject: repo.private,
          });
        });

        res.status(200).json({ userProjects });
      })
      .catch((error) => {
        res.status(404).json({ message: "Get repositories failed" });
        console.log(error);
      });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Oops! Something went wrong!" });
  }
};

export default searchProjects;
