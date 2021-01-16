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
  source: string | number
  target: string | number
  version?: string
  level: number
}