import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api',
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Add access token
api.interceptors.request.use(
  async (config) => {
    if (typeof window !== 'undefined') {
      const { getAccessToken } = await import('./token');
      const token = getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      // Add cart session ID
      try {
        const { getOrCreateSessionId } = await import('./cart-session');
        const sessionId = getOrCreateSessionId();
        if (sessionId) {
          config.headers['x-session-id'] = sessionId;
        }
      } catch {}
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const baseURL = api.defaults.baseURL || process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api';
        const refreshUrl = `${baseURL.replace(/\/$/, '')}/auth/refresh`;
        
        const { data } = await axios.post(
          refreshUrl,
          {},
          { withCredentials: true }
        );

        if (typeof window !== 'undefined' && data?.accessToken) {
          const { setAccessToken } = await import('./token');
          setAccessToken(data.accessToken);
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        }

        return api(originalRequest);
      } catch (refreshError) {
        if (typeof window !== 'undefined') {
          const { clearAccessToken } = await import('./token');
          clearAccessToken();
          // Optionally redirect to login
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
