import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

import { NODE_STATUS, NODE_TYPE } from 'types/index';

const Node = (props: any) => {
  const ref = useRef(null);
  const groupElement = useRef(d3.select(ref.current));
  const nodes = useRef<any>();

  useEffect(() => {
    groupElement.current = d3.select(ref.current);
    setupCircle(props.data);

    return () => {
      nodes.current.selectAll('circle, text, div').remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.data, props.simulation]);

  useEffect(() => {
    props.setNodes(nodes.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.data, props.simulation, props.setNodes]);

  function setupCircle(data: any) {
    // Create group node
    nodes.current = groupElement.current
      .selectAll('g')
      .data(data)
      .join('g')
      .call(drag(props.simulation));

    // Create circle node
    nodes.current
      .append('circle')
      .attr('r', (d: INode) => {
        if (d.type === NODE_TYPE.ROOT) {
          return 10;
        }
        return 5 + d.dependenceiesAmount;
      })
      .attr('fill', (d: INode) => {
        if (d.type === NODE_TYPE.ROOT) {
          return '#9722e6';
        } else {
          if (d.status === NODE_STATUS.VULNERABLE) {
            return '#f00';
          }

          switch (d.level) {
            case 1:
              return '#0ef';
            case 2:
              return '#00f';
            case 3:
              return '#0f0';
            case 4:
              return '#ff0';
            default:
              return '#fff;';
          }
        }
      })
      .enter();

    // Create text node
    nodes.current
      .append('text')
      .text((d: INode) => {
        if (d.status === NODE_STATUS.VULNERABLE || d.type === NODE_TYPE.ROOT) {
          return d.id;
        }
        return '';
      })
      .attr('x', (d: INode) => {
        if (d.type === NODE_TYPE.ROOT) return 13;
        return 8;
      })
      .attr('y', '0.31em')
      .attr('fill', '#fff');

    // Add mouseover/mouseout event for node
    nodes.current.each(function (this: any, d: any) {
      const node = d3.select(this);
      const text = node.select('text');
      const circle = node.select('circle');

      if (d.type === NODE_TYPE.DEPENDENCY) {
        node.on('mouseover', function (event: any, d: any) {
          props.onMouseOver(event, d);
          circle.attr('r', 10);
          text.attr('x', 13);
        });
        node.on('mouseout', function () {
          circle.attr('r', 5);
          text.attr('x', 8);
        });
      }
    });
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
      // d.fx = null;
      // d.fy = null;
      d.fx = d.x;
      d.fy = d.y;
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
  );
};

export default Node;
