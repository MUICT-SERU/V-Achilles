interface IReport {
  username: string;
  repository_name: string;
  items: IItem[];
}

interface IItem {
  package: {
    name: string;
  };
  chaining: IChaining[];
  firstPatchedVersion: {
    identifier: string;
  };
  severity: string;
  vulnerableVersionRange: string;
  advisory: {
    identifiers: IIdentifier[];
    permalink: string;
  };
}

interface IChaining {
  source: string;
  target: string;
}

interface IIdentifier {
  type: string;
  value: string;
}
