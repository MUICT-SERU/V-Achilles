import { filterRelatedVulnerabilities } from 'lib/vulnerability';

export class VulnerableNode {
  #chains: IChaining[] = [];
  #name = null;
  #directDependencyName = '-';

  constructor(name) {
    this.#name = name;
  }

  set directDependencyName(directDependencyName: string) {
    this.#directDependencyName = directDependencyName
  }

  get directDependencyName() {
    return this.#directDependencyName
  }
  get chains() {
    return this.#chains;
  }

  get name() {
    return this.#name
  }

  addChain(chaining: IChaining) {
    this.#chains.push(chaining);
  }
}

// ========================================================
// Filter links
// ========================================================
export const createNodePairs = (
  nodes: INode[],
  links: ILink[],
  searchStackFilter: ISearchStackFilter,
  prepareSearchStack: IPrepareSearchStack,
  onAddChain: IOnAddChain,
): INodePairs => {
  const nodePairs: INodePairs = {}

  // --------------------
  // Prepare search stack
  // --------------------
  let searchStack: Array<string | number> = [];

  nodes.forEach((item, index) => {
    if (searchStackFilter(item, index)) {
      prepareSearchStack(item);
      // Initalize node pairs for update
      Object.assign(nodePairs, { [item.id]: null });
      searchStack.push(item.id);
    }
  });

  // -------------
  // Add node pair
  // -------------
  function addPair(vulnerableNode, source, target) {
    Object.assign(nodePairs, {
      ...nodePairs,
      [vulnerableNode]: {
        ...nodePairs[vulnerableNode],
        [source]: target !== vulnerableNode ? target : null,
      },
    });
  }

  // ---------------------------
  // Find final node in chaining
  // ---------------------------
  function findFinalNode(nodeName: string) {
    let currentNode: string = nodeName;
    let currentVulnerableNode: string | null = null;

    // If currentNode / level 1 node is null
    // that means it's the final node
    if (nodePairs[currentNode] === null) {
      return currentNode;
    }

    // ----------------------------------
    // If level 1 node is undefined
    // It's possibly
    if (nodePairs[currentNode] === undefined) {
      for (const vulernableNode in nodePairs) {
        currentVulnerableNode = vulernableNode;

        const nodePair = nodePairs[vulernableNode]
        // If vulnerable node has pair
        if (nodePair !== null && nodePair[currentNode] !== undefined) {
          const pairLength = Object.keys(nodePair).length;
          // ------------------------------------------------------------
          // Start verfiy to make sure it is the pair that we're finding
          // ------------------------------------------------------------
          for (let i = 0; i < pairLength; i++) {
            // If current node is not null or it's not the final node in vulernable node
            // then search the next level node of them
            if (nodePair[currentNode] && nodePair[currentNode] !== null) {
              currentNode = nodePair[currentNode] as string;
            } else {
              // When
              return currentVulnerableNode;
            }
          }

          return currentVulnerableNode;
        }
      }
    }

    return currentNode;
  }

  // -----------------------------------------------------------------------

  // remainingLinks will reduce every time that found the searching items
  // to reduce the iteration time
  let remainingLinks: ILink[] = links;

  // ------------------------------
  // Start filter from search stack
  // ------------------------------
  function searchChain(item: ILink, index: number) {
    // ---------------
    // Otherwise, if current node is in search stack
    // - Create node pair
    // - Add next search node
    const source = item.source.id;
    const target = item.target.id;
    const targetItemIndex = searchStack.indexOf(item.target.id);

    // Remove item from stack when it hits the last item
    // if (index >= remainingLinks.length - 1) {
    // }

    // Return node that isn't in search stack
    if (targetItemIndex < 0) {
      return true;
    }

    searchStack.splice(targetItemIndex, 1);
    // Find root of vulnerable node
    // to update its chan
    const vulnerableNodeName = findFinalNode(target) || '-'

    // If node doesn't exist in search stack yet
    // or isn't PROJECT node [need to revise this logic]
    // add into search stack and create node pair
    // if (searchStack.indexOf(source) < 0 && source !== 'PROJECT') {
    if (source !== 'PROJECT') {
      searchStack.push(source);
      addPair(vulnerableNodeName, source, target);
    }

    onAddChain(vulnerableNodeName, source, target, item)

    // return new stack
    // else
    return true;
  }

  // ================
  // Start searching
  // ================

  while (searchStack.length > 0) {
    remainingLinks = remainingLinks.filter(searchChain);
  }

  return nodePairs
}

