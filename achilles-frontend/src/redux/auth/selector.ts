import { createSelector } from "reselect";

const authReducerSelector = (state: any) => state.authReducer;

export const loginWithGithubSelector = createSelector(
  authReducerSelector,
  ({ userData, isLoadingLoginWithGithub, isErrorLoginWithGithub }: any) => ({
    userData,
    isLoadingLoginWithGithub,
    isErrorLoginWithGithub,
  })
);

export const userSelector = createSelector(
  authReducerSelector,
  ({ userData, isLoadingUser, isErrorUser }: any) => ({
    userData,
    isLoadingUser,
    isErrorUser,
  })
);
