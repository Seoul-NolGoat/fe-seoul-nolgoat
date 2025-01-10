import React, { useState } from 'react';
import styled from "styled-components";
import gpsIcon from '../assets/address-icons/gps.png';
import searchIcon from '../assets/address-icons/search.png';
import axiosInstance from '../services/axiosInstance';


const AddressSearch = ({ setAddress, setCoordinates }) => {
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
    setAddress(fullAddress);
    setCoordinates(`${data.y},${data.x}`);
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
            const response = await axiosInstance.get(`/kakao/map/lot-address`, {
              params: {
                latitude,
                longitude
              }
            });

            if (response.status === 200) {
              const address = response.data;
              setAddressState(address);
              setAddress(address);
              setCoordinates(`${latitude},${longitude}`);
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
    <AddressSearchContainer>
      <GpsButton onClick={handleCurrentLocation}>
        <Icon src={gpsIcon} alt="GPS" />
      </GpsButton>
      <AddressInput placeholder="주소 검색" value={address} readOnly />
      <SearchButton onClick={sample4_execDaumPostcode}>
        <Icon src={searchIcon} alt="Search" />
      </SearchButton>
    </AddressSearchContainer>
  );
};

const AddressSearchContainer  = styled.div`
  margin-bottom: 20px;
  display: flex;
  align-items: center;
`;

export const AddressInput = styled.input.attrs({ type: "text" })`
  width: 200px;
  margin: 0 5px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  flex: 1;
`;

export const SearchButton = styled.button`
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #ffffff;
  cursor: pointer;

  &:hover {
    background-color: #e9e9e9;
  }  
`;

export const GpsButton = styled.button`
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  cursor: pointer;

  &:hover {
    background-color: #e9e9e9;
  }
`;

export const Icon = styled.img`
  width: 25.5px;
  height: 25.5px;
`;

export default AddressSearch;
