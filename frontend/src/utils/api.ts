import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// Create a base API instance
const baseAPI: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
baseAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle common errors
baseAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Define API wrapper methods
export const api = {
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await baseAPI.get(url, config);
    return response.data;
  },

  async post<T = any, D = any>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await baseAPI.post(url, data, config);
    return response.data;
  },

  async put<T = any, D = any>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await baseAPI.put(url, data, config);
    return response.data;
  },

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await baseAPI.delete(url, config);
    return response.data;
  }
};

// Define typed API endpoints
export const endpoints = {
  auth: {
    login: (email: string, password: string) => 
      api.post('/auth/login', { email, password }),
    logout: () => 
      api.post('/auth/logout'),
    me: () => 
      api.get('/auth/me'),
    refreshToken: () => 
      api.post('/auth/refresh-token')
  },
  restaurants: {
    getAll: () => 
      api.get('/analytics/restaurants'),
    getById: (id: string) => 
      api.get(`/analytics/restaurants/${id}`),
    getMetrics: (id: string, params?: { metric_type?: string, start_date?: string, end_date?: string }) => 
      api.get(`/analytics/metrics/${id}`, { params }),
    getTrends: (id: string, metricType: string, window: number = 7) => 
      api.get(`/analytics/trends/${id}?metric_type=${metricType}&window=${window}`)
  },
  ai: {
    analyzeRestaurant: (restaurantId: string, timeframe: string, metrics: string[]) => 
      api.post('/ai/analyze-restaurant', { restaurant_id: restaurantId, timeframe, metrics }),
    analyzeCompetitors: (restaurantId: string, competitorIds: string[], timeframe: string) => 
      api.post('/ai/analyze-competitors', { restaurant_id: restaurantId, competitor_ids: competitorIds, timeframe }),
    optimizeMenu: (restaurantId: string, menuItems: any[], salesData: any) => 
      api.post('/ai/optimize-menu', { restaurant_id: restaurantId, menu_items: menuItems, sales_data: salesData }),
    getFlows: () => 
      api.get('/ai/flows'),
    runFlow: (flowId: string, inputs: any) => 
      api.post(`/ai/flows/${flowId}/run`, inputs)
  }
};

export default api; 