import { useRef, useState, useEffect } from "react";
import {
  Box,
  Link,
  Grid,
  Avatar,
  CardMedia,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Player } from "@lottiefiles/react-lottie-player";

import Loading from "../../components/Loading";
import { CyanButton } from "../../components/CustomButton";

import { useDispatch, useSelector } from "react-redux";

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
  },
  connectGithub: {
    color: "white",
    height: "100%",
    "&:hover": {
      textDecoration: "none",
    },
  },
  rightContainer: {
    marginTop: theme.spacing(-5),
  },
}));

const Login: React.FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const didMountRef = useRef(false);
  const { goTo, location } = useRouter();

  const [isLoading, setLoading] = useState(false);

  const { userData, isErrorLoginWithGithub } = useSelector(
    loginWithGithubSelector
  );

  useEffect(() => {
    const code: string = location.search.split("?code=")[1];

    if (code) {
      setLoading(true);
      dispatch(loginWithGithubRequest(code));
    }
  }, [dispatch, location]);

  useEffect(() => {
    // prevent running on initial mount
    if (didMountRef.current) {
      if (userData) {
        if (!isErrorLoginWithGithub) {
          setLoading(false);
          goTo(ROUTE_PATH.projectList)();
        }
      }
    } else didMountRef.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);

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
        >
          <Grid item>
            <Box display="flex" alignItems="center" flexDirection="column">
              <CardMedia
                image="/images/achilles-logo-circle.png"
                className={classes.logo}
                title="Achilles Logo"
              />
              <Typography variant="h3">Achilles</Typography>
              <Box textAlign="center" my={3}>
                <Typography variant="h6">
                  Connect your GitHub with
                  <br />
                  Achilles to find vulnerabilities
                </Typography>
              </Box>
              <CyanButton
                variant="contained"
                startIcon={
                  <Avatar
                    src="/images/github.png"
                    alt="Github Logo"
                    className={classes.gitHub}
                  />
                }
              >
                <Link
                  href={ROUTE_PATH.githubAuthorize}
                  className={classes.connectGithub}
                >
                  Connect with GitHub
                </Link>
              </CyanButton>
            </Box>
          </Grid>
          <Grid item className={classes.rightContainer}>
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
