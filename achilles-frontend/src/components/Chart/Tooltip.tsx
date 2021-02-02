import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import * as d3 from 'd3';

interface IStyledWrapper {
  show?: boolean;
}

const StyledWrapper = styled('div')<IStyledWrapper>`
  position: absolute;
  transition: opacity ease 0.1s, transform ease 0.25s, top ease 0.1s,
    left ease 0.1s;
  text-align: right;
  content: 'X';

  opacity: ${(props) => (props.show ? 1.0 : 0.0)};
  transform: scale(${(props) => (props.show ? 1.0 : 0.0)});
`;

const StyledCloseBtn = styled('div')`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid #000;
  background: #fff;
  cursor: pointer;

  position: relative;
  right: -10px;
  bottom: -12px;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-align: right;

  &:after {
    content: 'X';
    color: #000;
  }
`;

const StyledTooltip = styled('div')`
  padding: 10px;
  color: #000;
  background: #fff;
  text-align: left;
  box-shadow: 0px 8px 11px 1px rgb(0 0 0 / 0.5);
`;

interface IStyledServeritiesProps {
  showColor: boolean;
}

const StyledServerities = styled('div')<IStyledServeritiesProps>`
  width: 6px;
  height: 100%;
  background: ${(props) => (props.showColor ? '#f00' : '#fff')};
  border: 1px solid #bbb;
  display: inline-block;
  margin-left: 1px;
`;

interface IServeritiesProps {
  level: ADVISORY_SERVERITY_LEVEL;
}

const Serverities = (props: IServeritiesProps) => {
  function identifyLevel() {
    switch (props.level) {
      case 'LOW':
        return 1;
      case 'MODERATE':
        return 2;
      case 'HIGH':
        return 3;
      case 'CRITICAL':
        return 4;
      default:
        return 0;
    }
  }

  return (
    <div style={{ marginLeft: '4px', display: 'inline-block' }}>
      {Array(4)
        .fill(null)
        .map((item, i) => (
          <StyledServerities key={i} showColor={identifyLevel() >= i + 1} />
        ))}
    </div>
  );
};

interface IProps {
  data: ITooltipData | null;
  show: boolean;
  setShow: any;
}

const Tooltip = (props: IProps) => {
  const [data, setData] = useState<ITooltipData | null>(null);
  const TooltipEl = useRef(null);

  useEffect(() => {
    d3.select(TooltipEl.current);
    return () => {};
  }, []);

  useEffect(() => {
    setData(props.data);
  }, [props.data]);

  function displayName() {
    if (data) {
      return (
        <>
          <h2 style={{ marginBottom: 0 }}>{data.node.name}</h2>
          <p style={{ marginTop: 0 }}>Version: {data.node.version}</p>
        </>
      );
    }

    return <></>;
  }

  function displayData() {
    let elements: JSX.Element[] = [];

    if (data && Array.isArray(data?.advisory) && data?.advisory.length > 0) {
      elements = data.advisory.map((item, index) => {
        return (
          <div key={'tooltip-item-' + index}>
            <div style={{ display: 'flex' }}>
              <p style={{ display: 'inline-block', margin: 0 }}>
                Serverity:{' '}
                <span style={{ fontWeight: 'bold' }}>{item.severity}</span>
              </p>
              <Serverities level={item.severity} />
            </div>
            <p>Version range: {item.vulnerableVersionRange}</p>

            {item.advisory.identifiers?.map((_item) => (
              <p key={_item.value} style={{ fontWeight: 'bold' }}>
                {_item.value}
              </p>
            ))}

            <a target="_blank" rel="noreferrer" href={item.advisory.permalink}>
              Learn more
            </a>
            <hr />
          </div>
        );
      });
    } else {
      elements = [<p>No vulnerability</p>];
    }

    if (data) {
      return [<>{displayName()}</>, ...elements];
    }

    return <p>Nothing to show</p>;
  }

  return (
    <StyledWrapper id="tooltip" ref={TooltipEl} show={props.show}>
      <StyledCloseBtn onClick={() => props.setShow(false)} />
      <StyledTooltip>{displayData()}</StyledTooltip>
    </StyledWrapper>
  );
};

export default Tooltip;
