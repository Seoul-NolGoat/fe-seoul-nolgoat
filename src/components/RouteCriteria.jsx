import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import './RouteCriteria.css';
import koreanIcon from '../assets/category-icons/korean.png';
import chineseIcon from '../assets/category-icons/chinese.png';
import japaneseIcon from '../assets/category-icons/japanese.png';
import grilledMeatIcon from '../assets/category-icons/grilled-meat.png';
import bossamIcon from '../assets/category-icons/bossam.png';
import chickenIcon from '../assets/category-icons/chicken.png';
import burgerIcon from '../assets/category-icons/burger.png';
import pizzaIcon from '../assets/category-icons/pizza.png';
import stewIcon from '../assets/category-icons/stew.png';
import soupIcon from '../assets/category-icons/soup.png';
import lambIcon from '../assets/category-icons/lamb.png';
import sushiIcon from '../assets/category-icons/sushi.png';
import ramenIcon from '../assets/category-icons/ramen.png';
import bunsikIcon from '../assets/category-icons/bunsik.png';
import pubIcon from '../assets/category-icons/pub.png';
import seafoodIcon from '../assets/category-icons/seafood.png';
import gopchangIcon from '../assets/category-icons/gopchang.png';
import sashimiIcon from '../assets/category-icons/sashimi.png';
import buffetIcon from '../assets/category-icons/buffet.png';
import asianIcon from '../assets/category-icons/asian.png';
import cafeIcon from '../assets/category-icons/cafe.png';
import karaokeIcon from '../assets/category-icons/karaoke.png';
import pcroomIcon from '../assets/category-icons/pcroom.png';
import billiardsIcon from '../assets/category-icons/billiards.png';
import kakaoIcon from '../assets/route-result-icons/kakao.png';
import nolgoatIcon from '../assets/home-icons/nolgoat-circle.png';
import walkingIcon from '../assets/route-result-icons/walking.png';

