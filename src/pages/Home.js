import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AddressSearch from '../components/AddressSearch';
import './Home.css';
import axiosInstance from '../services/axiosInstance';
import { UserContext } from '../contexts/UserContext'; 

function Home() {
  const [address, setAddress] = useState('');
  const [radius, setRadius] = useState('');
  const [coordinates, setCoordinates] = useState(null);

  const navigate = useNavigate();
  const { userProfile } = useContext(UserContext); 

  const handleRadiusChange = (e) => {
    setRadius(e.target.value);
  };

  const fetchCoordinates = async (address) => {
    try {
      const response = await axiosInstance.get(`/kakao/map/coordinate`, {
        params: { address }
      });
      const { latitude, longitude } = response.data;
      const coordString = `${latitude},${longitude}`;
      setCoordinates(coordString);
      return coordString;
    } catch (error) {
      console.error('좌표를 가져오는 중 오류 발생:', error);
      alert('좌표를 가져오는 중 오류가 발생했습니다.');
      throw error;
    }
  };

  const handleSearch = async () => {
    // 사용자가 로그인되지 않은 경우
    if (!userProfile) {
      alert('로그인 후 이용해주세요.');
      return;
    }

    if (!coordinates && !address) {
      alert('위치와 반경을 선택해주세요.');
      return;
    }

    let currentCoordinates = coordinates;
    if (!currentCoordinates || currentCoordinates === 'undefined,undefined') {
      try {
        currentCoordinates = await fetchCoordinates(address);
      } catch (error) {
        return;
      }
    }

    if (!radius) {
      alert('반경을 선택해주세요.');
      return;
    }

    try {
      const response = await axiosInstance.get(`/search/possible/categories`, {
        params: {
          'startCoordinate.latitude': currentCoordinates.split(',')[0],
          'startCoordinate.longitude': currentCoordinates.split(',')[1],
          'radiusRange': radius
        }
      });

      const categories = response.data.map(category => category.replace(/,/g, '·'));
      navigate('/auto-route-planner', { state: { categories, coordinates: currentCoordinates, radius } });
    } catch (error) {
      console.error('API 호출 중 오류 발생:', error);
      alert('카테고리를 불러오는 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="home-container">
      <header className="header">
        <div className="header-content">
          <h1 className="title">Seoul NolGoat</h1>
          <p className="description"></p>
          <div className="content">
            <div className="address-search-container">
              <AddressSearch setAddress={setAddress} setCoordinates={setCoordinates} />
              <select
                value={radius}
                onChange={handleRadiusChange}
                className={`radius-dropdown ${radius === '' ? 'placeholder' : 'selected'}`}
              >
                <option value="" disabled hidden>검색 반경</option>
                <option value="0.5">0.5km</option>
                <option value="1">1km</option>
                <option value="1.5">1.5km</option>
              </select>
            </div>
          </div>
        </div>
      </header>
      <div className="card-container">
        <div
          className="custom-card"
          style={{ cursor: "pointer" }}
          onClick={handleSearch}
        >
          <img
            src={require('../assets/home-icons/auto-route-planner.png')}
            className="card-img"
            alt="Auto Route Planner"
          />
          <div className="card-text-content">
            <p className="card-place-text">Auto Route</p>
            <p className="card-desc-text">Description</p>
          </div>
        </div>
        <div className="custom-card" style={{ cursor: "pointer" }}>
          <img
            src={require('../assets/home-icons/Interactive-route-planner.png')}
            className="card-img"
            alt="Interactive Route Planner"
          />
          <div className="card-text-content">
            <p className="card-place-text">Interactive Route</p>
            <p className="card-desc-text">Description</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
