import { useEffect, useState } from "react";
import {
  AppBar,
  Avatar,
  Divider,
  Toolbar,
  Typography,
  ButtonBase,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import MenuRoundedIcon from "@material-ui/icons/MenuRounded";

import { useDispatch, useSelector } from "react-redux";
import { userRequest, logoutRequest } from "../../redux/auth/action";
import { userSelector } from "../../redux/auth/selector";

import useRouter from "../../hooks/useRouter";
import { ROUTE_PATH } from "../../utils/route-util";

import SideBar from "../SideBar";

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
  menuButton: {
    marginRight: theme.spacing(2),
  },
  menuIcon: {
    width: 30,
    height: 30,
  },
}));

const NavBar: React.FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { goTo } = useRouter();
  const access_token = localStorage.getItem("token") || "";

  const [openDrawer, setOpenDrawer] = useState(false);

  const { userData } = useSelector(userSelector);

  useEffect(() => {
    dispatch(userRequest());
  }, [dispatch, access_token]);

  const onLogout = () => {
    dispatch(logoutRequest());
    goTo(ROUTE_PATH.login)();
  };

  const onLogoClick = () => {
    goTo(ROUTE_PATH.root)();
  };

  return (
    <>
      <AppBar className={classes.appBar}>
        <Toolbar>
          <ButtonBase
            className={classes.menuButton}
            onClick={() => setOpenDrawer(true)}
          >
            <MenuRoundedIcon className={classes.menuIcon} />
          </ButtonBase>
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
            {userData ? userData?.username : ""}
          </Typography>
          <ButtonBase onClick={onLogout}>
            <Typography variant="body1">Logout</Typography>
          </ButtonBase>
        </Toolbar>
      </AppBar>

      {userData ? <SideBar {...{ userData, openDrawer, setOpenDrawer }} /> : ""}
    </>
  );
};

export default NavBar;
