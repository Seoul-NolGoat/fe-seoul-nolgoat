import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axiosInstance from '../services/axiosInstance';

const AccountDeletion = ({ handleAccountDeletion }) => {
  const [showVerification, setShowVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [timer, setTimer] = useState(300); // 5분 = 300초
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let interval;
    if (isTimerRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsTimerRunning(false);
      setShowVerification(false);
    }

    return () => clearInterval(interval);
  }, [isTimerRunning, timer]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleRequestVerification = async () => {
    try {
      setIsLoading(true); // 로딩 상태 활성화
      await axiosInstance.post('/mail/withdrawal/verification');
      
      setShowVerification(true);
      setTimer(300);
      setIsTimerRunning(true);
    } catch (error) {
      console.error('인증번호 요청 실패:', error);
      alert('인증번호 요청에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false); // 로딩 상태 비활성화
    }
  };

  const handleVerifyAndDelete = async () => {
    if (!verificationCode) {
      alert('인증번호를 입력해주세요.');
      return;
    }

    try {
      setIsLoading(true);

      // 인증번호 확인 
      const verifyResponse = await axiosInstance.post('/auths/withdrawal/verification', { inputCode: verificationCode });

      if (!verifyResponse.data) {
        alert('인증번호가 올바르지 않습니다.');
        return;
      }

      // 회원탈퇴
      await handleAccountDeletion();
    } catch (error) {
      alert('회원탈퇴에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Title>회원탈퇴</Title>
      <Card>
        <WarningText>
          ⚠️ 회원탈퇴 시 모든 데이터가 영구적으로 삭제되며, 이 작업은 되돌릴 수 없습니다.
        </WarningText>

        <InputGroup>
          {!showVerification && (
            <Button 
              onClick={handleRequestVerification}
              disabled={isLoading}
            >
              {isLoading ? '요청 중...' : '인증번호 요청'}
            </Button>
          )}
        </InputGroup>

        {showVerification && (
          <VerificationWrapper>
            <InputWrapper>
              <Input
                type="text"
                placeholder="인증번호 4자리를 입력해주세요"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                maxLength={4}
              />
              <Timer>{formatTime(timer)}</Timer>
            </InputWrapper>
            
            <Button 
              bgColor="#e74c3c"
              onClick={handleVerifyAndDelete}
              disabled={isLoading || !verificationCode || verificationCode.length !== 4}
            >
              인증 후 탈퇴하기
            </Button>
          </VerificationWrapper>
        )}
      </Card>
    </Container>
  );
};

const Container = styled.div`
  max-width: 480px;
  margin: 0 auto;
  padding: 40px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
  color: #333;
  text-align: center;
  font-family: "Nanum Gothic", sans-serif;
`;

const Card = styled.div`
  padding: 25px 0;
  border-radius: 12px;
`;

const WarningText = styled.p`
  margin-bottom: 24px;
  color: #e74c3c;
  font-size: 14px;
  text-align: left;
  line-height: 1.6;
`;

const InputGroup = styled.div`
  margin-bottom: 20px;
`;

const Button = styled.button`
  width: 100%;
  margin-top: 30px;
  padding: 10px 0;
  border: none;
  border-radius: 8px;  
  background-color: ${({ bgColor }) => bgColor || '#bbbbbb'};
  color: white;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: opacity 0.2s;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    opacity: 0.9;
  }
`;

const InputWrapper = styled.div`
  width: 100%;
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  margin-top: 8px;
  padding: 12px;
  padding-right: 60px;  
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #e74c3c;
  }
`;

const Timer = styled.div`
  position: absolute;
  right: 15px;
  top: 55%;
  transform: translateY(-50%);
  color: #e74c3c;
  font-size: 14px;
`;

const VerificationWrapper = styled.div`
  margin-top: 20px;
`;

export default AccountDeletion;
