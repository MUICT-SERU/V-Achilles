import * as d3 from 'd3'
import React, { useEffect, useRef, useState, useMemo } from 'react'

import Node from 'components/Node'
import Link from 'components/Link'

import { queryVulnerability } from 'lib/query'
import { getDependencies } from 'lib/api'

import { NODE_TYPE, NODE_STATUS } from 'types/index'

const height: number = 600
const width: number = 600

let nodeCount = 3

const mockNodesData: INode[] = [
  { id: 'PROJECT', name: 'PROJECT', type: NODE_TYPE.ROOT, status: NODE_STATUS.CLEAN, version: '', level: 0  },
  // { id: 1, name: '1', type: NODE_TYPE.DEPENDENCY, status: NODE_STATUS.CLEAN, version: '', level: 1  },
  // { id: 2, name: '2', type: NODE_TYPE.DEPENDENCY, status: NODE_STATUS.CLEAN, version: '', level: 1  },
  // { id: 3, name: '3', type: NODE_TYPE.DEPENDENCY, status: NODE_STATUS.CLEAN, version: '', level: 2  },
]

const mockLinksData: ILink[] = [
  // { source: 1, target: 'PROJECT', level: 1 },
  // { source: 2, target: 'PROJECT', level: 1 },
  // { source: 3, target: 1, level: 1 },
]

