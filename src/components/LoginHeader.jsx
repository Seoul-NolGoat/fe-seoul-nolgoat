import React, { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import defaultProfile from "../assets/default-profile.png";
import { UserContext } from '../contexts/UserContext'; 
import logoImage from '../assets/home-icons/nolgoat.png'

const Header = () => {
  const { userProfile } = useContext(UserContext); 
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  const handleProfileClick = () => {
    setShowMenu(!showMenu);
  };

  const handleClickOutside = (event) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(event.target) &&
      profileRef.current &&
      !profileRef.current.contains(event.target)
    ) {
      setShowMenu(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleFavoritesClick = () => {
    navigate("/favorites");
    setShowMenu(false);
  };

  const handleNoticeInquiryClick = () => {
    navigate("/notice-inquiry-tab");
    setShowMenu(false);
  };

  return (
    <LoginHeader>
      <LogoContainer onClick={() => navigate("/")}>
        <LogoIcon src={logoImage} alt="Logo" />
        <LogoText>NolGoat</LogoText>
      </LogoContainer>

      <ProfileContainer>
          <ProfileImage src={userProfile?.profileImage || defaultProfile} alt="Profile" />        
      </ProfileContainer>
    </LoginHeader>
  );
};

export default Header;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const LogoIcon = styled.img`
  height: 30px;
  margin-right: 1px;
`;

const LogoText = styled.a`
  font-size: 20px;
  font-weight: 700;
  text-decoration: none;
  color: #333;
  line-height: 32px;
  font-family: "Source Sans 3", serif;
`;

const LoginHeader = styled.header`
  width: 100%;
  padding: 10px 15px 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: transparent;
  box-sizing: border-box;
`;

const ProfileContainer = styled.div`
  display: flex;
  align-items: center;
`;

const ProfileImage = styled.img`
  width: 30px;
  height: 30px;
  border: 1px solid #ccc;
  border-radius: 50%;
  cursor: pointer;
`;
