import React, { useContext, useEffect, useState } from 'react';
import './Favorites.css';
import axiosInstance from '../services/axiosInstance';
import { UserContext } from '../contexts/UserContext';
import starIconBlue from '../assets/store-detail-icons/star-blue.png'; 
import moreIcon from '../assets/store-detail-icons/three-dots.png'; 
import { useNavigate } from 'react-router-dom';

const Favorites = () => {
  const { userProfile } = useContext(UserContext);
  const [bookmarkedStores, setBookmarkedStores] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL'); // 선택된 카테고리 상태
  const [showOptions, setShowOptions] = useState(null); // 어떤 store의 옵션 메뉴를 보여줄지 상태 관리
  const navigate = useNavigate();

  useEffect(() => {
    if (userProfile) {
      axiosInstance
        .get(`/stores/bookmarked/${userProfile.userId}`)
        .then((response) => {
          setBookmarkedStores(response.data);
        })
        .catch((error) => {
          console.error('즐겨찾기 목록을 불러오는 중 에러 발생:', error);
        });
    }
  }, [userProfile]);

  const filterStores = () => {
    if (selectedCategory === 'ALL') {
      return bookmarkedStores;
    }
    return bookmarkedStores.filter(store => store.storeType === selectedCategory);
  };

  const handleItemClick = (storeId) => {
    navigate(`/store/${storeId}`); 
  };

  const handleMoreIconClick = (storeId) => {
    if (showOptions === storeId) {
      setShowOptions(null); 
    } else {
      setShowOptions(storeId); 
    }
  };

  const handleDeleteStore = (storeId) => {
    try {
      axiosInstance.delete(`/bookmarks/${userProfile.userId}/${storeId}`);
      alert('즐겨찾기에서 삭제되었습니다.');
      window.location.reload();
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      alert('북마크 처리 중 오류가 발생했습니다.');
    }
  };

  const renderStoreList = (stores) => (
    <ul className='favorite-item-container'>
      {stores.map((store) => (
        <li
          key={store.id}
          className="favorite-item"
        >
          <div className="favorite-store-main" onClick={() => handleItemClick(store.id)}>
            <img src={starIconBlue} alt="즐겨찾기 아이콘" className="favorite-icon" />
            <div className="favorite-store-info">
              <span className="favorite-store-name">{store.name}</span>
              <span className="favorite-store-address">{store.roadAddress}</span>
            </div>
          </div>
          <div className="favorite-store-actions">
            <img
              src={moreIcon}
              alt="더보기 아이콘"
              className="more-icon"
              onClick={() => handleMoreIconClick(store.id)}
            />
            {showOptions === store.id && (
              <div className="favorites-options-menu">
                <button
                  onClick={() => handleDeleteStore(store.id)}
                  className="delete-favorites-button"
                >
                  삭제
                </button>
              </div>
            )}
          </div>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="favorites-container-wrapper">
      <div className="favorites-container">
        <h2 className="favorites-title">즐겨찾기</h2>

        <div className="filter-menu">
          <button
            className={selectedCategory === 'ALL' ? 'active' : ''}
            onClick={() => setSelectedCategory('ALL')}
          >
            전체
          </button>
          <button
            className={selectedCategory === 'RESTAURANT' ? 'active' : ''}
            onClick={() => setSelectedCategory('RESTAURANT')}
          >
            음식점
          </button>
          <button
            className={selectedCategory === 'CAFE' ? 'active' : ''}
            onClick={() => setSelectedCategory('CAFE')}
          >
            카페
          </button>
          <button
            className={selectedCategory === 'PCROOM' ? 'active' : ''}
            onClick={() => setSelectedCategory('PCROOM')}
          >
            PC방
          </button>
          <button
            className={selectedCategory === 'KARAOKE' ? 'active' : ''}
            onClick={() => setSelectedCategory('KARAOKE')}
          >
            노래방
          </button>
          <button
            className={selectedCategory === 'BILLIARD' ? 'active' : ''}
            onClick={() => setSelectedCategory('BILLIARD')}
          >
            당구장
          </button>
        </div>

        {bookmarkedStores.length > 0 ? (
          renderStoreList(filterStores())
        ) : (
          <p>즐겨찾기 목록이 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default Favorites;
