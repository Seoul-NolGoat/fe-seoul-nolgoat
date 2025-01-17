import React, { useContext } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';

const Mypage = ({ handleLogout }) => {
  const { userProfile } = useContext(UserContext);
  const navigate = useNavigate();

  return (
    <Container>
      <ProfileCard>
        <UserInfo>
          <ProfileImageWrapper>
            <ProfileImage src={userProfile.profileImage} alt="프로필 이미지" />
          </ProfileImageWrapper>
          <UserDetails>
            <UserName>{userProfile.nickname}</UserName>
          </UserDetails>
        </UserInfo>
      </ProfileCard>

      <MenuList>
        <MenuItem>
          <MenuItemContent>
            <MenuItemLeft>
              <span>내가 쓴 리뷰</span>
            </MenuItemLeft>
            <MenuItemRight>
              <i className="fa-solid fa-angle-right"></i>
            </MenuItemRight>
          </MenuItemContent>
        </MenuItem>

        <MenuItem onClick={() => navigate('/account-deletion')}>
          <MenuItemContent>
            <MenuItemLeft>
              <span>회원 탈퇴</span>
            </MenuItemLeft>
            <MenuItemRight>
              <i className="fa-solid fa-angle-right"></i>
            </MenuItemRight>
          </MenuItemContent>
        </MenuItem>

        <MenuItem 
          className="logout" 
          onClick={handleLogout}
        >
          <MenuItemContent>
            <MenuItemLeft>
              <span>로그아웃</span>
            </MenuItemLeft>
            <MenuItemRight>
              <i className="fa-solid fa-angle-right"></i>
            </MenuItemRight>
          </MenuItemContent>
        </MenuItem>
      </MenuList>
    </Container>
  );
};

// 스타일 컴포넌트
const Container = styled.div`
  max-width: 480px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Nanum Gothic', sans-serif;
`;

const ProfileCard = styled.div`
  margin-bottom: 16px;
  padding: 17px 20px;
  border-radius: 16px;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const ProfileImageWrapper = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 2px solid #f0f0f0;
  position: relative;
  overflow: hidden;
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const UserName = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #333;
`;

const MenuList = styled.div`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
`;

const MenuItem = styled.div`
  &:not(:last-child) {
    border-bottom: 1px solid #f0f0f0;
  }

  &.logout {
    color: #ff4d4f;
  }
`;

const MenuItemContent = styled.div`
  padding: 20px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f8f9fa;
  }

  svg {
    font-size: 18px;
  }
`;

const MenuItemLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 17px;
  font-weight: bold;

  svg {
    color: #666;
  }
`;

const MenuItemRight = styled.div`
  font-size: 16px;
  color: #666;
`;

export default Mypage;
