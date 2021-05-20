import React, { useEffect, useState } from 'react';
import { Box, Typography, LinearProgress } from '@material-ui/core';
import { createGlobalStyle } from 'styled-components';

import CircularProgress from '@material-ui/core/CircularProgress';

import Chart from 'components/Chart';
import { CyanButton } from 'components/CustomButton';

import HttpUtil from 'utils/http-util';
import { ROUTE_API, ROUTE_PATH } from 'utils/route-util';
import { createReport } from 'utils/visualization-util';
import splitDependency from 'utils/splitDependency';

import { githubAuth, queryCwes } from 'lib/query';
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
  const [isCreatingReport, setCreatingReport] = useState(false);

  const [nodeLinksData, setNodeLinksData] = useState<INodeLinksData>({
    nodes: [],
    links: [],
  });
  const [advisoriesData, setAdvisoriesDataData] = useState<IAdvisoriesData>({});
  const [data, setData] = useState({});

  const { goTo } = useRouter();

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

    // console.log(json);
    setRepoName(json.repo);
    if (
      !json.packageJson.dependencies ||
      !Object.hasOwnProperty.call(json.packageJson, 'dependencies')
    )
      setVisualizing(false);
    setData(json.packageJson);
    setJsonPath(json.jsonPath);
  }

  const onCreateReport = async () => {
    setCreatingReport(true);

    const { nodes, links } = nodeLinksData;

    const info = {
      username,
      jsonPath,
      repositoryName: repoName,
    };

    const report = createReport(nodes, links, advisoriesData, info);

    await Promise.all(
      report.items.map(async (item) => {
        let {
          depName: directDepName,
          depVersion: directDepCurrentVersion,
        } = splitDependency(item.direct_dependency_name);

        // Encode direct dependency name to HTML URI Component
        directDepName = encodeURIComponent(directDepName);

        const response = await HttpUtil.get(
          `${ROUTE_API.latestVersion}?data=${directDepName}`
        );
        const directDepLatestVersion = response.data.latest_version;

        item.direct_dependency = {
          name: directDepName,
          current_version: directDepCurrentVersion,
          latest_version: directDepLatestVersion,
        };

        const identifiers = item.advisory?.identifiers ?? [];
        await Promise.all(
          identifiers.map(async (identifier) => {
            if (identifier.type === 'GHSA') {
              const cwe: ICWE[] = await queryCwes(identifier.value);
              if (cwe.length > 0) {
                cwe.forEach((cweValue) => {
                  item.cwes.push({
                    cweId: cweValue.cweId,
                    name: cweValue.name,
                    link: `https://cwe.mitre.org/data/definitions/${
                      cweValue.cweId.split('-')[1]
                    }.html`,
                  });
                });
              }
            }
          })
        );
      })
    );

    // console.log('report', report);

    HttpUtil.post(ROUTE_API.reports, { report })
      .then((response) => {
        const reportId = response.data.reportId;
        setCreatingReport(false);
        goTo(`${ROUTE_PATH.reportDetailNoParam}/${reportId}`)();
      })
      .catch((err) => {
        console.log(err);
        setCreatingReport(false);
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
            {jsonPath && (
              <Typography variant="body1">From: {jsonPath}</Typography>
            )}
          </Box>
          {!isVisualizing && (
            <CyanButton
              variant="contained"
              onClick={isCreatingReport ? () => {} : onCreateReport}
            >
              {isCreatingReport ? (
                <CircularProgress color="inherit" size={25} />
              ) : (
                'Create Report'
              )}
            </CyanButton>
          )}
        </Box>
        {isVisualizing && (
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
        )}

        <hr />

        <div>
          <Chart
            data={data}
            levelDep={levelDep}
            setAdvisoriesDataData={setAdvisoriesDataData}
            setVisualizing={setVisualizing}
            setNodeLinksData={setNodeLinksData}
            setLevelDep={setLevelDep}
            setNodeRemain={setNodeRemain}
          />
        </div>
      </Box>
    </div>
  );
};

export default Visualization;
