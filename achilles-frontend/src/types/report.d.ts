interface IReport {
  username: string;
  jsonPath: string;
  repository_name: string;
  items: IItem[];
}

interface IItem extends ISecurityVulnerability {
  chaining: IChaining[];
  cwes: ICWE[];
  direct_dependency_name: string;
  direct_dependency: {
    name: string;
    current_version: string;
    latest_version: string;
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

interface ICWE {
  cweId: string;
  name: string;
  link: string;
}
