import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import './AutoRouteResult.css';
import StarRating from '../components/StarRating';
import walkingIcon from '../assets/route-result-icons/walking.png';
import kakaoIcon from '../assets/route-result-icons/kakao.png';
import nolgoatIcon from '../assets/home-icons/nolgoat-circle.png';
import { Link } from 'react-router-dom';

const AutoRouteResult = () => {
  const location = useLocation();
  const [results, setResults] = useState([]);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [overlays, setOverlays] = useState([]);
  const [lines, setLines] = useState([]);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(null);
  const [isListExpanded, setIsListExpanded] = useState(true);
  const [isKakaoLoaded, setIsKakaoLoaded] = useState(false);
  const selectedRouteRef = useRef(null);

  // Kakao 맵 스크립트 로드 확인
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

  useEffect(() => {
    if (location.state && location.state.results && isKakaoLoaded) {
      setResults(location.state.results);
      const [latitude, longitude] = location.state.coordinates.split(',');
      const container = document.getElementById('map');
      const options = {
        center: new window.kakao.maps.LatLng(latitude, longitude),
        level: 3,
      };
      const mapInstance = new window.kakao.maps.Map(container, options);

      const centerPosition = new window.kakao.maps.LatLng(latitude, longitude);
      new window.kakao.maps.CustomOverlay({
        position: centerPosition,
        content: '<div class="custom-marker red-marker"></div>',
        map: mapInstance,
      });

      setMap(mapInstance);
    }
  }, [location.state, isKakaoLoaded]);

  useEffect(() => {
    if (map) {
      map.relayout();
      const [latitude, longitude] = location.state.coordinates.split(',');
      map.setCenter(new window.kakao.maps.LatLng(latitude, longitude));
    }
  }, [isListExpanded, map, location.state.coordinates]);

  useEffect(() => {
    if (!isListExpanded && selectedRouteIndex !== null && selectedRouteRef.current) {
      selectedRouteRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [isListExpanded, selectedRouteIndex]);

  const displayRouteOnMap = (route, index) => {
    if (!window.kakao || !window.kakao.maps) return;
    
    setSelectedRouteIndex(index);

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
        const marker = new window.kakao.maps.Marker({
          position: new window.kakao.maps.LatLng(store.coordinate.latitude, store.coordinate.longitude),
          map: map,
          title: store.name,
        });

        const label = new window.kakao.maps.CustomOverlay({
          position: marker.getPosition(),
          yAnchor: 1.8,
          content: `<div class="custom-marker-label">${index + 1}</div>`,
          map: map,
        });

        return { marker, label };
      }
      return null;
    }).filter(markerObj => markerObj !== null);

    const path = [
      new window.kakao.maps.LatLng(location.state.coordinates.split(',')[0], location.state.coordinates.split(',')[1]),
      ...route.map(store => new window.kakao.maps.LatLng(store.coordinate.latitude, store.coordinate.longitude))
    ];

    const line = new window.kakao.maps.Polyline({
      path: path,
      strokeWeight: 3,
      strokeColor: '#808080',
      strokeOpacity: 0.8,
      strokeStyle: 'solid',
    });

    line.setMap(map);

    setMarkers(newMarkers);
    setLines([line]);
  };

  const handleStoreClick = (store) => {
    if (!window.kakao || !window.kakao.maps) return;

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

    const overlay = new window.kakao.maps.CustomOverlay({
      position: new window.kakao.maps.LatLng(store.coordinate.latitude, store.coordinate.longitude),
      content: overlayContent,
      map: map,
    });

    setOverlays([overlay]);
  };

  return (
    <div className="auto-route-result">
      <div className={`results-list ${isListExpanded ? 'expanded' : 'collapsed'}`}>
        {results.map((route, index) => {
          const stores = [route.firstStore, route.secondStore, route.thirdStore].filter(store => store !== null);
          const storeCount = stores.length;
          return (
            <div 
              key={index} 
              className={`route-item ${selectedRouteIndex === index ? 'active' : ''}`} 
              onClick={() => displayRouteOnMap(stores, index)}
              ref={selectedRouteIndex === index ? selectedRouteRef : null}
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
                    <Link to={`/store/${store.id}`} className="store-details">상세보기</Link>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        <div 
          className="toggle-list-arrow"
          onClick={() => setIsListExpanded(!isListExpanded)}
        >
          {isListExpanded ? '▲' : '▼'}
        </div>
      </div>
      <div id="map" className={`${isListExpanded ? 'map-container' : 'map-container-collapsed'}`}></div>
    </div>
  );
};

export default AutoRouteResult;
