import axios from "axios";
import { getUser } from "../../utils/getUser";

interface searchProjectReq {
  query: {
    token: string;
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
  const { token, repoName } = req.query;

  try {
    const userData = await getUser(token);

    if (userData) {
      // authenticated username
      const username = userData.data.login;

      axios
        .get(
          `https://api.github.com/search/repositories?q=user:${username}+${repoName} in:name`,
          {
            headers: {
              Authorization: `token ${token}`,
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
    } else return res.status(401).send({ message: "User login is expired" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Oops! Something went wrong!" });
  }
};

export default searchProjects;
