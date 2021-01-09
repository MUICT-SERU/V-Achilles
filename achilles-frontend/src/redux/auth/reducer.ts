import { AUTH_ACTION } from "./action";
import { StateUtil } from "../../utils/state-util";

const initialState = {
  isLoadingLoginWithGithub: false,
  isErrorLoginWithGithub: false,

  isLoadingUser: false,
  isErrorUser: false,

  isLoadingLogout: false,
  isErrorLogout: false,
};

const reducer = (state = initialState, action: any) => {
  switch (action.type) {
    case AUTH_ACTION.LOGIN_WITH_GITHUB_REQUEST:
      return StateUtil.setRequest("LoginWithGithub", {
        ...state,
        ...action.payload,
      });
    case AUTH_ACTION.LOGIN_WITH_GITHUB_SUCCESS:
      return StateUtil.setSuccess("LoginWithGithub", {
        ...state,
        ...action.payload,
      });
    case AUTH_ACTION.LOGIN_WITH_GITHUB_FAILURE:
      return StateUtil.setFailure("LoginWithGithub", {
        ...state,
        ...action.payload,
      });

    case AUTH_ACTION.USER_REQUEST:
      return StateUtil.setRequest("User", {
        ...state,
        ...action.payload,
      });
    case AUTH_ACTION.USER_SUCCESS:
      return StateUtil.setSuccess("User", {
        ...state,
        ...action.payload,
      });
    case AUTH_ACTION.USER_FAILURE:
      return StateUtil.setFailure("User", {
        ...state,
        ...action.payload,
      });

    case AUTH_ACTION.LOGOUT_REQUEST:
      return StateUtil.setRequest("Logout", state);
    case AUTH_ACTION.LOGOUT_SUCCESS:
      return StateUtil.setSuccess("Logout", {
        ...state,
        ...action.payload,
      });
    case AUTH_ACTION.LOGOUT_FAILURE:
      return StateUtil.setFailure("Logout", state);

    default:
      return state;
  }
};

export default reducer;
