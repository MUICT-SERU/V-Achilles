import React, { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'

import { client } from './lib/gql'
import { gql } from '@apollo/client'

interface Link {
  source: string
  target: string
  version: string
}

enum NODE_TYPE { ROOT, DEP }

const height: number = 300
const width: number = 300


const Loading = (props: any) => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    setProgress(props.progress)
  }, [props.progress])

  return (
    <div>
      <p>{progress.toFixed(2)}%</p>
      <div style={{ width: '100%', height: '40px', position: 'relative' }}>
        <div style={{ width: progress + '%', height: '100%', background: '#0ff', transition: 'all ease 1s' }}/>
      </div>
    </div>
  )
}


function App() {
  const [links, setLinks] = useState<Link[]>([])
  const [nodes, setNodes] = useState<any[]>([])
  const [progress, setProgress] = useState<number>(0)
  const [username, setUsername] = useState<string>('')

  const svgRef = useRef<d3.Selection<d3.BaseType, unknown, HTMLElement, any>>(d3.select('#somewhere'))

  useEffect(() => {
    svgRef.current = d3.select('#chart')
    renderChart()
    console.log('use effect')

    return (() => {
      d3.selectAll('#chart > *').remove()
    })
  }, [links])

  async function testGithubAuth() {
    const gqlResult = await client.query({
      query: gql`
        query {
          viewer {
            login
          }
        }
      `
    })

    console.log(gqlResult)
    setUsername(gqlResult.data.viewer.login)
  }

  useEffect(() => {
    testGithubAuth()
  }, [])

  // Functions

  async function queryVulnerability(packageName: string) {
    const vulnerability = await client.query({
      query: gql`
        query {
          securityVulnerabilities(first: 100, ecosystem: NPM, package: "${packageName}") {
            #totalCount
            nodes {
              package {
                name
              }
              firstPatchedVersion {
                identifier
              }
              severity
              vulnerableVersionRange
              advisory {
                permalink
              }
            }
          }
        }
      `
    })

    return vulnerability
  }

  function linkArc(d: any) {
    const r = Math.hypot(d.target.x - d.source.x, d.target.y - d.source.y)
    return `
      M${d.source.x},${d.source.y}
      A${r},${r} 0 0,1 ${d.target.x},${d.target.y}
    `
  }


  function renderChart() {
    // let svg: d3.Selection<d3.BaseType, unknown, HTMLElement, any> = d3.select('#chart')

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
        .attr('r', 4)
        // .attr('fill', d => color(d.id))
        .attr('fill', (d: any) => {
          if (d.type === NODE_TYPE.ROOT) {
            return '#f0f'
          }
          if (d.vulnerabilitiesCount.length > 0) {
            return '#f00'
          }
          return '#0ff'
        })

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

  async function readPackageJson(json: any) {
    const deps = json.dependencies || {}
    // const devDeps = json.devDependencies || {}
    const devDeps = {}

    const dependencies = Object.assign(deps, devDeps)

    setProgress(0)
    let done = 0
    const vulnerabilitiesPromises: Promise<any>[] = Object.keys(dependencies).map((id) => {
        return new Promise(async (resolve: any) => {
          const vulnerability = await queryVulnerability(id)

          const node = {
            id,
            version: dependencies[id],
            vulnerabilitiesCount: vulnerability.data.securityVulnerabilities.nodes,
            type: NODE_TYPE.DEP,
          }

          setProgress(++done / Object.keys(dependencies).length * 100)
          resolve(node)
        })
      })

    const vulnerabilities = await Promise.all(vulnerabilitiesPromises)
    console.log('vulnerabilities', vulnerabilities)

    const nodes = Array.from(
      new Set(
        [
          ...vulnerabilities,
          { id: json.name, version: json.version || '', vulnerabilitiesCount: [], type: NODE_TYPE.ROOT },
        ]
      )
    )

    const links = vulnerabilities.reduce((stack: Link[], next: any) => {
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

    console.log(nodes)
    console.log(links)

    setNodes(nodes)
    setLinks(links)
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

  return (
    <div className="container">
      <input onChange={handleFileChange} type="file"/>
      <p>
        <strong>Github User: </strong>
        <span>{username}</span>
      </p>
      <Loading progress={progress}/>
      <svg id="chart" />
    </div>
  )
}

export default App
