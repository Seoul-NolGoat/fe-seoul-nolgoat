import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
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
        .get(`/users/me/bookmarks`)
        .then((response) => {
          setBookmarkedStores(response.data.content);
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
    <FavoriteItemContainer>
      {stores.map((store) => (
        <FavoriteItem key={store.id}>
          <FavoriteMain onClick={() => handleItemClick(store.storeId)}>
            <FavoriteIcon src={starIconBlue} alt="즐겨찾기 아이콘" />
            <FavoriteInfo>
              <FavoriteName>{store.name}</FavoriteName>
              <FavoriteAddress>{store.roadAddress}</FavoriteAddress>
            </FavoriteInfo>
          </FavoriteMain>
          <FavoriteActions>
            <MoreIcon
              src={moreIcon}
              alt="더보기 아이콘"
              onClick={() => handleMoreIconClick(store.id)}
            />
            {showOptions === store.id && (
              <OptionsMenu>
                <DeleteButton onClick={() => handleDeleteStore(store.storeId)}>
                  삭제
                </DeleteButton>
              </OptionsMenu>
            )}
          </FavoriteActions>
        </FavoriteItem>
      ))}
    </FavoriteItemContainer>
  );

  return (
    <FavoritesWrapper>
      <FavoritesContainer>
        <Title>즐겨찾기</Title>
        <FilterMenu>
          <FilterButton className={selectedCategory === 'ALL' ? 'active' : ''} onClick={() => setSelectedCategory('ALL')}>전체</FilterButton>
          <FilterButton className={selectedCategory === 'RESTAURANT' ? 'active' : ''} onClick={() => setSelectedCategory('RESTAURANT')}>음식점</FilterButton>
          <FilterButton className={selectedCategory === 'CAFE' ? 'active' : ''} onClick={() => setSelectedCategory('CAFE')}>카페</FilterButton>
          <FilterButton className={selectedCategory === 'PCROOM' ? 'active' : ''} onClick={() => setSelectedCategory('PCROOM')}>PC방</FilterButton>
          <FilterButton className={selectedCategory === 'KARAOKE' ? 'active' : ''} onClick={() => setSelectedCategory('KARAOKE')}>노래방</FilterButton>
          <FilterButton className={selectedCategory === 'BILLIARD' ? 'active' : ''} onClick={() => setSelectedCategory('BILLIARD')}>당구장</FilterButton>
        </FilterMenu>
        {bookmarkedStores.length > 0 ? renderStoreList(filterStores()) : <p>즐겨찾기 목록이 없습니다.</p>}
      </FavoritesContainer>
    </FavoritesWrapper>
  );
};

const FavoritesWrapper = styled.div`
  padding: 0;
  background-color: #ffffff; 
`;

const FavoritesContainer = styled.div`
  width: 100%;
  margin: 0 auto;
  padding: 10px 10px;
  border-radius: none;
  background-color: #ffffff;
  box-shadow: none;
  box-sizing: border-box;
`;

const Title = styled.h2`
  margin-bottom: 20px; 
  text-align: center;
  font-size: 23px;
  font-weight: bold;
  color: #333; 
`;

const FilterMenu = styled.div`
  width: 100%;
  margin: 0px 0px;
  border-bottom: 1px solid #ddd; 
  display: flex;
  justify-content: space-evenly;
`;

const FilterButton = styled.button`
  margin: 0 10px; 
  padding: 10px 0;
  border: none;
  background-color: transparent;
  font-size: 15px;
  font-weight: 500;
  color: #555; 
  cursor: pointer;
  position: relative;

  &:hover {
    color: #007bff;
  }

  &.active {
    color: #007bff;
    font-weight: bold;
  }

  &.active::after {
    content: "";
    display: block;
    width: 100%;
    height: 3px;
    background-color: #007bff;
    position: absolute;
    bottom: -1px;
    left: 0;
  }

  &:focus {
    outline: none;
  }
`;

const FavoriteItemContainer = styled.ul`
  padding: 0;
`;

const FavoriteItem = styled.li`
  margin: 0px 10px;
  padding: 13px 2px;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer; 
  transition: background-color 0.3s ease; 
  position: relative; 

  &:hover {
    background-color: rgb(238, 245, 255); 
  }
`;

const FavoriteMain = styled.div`
  display: flex;
  flex: 1;
`;

const FavoriteIcon = styled.img`
  width: 19px;
  height: 19px;
  margin-right: 15px;
  margin-top: 10px;
`;

const FavoriteInfo = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const FavoriteName = styled.span`
  margin-bottom: 5px;
  font-weight: bold;
  font-size: 15px;
  text-align: left;
`;

const FavoriteAddress = styled.span`
  font-size: 12px;
  color: #777;
  text-align: left;
`;

const FavoriteActions = styled.div`
  display: flex;
  align-items: center;
  position: relative;
`;

const MoreIcon = styled.img`
  width: 24px;
  height: 24px;
  cursor: pointer;
`;

const OptionsMenu = styled.div`
  border: 1px solid #ddd;
  border-radius: 5px;
  position: absolute;
  right: 25px;
  top: -3px;
  background-color: #fff;
  z-index: 1;
`;

const DeleteButton = styled.button`
  width: 55px;
  padding: 5px 10px;
  border: none;
  background-color: transparent;
  color: #f00;
  cursor: pointer;
  text-align: center;

  &:hover {
    background-color: #f8f8f8;
    border-radius: 5px;
  }
`;

export default Favorites;
