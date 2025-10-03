//src/utils/axiosConfig.js
import axios from "axios";
import { getApiBaseUrl } from "./api";

const instance = axios.create({
  baseURL: getApiBaseUrl(),
});

export default instance;
