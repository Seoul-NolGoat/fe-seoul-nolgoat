import axios from 'axios';
import authService from './authService';
import config from '../config/config.js';

const axiosInstance = axios.create({
  baseURL: `${config.BASE_URL}/api`,
  withCredentials: true 
});

// 요청 인터셉터: 모든 요청에 Access Token을 헤더에 추가
axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터: 401 응답 처리
axiosInstance.interceptors.response.use(
  response => {
    return response;
  },
  async error => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const tokens = await authService.refreshToken(); 
        //localStorage.setItem('accessToken', tokens.accessToken);

        // 원래 요청을 새로운 토큰으로 재시도
        originalRequest.headers['Authorization'] = `Bearer ${tokens.accessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // 리프레시 토큰도 만료된 경우 로그아웃 처리
        authService.logout(); 
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
