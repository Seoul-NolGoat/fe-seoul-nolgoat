import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const RoadViewModal = ({ latitude, longitude, onClose }) => {
  const [isKakaoLoaded, setIsKakaoLoaded] = useState(false);

  // 카카오맵 로드 확인
  useEffect(() => {
    const checkKakaoMap = () => {
      if (window.kakao && window.kakao.maps) {
        setIsKakaoLoaded(true);
      }
    };

    // 이미 로드되어 있는 경우
    if (window.kakao && window.kakao.maps) {
      setIsKakaoLoaded(true);
      return;
    }

    // 로드되어 있지 않은 경우 이벤트 리스너 추가
    const script = document.querySelector('script[src*="kakao.maps.js"]');
    if (script) {
      script.addEventListener('load', checkKakaoMap);
    }

    return () => {
      if (script) {
        script.removeEventListener('load', checkKakaoMap);
      }
    };
  }, []);

  // 로드맵 초기화
  useEffect(() => {
    if (latitude && longitude && isKakaoLoaded) {
      const roadviewContainer = document.getElementById('roadview-modal'); 
      const roadview = new window.kakao.maps.Roadview(roadviewContainer); 
      const roadviewClient = new window.kakao.maps.RoadviewClient();
      const position = new window.kakao.maps.LatLng(latitude, longitude);

      roadviewClient.getNearestPanoId(position, 50, (panoId) => {
        roadview.setPanoId(panoId, position);
      });
    }
  }, [latitude, longitude, isKakaoLoaded]);

  return (
    <RoadviewModalOverlay onClick={onClose}>
      <RoadviewModalContent onClick={(e) => e.stopPropagation()}>
        <RoadviewModalCloseButton onClick={onClose}> × </RoadviewModalCloseButton>
        <RoadviewModalContainer id="roadview-modal"></RoadviewModalContainer>
      </RoadviewModalContent>
    </RoadviewModalOverlay>
  );
};

const RoadviewModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const RoadviewModalContent = styled.div`
  width: 80%;
  max-width: 800px;
  padding: 30px 15px 15px 15px;
  border-radius: 8px;
  background: white;
  position: relative;
`;

export const RoadviewModalCloseButton = styled.button`
  position: absolute;
  top: 1px;
  right: 3px;
  font-size: 24px;
  color: #555;
  cursor: pointer;
  background: transparent;
  border: none;

  &:hover {
    color: #000; 
  }
`;

const RoadviewModalContainer = styled.div`
  width: 100%;
  height: 500px;
`;

export default RoadViewModal;
