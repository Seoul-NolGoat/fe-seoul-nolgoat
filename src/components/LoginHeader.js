import React, { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import defaultProfile from "../assets/default-profile.png";
import "./LoginHeader.css";
import { UserContext } from '../contexts/UserContext'; 

const Header = ({ handleLogout, openLoginModal, openRegisterModal, handleHostModeClick }) => {
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

  const handleInquiriesClick = () => {
    navigate("/inquiries");
    setShowMenu(false);
  };

  return (
    <header className="login-header">
      <div className="nav-logo">
        <a href="/">Seoul NolGoat</a>
      </div>
      <div className="profile-container">
        {userProfile && (
          <span className="welcome-message">
            <span className="bold-name">{userProfile.nickname}</span> 님
          </span>
        )}
        <div className="nav-tab-container" onClick={handleProfileClick} ref={profileRef}>
          <div className="hamburger-menu">
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
          </div>
          <img
            src={userProfile?.profileImage || defaultProfile}
            alt="Profile"
            className="profile-image"
          />
        </div>
      </div>
      {showMenu && (
        <div
          className="menu-container"
          ref={menuRef}
          style={{
            top: profileRef.current.getBoundingClientRect().bottom + window.scrollY + 10,
            left: profileRef.current.getBoundingClientRect().left + window.scrollX - 20,
          }}
        >
          {userProfile ? (
            <>
              <button className="menu-button" onClick={handleFavoritesClick}>
                즐겨찾기
              </button>
              <button className="menu-button" onClick={handleInquiriesClick}>
                게시판
              </button>
              <button className="menu-button" onClick={handleLogout}>
                로그아웃
              </button>
            </>
          ) : (
            <>
              <button className="menu-button" onClick={openLoginModal}>
                로그인
              </button>
              <button className="menu-button" onClick={openRegisterModal}>
                회원 가입
              </button>
              <button className="menu-button" onClick={handleInquiriesClick}>
                게시판
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
