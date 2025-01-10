import React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

const BottomNavigation = () => {
  return (
    <NavContainer>
      <NavItem to="/" end>
        <i className="fa-solid fa-house"></i>
        홈
      </NavItem>
      <NavItem to="/search">
        <i className="fa-solid fa-magnifying-glass"></i>
        상점
      </NavItem>
      <NavItem to="/route-planner">
        <i className="fa-solid fa-route"></i>
        조합
      </NavItem>
      <NavItem to="/party">
        <i className="fas fa-users"></i>
        파티
      </NavItem>
      <NavItem to="/mypage">
        <i className="fa-solid fa-user"></i>
        내 정보
      </NavItem>
    </NavContainer>
  );
};

const NavContainer = styled.nav`
  position: fixed;
  bottom: 0;
  width: 100%;
  max-width: 600px;
  padding: 10px 0;
  border-top: 1px solid #ddd;
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: #f8f8f8;
`;

const NavItem = styled(NavLink)`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 14px;
  text-decoration: none;
  color: #333; /* 기본 색상: 어두운 회색 */
  font-family: "Nanum Gothic", sans-serif;

  i {
    margin-bottom: 5px;
    font-size: 20px;
  }

  &.active {
    color: #007bff; /* 활성화된 상태의 색상: 파란색 */
  }

  &:not(.active) {
    color: #777777; /* 비활성화 상태의 색상: 어두운 회색 */
  }
`;

export default BottomNavigation;
