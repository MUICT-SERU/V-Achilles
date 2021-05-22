interface IVulnerableChaining { [key: string]: VulnerableNode }
interface ISearchStackFilter {
  (item: INode, index?: number): boolean
}

interface IPrepareSearchStack {
  (item: INode, index?: number): any
}

interface IOnAddChain {
  (
    vulnerableNodeName: string,
    source: string,
    target: string,
    link: ILink,
  ): void
}

interface INodePairs {
  [key: string]: {
    [key: string]: string | null
  } | null
}