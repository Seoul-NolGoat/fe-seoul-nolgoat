import React, { useState, useEffect } from 'react';
import '../../pages/Inquiries.css';
import axiosInstance from '../../services/axiosInstance';

const InquiryForm = ({ inquiry, onCancel, userId }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    isPublic: true,
  });

  useEffect(() => {
    if (inquiry) {
      fetchInquiryDetails(inquiry.id); 
    }
  }, [inquiry]);

  const fetchInquiryDetails = (id) => {
    axiosInstance
      .get(`/inquiries/${id}`)
      .then((response) => {
        const { title, content, isPublic } = response.data;
        setFormData({
          title,
          content,
          isPublic,
        });
      })
      .catch((error) => {
        console.error('건의사항 세부 정보를 불러오는 중 에러 발생:', error);
      });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? !checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inquiry) {
      // 수정 모드일 경우
      axiosInstance
        .put(`/inquiries/${inquiry.id}`, formData)
        .then(() => {
          alert('게시물이 수정되었습니다.');
          window.location.reload(); 
        })
        .catch((error) => {
          console.error('게시물 수정 중 에러 발생:', error);
        });
    } else {
      // 작성 모드일 경우
      axiosInstance
        .post(`/inquiries`, formData)
        .then(() => {
          alert('게시물이 등록되었습니다.');
          window.location.reload(); 
        })
        .catch((error) => {
          console.error('게시물 작성 중 에러 발생:', error);
        });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="inquiry-form">
      <h2>{inquiry ? '건의사항 수정' : '건의사항 작성'}</h2>
      <input
        type="text"
        name="title"
        value={formData.title}
        onChange={handleInputChange}
        placeholder="제목"
        required
      />
      <textarea
        name="content"
        value={formData.content}
        onChange={handleInputChange}
        placeholder="내용"
        required
        className="inquiry-textarea"
      />
      <div className="switch-wrapper">
        <label className="switch">
          <input
            type="checkbox"
            name="isPublic"
            checked={!formData.isPublic}
            onChange={handleInputChange}
          />
          <span className="slider round"></span>
        </label>
        <span className={`slider-text ${formData.isPublic ? 'public' : 'private'}`}>
          {formData.isPublic ? '공개' : '비공개'}
        </span>
      </div>

      <div className="inquiry-form-buttons">
        <button className="inquiry-cancel-button" type="button" onClick={onCancel}>취소</button>
        <button className="inquiry-button" type="submit">{inquiry ? '수정' : '등록'}</button>
      </div>
    </form>
  );
};

export default InquiryForm;
