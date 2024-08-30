import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './AutoRouteResult.css';
import StarRating from '../components/StarRating';
import walkingIcon from '../assets/route-result-icons/walking.png';
import kakaoIcon from '../assets/route-result-icons/kakao.png';
import nolgoatIcon from '../assets/route-result-icons/nolgoat.png';

const { kakao } = window;

const AutoRouteResult = () => {
  const location = useLocation();
  const [results, setResults] = useState([]);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [overlays, setOverlays] = useState([]);
  const [lines, setLines] = useState([]); // Polyline을 관리할 상태 추가
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(null);

  useEffect(() => {
    if (location.state && location.state.results) {
      setResults(location.state.results);
      const [latitude, longitude] = location.state.coordinates.split(',');
      const container = document.getElementById('map');
      const options = {
        center: new kakao.maps.LatLng(latitude, longitude),
        level: 3,
      };
      const mapInstance = new kakao.maps.Map(container, options);

      const centerPosition = new kakao.maps.LatLng(latitude, longitude);
      new kakao.maps.CustomOverlay({
        position: centerPosition,
        content: '<div class="custom-marker red-marker"></div>',
        map: mapInstance,
      });

      setMap(mapInstance);
    }
  }, [location.state]);

  const displayRouteOnMap = (route, index) => {
    setSelectedRouteIndex(index);

    // 기존 마커와 오버레이 제거
    if (markers.length > 0) {
      markers.forEach(markerObj => {
        if (markerObj && markerObj.marker) {
          markerObj.marker.setMap(null);
        }
        if (markerObj && markerObj.label) {
          markerObj.label.setMap(null);
        }
      });
    }
    if (overlays.length > 0) {
      overlays.forEach(overlay => {
        if (overlay) {
          overlay.setMap(null);
        }
      });
    }
    if (lines.length > 0) {
      lines.forEach(line => {
        if (line) {
          line.setMap(null);
        }
      });
    }

    const newMarkers = route.map((store, index) => {
      if (store) {
        const marker = new kakao.maps.Marker({
          position: new kakao.maps.LatLng(store.coordinate.latitude, store.coordinate.longitude),
          map: map,
          title: store.name,
        });

        const label = new kakao.maps.CustomOverlay({
          position: marker.getPosition(),
          yAnchor: 1.8,
          content: `<div class="custom-marker-label">${index + 1}</div>`,
          map: map,
        });

        return { marker, label };
      }
      return null;
    }).filter(markerObj => markerObj !== null);

    // Polyline을 생성하여 지도에 추가
    const path = [
      new kakao.maps.LatLng(location.state.coordinates.split(',')[0], location.state.coordinates.split(',')[1]),
      ...route.map(store => new kakao.maps.LatLng(store.coordinate.latitude, store.coordinate.longitude))
    ];

    const line = new kakao.maps.Polyline({
      path: path,
      strokeWeight: 3,
      strokeColor: '#808080',
      strokeOpacity: 0.8,
      strokeStyle: 'solid',
    });

    line.setMap(map);

    setMarkers(newMarkers);
    setLines([line]); // Polyline 상태 업데이트
  };

  const handleStoreClick = (store) => {
    if (overlays.length > 0) {
      overlays.forEach(overlay => overlay.setMap(null));
    }

    const overlayContent = `
      <div class="store-name-overlay">
        <strong>${store.name}</strong>
        <div class="overlay-rating">
          <span class="rating-wrapper">
            <img src="${kakaoIcon}" alt="Kakao rating" class="rating-icon" />
            <span>${store.kakaoAverageGrade}</span>
          </span>
          <span class="rating-wrapper">
            <img src="${nolgoatIcon}" alt="Nolgoat rating" class="rating-icon" />
            <span>${store.nolgoatAverageGrade}</span>
          </span>
        </div>
      </div>
    `;

    const overlay = new kakao.maps.CustomOverlay({
      position: new kakao.maps.LatLng(store.coordinate.latitude, store.coordinate.longitude),
      content: overlayContent,
      map: map,
    });

    setOverlays([overlay]);
  };

  return (
    <div className="auto-route-result">
      <div className="results-list">
        {results.map((route, index) => {
          const stores = [route.firstStore, route.secondStore, route.thirdStore].filter(store => store !== null);
          const storeCount = stores.length;
          return (
            <div 
              key={index} 
              className={`route-item ${selectedRouteIndex === index ? 'active' : ''}`} 
              onClick={() => displayRouteOnMap(stores, index)}
            >
              <div className="route-number">{index + 1}</div>
              <div className="route-info">
                <img src={walkingIcon} alt="walking" className="walking-icon" />
                <span className="route-distance">{route.walkRouteInfoDto.totalDistance}m</span>
              </div>
              <div className="store-info">
                {stores.map((store, idx) => (
                  <div 
                    key={idx} 
                    className="store-item" 
                    style={{ flex: `1 1 ${100 / storeCount}%` }}
                  >
                    <span 
                      className="store-name" 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        if (selectedRouteIndex === index) { 
                          handleStoreClick(store);
                        }
                      }}
                    >
                      {store.name}
                    </span>
                    {idx === 0 && (
                      <>
                        <div className="rating-wrapper">
                          <img src={kakaoIcon} alt="Kakao rating" className="rating-icon" />
                          <StarRating grade={store.kakaoAverageGrade} />
                        </div>
                        <div className="rating-wrapper">
                          <img src={nolgoatIcon} alt="Nolgoat rating" className="rating-icon" />
                          <StarRating grade={store.nolgoatAverageGrade} />
                        </div>
                      </>
                    )}
                    {idx !== 0 && (
                      <>
                        <div className="rating-wrapper">
                          <StarRating grade={store.kakaoAverageGrade} />
                        </div>
                        <div className="rating-wrapper">
                          <StarRating grade={store.nolgoatAverageGrade} />
                        </div>
                      </>
                    )}
                    <div className="store-details">상세보기</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <div id="map" className="map-container"></div>
    </div>
  );
};

export default AutoRouteResult;
