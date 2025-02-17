import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import axiosInstance from '../services/axiosInstance';
import mapIcon from '../assets/store-detail-icons/map.png';
import phoneIcon from '../assets/store-detail-icons/phone.png';
import websiteIcon from '../assets/store-detail-icons/link.png';
import categoryIcon from '../assets/store-detail-icons/categories.png';
import kakaoIcon from '../assets/route-result-icons/kakao.png';
import nolgoatIcon from '../assets/home-icons/nolgoat-circle.png';
import starIcon from '../assets/store-detail-icons/star.png';
import starIconBlue from '../assets/store-detail-icons/star-blue.png';
import distanceIcon from '../assets/store-detail-icons/road-view.png';
import shareIcon from '../assets/store-detail-icons/share.png';
import moreIcon from '../assets/store-detail-icons/three-dots.png';
import StarRating from '../components/StarRating';
import ReviewForm from '../components/ReviewForm';
import { UserContext } from '../contexts/UserContext';
import { Gallery, Item } from 'react-photoswipe-gallery';
import 'photoswipe/dist/photoswipe.css';
import RoadViewModal from '../components/RoadViewModal'; 
import { formatTimeAgo } from '../components/DateFormatter';

const { kakao } = window;

const StoreDetail = () => {
  const { id } = useParams();
  const { userProfile } = useContext(UserContext);
  const [store, setStore] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeReviewOptions, setActiveReviewOptions] = useState(null);
  const [isRoadViewModalOpen, setIsRoadViewModalOpen] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const fetchStoreDetails = async () => {
      if (!userProfile || !userProfile.userId) return;
  
      setIsLoading(true);
      try {
        const [storeResponse, bookmarkResponse] = await Promise.all([
          axiosInstance.get(`/stores/${id}`),
          axiosInstance.get(`/bookmarks/${userProfile.userId}/${id}`)
        ]);
        setStore(storeResponse.data);
        setIsBookmarked(bookmarkResponse.data);
      } catch (error) {
        console.error('Error fetching store details or bookmark status:', error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchStoreDetails();
  }, [id, userProfile]);

  const handleBookmarkToggle = async () => {
    try {
      if (isBookmarked) {
        await axiosInstance.delete(`/bookmarks/${userProfile.userId}/${id}`);
        setIsBookmarked(false);
        alert('즐겨찾기에서 삭제되었습니다.');
      } else {
        await axiosInstance.post(`/bookmarks/${id}`);
        setIsBookmarked(true);
        alert('즐겨찾기에 저장되었습니다.'); 
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      alert('북마크 처리 중 오류가 발생했습니다.');
    }
  };

  const handleReviewSubmit = (review) => {
    console.log('리뷰 제출:', review);
  };

  const handleDeleteReview = async (reviewId) => {
    const confirmDelete = window.confirm('리뷰를 삭제하시겠습니까?');
    if (confirmDelete) {
      try {
        await axiosInstance.delete(`/reviews/${reviewId}`);
        // setStore((prevStore) => ({
        //   ...prevStore,
        //   reviews: prevStore.reviews.filter((review) => review.reviewId !== reviewId),
        // }));
        alert('리뷰가 삭제되었습니다.');
        window.location.reload();
      } catch (error) {
        console.error('Error deleting review:', error);
      }
    }
  };

  const toggleReviewOptions = (reviewId) => {
    setActiveReviewOptions((prev) => (prev === reviewId ? null : reviewId));
  };

  useEffect(() => {
    const initializeMap = () => {
      if (!store || !store.latitude || !store.longitude) return;
      
      if (!window.kakao || !window.kakao.maps) {
        console.log('Kakao Maps API is not loaded yet');
        return;
      }
  
      const container = document.getElementById('map');
      if (!container) return;
  
      try {
        const options = {
          center: new window.kakao.maps.LatLng(store.latitude, store.longitude),
          level: 4,
        };
  
        const map = new window.kakao.maps.Map(container, options);
        
        new window.kakao.maps.Marker({
          position: new window.kakao.maps.LatLng(store.latitude, store.longitude),
          map: map,
        });
      } catch (error) {
        console.error('Error initializing Kakao Map:', error);
      }
    };
  
    initializeMap();
  }, [store]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: store.name,
        text: `Check out ${store.name}! It has an average rating of ${store.nolgoatAverageGrade || 'N/A'} stars.`,
        url: window.location.href,
      })
      .then(() => console.log('공유 성공'))
      .catch((error) => console.error('공유 실패:', error));
    } else {
      alert('이 브라우저에서는 공유 기능이 지원되지 않습니다.');
    }
  };

  const handleRoadViewToggle = () => {
    setIsRoadViewModalOpen(true);
  };

  const closeRoadViewModal = () => {
    setIsRoadViewModalOpen(false);
  };
  
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <StoreDetailContainer>
        <div>
          {store ? (
            <>
              <StoreName>{store.name}</StoreName>
              <StoreGrades>
                <GradeItem>
                  <GradeIcon src={kakaoIcon} alt="Kakao" />
                  <span>{store.kakaoAverageGrade !== undefined ? store.kakaoAverageGrade : 'N/A'}</span>
                </GradeItem>
                <GradeItem>
                  <GradeIcon src={nolgoatIcon} alt="Nolgoat" />
                  <span>{store.nolgoatAverageGrade !== undefined ? store.nolgoatAverageGrade : 'N/A'}</span>
                </GradeItem>
              </StoreGrades>

              <StoreActions>
                <ActionItem className={isBookmarked ? 'bookmarked' : ''} onClick={handleBookmarkToggle}>
                  <ActionIcon src={isBookmarked ? starIconBlue : starIcon} alt="저장" />
                  <span>저장</span>
                </ActionItem>
                <ActionItem onClick={handleRoadViewToggle}>
                  <ActionIcon src={distanceIcon} alt="거리뷰" />
                  <span>거리뷰</span>
                </ActionItem>
                <ActionItem onClick={handleShare}>
                  <ActionIcon src={shareIcon} alt="공유" />
                  <span>공유</span>
                </ActionItem>
              </StoreActions>

              <StoreContent>
                <StoreInfo>
                  <InfoItem>
                    <DetailIcon src={mapIcon} alt="map" />
                    <span>{store.roadAddress || 'N/A'}</span>
                  </InfoItem>
                  <InfoItem>
                    <DetailIcon src={categoryIcon} alt="category" />
                    <span>{store.category || 'N/A'}</span>
                  </InfoItem>
                  <InfoItem>
                    <DetailIcon src={phoneIcon} alt="phone" />
                    <span>{store.phoneNumber || 'N/A'}</span>
                  </InfoItem>
                  <InfoItem>
                    <DetailIcon src={websiteIcon} alt="website" />
                    <span>
                      {store.placeUrl ? (
                        <a href={store.placeUrl} target="_blank" rel="noopener noreferrer">
                          KakaoPlace
                        </a>
                      ) : (
                        'N/A'
                      )}
                    </span>
                  </InfoItem>
                </StoreInfo>
              </StoreContent>
              <KakaoMap id="map" ></KakaoMap>

              <ReviewSummary>
                <ReviewStar>★</ReviewStar>
                <ReviewRating>{store.nolgoatAverageGrade !== undefined ? store.nolgoatAverageGrade.toFixed(2) : '0'}</ReviewRating>
                <ReviewCount>· 후기 {store.reviews.length}개</ReviewCount>
              </ReviewSummary>

              <ReviewSection>
                <Gallery>
                  {store.reviews.length > 0 ? (
                    store.reviews.map(review => (
                      <ReviewItem key={review.id}>
                        <ReviewProfileImage src={review.userProfileImage} alt={review.userNickname} />
                        <ReviewContent>
                          <ReviewHeader>
                            <ReviewNickname>{review.userNickname}</ReviewNickname>
                            <ReviewSeparator></ReviewSeparator>
                            <ReviewDate>{formatTimeAgo(review.createDate)}</ReviewDate>
                          </ReviewHeader>
                          {userProfile.userId === review.userId && (
                            <ReviewOptions>
                              <MoreIcon
                                src={moreIcon}
                                alt="More options"
                                onClick={() => toggleReviewOptions(review.id)}
                              />
                              {activeReviewOptions === review.id && (
                                <ReviewOptionsMenu>
                                  <DeleteReviewButton onClick={() => handleDeleteReview(review.reviewId)}>삭제</DeleteReviewButton>
                                </ReviewOptionsMenu>
                              )}
                            </ReviewOptions>
                          )}
                          <StarRating grade={review.grade} />
                          {review.imageUrl && (
                            <Item
                              original={review.imageUrl}
                              thumbnail={review.imageUrl}
                              width="1024"
                              height="768"
                            >
                              {({ ref, open }) => (
                                <ReviewImage
                                  ref={ref}
                                  src={review.imageUrl}
                                  alt="review"
                                  onClick={open}
                                  style={{ cursor: 'pointer' }}
                                />
                              )}
                            </Item>
                          )}
                          <ReviewText>{review.content}</ReviewText>
                        </ReviewContent>
                      </ReviewItem>
                    ))
                  ) : (
                    <p>리뷰가 없습니다.</p>
                  )}
                </Gallery>
              </ReviewSection>

              <ReviewForm
                onSubmit={handleReviewSubmit}
                userProfileImage={userProfile.profileImage}
                username={userProfile.nickname}
                userId={userProfile.userId}
                storeId={id}
              />
            </>
          ) : (
            <div>Error loading store details</div>
          )}
        </div>
      </StoreDetailContainer>

      {isRoadViewModalOpen && (
        <RoadViewModal
          latitude={store.latitude}
          longitude={store.longitude}
          onClose={closeRoadViewModal}
        />
      )}
    </>
  );
};

