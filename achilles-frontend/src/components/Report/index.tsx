import { createRef } from "react";
import { useState, useEffect } from "react";
import { Box, Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import SystemUpdateAltRoundedIcon from "@material-ui/icons/SystemUpdateAltRounded";

import { CyanButton } from "../../components/CustomButton";
import { savePDF } from "@progress/kendo-react-pdf";

import Summary from "./Summary";
import Vulnerability from "./Vulnerability";

import { item, ReportInterface } from "../../utils/report-interface";
import {
  highSeverityColor,
  moderateSeverityColor,
  lowSeverityColor,
} from "../../utils/severityColor";

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(5, 20),
    [theme.breakpoints.down("md")]: {
      padding: theme.spacing(4, 5),
    },
    [theme.breakpoints.down("xs")]: {
      padding: theme.spacing(4, 3),
    },
  },
  circle: {
    border: "2px solid rgb(128, 128, 128, 0.8)",
    borderRadius: "100%",
    width: 145,
    height: 145,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  severityItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  highSeverityText: {
    color: highSeverityColor,
    textAlign: "center",
  },
  moderateSeverityText: {
    color: moderateSeverityColor,
    textAlign: "center",
  },
  lowSeverityText: {
    color: lowSeverityColor,
    textAlign: "center",
  },
  download: {
    marginRight: theme.spacing(1.5),
  },
  achilles: {
    width: 100,
    height: 100,
  },
}));

const Report: React.FC<{ data: ReportInterface }> = ({ data }) => {
  const classes = useStyles();
  const pdfRef = createRef<HTMLDivElement>();
  const [severities, setSeverities] = useState({
    high: 0,
    moderate: 0,
    low: 0,
  });

  useEffect(() => {
    let high = 0,
      moderate = 0,
      low = 0;

    data.items.forEach((item: item) => {
      const severity = item.severity;

      if (severity === "HIGH") high++;
      else if (severity === "MODERATE") moderate++;
      else if (severity === "LOW") low++;
    });

    setSeverities({ high, moderate, low });
  }, [data]);

  const downloadDocument = () => {
    const input: any = pdfRef.current;

    savePDF(input, {
      paperSize: "A4",
      fileName: `${data.repository_name}-achilles-report`,
      margin: "1cm",
    });
  };

  const renderReport = (
    <div ref={pdfRef}>
      <Typography variant="h5" color="primary">
        {data.username}
      </Typography>
      <Typography variant="h5" color="primary">
        {data.repository_name}
      </Typography>
      <Box my={4}>
        <Grid container>
          <Grid item xs={4} className={classes.severityItem}>
            <Box className={classes.circle}>
              <Typography variant="h6" className={classes.highSeverityText}>
                HIGH <br /> {severities.high}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={4} className={classes.severityItem}>
            <Box className={classes.circle}>
              <Typography variant="h6" className={classes.moderateSeverityText}>
                MODERATE <br /> {severities.moderate}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={4} className={classes.severityItem}>
            <Box className={classes.circle}>
              <Typography variant="h6" className={classes.lowSeverityText}>
                LOW <br /> {severities.low}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Summary {...{ items: data.items }} />
      <Box my={5} />
      <Vulnerability {...{ items: data.items }} />
    </div>
  );

  return (
    <>
      <Box className={classes.container}>
        {renderReport}
        <Box textAlign="center" mt={4} onClick={downloadDocument}>
          <CyanButton variant="contained">
            <SystemUpdateAltRoundedIcon
              fontSize="small"
              className={classes.download}
            />
            <Typography variant="body1">Download Report</Typography>
          </CyanButton>
        </Box>
      </Box>
    </>
  );
};
export default Report;
