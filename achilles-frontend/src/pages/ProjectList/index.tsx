import { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Paper,
  Radio,
  Divider,
  InputBase,
  Typography,
  RadioGroup,
  FormControlLabel,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import SearchIcon from "@material-ui/icons/Search";
import LockIcon from "@material-ui/icons/Lock";
import PersonSharpIcon from "@material-ui/icons/PersonSharp";

import swal from "sweetalert";
import useDebounce from "../../hooks/useDebounce";

import HttpUtil from "../../utils/http-util";
import { ROUTE_API } from "../../utils/route-util";

import Loading from "../../components/Loading";
import AlertDialog from "../../components/AlertDialog";
import { CyanButton, DisabledButton } from "../../components/CustomButton";

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

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(5, 20),
    [theme.breakpoints.down("md")]: {
      padding: theme.spacing(5, 10),
    },
    [theme.breakpoints.down("xs")]: {
      padding: theme.spacing(5, 3),
    },
  },
  searchContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    width: "auto",
    border: "2px solid rgb(128, 128, 128, 0.5)",
    borderRadius: 50,
    justifyContent: "space-between",
    padding: theme.spacing(1, 3),
    margin: theme.spacing(2, 0),
  },
  inputRoot: {
    color: "inherit",
    flex: 1,
  },
  inputInput: {
    width: "100%",
  },
  paperContainer: {
    boxShadow: "0px 1px 5px 0px rgba(169,169,169,0.5)",
    padding: theme.spacing(2, 2),
    borderRadius: theme.spacing(2),
    marginTop: theme.spacing(5),
  },
  paperTitle: {
    marginBottom: theme.spacing(2),
  },
  lockIcon: {
    marginLeft: theme.spacing(0.5),
    width: 15,
    height: 15,
  },
  personIcon: {
    marginRight: theme.spacing(1),
    width: 20,
    height: 20,
  },
}));

