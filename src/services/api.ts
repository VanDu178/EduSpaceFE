import axios from 'axios';

// Khởi tạo instance Axios dùng chung với cấu hình mặc định.
const api = axios.create({
  // Sử dụng biến môi trường của Vite, nếu không có sẽ lấy http://localhost:5000/api làm mặc định.
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Tự động đính kèm JWT Token vào Header của mỗi yêu cầu nếu có trong localStorage.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
