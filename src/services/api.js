import axios from 'axios';

const API_URL = 'http://localhost:8000/api/'; // Correct

// Add request interceptor to handle content type
axios.interceptors.request.use(config => {
  config.headers['Content-Type'] = 'application/json';
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle token refresh
axios.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === 401 &&
      error.response.data &&
      error.response.data.code === 'token_not_valid' &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) throw new Error('No refresh token');
        const res = await axios.post('http://localhost:8000/api/token/refresh/', { refresh: refreshToken });
        const newAccessToken = res.data.access;
        localStorage.setItem('access_token', newAccessToken);
        axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('username');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

const api = {
  getDestinations: () => axios.get(`${API_URL}destinations/`),
  getSafaris: () => axios.get(`${API_URL}safaris/`),
  getSafariById: (id) => axios.get(`${API_URL}safaris/${id}/`),
  createBooking: async (bookingData) => {
    try {
      const response = await axios.post(`${API_URL}bookings/`, bookingData);
      return response.data;
    } catch (error) {
      console.error('API Error:', error.response?.data);
      throw error;
    }
  },
  getBooking: async (id) => {
    const response = await axios.get(`${API_URL}/bookings/${id}/`);
    return response.data;
  },
  updateBooking: async (id, bookingData) => {
    const response = await axios.put(`${API_URL}/bookings/${id}/`, bookingData);
    return response.data;
  },
  register: (userData) => axios.post(`${API_URL}register/`, userData),
  login: (credentials) => axios.post(`${API_URL}login/`, credentials),
  sendContactMessage: (messageData) => axios.post(`${API_URL}contact/`, messageData),
  getProfile: () => {
    const token = localStorage.getItem('access_token');
    return axios.get('http://localhost:8000/api/user_profile/', {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  updateProfile: (profileData, isMultipart = false) => {
    const token = localStorage.getItem('access_token');
    if (isMultipart) {
      return axios.put('http://localhost:8000/api/user_profile/', profileData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
    }
    return axios.put('http://localhost:8000/api/user_profile/', profileData, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  getBookingHistory: () => {
    const token = localStorage.getItem('access_token');
    return axios.get('http://localhost:8000/api/booking-history/', {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  getAccommodationEnquiries: () => {
    const token = localStorage.getItem('access_token');
    return axios.get('http://localhost:8000/api/my-accommodation-enquiries/', {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  initiateStripePayment: (payload) => axios.post(`${API_URL}payments/stripe/initiate/`, payload),
  initiateIntaSendPayment: (payload) => axios.post(`${API_URL}payments/intasend/initiate/`, payload),
  post: (url, data, config = {}) => axios.post(url, data, config),
};

export default api;