import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, LinearProgress } from '@material-ui/core';
import { createGlobalStyle } from 'styled-components';

import Chart from 'components/Chart';
import { CyanButton } from 'components/CustomButton';

import HttpUtil from 'utils/http-util';
import { ROUTE_API, ROUTE_PATH } from 'utils/route-util';
import { createReport } from 'utils/visualization-util';

import { githubAuth } from 'lib/query';
import useRouter from 'hooks/useRouter';

const GlobalStyle = createGlobalStyle`
  body {
    background-color: #282c34;
    color: #fff;
  }
`;

interface INodeLinksData {
  nodes: INode[];
  links: ILink[];
}

const Visualization: React.FC = () => {
  const [levelDep, setLevelDep] = useState(1);
  const [nodeRemain, setNodeRemain] = useState(0);
  const [isVisualizing, setVisualizing] = useState(true);
  const [repoName, setRepoName] = useState('');
  const [username, setUsername] = useState('');
  const [jsonPath, setJsonPath] = useState('');

  const [nodeLinksData, setNodeLinksData] = useState<INodeLinksData>({
    nodes: [],
    links: [],
  });
  const [advisoriesData, setAdvisoriesDataData] = useState<IAdvisoriesData>({});

  const repositoryName = useRef<string>('-');

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

    const packageJsonContent = localStorage.getItem('packageJsonContent') || '';
    const json = JSON.parse(packageJsonContent);

    console.log(json);
    setRepoName(json.repo);
    if (
      !json.packageJson.dependencies ||
      !Object.hasOwnProperty.call(json.packageJson, 'dependencies')
    )
      setVisualizing(false);
    setData(json.packageJson);
    setJsonPath(json.jsonPath);
  }

  const onCreateReportData = () => {
    const { nodes, links } = nodeLinksData;

    const info = {
      username,
      repositoryName: repositoryName.current,
    };

    const report = createReport(nodes, links, advisoriesData, info);

    console.log(report);
  };

  const onCreateReport = () => {
    const { nodes, links } = nodeLinksData;

    const info = {
      username,
      repositoryName: repoName,
    };

    const report = createReport(nodes, links, advisoriesData, info);

    console.log(report);

    HttpUtil.post(ROUTE_API.reports, { report: report })
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

  return (
    <div className="container">
      <GlobalStyle />
      <Box mt={2}>
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          mb={2}
        >
          <Box>
            <Typography variant="body1">{username}</Typography>
            <Typography variant="body1">{repoName}</Typography>
            {jsonPath ? (
              <Typography variant="body1">From: {jsonPath}</Typography>
            ) : (
              ''
            )}
          </Box>
          {isVisualizing ? (
            ''
          ) : (
            <CyanButton variant="contained" onClick={onCreateReport}>
              Create Report
            </CyanButton>
          )}
        </Box>
        {isVisualizing ? (
          <Box textAlign="center" mb={5}>
            <Box mb={1}>
              <Typography variant="h6">
                Finding Vulnerabilities ( Level {levelDep} / 4: {nodeRemain}{' '}
                Nodes remaining )
              </Typography>
            </Box>
            <LinearProgress
              variant="buffer"
              value={((levelDep - 0.5) / 4) * 100}
              valueBuffer={(levelDep / 4) * 100}
            />
          </Box>
        ) : (
          ''
        )}

        <div>
          <button onClick={onCreateReportData}>Create report data</button>
        </div>

        <hr />

        <div>
          <Chart
            setAdvisoriesDataData={setAdvisoriesDataData}
            setVisualizing={setVisualizing}
            data={data}
            setNodeLinksData={setNodeLinksData}
            setLevelDep={setLevelDep}
            setNodeRemain={setNodeRemain}
            levelDep={levelDep}
          />
        </div>
      </Box>
    </div>
  );
};

export default Visualization;
