import { filterRelatedVulnerabilities } from 'lib/vulnerability'
class VulnerableNode {
  #chains: IChaining[] = []
  #name = null

  constructor(name) {
    this.#name = name
  }
  get chains() {
    return this.#chains
  }

  addChain(chaining: IChaining) {
    this.#chains.push(chaining)
  }
}

function createVulnerableChaining(vulnerableNodes: INode[], links: ILink[]) {
  const vulnerableChaining: { [key: string]: VulnerableNode } = {}
  let remainingLinks: ILink[] = links

  const nodePairs: { [key: string]: string } = {}

  const searchStack = vulnerableNodes.map((item) => {
    Object.assign(vulnerableChaining, { [item.id]: new VulnerableNode(item.id) })
    Object.assign(nodePairs, { [item.id]: null })
    return item.id
  })


  function addPair(target, source) {
    Object.assign(nodePairs, { [target]: source })
  }

  function findChain() {
    // Find final node in chaining
    function findFinalNode(nodeName) {
      const pairsLength = Object.keys(nodePairs).length
      let currentNode = nodeName
      for (let i = 0; i < pairsLength; i++) {
        if (nodePairs[currentNode] && nodePairs[currentNode] !== null) {
          currentNode = nodePairs[currentNode]
        } else {
          return currentNode
        }
      }
      return currentNode
    }

    // Filter links
    const filterLinks = (item: ILink) => {
      if (searchStack.indexOf(item.source.id) < 0) {
        return true
      } else {
        const source = item.source.id
        const target = item.target.id
        const index = searchStack.indexOf(item.source.id)

        // change from check from name to node type
        if (searchStack.indexOf(target) < 0 && target !== 'PROJECT') {
          searchStack.push(target)
          addPair(target, source)
        }

        const pointer = findFinalNode(source)

        searchStack.splice(index, 1)
        vulnerableChaining[pointer].addChain({ source: target, target: source })
      }
    }

    while (searchStack.length > 0) {
      remainingLinks = remainingLinks.filter(filterLinks)
    }

    return vulnerableChaining
  }

  return findChain()
}

export const createReport = (nodes: INode[], links: ILink[], advisoriesData: IAdvisoriesData, info: { username: string, repositoryName: string }) => {
  const vulnerableNodes: INode[] = nodes.filter(item => item.status === 'VULNERABLE')

  const vulnerableChaining = createVulnerableChaining(vulnerableNodes, links)
  const vulnerableItems: IItem[] = []

  // Just for debugging
  let advisoryCount = 0
  const nodeVulnerableRelationship = { DIRECT: 0, INDIRECT: 0 }
  const advisoryVulnerableLevel = {
    DIRECT: { 'LOW': 0, 'MODERATE': 0, 'HIGH': 0, 'CRITICAL': 0 },
    INDIRECT: { 'LOW': 0, 'MODERATE': 0, 'HIGH': 0, 'CRITICAL': 0 },
  }

  function displaySummary() {
    console.log('-----------------------')
    console.log('All nodes:', nodes.length)
    console.log('All Advisory:', advisoryCount)
    console.log('Vulnerable Type',)
    console.log(nodeVulnerableRelationship)
    console.log('advisoryVulnerableLevel')
    console.log(advisoryVulnerableLevel)
    console.log('-----------------------')
  }

  function stepCount(type: 'DIRECT' | 'INDIRECT', serverity: ADVISORY_SERVERITY_LEVEL) {
    switch (serverity) {
      case 'LOW': type === 'DIRECT' ? advisoryVulnerableLevel.DIRECT.LOW++ : advisoryVulnerableLevel.INDIRECT.LOW++; break;
      case 'MODERATE': type === 'DIRECT' ? advisoryVulnerableLevel.DIRECT.MODERATE++ : advisoryVulnerableLevel.INDIRECT.MODERATE++; break;
      case 'HIGH': type === 'DIRECT' ? advisoryVulnerableLevel.DIRECT.HIGH++ : advisoryVulnerableLevel.INDIRECT.HIGH++; break;
      case 'CRITICAL': type === 'DIRECT' ? advisoryVulnerableLevel.DIRECT.CRITICAL++ : advisoryVulnerableLevel.INDIRECT.CRITICAL++; break;
      default: break;
    }
  }
  // End ---

  vulnerableNodes.forEach(
    (node) => {
      const advisoryData: ISecurityVulnerability[] = filterRelatedVulnerabilities(node, advisoriesData[node.id])

      // Just for debugging
      console.log('> Vul Node:', node.name, '/', node.level === 1 ? 'DIRECT' : 'INDIRECT')
      if (node.level === 1) {
        nodeVulnerableRelationship.DIRECT++
      } else {
        nodeVulnerableRelationship.INDIRECT++
      }

      advisoryData.forEach((_item: ISecurityVulnerability) => {
        // Just for debugging
        stepCount(node.level === 1 ? 'DIRECT' : 'INDIRECT', _item.severity)
        advisoryCount++

        vulnerableItems.push({
          ..._item,
          chaining: vulnerableChaining[node.id].chains.reverse(),
          package: {
            // name: node.name,
            name: _item.package.name,
          },
        })
      })
    }
  )

  displaySummary()

  const data: IReport = {
    username: info.username,
    repository_name: info.repositoryName,
    items: vulnerableItems
  }

  return data
}
