import React, { useEffect, useState, useContext } from 'react';
import '../../pages/Notices.css';
import axiosInstance from '../../services/axiosInstance';
import { UserContext } from '../../contexts/UserContext';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { formatToDate } from '../DateFormatter';

const NoticeDetail = ({ notice, onEditClick, onBackClick }) => {
  const { userProfile } = useContext(UserContext);
  const [noticeDetails, setNoticeDetails] = useState(null);

  useEffect(() => {
    if (notice && notice.noticeId) {
      fetchNoticeDetails(notice.noticeId);
      incrementViews(notice.noticeId); 
    }
  }, [notice]);

  const fetchNoticeDetails = (noticeId) => {
    axiosInstance
      .get(`/notices/${noticeId}`)
      .then((response) => {
        setNoticeDetails(response.data);
      })
      .catch((error) => {
        console.error('공지사항 세부 정보를 불러오는 중 에러 발생:', error);
      });
  };

  const incrementViews = (id) => {
    axiosInstance
      .put(`/notices/${id}/views`)
      .catch((error) => {
        console.error('조회수 증가 중 에러 발생:', error);
      });
  };

  const handleDeleteClick = () => {
    if (window.confirm('정말로 이 게시물을 삭제하시겠습니까?')) {
      axiosInstance
        .delete(`/notices/${notice.id}`)
        .then(() => {
          alert('게시물이 삭제되었습니다.');
          window.location.reload();
        })
        .catch((error) => {
          console.error('게시물 삭제 중 에러 발생:', error);
        });
    }
  };

  if (!noticeDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="notice-detail-container">
      <table className="notice-detail-table">
        <tbody>
          <tr>
            <th>작성자</th>
            <td>{noticeDetails.userNickname}</td>
            <th>등록일</th>
            <td>{formatToDate(noticeDetails.createDate)}</td>
            <th>조회수</th>
            <td>{noticeDetails.views}</td>
          </tr>
        </tbody>
      </table>

      <div className="notice-title">{noticeDetails.title}</div>

      <div className="notice-content">
        <ReactMarkdown rehypePlugins={[rehypeRaw]}>
          {noticeDetails.content}
        </ReactMarkdown>
      </div>

      <div className="notice-form-buttons">
        <div className="left-buttons">
          <button className="notice-cancel-button" onClick={onBackClick}>
            목록으로
          </button>
        </div>

        <div className="right-buttons">
          {userProfile && userProfile.userId === 5 && (
            <>
              <button className="notice-delete-button" onClick={handleDeleteClick}>
                삭제
              </button>
              <button className="notice-button" onClick={onEditClick}>
                수정
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoticeDetail;
