import React, { useState } from "react";
import styled from 'styled-components';
import config from '../config/config.js';

import kakaoLogo from '../assets/login-icons/kakao-logo.png';
import googleLogo from '../assets/login-icons/google-logo.png';
import logoImage from '../assets/home-icons/nolgoat.png'

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleKakaoLogin = () => {
    window.location.href = `${config.BASE_URL}/oauth2/authorization/kakao`;
  };

  const handleGoogleLogin = () => {
    window.location.href = `${config.BASE_URL}/oauth2/authorization/google`;
  };

  return (
    <LoginContainer>
      <LogoWrapper>
        <LogoImage src={logoImage} alt="Logo" />
        <Title1>NolGoat</Title1>
        <Title2>SEOUL</Title2>
      </LogoWrapper>

      {error && <ErrorMessage>{error}</ErrorMessage>}
      <KakaoLoginButton onClick={handleKakaoLogin}>
        <KakaoIcon src={kakaoLogo} alt="Kakao Logo" />
        카카오 로그인
      </KakaoLoginButton>
      <GoogleLoginButton onClick={handleGoogleLogin}>
        <GoogleIcon src={googleLogo} alt="Google Logo" />
        구글 로그인
      </GoogleLoginButton>
    </LoginContainer>
  );
};

const LoginContainer = styled.div`
  height: 100%;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center; 
  box-sizing: border-box;
`;

const LogoWrapper = styled.div`
  margin-bottom: 70px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const LogoImage = styled.img`
  width: 150px;
  margin-bottom: 10px;
`;

const Title1 = styled.h1`
  margin: 0;
  font-family: "Source Sans 3", serif;
  font-size: 45px;
  font-weight: 600;
  line-height: 1;
  letter-spacing: 2px;
`;

const Title2 = styled.h2`
  margin: 0;
  font-family: "Work Sans", serif;
  font-size: 25px;
  font-weight: 300;
  letter-spacing: 1.8px;
`;

const SocialLoginButton = styled.button`
  width: 100%;
  padding: 13px;
  margin-top: 10px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const KakaoLoginButton = styled(SocialLoginButton)`
  background-color: #ffe609;
  color: #371d1e;
  font-family: "Jua", serif;
`;

const GoogleLoginButton = styled(SocialLoginButton)`
  background-color: #f0f0f0;
  color: #000000;
  font-family: "Jua", serif;
`;

const KakaoIcon = styled.img`
  width: 20px;
  height: 20px;
  margin-right: 10px;
`;

const GoogleIcon = styled.img`
  width: 20px;
  height: 20px;
  margin-right: 10px;
`;

const ErrorMessage = styled.p`
  margin-bottom: 15px;
  color: red;
`;

export default Login;
