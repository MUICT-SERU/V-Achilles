import HttpUtil from "../utils/http-util";
import { ROUTE_API } from "../utils/route-util";

const auth = {
  loginWithGithub: async (data: string) =>
    await HttpUtil.post(ROUTE_API.login, { data }),

  user: async (data: string) =>
    await HttpUtil.get(`${ROUTE_API.user}?data=${data}`),
};

export default auth;
