import React from "react";
import {
  Box,
  Slide,
  Modal,
  Paper,
  Backdrop,
  ButtonBase,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";

import {
  WhiteButton,
  CyanButton,
  DisabledButton,
} from "components/CustomButton";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: "#fff",
    padding: theme.spacing(3, 6),
    width: "40%",
    height: "60%",
    display: "flex",
    flexDirection: "column",
  },
  listContainer: {
    border: "2px solid rgb(128, 128, 128, 0.2)",
    borderRadius: theme.spacing(1),
    padding: theme.spacing(1, 2),
    marginBottom: theme.spacing(1),
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  pathContent: {
    marginLeft: theme.spacing(2),
  },
  growFlex: {
    flexGrow: 1,
  },
  buttonSpace: {
    marginLeft: theme.spacing(2),
  },
}));

interface PackageJsonDialogProps {
  open: boolean;
  paths: string[];
  selectedJsonPath: string;
  setSelectedJsonPath: (path: string) => void;
  cancelButton: () => void;
  analyzeButton: () => void;
}

const PackageJsonDialog: React.FC<PackageJsonDialogProps> = ({
  open,
  paths,
  selectedJsonPath,
  setSelectedJsonPath,
  cancelButton,
  analyzeButton,
}) => {
  const classes = useStyles();

  const onSelectPackageJsonPath = (path: string) => {
    setSelectedJsonPath(path);
  };

  return (
    <>
      <Modal open={open} BackdropComponent={Backdrop} className={classes.modal}>
        <Slide in={open} direction="down">
          <Paper className={classes.paper} elevation={0}>
            <Typography variant="h6">
              Please select a package.json file
            </Typography>
            <Box
              my={2}
              display="flex"
              flexDirection="column"
              height="75%"
              overflow="auto"
            >
              {paths.map((path: string, index: number) => {
                return (
                  <ButtonBase
                    className={classes.listContainer}
                    key={index}
                    onClick={() => onSelectPackageJsonPath(path)}
                  >
                    <InsertDriveFileIcon color="primary" />
                    <Typography variant="body2" className={classes.pathContent}>
                      {path}
                    </Typography>
                    <div className={classes.growFlex} />
                    {selectedJsonPath === path ? (
                      <CheckCircleIcon color="primary" />
                    ) : (
                      ""
                    )}
                  </ButtonBase>
                );
              })}
            </Box>
            <div className={classes.growFlex} />
            <Box textAlign="right">
              <WhiteButton variant="contained" onClick={cancelButton}>
                Cancel
              </WhiteButton>
              {selectedJsonPath ? (
                <CyanButton
                  variant="contained"
                  className={classes.buttonSpace}
                  onClick={analyzeButton}
                >
                  Analze selected file
                </CyanButton>
              ) : (
                <DisabledButton
                  variant="text"
                  disabled
                  className={classes.buttonSpace}
                >
                  Analze selected file
                </DisabledButton>
              )}
            </Box>
          </Paper>
        </Slide>
      </Modal>
    </>
  );
};

export default PackageJsonDialog;
