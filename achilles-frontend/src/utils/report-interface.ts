export interface ReportInterface {
  username: string;
  repository_name: string;
  items: item[];
}

export interface item {
  package: {
    name: string;
  };
  chaining: chaining[];
  firstPatchedVersion: {
    identifier: string;
  };
  severity: string;
  vulnerableVersionRange: string;
  advisory: {
    identifiers: identifier[];
    permalink: string;
  };
}

export interface chaining {
  source: string;
  target: string;
}

export interface identifier {
  type: string;
  value: string;
}