const ProjectList: React.FC = () => {
  const classes = useStyles();
  const access_token = localStorage.getItem("token") || "";

  const [open, setOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [searchRepo, setSearchRepo] = useState("");
  const [isPackgeJsonLoading, setPackgeJsonLoading] = useState(false);

  const [selectedProject, setSelectedProject] = useState("");

  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [userProjects, setUserProjects] = useState([]);
  const [contributeProjects, setContributeProjects] = useState([]);

  const debounceSearch = useDebounce(searchRepo, 500);

  useEffect(() => {
    setLoading(true);
    if (debounceSearch) {
      HttpUtil.get(
        `${ROUTE_API.searchProject}?token=${access_token}&repoName=${debounceSearch}`
      )
        .then((response) => {
          const projects = response.data;
          setUserProjects(projects.userProjects);
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
        });
    } else {
      HttpUtil.get(`${ROUTE_API.project}?data=${access_token}`)
        .then((response) => {
          const projects = response.data;
          setAllProjects(projects.allProjects);
          setUserProjects(projects.userProjects);
          setContributeProjects(projects.contributeProjects);
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
        });
    }
  }, [access_token, debounceSearch]);

  const onSelectedProject = (event: any) => {
    const value = event.target.value;
    setSelectedProject(value);
  };

  const onFindVulnerabilities = () => {
    setPackgeJsonLoading(true);
    const index = allProjects.findIndex(
      (item) => item.projectName === selectedProject
    );
    const user = allProjects[index].ownerName;

    HttpUtil.get(
      `${ROUTE_API.isPackgeJson}?access_token=${access_token}&repoName=${selectedProject}&user=${user}`
    )
      .then((response) => {
        setPackgeJsonLoading(false);
        if (!response.data.isPackgeJson) {
          swal(
            "Sorry!",
            "This repository is not allowed to analyze. Please select only the npm project that have package.json file",
            "error"
          );
        }
      })
      .catch((err) => {
        console.log(err);
        setPackgeJsonLoading(false);
      });

    // const index = allProjects.findIndex(
    //   (item: Project) => item.projectName === selectedProject
    // );

    // HttpUtil.get(
    //   `${ROUTE_API.packageJsonContent}?access_token=${access_token}&selectedRepo=${allProjects[index].projectName}&ownerName=${allProjects[index].ownerName}`
    // )
    //   .then((response) => {
    //     console.log(response.data);
    //   })
    //   .catch((err) => console.log(err));
  };

  // const closeAlert = (openState: boolean) => {
  //   if (openState) setOpen(false);
  //   else return;
  // };

  const renderProjectList = (projects: Project[]) => {
    return (
      <Grid container direction="row" alignItems="center">
        {projects.map((project: Project, index: number) => {
          return (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <FormControlLabel
                value={project.projectName}
                control={<Radio color="primary" />}
                label={
                  <Box display="flex" flexDirection="row" alignItems="center">
                    <Typography variant="body2">
                      {project.projectName}
                    </Typography>
                    {project.privateProject ? (
                      <LockIcon color="primary" className={classes.lockIcon} />
                    ) : (
                      ""
                    )}
                  </Box>
                }
              />
            </Grid>
          );
        })}
      </Grid>
    );
  };

  return (
    <>
      {(isLoading || isPackgeJsonLoading) && <Loading />}
      <Box className={classes.container}>
        <Typography variant="h5">
          Which GitHub repository do you want to find vulnerabilities?
        </Typography>
        <Box className={classes.searchContainer}>
          <InputBase
            placeholder="Search repositories by name..."
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput,
            }}
            onChange={(e) => setSearchRepo(e.target.value)}
          />
          <SearchIcon fontSize="large" color="primary" />
        </Box>
        <RadioGroup
          aria-label="selected-repo"
          name="selected-repo"
          value={selectedProject}
          onChange={onSelectedProject}
        >
          {isLoading ? (
            ""
          ) : (
            <Paper elevation={0} className={classes.paperContainer}>
              <Box textAlign="center">
                <Typography variant="h6" className={classes.paperTitle}>
                  Personal Repositories
                </Typography>
              </Box>
              <Box>
                {userProjects.length <= 0 && debounceSearch && !isLoading ? (
                  <Box textAlign="center">
                    <Typography variant="body2">
                      No results for search repositories were found
                    </Typography>
                  </Box>
                ) : userProjects.length <= 0 &&
                  !debounceSearch &&
                  !isLoading ? (
                  <Box textAlign="center">
                    <Typography variant="body2">
                      You don't have any personal repositories on GitHub
                    </Typography>
                  </Box>
                ) : (
                  renderProjectList(userProjects)
                )}
              </Box>
            </Paper>
          )}
          {contributeProjects.length > 0 && !isLoading ? (
            <Paper elevation={0} className={classes.paperContainer}>
              <Box textAlign="center">
                <Typography variant="h6" className={classes.paperTitle}>
                  Repositories with contributor access
                </Typography>
              </Box>
              <Box>
                {debounceSearch && !isLoading ? (
                  <Box textAlign="center">
                    <Typography variant="body2">
                      Unable to search the repositories that you are being a
                      contributor on GitHub
                    </Typography>
                  </Box>
                ) : (
                  contributeProjects.map(
                    (project: ContributeProject, index: number) => {
                      return (
                        <Box
                          key={index}
                          mb={index < contributeProjects.length - 1 ? 5 : 0}
                        >
                          <Box
                            display="flex"
                            flexDirection="row"
                            alignItems="center"
                          >
                            <PersonSharpIcon
                              color="primary"
                              className={classes.personIcon}
                            />
                            <Typography variant="h6">
                              {project.ownerName}
                            </Typography>
                          </Box>
                          {renderProjectList(project.projects)}
                          {index < contributeProjects.length - 1 ? (
                            <Divider />
                          ) : (
                            ""
                          )}
                        </Box>
                      );
                    }
                  )
                )}
              </Box>
            </Paper>
          ) : (
            ""
          )}
        </RadioGroup>
        {isLoading ||
        (userProjects.length <= 0 && contributeProjects.length <= 0) ? (
          ""
        ) : !isLoading &&
          debounceSearch &&
          userProjects.length <= 0 &&
          !selectedProject ? (
          ""
        ) : (
          <Box textAlign="center" mt={4}>
            {!selectedProject ? (
              <DisabledButton variant="text" disabled>
                Find vulnerabilities
              </DisabledButton>
            ) : (
              <CyanButton variant="contained" onClick={onFindVulnerabilities}>
                Find vulnerabilities
              </CyanButton>
            )}
          </Box>
        )}
      </Box>

      <AlertDialog
        {...{
          open: open,
          title: "Sorry! this repository is not allowed to analyze",
          content:
            "Please select only the npm project that have package.json file",
          firstButton: { text: "Close", action: () => setOpen(false) },
          handleClose: () => setOpen(false),
        }}
      />
    </>
  );
};

export default ProjectList;
