import React, { createContext, useState, useEffect } from 'react';
import axiosInstance from '../services/axiosInstance';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));
  const [loading, setLoading] = useState(true);

  // useEffect(() => {alert(userProfile)}, [userProfile]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      // 로컬 스토리지에서 accessToken을 가져옴
      const accessToken = localStorage.getItem('accessToken');

      // accessToken이 있는 경우에만 API 호출
      if (accessToken) {
        try {
          const response = await axiosInstance.get('/auths/me');
          if (response.status === 200 && response.data) {
            setUserProfile(response.data);
          } else {
            setUserProfile(null); // 로그인되지 않은 상태
          }
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
          setUserProfile(null);
        }
      } else {
        setUserProfile(null); // accessToken이 없으면 로그인되지 않은 상태
      }
      setLoading(false);
    };

    fetchUserProfile();
  }, [accessToken]);

  return (
    <UserContext.Provider value={{ userProfile, setUserProfile, setAccessToken, loading  }}>
      {children}
    </UserContext.Provider>
  );
};
