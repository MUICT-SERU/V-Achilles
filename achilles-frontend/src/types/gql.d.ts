type ADVISORY_SERVERITY_LEVEL = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL'

interface ISecurityVulnerability {
  package: {
    name: string
  },
  firstPatchedVersion: {
    identifier: string // version: e.g. 1.9.0
  },
  vulnerableVersionRange: string // version rager: e.g. < 1.9.0,
  severity: ADVISORY_SERVERITY_LEVEL,
  advisory: {
    permalink: string
    ghsaId?: string
    identifiers?: { type: string; value: string; }[]
  },
}


interface IQueryVulnerabilityResponse {
  data: {
    securityVulnerabilities: {
      nodes: ISecurityVulnerability[]
    }
  };

  loading: boolean;
  networkStatus: number;
}