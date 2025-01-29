import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import axiosInstance from '../../services/axiosInstance';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

const PartyDetail = ({ partyId, onBack, onEdit }) => {
  const [partyDetails, setPartyDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPartyDetails();
  }, [partyId]);

  const fetchPartyDetails = async () => {
    try {
      const response = await axiosInstance.get(`/parties/${partyId}`);
      setPartyDetails(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch party details:', error);
      setLoading(false);
      onBack();
    }
  };

  const handleJoinParty = async () => {
    try {
      await axiosInstance.post(`/parties/${partyId}/join`);
      alert("파티에 성공적으로 참여하였습니다");
      fetchPartyDetails();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'An error occurred';
      alert(errorMessage);
    }
  };

  const handleLeaveParty = async () => {
    const confirmLeave = window.confirm("정말로 파티에서 나가시겠습니까?");
    if (!confirmLeave) return; 
  
    try {
      await axiosInstance.delete(`/parties/${partyId}/participants/me`);
      alert("파티에서 성공적으로 나갔습니다.");
      fetchPartyDetails(); 
    } catch (error) {
      const errorMessage = error.response?.data?.message || "An error occurred";
      alert(errorMessage);
    }
  };

  const handleCloseParty = async () => {
    const confirmClose = window.confirm("정말로 파티를 마감하시겠습니까?");
    if (!confirmClose) return; 
  
    try {
      await axiosInstance.post(`/parties/${partyId}`);
      alert("파티가 성공적으로 마감되었습니다.");
      fetchPartyDetails(); 
    } catch (error) {
      const errorMessage = error.response?.data?.message || "파티 마감에 실패했습니다.";
      alert(errorMessage);
    }
  };

  const handleDeleteParty = async () => {
    const confirmClose = window.confirm("정말로 파티를 삭제제하시겠습니까?");
    if (!confirmClose) return; 
  
    try {
      await axiosInstance.delete(`/parties/${partyId}`);
      alert("파티가 성공적으로 삭제되었습니다.");
      onBack();
    } catch (error) {
      const errorMessage = error.response?.data?.message || "파티 삭제에 실패했습니다.";
      alert(errorMessage);
    }
  };

  const formatToKoreanDate = (isoDate) => {
    return format(new Date(isoDate), "yyyy-MM-dd a hh시 mm분", { locale: ko });
  }

  if (loading) return <LoadingContainer>loading...</LoadingContainer>;
  if (!partyDetails) return null;

  return (
    <Container>
      <ContentSection>
        <PartyTitle>
          {partyDetails.title}
          <StatusBadge closed={partyDetails.closed}>
            {partyDetails.closed ? '마감' : '모집중'}
          </StatusBadge>
        </PartyTitle>

        <DetailGrid>
          <DetailItem>
            <i className="fa-solid fa-map-marker-alt"></i>
            {partyDetails.district}
          </DetailItem>
          <DetailItem>
            <i className="fa-solid fa-calendar-alt"></i>
            {formatToKoreanDate(partyDetails.meetingDate)}
          </DetailItem>
          <DetailItem>
            <i className="fa-solid fa-users"></i>
            {partyDetails.currentCount} / {partyDetails.maxCapacity}명
          </DetailItem>
        </DetailGrid>

        <PartyDescription>{partyDetails.content}</PartyDescription>

        <HostSection>
          <ParticipantsContainer>
            <ParticipantCardInline>
              <ParticipantImage 
                src={partyDetails.hostProfileImage || '/default-profile.png'} 
                alt={partyDetails.hostNickname} 
              />
              <CrownIcon className="fa-solid fa-crown"></CrownIcon>
              <HostName>{partyDetails.hostNickname}</HostName>
            </ParticipantCardInline>
            {partyDetails.participants.map(participant => (
              <ParticipantCardInline key={participant.participantUserId}>
                <ParticipantImage 
                  src={participant.participantProfileImage || '/default-profile.png'} 
                  alt={participant.participantNickname} 
                />
                <ParticipantName>{participant.participantNickname}</ParticipantName>
              </ParticipantCardInline>
            ))}
          </ParticipantsContainer>
        </HostSection>

        {partyDetails.host ? (
          <HostButtons>
            {!partyDetails.closed && (
              <>
                <Button onClick={onEdit}>  
                  수정하기
                </Button>
                <Button onClick={handleCloseParty}>
                  마감하기
                </Button>
              </>
            )}
            <Button 
              backgroundColor="#ff4d4d" color="white" hoverColor="#cc0000" 
              onClick={handleDeleteParty}
            >
              삭제하기
            </Button>
          </HostButtons>
        ) : (
          <>
            {!partyDetails.closed && (
              <ParticipantButtons>
                {partyDetails.participant ? (
                  <Button 
                    backgroundColor="#ff4d4d" color="white" hoverColor="#cc0000"
                    onClick={handleLeaveParty}
                  >
                    모임 나가기
                  </Button>
                ) : (
                  <Button 
                    backgroundColor="#0066CC" color="white" hoverColor="#005bb5" 
                    onClick={handleJoinParty}
                  >
                    모임 참여하기
                  </Button>
                )}
              </ParticipantButtons>
            )}
          </>
        )}
      </ContentSection>
      <Divider />
    </Container>
  );
};

