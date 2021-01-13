import React, { useEffect, useRef } from 'react'
import * as d3 from 'd3'

const Node = (props: any) => {
  const ref = useRef(null)
  const groupElement = useRef(d3.select(ref.current))
  const nodes = useRef<any>()

  useEffect(() => {
    groupElement.current = d3.select(ref.current)
    setupCircle(props.data)

    return () => {
      // groupElement.current
      //   .selectAll('g')
      //   .remove()
    }
  }, [props.data, props.simulation])


  useEffect(() => {
    props.setNodes(nodes.current)
  }, [props.data, props.simulation, props.setNodes])


  function setupCircle(data: any) {
    nodes.current = groupElement.current
      .selectAll('g')
      .data(data)
      .join('g')
      .call(drag(props.simulation))

    nodes.current
        .append('circle')
      // .join('circle')
        .attr('r', 5)
        .attr('fill', (d: any) => {
          if (d.id === 1) {
            return '#0ef'
          }
          return '#f0f'
        })

    nodes.current
        .append('text')
          .text((d: any) => d.id)
          .attr('x', 8)
          .attr('y', '0.31em')
          .attr('fill', '#fff')
        .clone(true).lower()
          .attr('fill', 'none')
  }

  const drag = (simulation: any) => {
    const dragstarted = (event: any, d: any) => {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    };

    const dragged = (event: any, d: any) => {
      d.fx = event.x;
      d.fy = event.y;
    };

    const dragended = (event: any, d: any) => {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    };

    return d3
      .drag<any, any>()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended);
  };

  return (
    <>
      <g ref={ref} strokeLinecap="round" strokeLinejoin="round"></g>
    </>
  )
}

export default Node
