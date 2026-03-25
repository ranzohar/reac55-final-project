import axios from "axios";
import { BACKEND_CONFIG } from "@/config/backend";

export const api = axios.create({
  baseURL: BACKEND_CONFIG.rest.baseUrl,
  withCredentials: true,
});