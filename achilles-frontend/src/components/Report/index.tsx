import { useState, useEffect } from 'react';
import { Box, Grid, Avatar, Divider, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import SystemUpdateAltRoundedIcon from '@material-ui/icons/SystemUpdateAltRounded';

import { CyanButton } from '../../components/CustomButton';
import { PDFExport } from '@progress/kendo-react-pdf';
import moment from 'moment';

import Summary from './Summary';
import Vulnerability from './Vulnerability';

import { item, ReportInterface } from '../../utils/report-interface';
import {
  lowSeverityColor,
  highSeverityColor,
  moderateSeverityColor,
  criticalSeverityColor,
} from '../../utils/severityColor';

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(5, 20),
    [theme.breakpoints.down('md')]: {
      padding: theme.spacing(4, 5),
    },
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(4, 3),
    },
  },
  circle: {
    border: '2px solid rgb(128, 128, 128, 0.8)',
    borderRadius: '100%',
    width: 145,
    height: 145,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  severityItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  criticalSeverityText: {
    color: criticalSeverityColor,
    textAlign: 'center',
  },
  highSeverityText: {
    color: highSeverityColor,
    textAlign: 'center',
  },
  moderateSeverityText: {
    color: moderateSeverityColor,
    textAlign: 'center',
  },
  lowSeverityText: {
    color: lowSeverityColor,
    textAlign: 'center',
  },
  download: {
    marginRight: theme.spacing(1.5),
  },
  achillesLogo: {
    width: 150,
    height: 150,
  },
  hiddenReport: {
    position: 'absolute',
    left: theme.spacing(-1000),
    top: 0,
  },
}));

const Report: React.FC<{ data: ReportInterface; createdDate: string }> = ({
  data,
  createdDate,
}) => {
  const classes = useStyles();
  let pdfExportComponent: PDFExport | null;
  const [sortValue, setSortValue] = useState('');
  const [severities, setSeverities] = useState({
    critical: 0,
    high: 0,
    moderate: 0,
    low: 0,
  });

  useEffect(() => {
    let critical = 0,
      high = 0,
      moderate = 0,
      low = 0;

    data.items.forEach((item: item) => {
      const severity = item.severity;

      if (severity === 'CRITICAL') critical++;
      else if (severity === 'HIGH') high++;
      else if (severity === 'MODERATE') moderate++;
      else if (severity === 'LOW') low++;
    });

    setSeverities({ critical, high, moderate, low });
  }, [data]);

  const downloadDocument = () => {
    pdfExportComponent?.save();
  };

  const renderReport = (isDownload: boolean) => {
    return (
      <div>
        <Typography variant="h5" color="primary">
          {data.username}
        </Typography>
        <Typography variant="h5" color="primary">
          {data.repository_name}
        </Typography>
        <Box my={4}>
          <Grid container spacing={1}>
            <Grid item sm={3} xs={6} className={classes.severityItem}>
              <Box className={classes.circle}>
                <Typography
                  variant="h6"
                  className={classes.criticalSeverityText}
                >
                  CRITICAL <br /> {severities.critical}
                </Typography>
              </Box>
            </Grid>
            <Grid item sm={3} xs={6} className={classes.severityItem}>
              <Box className={classes.circle}>
                <Typography variant="h6" className={classes.highSeverityText}>
                  HIGH <br /> {severities.high}
                </Typography>
              </Box>
            </Grid>
            <Grid item sm={3} xs={6} className={classes.severityItem}>
              <Box className={classes.circle}>
                <Typography
                  variant="h6"
                  className={classes.moderateSeverityText}
                >
                  MODERATE <br /> {severities.moderate}
                </Typography>
              </Box>
            </Grid>
            <Grid item sm={3} xs={6} className={classes.severityItem}>
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
        <Vulnerability
          {...{ items: data.items, isDownload, sortValue, setSortValue }}
        />
      </div>
    );
  };

  return (
    <>
      <div className={classes.hiddenReport}>
        <PDFExport
          paperSize="A4"
          fileName={`${data.repository_name}-achilles-report`}
          margin="1cm"
          scale={0.5}
          ref={(component) => (pdfExportComponent = component)}
        >
          <Box mb={4}>
            <Avatar
              src="/images/achilles-logo-no-bg.png"
              className={classes.achillesLogo}
            />
            <Typography variant="h4">Achilles: Vulnerability Report</Typography>
            <Box my={1}>
              <Typography variant="h6">
                {moment(createdDate).format('MMMM Do YYYY, h:mm a')}
              </Typography>
            </Box>
            <Divider />
          </Box>
          {renderReport(true)}
        </PDFExport>
      </div>

      <Box className={classes.container}>
        {renderReport(false)}
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
