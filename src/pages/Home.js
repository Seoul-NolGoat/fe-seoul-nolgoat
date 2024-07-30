import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddressSearch from '../components/AddressSearch';
import './Home.css';

function Home() {
  const [address, setAddress] = useState('');
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <header className="header">
        <h1 className="title">Seoul NolGoat</h1>
        <p className="description">웹사이트 설명</p>
      </header>
      <div className="content">
        <div className="address-search-container">
          <AddressSearch setAddress={setAddress} />
        </div>
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
    </div>
  );
}

export default Home;