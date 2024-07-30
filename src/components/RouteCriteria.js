import React, { useState } from 'react';
import './RouteCriteria.css';

const RouteOptions = () => {
  const [activeTab, setActiveTab] = useState(1);
  const [priority, setPriority] = useState('거리');
  const [conditions, setConditions] = useState({
    1: { category: '' },
    2: { category: '' },
    3: { category: '' }
  });
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const allCategories = [
    '한식', '퓨전한식', '곱창', '막창', '국수', '육류', '고기', '추어', '칼국수', '냉면', '설렁탕', '삼계탕', '족발', '보쌈', '삼겹살', 
    '한식뷔페', '찌개', '전골', '불고기', '두루치기', '한정식', '죽', '해장국', '국밥', '곰탕', '쌈밥', '양꼬치', '중국요리', '중식', 
    '퓨전중식', '일식', '참치회', '샤브샤브', '철판요리', '일본식주점', '초밥', '롤', '돈까스,우동', '찌개', '전골', '일식집', '일본식라면', 
    '햄버거', '스테이크', '립', '피자', '분식', '국수', '순대', '떡볶이', '칵테일바', '와인바', '술집', '호프', '요리주점', '일본식주점', 
    '실내포장마차', '해산물', '해물', '생선', '매운탕', '해물탕', '굴', '전복', '회', '복어', '게', '대게', '뷔페', '퓨전일식', '채식뷔페', 
    '해산물뷔페', '고기뷔페', '샌드위치', '간식', '아시아음식', '닭요리', '프랑스음식', '샐러드', '이탈리안', '스페인음식', '주먹밥', 
    '오리', '도시락', '닭강정', '치킨', '패스트푸드', '기사식당', '철판요리', '간식', '도시락', '퓨전요리', '패밀리레스토랑', '샐러드', '샤브샤브'
  ];

  const handleTabClick = (tabNumber) => {
    setActiveTab(tabNumber);
  };

  const handleConditionChange = (tabNumber, type, value) => {
    setConditions((prevConditions) => ({
      ...prevConditions,
      [tabNumber]: {
        ...prevConditions[tabNumber],
        [type]: prevConditions[tabNumber][type] === value ? '' : value
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
    handleConditionChange(tabNumber, 'category', value);
    setInputValue('');
    setSuggestions([]);
  };

  const restaurantCategories = [
    { name: '한식', icon: require('../assets/category-icons/korean.png') },
    { name: '중식', icon: require('../assets/category-icons/chinese.png') },
    { name: '일식', icon: require('../assets/category-icons/japanese.png') },
    { name: '고기·구이', icon: require('../assets/category-icons/grilled-meat.png') },
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
    { name: '카페', icon: require('../assets/category-icons/cafe.png') },
    { name: '노래방', icon: require('../assets/category-icons/karaoke.png') },
    { name: 'PC방', icon: require('../assets/category-icons/pcroom.png') },
    { name: '당구장', icon: require('../assets/category-icons/billiards.png') }
  ];

  const renderTabText = (tabNumber) => {
    const { category } = conditions[tabNumber];
    return (
      <div className="tab-text">
        <span className="tab-number">{tabNumber}</span>
        {category && (
          <>
            <span className="tab-separator">|</span>
            <span className="tab-category">{category}</span>
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
            {['거리', 'Kakao평점', 'NolGoat평점'].map((option, index) => (
              <button
                key={index}
                className={`option ${priority === option ? 'selected' : ''}`}
                onClick={() => setPriority(option)}
              >
                {option}
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
                      onClick={() => handleConditionChange(tabNumber, 'category', category.name)}
                      disabled={!isCategorySelectable(tabNumber)}
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
                      className={`option ${conditions[tabNumber].category === category.name ? 'selected' : ''}`}
                      onClick={() => handleConditionChange(tabNumber, 'category', category.name)}
                      disabled={!isCategorySelectable(tabNumber)}
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

export default RouteOptions;
