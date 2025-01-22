import React, { useState } from 'react';
import styled from 'styled-components';
import Parties from '../components/parties/Parties';

const NoticeAndInquiryTabs = () => {
  const [activeTab, setActiveTab] = useState('parties'); 

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <TabPageContainer>
      <TabHeader>
        <TabItem
          active={activeTab === 'parties'}
          onClick={() => handleTabClick('parties')}
        >
          파티
        </TabItem>
        <TabItem
          active={activeTab === 'joinedParties'}
          onClick={() => handleTabClick('joinedParties')}
        >
          참여한 파티
        </TabItem>
        <TabItem
          active={activeTab === 'myParties'}
          onClick={() => handleTabClick('myParties')}
        >
          내 파티
        </TabItem>
      </TabHeader>

      <TabContent>
        {activeTab === 'parties' && <Parties />}
      </TabContent>
    </TabPageContainer>
  );
};

const TabPageContainer = styled.div`
  width: 100%;
  margin: 0 auto;
  padding: 10px 0px;
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: none;
  box-sizing: border-box;
`;

const TabHeader = styled.div`
  margin-bottom: 0px;
  padding-top: 10px;
  display: flex;
  justify-content: center;
  gap: 50px;
`;

const TabItem = styled.div`
  padding: 5px;
  border-bottom: ${(props) => (props.active ? '2px solid #007bff' : 'none')};
  color: ${(props) => (props.active ? '#007bff' : 'grey')};
  font-weight: ${(props) => (props.active ? 'bold' : 'normal')};
  font-size: 15px;
  cursor: pointer;
`;

const TabContent = styled.div`
  width: 100%;
  margin-top: 15px;
`;

export default NoticeAndInquiryTabs;
