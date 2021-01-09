const DOMAIN = process.env.REACT_APP_DOMAIN;
const GITHUB_CLIENT_ID = process.env.REACT_APP_GITHUB_CLIENT_ID;
const GITHUB_REDIRECT_URI = `${DOMAIN}/login`;

export const ROUTE_API = {
  root: process.env.REACT_APP_API_URL,

  user: "/api/v1/auth/user",
  login: "/api/v1/auth/login",

  project: "/api/v1/projects",
  searchProject: "/api/v1/projects/search",
  isPackgeJson: "/api/v1/projects/is-packge-json",
  packageJsonContent: "/api/v1/projects/package-json-content",
};

export const ROUTE_PATH = {
  root: "/",

  login: "/login",
  projectList: "/project-list",
  githubAuthorize: `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${GITHUB_REDIRECT_URI}&scope=repo`,
};
