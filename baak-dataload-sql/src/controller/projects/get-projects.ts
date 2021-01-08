import axios from "axios";
import { getUser } from "../../utils/getUser";

interface getProjectsReq {
  query: {
    data: string;
  };
}

interface Project {
  ownerName: string;
  projectName: string;
  cloneUrl: string;
  privateProject: boolean;
}

interface ContributeProject {
  ownerName: string;
  projects: Project[];
}

const getProjects = async (req: getProjectsReq, res: any, _: any) => {
  const { data } = req.query;

  try {
    const userData = await getUser(data);

    if (userData) {
      // authenticated username
      const username = userData.data.login;

      axios
        .get("https://api.github.com/user/repos", {
          headers: {
            Authorization: `token ${data}`,
            Accept: "application/vnd.github.v3+json",
          },
        })
        .then(async (response) => {
          const repositories = await response.data;

          let allProjects: Project[] = [];
          let userProjects: Project[] = [];
          let contributeProjects: ContributeProject[] = [];

          await Promise.all(
            repositories.map(async (repo: any) => {
              let owner = repo.owner.login;

              const project = {
                ownerName: owner,
                projectName: repo.name,
                cloneUrl: repo.clone_url,
                privateProject: repo.private,
              };

              allProjects.push(project);

              if (owner === username) {
                // authenticated user projects
                userProjects.push(project);
              } else {
                if (
                  !contributeProjects.some(
                    (item) => item.ownerName === owner
                  ) ||
                  contributeProjects.length === 0
                ) {
                  contributeProjects.push({
                    ownerName: owner,
                    projects: [project],
                  });
                } else {
                  // contributor projects
                  const index = contributeProjects.findIndex(
                    (item) => item.ownerName === owner
                  );
                  const currentProject = contributeProjects[index].projects;
                  contributeProjects[index].projects = [
                    ...currentProject,
                    project,
                  ];
                }
              }
            })
          );

          res.status(200).json({
            allProjects,
            userProjects,
            contributeProjects,
          });
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

export default getProjects;
