import React, { useState } from 'react';
import styled from 'styled-components';
import Parties from '../components/parties/Parties';
import PartyDetail from '../components/parties/PartyDetail';
import PartyCreate from '../components/parties/PartyCreate';
import PartyEdit from '../components/parties/PartyEdit';

const PartyTab = () => {
  const [activeTab, setActiveTab] = useState('parties'); 
  const [selectedPartyId, setSelectedPartyId] = useState(null); 
  const [showCreateForm, setShowCreateForm] = useState(false); 
  const [showEditForm, setShowEditForm] = useState(false);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setSelectedPartyId(null);
    setShowCreateForm(false);
    setShowEditForm(false);
  };

  const handleCreateParty = () => {
    setShowCreateForm(true);
    setActiveTab(null); 
  };

  return (
    <TabPageContainer>
      <TabHeader>
        <TabItem
          active={activeTab === 'parties'}
          onClick={() => { handleTabClick('parties'); setSelectedPartyId(null); }}
        >
          파티
        </TabItem>
        <TabItem
          active={activeTab === 'joinedParties'}
          onClick={() => { handleTabClick('joinedParties'); setSelectedPartyId(null); }}
        >
          참여한 파티
        </TabItem>
        <TabItem
          active={activeTab === 'myParties'}
          onClick={() => { handleTabClick('myParties'); setSelectedPartyId(null); }}
        >
          내 파티
        </TabItem>
      </TabHeader>

      <TabContent>
        {showCreateForm ? (
          <PartyCreate onCancel={() => setShowCreateForm(false)} />
        ) : showEditForm ? (
          <PartyEdit 
            partyId={selectedPartyId}
            onCancel={() => {
              setShowEditForm(false);
              setSelectedPartyId(null);
            }}
          />
        ) : selectedPartyId ? (
          <PartyDetail
            partyId={selectedPartyId}
            onBack={() => setSelectedPartyId(null)} 
            onEdit={() => setShowEditForm(true)}
          />
        ) : (
          <Parties 
            onPartyClick={(partyId) => { setSelectedPartyId(partyId); setActiveTab(null);}} 
            onCreateParty={handleCreateParty}
            partyType={
              activeTab === 'parties' ? 'all' : 
              activeTab === 'joinedParties' ? 'joined' : 
              activeTab === 'myParties' ? 'my' : 'all'
            } 
          />
        )}
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

export default PartyTab;
