import React, { useEffect } from 'react';
import './RoadViewModal.css'; // 모달 스타일 추가

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
    <div className="roadview-modal-overlay" onClick={onClose}>
      <div className="roadview-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="roadview-modal-close-button" onClick={onClose}> × </button>
        <div id="roadview-modal" className="roadview-modal-container"></div>
      </div>
    </div>
  );
};

export default RoadViewModal;
