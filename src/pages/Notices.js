import React, { useContext, useEffect, useState } from 'react';
import './Notices.css';
import axiosInstance from '../services/axiosInstance';
import { UserContext } from '../contexts/UserContext';
import NoticeList from '../components/notice/NoticeList';
import NoticeDetail from '../components/notice/NoticeDetail.js';
import NoticeForm from '../components/notice/NoticeForm.js';

const Notices = () => {
  const { userProfile } = useContext(UserContext);
  const [notices, setNotices] = useState([]);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [isWriting, setIsWriting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = () => {
    axiosInstance
      .get('/notices')
      .then((response) => {
        setNotices(response.data.content);
      })
      .catch((error) => {
        console.error('공지 목록을 불러오는 중 에러 발생:', error);
      });
  };

  const handleNoticeClick = (notice) => {
    setSelectedNotice(notice);
    setIsWriting(false);
    setIsEditing(false);
  };

  const handleWriteClick = () => {
    if (!userProfile) {
      alert('글쓰기를 위해 로그인이 필요합니다.');
      return;
    }
    setIsWriting(true);
    setSelectedNotice(null);
    setIsEditing(false);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  return (
    <div className="notices-container-wrapper">
      <div className="notices-container">
        {!isWriting && !selectedNotice && (
          <NoticeList
            notices={notices}
            onNoticeClick={handleNoticeClick}
            onWriteClick={handleWriteClick}
            userId={userProfile?.userId}
          />
        )}
        {selectedNotice && !isEditing && (
          <NoticeDetail
            notice={selectedNotice}
            onEditClick={handleEditClick}
            onBackClick={() => setSelectedNotice(null)}
          />
        )}
        {(isWriting || isEditing) && (
          <NoticeForm
            notice={isEditing ? selectedNotice : null}
            onCancel={() => {
              setIsWriting(false);
              setIsEditing(false);
              setSelectedNotice(null);
            }}
            userId={userProfile?.userId}
          />
        )}
      </div>
    </div>
  );
};

export default Notices;