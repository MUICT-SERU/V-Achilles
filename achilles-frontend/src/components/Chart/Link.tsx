import { useEffect, useRef } from 'react';
import { LINK_STATUS } from 'types/index'
import { select } from 'd3';

const Link = (props: any) => {
  const g = useRef<any>(null);
  const ref = useRef<any>(null);
  const links = useRef<any>(null);

  useEffect(() => {
    setup();
    setupLink(props.data);
  }, [props.data, props.simulation]);

  useEffect(() => {
    props.setLinks(links.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.data, props.setLinks]);

  function setup() {
    ref.current = select(g.current);
  }

  function setupLink(data: any) {
    links.current = ref.current
      .selectAll('path')
      .data(data)
      .join('path')
      .attr('stroke', (d: ILink) => {
        return d.status === LINK_STATUS.VULNERABLE ? 'rgb(213,94,0)' : '#000'
      })
      .attr('marker-start', 'url(#arrow-head)')
      .attr('stroke-width', (d: ILink) => {
        if (d.status === LINK_STATUS.VULNERABLE)
          return 2

        return 1
      })
  }

  return <g ref={g}></g>;
};

export default Link;