const Container = styled.div`
  margin: 0 auto;
  position: relative;
`;

const ContentSection = styled.div`
  padding: 20px;
`;

const PartyTitle = styled.div`
  margin: 10px 0;
  font-size: 20px;
  font-weight: 700;
  text-align: left;
`;

const StatusBadge = styled.span`
  margin-left: 10px;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
  background-color: ${(props) => (props.closed ? '#f5f5f5' : '#EBF5FF')};
  color: ${(props) => (props.closed ? '#666' : '#0066CC')};
`;

const DetailGrid = styled.div`
  margin: 20px 8px 15px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
  font-size: 14px;
`;

const HostSection = styled.div`
  margin-bottom: 20px;
`;

const HostName = styled.span`
  text-align: center;
  font-size: 12px;
  font-weight: bold;
  color: #007bff;
`;

const ParticipantsContainer = styled.div`
  padding: 10px 0;
  display: flex;
  gap: 8px;
  overflow-x: auto;

  scrollbar-width: none; /* Firefox에서 스크롤바 숨기기 */
  -ms-overflow-style: none; /* IE에서 스크롤바 숨기기 */
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari에서 스크롤바 숨기기 */
  }
`;

const ParticipantCardInline = styled.div`
  min-width: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

const ParticipantImage = styled.img`
  width: 40px;
  height: 40px;
  margin-bottom: 5px;
  border-radius: 50%;
  object-fit: cover;
`;

const CrownIcon = styled.i`
  padding: 2px;
  border-radius: 50%;
  position: absolute;
  top: 0;
  right: 0;
  font-size: 15px;
  color: gold;
  background-color: white;
`;

const ParticipantName = styled.span`
  font-size: 12px;
  text-align: center;
`;

const PartyDescription = styled.p`
  margin: 25px 0;
  text-align: left;
  line-height: 1.6;
  color: #333;
`;

const HostButtons = styled.div`
  padding: 20px 3px;
  display: flex;
  justify-content: space-between;
  gap: 12px;
`;

const ParticipantButtons = styled.div`
  padding: 20px 3px;
  display: flex;
  justify-content: space-between;
  gap: 12px;
`;

const Button = styled.button`
  padding: 12px;
  border: none;
  border-radius: 8px;
  background-color: ${(props) => props.backgroundColor || '#f1f1f1'};
  color: ${(props) => props.color || '#333'};
  font-size: 14px;
  font-weight: 600;
  transition: background-color 0.2s ease;
  cursor: pointer;
  flex: 1;

  &:hover {
    background-color: ${(props) => props.hoverColor || '#cfcfcf'};
  }
`;

const LoadingContainer = styled.div`
  text-align: center;
  padding: 48px 0;
  color: #666;
  font-size: 16px;
`;

const Divider = styled.div`
  width: 100%;
  height: 13px; 
  margin: 10px 0; 
  background-color: #f8f9fa; 
`;

export default PartyDetail;
