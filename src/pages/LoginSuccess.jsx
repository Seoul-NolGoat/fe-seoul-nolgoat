import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';

function LoginSuccess() {
  const navigate = useNavigate();
  const { setAccessToken } = useContext(UserContext);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const access = urlParams.get('access');
    
    if (access) {
      // JWT 토큰을 로컬 스토리지에 저장
      localStorage.setItem('accessToken', access);
      setAccessToken(access);
      navigate('/');
    } else {
      // 토큰이 없을 경우 에러 처리 (예: 로그인 페이지로 리다이렉트)
      navigate('/');
    }
  }, [navigate, setAccessToken]);

  return (
    <div>
      <h2>Login Successful</h2>
      <p>Redirecting...</p>
    </div>
  );
}

export default LoginSuccess;
