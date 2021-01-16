import * as d3 from 'd3'
import React, { useEffect, useRef, useState } from 'react'

import Node from 'components/Node'
import Link from 'components/Link'

import { queryVulnerability } from 'lib/query'
import { getDependencies } from 'lib/api'

import { NODE_TYPE, NODE_STATUS } from 'types/index'

const height: number = 600
const width: number = 600

let i = 3

const mockNodesData: INode[] = [
  { id: 1, type: NODE_TYPE.ROOT, status: NODE_STATUS.CLEAN, version: '', level: 0  },
  { id: 2, type: NODE_TYPE.DEPENDENCY, status: NODE_STATUS.CLEAN, version: '', level: 1  },
  { id: 3, type: NODE_TYPE.DEPENDENCY, status: NODE_STATUS.CLEAN, version: '', level: 1  },
]

const Chart = (props: any) => {
  const d3ContainerRef = useRef(null)
  const svgRef = useRef(null)
  let ref = useRef<d3.Selection<null, unknown, null, undefined>>(d3.select(svgRef.current))

  const simulation = useRef<any>(null)
  const zoom = useRef<any>()
  const nodeInput = useRef<any>()

  const [nodesData, setNodesData] = useState<INode[]>(mockNodesData)
  const [linksData, setLinksData] = useState<ILink[]>( [{ source: 2, target: 1 }, { source: 3, target: 1 }] )
  const [depData, setDepData] = useState<any>([])

  const [nodes, setNodes] = useState<any>()
  const [links, setLinks] = useState<any>()
  // const [nodeInput, setNodeInput] = useState<any>(1)

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
  }, [depData])

  // Data change
  function updateData(data: any) {
    if (data) {
      analyzePackageJson(data)
    }
  }
  // Create D3 element
  // function createNode(packageName: any, version: any) {
  //   return {
  //     id: packageName,
  //     version,
  //   }
  // }
  // function createLink(packageName: any, targetNode = 1) {
  //   return {
  //     source: packageName,
  //     target: targetNode,
  //   }
  // }

  async function animate() {
    const ADD_NODE_SPEED = 1000

    // Gently add node/link
    function gentlyAddNodeLink(dependency: any) {
      return new Promise((resolve) => {
        setTimeout(() => {
          // Add Node
          // nodes.push(createNode(dependency, dependencies[dependency]))
          // Add Link
          // links.push(createLink(dependency))
          addNodeLink(dependency)
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
      _data.push(dependency)
    }

    setDepData(_data)
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
    setNodesData([...nodesData, source])
    setLinksData([...linksData, { source: source.id, target: target }])
  }

  function createNodeData(id: string | number = ++i, version = '*', level = 1, type= NODE_TYPE.DEPENDENCY, status = NODE_STATUS.CLEAN): INode {
    return ({ id: `${id}@${version}`, version, level, type, status })
  }

  function onAddNode() {
    addNodeLink(createNodeData())
  }

  function onAddNodeInput() {
    let input = Number(nodeInput.current.value)

    if (Number.isNaN(input)) {
      input = nodeInput.current.value
    }

    addNodeLink(createNodeData(), input)
  }

  return (
    <div ref={d3ContainerRef} style={{ overflow: 'hidden' }}>
      <button onClick={onReset}>Reset</button>
      <button onClick={onAddNode}>Add</button>

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
