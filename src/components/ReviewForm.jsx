import React, { useState } from 'react';
import styled from 'styled-components';
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
    <ReviewFormContainer onSubmit={handleSubmit}>
      <ReviewHeader>
        <ReviewHeaderContent>
          <UserInfo>
            <RreviewFormProfileImage src={userProfileImage} alt="User" />
            <ReviewUsername>{username}</ReviewUsername>
          </UserInfo>
          <DraggableStarRating grade={grade} onChange={handleGradeChange} />
        </ReviewHeaderContent>
      </ReviewHeader>
      <ReviewTextarea
        placeholder="리뷰 내용을 작성해주세요."
        value={content}
        onChange={handleContentChange}
      />
      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
      <FormFooter>
        <FileUploadLabel htmlFor="file-upload">
          <FileUploadIcon />
          <input
            id="file-upload"
            type="file"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </FileUploadLabel>
        {selectedFile && (
          <FileInfo>
            <FileName>{selectedFile.name}</FileName>
            <RemoveFileIcon onClick={handleFileRemove} />
          </FileInfo>
        )}
        <SubmitButton type="submit" >
          리뷰 작성
        </SubmitButton>
      </FormFooter>
    </ReviewFormContainer>
  );
};

const ReviewFormContainer = styled.form`
  width: 100%;
  margin: 20px auto;
  padding: 12px 15px 8px 15px;
  border: none;
  border-top: 1px solid #a0a0a0;
  border-radius: 0px;
  background-color: #fff;
  box-sizing: border-box;
`;

const ReviewHeader = styled.div`
  width: 100%;
`;

const ReviewHeaderContent = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
`;

const RreviewFormProfileImage = styled.img`
  width: 25px;
  height: 25px;
  margin-right: 10px;
  border-radius: 50%;
`;

const ReviewUsername = styled.span`
  font-weight: bold;
  font-size: 0.9rem;
`;


const ReviewTextarea = styled.textarea`
  width: 90%;
  height: 50px;
  margin-bottom: 10px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  resize: none;
  font-size: 14px;
  background-color: #F7F8FA;
`;

const FormFooter = styled.div`
  width: 96%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 5px;
`;

const FileUploadLabel = styled.label`
  width: 20px;
  margin: 0px 0px 10px 0px;
  align-items: center;
  cursor: pointer;
`;

const FileUploadIcon = styled(ImFilePicture)`
  font-size: 1.2rem;
  color: #848484;
`;

const FileInfo = styled.div`
  margin: 0px 5px 0px 2px;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const FileName = styled.span`
  margin-bottom: 10px;
  font-size: 0.9rem;
  color: #333;
`;

const RemoveFileIcon = styled(FaTimes)`
  margin-bottom: 5px;
  font-size: 0.9rem;
  color: #ff4d4f;
  cursor: pointer;
`;

const SubmitButton = styled.button`
  margin-left: 5px;
  padding: 6px 13px;
  border: none;
  border-radius: 5px;
  background-color: #4285f4;
  color: white;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background-color: #357ae8;
  }
`;

const ErrorMessage = styled.div`
  margin: 0;
  color: #ff4d4f;
  font-size: 0.9rem;
`;

export default ReviewForm;