const Chart = (props: any) => {
  const d3ContainerRef = useRef(null)
  const svgRef = useRef(null)
  let ref = useRef<d3.Selection<null, unknown, null, undefined>>(d3.select(svgRef.current))

  const simulation = useRef<any>(null)
  const zoom = useRef<any>()
  const nodeInput = useRef<any>()

  const [nodesData, setNodesData] = useState<INode[]>(mockNodesData)
  const [linksData, setLinksData] = useState<ILink[]>(mockLinksData)
  const [depData, setDepData] = useState<any>([])
  const [nodeLevel, setNodeLevel] = useState<number>(1)

  const [nodes, setNodes] = useState<any>()
  const [links, setLinks] = useState<any>()
  // const [nodeInput, setNodeInput] = useState<any>(1)

  const isDone = useRef(true)

  const interval = useRef<any>(null)

  useEffect(() => {
    setupForceSimulation(nodesData, linksData)
  }, [nodesData, linksData])

  useEffect(() => {
    tick(simulation.current)
  }, [nodes, links])

  useEffect(() => {
    setupZoom()
    setupD3()
    setupMarker()
    console.log('useffect')
  }, [])

  useEffect(() => {
    updateData(props.data)
  }, [props.data])

  useEffect(() => {
    console.log('depData.length', depData.length)
    if (depData.length > 0) {
      animate()
    }

    console.log('Here', isDone.current)
    if (depData.length <= 0 && !isDone.current) {
      console.log('in 1')
      fetchChildrenNodes()
    }
  }, [depData])

  // Data change
  function updateData(data: any) {
    if (data) {
      analyzePackageJson(data)
    }
  }

  async function animate() {
    const ADD_NODE_SPEED = 250

    // Gently add node/link
    function gentlyAddNodeLink(dependency: any) {
      return new Promise((resolve) => {
        const node = createNodeData(dependency.node.id, dependency.node.version, dependency.node.level)
        // if (isNodeExists(node)) {
        //   return resolve(null)
        // }

        setTimeout(() => {

          addNodeLink(node, dependency.link.id)
          resolve(null)
        }, ADD_NODE_SPEED)
      })
    }

    const _depData = depData
    const newDepData = _depData.splice(1)

    await gentlyAddNodeLink(_depData[0])
    setDepData(newDepData)
  }

  // Analyze package.json
  async function analyzePackageJson(json: any) {
    const dependencies = json.dependencies || {}

    // Set loading progress to 0
    // props.setProgress(0)
    let _progress = 0

    const _data = []

    for (const dependency in dependencies) {
      _data.push({
        node: {
          id: dependency,
          version: dependencies[dependency],
          level: nodeLevel,
        },
        link: {
          id: 'PROJECT'
        },
      })
    }

    setDepData(_data)
    console.log('nodeLevel + 1', nodeLevel + 1)

    if (Object.keys(dependencies).length > 0) {
      setNodeLevel(nodeLevel + 1)
      isDone.current = false
    }
  }

  // --------------------------------------------------------
  // --------------------------------------------------------

  // useEffect(() => {
  //   interval.current = setInterval(() => {
  //     const next = ++i
  //     setNodes([...nodes, { id: next }])
  //     setLinks([...links, { source: next, target: 1 },])
  //   }, 2000)

  //   return () => {
  //     clearInterval(interval.current)
  //   }
  // }, [nodes, links])

  // --------------------------------------------------------
  // ======== Setup D3
  // --------------------------------------------------------

  function setupZoom() {
    zoom.current = d3.zoom<any, any>()
  }

  function setupD3() {
    ref.current = d3.select(svgRef.current)
      .attr('viewBox', `${[-width / 2, -height / 2, width, height]}`)
      .style('font', '12px sans-serif')

    ref.current
      .call(
        zoom.current
          .on('zoom', (event: any) => {
            ref.current
              .select('g')
              .attr('transform', event.transform)
          })
      )
  }

  function onReset() {
    ref.current
      .transition()
      .duration(500)
      .call(zoom.current.transform, d3.zoomIdentity)
  }

  // Force Simulation
  function setupForceSimulation(_nodes: any, _links: any) {
    simulation.current = d3.forceSimulation(_nodes)
      .force('charge', d3.forceManyBody().strength(-300))
      .force('link', d3.forceLink(_links).id((d: any) => d.id))
      .force('x', d3.forceX())
      .force('y', d3.forceY())
  }

  function tick(simulation: any) {
    simulation && simulation.on('tick', () => {
      nodes && nodes.attr &&  nodes
        .attr('transform', (d: any) => {
          return `translate(${d.x}, ${d.y})`
        })
      links && links.attr && links
        .attr('d', linkPos)
    })
  }

  function linkPos(d: any) {
    return `
      M${d.source.x},${d.source.y}
      L ${d.target.x},${d.target.y}
    `
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
        .attr('fill', '#fff')
        // .attr('stroke', '#fff')
  }

  function addNodeLink(source: INode, target: string | number = 1) {
    addNodeData(source)
    addLinkData(createLinkData(source, target))
  }

  // --------------------------------
  // ====== Create Node / Link data
  // --------------------------------

  function createNodeData(id: string | number = ++nodeCount, version = '*', level = 1, type= NODE_TYPE.DEPENDENCY, status = NODE_STATUS.CLEAN): INode {
    return ({ id: `${id}@${version}`, name: id.toString(), version, level, type, status })
  }

  function createLinkData(source: INode, target: string | number = 'PROJECT', level = 1): ILink {
    return ({ source: source.id, target, level })
  }

  // --------------------------------
  // ====== Manipulate Nodes / Links
  // --------------------------------

  function isNodeExists(node: INode) {
    // Check exists
    for(let i = 0; i < nodesData.length; i++) {
      if (nodesData[i].id === node.id) return true;
    }

    return false
  }

  function addNodeData(node: INode) {
    if (!isNodeExists(node))
      setNodesData([...nodesData, node])
  }

  function addLinkData(link: ILink) {
    setLinksData([...linksData, link])
  }

  // ---------------------------------
  // ======== Handle event
  // ---------------------------------

  function onAddNodeLink() {
    addNodeLink(createNodeData())
  }

  function onAddNodeInput() {
    let input = Number(nodeInput.current.value)

    if (Number.isNaN(input)) {
      input = nodeInput.current.value
    }

    addNodeLink(createNodeData(), input)
  }

    // --------------------------------------------------------
    // ======== Deeper nodes
    // --------------------------------------------------------

  async function getDistDependencies(node: INode) {
    const childrenDependencies = await getDependencies(node.name.toString())
    console.log('childrenDependencies of', node.name)
    console.log(childrenDependencies)

    const data = childrenDependencies.data

    const currentVersion = data['dist-tags']['latest']
    const packageInfo = data['versions'][currentVersion]
    const dependencies = packageInfo.dependencies

    console.log(dependencies)
    const _dependencies = []

    if (dependencies) {
      for (const dependency in dependencies) {
        _dependencies.push({
          node: {
            id: dependency,
            version: dependencies[dependency],
            level: nodeLevel,
          },
          link: {
            id: node.id
          }
        })
      }
    }

    return _dependencies
  }

  async function fetchChildrenNodes() {
    const _nodesData = nodesData

    let _depData: any = []

    for (let i = 0; i < _nodesData.length; i++) {
      try {
        const node = _nodesData[i]
        if (node.type === NODE_TYPE.DEPENDENCY && node.level === nodeLevel - 1) {
          const _dependencies = await getDistDependencies(_nodesData[i])

          _depData = _depData.concat(_dependencies)
        }
      } catch (e) {
        console.log(e)
      }
    }

    setDepData(_depData)
    setNodeLevel(nodeLevel + 1)

    if (nodeLevel === 4) {
      isDone.current = true
    }
  }

    // -----------------------------
    // ======== Render
    // -----------------------------

  return (
    <div ref={d3ContainerRef} style={{ overflow: 'hidden' }}>
      <button onClick={onReset}>Reset</button>
      <button onClick={onAddNodeLink}>Add</button>

      {/* <input type="number" onChange={onNodeInputChange} value={nodeInput}/> */}
      <input type="text" ref={nodeInput}/>
      <button onClick={onAddNodeInput}>Add</button>

      <svg ref={svgRef} width="100%" height="100%">
        <rect fill="#333" width="100%" height="100%" x="-50%" y="-50%"/>
        <g>
          {
            simulation.current ? (
              <>
                <Link setLinks={setLinks} data={linksData} simulation={simulation.current}/>
                <Node setNodes={setNodes} data={nodesData} simulation={simulation.current}/>
              </>
            ) : (
              <text fill="#fff">Generating...</text>
            )
          }
        </g>
      </svg>
    </div>
  )
}

export default Chart
