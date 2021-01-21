import { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Chip,
  Avatar,
  Paper,
  Hidden,
  Typography,
  IconButton,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";
import DeleteForeverRoundedIcon from "@material-ui/icons/DeleteForeverRounded";

import moment from "moment";
import Loading from "../../components/Loading";
import AlertDialog from "../../components/AlertDialog";

import { ROUTE_API, ROUTE_PATH } from "../../utils/route-util";
import HttpUtil from "../../utils/http-util";
import { item } from "../../utils/report-interface";
import {
  highSeverityColor,
  moderateSeverityColor,
  lowSeverityColor,
} from "../../utils/severityColor";

import useRouter from "../../hooks/useRouter";

const useStyles = makeStyles((theme) => ({
  container: {
    margin: theme.spacing(5, 8),
    [theme.breakpoints.down("sm")]: {
      margin: theme.spacing(2, 3),
    },
  },
  paperContainer: {
    boxShadow: "0px 1px 4px 0px rgba(169,169,169,0.3)",
    padding: theme.spacing(1.5, 4),
    borderRadius: theme.spacing(2),
    marginBottom: theme.spacing(2),
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(1.5, 2),
    },
  },
  gridButton: {
    "&:hover": {
      cursor: "pointer",
    },
  },
  fileIcon: {
    marginRight: theme.spacing(2),
  },
  trashIcon: {
    width: 30,
    height: 30,
  },
  trashContainer: {
    textAlign: "right",
  },
  highSeverityChip: {
    marginRight: theme.spacing(1),
    borderColor: highSeverityColor,
    color: highSeverityColor,
  },
  moderateSeverityChip: {
    borderColor: moderateSeverityColor,
    marginRight: theme.spacing(1),
    color: moderateSeverityColor,
  },
  lowSeverityChip: {
    borderColor: lowSeverityColor,
    color: lowSeverityColor,
  },
  avatarHigh: {
    backgroundColor: highSeverityColor,
    "&.MuiChip-avatar": {
      color: "#ffffff",
    },
  },
  avatarMedium: {
    backgroundColor: moderateSeverityColor,
    "&.MuiChip-avatar": {
      color: "#ffffff",
    },
  },
  avatarLow: {
    backgroundColor: lowSeverityColor,
    "&.MuiChip-avatar": {
      color: "#ffffff",
    },
  },
}));

const History: React.FC = () => {
  const classes = useStyles();
  const { goTo } = useRouter();

  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(""); // report id for deletion
  const [isLoading, setLoading] = useState(false);
  const [reportHistory, setReportHistory] = useState([]);

  useEffect(() => {
    setLoading(true);
    HttpUtil.get(ROUTE_API.reports)
      .then((response) => {
        setReportHistory(response.data.reportHistory);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  const onSelectReport = (reportId: string) => {
    goTo(`${ROUTE_PATH.reportDetailNoParam}/${reportId}`)();
  };

  const onSelectDelete = (reportId: string) => {
    setOpen(true);
    setDeleteId(reportId);
  };

  const onCancelDelete = () => {
    setDeleteId("");
    setOpen(false);
  };

  const onDelete = () => {
    HttpUtil.delete(`${ROUTE_API.reports}/${deleteId}`)
      .then((response) => {
        setReportHistory((prevState) =>
          prevState.filter((item: { _id: string }) => item._id !== deleteId)
        );
        setDeleteId("");
        setOpen(false);
      })
      .catch((error) => {
        console.log(error);
        setOpen(false);
      });
  };

  const renderHistoryList = () => {
    return reportHistory.map((report: any, index: number) => {
      let high = 0,
        moderate = 0,
        low = 0;

      report.reportDetail.items.forEach((item: item) => {
        const severity = item.severity;

        if (severity === "HIGH") high++;
        else if (severity === "MODERATE") moderate++;
        else if (severity === "LOW") low++;
      });

      return (
        <Paper className={classes.paperContainer} key={index}>
          <Grid container alignItems="center" spacing={1}>
            <Grid
              item
              sm={4}
              xs={6}
              onClick={() => onSelectReport(report._id)}
              className={classes.gridButton}
            >
              <Box display="flex" flexDirection="row" alignItems="center">
                <InsertDriveFileIcon
                  color="primary"
                  className={classes.fileIcon}
                />
                <Typography variant="body1" noWrap>
                  {report.reportDetail.repository_name}
                </Typography>
              </Box>
            </Grid>
            <Hidden xsDown>
              <Grid
                item
                sm={4}
                onClick={() => onSelectReport(report._id)}
                className={classes.gridButton}
              >
                <Typography variant="body1" noWrap>
                  {moment(report.createdAt).format("DD-MM-YYYY hh:mm A")}
                </Typography>
              </Grid>
            </Hidden>
            <Grid
              item
              sm={3}
              xs={5}
              onClick={() => onSelectReport(report._id)}
              className={classes.gridButton}
            >
              <Box display="flex" flexDirection="row" alignItems="center">
                <Chip
                  variant="outlined"
                  size="small"
                  label={high}
                  avatar={<Avatar className={classes.avatarHigh}>H</Avatar>}
                  className={classes.highSeverityChip}
                />
                <Chip
                  variant="outlined"
                  size="small"
                  label={moderate}
                  avatar={<Avatar className={classes.avatarMedium}>M</Avatar>}
                  className={classes.moderateSeverityChip}
                />
                <Chip
                  variant="outlined"
                  size="small"
                  label={low}
                  avatar={<Avatar className={classes.avatarLow}>L</Avatar>}
                  className={classes.lowSeverityChip}
                />
              </Box>
            </Grid>
            <Grid item xs={1} sm={1} className={classes.trashContainer}>
              <IconButton
                onClick={() => onSelectDelete(report._id)}
                size="small"
              >
                <DeleteForeverRoundedIcon
                  color="primary"
                  className={classes.trashIcon}
                />
              </IconButton>
            </Grid>
          </Grid>
        </Paper>
      );
    });
  };

  return (
    <>
      {isLoading && <Loading />}
      <Box className={classes.container}>
        <Box ml={5} mb={2}>
          <Typography variant="h5" color="primary">
            History
          </Typography>
        </Box>
        {reportHistory.length <= 0 && !isLoading ? (
          <Box textAlign="center">
            <Typography variant="body1">
              There is no any vulnerabilities analysis report
            </Typography>
          </Box>
        ) : (
          renderHistoryList()
        )}
      </Box>

      <AlertDialog
        {...{
          open,
          title: "Do you really want to delete this report?",
          firstButton: { text: "No", action: onCancelDelete },
          secondButton: { text: "Yes", action: onDelete },
        }}
      />
    </>
  );
};

export default History;
