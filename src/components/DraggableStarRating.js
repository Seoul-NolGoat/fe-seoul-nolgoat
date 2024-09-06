import React, { useState } from 'react';
import './DraggableStarRating.css';

const DraggableStarRating = ({ grade, onChange }) => {
  const [selectedGrade, setSelectedGrade] = useState(grade); // 선택된 별점 상태
  const [hoveredStar, setHoveredStar] = useState(0);
  const [dragging, setDragging] = useState(false);
  const maxStars = 5;

  const handleMouseDown = (index) => {
    setDragging(true);
    const newGrade = index + 1;
    setSelectedGrade(newGrade); // 선택된 별점을 상태에 저장
    onChange(newGrade);
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  const handleMouseMove = (index) => {
    if (dragging) {
      const newGrade = index + 1;
      setSelectedGrade(newGrade); // 선택된 별점을 상태에 저장
      onChange(newGrade);
    } else {
      setHoveredStar(index + 1);
    }
  };

  const handleMouseLeave = () => {
    if (!dragging) {
      setHoveredStar(0);
    }
  };

  return (
    <div
      className="draggable-star-rating-container"
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      {[...Array(maxStars)].map((_, i) => (
        <span
          key={i}
          className={`draggable-star-rating-star ${
            i < (dragging ? selectedGrade : hoveredStar || selectedGrade) ? 'draggable-star-rating-filled' : 'draggable-star-rating-empty'
          }`}
          onMouseDown={() => handleMouseDown(i)}
          onMouseMove={() => handleMouseMove(i)}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default DraggableStarRating;
