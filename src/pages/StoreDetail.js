import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import './StoreDetail.css';
import axiosInstance from '../services/axiosInstance';
import mapIcon from '../assets/store-detail-icons/map.png';
import phoneIcon from '../assets/store-detail-icons/phone.png';
import websiteIcon from '../assets/store-detail-icons/link.png';
import categoryIcon from '../assets/store-detail-icons/categories.png';
import kakaoIcon from '../assets/route-result-icons/kakao.png';
import nolgoatIcon from '../assets/route-result-icons/nolgoat.png';
import StarRating from '../components/StarRating';
import ReviewForm from '../components/ReviewForm';
import { UserContext } from '../contexts/UserContext';
import moreIcon from '../assets/store-detail-icons/three-dots.png';
import Lightbox from 'react-image-lightbox'; 
import 'react-image-lightbox/style.css';    

const { kakao } = window;

const StoreDetail = () => {
  const { id } = useParams();
  const { userProfile } = useContext(UserContext);
  const [store, setStore] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeReviewOptions, setActiveReviewOptions] = useState(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false); 
  const [selectedImage, setSelectedImage] = useState(''); 

  useEffect(() => {
    const fetchStoreDetails = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get(`/stores/${id}`);
        setStore(response.data);
      } catch (error) {
        console.error('Error fetching store details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStoreDetails();
  }, [id]);

  const handleReviewSubmit = (review) => {
    console.log('리뷰 제출:', review);
  };

  const handleDeleteReview = async (reviewId) => {
    const confirmDelete = window.confirm('리뷰를 삭제하시겠습니까?');
    if (confirmDelete) {
      try {
        await axiosInstance.delete(`/reviews/${reviewId}`);
        setStore((prevStore) => ({
          ...prevStore,
          reviews: prevStore.reviews.filter((review) => review.id !== reviewId),
        }));
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
    if (store && store.latitude && store.longitude) {
      const container = document.getElementById('map');
      const options = {
        center: new kakao.maps.LatLng(store.latitude, store.longitude),
        level: 4,
      };
      const map = new kakao.maps.Map(container, options);

      new kakao.maps.Marker({
        position: new kakao.maps.LatLng(store.latitude, store.longitude),
        map: map,
      });
    }
  }, [store]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const openLightbox = (imageUrl) => {
    setSelectedImage(imageUrl);
    setIsLightboxOpen(true);
  };

  return (
    <div className="store-detail-container-wrapper">
      <div className="store-detail-container">
        <div className="store-detail">
          {store ? (
            <>
              <h1 className="store-name">{store.name}</h1>
              <div className="store-grades">
                <div className="grade-item">
                  <img src={kakaoIcon} alt="Kakao" className="grade-icon" />
                  <span>{store.kakaoAverageGrade !== undefined ? store.kakaoAverageGrade : 'N/A'}</span>
                </div>
                <div className="grade-item">
                  <img src={nolgoatIcon} alt="Nolgoat" className="grade-icon" />
                  <span>{store.nolgoatAverageGrade !== undefined ? store.nolgoatAverageGrade : 'N/A'}</span>
                </div>
              </div>
              <div className="store-content">
                <div className="store-info">
                  <div className="info-item">
                    <img src={mapIcon} alt="map" className="icon" />
                    <div>
                      <div className="address-line">
                        <span>지번</span>
                        <span className="separator"></span>
                        <span>{store.lotAddress}</span>
                      </div>
                      <div className="address-line">
                        <span>도로명</span>
                        <span className="separator"></span>
                        <span>{store.roadAddress}</span>
                      </div>
                    </div>
                  </div>
                  <div className="info-item">
                    <img src={categoryIcon} alt="category" className="icon" />
                    <span>{store.category || 'N/A'}</span>
                  </div>
                  <div className="info-item">
                    <img src={phoneIcon} alt="phone" className="icon" />
                    <span>{store.phoneNumber || 'N/A'}</span>
                  </div>
                  <div className="info-item">
                    <img src={websiteIcon} alt="website" className="icon" />
                    <span>
                      {store.placeUrl ? (
                        <a href={store.placeUrl} target="_blank" rel="noopener noreferrer">
                          KakaoPlace
                        </a>
                      ) : (
                        'N/A'
                      )}
                    </span>
                  </div>
                </div>
              </div>
              <div id="map" className="store-map"></div>

              <div className="review-summary">
                <span className="review-star">★</span>
                <span className="review-rating">
                  {store.nolgoatAverageGrade !== undefined ? store.nolgoatAverageGrade.toFixed(2) : '0'}
                </span>
                <span className="review-count">· 후기 {store.reviews.length}개</span>
              </div>

              <div className="reviews-section">
                {store.reviews.length > 0 ? (
                  store.reviews.map(review => (
                    <div key={review.id} className="review-item">
                      <img src={review.userProfileImage} alt={review.userNickname} className="review-profile-image" />
                      <div className="review-content">
                        <div className="review-header">
                          <span className="review-nickname">{review.userNickname}</span>
                          <span className="review-separator"></span>
                          <span className="review-date">{review.createDate}</span>
                        </div>
                        {userProfile.userId === review.userId && (
                          <div className="review-options">
                            <img
                              src={moreIcon}
                              alt="More options"
                              className="more-icon"
                              onClick={() => toggleReviewOptions(review.id)}
                            />
                            {activeReviewOptions === review.id && (
                              <div className="review-options-menu">
                                <button
                                  onClick={() => handleDeleteReview(review.id)}
                                  className="delete-review-button"
                                >
                                  삭제
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                        <StarRating grade={review.grade} />
                        {review.imageUrl && (
                          <img
                            src={review.imageUrl}
                            alt="review"
                            className="review-image"
                            onClick={() => openLightbox(review.imageUrl)} 
                            style={{ cursor: 'pointer' }}
                          />
                        )}
                        <p className="review-text">{review.content}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>리뷰가 없습니다.</p>
                )}
              </div>

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
      </div>

      {isLightboxOpen && (
        <Lightbox
          mainSrc={selectedImage}
          onCloseRequest={() => setIsLightboxOpen(false)}
        />
      )}
    </div>
  );
};

export default StoreDetail;