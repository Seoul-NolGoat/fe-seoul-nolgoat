import React, { useState } from 'react';
import Notices from './Notices'; 
import Inquiries from './Inquiries'; 
import './NoticeInquiryTab.css'; 

const NoticeAndInquiryTabs = () => {
  const [activeTab, setActiveTab] = useState('notices'); //탭 상태 (초기값을 'notices'로 설정)

  const handleTabClick = (tab) => { //탭 클릭 시 해당 탭으로 상태 변경
    setActiveTab(tab);
  };

  return (
    <div className="tab-page-container-wrapper">
        <div className="tab-page-container">
        <div className="tab-header">
            <div
            className={`tab-item ${activeTab === 'notices' ? 'active' : ''}`}
            onClick={() => handleTabClick('notices')}
            >
            공지사항
            </div>
            <div
            className={`tab-item ${activeTab === 'inquiries' ? 'active' : ''}`}
            onClick={() => handleTabClick('inquiries')}
            >
            건의사항
            </div>
        </div>

        <div className="tab-content">
            {activeTab === 'notices' && <Notices />}
            {activeTab === 'inquiries' && <Inquiries />}
        </div>
        </div>
    </div>
  );
};

export default NoticeAndInquiryTabs;
