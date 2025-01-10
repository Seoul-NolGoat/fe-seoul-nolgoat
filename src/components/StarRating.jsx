import React from 'react';
import styled from 'styled-components';

const StarRating = ({ grade }) => {
  const maxStars = 5;
  const fullStars = Math.floor(grade); // 정수 부분은 완전히 채워진 별
  const hasHalfStar = grade % 1 !== 0; // 소수 부분이 있으면 반 별
  const emptyStars = maxStars - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <StarRatingContainer>
      <GradeNumber>{grade.toFixed(1)}</GradeNumber>
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} filled>
          ★
        </Star>
      ))}
      {hasHalfStar && (
        <Star key="half" half>
          ★
        </Star>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} empty>
          ☆
        </Star>
      ))}
    </StarRatingContainer>
  );
};

const StarRatingContainer = styled.div`
  display: flex;
  align-items: center;
`;

const GradeNumber = styled.span`
  font-size: 0.8em;
  color: #f15b5b;
  margin-right: 5px;

  @media (max-width: 500px) {
    font-size: 0.65em;
  }
`;

const Star = styled.span`
  font-size: 0.9em;
  position: relative;
  color: ${(props) =>
    props.filled || props.half ? '#f15b5b' : props.empty ? '#ddd' : '#f15b5b'};

  ${(props) =>
    props.half &&
    `
    color: #ddd;
    &::before {
      content: '★';
      color: #f15b5b;
      position: absolute;
      left: 0;
      width: 50%;
      overflow: hidden;
    }
  `}

  @media (max-width: 500px) {
    font-size: 0.7em;
  }
`;

export default StarRating;