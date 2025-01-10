import React, { useContext, useEffect, useState } from 'react';
import './Inquiries.css';
import axiosInstance from '../services/axiosInstance';
import { UserContext } from '../contexts/UserContext';
import InquiryList from '../components/inquiry/InquiryList';
import InquiryDetail from '../components/inquiry/InquiryDetail';
import InquiryForm from '../components/inquiry/InquiryForm';

const Inquiries = () => {
  const { userProfile } = useContext(UserContext);
  const [inquiries, setInquiries] = useState([]);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [isWriting, setIsWriting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = () => {
    axiosInstance
      .get('/inquiries')
      .then((response) => {
        setInquiries(response.data);
      })
      .catch((error) => {
        console.error('건의사항 목록을 불러오는 중 에러 발생:', error);
      });
  };

  const handleInquiryClick = (inquiry) => {
    if (!inquiry.isPublic && (!userProfile || inquiry.userId !== userProfile.userId)) {
      alert('공개되지 않은 글은 조회할 수 없습니다.');
      return;
    }
    setSelectedInquiry(inquiry);
    setIsWriting(false);
    setIsEditing(false);
  };

  const handleWriteClick = () => {
    if (!userProfile) {
      alert('글쓰기를 위해 로그인이 필요합니다.');
      return;
    }
    setIsWriting(true);
    setSelectedInquiry(null);
    setIsEditing(false);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  return (
    <div className="inquiries-container-wrapper">
      <div className="inquiries-container">
        {!isWriting && !selectedInquiry && (
          <InquiryList
            inquiries={inquiries}
            onInquiryClick={handleInquiryClick}
            onWriteClick={handleWriteClick}
          />
        )}
        {selectedInquiry && !isEditing && (
          <InquiryDetail
            inquiry={selectedInquiry}
            onEditClick={handleEditClick}
            onBackClick={() => setSelectedInquiry(null)}
          />
        )}
        {(isWriting || isEditing) && (
          <InquiryForm
            inquiry={isEditing ? selectedInquiry : null}
            onCancel={() => {
              setIsWriting(false);
              setIsEditing(false);
              setSelectedInquiry(null);
            }}
            userId={userProfile?.userId}
          />
        )}
      </div>
    </div>
  );
};

export default Inquiries;