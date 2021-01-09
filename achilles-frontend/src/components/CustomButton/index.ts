import { Button } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

const CyanButton = withStyles((theme) => ({
  root: {
    color: "white",
    padding: theme.spacing(0.6, 2),
    borderRadius: theme.spacing(10),
    textTransform: "none",
    backgroundColor: "#65c8d0",
    "&:hover": {
      backgroundColor: "#65c8d0",
      opacity: 0.7,
    },
  },
}))(Button);

const DisabledButton = withStyles((theme) => ({
  root: {
    padding: theme.spacing(0.6, 2),
    borderRadius: theme.spacing(10),
    textTransform: "none",
    backgroundColor: "#65c8d0",
    opacity: 0.5,
    "&.MuiButtonBase-root.Mui-disabled": {
      color: "white",
    },
  },
}))(Button);

export { CyanButton, DisabledButton };
