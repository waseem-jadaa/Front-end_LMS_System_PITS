import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://library-management-api-kj8q.onrender.com/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {

    return response.data;
  },
  (error) => {
    if (error.response) {
      const status = error.response.status;
      if (status === 401) {

        console.warn('Unauthorized access - redirecting to login...');
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        window.location.href = '/auth'; 
      } else if (status === 403) {
        console.warn('Forbidden access.');
      } else if (status >= 500) {
        console.error('Server error. Please try again later.');
      }
    } else if (error.request) {
      console.error('Network error. No response received.');
    }
    return Promise.reject(error);
  }
);

export default apiClient;
