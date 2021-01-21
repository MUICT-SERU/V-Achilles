import { Box } from "@material-ui/core";

import HttpUtil from "../../utils/http-util";
import { ROUTE_API } from "../../utils/route-util";

const data = {
  username: "KlintonICT",
  repository_name: "Shopping app",
  items: [
    {
      package: {
        name: "jquery",
      },
      chaining: [
        { source: "x", target: "y" },
        { source: "y", target: "z" },
        { source: "z", target: "jquery" },
      ],
      firstPatchedVersion: {
        identifier: "3.5.0",
      },
      severity: "MODERATE",
      vulnerableVersionRange: ">= 1.2, < 3.5.0",
      advisory: {
        //just added
        identifiers: [
          {
            type: "GHSA",
            value: "GHSA-2pqj-h3vj-pqgw",
          },
          {
            type: "CVE",
            value: "CVE-2017-16011",
          },
        ],
        permalink: "https://github.com/advisories/GHSA-2pqj-h3vj-pqgw",
      },
    },
  ],
};

const Visualization: React.FC = () => {
  const onCreateReport = () => {
    HttpUtil.post(ROUTE_API.reports, { report: data })
      .then((response) => {
        console.log(response.data.message);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Box mt={20} textAlign="center">
      <button onClick={onCreateReport}>Create report</button>
    </Box>
  );
};
export default Visualization;
