import React, { useState, useContext, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import AddressSearch from '../components/AddressSearch';
import RouteCriteria from '../components/RouteCriteria';
import axiosInstance from '../services/axiosInstance';
import { UserContext } from '../contexts/UserContext';
import Loader from '../components/Loader';

const Home = () => {
  const [address, setAddress] = useState('');
  const [radius, setRadius] = useState('');
  const [coordinates, setCoordinates] = useState(null);
  const [categories, setCategories] = useState([]);
  const [criteria, setCriteria] = useState('distance');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPlanner, setShowPlanner] = useState(false);
  const titleRef = useRef(null);

  const navigate = useNavigate();
  const { userProfile } = useContext(UserContext);

  useEffect(() => {
    if (showPlanner && titleRef.current) {
      titleRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [showPlanner]);

  useEffect(() => {
    setShowPlanner(false);
  }, [address, radius]);

  // 반경 변경 핸들러
  const handleRadiusChange = (e) => {
    setRadius(e.target.value);
  };

  // 좌표 요청
  const fetchCoordinates = async (address) => {
    try {
      const response = await axiosInstance.get(`/kakao/map/coordinate`, {
        params: { address },
      });
      const { latitude, longitude } = response.data;
      const coordString = `${latitude},${longitude}`;
      setCoordinates(coordString);
      return coordString;
    } catch (error) {
      console.error('좌표 오류:', error);
      alert('좌표를 가져오는 중 오류가 발생했습니다.');
      throw error;
    }
  };

  // 자동 경로 검색 시작
  const handleAutoRouteSearch = async () => {
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
          radiusRange: radius,
        },
      });

      const formattedCategories = response.data.map((category) =>
        category.replace(/,/g, '·')
      );
      setCategories(formattedCategories);
      setShowPlanner(true); // AutoRoutePlanner 표시
    } catch (error) {
      console.error('API 오류:', error);
      alert('카테고리를 불러오는 중 오류가 발생했습니다.');
    }
  };

  // 검색 실행
  const handleSearch = async () => {
    if (!coordinates || !radius || selectedCategories.length === 0) {
      alert('모든 검색 조건을 선택해주세요.');
      return;
    }

    const [latitude, longitude] = coordinates.split(',');
    const categoriesString = selectedCategories.join(',');

    try {
      setLoading(true);
      const response = await axiosInstance.get(`/search/all`, {
        params: {
          'startCoordinate.latitude': latitude,
          'startCoordinate.longitude': longitude,
          'radiusRange': radius,
          'criteria': criteria,
          'categories': categoriesString,
        },
      });

      setLoading(false);
      // 페이지 이동
      navigate('/auto-route-result', {
        state: { results: response.data, coordinates: coordinates },
      });
    } catch (error) {
      setLoading(false);
      console.error('검색 오류:', error);
      alert('검색 결과를 불러오는 중 오류가 발생했습니다.');
    }
  };

  return (
    <HomeContainer>
      <Title>
        기준이 되는 주소와<br/>검색 반경을 입력해주세요
      </Title>

      <Section>
        <SubTitle>주소 입력</SubTitle>
        <AddressSearch
        setAddress={setAddress}
        setCoordinates={setCoordinates}
        />

        <SubTitle>반경 선택</SubTitle>
        <RadiusDropdown
          value={radius}
          onChange={handleRadiusChange}
          isSelected={radius !== ''}
        >
          <option value="" disabled hidden>
            검색 반경
          </option>
          <option value="0.5">0.5km</option>
          <option value="1">1km</option>
          <option value="1.5">1.5km</option>
        </RadiusDropdown>
      </Section>

      {!showPlanner && (
        <ButtonContainer>
          <SelectButton onClick={handleAutoRouteSearch}>
            상점 카테고리 선택하기
          </SelectButton>
        </ButtonContainer>
      )}
    
      {showPlanner && (
        <RouteCriteriaContainer> 
          <Title ref={titleRef} marginTop="100px">
            조합 추천의 우선순위와<br/>카테고리를 선택해주세요
          </Title>
          <RouteCriteria
            allCategories={categories}
            setCoordinates={setCoordinates}
            setRadius={setRadius}
            setCriteria={setCriteria}
            setSelectedCategories={setSelectedCategories}
          />
          <ButtonContainer>
            <SelectButton onClick={handleSearch}>
              조합 생성하기
            </SelectButton>
          </ButtonContainer>
          {loading && (
            <Loader loading={loading} />
          )}
        </RouteCriteriaContainer>
      )}
    </HomeContainer>
  );
};

export default Home;

const HomeContainer = styled.div`
  height: 80vh;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
`;

const RouteCriteriaContainer = styled.div`
  min-height: auto;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ButtonContainer = styled.div`
  width: 100%;
  margin-bottom: 70px;
  padding: 0 30px;
  display: flex;
  justify-content: center;
  box-sizing: border-box;
`;

const SelectButton = styled.button`
  width: 100%;
  margin-top: 35px;
  padding: 10px 0;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  color: white;
  background-color: #007bff;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #1f64cc;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

const Section = styled.div`
  width: 100%;
  padding: 0 30px;
  text-align: left;
  box-sizing: border-box;
`

const Title = styled.h1`
  width: 100%;
  padding: 10px 30px;
  margin-top: ${(props) => props.marginTop || '10px'}; 
  margin-bottom: 10px;
  box-sizing: border-box;
  font-size: 22px;
  font-weight: bold;
  line-height: 1.6;
  color: #181F29;
  text-align: left;
  font-family: "Nanum Gothic", sans-serif;
`;

const SubTitle = styled.h2`
  width: 100%;
  font-size: 15px;
  font-weight: 500;
  color: #0062ff;
  text-align: left;
  font-family: "Noto Sans KR", serif;
`

const RadiusDropdown = styled.select`
  width: 100px;
  padding: 8px 8px 8px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  color: ${(props) => (props.isSelected ? 'black' : 'gray')};

  option {
    color: black;
  }

  option[disabled] {
    color: gray;
  }
`;