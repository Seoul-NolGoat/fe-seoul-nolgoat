import axios from 'axios';
import API_BASE_URL from '../config.js';
import axiosInstance from '../services/axiosInstance';

const authService = {
  // Refresh Token을 사용하여 새로운 Access Token과 Refresh Token을 발급받는 함수
  async refreshToken() {
    try {
      const response = await axios.post(`${API_BASE_URL}/reissue`, {},{
        headers: {
          'refresh': localStorage.getItem('refreshToken')
        },
        withCredentials: true
      });

      if (response.status === 200) {
        // 서버 응답에서 새로운 Access Token과 Refresh Token 가져오기
        const accessToken = response.headers['authorization'];
        const refreshToken = response.headers['refresh'];

        // 새 토큰을 로컬 스토리지에 저장
        localStorage.setItem('accessToken', accessToken); 
        localStorage.setItem('refreshToken', refreshToken);

        return { accessToken, refreshToken };
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
        const refreshToken = localStorage.getItem('refreshToken');
        await axiosInstance.post('/logout', {}, {
          headers: {
            'Refresh': refreshToken
          }
        });

        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
  
        window.location.href = '/';
    } catch (error) {
        alert(error.response)
        console.error('Error logging out:', error);
        window.location.href = '/';
    }
  }
};

export default authService;
