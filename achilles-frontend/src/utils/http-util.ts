import axios from "axios";
import { ROUTE_API } from "./route-util";

const HttpUtil = axios.create({
  baseURL: ROUTE_API.root,
});

export default HttpUtil;
