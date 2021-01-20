import { useState, useEffect } from "react";
import { Box, Grid, Paper, Divider, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { item } from "../../../utils/report-interface";

const useStyles = makeStyles((theme) => ({
  paperContainer: {
    boxShadow: "0px 1px 5px 0px rgba(169,169,169,0.5)",
    padding: theme.spacing(2, 2),
    borderRadius: theme.spacing(2),
  },
  text: {
    marginBottom: theme.spacing(1),
  },
}));

interface Package {
  name: string;
  count: number;
}

const Summary: React.FC<{ items: item[] }> = ({ items }) => {
  const classes = useStyles();
  const [packages, setPackages] = useState<Package[]>();

  useEffect(() => {
    let packagesTemp: Package[] = [];
    items.forEach((item: item) => {
      const packageName = item.package.name;
      if (
        packagesTemp.length === 0 ||
        !packagesTemp.some((pack) => pack.name === packageName)
      ) {
        packagesTemp.push({ name: packageName, count: 1 });
      } else if (packagesTemp.some((pack) => pack.name === packageName)) {
        const index = packagesTemp.findIndex(
          (pack) => pack.name === packageName
        );
        packagesTemp[index].count += 1;
      }
    });

    setPackages(packagesTemp);
  }, [items]);

  return (
    <Paper elevation={0} className={classes.paperContainer}>
      <Box
        mb={1}
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <Typography variant="h6">Summary</Typography>
        <Typography variant="body1">
          Total vulnerabilities: {items.length}
        </Typography>
      </Box>
      <Divider />
      <Box mt={2} textAlign="center">
        <Grid container>
          {packages?.map((pack: Package, index: number) => {
            return (
              <Grid item xs={6} sm={4} key={index} className={classes.text}>
                <Typography variant="body1">
                  {pack.count} {pack.name}
                </Typography>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </Paper>
  );
};

export default Summary;