const StoreDetailContainer = styled.div`
  width: 100%;
  margin: 0 auto;
  padding: 5px 20px;
  box-shadow: none;
  border-radius: 0px;
  background-color: #ffffff;
  box-sizing: border-box;
  font-family: "Nanum Gothic", sans-serif;
`;

const StoreName = styled.h1`
  margin: 20px 0px 15px 0px;
  text-align: center;
  font-size: 23px;
  text-decoration: underline; 
  text-decoration-color: #e2e2e2; 
  text-decoration-thickness: 1.5px;
  text-underline-offset: 13px; 
`;

const StoreGrades = styled.div`
  margin-bottom: 20px;
  color: #f15b5b;
  font-weight: 500;
  display: flex;
  justify-content: center;
  gap: 20px; 
`;

const GradeItem = styled.div`
  font-size: 15px;
  align-items: center;
  display: flex;
  gap: 6px; 
`;

const GradeIcon = styled.img`
  width: 16px;
  height: 16px;
`;

const StoreContent = styled.div`
  display: flex;
  flex-direction: column; 
`;

const StoreInfo = styled.div`
  text-align: left; 
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const InfoItem = styled.div`
  font-size: 0.9rem;
  line-height: 1.2;
  display: flex;
  align-items: flex-start;
`;

const DetailIcon = styled.img`
  width: 16px;
  height: 16px;
  margin-right: 7px;
