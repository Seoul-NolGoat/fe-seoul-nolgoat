import React, { useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config.js'; 
import './AddressSearch.css';
import gpsIcon from '../assets/address-icons/gps.png';
import searchIcon from '../assets/address-icons/search.png';

const AddressSearch = ({ setAddress }) => {
  const [address, setAddressState] = useState('');

  const handleAddress = (data) => {
    let fullAddress = data.roadAddress;
    let extraAddress = '';

    if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
      extraAddress += data.bname;
    }
    if (data.buildingName !== '' && data.apartment === 'Y') {
      extraAddress += (extraAddress !== '' ? ', ' + data.buildingName : data.buildingName);
    }
    if (extraAddress !== '') {
      fullAddress += ' (' + extraAddress + ')';
    }

    setAddressState(fullAddress);
    setAddress(fullAddress);  // 상위 컴포넌트로 주소 전달
  };

  const sample4_execDaumPostcode = () => {
    new window.daum.Postcode({
      oncomplete: handleAddress
    }).open();
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await axios.get(`${API_BASE_URL}/kakao/map/lot-address`, {
              params: {
                latitude,
                longitude
              }
            });

            if (response.status === 200) {
              const address = response.data;
              setAddressState(address);
              setAddress(address);
            } else if (response.status === 404) {
              alert('위치를 찾을 수 없습니다.');
            } else {
              alert('주소를 가져오는 도중 오류가 발생했습니다.');
            }
          } catch (error) {
            alert('주소를 가져오는 도중 오류가 발생했습니다.');
          }
        },
        (error) => {
          alert('현재 위치를 가져오는 도중 오류가 발생했습니다.');
        }
      );
    } else {
      alert('현재 위치를 가져올 수 있는 기능이 지원되지 않습니다.');
    }
  };

  return (
    <div className="address-search">
      <button onClick={handleCurrentLocation} className="gps-button">
        <img src={gpsIcon} alt="GPS" className="gps-icon" />
      </button>
      <input
        type="text"
        placeholder="주소 검색"
        value={address}
        readOnly
      />
      <button onClick={sample4_execDaumPostcode} className="search-button">
        <img src={searchIcon} alt="Search" className="search-icon" />
      </button>
    </div>
  );
};

export default AddressSearch;
