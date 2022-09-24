interface INode {
  id: string | number
  name: string
  version: string
  level: number
  type: NODE_TYPE
  status: NODE_STATUS
  dependenceiesAmount: number

  x?: number
  y?: number
}
interface ILink {
  source: string | number | any
  target: string | number | any
  version?: string
  level: number
  status: LINK_STATUS
}

interface IDepData {
  node: {
    id: string
    version: string
    level: number
  }
  link: {
    id: string
  }
}

interface ICheckVulnerabilityResolve {
  result: IQueryVulnerabilityResponse
  node: INode
}

interface ITooltipData {
  node: INode
  advisory: ISecurityVulnerability[]
}

interface IAdvisoriesData { [key: string]: ISecurityVulnerability[] }

interface IUpdateNodesFunc {
  (
    nodes?: INode[],
    filterCondition?: (node: INode, index?: number) => boolean,
  ): void
}

interface IUpdateLinksFunc {
  (
    nodes?: INode[],
    links?: ILink[],
    filterCondition?: (link: ILink, index?: number) => ILink,
  ): void
}
interface IUpdateNodesLinksFunc {
  (
    IUpdateNodesFunc,
    IUpdateLinksFunc,
  ) : void
}