`;

const KakaoMap = styled.div`
  width: 100%; 
  height: 300px;
  margin-top: 30px; 
  border-radius: 13px;
`;

const ReviewSummary = styled.div`
  margin: 35px 0px 10px 0px;
  padding: 6px 0px;
  border-top: 1.5px solid #ddd;
  border-bottom: 1.5px solid #ddd;
  align-items: center;
  font-size: 1.1rem;
  font-weight: bold;
  display: flex;
`;

const ReviewStar = styled.div`
  margin: 0px 5px 5px 10px;
  color: black; 
  font-size: 1.1rem;
`;

const ReviewRating = styled.div`
  margin-right: 5px;
`;

const ReviewCount = styled.div`
  color: #7c7c7c;
  font-size: 0.9rem;
`;

const ReviewSection = styled.div`
  margin: 10px 0px;
  padding: 0px 10px 0px 10px;
`;

const ReviewItem = styled.div`
  margin-bottom: 5px;
  padding: 10px 0px;
  border-bottom: 1px solid #eaeaea; 
  display: flex;
  align-items: flex-start;
  position: relative;

  &:last-child {
    border-bottom: none;
  }
`;

const ReviewProfileImage = styled.img`
  width: 25px;
  height: 25px;
  margin-right: 15px;
  border-radius: 50%;
`;

const ReviewContent = styled.div`
  flex: 1;
  text-align: left; 
`;

const ReviewHeader = styled.div`
  display: flex;
  align-items: center;
`;

const ReviewNickname = styled.span`
  font-size: 0.9rem;
  font-weight: bold;
`;

const ReviewSeparator = styled.span`
  width: 1px;
  height: 11px;
  background-color: #ccc; 
  margin: 0 8px; 
`;

const ReviewDate = styled.span`
  margin-bottom: 2px;
  font-size: 0.8rem; 
  color: #999; 
`;

const ReviewImage = styled.img`
  width: 100px;
  margin-top: 10px;
  border-radius: 8px;
`;

const ReviewText = styled.p`
  margin-top: 10px;
  text-align: left; 
`;

const ReviewOptions = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
`;

const MoreIcon = styled.img`
  width: 25px;
  height: 25px;
  cursor: pointer;
`;

const ReviewOptionsMenu = styled.div`
  position: absolute;
  left: -5px;
  top: 30px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 5px;
  z-index: 1;
`;

const DeleteReviewButton = styled.button`
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

const StoreActions = styled.div`
  margin-bottom: 30px;
  display: flex;
  justify-content: center;
  gap: 60px;
  position: relative;
`;

export const ActionItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #555558;
  position: relative;
  cursor: pointer;

  &:not(:last-child)::after {
    content: "";
    width: 1px;
    height: 40px;
    background-color: #F0F0F3;
    position: absolute;
    right: -30px;
    top: 50%;
    transform: translateY(-50%);
  }

  &.bookmarked {
    color: #007bff;
  }

  span {
    font-size: 0.9rem;
  }
`;

const ActionIcon = styled.img`
  width: 20px; 
  height: 20px;
  margin-bottom: 5px; 
`;

export default StoreDetail;