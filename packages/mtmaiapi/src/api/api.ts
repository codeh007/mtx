import qs from "qs";
import { Api } from "./generated/Api";
import { Api as CloudApi } from "./generated/cloud/Api";

const api = new Api({
  paramsSerializer: (params) => qs.stringify(params, { arrayFormat: "repeat" }),
});

export default api;

export const cloudApi = new CloudApi({
  paramsSerializer: (params) => qs.stringify(params, { arrayFormat: "repeat" }),
});
