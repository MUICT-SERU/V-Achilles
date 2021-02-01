interface IReport {
  username: string;
  repository_name: string;
  items: IItem[];
}

interface IItem extends ISecurityVulnerability {
  chaining: IChaining[];
}

interface IChaining {
  source: string;
  target: string;
}

interface IIdentifier {
  type: string;
  value: string;
}
