import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/stores/auth-store';

// Create axios instance with environment-based config
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json',
    'Accept-Language': 'ar', // Default to Arabic
  },
  timeout: 30000, // 30 second timeout
});

// Track if we're already refreshing to prevent multiple refresh calls
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().accessToken;
    const locale = useAuthStore.getState().locale || 'ar';
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add locale header for i18n
    config.headers['Accept-Language'] = locale;
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor with token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    
    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Skip refresh for auth endpoints to prevent infinite loops
      const skipUrls = ['/auth/login', '/auth/register', '/auth/refresh-token'];
      if (skipUrls.some(url => originalRequest.url?.includes(url))) {
        return Promise.reject(error);
      }
      
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }
      
      originalRequest._retry = true;
      isRefreshing = true;
      
      const refreshToken = useAuthStore.getState().refreshToken;
      const logout = useAuthStore.getState().logout;
      
      if (!refreshToken) {
        logout();
        return Promise.reject(error);
      }
      
      try {
        const response = await axios.post(
          `${apiClient.defaults.baseURL}/auth/refresh-token`,
          { refreshToken }
        );
        
        const { accessToken, refreshToken: newRefreshToken } = response.data.data;
        
        // Update tokens in store
        useAuthStore.getState().setTokens(accessToken, newRefreshToken);
        
        // Process queued requests
        processQueue(null, accessToken);
        
        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as AxiosError, null);
        logout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    
    return Promise.reject(error);
  }
);

// API Error handler helper
export interface ApiError {
  message: string;
  errors?: string[];
  statusCode: number;
}

export const handleApiError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    
    if (axiosError.response) {
      // Server responded with error
      const data = axiosError.response.data as { message?: string; errors?: string[] };
      return {
        message: data.message || `Error: ${axiosError.response.status}`,
        errors: data.errors,
        statusCode: axiosError.response.status,
      };
    } else if (axiosError.request) {
      // Request made but no response
      return {
        message: 'Network error. Please check your connection.',
        statusCode: 0,
      };
    }
  }
  
  return {
    message: 'An unexpected error occurred.',
    statusCode: 0,
  };
};

export default apiClient;