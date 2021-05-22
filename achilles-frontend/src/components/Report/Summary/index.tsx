import {
  Box,
  Chip,
  Grid,
  Paper,
  Hidden,
  Divider,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import ArrowForwardRoundedIcon from '@material-ui/icons/ArrowForwardRounded';

import splitDependency from 'utils/splitDependency';
import { severityColor, safetyColor } from 'utils/severityColor';

const useStyles = makeStyles((theme) => ({
  paperContainer: {
    boxShadow: '0px 1px 5px 0px rgba(169,169,169,0.5)',
    padding: theme.spacing(2, 2),
    borderRadius: theme.spacing(2),
  },
  text: {
    marginBottom: theme.spacing(1),
  },
  versionText: {
    borderRadius: theme.spacing(0.4),
    padding: theme.spacing(0, 0.2),
  },
  title: {
    fontWeight: 'bold',
    color: '#65c8d0',
  },
}));

const Summary: React.FC<{ items: IItem[] }> = ({ items }) => {
  const classes = useStyles();
  let numberOfDirectDep = 0;

  return (
    <Paper elevation={0} className={classes.paperContainer}>
      <Box
        mb={1}
        display="flex"
        flexDirection="row"
        alignItems="flex-end"
        justifyContent="space-between"
      >
        <Typography variant="h5">Summary</Typography>
        <Typography variant="body2">
          Total vulnerabilities: {items.length}
        </Typography>
      </Box>
      <Divider style={{ height: 2 }} />
      {items.length > 0 ? (
        <Box mt={2} textAlign="center">
          <Grid container spacing={2}>
            <Grid item sm={4} xs={5} md={3}>
              <Box textAlign="left">
                <Typography variant="body1" className={classes.title}>
                  Dependency
                </Typography>
              </Box>
            </Grid>
            <Hidden smDown>
              <Grid item sm={4} xs={5} md={3}>
                <Typography variant="body1" className={classes.title}>
                  Type
                </Typography>
              </Grid>
            </Hidden>
            <Grid item sm={4} xs={7} md={3}>
              <Box
                display="flex"
                flexDirection="row"
                alignItems="center"
                justifyContent="center"
              >
                <Typography variant="body1" className={classes.title}>
                  Updating
                </Typography>
              </Box>
            </Grid>
            <Hidden xsDown>
              <Grid item sm={4} md={3}>
                <Box textAlign="right">
                  <Typography variant="body1" className={classes.title}>
                    Severity
                  </Typography>
                </Box>
              </Grid>
            </Hidden>
          </Grid>

          {items.map((itemDetail: IItem, index: number) => {
            const { depName } = splitDependency(itemDetail.package.name);
            const labelSeverity = itemDetail.severity.toLowerCase();
            const color = severityColor(itemDetail.severity);
            const isPatchVersion = itemDetail.firstPatchedVersion?.identifier;

            let isDirect = false;
            if (itemDetail.chaining.length === 1) {
              numberOfDirectDep += 1;
              isDirect = true;
            }

            return (
              <Grid container key={index} spacing={2}>
                <Grid item sm={4} xs={5} md={3}>
                  <Box textAlign="left">
                    <Typography variant="body2">{depName}</Typography>
                  </Box>
                </Grid>
                <Hidden smDown>
                  <Grid item sm={4} xs={5} md={3}>
                    <Typography variant="body2">
                      {isDirect ? 'Direct' : 'Indirect'}
                    </Typography>
                  </Grid>
                </Hidden>
                <Grid item sm={4} xs={7} md={3}>
                  <Box
                    display="flex"
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Typography
                      variant="body2"
                      style={{ border: `1px solid ${color}`, color: color }}
                      className={classes.versionText}
                    >
                      {itemDetail.vulnerableVersionRange}
                    </Typography>
                    <ArrowForwardRoundedIcon
                      style={{ marginLeft: 4, marginRight: 4 }}
                    />
                    <Typography
                      variant="body2"
                      style={{
                        border: `1px solid ${
                          isPatchVersion ? safetyColor : '#fff'
                        }`,
                        color: isPatchVersion ? safetyColor : '#000',
                      }}
                      className={isPatchVersion ? classes.versionText : ''}
                    >
                      {isPatchVersion ?? 'none'}
                    </Typography>
                  </Box>
                </Grid>
                <Hidden xsDown>
                  <Grid item sm={4} md={3}>
                    <Box textAlign="right">
                      <Chip
                        variant="outlined"
                        size="small"
                        label={labelSeverity}
                        style={{ borderColor: color, color }}
                      />
                    </Box>
                  </Grid>
                </Hidden>
              </Grid>
            );
          })}

          <Box mt={2}>
            <Divider style={{ height: 1 }} />
            <Box textAlign="left" mt={1}>
              <Typography variant="caption">
                Total of vulnerable direct dependency: {numberOfDirectDep}
              </Typography>
              <Box mb={1} />
              <Typography variant="caption">
                Total of vulnerable indirect dependency:{' '}
                {items.length - numberOfDirectDep}
              </Typography>
            </Box>
          </Box>
        </Box>
      ) : (
        <Box mt={5} textAlign="center">
          <Typography variant="h6">No vulnerabilities were found</Typography>
        </Box>
      )}
    </Paper>
  );
};

export default Summary;
