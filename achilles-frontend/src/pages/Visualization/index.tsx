import React, { useEffect, useState } from "react";
import { Box } from "@material-ui/core";
import { createGlobalStyle } from "styled-components";

import Loading from "components/Chart/Loading";
import Chart from "components/Chart";
import InputFile from "components/Chart/InputFile";

import HttpUtil from "utils/http-util";
import { ROUTE_API, ROUTE_PATH } from "utils/route-util";

import { githubAuth } from "lib/query";
import useRouter from "hooks/useRouter";

const GlobalStyle = createGlobalStyle`
  body {
    background-color: #282c34;
    color: #fff;
  }
`;

const mockReportData = {
  username: "KlintonICT",
  repository_name: "baak_web_demo",
  items: [
    {
      package: {
        name: "mongodb",
      },
      chaining: [{ source: "baak_web_demo", target: "mongodb@^3.6.3" }],
      firstPatchedVersion: {
        identifier: "4.2.12",
      },
      severity: "HIGH",
      vulnerableVersionRange: "< 3.7.13",
      advisory: {
        //just added
        identifiers: [
          {
            type: "GHSA",
            value: "GHSA-mh5c-679w-hh4r",
          },
        ],
      },
    },
    {
      package: {
        name: "minimist",
      },
      chaining: [
        { source: "baak_web_demo", target: "json5@^2.1.3" },
        { source: "json5@^2.1.3", target: "minimist@^1.2.5" },
      ],
      firstPatchedVersion: {
        identifier: "1.5.6",
      },
      severity: "LOW",
      vulnerableVersionRange: "< 1.3.5",
      advisory: {
        //just added
        identifiers: [
          {
            type: "GHSA",
            value: "GHSA-vh95-rmgr-6w4m",
          },
          {
            type: "CVE",
            value: "CVE-2020-7598",
          },
        ],
      },
    },
    {
      package: {
        name: "minimist",
      },
      chaining: [
        { source: "baak_web_demo", target: "json5@^2.1.3" },
        { source: "json5@^2.1.3", target: "minimist@^1.2.5" },
      ],
      firstPatchedVersion: {
        identifier: "1.5.6",
      },
      severity: "MODERATE",
      vulnerableVersionRange: "< 1.4.5",
      advisory: {
        //just added
        identifiers: [
          {
            type: "GHSA",
            value: "GHSA-7fhm-mqm4-2wp7",
          },
        ],
      },
    },
  ],
};

const Visualization: React.FC = () => {
  const [username, setUsername] = useState("Loading...");
  const [progress, setProgress] = useState<number>(0);
  // const [reportData, setReportData] = useState<IReport | null>(mockReportData)

  const { goTo } = useRouter();

  const [data, setData] = useState({});

  useEffect(() => {
    startApp();
  }, []);

  async function startApp() {
    const authResult = await githubAuth();
    setUsername(authResult.data.viewer.login);

    // ==================================================
    // === Get package.json content
    // === from localStorage.getItem('packageJsonContent)
    // ==================================================

    const packageJsonContent = localStorage.getItem("packageJsonContent") || "";
    const json = JSON.parse(packageJsonContent);
    setData(json);
  }

  // File Input Handler
  function onFileChange(file: any) {
    const fileReader = new FileReader();
    // On File Reader done
    fileReader.addEventListener("load", () => {
      // Convert text to JSON object
      let json = {};
      try {
        json = JSON.parse(fileReader.result?.toString() || "");

        setData(json);
        console.log(json);
      } catch (e) {
        console.error(e);
        alert(
          "File input cannot convert to JSON object.\nPlease check your file input."
        );
      }
    });

    // Start read file as text
    fileReader.readAsText(file);
  }

  const onCreateReport = () => {
    const _reportData = {};

    HttpUtil.post(ROUTE_API.reports, { report: mockReportData })
      .then((response) => {
        console.log(response.data.message);
        const reportId = response.data.reportId;

        goTo(`${ROUTE_PATH.reportDetailNoParam}/${reportId}`)();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // ======================
  // ---- Event handler
  // ======================
  // function onCreateReportClick() {
  //   goTo(ROUTE_PATH.reportDetail)()
  // }

  return (
    <div className="container">
      <GlobalStyle />
      <Box mt={1}>
        <div>
          <p>
            <span>Github user: </span>
            <strong>{username}</strong>
          </p>
        </div>

        <div>{/* <InputFile onChange={onFileChange} /> */}</div>

        <div>
          <Loading progress={progress} />
        </div>

        <div>
          <button onClick={onCreateReport}>Create report</button>
        </div>

        <hr />

        <div>
          <Chart setProgress={setProgress} data={data} />
        </div>
      </Box>
    </div>
  );
};

export default Visualization;
