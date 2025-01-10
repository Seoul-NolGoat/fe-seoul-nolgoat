import React, { useEffect } from 'react';
import styled from 'styled-components';

const { kakao } = window;

const RoadViewModal = ({ latitude, longitude, onClose }) => {
  useEffect(() => {
    if (latitude && longitude) {
      const roadviewContainer = document.getElementById('roadview-modal'); 
      const roadview = new kakao.maps.Roadview(roadviewContainer); 
      const roadviewClient = new kakao.maps.RoadviewClient();
      const position = new kakao.maps.LatLng(latitude, longitude);

      roadviewClient.getNearestPanoId(position, 50, (panoId) => {
        roadview.setPanoId(panoId, position);
      });
    }
  }, [latitude, longitude]);

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
`

const RoadviewModalContent = styled.div`
  width: 80%;
  max-width: 800px;
  padding: 30px 15px 15px 15px;
  border-radius: 8px;
  background: white;
  position: relative;
`

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

const RoadviewModalContainer  = styled.div`
  width: 100%;
  height: 500px;
`

export default RoadViewModal;
