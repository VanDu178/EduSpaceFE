import axios from 'axios';



interface FailedRequestItem {
  resolve: (token: string | null) => void;
  reject: (error: unknown) => void;
}

// Khởi tạo instance Axios dùng chung với cấu hình mặc định.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Bắt buộc để tự động gửi HttpOnly cookie (refresh token) lên server
});


// Biến lưu trạng thái đang refresh token để tránh gọi trùng lặp nhiều lần
let isRefreshing = false;
let failedQueue: FailedRequestItem[] = [];

// Hàm đẩy các request bị hoãn vào hàng đợi chờ refresh xong
const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request Interceptor: Tự động đính kèm Access Token vào Header của mỗi yêu cầu
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Tự động bắt lỗi 401 để refresh token và gọi lại request cũ
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Nếu request bị hủy (ví dụ: Component unmount trong React Query)
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    const originalRequest = error.config;

    // Nếu không có originalRequest hoặc lỗi không phải 401 Unauthorized
    // hoặc đây là request login/refresh thì trả về lỗi luôn
    if (
      !originalRequest ||
      error.response?.status !== 401 ||
      originalRequest._retry ||
      originalRequest.url?.includes('/auth/login') ||
      originalRequest.url?.includes('/auth/refresh')
    ) {
      return Promise.reject(error);
    }

    // Nếu đang trong quá trình refresh token, hoãn request lại và đưa vào hàng đợi
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // Gọi API refresh token
      const response = await axios.post(
        `${api.defaults.baseURL}/auth/refresh`,
        {},
        { withCredentials: true }
      );

      const { accessToken } = response.data.data;

      // Lưu token mới vào localStorage
      localStorage.setItem('accessToken', accessToken);

      // Cập nhật Authorization header mặc định của api instance
      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

      // Thông báo cho SocketContext và các listener khác biết token đã được cập nhật
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('auth:token_refreshed'));
      }

      // Xử lý hàng đợi
      processQueue(null, accessToken);

      // Thực thi lại request ban đầu với token mới
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      // Nếu refresh token thất bại (ví dụ: refresh token hết hạn hoặc bị thu hồi)
      processQueue(refreshError, null);

      // Xóa thông tin đăng nhập và chuyển hướng về trang login
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('auth:logout'));
        window.location.href = '/login';
      }

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
