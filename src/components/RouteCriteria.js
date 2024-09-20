import React, { useState, useEffect } from 'react';
import './RouteCriteria.css';

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
    { name: '한식', icon: require('../assets/category-icons/korean.png') },
    { name: '중식', icon: require('../assets/category-icons/chinese.png') },
    { name: '일식', icon: require('../assets/category-icons/japanese.png') },
    { name: '육류·고기', icon: require('../assets/category-icons/grilled-meat.png') },
    { name: '족발·보쌈', icon: require('../assets/category-icons/bossam.png') },
    { name: '치킨', icon: require('../assets/category-icons/chicken.png') },
    { name: '햄버거', icon: require('../assets/category-icons/burger.png') },
    { name: '피자', icon: require('../assets/category-icons/pizza.png') },
    { name: '찌개·전골', icon: require('../assets/category-icons/stew.png') },
    { name: '국밥', icon: require('../assets/category-icons/soup.png') },
    { name: '양꼬치', icon: require('../assets/category-icons/lamb.png') },
    { name: '초밥·롤', icon: require('../assets/category-icons/sushi.png') },
    { name: '라멘', icon: require('../assets/category-icons/ramen.png') },
    { name: '분식', icon: require('../assets/category-icons/bunsik.png') },
    { name: '술집', icon: require('../assets/category-icons/pub.png') },
    { name: '해산물', icon: require('../assets/category-icons/seafood.png') },
    { name: '곱창·막창', icon: require('../assets/category-icons/gopchang.png') },
    { name: '회', icon: require('../assets/category-icons/sashimi.png') },
    { name: '뷔페', icon: require('../assets/category-icons/buffet.png') },
    { name: '아시아음식', icon: require('../assets/category-icons/asian.png') }
  ];

  const entertainmentCategories = [
    { name: '카페', value: 'CAFE', icon: require('../assets/category-icons/cafe.png') },
    { name: '노래방', value: 'KARAOKE', icon: require('../assets/category-icons/karaoke.png') },
    { name: 'PC방', value: 'PCROOM', icon: require('../assets/category-icons/pcroom.png') },
    { name: '당구장', value: 'BILLIARD', icon: require('../assets/category-icons/billiards.png') }
  ];

  const priorityOptions = [
    { display: '거리', value: 'distance' },
    { display: 'Kakao평점', value: 'kakaoGrade' },
    { display: 'NolGoat평점', value: 'nolgoatGrade' }
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
        <div className="priority-selector">
          <label className="condition-title-label">Priority</label>
          <div className="options">
            {priorityOptions.map((option, index) => (
              <button
                key={index}
                className={`option ${priority === option.value ? 'selected' : ''}`}
                onClick={() => setPriority(option.value)}
              >
                {option.display}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="category-section">
        <label className="condition-title-label">Category</label>
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
              <div className="input-container">
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
              </div>
              <div className="condition-selector">
                <label className="condition-label">음식점</label>
                <div className="options category-options">
                  {restaurantCategories.map((category, index) => (
                    <button
                      key={index}
                      className={`option ${conditions[tabNumber].category === category.name ? 'selected' : ''}`}
                      onClick={() => handleConditionChange(tabNumber, 'category', category.name, category.name)}
                      disabled={!allCategories.includes(category.name) || !isCategorySelectable(tabNumber)}
                    >
                      <img src={category.icon} alt={category.name} className="category-icon" />
                      <span>{category.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="condition-selector">
                <label className="condition-label">놀거리</label>
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