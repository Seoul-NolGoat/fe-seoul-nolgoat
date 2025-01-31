import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import axiosInstance from '../services/axiosInstance';
import StarRating from '../components/StarRating';

const MyReview = () => {
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const observerTarget = useRef(null);

  const handleDeleteReview = async (reviewId) => {
    const confirmDelete = window.confirm('리뷰를 삭제하시겠습니까?');
    if (confirmDelete) {
      try {
        await axiosInstance.delete(`/reviews/${reviewId}`);
        setReviews(prevReviews => prevReviews.filter(review => review.reviewId !== reviewId));
        alert('리뷰가 삭제되었습니다.');
      } catch (error) {
        console.error('Error deleting review:', error);
      }
    }
  };

  const fetchReviews = async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      const response = await axiosInstance.get(`/users/me/reviews?page=${page}&size=10`);
      setReviews(prevReviews => [...prevReviews, ...response.data.content]);
      setHasMore(!response.data.last);
      setPage(prevPage => prevPage + 1);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchReviews();
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [hasMore]);

  return (
    <Container>
      <Title>내가 쓴 리뷰</Title>
      <ReviewContainer>
        {reviews.map((review) => (
          <ReviewItem key={review.id}>
            <StoreHeader>
              <StoreName to={`/store/${review.storeId}`}>{review.storeName}</StoreName>
              <DeleteButton onClick={() => handleDeleteReview(review.reviewId)}>
                <i className="fa-solid fa-x"></i>
              </DeleteButton>
            </StoreHeader>
            <ContentRow>
              <StoreInfoRow>
                <StarRating grade={review.grade} />
                <Content>{review.content}</Content>
              </StoreInfoRow>
              {review.imageUrl && (
                <ReviewImageWrapper>
                  <ReviewImage src={review.imageUrl} alt="리뷰 이미지" />
                </ReviewImageWrapper>
              )}
            </ContentRow>
          </ReviewItem>
        ))}
        <LoadingTarget ref={observerTarget}>
          {isLoading && <LoadingSpinner>로딩 중...</LoadingSpinner>}
        </LoadingTarget>
      </ReviewContainer>
      {reviews.length === 0 && !isLoading && (
        <NoReviewMessage>작성한 리뷰가 없습니다.</NoReviewMessage>
      )}
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  margin: 0 auto 0;
  padding: 0 20px;
  font-family: 'Nanum Gothic', sans-serif;
  box-sizing: border-box;
`;

const Title = styled.h1`
  margin: 20px;
  font-size: 24px;
  font-weight: bold;
  text-align: center;
`;

const ReviewContainer = styled.div`
  width: 100%;
  margin: 0 auto;
`;

const ReviewItem = styled.div`
  padding: 10px 0;
  margin-bottom: 7px;
  border-bottom: 0.5px solid #a0a0a0;
  background-color: white;
`;

const StoreHeader = styled.div`
  margin-bottom: 13px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StoreName = styled(Link)`
  font-size: 18px;
  font-weight: bold;
  color: #007bff;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  i {
    font-size: 15px;
    color: #666;
  }
`;

const StoreInfoRow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: left;
`;

const ContentRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 15px;
`;

const Content = styled.p`
  margin: 10px 0 0;
  font-size: 16px;
  color: #333;
  line-height: 1.5;
  flex: 1;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  word-break: break-all;
`;

const ReviewImageWrapper = styled.div`
  width: 100px;
  height: 100px;
  flex-shrink: 0;
`;

const ReviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
`;

const LoadingTarget = styled.div`
  width: 100%;
  height: 20px;
  margin: 20px 0;
`;

const LoadingSpinner = styled.div`
  text-align: center;
  color: #666;
  font-size: 14px;
`;

const NoReviewMessage = styled.div`
  margin-top: 40px;
  text-align: center;
  color: #666;
  font-size: 16px;
`;

export default MyReview;