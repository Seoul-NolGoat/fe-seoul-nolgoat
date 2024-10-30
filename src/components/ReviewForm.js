import React, { useState } from 'react';
import './ReviewForm.css';
import DraggableStarRating from './DraggableStarRating';
import { ImFilePicture } from 'react-icons/im';
import { FaTimes } from 'react-icons/fa';
import axiosInstance from '../services/axiosInstance';

const ReviewForm = ({ onSubmit, userProfileImage, username, userId, storeId }) => { 
  const [content, setContent] = useState('');
  const [grade, setGrade] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleGradeChange = (newGrade) => {
    setGrade(newGrade);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 2 * 1024 * 1024) { // 2MB 제한
      setErrorMessage('파일 크기는 2MB 이하만 가능합니다.');
      setSelectedFile(null);
    } else {
      setErrorMessage('');
      setSelectedFile(file);
    }
  };

  const handleFileRemove = () => {
    setSelectedFile(null);
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      setErrorMessage('리뷰 내용을 작성해주세요.');
      return;
    }

    if (grade === 0) {
      setErrorMessage('별점을 선택해주세요.');
      return;
    }

    const formData = new FormData();
    formData.append('review', new Blob([JSON.stringify({ content, grade })], { type: 'application/json' }));
    if (selectedFile) {
      formData.append('file', selectedFile);
    }

    try {
      await axiosInstance.post(`/reviews/${storeId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('리뷰가 성공적으로 작성되었습니다.');
      window.location.reload();
    } catch (error) {
      console.error('리뷰 제출 중 오류 발생:', error);
      setErrorMessage('리뷰 제출 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <div className="review-header">
        <div className="review-header-content">
          <div className="user-info">
            <img src={userProfileImage} alt="User" className="review-form-profile-image" />
            <span className="review-username">{username}</span>
          </div>
          <DraggableStarRating grade={grade} onChange={handleGradeChange} />
        </div>
      </div>
      <textarea
        className="review-textarea"
        placeholder="리뷰 내용을 작성해주세요."
        value={content}
        onChange={handleContentChange}
      />
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <div className="form-footer">
        <label htmlFor="file-upload" className="file-upload-label">
          <ImFilePicture className="file-upload-icon" />
          <input
            id="file-upload"
            type="file"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </label>
        {selectedFile && (
          <div className="file-info">
            <span className="file-name">{selectedFile.name}</span>
            <FaTimes className="remove-file-icon" onClick={handleFileRemove} />
          </div>
        )}
        <button type="submit" className="submit-button">
          리뷰 작성
        </button>
      </div>
    </form>
  );
};

export default ReviewForm;
