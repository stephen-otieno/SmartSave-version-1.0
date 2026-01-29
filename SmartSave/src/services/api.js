import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Request interceptor to attach JWT token
API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('savesmart_user'));
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default API;