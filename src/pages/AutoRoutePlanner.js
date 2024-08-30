import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import RouteCriteria from '../components/RouteCriteria';
import './AutoRoutePlanner.css';
import axiosInstance from '../services/axiosInstance';

const AutoRoutePlanner = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [coordinates, setCoordinates] = useState(null);
  const [radius, setRadius] = useState(null);
  const [criteria, setCriteria] = useState('distance');
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    if (location.state) {
      setCategories(location.state.categories || []);
      setCoordinates(location.state.coordinates);
      setRadius(location.state.radius);
    }
  }, [location.state]);

  const handleSearch = async () => {
    if (!coordinates || !radius || selectedCategories.length === 0) {
      alert('모든 검색 조건을 선택해주세요.');
      return;
    }

    const [latitude, longitude] = coordinates.split(',');
    const categoriesString = selectedCategories.join(',');

    try {
      const response = await axiosInstance.get(`/search/all`, {
        params: {
          'startCoordinate.latitude': latitude,
          'startCoordinate.longitude': longitude,
          'radiusRange': radius,
          'criteria': criteria,
          'categories': categoriesString
        }
      });

      navigate('/auto-route-result', { state: { results: response.data, coordinates: coordinates } });
    } catch (error) {
      console.error('API 호출 중 오류 발생:', error);
      alert('검색 결과를 불러오는 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="auto-route-planner">
      <RouteCriteria 
        allCategories={categories}
        setCoordinates={setCoordinates}
        setRadius={setRadius}
        setCriteria={setCriteria}
        setSelectedCategories={setSelectedCategories}
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
};

export default AutoRoutePlanner;
