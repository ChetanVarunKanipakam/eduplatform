import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the token in headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  // Or wherever you store your token
  if (token) {
    config.headers['x-auth-token'] = token;
  }
  return config;
});

export default api;