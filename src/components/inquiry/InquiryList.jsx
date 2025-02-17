import React from 'react';
import '../../pages/Inquiries.css';
import lockIcon from '../../assets/inquiries-icons/lock.png';
import { formatToDate } from '../../utils/DateFormatter';

const InquiryList = ({ inquiries, onInquiryClick, onWriteClick }) => {

  const sortedInquiries = [...inquiries].sort((a, b) => new Date(b.createDate) - new Date(a.createDate));

  return (
    <div className="inquiries-list">
      <p className="inquiries-description">
        NolGoat을 더 나은 서비스로 만들기 위해 여러분의 소중한 의견을 남겨주세요. 
        서비스 이용 중 불편한 점이나 개선이 필요한 부분을 자유롭게 건의해주시면, 
        적극적으로 반영하겠습니다. 여러분의 피드백이 NolGoat을 발전시키는 데 큰 도움이 됩니다.
      </p>

      {sortedInquiries.length === 0 ? (
        <p className="no-inquiries-message">게시물이 존재하지 않습니다</p>
      ) : (
        <table className="inquiries-table">
          <thead>
            <tr>
              <th>제목</th>
              <th>작성자</th>
              <th>작성일</th>
              <th>공개</th>
            </tr>
          </thead>
          <tbody>
            {sortedInquiries.map((inquiry) => (
              <tr key={inquiry.inquiryId} onClick={() => onInquiryClick(inquiry)}>
                <td>
                  {inquiry.title}
                  {!inquiry.isPublic && (
                    <img src={lockIcon} alt="비공개" className="lock-icon" />
                  )}
                </td>
                <td>{inquiry.userNickname}</td>
                <td>{formatToDate(inquiry.createDate)}</td>
                <td>{inquiry.isPublic ? '공개' : '비공개'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      
      <div className="write-button-wrapper">
        <button className="inquiry-button" onClick={onWriteClick}>
          글쓰기
        </button>
      </div>
    </div>
  );
};

export default InquiryList;
