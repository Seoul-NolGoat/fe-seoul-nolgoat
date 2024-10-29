import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const access = urlParams.get('access');
    const refresh = urlParams.get('refresh');

    if (access && refresh) {
      // JWT 토큰을 로컬 스토리지에 저장
      localStorage.setItem('accessToken', access);

      // 리프레시 토큰을 쿠키에 저장
      document.cookie = `refreshToken=${refresh}; path=/; SameSite=None; Secure; Domain=.nolgoat.site`;


      // 원하는 페이지로 리다이렉트
      navigate('/');
    } else {
      // 토큰이 없을 경우 에러 처리 (예: 로그인 페이지로 리다이렉트)
      navigate('/');
    }
  }, [navigate]);

  return (
    <div>
      <h2>Login Successful</h2>
      <p>Redirecting...</p>
    </div>
  );
}

export default LoginSuccess;
