import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || (
  import.meta.env.PROD 
    ? 'https://your-backend-api.com/api' // Replace with actual backend URL
    : 'http://localhost:8000/api'
);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh/`, {
            refresh: refreshToken
          });
          
          const { access } = response.data;
          localStorage.setItem('access_token', access);
          api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
          originalRequest.headers['Authorization'] = `Bearer ${access}`;
          
          return api(originalRequest);
        } catch (refreshError) {
          // Refresh failed, redirect to login
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user');
          delete api.defaults.headers.common['Authorization'];
          window.location.reload();
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export const taskApi = {
  // Task endpoints (authentication required)
  getAllTasks: () => api.get('/tasks/'),
  createTask: (taskData) => api.post('/tasks/', taskData),
  getTaskById: (id) => api.get(`/tasks/${id}/`),
  updateTask: (id, taskData) => api.put(`/tasks/${id}/`, taskData),
  deleteTask: (id) => api.delete(`/tasks/${id}/`),
  
  // Authentication endpoints
  register: (userData) => api.post('/auth/register/', userData),
  login: (credentials) => api.post('/auth/login/', credentials),
  refreshToken: (refreshToken) => api.post('/auth/refresh/', { refresh: refreshToken }),
  
  // Direct axios instance for custom requests
  ...api
};

export default api;