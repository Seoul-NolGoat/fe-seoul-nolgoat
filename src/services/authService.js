import axios from 'axios';
import API_BASE_URL from '../config.js';
import axiosInstance from '../services/axiosInstance';

const authService = {
  // Refresh Token을 사용하여 새로운 Access Token과 Refresh Token을 발급받는 함수
  async refreshToken() {
    try {
      const response = await axios.post(`${API_BASE_URL}/auths/token/reissue`, {},{
        withCredentials: true,
        headers: {
          'CSRF-Protection-UUID': process.env.REACT_APP_CSRF_PROTECTION_UUID, 
        },
      });

      if (response.status === 200) {
        // 서버 응답에서 새로운 Access Token과 Refresh Token 가져오기
        const accessToken = response.headers['authorization'];

        // 새 토큰을 로컬 스토리지에 저장
        localStorage.setItem('accessToken', accessToken); 

        return { accessToken};
      } else {
        throw new Error('Failed to refresh tokens');
      }
    } catch (error) {
      console.error('Error refreshing tokens:', error);
      throw error;
    }
  },

  async logout() {
    try {
        await axiosInstance.post('/auths/logout', {},
          {
            headers: {
              'Csrf-Protection-Uuid': process.env.REACT_APP_CSRF_PROTECTION_UUID,
            },
          }
        );

        localStorage.removeItem('accessToken');
  
        window.location.href = '/';
    } catch (error) {
        localStorage.removeItem('accessToken');
        console.error('Error logging out:', error);
        window.location.href = '/';
    }
  }
};

export default authService;
