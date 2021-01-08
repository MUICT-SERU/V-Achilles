import { takeLatest, put, call } from "redux-saga/effects";
import {
  AUTH_ACTION,
  userSuccess,
  userFailure,
  logoutSuccess,
  logoutFailure,
  loginWithGithubSuccess,
  loginWithGithubFailure,
} from "./action";
import AUTH_API from "../../api/auth";

export default function* authSaga() {
  yield takeLatest(AUTH_ACTION.LOGIN_WITH_GITHUB_REQUEST, loginWithGithub);
  yield takeLatest(AUTH_ACTION.USER_REQUEST, user);
  yield takeLatest(AUTH_ACTION.LOGOUT_REQUEST, logout);
}

function* loginWithGithub(action: any): any {
  try {
    const data = action.payload;
    const response = yield call(AUTH_API.loginWithGithub, data);
    localStorage.setItem("token", response.data.token);
    delete response.data.token;
    const userData = response.data;

    yield put(loginWithGithubSuccess({ userData }));
  } catch (err) {
    const userData = err.response.data;
    yield put(loginWithGithubFailure({ userData }));
  }
}

function* user(action: any): any {
  try {
    const data = action.payload;
    const response = yield call(AUTH_API.user, data);
    const userData = response.data;

    yield put(userSuccess({ userData }));
  } catch (err) {
    const userData = err.response.data;
    yield put(userFailure({ userData }));
  }
}

function* logout() {
  try {
    localStorage.clear();
    const userData = undefined;

    yield put(logoutSuccess({ userData }));
  } catch (err) {
    yield put(logoutFailure());
  }
}
