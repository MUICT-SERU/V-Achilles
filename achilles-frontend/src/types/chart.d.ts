interface INode {
  id: string | number
  name: string
  version: string
  level: number
  type: NODE_TYPE
  status: NODE_STATUS

  x?: number
  y?: number
}
interface ILink {
  source: string | number | any
  target: string | number | any
  version?: string
  level: number
}

interface ICheckVulnerabilityResolve {
  result: IQueryVulnerabilityResponse
  node: INode
}

interface ITooltipData {
  node: INode
  advisory: ISecurityVulnerability[]
}