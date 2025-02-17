import React from 'react';
import '../../pages/Notices.css';
import { formatToDate } from '../../utils/DateFormatter';
import eyeIcon from '../../assets/notices-icons/eye.png'; 
import newIcon from '../../assets/notices-icons/new.png'; 

const NoticeList = ({ notices, onNoticeClick, onWriteClick, userId }) => {

  const sortedNotices = [...notices].sort((a, b) => new Date(b.createDate) - new Date(a.createDate));
  const currentDate = new Date();

  return (
    <div className="notices-list">
      {sortedNotices.length === 0 ? (
        <p className="no-notices-message">공지사항이 존재하지 않습니다</p>
      ) : (
        <table className="notices-table">
          <tbody>
            {sortedNotices.map((notice, index) => {
              // 공지 생성일 계산
              const noticeDate = new Date(notice.createDate);
              const timeDiff = currentDate - noticeDate; 
              const daysDiff = timeDiff / (1000 * 3600 * 24); 

              return (
                <tr key={notice.noticeId} onClick={() => onNoticeClick(notice)}>
                  <td>{sortedNotices.length - index}</td>
                  <td>
                    {notice.title}
                    {daysDiff <= 7 && (
                      <img src={newIcon} alt="New icon" className="new-icon" />
                    )}
                  </td>
                  <td>{formatToDate(notice.createDate)}</td>
                  <td>
                    <img src={eyeIcon} alt="View icon" className="eye-icon" />
                    {notice.views}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      
      {userId === 5 && ( 
        <div className="write-button-wrapper">
          <button className="notice-button" onClick={onWriteClick}>
            글쓰기
          </button>
        </div>
      )}
    </div>
  );
};

export default NoticeList;
