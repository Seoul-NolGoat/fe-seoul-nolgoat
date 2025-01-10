import React, { useState } from 'react';
import styled from "styled-components";

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
    <DraggableStarRatingContainer
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      {[...Array(maxStars)].map((_, i) => (
        <Star
          key={i}
          filled={i < (dragging ? selectedGrade : hoveredStar || selectedGrade)}
          onMouseDown={() => handleMouseDown(i)}
          onMouseMove={() => handleMouseMove(i)}
        >
          ★
        </Star>
      ))}
    </DraggableStarRatingContainer>
  );
};

const DraggableStarRatingContainer = styled.div`
  margin-left: 5px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
`;

const Star = styled.span`
  font-size: 1.5rem;
  color: ${(props) => (props.filled ? '#f15b5b' : '#ddd')};
  transition: color 0.2s;
`;

export default DraggableStarRating;
