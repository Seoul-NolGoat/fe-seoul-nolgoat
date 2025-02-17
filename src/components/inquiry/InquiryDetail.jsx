import React, { useEffect, useState, useContext } from 'react';
import '../../pages/Inquiries.css';
import axiosInstance from '../../services/axiosInstance';
import { UserContext } from '../../contexts/UserContext';
import { formatToDate } from '../DateFormatter';

const InquiryDetail = ({ inquiry, onEditClick, onBackClick }) => {
  const { userProfile } = useContext(UserContext);
  const [inquiryDetails, setInquiryDetails] = useState(null);
  
  useEffect(() => {
    if (inquiry && inquiry.inquiryId) {
      fetchInquiryDetails(inquiry.inquiryId);
    }
  }, [inquiry]);

  const fetchInquiryDetails = (inquiryId) => {
    axiosInstance
      .get(`/inquiries/${inquiryId}`)
      .then((response) => {
        setInquiryDetails(response.data);
      })
      .catch((error) => {
        console.error('문의사항 세부 정보를 불러오는 중 에러 발생:', error);
      });
  };

  const handleDeleteClick = () => {
    if (window.confirm('정말로 이 게시물을 삭제하시겠습니까?')) {
      axiosInstance
        .delete(`/inquiries/${inquiry.id}`)
        .then(() => {
          alert('게시물이 삭제되었습니다.');
          window.location.reload(); ;
        })
        .catch((error) => {
          console.error('건의사항 삭제 중 에러 발생:', error);
        });
    }
  };

  if (!inquiryDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="inquiry-detail-container">
      <table className="inquiry-detail-table">
        <tbody>
          <tr>
            <th>작성자</th>
            <td>{inquiryDetails.userNickname}</td>
            <th>등록일</th>
            <td>{formatToDate(inquiryDetails.createDate)}</td>
            <th>잠금</th>
            <td>{inquiryDetails.isPublic ? '공개' : '비공개'}</td>
          </tr>
        </tbody>
      </table>

      <div className="inquiry-title">
        {inquiryDetails.title}
      </div>

      <div className="inquiry-content">
        {inquiryDetails.content}
      </div>

      <div className="inquiry-form-buttons">
        <div className="left-buttons">
          <button className="inquiry-cancel-button" onClick={onBackClick}>목록으로</button>
        </div>
        
        <div className="right-buttons">
          {userProfile && inquiryDetails.userId === userProfile.userId && (
            <>
              <button className="inquiry-delete-button" onClick={handleDeleteClick}>삭제</button>
              <button className='inquiry-button' onClick={onEditClick}>수정</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default InquiryDetail;
