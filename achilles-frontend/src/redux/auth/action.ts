export const AUTH_ACTION = {
  LOGIN_WITH_GITHUB_REQUEST: "LOGIN_WITH_GITHUB_REQUEST",
  LOGIN_WITH_GITHUB_SUCCESS: "LOGIN_WITH_GITHUB_SUCCESS",
  LOGIN_WITH_GITHUB_FAILURE: "LOGIN_WITH_GITHUB_FAILURE",

  LOGOUT_REQUEST: "LOGOUT_REQUEST",
  LOGOUT_SUCCESS: "LOGOUT_SUCCESS",
  LOGOUT_FAILURE: "LOGOUT_FAILURE",

  USER_REQUEST: "USER_REQUEST",
  USER_SUCCESS: "USER_SUCCESS",
  USER_FAILURE: "USER_FAILURE",
};

// login request
export const loginWithGithubRequest = (data: string) => ({
  type: AUTH_ACTION.LOGIN_WITH_GITHUB_REQUEST,
  payload: data,
});

export const loginWithGithubSuccess = ({ userData }: any) => ({
  type: AUTH_ACTION.LOGIN_WITH_GITHUB_SUCCESS,
  payload: { userData },
});

export const loginWithGithubFailure = ({ userData }: any) => ({
  type: AUTH_ACTION.LOGIN_WITH_GITHUB_FAILURE,
  payload: { userData },
});

// user information request
export const userRequest = (data: string) => ({
  type: AUTH_ACTION.USER_REQUEST,
  payload: data,
});

export const userSuccess = ({ userData }: any) => ({
  type: AUTH_ACTION.LOGIN_WITH_GITHUB_SUCCESS,
  payload: { userData },
});

export const userFailure = ({ userData }: any) => ({
  type: AUTH_ACTION.LOGIN_WITH_GITHUB_FAILURE,
  payload: { userData },
});

// logout request
export const logoutRequest = () => ({
  type: AUTH_ACTION.LOGOUT_REQUEST,
});

export const logoutSuccess = ({ userData }: any) => ({
  type: AUTH_ACTION.LOGOUT_SUCCESS,
  payload: userData,
});

export const logoutFailure = () => ({
  type: AUTH_ACTION.LOGOUT_FAILURE,
});
