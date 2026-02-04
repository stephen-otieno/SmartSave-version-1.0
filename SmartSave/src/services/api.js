import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Automatically add the token to every request
API.interceptors.request.use((config) => {
  const savedUser = localStorage.getItem('savesmart_user');
  
  if (savedUser) {
    const userData = JSON.parse(savedUser);
    // Extract the token and set the header the backend expects
    if (userData && userData.token) {
      config.headers['x-auth-token'] = userData.token;
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default API;