// ========================================================
// Find dependencey chain
// ========================================================
export function createVulnerableChaining(vulnerableNodes: INode[], links: ILink[], onAddChain?: IOnAddChain): IVulnerableChaining {
  const vulnerableChaining: { [key: string]: VulnerableNode } = {}

  function searchStackFilter(item: INode): boolean {
    return true;
  }

  function prepareSearchStack(item: INode) {
    Object.assign(vulnerableChaining, {
      [item.id]: new VulnerableNode(item.id),
    });
  }

  // vulnerableNodes
  function _onAddChain(vulnerableNodeName: string, source: string, target: string, link: ILink) {
    onAddChain && onAddChain(vulnerableNodeName, source, target, link);
  }

  // --------------------
  // Create Node Pairs
  // --------------------
  const nodePairs: INodePairs = createNodePairs(
    vulnerableNodes,
    links,
    searchStackFilter,
    prepareSearchStack,
    _onAddChain
  );

  function addVuerableChain(vulnerableNode: string) {
    return (source: string | null, target: string) => {
      vulnerableChaining[vulnerableNode]
        .addChain({
          source: source ? source : 'PROJECT',
          target,
        })
    }
  }

  // console.log('vulnerableChaining')
  // console.log(vulnerableChaining)
  // console.log('nodePairs')
  // console.log(nodePairs)

  // Create vulnerable chaining from node pairs
  for (const vulnerableNode in nodePairs) {
    const pair = nodePairs[vulnerableNode]

    // If vulnerable node doesn't has the pair
    // It should be direct node from PROJECT
    if (pair === null) {
      // Set it as direct dependecy from source
      vulnerableChaining[vulnerableNode]
        .directDependencyName = vulnerableNode

      addVuerableChain(vulnerableNode)(null, vulnerableNode)
    }

    let foundDirectNode = false
    for (const node in pair) {
      const source = node
      const target = pair[node]

      // console.log('-------------------------------')
      // console.log('source', source)
      // console.log('target', target)

      // ==============================================
      // If the pair is null
      // It means the nearest node with vulnerable node
      if (target !== null) {
        addVuerableChain(vulnerableNode)(source, target)

        // Find direct node from PROJECT
        if (!foundDirectNode) {
          // If source never be target
          // so it should be direct dependency from PROJECT
          if (Object.values(pair).indexOf(source) < 0) {
            // Set it as direct dependecy from source
            vulnerableChaining[vulnerableNode]
              .directDependencyName = source

            addVuerableChain(vulnerableNode)(null, source)
          }
        }
      } else {
        vulnerableChaining[vulnerableNode]
          .directDependencyName = source

        addVuerableChain(vulnerableNode)(source, vulnerableNode)
        addVuerableChain(vulnerableNode)(null, source)
      }
    }
  }

  return vulnerableChaining
}

// ========================================================
// Get vulnerable nodes
// ========================================================

export const getVulernableNodes = (nodes: INode[]): INode[] => nodes.filter(item => item.status === 'VULNERABLE')

// ========================================================
// Create report
// ========================================================

export const createReport = (nodes: INode[], links: ILink[], advisoriesData: IAdvisoriesData, info: { username: string, jsonPath: string, repositoryName: string }) => {
  const vulnerableNodes: INode[] = getVulernableNodes(nodes)

  const vulnerableChaining: IVulnerableChaining = createVulnerableChaining(vulnerableNodes, links);
  const vulnerableItems: IItem[] = [];

  // Just for debugging
  // let advisoryCount = 0;
  const nodeVulnerableRelationship = { DIRECT: 0, INDIRECT: 0 };
  const advisoryVulnerableLevel = {
    DIRECT: { LOW: 0, MODERATE: 0, HIGH: 0, CRITICAL: 0 },
    INDIRECT: { LOW: 0, MODERATE: 0, HIGH: 0, CRITICAL: 0 },
  };

  function displaySummary() {
    // console.log('-----------------------');
    // console.log('#### CHAIN ####')
    // console.log(vulnerableChaining)
    // console.log('###############')

    // console.log('All nodes:', nodes.length);
    // console.log('All Advisory:', advisoryCount);
    // console.log('Vulnerable Type');
    // console.log(nodeVulnerableRelationship);
    // console.log('advisoryVulnerableLevel');
    // console.log(advisoryVulnerableLevel);
    // console.log('-----------------------');
  }

  function stepCount(
    type: 'DIRECT' | 'INDIRECT',
    serverity: ADVISORY_SERVERITY_LEVEL
  ) {
    switch (serverity) {
      case 'LOW':
        type === 'DIRECT'
          ? advisoryVulnerableLevel.DIRECT.LOW++
          : advisoryVulnerableLevel.INDIRECT.LOW++;
        break;
      case 'MODERATE':
        type === 'DIRECT'
          ? advisoryVulnerableLevel.DIRECT.MODERATE++
          : advisoryVulnerableLevel.INDIRECT.MODERATE++;
        break;
      case 'HIGH':
        type === 'DIRECT'
          ? advisoryVulnerableLevel.DIRECT.HIGH++
          : advisoryVulnerableLevel.INDIRECT.HIGH++;
        break;
      case 'CRITICAL':
        type === 'DIRECT'
          ? advisoryVulnerableLevel.DIRECT.CRITICAL++
          : advisoryVulnerableLevel.INDIRECT.CRITICAL++;
        break;
      default:
        break;
    }
  }
  // End ---

  vulnerableNodes.forEach((node) => {
    const advisoryData: ISecurityVulnerability[] = filterRelatedVulnerabilities(
      node,
      advisoriesData[node.id]
    );

    // Just for debugging
    // console.log(
    //   '> Vul Node:',
    //   node.name,
    //   '/',
    //   node.level === 1 ? 'DIRECT' : 'INDIRECT'
    // );
    if (node.level === 1) {
      nodeVulnerableRelationship.DIRECT++;
    } else {
      nodeVulnerableRelationship.INDIRECT++;
    }

    advisoryData.forEach((item: ISecurityVulnerability) => {
      // Just for debugging
      stepCount(node.level === 1 ? 'DIRECT' : 'INDIRECT', item.severity);
      // advisoryCount++;

      vulnerableItems.push({
        ...item,
        direct_dependency_name: vulnerableChaining[node.id].directDependencyName,
        chaining: vulnerableChaining[node.id].chains.reverse(),
        package: {
          name: vulnerableChaining[node.id].name,
        },
        cwes: [],
        direct_dependency: {
          name: '',
          current_version: '',
          latest_version: ''
        }
      });
    });
  });

  displaySummary();

  const data: IReport = {
    username: info.username,
    jsonPath: info.jsonPath,
    repository_name: info.repositoryName,
    items: vulnerableItems,
  };

  return data;
};
