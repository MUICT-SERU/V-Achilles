import * as d3 from 'd3';
import { useEffect, useRef, useState } from 'react';
import { Box, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ZoomOutMapIcon from '@material-ui/icons/ZoomOutMap';

import Node from 'components/Chart/Node';
import Link from 'components/Chart/Link';
import Tooltip from 'components/Chart/Tooltip';
import { CyanButton } from 'components/CustomButton';

import { queryVulnerability } from 'lib/query';
import { getDependencies } from 'lib/api';
import { filterRelatedVulnerabilities } from 'lib/vulnerability';

import { NODE_TYPE, NODE_STATUS } from 'types/index';

const height: number = 600;
const width: number = 600;

let nodeCount = 3;

const mockNodesData: INode[] = [
  {
    id: 'PROJECT',
    name: 'PROJECT',
    type: NODE_TYPE.ROOT,
    status: NODE_STATUS.CLEAN,
    version: '',
    level: 0,
  },
];

const mockLinksData: ILink[] = [];

const useStyles = makeStyles((theme) => ({
  zoomOutIcon: {
    marginRight: theme.spacing(1.5),
  },
}));

const Chart = (props: any) => {
  const classes = useStyles();
  const d3ContainerRef = useRef(null);
  const svgRef = useRef<any>(null);
  let ref = useRef<d3.Selection<null, unknown, null, undefined>>(
    d3.select(svgRef.current)
  );

  const simulation = useRef<any>(null);
  const zoom = useRef<any>();
  // const nodeInput = useRef<any>();
  // const nodeLevelLimitInput = useRef<any>();

  const [nodesData, setNodesData] = useState<INode[]>(mockNodesData);
  const [linksData, setLinksData] = useState<ILink[]>(mockLinksData);
  const [depData, setDepData] = useState<any>([]);
  const [nodeLevel, setNodeLevel] = useState<number>(1);
  const nodeLevelLimit = 4;
  // const [nodeLevelLimit, setNodeLevelLimit] = useState<number>(4);
  const [
    isVulnerabilityCheckDone,
    setVulnerabilityCheckDone,
  ] = useState<boolean>(false);

  const [nodes, setNodes] = useState<any>();
  const [links, setLinks] = useState<any>();
  const [advisoriesData, setAdvisoriesData] = useState<{
    [key: string]: ISecurityVulnerability[];
  }>({});
  const [tooltipData, setTooltipData] = useState<ITooltipData | null>(null);
  const [tooltipVisibility, setTooltipVisibility] = useState<boolean>(false);

  const isDone = useRef<boolean>(true);
  // const interval = useRef<any>(null);

  useEffect(() => {
    setupZoom();
    setupD3();
    setupMarker();
  }, []);

  useEffect(() => {
    setupForceSimulation(nodesData, linksData);
    // Update node link data for create a report
    props.setNodeLinksData({ nodes: nodesData, links: linksData });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodesData, linksData]);

  useEffect(() => {
    tick(simulation.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes, links]);

  // =======================================
  // ---- Update data when props.data change
  // =======================================
  useEffect(() => {
    updateData(props.data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.data]);

  useEffect(() => {
    if (depData.length > 0) {
      props.setNodeRemain(depData.length - 1);
      console.log('Nodes remaining:', depData.length - 1);
      console.log('Interation status:', isDone.current);
      console.log('----------');
      animate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [depData]);

  // =============================
  // ----
  // =============================
  useEffect(() => {
    // When the level node is running out
    if (depData.length <= 0 && !isDone.current) {
      console.log('Continue on next level', nodeLevel, '/', nodeLevelLimit);

      // Check vulnerability and fetch next level
      (async () => {
        await checkVulnerability();
        setVulnerabilityCheckDone(true);
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [depData, nodeLevel]);

  useEffect(() => {
    // When the level node is running out
    if (depData.length <= 0 && !isDone.current && isVulnerabilityCheckDone) {
      console.log('Continue on next level', nodeLevel, '/', nodeLevelLimit);

      // Check vulnerability and fetch next level
      (async () => {
        await fetchChildrenNodes();
        setVulnerabilityCheckDone(false);
      })();

      // Stop fetching next level when the next level reach limit
      if (nodeLevel >= nodeLevelLimit) {
        console.log('set isDone.current = true');
        isDone.current = true;
      }
    }

    if (isDone.current && depData.length <= 0) {
      props.setAdvisoriesDataData(advisoriesData);
      console.log('isDone.current', isDone.current);
      console.log(linksData);
      if (nodeLevel > nodeLevelLimit) props.setVisualizing(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [depData, nodeLevel, isVulnerabilityCheckDone]);

  // =============================
  // ---- Data change
  // =============================
  function updateData(data: any) {
    if (data) {
      analyzePackageJson(data);
    }
  }

  async function animate() {
    const ADD_NODE_SPEED = 50;

    // Gently add node/link
    function gentlyAddNodeLink(dependency: any) {
      return new Promise((resolve) => {
        const node = createNodeData(
          dependency.node.id,
          dependency.node.version,
          dependency.node.level
        );
        // if (isNodeExists(node)) {
        //   return resolve(null)
        // }

        setTimeout(() => {
          addNodeLink(node, dependency.link.id);
          resolve(null);
        }, ADD_NODE_SPEED);
      });
    }

    const _depData = depData;
    const newDepData = _depData.splice(1);

    await gentlyAddNodeLink(_depData[0]);
    setDepData(newDepData);
  }

  // Analyze package.json
  async function analyzePackageJson(json: any) {
    const dependencies: any = json.dependencies || {};

    const _data: any[] = [];

    for (const dependency in dependencies) {
      _data.push({
        node: {
          id: dependency,
          version: dependencies[dependency],
          level: nodeLevel,
        },
        link: {
          id: 'PROJECT',
        },
      });
    }

    setDepData(_data);

    if (Object.keys(dependencies).length > 0) {
      setNodeLevel(nodeLevel + 1);
      isDone.current = false;
    }
  }

  // --------------------------------------------------------
  // ======== Setup D3
  // --------------------------------------------------------
  function setupZoom() {
    zoom.current = d3.zoom<any, any>();
  }

  function setupD3() {
    ref.current = d3
      .select(svgRef.current)
      .attr('viewBox', `${[-width / 2, -height / 2, width, height]}`)
      .style('font', '12px sans-serif');

    ref.current.call(
      zoom.current.on('zoom', (event: any) => {
        ref.current.select('g').attr('transform', event.transform);
      })
    );

    setNodesData(mockNodesData);
    setLinksData(mockLinksData);
  }

  function onReset() {
    ref.current
      .transition()
      .duration(500)
      .call(zoom.current.transform, d3.zoomIdentity);
  }

  // Force Simulation
  function setupForceSimulation(_nodes: any, _links: any) {
    simulation.current = d3
      .forceSimulation(_nodes)
      .force('charge', d3.forceManyBody().strength(-300))
      .force(
        'link',
        d3.forceLink(_links).id((d: any) => d.id)
      )
      .force('x', d3.forceX())
      .force('y', d3.forceY());
  }

  function tick(simulation: any) {
    simulation &&
      simulation.on('tick', () => {
        nodes &&
          nodes.attr &&
          nodes.attr('transform', (d: any) => {
            return `translate(${d.x}, ${d.y})`;
          });
        links && links.attr && links.attr('d', linkPos);
      });
  }

  function linkPos(d: any) {
    return `
      M${d.source.x},${d.source.y}
      L ${d.target.x},${d.target.y}
    `;
  }

  // Setup Elements
  // Setup defs markers
  function setupMarker() {
    ref.current
      .append('defs')
      .append('marker')
      .attr('id', 'arrow-head')
      .attr('viewBox', '-4 -4 10 10')
      .attr('refX', '-4')
      .attr('refY', '0')
      .attr('orient', 'auto')
      .attr('markerWidth', '10')
      .attr('markerHeight', '10')
      .attr('xoverflow', 'visible')
      .append('svg:path')
      .attr('d', 'M 4,-2 L 0 ,0 L 4,2')
      .attr('fill', '#fff');
    // .attr('stroke', '#fff')
  }

  function addNodeLink(source: INode, target: string | number = 'PROJECT') {
    addNodeData(source);
    addLinkData(createLinkData(source, target));
  }

  // --------------------------------
  // ====== Create Node / Link data
  // --------------------------------

  function createNodeData(
    id: string | number = ++nodeCount,
    version = '*',
    level = 1,
    type = NODE_TYPE.DEPENDENCY,
    status = NODE_STATUS.CLEAN
  ): INode {
    return {
      id: `${id}@${version}`,
      name: id.toString(),
      version,
      level,
      type,
      status,
    };
  }

  function createLinkData(
    source: INode,
    target: string | number = 'PROJECT',
    level = 1
  ): ILink {
    return { source: source.id, target, level };
  }

  // --------------------------------
  // ====== Manipulate Nodes / Links
  // --------------------------------

  function isNodeExists(node: INode) {
    // Check exists
    for (let i = 0; i < nodesData.length; i++) {
      if (nodesData[i].id === node.id) return true;
    }

    return false;
  }

  function addNodeData(node: INode) {
    if (!isNodeExists(node)) setNodesData([...nodesData, node]);
  }

  function addLinkData(link: ILink) {
    setLinksData([...linksData, link]);
  }

  // ---------------------------------
  // ======== Handle event
  // ---------------------------------

  // function onAddNodeLink() {
  //   addNodeLink(createNodeData());
  // }

  // function onAddNodeInput() {
  //   let input = Number(nodeInput.current.value);

  //   if (Number.isNaN(input)) {
  //     input = nodeInput.current.value;
  //   }

  //   addNodeLink(createNodeData(), input);
  // }

  // -----------------------------
  // ======== Tooltip
  // -----------------------------

  function onMouseOverNode(event: any, d: any) {
    const svgStyle = svgRef.current!.style;
    const topAwayOffet = 10;
    const leftAwayOffet = 10;

    if (document !== null) {
      const tooltipEl = document.querySelector('#tooltip')! as HTMLDivElement;
      if (tooltipEl) {
        tooltipEl.style.left = `${
          event.offsetX - svgStyle.width / 2 + topAwayOffet
        }px`;
        tooltipEl.style.top = `${
          event.offsetY - svgStyle.height / 2 + leftAwayOffet
        }px`;
        setTooltipVisibility(true);
      }
      if (advisoriesData[d.id]) {
        setTooltipData({
          node: d,
          advisory: filterRelatedVulnerabilities(d, advisoriesData[d.id]),
        });
      } else {
        setTooltipData({
          node: d,
          advisory: [],
        });
      }
    }
  }

  // -----------------------------
  // ======== Check vulnerability
  // -----------------------------

  async function checkVulnerability() {
    const checkNodes = nodesData.filter((node) => node.level === nodeLevel - 1);

    const _advisoriesData = {};

    const promises: Promise<ICheckVulnerabilityResolve>[] = [];
    checkNodes.forEach(async (node) => {
      promises.push(
        new Promise(async (resolve) => {
          const result: IQueryVulnerabilityResponse = await queryVulnerability(
            node.name
          );

          Object.assign(_advisoriesData, {
            [node.id]: result.data.securityVulnerabilities.nodes,
          });

          resolve({
            result,
            node,
          });
        })
      );
    });

    const result = await Promise.all(promises);
    setAdvisoriesData({
      ...advisoriesData,
      ..._advisoriesData,
    });

    // --------------------------------
    // ======= Identify vulerable node
    // --------------------------------
    let vulnerableNodes: INode[] = [];
    let vulnerableNodesName: any = {};

    vulnerableNodes = result.map((item) => {
      const nodes = filterRelatedVulnerabilities(
        item.node,
        item.result.data.securityVulnerabilities.nodes
      );
      if (nodes.length > 0) {
        const node = {
          ...item.node,
          status: NODE_STATUS.VULNERABLE,
        };

        Object.assign(vulnerableNodesName, { [item.node.id]: node });
        return node;
      }

      return item.node;
    });

    // ------------------------------
    // ======== Update Node info
    // ------------------------------
    setNodesData([
      ...nodesData.filter((node) => node.level !== nodeLevel - 1),
      ...vulnerableNodes,
    ]);
    setLinksData(
      linksData.map((link: ILink) => {
        if (vulnerableNodesName[link.source.id.toString()]) {
          return Object.assign(
            {},
            {
              ...link,
              source: vulnerableNodesName[link.source.id.toString()],
            }
          );
        }

        return Object.assign({}, { ...link });
      })
    );

    setVulnerabilityCheckDone(true);
  }

  // ------------------------
  // ======== Deeper nodes
  // ------------------------

  async function getDistDependencies(node: INode) {
    const childrenDependencies = await getDependencies(node.name.toString());
    const data = childrenDependencies.data;

    const currentVersion = data['dist-tags']['latest'];
    const packageInfo = data['versions'][currentVersion];
    const dependencies = packageInfo.dependencies;

    console.log('childrenDependencies of', node.name);
    console.log(dependencies);

    const _dependencies: any[] = [];

    if (dependencies) {
      for (const dependency in dependencies) {
        _dependencies.push({
          node: {
            id: dependency,
            version: dependencies[dependency],
            level: nodeLevel,
          },
          link: {
            id: node.id,
          },
        });
      }
    }

    return _dependencies;
  }

  // ==========================
  // === Fetch next level nodes
  // ==========================
  async function fetchChildrenNodes() {
    const _nodesData = nodesData;

    let _depData: any = [];

    for (let i = 0; i < _nodesData.length; i++) {
      try {
        const node = _nodesData[i];
        // Node type need to be DEPENDENCY
        // need to be current level only
        // Node status need to be CLEAN
        if (
          node.type === NODE_TYPE.DEPENDENCY &&
          node.level === nodeLevel - 1 &&
          node.status === NODE_STATUS.CLEAN
        ) {
          const _dependencies = await getDistDependencies(_nodesData[i]);

          _depData = _depData.concat(_dependencies);
        }
      } catch (e) {
        console.log(e);
      }
    }

    if (props.levelDep !== nodeLevel) props.setLevelDep(nodeLevel);
    console.log('Level:' + nodeLevel + '/' + nodeLevelLimit);

    setDepData(_depData);
    setNodeLevel(nodeLevel + 1);
    return _depData.length;
  }

  // function onClearButtonClick() {
  //   setNodesData(mockNodesData);
  //   setLinksData(mockLinksData);
  //   setNodeLevel(1);
  // }

  // function onSetLimitClick() {
  //   const newNodeLimit = nodeLevelLimitInput.current.value;
  //   setNodeLevelLimit(newNodeLimit);
  //   updateData(props.data);
  // }

  // -----------------------------
  // ======== Render
  // -----------------------------

  return (
    <div ref={d3ContainerRef} style={{ overflow: 'hidden' }}>
      <Box my={1}>
        <CyanButton variant="contained" onClick={onReset}>
          <ZoomOutMapIcon fontSize="small" className={classes.zoomOutIcon} />
          <Typography variant="body1">View full Graph</Typography>
        </CyanButton>
      </Box>

      {/* <div>
        <button onClick={onReset}>Reset</button>
        <button onClick={onAddNodeLink}>Add</button>

        <input type="text" ref={nodeInput} />
        <button onClick={onAddNodeInput}>Add</button>
      </div>

      <div>
        <input type="number" ref={nodeLevelLimitInput} defaultValue={Number(nodeLevelLimit)}/>
        <button onClick={onSetLimitClick}>Set limit</button>
        <button onClick={onClearButtonClick}>Clear</button>
      </div> */}

      <div style={{ position: 'relative', overflow: 'auto' }}>
        <Tooltip
          data={tooltipData}
          show={tooltipVisibility}
          setShow={setTooltipVisibility}
        />

        <svg ref={svgRef} width="100%" height="100%">
          <rect fill="#333" width="100%" height="100%" x="-50%" y="-50%" />
          <g>
            {simulation.current ? (
              <>
                <Link
                  setLinks={setLinks}
                  data={linksData}
                  simulation={simulation.current}
                />
                <Node
                  setNodes={setNodes}
                  data={nodesData}
                  onMouseOver={onMouseOverNode}
                  simulation={simulation.current}
                />
              </>
            ) : (
              <text fill="#fff">Generating...</text>
            )}
          </g>
        </svg>
      </div>
    </div>
  );
};

export default Chart;
