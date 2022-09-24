import { useState, useRef, useEffect } from "react";
import { Box, Grid, Avatar, CardMedia, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Player } from "@lottiefiles/react-lottie-player";
import GitHubLogin from "react-github-login";

import { useDispatch, useSelector } from "react-redux";
import Loading from "../../components/Loading";

import { loginWithGithubRequest } from "../../redux/auth/action";
import { loginWithGithubSelector } from "../../redux/auth/selector";

import useRouter from "../../hooks/useRouter";
import { ROUTE_PATH } from "../../utils/route-util";

const useStyles = makeStyles((theme) => ({
  container: {
    height: "100vh",
    width: "100vw",
    margin: 0,
    overflow: "hidden",
    backgroundImage: `url(${"/images/bg.png"})`,
    backgroundSize: "80vw 100vh",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right",
  },
  gridContainer: {
    minHeight: "100vh",
  },
  logo: {
    width: 100,
    height: 100,
  },
  gitHub: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    marginRight: theme.spacing(2),
  },
  connectGithub: {
    color: "white",
    padding: theme.spacing(0.6, 2),
    borderRadius: theme.spacing(10),
    border: "none",
    boxShadow: "0px 1px 7px 0px rgba(169,169,169,0.5)",
    backgroundColor: "#65c8d0",
    "&:hover": {
      backgroundColor: "rgb(101,200,208, 0.7)",
      cursor: "pointer",
    },
  },
  mobileLogo: {
    [theme.breakpoints.down("sm")]: {
      marginTop: theme.spacing(2)
    }
  }
}));

const Login: React.FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const didMountRef = useRef(false);
  const { goTo } = useRouter();

  const [isLoading, setLoading] = useState(false);

  const { userData, isErrorLoginWithGithub } = useSelector(
    loginWithGithubSelector
  );

  useEffect(() => {
    // prevent running on initial mount
    if (didMountRef.current) {
      if (userData) {
        if (!isErrorLoginWithGithub) {
          setLoading(false);
          goTo(ROUTE_PATH.root)();
        }
      }
    } else didMountRef.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);

  const onFailure = (response: any) => {
    console.log("Login with github Fail", response);
  };

  const onSuccess = (response: any) => {
    setLoading(true);
    const { code } = response;
    dispatch(loginWithGithubRequest(code));
  };

  return (
    <>
      {isLoading && <Loading />}
      <Box className={classes.container}>
        <Grid
          container
          direction="row"
          alignItems="center"
          justify="space-around"
          className={classes.gridContainer}
          spacing={1}
        >
          <Grid item>
            <Box display="flex" alignItems="center" flexDirection="column" className={classes.mobileLogo}>
              <CardMedia
                image={"/images/" + (process.env.NODE_ENV === 'development' ? "achilles-logo-dev-circle.png" : "achilles-logo-circle.png" ) }
                className={classes.logo}
                title="Achilles Logo"
              />
              <Typography variant="h3">Achilles</Typography>
              <Box textAlign="center" my={3}>
                <Typography variant="h6">
                  Connect your GitHub with Achilles to
                  <br />
                  find security vulnerabilities in your project
                </Typography>
              </Box>
              <GitHubLogin
                scope="repo,gist"
                redirectUri=""
                clientId={process.env.REACT_APP_GITHUB_CLIENT_ID}
                buttonText={
                  <Box display="flex" flexDirection="row" alignItems="center">
                    <Avatar
                      src="/images/github.png"
                      alt="Github Logo"
                      className={classes.gitHub}
                    />
                    <Typography variant="body2">Connect with GitHub</Typography>
                  </Box>
                }
                onSuccess={onSuccess}
                onFailure={onFailure}
                className={classes.connectGithub}
              />
            </Box>
          </Grid>
          <Grid item>
            <Player
              loop
              autoplay
              background="transparent"
              speed={1}
              src={require("./computer.json")}
              style={{ height: "500px", width: "500px" }}
            ></Player>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Login;
