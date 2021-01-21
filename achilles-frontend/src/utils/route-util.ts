export const ROUTE_API = {
  root: process.env.REACT_APP_API_URL,

  user: "/api/v1/auth/user",
  login: "/api/v1/auth/login",

  projects: "/api/v1/projects",
  searchProject: "/api/v1/projects/search",
  isPackgeJson: "/api/v1/projects/is-packge-json",
  packageJsonContent: "/api/v1/projects/package-json-content",

  reports: "/api/v1/reports",
};

export const ROUTE_PATH = {
  root: "/",

  login: "/login",
  history: "/history",
  visualization: "/visualization",
  reportDetail: "/report-detail/:reportId",
  reportDetailNoParam: "/report-detail",
};
