import React, { createContext, useState, useEffect } from 'react';
import axiosInstance from '../services/axiosInstance';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    // /api/user_profile API를 호출하여 사용자 정보를 가져옴
    const fetchUserProfile = async () => {
      try {
        const response = await axiosInstance.get('/user_profile');
        if (response.status === 200 && response.data) {
          setUserProfile(response.data);
        } else {
          setUserProfile(null); // 로그인되지 않은 상태
        }
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
        setUserProfile(null);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <UserContext.Provider value={{ userProfile, setUserProfile }}>
      {children}
    </UserContext.Provider>
  );
};
