import React from "react";
import {
  Box,
  Grid,
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
    overflow: "hidden",
    minHeight: "60%",
    maxHeight: "90%",
  },
  gridItem: {
    height: "100%",
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
    marginTop: theme.spacing(0.5),
    marginBottom: theme.spacing(0.5),
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

          <Box width="100%" height="100%" display="flex">
            <Grid container justify="center">
              <Grid item xs={10} className={classes.gridItem}>

                <Box display="flex" flexDirection="column" justifyContent="center" height="100%">
                  <Paper className={classes.paper} elevation={0}>
                    <Typography variant="h6" noWrap>
                      Please select a package.json file
                    </Typography>
                    <Box
                      my={2}
                      display="flex"
                      flexDirection="column"
                      height="70%"
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
                    {/* Button area */}
                    <Box textAlign="right" mb={1}>
                      <Grid container spacing={1}>
                        <Grid item sm={4} md={6} lg={7} xl={9}/>
                        <Grid item xs={12} sm={3} md={2} lg={2} xl={1}>
                          <WhiteButton
                            variant="contained"
                            onClick={cancelButton}
                            fullWidth={true}
                          >
                            Cancel
                          </WhiteButton>
                        </Grid>

                        <Grid item xs={12} sm={5} md={4} lg={3} xl={2}>
                          {selectedJsonPath ? (
                            <CyanButton
                              variant="contained"
                              onClick={analyzeButton}
                              fullWidth={true}
                            >
                              Analyze selected file
                            </CyanButton>
                          ) : (
                            <DisabledButton
                              variant="text"
                              disabled
                              fullWidth={true}
                            >
                              Analyze selected file
                            </DisabledButton>
                          )}
                        </Grid>
                      </Grid>
                    </Box>
                  </Paper>
                </Box>
              </Grid>
            </Grid>
          </Box>

        </Slide>
      </Modal>
    </>
  );
};

export default PackageJsonDialog;
