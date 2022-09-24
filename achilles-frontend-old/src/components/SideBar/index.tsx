import {
  Box,
  Grid,
  Avatar,
  ButtonBase,
  Typography,
  SwipeableDrawer,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import ListRoundedIcon from "@material-ui/icons/ListRounded";
import HistoryRoundedIcon from "@material-ui/icons/HistoryRounded";
import ExitToAppRoundedIcon from "@material-ui/icons/ExitToAppRounded";

import useRouter from "../../hooks/useRouter";
import { ROUTE_PATH } from "../../utils/route-util";

import { useDispatch } from "react-redux";
import { logoutRequest } from "../../redux/auth/action";

interface sideBarProps {
  openDrawer: boolean;
  setOpenDrawer: (openDrawer: boolean) => void;
  userData: UserData;
}

interface UserData {
  username: string;
  profilePicture: string;
}

const useStyles = makeStyles((theme) => ({
  avatar: {
    width: theme.spacing(12),
    height: theme.spacing(12),
    marginRight: theme.spacing(3),
    marginLeft: theme.spacing(1),
    border: "2px solid #65c8d0",
  },
  button: {
    padding: theme.spacing(1),
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    "&:hover": {
      backgroundColor: "rgb(101,200,208, 0.3)",
      borderRadius: theme.spacing(1.5),
    },
  },
  buttonText: {
    color: "grey",
    marginLeft: theme.spacing(2),
  },
  backdropProps: {
    background: "transparent",
  },
}));

const SideBar: React.FC<sideBarProps> = ({
  userData,
  openDrawer,
  setOpenDrawer,
}) => {
  const classes = useStyles();
  const { goTo } = useRouter();
  const dispatch = useDispatch();

  const onLogout = () => {
    dispatch(logoutRequest());
    goTo(ROUTE_PATH.login)();
  };

  return (
    <>
      <SwipeableDrawer
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        onOpen={() => setOpenDrawer(true)}
        PaperProps={{
          style: {
            width: 300,
            borderTopRightRadius: 20,
            boxShadow: "0px 1px 7px 0px #65c8d0",
          },
        }}
        ModalProps={{
          BackdropProps: {
            classes: {
              root: classes.backdropProps,
            },
          },
        }}
      >
        <Box py={5} px={2}>
          <Grid container alignItems="center">
            <Grid item xs={6}>
              <Avatar
                alt="User profile"
                src={userData?.profilePicture}
                className={classes.avatar}
              />
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h5" color="primary">
                {userData?.username}
              </Typography>
            </Grid>
          </Grid>
          <Box mt={7} onClick={() => setOpenDrawer(false)}>
            <ButtonBase
              className={classes.button}
              onClick={() => goTo(ROUTE_PATH.history)()}
            >
              <HistoryRoundedIcon color="primary" />
              <Typography variant="body1" className={classes.buttonText}>
                History
              </Typography>
            </ButtonBase>
            <ButtonBase
              className={classes.button}
              onClick={() => goTo(ROUTE_PATH.root)()}
            >
              <ListRoundedIcon color="primary" />
              <Typography variant="body1" className={classes.buttonText}>
                Repository list
              </Typography>
            </ButtonBase>
            <ButtonBase className={classes.button} onClick={onLogout}>
              <ExitToAppRoundedIcon color="primary" />
              <Typography variant="body1" className={classes.buttonText}>
                Logout
              </Typography>
            </ButtonBase>
          </Box>
        </Box>
      </SwipeableDrawer>
    </>
  );
};

export default SideBar;