const RouteCriteria = ({ allCategories, setCriteria, setSelectedCategories }) => {
  const [activeTab, setActiveTab] = useState(1);
  const [priority, setPriority] = useState('distance');
  const [conditions, setConditions] = useState({
    1: { category: '', displayName: '' },
    2: { category: '', displayName: '' },
    3: { category: '', displayName: '' }
  });
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    setCriteria(priority);
    const selectedCategories = Object.values(conditions)
      .map(condition => condition.category)
      .filter(category => category !== '');
    setSelectedCategories(selectedCategories);
  }, [priority, conditions, setCriteria, setSelectedCategories]);

  const handleTabClick = (tabNumber) => {
    setActiveTab(tabNumber);
  };

  const handleConditionChange = (tabNumber, type, value, displayName) => {
    setConditions((prevConditions) => ({
      ...prevConditions,
      [tabNumber]: {
        ...prevConditions[tabNumber],
        [type]: prevConditions[tabNumber][type] === value ? '' : value,
        displayName: prevConditions[tabNumber][type] === value ? '' : displayName
      }
    }));
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    if (value) {
      const filteredSuggestions = allCategories.filter(category =>
        category.toLowerCase().startsWith(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (tabNumber, value) => {
    handleConditionChange(tabNumber, 'category', value, value);
    setInputValue('');
    setSuggestions([]);
  };

  const restaurantCategories = [
    { name: '한식', value: 'KOREAN_FOOD', icon: koreanIcon },
    { name: '중식', value: 'CHINESE_CUISINE', icon: chineseIcon },
    { name: '일식', value: 'JAPANESE_FOOD', icon: japaneseIcon },
    { name: '육류·고기', value: 'MEAT', icon: grilledMeatIcon },
    { name: '족발·보쌈', value: 'JOKBAL_BOSSAM', icon: bossamIcon },
    { name: '치킨', value: 'CHICKEN', icon: chickenIcon },
    { name: '햄버거', value: 'HAMBURGER', icon: burgerIcon },
    { name: '피자', value: 'PIZZA', icon: pizzaIcon },
    { name: '찌개·전골', value: 'JJIGAE', icon: stewIcon },
    { name: '국밥', value: 'GUKBAP', icon: soupIcon },
    { name: '양꼬치', value: 'LAMB_SKEWER', icon: lambIcon },
    { name: '초밥·롤', value: 'SUSHI_ROLL', icon: sushiIcon },
    { name: '라멘', value: 'RAMEN', icon: ramenIcon },
    { name: '분식', value: 'BUNSIK', icon: bunsikIcon },
    { name: '술집', value: 'PUB', icon: pubIcon },
    { name: '해산물', value: 'SEAFOOD', icon: seafoodIcon },
    { name: '곱창·막창', value: 'GOBCHANG_MAKCHANG', icon: gopchangIcon },
    { name: '회', value: 'SASHIMI', icon: sashimiIcon },
    { name: '뷔페', value: 'BUFFET', icon: buffetIcon },
    { name: '아시아음식', value: 'ASIAN_CUISINE', icon: asianIcon }
  ];

  const entertainmentCategories = [
    { name: '카페', value: 'CAFE', icon: cafeIcon },
    { name: '노래방', value: 'KARAOKE', icon: karaokeIcon },
    { name: 'PC방', value: 'PCROOM', icon: pcroomIcon },
    { name: '당구장', value: 'BILLIARD', icon: billiardsIcon }
  ];

  const priorityOptions = [
    { display: '이동 거리', value: 'distance', icon: walkingIcon },
    { display: '카카오 평점', value: 'kakaoGrade', icon: kakaoIcon },
    { display: '놀곳 평점', value: 'nolgoatGrade', icon: nolgoatIcon }
  ];

  const renderTabText = (tabNumber) => {
    const { category, displayName } = conditions[tabNumber];
    return (
      <div className="tab-text">
        <span className="tab-number">{tabNumber}</span>
        {category && (
          <>
            <span className="tab-separator">|</span>
            <span className="tab-category">{displayName || category}</span>
          </>
        )}
      </div>
    );
  };

  const isCategorySelectable = (tabNumber) => {
    if (tabNumber === 1) return true;
    return conditions[tabNumber - 1].category !== '';
  };

  return (
    <div className="route-options">
      <div className="priority-section">
        <SubTitle>조합 조건 선택</SubTitle>
        <div className="options">
          {priorityOptions.map((option, index) => (
            <button
              key={index}
              className={`condition-option ${priority === option.value ? 'selected' : ''}`}
              onClick={() => setPriority(option.value)}
            >
              <img 
                src={option.icon} 
                alt={option.display} 
                style={{ width: '16px', height: '16px', marginRight: '8px' }} 
              />
              {option.display}
            </button>
          ))}
        </div>
      </div>
      <div className="category-section">
        <SubTitle>카테고리 선택</SubTitle>
        <div className="tabs">
          {[1, 2, 3].map((tabNumber) => (
            <div
              key={tabNumber}
              className={`tab ${activeTab === tabNumber ? 'active' : ''}`}
              onClick={() => handleTabClick(tabNumber)}
            >
              {renderTabText(tabNumber)}
            </div>
          ))}
        </div>
        <div className="tab-content">
          {[1, 2, 3].map((tabNumber) => (
            <div
              key={tabNumber}
              className={`tab-pane ${activeTab === tabNumber ? 'active' : ''}`}
            >
            {/* 입력창 임시 주석처리 */} 
            {/* <div className="input-container">
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="search category"
                className="category-input"
              />
              {suggestions.length > 0 && (
                <ul className="suggestions-list">
                  {suggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      onClick={() => handleSuggestionClick(tabNumber, suggestion)}
                    >
                      {suggestion}
                    </li>
                  ))}
                </ul>
              )}
            </div> */}
              <div className="condition-selector">
                {/* <label className="condition-label">음식점</label> */}
                <div className="options category-options">
                  {restaurantCategories.map((category, index) => (
                    <button
                      key={index}
                      className={`option ${conditions[tabNumber].category === category.value ? 'selected' : ''}`}
                      onClick={() => handleConditionChange(tabNumber, 'category', category.value, category.name)}
                      disabled={!allCategories.includes(category.value) || !isCategorySelectable(tabNumber)}
                    >
                      <img src={category.icon} alt={category.name} className="category-icon" />
                      <span>{category.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="condition-selector">
                {/* <label className="condition-label">놀거리</label> */}
                <div className="options category-options">
                  {entertainmentCategories.map((category, index) => (
                    <button
                      key={index}
                      className={`option ${conditions[tabNumber].category === category.value ? 'selected' : ''}`}
                      onClick={() => handleConditionChange(tabNumber, 'category', category.value, category.name)}
                      disabled={!allCategories.includes(category.value) || !isCategorySelectable(tabNumber)}
                    >
                      <img src={category.icon} alt={category.name} className="category-icon" />
                      <span>{category.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RouteCriteria;

const SubTitle = styled.h2`
  width: 100%;
  font-size: 15px;
  font-weight: 500;
  color: #0062ff;
  text-align: left;
  font-family: "Noto Sans KR", serif;
`