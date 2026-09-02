import axios from 'axios';
import { ROLES } from '@/core/utils/constants';

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
        const requestToken = error.config?.headers?.Authorization?.replace('Bearer ', '');

        // A guest session's token was never valid server-side to begin with,
        // so a 401 under it is expected and meaningless -- it must never
        // force-clear or redirect a real session, no matter when it resolves
        // relative to a login that happens afterward.
        if (requestToken === ROLES.GUEST) {
          return Promise.reject(error);
        }

        const currentToken = localStorage.getItem('auth_token');

        // Only force-logout if this 401 belongs to the session that's still
        // active. A slow request started under an old token can resolve
        // after the user has since logged in for real, and we must not wipe
        // the newer session in that case.
        if (requestToken && requestToken === currentToken) {
          console.warn('Unauthorized access - redirecting to login...');
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');
          window.location.href = '/auth';
        }
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
