import axios from 'axios';
import { getToken } from './storage';
import { API_URL } from './config';

const api = axios.create({ baseURL: API_URL, timeout: 15000 });

api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const errMsg = (e) => e.response?.data?.message || (e.request ? `Cannot reach server at ${API_URL}` : e.message);
export const fmt = (d) => (d ? new Date(d).toLocaleString() : '');
export const fmtDate = (d) => (d ? new Date(d).toLocaleDateString() : '');
export default api;
