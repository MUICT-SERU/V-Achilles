import * as d3 from 'd3'
import React, { useEffect, useRef, useState } from 'react'

import Node from 'components/Node'

import { queryVulnerability } from 'lib/query'
import { getDependencies } from 'lib/api'

interface Link {
  source: string
  target: string
  version: string
}

enum NODE_TYPE { ROOT, DEP }

const height: number = 1000
const width: number = 1000

const Chart = (props: any) => {
  const [links, setLinks] = useState<Link[]>([])
  const [nodes, setNodes] = useState<any[]>([])

  const [_deps, setDeps] = useState<any[]>([])

  const d3Container = useRef(null)
  // const svgRef = useRef<d3.Selection<null, unknown, null, undefined>>(d3.select(d3Container.current))
  const svgRef = useRef<d3.Selection<null, unknown, HTMLElement, any>>(d3.select('#somewhere'))

  function linkArc(d: any) {
    const r = Math.hypot(d.target.x - d.source.x, d.target.y - d.source.y)
    return `
      M${d.source.x},${d.source.y}
      A${r},${r} 0 0,1 ${d.target.x},${d.target.y}
    `
  }

  async function readPackageJson(json: any) {
    const deps = json.dependencies || {}
    // const devDeps = json.devDependencies || {}
    const devDeps = {}

    const dependencies = Object.assign(deps, devDeps)

    props.setProgress(0)
    let done = 0
    const vulnerabilitiesPromises: Promise<any>[] = Object.keys(dependencies).map((id) => {
        return new Promise(async (resolve: any) => {
          const vulnerability = await queryVulnerability(id)

          const vulnerabilityNodes = vulnerability.data.securityVulnerabilities.nodes
          const firstNode = vulnerabilityNodes.length > 0 ? vulnerabilityNodes[0] : null

          const node = {
            id,
            version: dependencies[id],
            vulnerabilitiesCount: vulnerabilityNodes.length,
            type: NODE_TYPE.DEP,
          }

          props.setProgress(++done / Object.keys(dependencies).length * 100)
          resolve(node)
        })
      })

    const vulnerabilities = await Promise.all(vulnerabilitiesPromises)
    console.log('vulnerabilities', vulnerabilities)

    const _nodes = Array.from(
      new Set(
        [
          ...vulnerabilities,
          { id: json.name, version: json.version || '', vulnerabilitiesCount: 0, type: NODE_TYPE.ROOT },
        ]
      )
    )

    const _links = vulnerabilities.reduce((stack: Link[], next: any) => {
      const link: Link = {
        source: json.name,
        target: next.id,
        version: next.version,
      }

      if (link.source !== link.target) {
        return ([
          ...stack,
          link
        ])
      }

      return stack
    }, [])

    console.log(_nodes)
    console.log(_links)

    setNodes(_nodes)
    setLinks(_links)
    setDeps(dependencies)
  }

  function readFile(file: File) {
    const fileReader = new FileReader()

    fileReader.addEventListener('load', () => {
      let json = {}
      try {
        // eslint-disable-next-line no-mixed-operators
        json = JSON.parse(fileReader && fileReader.result && fileReader?.result?.toString() || '')
        readPackageJson(json)
      } catch (e) {
        console.error(e)
      }
    })

    fileReader.readAsText(file)
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files: FileList | null = e.target.files

    if (files && files[0]) {
      console.log('>>', files[0].name)
      readFile(files[0])
    }
  }

  function renderChart() {
    const simulation: d3.Simulation<any, undefined> = d3.forceSimulation(nodes)
    .force('link', d3.forceLink(links).id((d: any) => d.id))
    .force('charge', d3.forceManyBody().strength(-400))
    .force('x', d3.forceX())
    .force('y', d3.forceY())


    svgRef.current.attr('viewBox', `${[-width / 2, -height / 2, width, height]}`)
        .style('font', '12px sans-serif')

    // Per-type markers, as they don't inherit styles.
    svgRef.current.append('defs')
      .selectAll('marker')
      .data(['test'])
      .join('marker')
        .attr('id', 'arrow')
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 15)
        .attr('refY', -0.5)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('orient', 'auto')
      .append('path')
        .attr('fill', '#ff0')
        .attr('d', 'M0,-5L10,0L0,5')


    // const url = (d: any) => `url(${new URL(`#arrow-${d.type}`, window.location.href)})`
    const url = () => `url(${new URL('#arrow', window.location.href)})`

    const link = svgRef.current.append('g')
        .attr('fill', 'none')
        .attr('stroke-width', 1.5)
      .selectAll('path')
      .data(links)
      .join('path')
        // .attr('stroke', d => color(d.type))
        .attr('stroke','#ff0')
        .attr('marker-end', url)

    const node = svgRef.current.append('g')
        // .attr('fill', '#f00')
        .attr('stroke-linecap', 'round')
        .attr('stroke-linejoin', 'round')
      .selectAll('g')
      .data(nodes)
      .join('g')

    node.append('circle')
        .attr('stroke', (d: any) => {
          if (d.type === NODE_TYPE.ROOT) {
            return '#0ff'
          }
          return '#fff'
        })
        .attr('stroke-width', 1.5)
        .attr('r', 8)
        // .attr('fill', d => color(d.id))
        .attr('fill', (d: any) => {
          if (d.type === NODE_TYPE.ROOT) {
            return '#f0f'
          }
          if (d.vulnerabilitiesCount > 0) {
            return '#fbb'
          }
          return '#ccc'
        })

    node.append('text')
        // .text('😀')
        .text((d: any) => {
          if (d.type === NODE_TYPE.ROOT) {
            return ''
          }
          if (d.vulnerabilitiesCount > 0) {
            return '😡'
          }
          return '😀'
        })
        .attr('x', '-6px')
        .attr('y', '4.5px')

    node.append('text')
        .attr('x', 8)
        .attr('y', '0.31em')
        .text(d => d.id)
        .attr('fill', '#fff')
      .clone(true).lower()
        .attr('fill', 'none')

    // node.call((
    //   selection: d3.Selection<Element | d3.EnterElement | Document | Window | SVGGElement | null, any, SVGGElement, unknown>) =>
    //     drag(selection, simulation)
    //   )

    simulation.on('tick', () => {
      link.attr('d', linkArc)
      node.attr('transform', d => `translate(${d.x},${d.y})`)
    })
  }

  async function checkDeepNodes() {
    console.log('start deep node')

    const _nodesName: any[] = []
    let _nodes: any[] = []
    let _links: any[] = []

    // ===============================
    async function checkDepsOnNode(id: string) {
      const result = await getDependencies(id)
      // console.log(d3.node)

      const version = result.data['dist-tags'].latest

      const depInfo = result.data.versions[version]
      const dependencies = depInfo.dependencies

      console.log('id ---', id)

      const _nodes: any[] = []
      const _links: any[] = []

      if (dependencies === undefined) {
        return {
          nodes: _nodes,
          links: _links,
        }
      }

      const dependenciesArr = Object.keys(dependencies)

      dependenciesArr.forEach((dep) => {
        const node = {
          id: dep,
          version: 'dependencies[id]',
          vulnerabilitiesCount: 0,
          type: NODE_TYPE.DEP,
        }

        const link: Link = {
          source: id,
          target: dep,
          version: 'dependencies[id]',
        }

        if (_nodesName.indexOf(dep) < 0) {
          _nodes.push(node)
          _nodesName.push(dep)
        }

        _links.push(link)

        console.log(id, '->', dep)
      })


      return {
        nodes: _nodes,
        links: _links,
      }
    }

    // ==============================

    // const promises = Object.keys(_deps)
    const promises = nodes
      .map((node) => new Promise(
        async (resolve) => {
          if (node.vulnerabilitiesCount > 0) {
            resolve(null)
            return;
          }

          try {
            const data = await checkDepsOnNode(node.id)
            _nodes = _nodes.concat(data?.nodes)
            _links = _links.concat(data?.links)

            resolve(null)
          } catch (e) {
            resolve(null)
          }
        }
      ))

    await Promise.all(promises)

    const newNodes = Array.from(
      new Set(
        [
          ...nodes,
          ..._nodes,
        ]
      )
    )

    setNodes(newNodes)
    setLinks(Array.from(
      new Set(
        [
          ...links,
          ..._links,
        ]
      )
    ))
  }

  function setupD3() {
    // svgRef.current = d3.select(d3Container.current)
    svgRef.current = d3.select('#d3-container')
    svgRef.current.attr('viewBox', `${[-width / 2, -height / 2, width, height]}`)
        .style('font', '12px sans-serif')
    renderChart()
  }

  useEffect(() => {
    setupD3()
  }, [])

  useEffect(() => {
    renderChart()

    return () => {
      // svgRef.current.exit().remove()
      d3.selectAll('#d3-container > *').remove()
    }
  }, [links])

  useEffect(() => {
    console.log('--nodes--', nodes)
  }, [nodes])

  useEffect(() => {
    console.log('_deps', _deps)
    checkDeepNodes()
  }, [_deps])

  return (
    <>
      <input onChange={handleFileChange} type="file"/>
      <svg id="d3-container" ref={d3Container}>
        {/* <Node/> */}
      </svg>
    </>
  )
}

export default Chart
