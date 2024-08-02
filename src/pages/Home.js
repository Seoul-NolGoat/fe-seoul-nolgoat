import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddressSearch from '../components/AddressSearch';
import './Home.css';

function Home() {
  const [address, setAddress] = useState('');
  const [radius, setRadius] = useState('');

  const navigate = useNavigate();

  const handleRadiusChange = (e) => {
    setRadius(e.target.value);
  };

  return (
    <div className="home-container">
      <header className="header">
        <div className="header-content">
          <h1 className="title">Seoul NolGoat</h1>
          <p className="description"></p> {/*여기 사이트 설명 문구 추가*/}
          <div className="content">
            <div className="address-search-container">
              <AddressSearch setAddress={setAddress} />
              <select
                value={radius}
                onChange={handleRadiusChange}
                className={`radius-dropdown ${radius === '' ? 'placeholder' : 'selected'}`}
              >
                <option value="" disabled hidden>검색 반경</option>
                <option value="0.5km">0.5km</option>
                <option value="1km">1km</option>
                <option value="1.5km">1.5km</option>
                {/* <option value="2km">2km</option> */}
              </select>
            </div>
          </div>
        </div>
      </header>
      <div className="card-container">
        <div 
          className="custom-card" 
          style={{ cursor: "pointer" }} 
          onClick={() => navigate('/auto-route-planner')} 
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
        <div 
          className="custom-card" 
          style={{ cursor: "pointer" }} 
          // onClick={() => navigate('/interactive-route-planner')} 
        >
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
