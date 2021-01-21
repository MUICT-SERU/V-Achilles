import axios from "axios";
import { ROUTE_API } from "./route-util";

const HttpUtil = axios.create({
  baseURL: ROUTE_API.root,
});

HttpUtil.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  config.headers.Authorization = token ? `Bearer ${token}` : "";
  return config;
});

export default HttpUtil;
