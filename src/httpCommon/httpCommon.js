import axios from "axios";
import { extractAuthQueryParamsFromVerificationURL, extractTokenFromVerificationURL, extractProcessIdFromProcessImportURL } from "../utils/helpers";

export const api_url = "https://100094.pythonanywhere.com/v1/";
export const api_url_v2 = "https://100094.pythonanywhere.com/v2/";

export const auth_url = "https://100014.pythonanywhere.com/api/";
const auth_url_other = "https://100093.pythonanywhere.com/api/";
// const new_process_api_url = "https://100094.pythonanywhere.com/v0.2/";
const new_process_api_url = "https://100094.pythonanywhere.com/v0.2/";
export const auth_expo_url = "https://100093.pythonanywhere.com";

///new api
const api_url_workflow = "https://100094.pythonanywhere.com/v1/"

export const dowellLoginUrl =
  `https://100014.pythonanywhere.com/?redirect_url=${
    window.location.href.includes("verify/") ?
      window.location.origin +
    `/workflowai.online/%23token~${extractTokenFromVerificationURL(window.location.href)}~${extractAuthQueryParamsFromVerificationURL(window.location.href)}~`
    :
    window.location.href.includes("process-import/") ?
      window.location.origin +
    `/workflowai.online/%23importProcessId~${extractProcessIdFromProcessImportURL(window.location.href)}~`
    :
    window.location.origin +
    "/workflowai.online/%23"
  }`
;

export const dowellLogoutUrl =
  "https://100014.pythonanywhere.com/sign-out?redirect_url=" +
  window.location.origin +
  "/workflowai.online/%23";

export const httpWorkflow = axios.create({
  baseURL: api_url + "workflows",
});

export const httpApiUrl = axios.create({ baseURL: api_url });

export const httpApiUrlV2 = axios.create({ baseURL: api_url_v2 });

export const httpTemplate = axios.create({ baseURL: api_url + "templates" });

export const httpDocument = axios.create({ baseURL: api_url + "documents" });

export const httpAuth = axios.create({ baseURL: auth_url });

export const httpAuthOther = axios.create({ baseURL: auth_url_other });

export const httpProcess = axios.create({ baseURL: api_url + "processes" });

export const newHttpProcess = axios.create({
  baseURL: new_process_api_url + "process",
});

export const searchHttpInstance = axios.create({ baseURL: api_url + "search" });

export const httpFavourite = axios.create({ baseURL: api_url + "favourites" });

export const httpArchive = axios.create({ baseURL: api_url + "archives" });


///new workflow api for update
export const httpWorkflowNew = axios.create({
  baseURL: api_url_workflow + "workflows",
});