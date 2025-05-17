import axios from 'axios';

// Base URL común
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

// Token getters
const getAccessToken = () => sessionStorage.getItem("accessToken");
const getFastapiToken = () => sessionStorage.getItem("fastapiToken");

const clearTokens = () => {
  sessionStorage.removeItem("accessToken");
  sessionStorage.removeItem("refreshToken");
  sessionStorage.removeItem("fastapiToken");
  window.dispatchEvent(new Event("sessionExpired"));
};

// 🛡️ Cliente Django con accessToken
export const djangoApi = axios.create({
  baseURL: API_BASE_URL,
});

djangoApi.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

djangoApi.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) clearTokens();
    return Promise.reject(err);
  }
);

// ⚡ Cliente FastAPI con fastapiToken
export const fastapiApi = axios.create({
  baseURL: API_BASE_URL,
});

fastapiApi.interceptors.request.use((config) => {
  const token = getFastapiToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

fastapiApi.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) clearTokens();
    return Promise.reject(err);
  }
);
