import { useEffect } from "react";
import {
  AppBar,
  Avatar,
  Divider,
  Toolbar,
  Typography,
  ButtonBase,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { useDispatch, useSelector } from "react-redux";
import { userRequest, logoutRequest } from "../../redux/auth/action";
import { userSelector } from "../../redux/auth/selector";

import useRouter from "../../hooks/useRouter";
import { ROUTE_PATH } from "../../utils/route-util";

const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: "primary",
    boxShadow: "0px 1px 7px 0px rgba(169,169,169,0.5)",
    color: "white",
  },
  growWidth: {
    flexGrow: 1,
  },
  logo: {
    height: 50,
    width: 50,
  },
  divider: {
    background: "white",
    width: 3,
    height: 25,
    marginTop: theme.spacing(1.8),
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(2),
  },
  userAccName: {
    marginRight: theme.spacing(2),
  },
}));

const NavBar: React.FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { goTo } = useRouter();
  const access_token = localStorage.getItem("token") || "";

  const { userData } = useSelector(userSelector);

  useEffect(() => {
    dispatch(userRequest(access_token));
  }, [dispatch, access_token]);

  const onLogout = () => {
    dispatch(logoutRequest());
    goTo(ROUTE_PATH.login)();
  };

  const onLogoClick = () => {
    goTo(ROUTE_PATH.projectList)();
  };

  return (
    <>
      <AppBar className={classes.appBar}>
        <Toolbar>
          <ButtonBase onClick={onLogoClick}>
            <Avatar
              src="/images/achilles-logo-no-bg.png"
              className={classes.logo}
              alt="Achilles logo"
            />
            <Divider
              orientation="vertical"
              flexItem
              className={classes.divider}
            />
            <Typography variant="h5">Achilles</Typography>
          </ButtonBase>
          <div className={classes.growWidth} />
          <Typography variant="body1" className={classes.userAccName}>
            {userData ? userData.data.username : ""}
          </Typography>
          <ButtonBase onClick={onLogout}>
            <Typography variant="body1">Logout</Typography>
          </ButtonBase>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default NavBar;
