import React from 'react';
import './StarRating.css';

const StarRating = ({ grade }) => {
  const maxStars = 5;
  const fullStars = Math.floor(grade); // 정수 부분은 완전히 채워진 별
  const hasHalfStar = grade % 1 !== 0; // 소수 부분이 있으면 반 별
  const emptyStars = maxStars - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="star-rating">
      <span className="grade-number">{grade.toFixed(1)}</span>
      {[...Array(fullStars)].map((_, i) => (
        <span key={i} className="star filled">★</span>
      ))}
      {hasHalfStar && <span className="star half">★</span>}
      {[...Array(emptyStars)].map((_, i) => (
        <span key={i} className="star empty">☆</span>
      ))}
    </div>
  );
};

export default StarRating;