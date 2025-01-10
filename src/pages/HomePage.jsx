import React, { useContext } from 'react';
import styled from 'styled-components';
import { UserContext } from '../contexts/UserContext'; 
import { useNavigate } from 'react-router-dom'; 

// 이미지 임포트
import ShopImage from '../assets/home-icons/shop.png';      
import CombineImage from '../assets/home-icons/combine.png'; 
import PartyImage from '../assets/home-icons/party.png';   

const HomePage = () => {
  const { userProfile } = useContext(UserContext); 
  const navigate = useNavigate(); 

  return (
    <HomeContainer>
      {/* 환영 메시지 */}
      <WelcomeCard>
        <p>{userProfile.nickname}님 환영합니다!</p>
      </WelcomeCard>

      {/* 상단 메뉴 */}
      <MenuContainer>
        <MenuItem onClick={() => navigate('/search')}>
          <Image src={ShopImage} alt="상점" />
          상점
        </MenuItem>
        <MenuItem onClick={() => navigate('/route-planner')}>
          <Image src={CombineImage} alt="조합" />
          조합
        </MenuItem>
        <MenuItem onClick={() => navigate('/party')}>
          <Image src={PartyImage} alt="파티" />
          파티
        </MenuItem>
      </MenuContainer>

      {/* 하단 버튼 */}
      <ButtonContainer>
        <Button onClick={() => navigate('/favorites')}>
          <IconWrapper>
            <i className="fa-solid fa-star"></i>
          </IconWrapper>
          즐겨찾기
        </Button>
        <Button onClick={() => navigate('/notice-inquiry-tab')}>
          <IconWrapper>
            <i className="fa-solid fa-bullhorn"></i>
          </IconWrapper>
          공지 / 게시판
        </Button>
      </ButtonContainer>
    </HomeContainer>
  );
};


const HomeContainer = styled.div`
  margin-top: 10px;
  padding: 20px;
`;

const WelcomeCard = styled.div`
  margin-bottom: 20px;
  padding: 15px;
  border-radius: 8px;
  background-color: #eaf4ff;
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  color: #007bff;
`;

const MenuContainer = styled.div`
  margin-bottom: 20px;
  padding: 15px;
  border-radius: 10px;
  display: flex;
  justify-content: space-around;
  background-color: #f1f1f1;
`;

const MenuItem = styled.div`
  width: 29%;
  padding: 10px 20px;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 16px;
  font-weight: bold;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: 0.2s;
  box-sizing: border-box;
  cursor: pointer;

  &:hover {
    background-color: #eaf4ff;
  }
`;

const Image = styled.img`
  width: 50px;
  height: 50px;
  margin-bottom: 8px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
`;

const Button = styled.div`
  width: 35%;
  padding: 10px 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.2s;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: #f8f9fa;
  }
`;

const IconWrapper = styled.div`
  margin-right: 8px;
  font-size: 18px;
  color: #007bff;
`;

export default HomePage;
